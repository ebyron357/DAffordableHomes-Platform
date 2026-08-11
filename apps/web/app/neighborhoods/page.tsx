import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Neighborhood Guides",
  description:
    "Honest neighborhood guides to help you understand communities, not just listings. Published as guides are researched and verified.",
}

export default function NeighborhoodsPage() {
  return (
    <>
      <section className="border-b border-border bg-card">
        <Container className="grid gap-8 py-12 md:py-20 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Neighborhoods</p>
            <h1 className="mt-4 max-w-4xl font-serif text-[42px] font-normal leading-[1.08] sm:text-[56px]">
              Garland &amp; DFW areas
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
              Compare verified DFW cities without fabricated prices, rankings, or school scores.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/areas/garland">Explore Garland</Button>
              <Button href="/consultation" variant="outline">Book Consultation</Button>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden border border-border bg-muted">
            <Image
              src="/manus-storage/neighborhood-community_101d8dfe.jpg"
              alt="A welcoming North Texas neighborhood street"
              fill
              sizes="(min-width: 1024px) 420px, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <article className="border border-border bg-card p-7 sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Primary area guide</p>
              <h2 className="mt-3 font-serif text-3xl font-normal">Garland, Texas</h2>
              <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
                Prepare for a Garland home search with address-specific due diligence, practical property questions, and clear next steps.
              </p>
              <Link href="/areas/garland" className="mt-6 inline-block font-semibold text-primary hover:underline">
                Read the Garland guide →
              </Link>
            </article>
            <aside className="border border-border bg-muted/40 p-7">
              <h2 className="font-serif text-2xl font-normal">What we do not publish</h2>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                No fabricated neighborhood rankings, price ranges, school scores, or unsupported market claims. Every address still needs current verification.
              </p>
            </aside>
          </div>
        </Container>
      </section>
    </>
  )
}
