import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"

export function ConsultationCta() {
  return (
    <section className="pb-8" aria-labelledby="cta-heading">
      <Container>
        <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center sm:px-12">
          <h2 id="cta-heading" className="mx-auto max-w-2xl text-balance font-serif text-3xl text-foreground sm:text-4xl">
            Ready to talk about your next step?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            A consultation is a calm conversation about where you are today and what a practical next step could look
            like. No pressure, no obligation — just clarity.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/book" size="lg">
              Book a consultation
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <Button href="/start" variant="outline" size="lg">
              Find Your Next Step first
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
