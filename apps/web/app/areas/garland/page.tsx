import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { SITE } from "@/lib/site"

export const metadata: Metadata = {
  title: "Garland Texas Homebuyer Guide and Affordable-Homeownership Help",
  description:
    "A practical Garland, Texas homebuyer guide covering search preparation, attainable North Texas home styles, NACA and Homes for Heroes guidance, property evaluation, and next steps with Debra.",
  alternates: { canonical: "/areas/garland" },
  openGraph: {
    title: "Garland Homebuyer Guide | D'Affordable Homes",
    description:
      "Clear home-search and affordable-homeownership guidance for people exploring Garland, Texas.",
    url: "/areas/garland",
    type: "article",
  },
}

const faqs = [
  {
    question: "Does Debra help first-time homebuyers in Garland?",
    answer:
      "Debra can discuss your Garland homebuying goals, current preparation, and program needs, then confirm whether representation is available for your specific transaction. The site does not publish an unverified blanket service-area promise.",
  },
  {
    question: "What should I prepare before searching for a home in Garland?",
    answer:
      "Prepare a realistic monthly-cost range, financing or program status, desired home features, preferred areas, timing, and questions about inspections, repairs, taxes, insurance, and ongoing ownership costs.",
  },
  {
    question: "Can a NACA buyer explore homes in Garland?",
    answer:
      "A buyer can discuss Garland as a search goal, but current NACA rules, qualification, property eligibility, and transaction requirements must be confirmed through NACA and the appropriate professionals.",
  },
  {
    question: "What kinds of homes should I expect to compare?",
    answer:
      "A North Texas search may include modest one-story brick homes, ranch-style homes, two-story suburban homes, brick-and-stone facades, townhomes, and newer construction. Actual availability changes and should come from an approved live property source.",
  },
]

export default function GarlandAreaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Garland Texas Homebuyer Guide",
        description: metadata.description,
        url: `${SITE.url}/areas/garland`,
        about: { "@type": "City", name: "Garland, Texas" },
        isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
          { "@type": "ListItem", position: 2, name: "Area guides", item: `${SITE.url}/areas` },
          { "@type": "ListItem", position: 3, name: "Garland", item: `${SITE.url}/areas/garland` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="border-b border-border bg-card">
        <Container className="py-12 md:py-20">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground"><Link href="/" className="inline-block py-1 hover:underline">Home</Link> / <Link href="/areas" className="inline-block py-1 hover:underline">Area guides</Link> / <span aria-current="page">Garland</span></nav>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.12em] text-accent">Garland, Texas homebuyer guidance</p>
          <h1 className="mt-4 max-w-4xl font-serif text-[42px] font-normal leading-[1.08] sm:text-[56px]">Build a Garland home search around the life you can sustain</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">A useful search starts with monthly cost, home condition, location priorities, program status, and the tradeoffs you are willing to make—not a promise that every property or program will fit.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button href="/consultation">Plan a Garland consultation</Button><Button href="/programs" variant="outline">Explore homebuyer programs</Button></div>
        </Container>
      </section>

      <section className="py-14 md:py-20" aria-labelledby="search-heading">
        <Container className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Search preparation</p><h2 id="search-heading" className="mt-3 font-serif text-3xl font-normal sm:text-4xl">Define the search before touring homes</h2><p className="mt-4 leading-7 text-muted-foreground">Garland is the platform&apos;s first local-content focus, but service availability for a specific property or transaction must still be confirmed directly with Debra.</p></div>
          <div className="grid border-t border-border sm:grid-cols-2">
            {[
              ["Monthly ownership cost", "Plan beyond the purchase price by discussing principal, interest, taxes, insurance, utilities, maintenance, and possible association costs."],
              ["Home condition", "Decide how much repair work, updating, inspection risk, and ongoing maintenance you can realistically accept."],
              ["Location priorities", "Rank access to work, family, services, transportation, daily routines, and nearby communities without relying on unsupported commute claims."],
              ["Program requirements", "Keep official NACA, lender, assistance-program, or third-party requirements visible while evaluating each property."],
            ].map(([title, body]) => <article key={title} className="border-b border-border py-6 sm:px-6 sm:odd:border-r sm:odd:pl-0"><h3 className="font-sans text-lg font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p></article>)}
          </div>
        </Container>
      </section>

      <section className="bg-card py-14 md:py-20" aria-labelledby="homes-heading">
        <Container>
          <h2 id="homes-heading" className="font-serif text-3xl font-normal sm:text-4xl">North Texas housing visual direction</h2>
          <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">Website and campaign imagery for this market should present attainable homes that look believable for Garland and the broader Dallas–Fort Worth region.</p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {["One-story brick and ranch-style homes", "Two-story suburban brick homes", "Brick-and-stone facades", "Modest starter homes and townhomes", "Garages and driveways common to North Texas", "Flat or gently graded streets with realistic Texas landscaping"].map((item) => <li key={item} className="border-l-4 border-accent bg-muted p-5 text-sm font-medium">{item}</li>)}
          </ul>
          <p className="mt-6 text-sm leading-6 text-muted-foreground">No listing inventory is fabricated on this page. Live property availability must come from an approved MLS or IDX provider with the required attribution and permissions.</p>
        </Container>
      </section>

      <section className="py-14 md:py-20" aria-labelledby="programs-heading">
        <Container>
          <h2 id="programs-heading" className="font-serif text-3xl font-normal sm:text-4xl">Connect the location to your homebuyer path</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <article className="border border-border bg-card p-7"><h3 className="font-sans text-xl font-semibold">Using NACA?</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Understand how Debra supports the search, offer, inspection, and closing process while NACA controls official program requirements.</p><Link href="/programs/naca" className="mt-5 inline-block py-1 font-semibold text-primary hover:underline">Explore NACA homebuyer help →</Link></article>
            <article className="border border-border bg-card p-7"><h3 className="font-sans text-xl font-semibold">A community hero?</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Build a buying, selling, or coordinated move plan without unsupported promises about eligibility, savings, rebates, or provider status.</p><Link href="/programs/homes-for-heroes" className="mt-5 inline-block py-1 font-semibold text-primary hover:underline">Explore Homes for Heroes guidance →</Link></article>
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-muted/50 py-14 md:py-20" aria-labelledby="garland-faq-heading">
        <Container className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Garland questions</p><h2 id="garland-faq-heading" className="mt-3 font-serif text-3xl font-normal sm:text-4xl">Answers without made-up market data</h2></div>
          <div className="border-t border-border">{faqs.map((faq) => <details key={faq.question} className="border-b border-border py-5"><summary className="cursor-pointer list-none font-semibold">{faq.question}</summary><p className="mt-3 text-sm leading-6 text-muted-foreground">{faq.answer}</p></details>)}</div>
        </Container>
      </section>
    </>
  )
}
