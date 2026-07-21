import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"

export function Hero() {
  return (
    <section className="border-b border-border" aria-labelledby="hero-heading">
      <Container className="grid items-center gap-10 py-12 md:py-20 lg:grid-cols-[590px_1fr] lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-accent">Practical guidance for homebuyers</p>
          <h1 id="hero-heading" className="mt-5 max-w-[590px] font-serif text-[42px] font-normal leading-[1.14] tracking-tight sm:text-5xl lg:text-[60px] lg:leading-[1.13]">
            A clear plan for buying a home—built around your life.
          </h1>
          <p className="mt-6 max-w-[560px] text-[17px] leading-[1.55] text-muted-foreground lg:text-[19px] lg:leading-[1.58]">
            Understand where you stand, use practical planning tools, and get personal guidance from Debra Allen when you are ready to move forward.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href="/book" size="lg" className="w-full sm:w-auto">Schedule a Homebuyer Consultation</Button>
            <Button href="/resources" variant="outline" size="lg" className="w-full sm:w-auto">Explore Homebuyer Resources</Button>
          </div>
          <p className="mt-4 text-[13px] font-medium text-muted-foreground">No pressure. No guesswork. Just clear next steps.</p>
        </div>
        <div className="relative aspect-[342/300] overflow-hidden border border-border bg-muted lg:h-[520px] lg:aspect-auto">
          <Image src="/images/black-family-home-pexels-7114188.webp" alt="A Black family of five holding hands together in a bright living room" fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover object-center" />
        </div>
      </Container>
    </section>
  )
}
