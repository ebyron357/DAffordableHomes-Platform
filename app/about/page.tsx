import type { Metadata } from "next"
import Link from "next/link"
import { UNVERIFIED_TRUST_FACTS } from "@/lib/site"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"
import { Notice } from "@/components/states/notice"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "About Debra Allen",
  description:
    "Meet Debra Allen, REALTOR® — an education-first guide who believes homeownership has steps and no one should have to learn them alone.",
}

const values = [
  {
    title: "Education before pressure",
    body: "Every conversation starts with helping you understand your options. Decisions come later, and only when you feel ready.",
  },
  {
    title: "Honesty over hype",
    body: "No fake urgency, no inflated promises. Just clear, realistic guidance you can trust and act on at your own pace.",
  },
  {
    title: "Dignity for every budget",
    body: "Affordable doesn't mean less. It means smart, prepared, and empowered — building something that lasts.",
  },
  {
    title: "Community and legacy",
    body: "Homeownership is a step toward stability and generational wealth. Debra guides with that bigger picture in mind.",
  },
]

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Debra"
        title="A guide who believes preparation is a form of respect"
        description="Debra Allen is a REALTOR® who built D'Affordable Homes around a simple idea: homeownership has steps, and no one should have to figure them out alone."
      />

      <Section>
        <Container className="max-w-3xl">
          <div className="space-y-5 text-pretty text-lg leading-relaxed text-foreground/90">
            <p>
              Debra&apos;s approach is patient and practical. She meets people where they are — whether that&apos;s
              renting and dreaming, repairing credit, or ready to make an offer — and helps them see the path in front
              of them clearly.
            </p>
            <p>
              She&apos;s known for translating the confusing parts of the process into plain language, and for never
              rushing a decision that deserves care. When she teaches line dancing in the community, it&apos;s the same
              spirit: meet the rhythm, learn the steps, and enjoy the movement forward.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-serif text-lg font-semibold text-foreground">{v.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              </div>
            ))}
          </div>

          {!UNVERIFIED_TRUST_FACTS.brokerageName && (
            <div className="mt-12">
              <Notice tone="info" title="Professional details coming soon">
                <p>
                  Debra&apos;s brokerage affiliation, license number, service areas, and professional certifications
                  will be published here once confirmed for release. We only publish credentials we can verify.
                </p>
              </Notice>
            </div>
          )}

          <div className="mt-12 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/book">Book a consultation</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/start">Find your next step</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}
