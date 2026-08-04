import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { ProgramLeadForm } from "@/components/programs/program-lead-form"
import { LOCAL_MARKET, verifiedAreaServedSchema } from "@/lib/local-market"
import type { ProgramDefinition } from "@/lib/programs"
import { SITE } from "@/lib/site"

function JsonLd({ value }: { value: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(value).replace(/</g, "\\u003c") }}
    />
  )
}

export function ProgramPage({ program }: { program: ProgramDefinition }) {
  const path = `/programs/${program.slug}`
  const areas = verifiedAreaServedSchema()
  const serviceSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: program.name,
    description: program.summary,
    url: `${SITE.url}${path}`,
    provider: {
      "@type": "Person",
      name: SITE.realtorName,
      url: `${SITE.url}/about`,
      worksFor: { "@type": "Organization", name: SITE.name, url: SITE.url },
    },
    serviceType: "Real-estate buyer and seller guidance",
  }
  if (areas.length > 0) serviceSchema.areaServed = areas

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: program.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Programs", item: `${SITE.url}/programs` },
      { "@type": "ListItem", position: 3, name: program.name, item: `${SITE.url}${path}` },
    ],
  }

  return (
    <>
      <JsonLd value={serviceSchema} />
      <JsonLd value={faqSchema} />
      <JsonLd value={breadcrumbSchema} />

      <section className="border-b border-border bg-card" aria-labelledby="program-title">
        <Container className="py-12 md:py-20">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary hover:underline">Home</Link>
            <span aria-hidden="true"> / </span>
            <Link href="/programs" className="hover:text-primary hover:underline">Programs</Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{program.name}</span>
          </nav>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">{program.eyebrow}</p>
              <h1 id="program-title" className="mt-4 max-w-4xl font-serif text-[42px] font-normal leading-[1.08] sm:text-[56px]">
                {program.title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">{program.summary}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="#program-contact">{program.primaryCta}</Button>
                <Button href="/" variant="outline">Explore D&apos;Affordable Homes</Button>
              </div>
            </div>
            <aside className="border-l-4 border-accent bg-muted p-6" aria-label="Regional service note">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">North Texas focus</p>
              <p className="mt-3 text-lg font-semibold text-foreground">Garland and the Dallas–Fort Worth region</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{LOCAL_MARKET.serviceAreaStatus}</p>
            </aside>
          </div>
        </Container>
      </section>

      <section className="py-14 md:py-20" aria-labelledby="audience-heading">
        <Container className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Who this is for</p>
            <h2 id="audience-heading" className="mt-3 font-serif text-3xl font-normal sm:text-4xl">Start with your actual program stage</h2>
            <p className="mt-4 leading-7 text-muted-foreground">You do not need to pretend you are further along. Clear status information helps Debra focus the conversation on the next useful real-estate decision.</p>
          </div>
          <ul className="grid gap-0 border-t border-border sm:grid-cols-2">
            {program.audience.map((item) => (
              <li key={item} className="border-b border-border py-5 sm:px-5 sm:odd:border-r">{item}</li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-card py-14 md:py-20" aria-labelledby="support-heading">
        <Container>
          <h2 id="support-heading" className="font-serif text-3xl font-normal sm:text-4xl">{program.supportTitle}</h2>
          <div className="mt-8 grid border-t border-border md:grid-cols-2">
            {program.supportItems.map((item, index) => (
              <article key={item.title} className="border-b border-border py-7 md:px-7 md:odd:border-r md:odd:pl-0">
                <p className="text-xs font-semibold text-accent">0{index + 1}</p>
                <h3 className="mt-3 font-sans text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{item.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14 md:py-20" aria-labelledby="process-heading">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">What happens next</p>
          <h2 id="process-heading" className="mt-3 font-serif text-3xl font-normal sm:text-4xl">A clear four-step real-estate process</h2>
          <ol className="mt-8 grid gap-0 border-t border-border lg:grid-cols-4">
            {program.process.map((step, index) => (
              <li key={step.title} className="border-b border-border py-6 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0">
                <span className="text-xs font-semibold text-accent">0{index + 1}</span>
                <h3 className="mt-3 font-sans text-lg font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-y border-border bg-muted/50 py-12" aria-labelledby="local-heading">
        <Container className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 id="local-heading" className="font-serif text-3xl font-normal">Planning a move in or near Garland?</h2>
            <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">Use the Garland guide for practical home-search questions, attainable North Texas housing context, and links to buyer-planning tools without unsupported market statistics.</p>
          </div>
          <Button href="/areas/garland" variant="outline">Explore the Garland guide</Button>
        </Container>
      </section>

      <section className="py-14 md:py-20" aria-labelledby="faq-heading">
        <Container className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Direct answers</p>
            <h2 id="faq-heading" className="mt-3 font-serif text-3xl font-normal sm:text-4xl">Frequently asked questions</h2>
            <p className="mt-4 leading-7 text-muted-foreground">Official program rules can change. These answers explain Debra&apos;s real-estate role and identify what must be confirmed elsewhere.</p>
          </div>
          <div className="border-t border-border">
            {program.faqs.map((faq) => (
              <details key={faq.question} className="group border-b border-border py-5">
                <summary className="cursor-pointer list-none pr-8 font-semibold marker:content-none">{faq.question}</summary>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <section id="program-contact" className="bg-card py-14 md:py-20" aria-labelledby="contact-heading">
        <Container className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Program-specific consultation</p>
            <h2 id="contact-heading" className="mt-3 font-serif text-3xl font-normal sm:text-4xl">Tell Debra where you are now</h2>
            <p className="mt-4 leading-7 text-muted-foreground">The form captures the program, source page, campaign details, location preferences, timeline, and contact consent so the follow-up starts with useful context.</p>
            <p className="mt-5 text-sm leading-6 text-muted-foreground">{program.disclaimer}</p>
          </div>
          <ProgramLeadForm program={program.slug} leadSource={program.leadSource} cta={program.primaryCta} />
        </Container>
      </section>
    </>
  )
}
