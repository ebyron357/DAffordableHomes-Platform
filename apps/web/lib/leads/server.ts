type RateLimitEntry = {
  count: number
  resetAt: number
}

type DeliveryResult =
  | { ok: true }
  | { ok: false; status: 502 | 503; error: string }

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 5
const rateLimits = new Map<string, RateLimitEntry>()

export function cleanText(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : ""
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function isPlausiblePhone(value: string): boolean {
  const digits = value.replace(/\D/g, "")
  return digits.length >= 7 && digits.length <= 15
}

export function isTrustedRequestOrigin(request: Request): boolean {
  const origin = request.headers.get("origin")
  if (!origin) return true

  try {
    return new URL(origin).host === new URL(request.url).host
  } catch {
    return false
  }
}

export function isRateLimited(request: Request): boolean {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  const key = forwardedFor || request.headers.get("x-real-ip") || "unknown"
  const now = Date.now()
  const current = rateLimits.get(key)

  if (!current || current.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  current.count += 1
  return current.count > RATE_LIMIT_MAX_REQUESTS
}

export function wasSubmittedTooQuickly(value: unknown): boolean {
  const startedAt = Number(value)
  return Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < 2000
}

export async function deliverLead(
  webhookUrl: string | undefined,
  payload: Record<string, unknown>,
): Promise<DeliveryResult> {
  if (!webhookUrl) {
    return {
      ok: false,
      status: 503,
      error: "Online delivery is not configured yet. Please try again later.",
    }
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    })

    if (!response.ok) {
      return {
        ok: false,
        status: 502,
        error: "Online delivery is temporarily unavailable. Please try again later.",
      }
    }

    return { ok: true }
  } catch {
    return {
      ok: false,
      status: 502,
      error: "Online delivery is temporarily unavailable. Please try again later.",
    }
  }
}
