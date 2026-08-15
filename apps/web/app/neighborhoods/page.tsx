import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Neighborhood Guides",
  description:
    "Honest neighborhood guides to help you understand communities, not just listings. Published as guides are researched and verified.",
  alternates: { canonical: "/neighborhoods" },
}

export default function NeighborhoodsPage() {
  return (
    <>
      {/*
        Deliberately photograph-free. No verified North Texas neighborhood
        photography exists in the approved asset set, and a generic stock street
        would make a geographic claim this page cannot support. A restrained
        editorial panel is the honest treatment.
      */}
      <section className="border-b border-border bg-card">
        <Container className="grid gap-10 py-12 md:py-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Neighborhoods</p>
            <h1 className="mt-5 max-w-4xl text-balance text-[2.5rem] leading-[1.05] sm:text-[3.5rem]">
              Garland &amp; DFW areas
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
              Compare verified DFW cities without fabricated prices, rankings, or school scores.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/areas/garland">Explore Garland</Button>
              <Button href="/consultation" variant="outline">Book a consultation</Button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted/50 p-7 sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">How to compare an area</p>
            <ul className="mt-6 space-y-4 text-[0.9375rem] leading-7">
              <li className="border-b border-border pb-4">
                <span className="font-medium text-foreground">Total cost, not list price</span>
                <span className="mt-1 block text-muted-foreground">Taxes, insurance, dues, utilities, and repairs.</span>
              </li>
              <li className="border-b border-border pb-4">
                <span className="font-medium text-foreground">The commute you actually drive</span>
                <span className="mt-1 block text-muted-foreground">Tested at the hours you travel, tolls included.</span>
              </li>
              <li>
                <span className="font-medium text-foreground">Condition and maintenance risk</span>
                <span className="mt-1 block text-muted-foreground">Housing age, roofs, drainage, and insurability.</span>
              </li>
            </ul>
          </div>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <article className="rounded-xl border border-border bg-card p-7 sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Primary area guide</p>
              <h2 className="mt-3 text-[1.75rem] leading-tight sm:text-[2rem]">Garland, Texas</h2>
              <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
                Prepare for a Garland home search with address-specific due diligence, practical property questions, and clear next steps.
              </p>
              <Link
                href="/areas/garland"
                className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-accent underline-offset-4 hover:underline"
              >
                Read the Garland guide
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </article>
            <aside className="rounded-xl border border-border bg-muted/40 p-7">
              <h2 className="text-[1.375rem] leading-snug">What we do not publish</h2>
              <p className="mt-4 text-[0.9375rem] leading-7 text-muted-foreground">
                No fabricated neighborhood rankings, price ranges, school scores, or unsupported market claims. Every address still needs current verification.
              </p>
            </aside>
          </div>
        </Container>
      </section>
    </>
  )
}
