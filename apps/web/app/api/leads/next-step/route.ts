import { NextResponse } from "next/server"
import { clientIdentifier, rateLimit } from "@/lib/rate-limit"

const ALLOWED_NEXT_STEPS = new Set([
  "Schedule a consultation",
  "Have Debra contact me",
  "Email my results",
  "Send me NACA information",
  "I’m just researching",
])

// A deliberately permissive shape check: one @, something either side, a dot
// in the domain, no whitespace. It rejects the values the client-side
// `type="email"` was the only thing catching ("x", "@") without pretending to
// decide whether a well-formed address is deliverable.
const EMAIL = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/

function text(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : ""
}

function record(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object") return {}
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([, item]) => typeof item === "string")
      .map(([key, item]) => [key, text(item, 160)]),
  )
}

export async function POST(request: Request) {
  const raw = await request.json().catch(() => null)
  if (!raw || typeof raw !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 })
  }

  const body = raw as Record<string, unknown>
  if (text(body.website)) return NextResponse.json({ ok: true }, { status: 200 })

  // The honeypot and the elapsed-time check below are both client-controlled,
  // so neither survives a replayed request. This is the boundary the caller
  // cannot set. See lib/rate-limit.ts for what it does and does not cover.
  const limit = rateLimit("leads:next-step", clientIdentifier(request), { limit: 5, windowMs: 60_000 })
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Please wait a moment and try again." },
      { status: 429, headers: { "retry-after": String(limit.retryAfter) } },
    )
  }

  const startedAt = Number(body.startedAt)
  if (Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < 1500) {
    return NextResponse.json({ ok: false, error: "Please review the form and try again." }, { status: 429 })
  }

  const firstName = text(body.firstName, 80)
  const email = text(body.email, 180)
  const mobile = text(body.mobile, 40)
  const preferredNextStep = text(body.preferredNextStep, 80)

  if (!firstName || !email || !ALLOWED_NEXT_STEPS.has(preferredNextStep)) {
    return NextResponse.json({ ok: false, error: "Complete the required fields to continue." }, { status: 400 })
  }

  // Validated here as well as in the browser: `type="email"` is bypassable,
  // and an unusable address forwarded to the webhook becomes a lead Debra
  // cannot answer.
  if (!EMAIL.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Enter an email address Debra can reply to." },
      { status: 400 },
    )
  }

  const webhookUrl = process.env.NEXT_STEP_LEAD_WEBHOOK_URL
  if (!webhookUrl) {
    return NextResponse.json(
      { ok: false, error: "Online lead delivery is not configured yet. Please use the consultation page." },
      { status: 503 },
    )
  }

  const payload = {
    firstName,
    email,
    mobile,
    preferredNextStep,
    selectedPath: text(body.selectedPath, 80),
    resultKey: text(body.resultKey, 80),
    source: "Find My Next Step",
    landingIntent: text(body.landingIntent, 80),
    attribution: record(body.attribution),
    submittedAt: new Date().toISOString(),
    pageUrl: text(body.pageUrl, 500),
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
      return NextResponse.json(
        { ok: false, error: "Lead delivery is temporarily unavailable. Please use the consultation page." },
        { status: 502 },
      )
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch {
    return NextResponse.json(
      { ok: false, error: "Lead delivery is temporarily unavailable. Please use the consultation page." },
      { status: 502 },
    )
  }
}