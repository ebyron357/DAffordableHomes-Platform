"use client"

import { useId, useState } from "react"
import { Button } from "@/components/ui/button"
import { Notice } from "@/components/states/notice"

type Status = "idle" | "invalid" | "submitting" | "success" | "error"

export function ContactForm({ context = "general" }: { context?: "general" | "consultation" }) {
  const nameId = useId()
  const emailId = useId()
  const phoneId = useId()
  const stageId = useId()
  const connectionId = useId()
  const messageId = useId()
  const consentId = useId()
  const errId = useId()
  const [status, setStatus] = useState<Status>("idle")
  const [message, setMessage] = useState("")
  const [startedAt] = useState(() => Date.now())

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.checkValidity()) {
      setStatus("invalid")
      setMessage("Please complete the required fields so Debra can follow up.")
      form.reportValidity()
      return
    }

    const formData = new FormData(form)
    setStatus("submitting")
    setMessage("")

    try {
      const response = await fetch("/api/leads/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          context,
          startedAt,
          website: formData.get("website"),
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          buyerStage: formData.get("buyerStage"),
          preferredConnection: formData.get("preferredConnection"),
          message: formData.get("message"),
          consent: formData.get("consent") === "yes",
          pageUrl: window.location.href,
          referrer: document.referrer,
        }),
      })
      const result = (await response.json().catch(() => null)) as { error?: string } | null

      if (!response.ok) {
        setStatus("error")
        setMessage(result?.error ?? "The message could not be delivered. Please try again later.")
        return
      }

      form.reset()
      setStatus("success")
    } catch {
      setStatus("error")
      setMessage("The message could not be delivered. Please try again later.")
    }
  }

  if (status === "success") {
    return (
      <Notice tone="success" title="Thank you — your message was received">
        Debra can review what you shared and follow up using the contact information you provided.
      </Notice>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5" aria-describedby={errId}>
      {(status === "invalid" || status === "error") && (
        <p id={errId} role="alert" className="text-sm font-medium text-destructive">
          {message}
        </p>
      )}

      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`${errId}-website`}>Website</label>
        <input id={`${errId}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
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
          className="min-h-12 w-full min-w-0 rounded-md border border-input bg-card px-4 py-2.5 text-sm text-foreground"
        />
      </div>

      {context === "consultation" && <div className="grid gap-5 sm:grid-cols-2">
        <div className="min-w-0 flex flex-col gap-2"><label htmlFor={phoneId} className="text-sm font-medium text-foreground">Phone</label><input id={phoneId} name="phone" type="tel" autoComplete="tel" className="min-h-12 w-full min-w-0 rounded-md border border-input bg-card px-4 py-2.5 text-sm" /></div>
        <div className="min-w-0 flex flex-col gap-2"><label htmlFor={connectionId} className="text-sm font-medium text-foreground">Preferred way to connect</label><select id={connectionId} name="preferredConnection" className="min-h-12 w-full min-w-0 rounded-md border border-input bg-card px-4 py-2.5 text-sm"><option>Phone or video call</option><option>Email</option></select></div>
      </div>}

      {context === "consultation" && <div className="min-w-0 flex flex-col gap-2"><label htmlFor={stageId} className="text-sm font-medium text-foreground">Where are you right now?</label><select id={stageId} name="buyerStage" className="min-h-12 w-full min-w-0 rounded-md border border-input bg-card px-4 py-2.5 text-sm"><option value="">Choose the option that fits best</option><option>Exploring whether buying is right for me</option><option>Preparing finances and documents</option><option>Ready to begin a home search</option><option>Already touring or making offers</option></select></div>}

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
          className="min-h-12 w-full min-w-0 rounded-md border border-input bg-card px-4 py-2.5 text-sm text-foreground"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={messageId} className="text-sm font-medium text-foreground">
          {context === "consultation" ? "What would you like help with?" : "How can Debra help?"}{" "}
          <span className="text-destructive">*</span>
        </label>
        <textarea
          id={messageId}
          name="message"
          required
          rows={5}
          className="w-full min-w-0 rounded-md border border-input bg-card px-4 py-2.5 text-sm text-foreground"
        />
      </div>

      <label className="flex items-start gap-3 text-sm leading-6" htmlFor={consentId}>
        <input id={consentId} name="consent" value="yes" type="checkbox" required className="mt-1 size-5" />
        <span>
          I consent to be contacted by D&apos;Affordable Homes about this request. <span aria-hidden="true" className="text-destructive">*</span>
        </span>
      </label>

      <div>
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : context === "consultation" ? "Request consultation" : "Send message"}
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          We respect your privacy. Your information is only used to respond to you.
        </p>
      </div>
    </form>
  )
}
