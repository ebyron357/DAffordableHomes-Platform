/**
 * Fixed-window rate limiting for public endpoints.
 *
 * AGENTS.md §6 requires rate limiting and spam protection on public forms and
 * AI endpoints. The honeypot and the elapsed-time check on the lead form are
 * both client-controlled, so a replayed request bypasses them entirely; this
 * adds a boundary the caller cannot set.
 *
 * Scope, stated plainly: the counter lives in the process that serves the
 * request. On a platform that runs several instances it limits per instance,
 * not per deployment, and a cold start resets it. That is a real reduction in
 * replay volume from one client, not a guarantee across a fleet. A durable
 * store (Vercel KV, Upstash, or the edge middleware's own limiter) is the
 * production-grade version and needs provisioning the repository does not have;
 * until then this is the boundary, and it fails closed on the identifier it can
 * see rather than leaving the endpoint open.
 */

type Window = { count: number; resetAt: number }

const WINDOWS = new Map<string, Map<string, Window>>()

/** Entries are only swept when a bucket is touched, so an idle bucket cannot grow. */
function sweep(bucket: Map<string, Window>, now: number) {
  for (const [key, window] of bucket) {
    if (window.resetAt <= now) bucket.delete(key)
  }
}

export type RateLimitResult = {
  ok: boolean
  /** Seconds until the window resets; suitable for a Retry-After header. */
  retryAfter: number
}

export function rateLimit(
  name: string,
  identifier: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now()
  let bucket = WINDOWS.get(name)
  if (!bucket) {
    bucket = new Map()
    WINDOWS.set(name, bucket)
  }
  if (bucket.size > 500) sweep(bucket, now)

  const current = bucket.get(identifier)
  if (!current || current.resetAt <= now) {
    bucket.set(identifier, { count: 1, resetAt: now + windowMs })
    return { ok: true, retryAfter: 0 }
  }

  current.count += 1
  if (current.count > limit) {
    return { ok: false, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) }
  }
  return { ok: true, retryAfter: 0 }
}

/**
 * The caller's address as the platform reports it.
 *
 * `x-forwarded-for` is set by Vercel's proxy and is the value to trust there.
 * A request that arrives with no usable address is bucketed under one shared
 * key rather than being waved through, so an absent header cannot be used to
 * opt out of the limit.
 */
export function clientIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const first = forwarded?.split(",")[0]?.trim()
  if (first) return first
  return request.headers.get("x-real-ip")?.trim() || "unknown"
}
