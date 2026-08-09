import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { AREAS, AREA_LIST, type AreaSlug } from "@/lib/areas"
import { SITE } from "@/lib/site"

export function generateStaticParams() { return AREA_LIST.map(({ slug }) => ({ slug })) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const area = AREAS[slug as AreaSlug]
  if (!area) return {}
  const path = `/areas/${area.slug}`
  return { title: `${area.city}, Texas Homebuyer Guide`, description: `${area.overview} Get practical affordability, school, neighborhood, market, and buying guidance.`, alternates: { canonical: path }, openGraph: { title: `${area.city} Homebuyer Guide | D'Affordable Homes`, description: area.overview, url: path, type: "article" }, twitter: { card: "summary_large_image", title: `${area.city} Homebuyer Guide`, description: area.overview } }
}

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const area = AREAS[slug as AreaSlug]
  if (!area) notFound()
  const url = `${SITE.url}/areas/${area.slug}`
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "Article", headline: `${area.city}, Texas Homebuyer Guide`, description: area.overview, url, author: { "@type": "Person", name: SITE.realtorLegalName }, publisher: { "@type": "Organization", name: SITE.name, url: SITE.url }, about: { "@type": "City", name: `${area.city}, Texas` } },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE.url }, { "@type": "ListItem", position: 2, name: "Area guides", item: `${SITE.url}/areas` }, { "@type": "ListItem", position: 3, name: area.city, item: url }] },
    { "@type": "FAQPage", mainEntity: area.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
  ] }
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <section className="border-b border-border bg-card"><Container className="py-12 md:py-20">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground"><Link href="/" className="hover:underline">Home</Link> / <Link href="/areas" className="hover:underline">Area guides</Link> / <span aria-current="page">{area.city}</span></nav>
      <p className="mt-8 text-xs font-semibold uppercase tracking-[0.12em] text-accent">{area.city}, Texas homebuyer guide</p><h1 className="mt-4 max-w-4xl font-serif text-[42px] font-normal leading-[1.08] sm:text-[56px]">Plan a {area.city} home search around your complete ownership cost</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">{area.overview}</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button href="/book">Discuss a {area.city} home search</Button><Button href="/programs" variant="outline">Compare buyer programs</Button></div>
    </Container></section>
    <section className="py-14 md:py-20"><Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]"><div><h2 className="font-serif text-3xl font-normal">Start with a focused search</h2><p className="mt-4 leading-7 text-muted-foreground">{area.searchFocus}</p><p className="mt-4 text-sm leading-6 text-muted-foreground">Regional context: {area.countyContext}.</p></div><div><h2 className="text-xl font-semibold">Neighborhoods and areas to research</h2><ul className="mt-5 grid gap-3 sm:grid-cols-2">{area.neighborhoods.map((item) => <li key={item} className="border-l-4 border-accent bg-muted p-4">{item}</li>)}</ul><p className="mt-4 text-xs leading-5 text-muted-foreground">Names are provided for neutral geographic research, not as rankings or recommendations. Buyers should choose locations using their own lawful, non-discriminatory criteria.</p></div></Container></section>
    <section className="bg-card py-14 md:py-20"><Container><h2 className="font-serif text-3xl font-normal">Housing patterns to compare</h2><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{area.housing.map((item) => <article key={item} className="border border-border bg-background p-5"><h3 className="font-semibold">{item}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Confirm availability, condition, price, and property requirements through current approved sources.</p></article>)}</div></Container></section>
    <section className="py-14 md:py-20"><Container className="grid gap-10 lg:grid-cols-2"><div><h2 className="font-serif text-3xl font-normal">Affordability planning</h2><p className="mt-4 leading-7 text-muted-foreground">{area.affordability}</p><Button href="/resources/calculators" variant="outline" className="mt-6">Use the planning calculators</Button></div><div><h2 className="font-serif text-3xl font-normal">Local market overview</h2><p className="mt-4 leading-7 text-muted-foreground">{area.marketOverview}</p><p className="mt-4 text-sm text-muted-foreground">No live market statistic or listing is presented without a verified current source.</p></div></Container></section>
    <section className="border-y border-border bg-muted/50 py-14"><Container className="grid gap-10 lg:grid-cols-2"><div><h2 className="font-serif text-3xl font-normal">Schools: verify the address</h2><p className="mt-4 leading-7 text-muted-foreground">{area.schoolNote}</p><div className="mt-5 flex flex-wrap gap-4"><a className="font-semibold text-primary underline" href="https://tea.texas.gov/texas-schools/general-information/finding-a-school-for-your-child/finding-a-school" target="_blank" rel="noopener noreferrer">Texas Education Agency school finder</a><a className="font-semibold text-primary underline" href={area.cityUrl} target="_blank" rel="noopener noreferrer">Official City of {area.city} website</a></div></div><div><h2 className="font-serif text-3xl font-normal">Buying tips</h2><ul className="mt-5 space-y-3">{area.buyingTips.map((tip) => <li key={tip} className="border-b border-border pb-3">{tip}</li>)}</ul></div></Container></section>
    <section className="py-14 md:py-20"><Container className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Direct answers</p><h2 className="mt-3 font-serif text-3xl font-normal">{area.city} buyer questions</h2></div><div className="border-t border-border">{area.faqs.map((faq) => <details key={faq.question} className="border-b border-border py-5"><summary className="cursor-pointer font-semibold">{faq.question}</summary><p className="mt-3 text-sm leading-6 text-muted-foreground">{faq.answer}</p></details>)}</div></Container></section>
  </>
}
