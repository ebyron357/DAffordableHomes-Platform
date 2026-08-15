import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { PROGRAM_CARDS } from "@/lib/programs"
import { SITE } from "@/lib/site"

export const metadata: Metadata = {
  title: "Homebuyer Programs for Garland and Dallas–Fort Worth",
  description:
    "Explore independent NACA homebuyer guidance and Homes for Heroes real-estate support from D'Affordable Homes, with a practical North Texas focus.",
  alternates: { canonical: "/programs" },
  openGraph: {
    title: "Homebuyer Programs | D'Affordable Homes",
    description:
      "Program-specific real-estate guidance for buyers and community heroes exploring Garland and the Dallas–Fort Worth region.",
    url: "/programs",
    type: "website",
  },
}

const futurePrograms = [
  "First-Time Homebuyer Assistance",
  "VA Homebuyers",
  "Down Payment Assistance",
  "FHA Buyers",
  "USDA Buyers",
  "Homebuyer Education",
  "Community Hero Sellers",
] as const

export default function ProgramsPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Programs", item: `${SITE.url}/programs` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }}
      />
      <section className="border-b border-border bg-card" aria-labelledby="programs-title">
        <Container className="py-12 md:py-20">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary hover:underline">Home</Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">Programs</span>
          </nav>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.12em] text-accent">Specialized homebuyer guidance</p>
          <h1 id="programs-title" className="mt-4 max-w-4xl font-serif text-[42px] font-normal leading-[1.08] sm:text-[56px]">
            Find the homeownership path that fits your situation
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            Debra helps buyers understand the real-estate decisions inside a larger homeownership program. These pages are built for separate campaigns while staying connected to the same D&apos;Affordable Homes guidance, tools, and consultation process.
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">
            Garland and Dallas–Fort Worth are the current local-content focus. Representation availability for a specific community must be confirmed directly with Debra.
          </p>
        </Container>
      </section>

      <section className="py-14 md:py-20" aria-labelledby="current-programs-heading">
        <Container>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 id="current-programs-heading" className="font-serif text-3xl font-normal sm:text-4xl">Choose your starting point</h2>
              <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">Each program page explains Debra&apos;s role, the real-estate process, questions to prepare, and what must be verified with the official program.</p>
            </div>
            <Link href="/areas/garland" className="text-sm font-semibold text-primary hover:underline">Explore Garland homebuyer guidance →</Link>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {PROGRAM_CARDS.map((program) => (
              <article key={program.slug} className="rounded-xl border border-border bg-card p-7 sm:p-9">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">{program.eyebrow}</p>
                <h3 className="mt-4 font-serif text-3xl font-normal">{program.name}</h3>
                <p className="mt-4 leading-7 text-muted-foreground">{program.summary}</p>
                <ul className="mt-6 grid gap-2 text-sm text-foreground">
                  {program.audience.slice(0, 3).map((item) => <li key={item}>• {item}</li>)}
                </ul>
                <div className="mt-7">
                  <Button href={`/programs/${program.slug}`}>
                    {program.slug === "naca" ? "Explore NACA Homebuyer Help" : "Explore Homes for Heroes"}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-muted/50 py-14" aria-labelledby="future-programs-heading">
        <Container className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 id="future-programs-heading" className="font-serif text-3xl font-normal">Built to support future programs</h2>
            <p className="mt-4 leading-7 text-muted-foreground">The shared program-page system can add future offerings without copying entire landing pages or creating disconnected microsites.</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {futurePrograms.map((program) => <li key={program} className="border-b border-border py-3 text-sm font-medium">{program}</li>)}
          </ul>
        </Container>
      </section>

      <section className="bg-primary py-12 text-primary-foreground">
        <Container className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="font-serif text-3xl font-normal">Not sure which path fits?</h2>
            <p className="mt-3 max-w-3xl text-primary-foreground/80">Start with a conversation about your goals, current program status, location, and timeline.</p>
          </div>
          <Button href="/consultation" variant="secondary" size="lg">Book Consultation</Button>
        </Container>
      </section>
    </>
  )
}
