import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"

export function Hero() {
  return (
    <section className="border-b border-border" aria-labelledby="hero-heading">
      <Container className="grid items-center gap-10 py-12 md:py-20 lg:grid-cols-[590px_1fr] lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-accent">Practical guidance for Garland and DFW homebuyers</p>
          <h1 id="hero-heading" className="mt-5 max-w-[590px] font-serif text-[42px] font-normal leading-[1.14] tracking-tight sm:text-5xl lg:text-[60px] lg:leading-[1.13]">
            Real guidance for first-time buyers.
          </h1>
          <p className="mt-6 max-w-[560px] text-[17px] leading-[1.55] text-muted-foreground lg:text-[19px] lg:leading-[1.58]">
            Warm, practical homeownership guidance for first-time buyers and families ready to own their future.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href="/consultation" size="lg" className="w-full sm:w-auto">Book Consultation</Button>
            <Button href="/calculators" variant="outline" size="lg" className="w-full sm:w-auto">Explore Calculators</Button>
          </div>
          <p className="mt-4 text-[13px] font-medium text-muted-foreground">No pressure. No guesswork. Just clear next steps.</p>
        </div>
        <div className="relative aspect-[342/300] overflow-hidden border border-border bg-muted lg:h-[520px] lg:aspect-auto">
          <Image src="/manus-storage/hero-family_b1fab939.jpg" alt="A family smiling together at home" fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover object-center" />
        </div>
      </Container>
    </section>
  )
}
