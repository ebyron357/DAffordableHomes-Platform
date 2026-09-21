import type { Metadata } from "next"
import Link from "next/link"
import { MessageCircleQuestion } from "lucide-react"
import { PageHeader } from "@/components/page/page-header"
import { Band, CtaBand, QaList } from "@/components/page/editorial"
import { CLOSING_BAND_IMAGE } from "@/lib/content/imagery"
import { FAQ_GROUPS } from "@/lib/content/faq"

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about getting started with homeownership, the homebuying process, and working with Debra Allen, REALTOR.",
  alternates: { canonical: "/faq" },
}

/** Each group alternates field so the page has rhythm rather than one long column. */
const GROUP_TONES = ["white", "alt", "page"] as const

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_GROUPS.flatMap((g) => g.items).map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader
        eyebrow="Common questions"
        eyebrowIcon={MessageCircleQuestion}
        title="Questions are a good sign"
        intro="There is no wrong question here. If you don't see what you're looking for, you're always welcome to reach out."
        crumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
        motif="route"
      >
        <Link href="/contact" className="dh-btn dh-btn-gold">
          Ask Debra directly
        </Link>
      </PageHeader>

      {FAQ_GROUPS.map((group, index) => (
        <Band
          key={group.heading}
          tone={GROUP_TONES[index % GROUP_TONES.length]}
          aria-labelledby={`faq-group-${index}`}
        >
          <div className="dh-split dh-split-wide-copy">
            <div className="dh-split-copy">
              <p className="dh-kicker">
                <MessageCircleQuestion aria-hidden="true" />
                {`0${index + 1}`}
              </p>
              <h2 id={`faq-group-${index}`}>{group.heading}</h2>
            </div>
            <QaList items={group.items} />
          </div>
        </Band>
      ))}

      <CtaBand
        eyebrow="Still have a question?"
        title="Ask it. There is no pressure and no obligation."
        titleId="faq-cta-heading"
        body="The questions people worry are too basic are usually the ones worth asking first. Debra would rather hear it now."
        image={CLOSING_BAND_IMAGE}
      >
        <Link href="/contact" className="dh-btn dh-btn-gold">
          Contact Debra
        </Link>
        <Link href="/start" className="dh-btn dh-btn-light-outline">
          Find your next step
        </Link>
      </CtaBand>
    </>
  )
}
