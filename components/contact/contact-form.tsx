"use client"

import { useId, useState } from "react"
import { Button } from "@/components/ui/button"
import { Notice } from "@/components/states/notice"

type Status = "idle" | "invalid" | "submitted"

/**
 * Accessible contact form. It performs real client-side validation, but does
 * NOT pretend a message was delivered: until a messaging provider is connected,
 * submitting shows an honest confirmation that explains what happens next.
 */
export function ContactForm() {
  const nameId = useId()
  const emailId = useId()
  const messageId = useId()
  const errId = useId()
  const [status, setStatus] = useState<Status>("idle")

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = String(data.get("name") ?? "").trim()
    const email = String(data.get("email") ?? "").trim()
    const message = String(data.get("message") ?? "").trim()
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    if (!name || !emailOk || message.length < 10) {
      setStatus("invalid")
      return
    }
    setStatus("submitted")
  }

  if (status === "submitted") {
    return (
      <Notice title="Thanks — your note is ready to send">
        <p>
          Message delivery connects to Debra&apos;s inbox once a messaging provider is configured. We didn&apos;t want to
          pretend it was sent when it wasn&apos;t. Until then, please reach out through the details Debra shares directly,
          and she&apos;ll follow up personally.
        </p>
      </Notice>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex max-w-xl flex-col gap-5">
      {status === "invalid" && (
        <p id={errId} role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          Please add your name, a valid email, and a message of at least 10 characters.
        </p>
      )}
      <div className="flex flex-col gap-2">
        <label htmlFor={nameId} className="text-sm font-medium text-foreground">
          Your name
        </label>
        <input
          id={nameId}
          name="name"
          type="text"
          autoComplete="name"
          required
          className="rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor={emailId} className="text-sm font-medium text-foreground">
          Email address
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          required
          className="rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor={messageId} className="text-sm font-medium text-foreground">
          How can Debra help?
        </label>
        <textarea
          id={messageId}
          name="message"
          rows={5}
          required
          className="rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div>
        <Button type="submit">Send message</Button>
      </div>
    </form>
  )
}
