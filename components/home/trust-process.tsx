import { HeartHandshake, ShieldCheck, Users } from "lucide-react"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { TRUST_POINTS } from "@/lib/content/home"

const ICONS = [ShieldCheck, HeartHandshake, Users]

export function TrustProcess() {
  return (
    <section className="bg-primary text-primary-foreground" aria-labelledby="trust-heading">
      <Container className="py-16 md:py-24">
        <div className="max-w-2xl">
          <Eyebrow className="text-primary-foreground/80">How we work</Eyebrow>
          <h2 id="trust-heading" className="mt-4 text-balance font-serif text-3xl sm:text-4xl">
            You will not be pressured or misled
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-primary-foreground/85">
            Trust is the foundation of every step. Here is what you can count on from {""}
            D&apos;Affordable Homes, from your first question onward.
          </p>
        </div>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {TRUST_POINTS.map((point, i) => {
            const Icon = ICONS[i]
            return (
              <li key={point.title} className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-6">
                <span className="flex size-11 items-center justify-center rounded-lg bg-primary-foreground/10">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-serif text-xl">{point.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-primary-foreground/85">{point.description}</p>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
