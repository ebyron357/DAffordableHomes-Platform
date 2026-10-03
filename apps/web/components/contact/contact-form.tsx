"use client"

import Link from "next/link"
import { useEffect, useId, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Notice } from "@/components/states/notice"
import { CONSULTATION_TERMS, FORM_PRIVACY } from "@/lib/content/conversion"

type Status = "idle" | "invalid" | "submitting" | "success" | "error" | "unavailable"

function field(form: FormData, name: string): string {
  const value = form.get(name)
  return typeof value === "string" ? value : ""
}

export function ContactForm({
  context = "general",
  calendarAvailable = false,
}: {
  context?: "general" | "consultation"
  /** True when /consultation shows the booking calendar above this form. */
  calendarAvailable?: boolean
}) {
  const nameId = useId()
  const emailId = useId()
  const phoneId = useId()
  const stageId = useId()
  const connectionId = useId()
  const messageId = useId()
  const phoneHelpId = useId()
  const messageHelpId = useId()
  const errId = useId()
  const honeypotId = useId()
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState("")
  const [startedAt] = useState(() => Date.now())
  // The success message replaces the form, taking the focused button with it.
  // Focus moves to the message so keyboard and screen-reader users land on it.
  const successRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (status === "success") successRef.current?.focus()
  }, [status])

  // Posts to /api/leads/contact. Success is shown only when the server says the
  // message was delivered; a 503 (no destination configured) keeps the honest
  // "not connected" notice rather than pretending it was sent.
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.checkValidity()) {
      setStatus("invalid")
      form.reportValidity()
      return
    }

    const data = new FormData(form)
    setStatus("submitting")
    setError("")

    try {
      const response = await fetch("/api/leads/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          context,
          startedAt,
          website: field(data, "website"),
          name: field(data, "name"),
          email: field(data, "email"),
          phone: field(data, "phone"),
          preferredConnection: field(data, "preferredConnection"),
          buyerStage: field(data, "buyerStage"),
          message: field(data, "message"),
          pageUrl: window.location.href,
        }),
      })
      const result = (await response.json().catch(() => null)) as { error?: string } | null

      if (response.ok) {
        form.reset()
        setStatus("success")
      } else if (response.status === 503) {
        setStatus("unavailable")
      } else {
        setStatus("error")
        setError(result?.error ?? "Your message could not be sent. Please try again.")
      }
    } catch {
      setStatus("error")
      setError("Your message could not be sent. Please check your connection and try again.")
    }
  }

  if (status === "success") {
    const [cost, commitment] = CONSULTATION_TERMS
    return (
      <div ref={successRef} tabIndex={-1} className="outline-none">
        {context === "consultation" ? (
          <Notice tone="success" title="Thank you — your consultation request is in">
            <p>Here&apos;s what happens next:</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>Debra reads your request herself.</li>
              <li>She replies using the contact details you gave, to find a time that suits you.</li>
              <li>
                You talk it through by phone or video call. {cost}, and {commitment.toLowerCase()}.
              </li>
            </ol>
            {calendarAvailable && (
              <p className="mt-3">Prefer to pick a time yourself? Use the booking calendar above.</p>
            )}
            <p className="mt-3">
              There&apos;s nothing else you need to do right now. While you wait:{" "}
              <Link href="/calculators/mortgage-payment" className="font-semibold text-primary underline">
                estimate a monthly payment
              </Link>{" "}
              or{" "}
              <Link href="/first-time-buyers" className="font-semibold text-primary underline">
                read the steps to buying a house
              </Link>
              .
            </p>
          </Notice>
        ) : (
          <Notice tone="success" title="Thank you — your message is with Debra">
            <p>
              She reads every message herself and will reply to the email you gave. There&apos;s nothing else you need
              to do.
            </p>
            <p className="mt-2">
              If it turns into a bigger conversation, you can{" "}
              <Link href="/consultation" className="font-semibold text-primary underline">
                book a consultation
              </Link>{" "}
              at any time.
            </p>
          </Notice>
        )}
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5"
      aria-describedby={status === "invalid" || status === "error" ? errId : undefined}
    >
      {status === "invalid" && (
        <p id={errId} role="alert" className="text-sm font-medium text-destructive">
          Please complete the required fields so Debra can follow up.
        </p>
      )}
      {status === "error" && (
        <p id={errId} role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}

      {/* Honeypot: hidden from people and assistive technology, filled by bots. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor={honeypotId}>Website</label>
        <input id={honeypotId} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={nameId} className="text-sm font-medium text-foreground">
          Your name <span className="text-destructive">*</span>
        </label>
        <input
          id={nameId}
          name="name"
          type="text"
          required
          autoComplete="name"
          className="min-h-12 rounded-md border border-input bg-card px-4 py-2.5 text-sm text-foreground"
        />
      </div>

      {context === "consultation" && <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2"><label htmlFor={phoneId} className="text-sm font-medium text-foreground">Phone</label><input id={phoneId} name="phone" type="tel" autoComplete="tel" aria-describedby={phoneHelpId} className="min-h-12 rounded-md border border-input bg-card px-4 py-2.5 text-sm" /><p id={phoneHelpId} className="text-xs leading-relaxed text-muted-foreground">Optional. Add it if you&apos;d prefer a phone or video call.</p></div>
        <div className="flex flex-col gap-2"><label htmlFor={connectionId} className="text-sm font-medium text-foreground">Preferred way to connect</label><select id={connectionId} name="preferredConnection" className="min-h-12 rounded-md border border-input bg-card px-4 py-2.5 text-sm"><option>Phone or video call</option><option>Email</option></select></div>
      </div>}

      {context === "consultation" && <div className="flex flex-col gap-2"><label htmlFor={stageId} className="text-sm font-medium text-foreground">Where are you right now?</label><select id={stageId} name="buyerStage" className="min-h-12 rounded-md border border-input bg-card px-4 py-2.5 text-sm"><option value="">Choose the option that fits best</option><option>Exploring whether buying is right for me</option><option>Preparing finances and documents</option><option>Ready to begin a home search</option><option>Already touring or making offers</option></select></div>}

      <div className="flex flex-col gap-2">
        <label htmlFor={emailId} className="text-sm font-medium text-foreground">
          Email <span className="text-destructive">*</span>
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          required
          autoComplete="email"
          className="min-h-12 rounded-md border border-input bg-card px-4 py-2.5 text-sm text-foreground"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={messageId} className="text-sm font-medium text-foreground">
          {context === "consultation" ? "What would you like help with?" : "How can Debra help?"}{" "}
          <span className="text-destructive">*</span>
        </label>
        <p id={messageHelpId} className="text-xs leading-relaxed text-muted-foreground">
          {context === "consultation" ? (
            <>
              For example: &ldquo;We rent in Garland and want to know what to do first,&rdquo; or &ldquo;We went to a
              NACA workshop — what happens next?&rdquo;
            </>
          ) : (
            <>
              <strong className="font-semibold text-foreground">Selling?</strong>{" "}
              Include the property address and when you&apos;d like to move. <strong className="font-semibold text-foreground">Asking about a workshop?</strong>{" "}
              Say so, and Debra will let you know when the next date is confirmed.
            </>
          )}
        </p>
        <textarea
          id={messageId}
          name="message"
          required
          rows={5}
          aria-describedby={messageHelpId}
          className="rounded-md border border-input bg-card px-4 py-2.5 text-sm text-foreground"
        />
      </div>

      {status === "unavailable" ? (
        <Notice tone="info" title="Online messages aren't connected yet">
          <p>
            Your message was not sent, and nothing you typed has been stored. Online messages start working as soon as
            the site&apos;s message delivery is switched on.
          </p>
          <p className="mt-2">
            In the meantime, <a href="/start" className="font-semibold text-primary underline">find your next homebuying
            step</a> or <a href="/resources" className="font-semibold text-primary underline">browse the homebuyer
            guides</a>.
          </p>
        </Notice>
      ) : (
        <div>
          <Button type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending…" : context === "consultation" ? "Request consultation" : "Send message"}
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            {FORM_PRIVACY}{" "}
            <Link href="/privacy" className="font-medium text-primary underline">
              Privacy policy
            </Link>
          </p>
        </div>
      )}
    </form>
  )
}
