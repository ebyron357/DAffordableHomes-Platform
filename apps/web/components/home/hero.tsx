import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { SITE } from "@/lib/site"

export function Hero() {
  return (
    <section aria-labelledby="hero-heading">
      <Container className="grid items-center gap-10 py-13 md:py-20 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
        <div>
          <Eyebrow>Practical guidance for homebuyers</Eyebrow>
          <h1 id="hero-heading" className="mt-5 text-balance font-serif text-[42px] leading-[1.14] tracking-tight sm:text-5xl lg:text-6xl">
            A clear plan for buying a home—built around your life.
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-[1.65] text-muted-foreground lg:text-[19px]">
            Understand where you stand, use practical planning tools, and get personal guidance from {SITE.realtorName} when you are ready to move forward.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/book" size="lg">Schedule a Homebuyer Consultation</Button>
            <Button href="/resources" variant="outline" size="lg">Explore Homebuyer Resources</Button>
          </div>
          <p className="mt-5 text-[13px] font-medium text-muted-foreground">No pressure. No guesswork. Just clear next steps.</p>
        </div>
        <div className="relative aspect-[342/300] overflow-hidden border border-border bg-muted lg:aspect-[5/4]">
          <Image src="/images/black-family-home-pexels-7114188.webp" alt="A Black family of five holding hands together in a bright living room" fill priority sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover object-center" />
        </div>
      </Container>
    </section>
  )
}
