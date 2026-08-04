import Link from "next/link"
import { ArrowRight, Compass, Map, HeartHandshake } from "lucide-react"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"

const PATHS = [
  {
    icon: Compass,
    step: "Start here",
    title: "Understand where I stand",
    description:
      "Get an honest read on your starting point — income, savings, credit, and habits — with planning tools that turn uncertainty into clear numbers.",
    cta: "Check my readiness",
    href: "/start",
  },
  {
    icon: Map,
    step: "Plan ahead",
    title: "Learn what comes next",
    description:
      "Follow the homeownership roadmap in plain language, and use free calculators to test payments, affordability, closing costs, and down payments.",
    cta: "Explore the plan",
    href: "/resources",
  },
  {
    icon: HeartHandshake,
    step: "Get support",
    title: "Get personal guidance",
    description:
      "When you're ready, talk it through with Debra in a no-pressure consultation. Bring your questions and leave with a clear, realistic next step.",
    cta: "Book a consultation",
    href: "/book",
  },
]

export function ThreePathways() {
  return (
    <section className="bg-muted py-16 md:py-24" aria-labelledby="three-pathways-heading">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>Three ways to begin</Eyebrow>
          <h2
            id="three-pathways-heading"
            className="mt-4 text-balance font-serif text-3xl text-foreground sm:text-4xl"
          >
            Wherever you are today, there&apos;s a clear next step
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            You don&apos;t need to have it all figured out. Pick the door that fits where you are right now.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {PATHS.map((path, index) => {
            const Icon = path.icon
            return (
              <li key={path.href}>
                <Link
                  href={path.href}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                      {`Step ${index + 1} · ${path.step}`}
                    </span>
                  </div>
                  <h3 className="mt-5 font-serif text-2xl text-foreground">{path.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{path.description}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    {path.cta}
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
