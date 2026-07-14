import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { ROADMAP_STEPS } from "@/lib/content/home"

export function RoadmapPreview() {
  return (
    <section className="py-16 md:py-24" aria-labelledby="roadmap-heading">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>The homeownership roadmap</Eyebrow>
          <h2 id="roadmap-heading" className="mt-4 text-balance font-serif text-3xl text-foreground sm:text-4xl">
            One step at a time, from first question to front door
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Homeownership is not one giant leap — it is a series of steps. Here is the typical path. These are general
            stages for education, not guaranteed timelines.
          </p>
        </div>

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ROADMAP_STEPS.map((step) => (
            <li
              key={step.number}
              className="flex flex-col rounded-xl border border-border bg-card p-5"
            >
              <span
                className="flex size-9 items-center justify-center rounded-full bg-primary font-serif text-sm font-semibold text-primary-foreground"
                aria-hidden="true"
              >
                {step.number}
              </span>
              <h3 className="mt-4 font-serif text-lg text-foreground">
                <span className="sr-only">{`Step ${step.number}: `}</span>
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.summary}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10">
          <Button href="/start" variant="outline" size="lg">
            See where you are today
          </Button>
        </div>
      </Container>
    </section>
  )
}
