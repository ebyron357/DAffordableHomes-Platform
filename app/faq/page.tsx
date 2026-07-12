import type { Metadata } from "next"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"
import { FaqList } from "@/components/faq/faq-list"
import { Button } from "@/components/ui/button"
import { FAQ_GROUPS } from "@/lib/content/faq"

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about getting started with homeownership, the homebuying process, and working with Debra Allen, REALTOR.",
  alternates: { canonical: "/faq" },
}

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
        title="Questions are a good sign"
        intro="There is no wrong question here. If you don't see what you're looking for, you're always welcome to reach out."
        crumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col gap-12">
            {FAQ_GROUPS.map((group) => (
              <div key={group.heading}>
                <h2 className="font-serif text-2xl text-foreground">{group.heading}</h2>
                <div className="mt-5">
                  <FaqList items={group.items} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 rounded-2xl border border-border bg-muted/40 p-8 text-center">
            <h2 className="font-serif text-2xl text-foreground">Still have a question?</h2>
            <p className="mx-auto mt-3 max-w-md text-pretty leading-relaxed text-muted-foreground">
              Reach out any time. There&apos;s no pressure and no obligation.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href="/contact">Contact Debra</Button>
              <Button href="/start" variant="outline">
                Find Your Next Step
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
