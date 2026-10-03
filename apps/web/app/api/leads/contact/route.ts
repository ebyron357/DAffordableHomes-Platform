import { NextResponse } from "next/server"
import { crmContactFields, deliverLead, leadWebhookUrl } from "@/lib/lead-delivery"
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
 * Destination: `LEAD_WEBHOOK_URL`, then the program webhook variables, so an
 * owner who sets only the GoHighLevel program webhook still receives these
 * messages. The order and the payload's common fields live in
 * lib/lead-delivery.ts.
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

  // LEAD_WEBHOOK_URL, then the program webhooks. A set-but-empty variable
  // falls through; see lib/lead-delivery.ts.
  const webhookUrl = leadWebhookUrl("contact")
  if (!webhookUrl) {
    return NextResponse.json({ ok: false, error: NOT_CONFIGURED }, { status: 503 })
  }

  const payload = {
    ...crmContactFields({
      leadType: context === "consultation" ? "consultation" : "contact",
      fullName: name,
      email,
      phone,
    }),
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

  if (!(await deliverLead(webhookUrl, payload))) {
    return NextResponse.json({ ok: false, error: UNAVAILABLE }, { status: 502 })
  }
  return NextResponse.json({ ok: true }, { status: 200 })
}
