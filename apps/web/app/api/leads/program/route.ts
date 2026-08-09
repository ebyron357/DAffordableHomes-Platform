import { NextResponse } from "next/server"
import type { ProgramSlug } from "@/lib/programs"

const ALLOWED_PROGRAMS = new Set<ProgramSlug>(["fha", "va", "usda", "conventional", "naca", "homes-for-heroes"])
const SOURCE_BY_PROGRAM: Record<ProgramSlug, string> = {
  fha: "FHA Program Page",
  va: "VA Program Page",
  usda: "USDA Program Page",
  conventional: "Conventional Program Page",
  naca: "NACA Landing Page",
  "homes-for-heroes": "Homes for Heroes Landing Page",
}

function text(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : ""
}

function isProgram(value: unknown): value is ProgramSlug {
  return typeof value === "string" && ALLOWED_PROGRAMS.has(value as ProgramSlug)
}

export async function POST(request: Request) {
  const raw = await request.json().catch(() => null)
  if (!raw || typeof raw !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 })
  }

  const body = raw as Record<string, unknown>
  if (!isProgram(body.program)) {
    return NextResponse.json({ ok: false, error: "Invalid program." }, { status: 400 })
  }

  if (text(body.website)) {
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  const startedAt = Number(body.startedAt)
  if (Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < 2000) {
    return NextResponse.json({ ok: false, error: "Please review the form and try again." }, { status: 429 })
  }

  const firstName = text(body.firstName, 80)
  const lastName = text(body.lastName, 80)
  const email = text(body.email, 180)
  const phone = text(body.phone, 40)
  const consent = body.consent === true

  if (!firstName || !lastName || !email || !phone || !consent) {
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
        error: "Online lead delivery is not configured yet. Please use the main consultation page.",
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
    sourcePage: text(body.sourcePage, 240),
    campaign: text(body.utmCampaign, 160) || "organic",
    submittedAt: new Date().toISOString(),
    pageUrl: text(body.pageUrl, 500),
    referrer: text(body.referrer, 500),
    utmSource: text(body.utmSource, 160),
    utmMedium: text(body.utmMedium, 160),
    utmCampaign: text(body.utmCampaign, 160),
    utmContent: text(body.utmContent, 160),
    utmTerm: text(body.utmTerm, 160),
    currentCity: text(body.currentCity, 120),
    desiredCity: text(body.desiredCity, 120),
    desiredZip: text(body.desiredZip, 20),
    timeline: text(body.timeline, 120),
    preferredContactMethod: text(body.preferredContactMethod, 80),
    intent: text(body.intent, 80),
    programStage: text(body.programStage, 160),
    serviceCategory: text(body.serviceCategory, 160),
    questions: text(body.questions, 2000),
    consent,
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
