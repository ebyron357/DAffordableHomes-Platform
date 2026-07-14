"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log without leaking sensitive detail to the user, per AGENTS.md §6.
    console.error("[v0] Route error:", error.message)
  }, [error])

  return (
    <Container className="py-24">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-serif text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          Something went wrong
        </p>
        <h1 className="mt-4 text-balance font-serif text-4xl text-foreground">This page ran into a problem</h1>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
          It&apos;s not you. Please try again in a moment. If it keeps happening, you can always reach Debra directly.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={() => reset()}>Try again</Button>
          <Button href="/contact" variant="outline">
            Contact Debra
          </Button>
        </div>
      </div>
    </Container>
  )
}
