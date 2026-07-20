import { ArrowRight, BookOpen, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { SITE } from "@/lib/site"

const DEBRA_PHOTO_URL =
  "https://drive.google.com/uc?export=view&id=1_SfP8687X0jraNsWroo4DK0FvVedpD7h"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border" aria-labelledby="hero-heading">
      <Container className="grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Eyebrow>Education-first homeownership</Eyebrow>
          <h1
            id="hero-heading"
            className="mt-5 text-balance font-serif text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Homeownership has steps. You don&apos;t have to learn them alone.
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {SITE.name} helps first-time buyers and renters understand the process, make a realistic plan, and find
            trustworthy resources — guided by {SITE.realtorName}. Let&apos;s slow this down, look at where you are, and
            find your next step.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href="/start" size="lg">
              Find Your Next Step
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <Button href="/first-time-buyers" variant="ghost" size="lg" className="text-foreground/80">
              <BookOpen className="size-4" aria-hidden="true" />
              Start with the basics
            </Button>
          </div>

          <p className="mt-6 flex items-center gap-2 text-sm font-medium text-foreground/70">
            <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
            Secure. Private. No pressure.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Learn at your own pace. No contact information required to explore.
          </p>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-secondary shadow-sm">
            <img
              src={DEBRA_PHOTO_URL}
              alt="Debra Allen, REALTOR and founder of D’Affordable Homes"
              loading="eager"
              fetchPriority="high"
              className="h-full w-full object-cover object-[68%_center]"
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
