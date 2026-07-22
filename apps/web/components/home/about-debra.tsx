import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"

export function AboutDebra() {
  return (
    <section className="bg-card py-14 md:py-20" aria-labelledby="about-heading">
      <Container className="grid items-center gap-10 lg:grid-cols-[520px_1fr] lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden border border-border bg-muted lg:h-[620px] lg:aspect-auto">
          <Image src="/images/debra-allen-primary-about.webp" alt="Debra Allen smiling in a yellow blazer at a kitchen counter" fill priority sizes="(min-width: 1024px) 520px, 100vw" className="object-cover object-[48%_center]" />
        </div>
        <div className="max-w-[640px]">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-accent">Meet Debra Allen</p>
          <h2 id="about-heading" className="mt-4 font-serif text-[36px] font-normal leading-[1.2] sm:text-[42px]">
            Guidance that respects where you are—and where you want to go.
          </h2>
          <p className="mt-5 text-lg leading-[1.6] text-muted-foreground">Debra helps first-time buyers and renters understand their options, prepare with purpose, and make informed decisions without being treated like a transaction.</p>
          <p className="mt-4 leading-[1.65] text-muted-foreground">Her role is not to rush the process. It is to help you understand the process, build a realistic plan, and represent your interests when you are ready.</p>
          <Button href="/about" variant="outline" size="lg" className="mt-7">Learn more about Debra</Button>
        </div>
      </Container>
    </section>
  )
}
