"use client"

import Link from "next/link"
import { useEffect, useId, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Notice } from "@/components/states/notice"
import { FORM_PRIVACY } from "@/lib/content/conversion"
import type { ProgramSlug } from "@/lib/programs"

type FormStatus = "idle" | "submitting" | "success" | "error"

const inputClass =
  "min-h-12 w-full rounded-md border border-input bg-card px-4 py-2.5 text-sm text-foreground"

function getText(formData: FormData, name: string): string {
  const value = formData.get(name)
  return typeof value === "string" ? value : ""
}

export function ProgramLeadForm({
  program,
  leadSource,
  cta,
}: {
  program: ProgramSlug
  leadSource: string
  cta: string
}) {
  const formId = useId()
  const errorId = `${formId}-error`
  const [startedAt] = useState(() => Date.now())
  const [status, setStatus] = useState<FormStatus>("idle")
  const [message, setMessage] = useState("")
  // The success message replaces the form; move focus to it so keyboard and
  // screen-reader users are not left on a button that no longer exists.
  const successRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (status === "success") successRef.current?.focus()
  }, [status])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget

    if (!form.checkValidity()) {
      setStatus("error")
      setMessage("Complete the required fields before submitting.")
      form.reportValidity()
      return
    }

    const formData = new FormData(form)
    const params = new URLSearchParams(window.location.search)
    const payload = {
      program,
      sourcePage: leadSource,
      startedAt,
      website: getText(formData, "website"),
      firstName: getText(formData, "firstName"),
      lastName: getText(formData, "lastName"),
      email: getText(formData, "email"),
      phone: getText(formData, "phone"),
      currentCity: getText(formData, "currentCity"),
      desiredCity: getText(formData, "desiredCity"),
      desiredZip: getText(formData, "desiredZip"),
      timeline: getText(formData, "timeline"),
      preferredContactMethod: getText(formData, "preferredContactMethod"),
      intent: program === "naca" ? "buying" : getText(formData, "intent"),
      programStage: getText(formData, "programStage"),
      serviceCategory: getText(formData, "serviceCategory"),
      questions: getText(formData, "questions"),
      consent: formData.get("consent") === "yes",
      pageUrl: window.location.href,
      referrer: document.referrer,
      utmSource: params.get("utm_source") ?? "",
      utmMedium: params.get("utm_medium") ?? "",
      utmCampaign: params.get("utm_campaign") ?? "",
      utmContent: params.get("utm_content") ?? "",
      utmTerm: params.get("utm_term") ?? "",
    }

    setStatus("submitting")
    setMessage("")

    try {
      const response = await fetch("/api/leads/program", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      })
      const result = (await response.json().catch(() => null)) as { error?: string } | null

      if (!response.ok) {
        setStatus("error")
        setMessage(result?.error ?? "The form could not be delivered. Please use the consultation page.")
        return
      }

      form.reset()
      setStatus("success")
    } catch {
      setStatus("error")
      setMessage("The form could not be delivered. Please use the consultation page.")
    }
  }

  if (status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} className="outline-none">
        {program === "naca" ? (
          <Notice tone="success" title="Thank you — Debra has your NACA details">
            <p>
              Because you shared your NACA stage, location and timing, she can start where you actually are instead of
              from scratch, and she&apos;ll follow up the way you asked to be contacted.
            </p>
            <p className="mt-2">
              Haven&apos;t been to a NACA Homebuyer Workshop yet? That&apos;s NACA&apos;s first step, and you can sign
              up on naca.com. Questions about qualification or your mortgage stay with your NACA counselor; questions
              about homes, neighborhoods, offers and inspections are Debra&apos;s.
            </p>
          </Notice>
        ) : (
          <Notice tone="success" title="Thank you — Debra has your details">
            <p>
              She&apos;ll follow up the way you asked to be contacted, starting from your role and whether you&apos;re
              buying, selling or both.
            </p>
            <p className="mt-2">
              If you&apos;re also looking at TSAHC&apos;s Homes for Texas Heroes loan program, a participating lender
              confirms eligibility; Debra handles the real-estate side either way.
            </p>
          </Notice>
        )}
      </div>
    )
  }

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      noValidate
      className="grid gap-5"
      aria-describedby={status === "error" ? errorId : undefined}
    >
      {status === "error" && (
        <Notice tone="warning" title="The request was not sent">
          <p id={errorId} role="alert">{message}</p>
          <p className="mt-2"><a href="/consultation" className="font-semibold text-primary underline">Use the main consultation page</a>.</p>
        </Notice>
      )}

      <p className="text-sm leading-6 text-muted-foreground">
        Only your name, email and phone are required. Everything else just helps Debra start where you are.
      </p>

      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`${formId}-website`}>Website</label>
        <input id={`${formId}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium" htmlFor={`${formId}-first-name`}>
          First name <span aria-hidden="true" className="text-destructive">*</span>
          <input id={`${formId}-first-name`} name="firstName" required autoComplete="given-name" className={inputClass} />
        </label>
        <label className="grid gap-2 text-sm font-medium" htmlFor={`${formId}-last-name`}>
          Last name <span aria-hidden="true" className="text-destructive">*</span>
          <input id={`${formId}-last-name`} name="lastName" required autoComplete="family-name" className={inputClass} />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium" htmlFor={`${formId}-email`}>
          Email <span aria-hidden="true" className="text-destructive">*</span>
          <input id={`${formId}-email`} name="email" type="email" required autoComplete="email" className={inputClass} />
        </label>
        {/* The help text sits outside the label so it is announced once, as a
            description, rather than folded into the field's name. */}
        <div className="grid gap-2">
          <label className="grid gap-2 text-sm font-medium" htmlFor={`${formId}-phone`}>
            Phone <span aria-hidden="true" className="text-destructive">*</span>
            <input
              id={`${formId}-phone`}
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              aria-describedby={`${formId}-phone-help`}
              className={inputClass}
            />
          </label>
          <p id={`${formId}-phone-help`} className="text-xs leading-relaxed text-muted-foreground">
            So Debra can reach you the way you prefer. Used only to reply about this request.
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <label className="grid gap-2 text-sm font-medium" htmlFor={`${formId}-current-city`}>
          Current city
          <input id={`${formId}-current-city`} name="currentCity" autoComplete="address-level2" className={inputClass} />
        </label>
        <label className="grid gap-2 text-sm font-medium" htmlFor={`${formId}-desired-city`}>
          Desired city
          <input id={`${formId}-desired-city`} name="desiredCity" className={inputClass} />
        </label>
        <label className="grid gap-2 text-sm font-medium" htmlFor={`${formId}-desired-zip`}>
          Desired ZIP code
          <input id={`${formId}-desired-zip`} name="desiredZip" inputMode="numeric" autoComplete="postal-code" className={inputClass} />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium" htmlFor={`${formId}-timeline`}>
          Estimated timeline
          <select id={`${formId}-timeline`} name="timeline" className={inputClass} defaultValue="">
            <option value="">Choose a timeframe</option>
            <option>0–3 months</option>
            <option>3–6 months</option>
            <option>6–12 months</option>
            <option>More than 12 months</option>
            <option>Still exploring</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium" htmlFor={`${formId}-contact-method`}>
          Preferred contact method
          <select id={`${formId}-contact-method`} name="preferredContactMethod" className={inputClass} defaultValue="">
            <option value="">Choose a method</option>
            <option>Phone</option>
            <option>Text</option>
            <option>Email</option>
          </select>
        </label>
      </div>

      {program === "naca" ? (
        <label className="grid gap-2 text-sm font-medium" htmlFor={`${formId}-program-stage`}>
          Where are you in the NACA process?
          <select id={`${formId}-program-stage`} name="programStage" className={inputClass} defaultValue="">
            <option value="">Choose the closest answer</option>
            <option>Researching NACA</option>
            <option>Workshop scheduled</option>
            <option>Workshop attended</option>
            <option>Working toward qualification</option>
            <option>NACA-qualified and preparing to search</option>
          </select>
        </label>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium" htmlFor={`${formId}-service-category`}>
            Hero profession or service category
            <select id={`${formId}-service-category`} name="serviceCategory" className={inputClass} defaultValue="">
              <option value="">Choose a category</option>
              <option>Active-duty military</option>
              <option>Veteran</option>
              <option>Teacher or education professional</option>
              <option>Healthcare professional</option>
              <option>Firefighter</option>
              <option>EMS professional</option>
              <option>Law-enforcement professional</option>
              <option>Other or unsure</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium" htmlFor={`${formId}-intent`}>
            Are you buying, selling, or both?
            <select id={`${formId}-intent`} name="intent" className={inputClass} defaultValue="">
              <option value="">Choose one</option>
              <option>Buying</option>
              <option>Selling</option>
              <option>Buying and selling</option>
              <option>Still deciding</option>
            </select>
          </label>
        </div>
      )}

      <label className="grid gap-2 text-sm font-medium" htmlFor={`${formId}-questions`}>
        Additional questions
        <textarea id={`${formId}-questions`} name="questions" rows={5} className={inputClass} />
      </label>

      <label className="flex items-start gap-3 text-sm leading-6" htmlFor={`${formId}-consent`}>
        <input id={`${formId}-consent`} name="consent" value="yes" type="checkbox" required className="mt-1 size-5" />
        <span>I consent to be contacted by D&apos;Affordable Homes about my real-estate request. <span aria-hidden="true" className="text-destructive">*</span></span>
      </label>

      <div>
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : cta}
        </Button>
        {/*
          Same boundary as before — nothing is guaranteed — said so that it
          reassures rather than warns at the moment someone decides to send.
        */}
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          Sending this doesn&apos;t commit you to anything. Eligibility, approval, savings and outcomes are decided by
          the program and your lender, and aren&apos;t guaranteed.
        </p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {FORM_PRIVACY}{" "}
          <Link href="/privacy" className="font-medium text-primary underline">
            Privacy policy
          </Link>
        </p>
      </div>
    </form>
  )
}
