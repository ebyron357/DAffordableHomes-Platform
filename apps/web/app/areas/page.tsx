import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { AREA_LIST } from "@/lib/areas"

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
          <div className="grid gap-6 md:grid-cols-2">
            {AREA_LIST.map((area) => (
              <article key={area.slug} className="flex flex-col border border-border bg-card p-7 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">{area.countyContext}</p>
                <h2 className="mt-3 font-serif text-3xl font-normal">{area.city}, Texas</h2>
                <p className="mt-4 flex-1 leading-7 text-muted-foreground">{area.overview}</p>
                <div className="mt-6"><Button href={`/areas/${area.slug}`}>Explore {area.city}</Button></div>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
