import Link from "next/link"
import { ArrowRight, CalendarDays, FileText, GraduationCap } from "lucide-react"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"

const BLOCKS = [
  {
    icon: FileText,
    title: "Resource library",
    description:
      "Articles, checklists, and guides organized by topic and journey stage. Every resource shows its review date and only publishes verified information.",
    href: "/resources",
    cta: "Browse resources",
  },
  {
    icon: GraduationCap,
    title: "NACA education",
    description:
      "A plain-language introduction to the NACA process, document preparation, and what to expect — with a clear boundary between general information and professional advice.",
    href: "/naca",
    cta: "Learn about NACA",
  },
  {
    icon: CalendarDays,
    title: "Workshops & events",
    description:
      "Homebuyer workshops and community events. Details, dates, and registration appear here as events are scheduled and confirmed.",
    href: "/events",
    cta: "See events",
  },
]

export function ResourcesWorkshops() {
  return (
    <section className="bg-muted/40 py-16 md:py-24" aria-labelledby="resources-heading">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>Resources & workshops</Eyebrow>
          <h2 id="resources-heading" className="mt-4 text-balance font-serif text-3xl text-foreground sm:text-4xl">
            Trustworthy resources for every step
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Practical, verified resources you can return to as often as you need. Nothing here is a sales pitch — it is
            here to help you understand and prepare.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {BLOCKS.map((block) => {
            const Icon = block.icon
            return (
              <article key={block.title} className="flex flex-col rounded-xl border border-border bg-card p-6">
                <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-serif text-xl text-foreground">{block.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{block.description}</p>
                <Link
                  href={block.href}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  {block.cta}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </article>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
