import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { BUYER_RESOURCES, BUYER_RESOURCE_LIST, type BuyerResourceSlug } from "@/lib/buyer-resources"
import { SITE } from "@/lib/site"

export function generateStaticParams() { return BUYER_RESOURCE_LIST.map(({ slug }) => ({ slug })) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const guide = BUYER_RESOURCES[slug as BuyerResourceSlug]
  if (!guide) return {}
  const path = `/resources/${guide.slug}`
  return { title: guide.title, description: guide.summary, alternates: { canonical: path }, openGraph: { title: `${guide.title} | D'Affordable Homes`, description: guide.summary, url: path, type: "article" }, twitter: { card: "summary_large_image", title: guide.title, description: guide.summary } }
}

export default async function BuyerResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = BUYER_RESOURCES[slug as BuyerResourceSlug]
  if (!guide) notFound()
  const url = `${SITE.url}/resources/${guide.slug}`
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "Article", headline: guide.title, description: guide.summary, url, author: { "@type": "Person", name: SITE.realtorLegalName }, publisher: { "@type": "Organization", name: SITE.name, url: SITE.url }, dateModified: "2026-08-04" },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE.url }, { "@type": "ListItem", position: 2, name: "Resources", item: `${SITE.url}/resources` }, { "@type": "ListItem", position: 3, name: guide.title, item: url }] },
    { "@type": "FAQPage", mainEntity: guide.questions.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
  ] }
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <section className="border-b border-border bg-card"><Container className="py-12 md:py-20"><nav aria-label="Breadcrumb" className="text-sm text-muted-foreground"><Link href="/">Home</Link> / <Link href="/resources">Resources</Link> / <span aria-current="page">{guide.title}</span></nav><p className="mt-8 text-xs font-semibold uppercase tracking-[0.12em] text-accent">{guide.eyebrow}</p><h1 className="mt-4 max-w-4xl font-serif text-[42px] font-normal leading-[1.08] sm:text-[56px]">{guide.title}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">{guide.summary}</p></Container></section>
    <section className="py-14"><Container><div className="border-l-4 border-accent bg-muted p-6 md:p-8"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Short answer</p><p className="mt-3 max-w-4xl text-xl leading-8">{guide.directAnswer}</p></div></Container></section>
    <section className="bg-card py-14 md:py-20"><Container><h2 className="font-serif text-3xl font-normal">A practical step-by-step plan</h2><ol className="mt-8 grid border-t border-border md:grid-cols-2 lg:grid-cols-4">{guide.steps.map((step, index) => <li key={step.title} className="border-b border-border py-6 md:px-6 md:odd:border-r lg:border-r lg:odd:border-r lg:first:pl-0 lg:last:border-r-0"><span className="text-xs font-semibold text-accent">0{index + 1}</span><h3 className="mt-3 text-lg font-semibold">{step.title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{step.description}</p></li>)}</ol></Container></section>
    <section className="py-14 md:py-20"><Container className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">People also ask</p><h2 className="mt-3 font-serif text-3xl font-normal">Questions buyers ask first</h2><p className="mt-4 text-sm leading-6 text-muted-foreground">Program, lending, legal, tax, and market details can change. Confirm decisions with the official source or qualified professional.</p></div><div className="border-t border-border">{guide.questions.map((faq) => <details key={faq.question} className="border-b border-border py-5"><summary className="cursor-pointer font-semibold">{faq.question}</summary><p className="mt-3 text-sm leading-6 text-muted-foreground">{faq.answer}</p></details>)}</div></Container></section>
    <section className="border-y border-border bg-muted/50 py-12"><Container><h2 className="font-serif text-3xl font-normal">Verify with official resources</h2><ul className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{guide.officialResources.map((item) => <li key={item.href}><a className="font-semibold text-primary underline" href={item.href} target="_blank" rel="noopener noreferrer">{item.label}</a></li>)}</ul></Container></section>
    <section className="bg-primary py-12 text-primary-foreground"><Container className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center"><div><h2 className="font-serif text-3xl font-normal">Turn the guide into your next step</h2><p className="mt-3 max-w-3xl text-primary-foreground/80">Bring your questions, current stage, and preferred North Texas search areas to a practical conversation with Debra.</p></div><Button href="/book" variant="secondary">Schedule a consultation</Button></Container></section>
  </>
}
