import Image from "next/image"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"

const LESSONS = [
  "What the homebuying process actually looks like, step by step",
  "How buyers prepare their credit, savings, and documents",
  "The difference between education and loan approval or financial advice",
  "Which questions belong to a lender, attorney, inspector, or tax professional",
]

export function FirstTimeEducation() {
  return (
    <section className="bg-muted/40 py-16 md:py-24" aria-labelledby="education-heading">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <div className="relative aspect-[5/4] overflow-hidden rounded-2xl border border-border shadow-sm">
            <Image
              src="/images/planning-table.png"
              alt="A tidy wooden table with a notebook, a simple checklist, coffee, and a small plant in soft morning light"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <Eyebrow>For first-time buyers</Eyebrow>
          <h2 id="education-heading" className="mt-4 text-balance font-serif text-3xl text-foreground sm:text-4xl">
            Before we search for homes, we start with the plan
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Education turns confusion into confidence. You deserve to understand the process before you step into it —
            without judgment and without pressure to move faster than you&apos;re ready to.
          </p>

          <ul className="mt-8 flex flex-col gap-3.5">
            {LESSONS.map((lesson) => (
              <li key={lesson} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="size-4" aria-hidden="true" />
                </span>
                <span className="text-pretty leading-relaxed text-foreground">{lesson}</span>
              </li>
            ))}
          </ul>

          <div className="mt-9">
            <Button href="/first-time-buyers" size="lg">
              Explore first-time buyer education
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
