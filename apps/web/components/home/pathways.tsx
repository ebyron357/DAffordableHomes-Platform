import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { PATHWAYS } from "@/lib/content/home"

export function Pathways() {
  return (
    <section className="py-16 md:py-24" aria-labelledby="pathways-heading">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>Four ways to move forward</Eyebrow>
          <h2 id="pathways-heading" className="mt-4 text-balance font-serif text-3xl text-foreground sm:text-4xl">
            Learn, plan, explore, and connect
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Wherever you are today, there is a clear place to begin. Each path is built to help you understand more and
            leave with a practical next step.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PATHWAYS.map((path) => (
            <li key={path.key}>
              <Link
                href={path.href}
                className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40 hover:bg-muted/40"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{path.promise}</p>
                <h3 className="mt-3 font-serif text-2xl text-foreground">{path.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{path.description}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  {path.cta}
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
