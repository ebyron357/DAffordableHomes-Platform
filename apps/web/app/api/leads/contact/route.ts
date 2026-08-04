import { NextResponse } from "next/server"
import {
  cleanText,
  deliverLead,
  isRateLimited,
  isTrustedRequestOrigin,
  isValidEmail,
  wasSubmittedTooQuickly,
} from "@/lib/leads/server"

const ALLOWED_CONTEXTS = new Set(["general", "consultation"])

export async function POST(request: Request) {
  if (!isTrustedRequestOrigin(request)) {
    return NextResponse.json({ ok: false, error: "Invalid request origin." }, { status: 403 })
  }

  if (isRateLimited(request)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please wait before trying again." },
      { status: 429 },
    )
  }

  const raw = await request.json().catch(() => null)
  if (!raw || typeof raw !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 })
  }

  const body = raw as Record<string, unknown>
  if (cleanText(body.website)) {
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  if (wasSubmittedTooQuickly(body.startedAt)) {
    return NextResponse.json({ ok: false, error: "Please review the form and try again." }, { status: 429 })
  }

  const context = cleanText(body.context, 40)
  const name = cleanText(body.name, 160)
  const email = cleanText(body.email, 180)
  const phone = cleanText(body.phone, 40)
  const message = cleanText(body.message, 2000)
  const consent = body.consent === true

  if (!ALLOWED_CONTEXTS.has(context) || !name || !isValidEmail(email) || !message || !consent) {
    return NextResponse.json(
      { ok: false, error: "Complete all required fields with a valid email and provide contact consent." },
      { status: 400 },
    )
  }

  const result = await deliverLead(
    process.env.CONTACT_LEAD_WEBHOOK_URL ?? process.env.GHL_CONTACT_LEAD_WEBHOOK_URL,
    {
      name,
      email,
      phone,
      message,
      context,
      source: context === "consultation" ? "Consultation Page" : "Contact Page",
      buyerStage: cleanText(body.buyerStage, 160),
      preferredConnection: cleanText(body.preferredConnection, 80),
      pageUrl: cleanText(body.pageUrl, 500),
      referrer: cleanText(body.referrer, 500),
      submittedAt: new Date().toISOString(),
      consent,
    },
  )

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: result.status })
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
