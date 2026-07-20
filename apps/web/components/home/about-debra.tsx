import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"

export function AboutDebra() {
  return (
    <section className="bg-card py-13 md:py-20" aria-labelledby="about-heading">
      <Container className="grid items-center gap-10 lg:grid-cols-[0.82fr_1fr] lg:gap-16">
          <div className="relative aspect-[342/400] overflow-hidden border border-border bg-muted lg:aspect-[520/620]">
              <Image
                src="/images/debra-allen-primary-about.webp"
                alt="Debra Allen smiling in a yellow blazer at a kitchen counter"
                fill
                sizes="(min-width: 1024px) 36vw, 100vw"
                className="object-cover object-[48%_center]"
              />
          </div>
          <div className="text-pretty text-base leading-relaxed text-muted-foreground">
            <Eyebrow>Meet Debra Allen</Eyebrow>
            <h2 id="about-heading" className="mt-4 text-balance font-serif text-[31px] leading-[1.22] text-foreground sm:text-[42px]">
              Guidance that respects where you are—and where you want to go.
            </h2>
            <p>
              Debra helps first-time buyers and renters understand their options, prepare with purpose, and make informed decisions without being treated like a transaction.
            </p>
            <p className="mt-4">
              Her role is not to rush the process. It is to help you understand the process, build a realistic plan, and represent your interests when you are ready.
            </p>
            <Button href="/about" variant="outline" size="lg" className="mt-7 w-full sm:w-auto">Learn more about Debra</Button>
          </div>
      </Container>
    </section>
  )
}
