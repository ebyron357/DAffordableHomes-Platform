import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"

export function Hero() {
  return (
    <section className="border-b border-border bg-card" aria-labelledby="hero-heading">
      <Container className="grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 lg:py-24">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            Practical guidance for Garland and DFW homebuyers
          </p>
          <h1
            id="hero-heading"
            className="mt-5 max-w-[16ch] text-balance text-[2.75rem] leading-[1.05] sm:text-[3.5rem] lg:text-[4rem]"
          >
            Real guidance for first-time buyers.
          </h1>
          <p className="mt-7 max-w-xl text-pretty text-lg leading-8 text-muted-foreground">
            Warm, practical homeownership guidance for first-time buyers and families ready to own their future.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="/consultation" size="lg" className="w-full sm:w-auto">
              Book Consultation
            </Button>
            <Button href="/calculators" variant="outline" size="lg" className="w-full sm:w-auto">
              Explore Calculators
            </Button>
          </div>
          <p className="mt-5 text-sm font-medium text-muted-foreground">
            No pressure. No guesswork. Just clear next steps.
          </p>
        </div>

        <figure className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted lg:aspect-[5/4]">
          <Image
            src="/manus-storage/hero-family_b1fab939.jpg"
            alt="A family of four standing together in front of a single-family house with a covered porch"
            fill
            priority
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="object-cover object-[50%_35%]"
          />
        </figure>
      </Container>
    </section>
  )
}
