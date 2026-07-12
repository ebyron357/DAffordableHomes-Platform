import type { Metadata } from "next"
import { PageHeader } from "@/components/page/page-header"
import { Section, Prose } from "@/components/page/section"
import { Notice } from "@/components/states/notice"
import { Button } from "@/components/ui/button"
import { SITE, UNVERIFIED_TRUST_FACTS } from "@/lib/site"

export const metadata: Metadata = {
  title: "About Debra Allen",
  description:
    "Meet Debra Allen, REALTOR\u00AE — a patient, education-first guide who believes homeownership has steps you shouldn't have to learn alone.",
}

const hasBrokerage = Boolean(UNVERIFIED_TRUST_FACTS.brokerageName)

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Debra"
        title="A patient guide for one of life's biggest steps"
        intro="Debra Allen leads D'Affordable Homes with a simple belief: when you understand the path, homeownership stops feeling out of reach and starts feeling like a plan."
        crumbs={[{ label: "Home", href: "/" }, { label: "About Debra" }]}
      />

      <Section>
        <Prose>
          <p>
            {SITE.realtorFirstName} built D'Affordable Homes for the people the process usually leaves behind — first-time
            buyers, renters wondering if ownership is even possible, and families who were told &quot;maybe someday&quot; one
            too many times. Her approach is education first: understand your situation, learn your options, and move at a
            pace that respects your life.
          </p>
          <h2>How Debra works with you</h2>
          <ul>
            <li>She explains the steps in plain language, without jargon or pressure.</li>
            <li>She helps you understand your options rather than pushing a single path.</li>
            <li>She meets you where you are — whether that&apos;s years away or nearly ready.</li>
            <li>She points you to trustworthy resources, including programs built for affordability.</li>
          </ul>
          <h2>Why &quot;affordable&quot; matters here</h2>
          <p>
            Affordable doesn&apos;t mean lesser. It means ownership within reach, on terms that make sense for your life.
            That framing shapes everything on this site — from the education to the tools to the way Debra shows up for you.
          </p>
        </Prose>

        {!hasBrokerage && (
          <Notice title="Professional details being confirmed" tone="muted" className="mt-10 max-w-2xl">
            Debra&apos;s brokerage, license, service areas, and credentials are being verified before we publish them. We
            only list professional facts once they&apos;re confirmed — never placeholder values.
          </Notice>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/contact">Contact Debra</Button>
          <Button href="/start" variant="outline">
            Find your next step
          </Button>
        </div>
      </Section>
    </>
  )
}
