import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { SITE } from "@/lib/site"

export function Hero() {
  return (
    <section className="border-b border-border" aria-labelledby="hero-heading">
      <Container className="grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Eyebrow>Homeownership guidance</Eyebrow>
          <h1 id="hero-heading" className="mt-5 text-balance font-serif text-4xl leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Clear guidance for buying a home with a plan that fits your life.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Understand where you stand, use practical planning tools, and get personal guidance from {SITE.realtorName}.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="/start" size="lg">Assess my readiness <ArrowRight className="size-4" aria-hidden="true" /></Button>
            <Button href="/book" variant="outline" size="lg">Schedule a consultation</Button>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <Image src="/images/black-family-home-pexels-7114188.webp" alt="A Black family of five holding hands together in a bright living room" fill priority sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover object-center" />
        </div>
      </Container>
    </section>
  )
}
