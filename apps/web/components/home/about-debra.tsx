import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { SITE } from "@/lib/site"

/*
 * DEBRA'S PORTRAIT — ACTION REQUIRED BEFORE LAUNCH
 * ------------------------------------------------
 * The About/Trust section must use a VERIFIED, real photograph of Debra Allen
 * (see docs/02-brand/PHOTOGRAPHY.md). We must not AI-generate Debra or substitute
 * a stock model. Until the licensed portrait is supplied, we show an honest
 * monogram placeholder (no fabricated face) so Debra remains clearly identified
 * as the guide without misrepresenting her likeness.
 *
 * To add the real photo: place the asset in /public/images (e.g. debra-allen.jpg),
 * then replace the monogram block below with a next/image fill inside the same
 * frame. No other changes required.
 */
export function AboutDebra() {
  return (
    <section className="py-16 md:py-24" aria-labelledby="about-heading">
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-primary shadow-sm">
              {/* Honest placeholder — real portrait to be dropped in here. */}
              <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center text-primary-foreground">
                <span
                  aria-hidden="true"
                  className="flex size-24 items-center justify-center rounded-full border border-primary-foreground/30 font-serif text-4xl"
                >
                  DA
                </span>
                <p className="text-sm text-primary-foreground/80">
                  A verified photo of Debra will be published here — we only share real imagery.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Eyebrow>Your guide</Eyebrow>
              <h2 id="about-heading" className="mt-3 text-balance font-serif text-3xl text-foreground sm:text-4xl">
                Meet Debra Allen
              </h2>
              <p className="mt-2 text-sm font-medium text-accent">REALTOR&reg;</p>
            </div>
          </div>

          <div className="text-pretty text-lg leading-relaxed text-muted-foreground lg:pt-2">
            <p>
              Debra Allen is a REALTOR&reg; and the guide behind {SITE.name}. She built this platform for first-time
              buyers and renters who want more than a property search — people who need someone to slow things down,
              explain the process clearly, and help them move with a plan.
            </p>
            <p className="mt-4">
              Debra also teaches line dancing and swing-out. It is a fitting reflection of how she approaches
              homeownership: every path has its own rhythm, the preparation steps matter, and progress comes from
              consistency rather than rushing. Her goal is simple — help you understand your next step and feel
              supported taking it.
            </p>
            <p className="mt-6 rounded-xl border border-border bg-card p-5 text-sm leading-relaxed">
              Additional details — including brokerage affiliation, licensing information, service areas, and
              certifications — will be published here once they are confirmed for release. We only share verified
              information.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/about" size="lg">
                More about Debra
              </Button>
              <Button href="/contact" variant="outline" size="lg">
                Get in touch
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
