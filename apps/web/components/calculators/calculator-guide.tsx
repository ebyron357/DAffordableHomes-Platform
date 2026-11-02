import Link from "next/link"
import { BookOpen, Calculator, HandCoins, Home, KeyRound, Scale, Wallet, type LucideIcon } from "lucide-react"
import { Band, BandLead, Features, QaList, type Feature } from "@/components/page/editorial"
import { JsonLd } from "@/components/seo/json-ld"
import { CALCULATOR_GUIDES, calculatorPath, type CalculatorSlug } from "@/lib/content/calculator-guides"
import { absoluteUrl } from "@/lib/seo"
import { SITE } from "@/lib/site"

/** One icon per tool, so a related link says what it is before it is read. */
const ICONS: Record<CalculatorSlug, LucideIcon> = {
  "mortgage-payment": Wallet,
  affordability: Home,
  "closing-costs": KeyRound,
  "down-payment": HandCoins,
  "rent-vs-buy": Scale,
}

/** The crumbs every calculator route shows: Home › Calculators › this tool. */
export function calculatorCrumbs(slug: CalculatorSlug) {
  return [
    { label: "Home", href: "/" },
    { label: "Calculators", href: "/calculators" },
    { label: CALCULATOR_GUIDES[slug].name },
  ] as const
}

/**
 * What a calculator route says after the tool itself.
 *
 * A direct answer to the question the page is searched for, the scope of the
 * estimate in both directions, the questions people ask next, and where to go
 * from here. The `WebApplication` and `FAQPage` markup are emitted from the
 * same content, so nothing is marked up that the reader cannot see.
 */
export function CalculatorGuide({ slug }: { slug: CalculatorSlug }) {
  const guide = CALCULATOR_GUIDES[slug]
  const url = absoluteUrl(calculatorPath(slug))
  const id = `calc-${slug}`

  const application = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${url}#calculator`,
    name: guide.name,
    url,
    description: guide.summary,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    inLanguage: "en-US",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@id": `${SITE.url}/#organization` },
    isPartOf: { "@id": `${SITE.url}/#website` },
  }

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }

  const next: Feature[] = [
    ...guide.related.map((related) => {
      const target = CALCULATOR_GUIDES[related]
      return {
        title: target.name,
        body: target.summary,
        href: calculatorPath(related),
        icon: ICONS[related],
        tone: "teal" as const,
        action: "Open the calculator",
      }
    }),
    { ...guide.guide, icon: BookOpen, tone: "gold" as const },
  ]

  return (
    <>
      <JsonLd value={application} />
      <JsonLd value={faq} />

      <Band tone="white" aria-labelledby={`${id}-answer`}>
        <BandLead
          eyebrow="The short answer"
          eyebrowIcon={Calculator}
          title={guide.question}
          titleId={`${id}-answer`}
          lede={guide.answer}
        />
        <div className="dh-scope">
          <section className="dh-scope-col" aria-labelledby={`${id}-includes`}>
            <h3 id={`${id}-includes`}>What this estimate includes</h3>
            <ul>
              {guide.includes.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
          <section className="dh-scope-col dh-scope-col-out" aria-labelledby={`${id}-leaves-out`}>
            <h3 id={`${id}-leaves-out`}>What it leaves out</h3>
            <ul>
              {guide.leavesOut.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
        </div>
      </Band>

      <Band tone="alt" aria-labelledby={`${id}-faq`}>
        <BandLead eyebrow="Common questions" title="What people ask next" titleId={`${id}-faq`} />
        <QaList items={guide.faqs} />
      </Band>

      <Band tone="page" aria-labelledby={`${id}-next`}>
        <BandLead
          eyebrow="Keep planning"
          title="Where this number fits"
          titleId={`${id}-next`}
          lede="Rates, approval and the final figures come from a lender. Debra can help you read an estimate in context and know which questions to bring them."
          aside={
            <Link href="/consultation" className="dh-btn dh-btn-navy">
              Review it with Debra
            </Link>
          }
        />
        <Features items={next} />
      </Band>
    </>
  )
}
