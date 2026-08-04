import type { Metadata } from "next"
import Image from "next/image"
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
        intro="Debra Allen is a REALTOR® who built D'Affordable Homes around a simple idea: homeownership has steps, and no one should have to figure them out alone."
      />

      <Section>
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-secondary shadow-sm">
              <Image
                src="/images/debra-allen-advisor-desk.webp"
                alt="Debra Allen seated at her desk with a tablet"
                fill
                priority
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover object-[center_38%]"
              />
            </div>
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
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-serif text-lg font-semibold text-foreground">{v.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              </div>
            ))}
          </div>

          {!UNVERIFIED_TRUST_FACTS.brokerageName && (
            <div className="mx-auto mt-12 max-w-4xl">
              <Notice tone="info" title="Professional details coming soon">
                <p>
                  Debra&apos;s brokerage affiliation, license number, service areas, and professional certifications
                  will be published here once confirmed for release. We only publish credentials we can verify.
                </p>
              </Notice>
            </div>
          )}

          <div className="mt-12 grid overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-[0.8fr_1.2fr]">
            <div className="relative min-h-[28rem] lg:min-h-[36rem]">
              <Image
                src="/images/debra-allen-lifestyle-full-body.webp"
                alt="Debra Allen standing in a bright kitchen wearing a yellow blazer"
                fill
                sizes="(min-width: 1024px) 36vw, 100vw"
                className="object-cover object-[center_35%]"
              />
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
              <h2 className="text-3xl text-foreground">Support for the step you are on</h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                A consultation is a calm place to talk through where you are, understand your options, and identify a
                practical next step without pressure.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/book">Book a consultation</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/start">Find your next step</Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
