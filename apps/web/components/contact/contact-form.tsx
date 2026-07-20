"use client"

import { useId, useState } from "react"
import { Button } from "@/components/ui/button"
import { Notice } from "@/components/states/notice"

type Status = "idle" | "invalid" | "submitting" | "unavailable"

export function ContactForm({ context = "general" }: { context?: "general" | "consultation" }) {
  const nameId = useId()
  const emailId = useId()
  const messageId = useId()
  const errId = useId()
  const [status, setStatus] = useState<Status>("idle")

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.checkValidity()) {
      setStatus("invalid")
      form.reportValidity()
      return
    }
    setStatus("submitting")
    // Honest disconnected state: no messaging provider is wired up yet, so we
    // never pretend a message was delivered. This is the wiring point for a
    // real email/CRM integration.
    setTimeout(() => setStatus("unavailable"), 400)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5" aria-describedby={errId}>
      {status === "invalid" && (
        <p id={errId} role="alert" className="text-sm font-medium text-destructive">
          Please complete the required fields so Debra can follow up.
        </p>
      )}

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
          className="min-h-12 rounded-md border border-input bg-card px-4 py-2.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

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
          className="min-h-12 rounded-md border border-input bg-card px-4 py-2.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
          className="rounded-md border border-input bg-card px-4 py-2.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {status === "unavailable" ? (
        <Notice tone="info" title="Message form isn't connected yet">
          <p>
            Online submissions aren&apos;t wired up for release yet, so we won&apos;t pretend your message was sent.
            Please reach out directly and Debra will respond personally. This form activates once a messaging provider
            is connected.
          </p>
        </Notice>
      ) : (
        <div>
          <Button type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Checking…" : context === "consultation" ? "Request consultation" : "Send message"}
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            We respect your privacy. Your information is only used to respond to you.
          </p>
        </div>
      )}
    </form>
  )
}
