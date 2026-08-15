import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"

export const metadata: Metadata = {
  title: "North Texas Homebuyer Area Guides",
  description:
    "Useful, differentiated homebuyer guidance for Garland and future verified Dallas–Fort Worth communities without copied city pages or unsupported market statistics.",
  alternates: { canonical: "/areas" },
}

export default function AreasPage() {
  return (
    <>
      <section className="border-b border-border bg-card">
        <Container className="py-12 md:py-20">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground"><Link href="/" className="hover:underline">Home</Link> / <span aria-current="page">Area guides</span></nav>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.12em] text-accent">Local homebuyer guidance</p>
          <h1 className="mt-4 max-w-4xl font-serif text-[42px] font-normal leading-[1.08] sm:text-[56px]">North Texas area guides built for real buyer questions</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">This section is designed for useful community content—not thin pages that only swap city names. Each published guide must include differentiated housing context, buyer considerations, local questions, related programs, and clear next steps.</p>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container>
          <article className="grid gap-7 rounded-xl border border-border bg-card p-7 md:grid-cols-[1fr_auto] md:items-center md:p-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Primary local-content market</p>
              <h2 className="mt-3 font-serif text-3xl font-normal">Garland, Texas</h2>
              <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">A practical guide to defining a Garland home search, recognizing common North Texas housing patterns, preparing for property evaluation, and connecting buyer programs with the real-estate process.</p>
            </div>
            <Button href="/areas/garland">Explore Garland</Button>
          </article>

          <div className="mt-10 border-l-4 border-brand-gold bg-muted p-6">
            <h2 className="font-sans text-lg font-semibold">Future area pages require verification and original content</h2>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-muted-foreground">Dallas and other North Texas communities can be added after service coverage and content inputs are verified. The architecture intentionally avoids publishing dozens of near-identical doorway pages.</p>
          </div>
        </Container>
      </section>
    </>
  )
}
