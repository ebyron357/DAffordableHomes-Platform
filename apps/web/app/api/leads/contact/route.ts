import { NextResponse } from "next/server"
import { isValidEmail } from "@/lib/lead-validation"
import { clientIdentifier, rateLimit } from "@/lib/rate-limit"

/**
 * The message form on /contact and /consultation.
 *
 * Until this existed the form validated, waited 400ms and told the visitor it
 * was not connected — on the page every "Schedule a Consultation" button opens,
 * and the page both other lead endpoints send visitors to when they cannot
 * deliver. It follows the same contract as /api/leads/next-step and
 * /api/leads/program: honeypot, per-caller rate limit, elapsed-time check,
 * server-side validation, and an honest 503 when no destination is configured.
 *
 * Destination: `LEAD_WEBHOOK_URL`, the general lead webhook `.env.example`
 * already documented, then the program webhook variables — the same order the
 * retired root `api/consultation.js` used, so an owner who sets only the
 * GoHighLevel program webhook still receives these messages.
 */

const CONNECTIONS = new Set(["", "Phone or video call", "Email"])
const STAGES = new Set([
  "",
  "Exploring whether buying is right for me",
  "Preparing finances and documents",
  "Ready to begin a home search",
  "Already touring or making offers",
])

function text(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : ""
}

const NOT_CONFIGURED =
  "Online messages are not connected yet, so this was not sent. Nothing you typed has been stored."
const UNAVAILABLE = "Message delivery is temporarily unavailable. Please try again in a few minutes."

export async function POST(request: Request) {
  const raw = await request.json().catch(() => null)
  if (!raw || typeof raw !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 })
  }

  const body = raw as Record<string, unknown>
  if (text(body.website)) return NextResponse.json({ ok: true }, { status: 200 })

  // The honeypot and elapsed-time check are client-controlled; this is the
  // boundary a replayed request cannot set. See lib/rate-limit.ts.
  const limit = rateLimit("leads:contact", clientIdentifier(request), { limit: 5, windowMs: 60_000 })
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

  const context = body.context === "consultation" ? "consultation" : "general"
  const name = text(body.name, 120)
  const email = text(body.email, 180)
  const message = text(body.message, 3000)
  const phone = text(body.phone, 40)
  const preferredConnection = text(body.preferredConnection, 40)
  const buyerStage = text(body.buyerStage, 80)

  if (!name || !email || !message || !CONNECTIONS.has(preferredConnection) || !STAGES.has(buyerStage)) {
    return NextResponse.json({ ok: false, error: "Complete the required fields to continue." }, { status: 400 })
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "Enter an email address Debra can reply to." },
      { status: 400 },
    )
  }

  // `||`, not `??`: a variable that is set but empty must fall through.
  const webhookUrl =
    process.env.LEAD_WEBHOOK_URL || process.env.PROGRAM_LEAD_WEBHOOK_URL || process.env.GHL_PROGRAM_LEAD_WEBHOOK_URL
  if (!webhookUrl) {
    return NextResponse.json({ ok: false, error: NOT_CONFIGURED }, { status: 503 })
  }

  const payload = {
    name,
    email,
    phone,
    preferredConnection,
    buyerStage,
    message,
    source: context === "consultation" ? "Consultation request" : "Contact form",
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
      return NextResponse.json({ ok: false, error: UNAVAILABLE }, { status: 502 })
    }
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch {
    return NextResponse.json({ ok: false, error: UNAVAILABLE }, { status: 502 })
  }
}
