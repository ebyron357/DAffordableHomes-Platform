import { NextResponse } from "next/server"
import type { ProgramSlug } from "@/lib/programs"
import {
  cleanText,
  deliverLead,
  isPlausiblePhone,
  isRateLimited,
  isTrustedRequestOrigin,
  isValidEmail,
  wasSubmittedTooQuickly,
} from "@/lib/leads/server"

const ALLOWED_PROGRAMS = new Set<ProgramSlug>(["naca", "homes-for-heroes"])
const SOURCE_BY_PROGRAM: Record<ProgramSlug, string> = {
  naca: "NACA Landing Page",
  "homes-for-heroes": "Homes for Heroes Landing Page",
}

function isProgram(value: unknown): value is ProgramSlug {
  return typeof value === "string" && ALLOWED_PROGRAMS.has(value as ProgramSlug)
}

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
  if (!isProgram(body.program)) {
    return NextResponse.json({ ok: false, error: "Invalid program." }, { status: 400 })
  }

  if (cleanText(body.website)) {
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  if (wasSubmittedTooQuickly(body.startedAt)) {
    return NextResponse.json({ ok: false, error: "Please review the form and try again." }, { status: 429 })
  }

  const firstName = cleanText(body.firstName, 80)
  const lastName = cleanText(body.lastName, 80)
  const email = cleanText(body.email, 180)
  const phone = cleanText(body.phone, 40)
  const consent = body.consent === true

  if (!firstName || !lastName || !isValidEmail(email) || !isPlausiblePhone(phone) || !consent) {
    return NextResponse.json(
      { ok: false, error: "Complete all required fields and provide contact consent." },
      { status: 400 },
    )
  }

  const webhookUrl = process.env.PROGRAM_LEAD_WEBHOOK_URL ?? process.env.GHL_PROGRAM_LEAD_WEBHOOK_URL
  if (!webhookUrl) {
    return NextResponse.json(
      {
        ok: false,
        error: "Online lead delivery is not configured yet. Please try again later.",
      },
      { status: 503 },
    )
  }

  const program = body.program
  const payload = {
    firstName,
    lastName,
    email,
    phone,
    program,
    source: SOURCE_BY_PROGRAM[program],
    sourcePage: cleanText(body.sourcePage, 240),
    campaign: cleanText(body.utmCampaign, 160) || "organic",
    submittedAt: new Date().toISOString(),
    pageUrl: cleanText(body.pageUrl, 500),
    referrer: cleanText(body.referrer, 500),
    utmSource: cleanText(body.utmSource, 160),
    utmMedium: cleanText(body.utmMedium, 160),
    utmCampaign: cleanText(body.utmCampaign, 160),
    utmContent: cleanText(body.utmContent, 160),
    utmTerm: cleanText(body.utmTerm, 160),
    currentCity: cleanText(body.currentCity, 120),
    desiredCity: cleanText(body.desiredCity, 120),
    desiredZip: cleanText(body.desiredZip, 20),
    timeline: cleanText(body.timeline, 120),
    preferredContactMethod: cleanText(body.preferredContactMethod, 80),
    intent: cleanText(body.intent, 80),
    programStage: cleanText(body.programStage, 160),
    serviceCategory: cleanText(body.serviceCategory, 160),
    questions: cleanText(body.questions, 2000),
    consent,
  }

  const result = await deliverLead(webhookUrl, payload)
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: result.status })
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
