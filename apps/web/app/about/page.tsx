import type { Metadata } from "next"
import Link from "next/link"
import { BadgeCheck, BookOpen, HeartHandshake, MapPin, Scale, ShieldCheck, Sprout } from "lucide-react"
import { UNVERIFIED_TRUST_FACTS } from "@/lib/site"
import { PageHeader } from "@/components/page/page-header"
import { Band, BandLead, CtaBand, Features, Split, StatusStrip } from "@/components/page/editorial"
import { CLOSING_BAND_IMAGE, DEBRA_LIFESTYLE, DEBRA_PORTRAIT } from "@/lib/content/imagery"

export const metadata: Metadata = {
  title: "About Debra Allen",
  description:
    "Meet Debra Allen, REALTOR® — an education-first guide who believes homeownership has steps and no one should have to learn them alone.",
}

const values = [
  {
    title: "Education before pressure",
    body: "Every conversation starts with helping you understand your options. Decisions come later, and only when you feel ready.",
    icon: BookOpen,
    tone: "teal" as const,
  },
  {
    title: "Honesty over hype",
    body: "No fake urgency, no inflated promises. Just clear, realistic guidance you can trust and act on at your own pace.",
    icon: Scale,
    tone: "navy" as const,
  },
  {
    title: "Dignity for every budget",
    body: "Affordable doesn't mean less. It means smart, prepared, and empowered — building something that lasts.",
    icon: HeartHandshake,
    tone: "gold" as const,
  },
  {
    title: "Community and legacy",
    body: "Homeownership is a step toward stability and generational wealth. Debra guides with that bigger picture in mind.",
    icon: Sprout,
    tone: "green" as const,
  },
] as const

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Debra"
        eyebrowIcon={BadgeCheck}
        title="A guide who believes preparation is a form of respect"
        intro="Debra Allen is a REALTOR® who built D'Affordable Homes around a simple idea: homeownership has steps, and no one should have to figure them out alone."
        crumbs={[{ label: "Home", href: "/" }, { label: "About Debra" }]}
        facts={[
          { label: "REALTOR®", icon: BadgeCheck },
          { label: "Garland + Dallas–Fort Worth", icon: MapPin },
        ]}
        media={{
          ...DEBRA_PORTRAIT,
          priority: true,
          caption: { label: "REALTOR® · Garland", title: "Debra Allen" },
        }}
      >
        <Link href="/consultation" className="dh-btn dh-btn-gold">
          Book a consultation
        </Link>
        <Link href="/start" className="dh-btn dh-btn-light-outline">
          Find your next step
        </Link>
      </PageHeader>

      <Band tone="white" aria-labelledby="about-story-heading">
        <Split
          media={{
            ...DEBRA_LIFESTYLE,
          }}
          weight="copy"
          ratio="3 / 4"
          plate="teal"
          sizes="(max-width: 1000px) 100vw, 480px"
        >
          <p className="dh-kicker">
            <HeartHandshake aria-hidden="true" />
            How she works
          </p>
          <h2 id="about-story-heading">Patient, practical, and never in a hurry on your behalf</h2>
          <p>
            Debra meets people where they are — renting and dreaming, repairing credit, or ready to make an offer — and
            helps them see the path in front of them clearly.
          </p>
          <p>
            She is known for translating the confusing parts of the process into plain language, and for never rushing a
            decision that deserves care. When she teaches line dancing in the community, it is the same spirit: meet the
            rhythm, learn the steps, and enjoy the movement forward.
          </p>
          <Link href="/consultation" className="dh-btn dh-btn-teal">
            Talk with Debra
          </Link>
        </Split>
      </Band>

      <Band tone="alt" aria-labelledby="about-values-heading">
        <BandLead
          eyebrow="What guides the work"
          eyebrowIcon={Sprout}
          title="Four commitments, in every conversation"
          titleId="about-values-heading"
          lede="They are not a mission statement on a wall. They are the reason the process here starts with explaining and ends with your decision."
        />
        <Features items={values} rule="gold" />
      </Band>

      {!UNVERIFIED_TRUST_FACTS.brokerageName && (
        <Band tone="white" tight aria-label="Professional details">
          <StatusStrip icon={ShieldCheck} title="Professional details are published once they are confirmed">
            <p>
              Brokerage affiliation, license number, service areas and professional certifications will appear here when
              they are verified for release. We publish credentials we can stand behind, and nothing before then.
            </p>
          </StatusStrip>
        </Band>
      )}

      <CtaBand
        eyebrow="Wherever you are in it"
        title="Support for the step you are actually on"
        titleId="about-cta-heading"
        body="A consultation is a calm place to talk through where you are, understand your options, and identify a practical next step — without pressure and without judgement."
        image={CLOSING_BAND_IMAGE}
      >
        <Link href="/consultation" className="dh-btn dh-btn-gold">
          Book a consultation
        </Link>
        <Link href="/start" className="dh-btn dh-btn-light-outline">
          Find your next step
        </Link>
      </CtaBand>
    </>
  )
}
