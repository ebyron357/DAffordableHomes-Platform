import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BadgeCheck, ClipboardCheck, Compass, HeartHandshake, MapPin, ShieldCheck } from "lucide-react"
import { PageHeader } from "@/components/page/page-header"
import { Band, BandLead, CtaBand, Split, StatusStrip } from "@/components/page/editorial"
import { CLOSING_BAND_IMAGE, DEBRA_PORTRAIT } from "@/lib/content/imagery"
import { PROGRAM_CARDS } from "@/lib/programs"
import { SITE } from "@/lib/site"

export const metadata: Metadata = {
  title: "Homebuyer Programs for Garland and Dallas–Fort Worth",
  description:
    "Explore independent NACA homebuyer guidance and Homes for Heroes real-estate support from D'Affordable Homes, with a practical North Texas focus.",
  alternates: { canonical: "/programs" },
  openGraph: {
    title: "Homebuyer Programs | D'Affordable Homes",
    description:
      "Program-specific real-estate guidance for buyers and community heroes exploring Garland and the Dallas–Fort Worth region.",
    url: "/programs",
    type: "website",
  },
}

const PROGRAM_ICONS = {
  naca: ClipboardCheck,
  "homes-for-heroes": HeartHandshake,
} as const

const futurePrograms = [
  "First-Time Homebuyer Assistance",
  "VA Homebuyers",
  "Down Payment Assistance",
  "FHA Buyers",
  "USDA Buyers",
  "Homebuyer Education",
  "Community Hero Sellers",
] as const

export default function ProgramsPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Programs", item: `${SITE.url}/programs` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }}
      />

      <PageHeader
        eyebrow="Specialized homebuyer guidance"
        eyebrowIcon={BadgeCheck}
        title="Find the homeownership path that fits your situation"
        intro="Debra helps buyers understand the real-estate decisions inside a larger homeownership program — the search, the offer, the inspection, the close — while the program keeps control of its own rules."
        crumbs={[{ label: "Home", href: "/" }, { label: "Programs" }]}
        facts={[
          { label: "Garland + Dallas–Fort Worth", icon: MapPin },
          { label: "Independent guidance", icon: ShieldCheck },
        ]}
        motif="keys"
      >
        <Link href="/consultation" className="dh-btn dh-btn-gold">
          Talk through your options
        </Link>
        <Link href="/start" className="dh-btn dh-btn-light-outline">
          Find your next step
        </Link>
      </PageHeader>

      <Band tone="white" aria-labelledby="current-programs-heading">
        <BandLead
          eyebrow="Choose a starting point"
          eyebrowIcon={Compass}
          title="Two programs, explained without the sales pitch"
          titleId="current-programs-heading"
          lede="Each page explains Debra's role, the real-estate process around the program, the questions worth preparing, and exactly what you must verify with the program itself."
          aside={
            <Link href="/areas/garland" className="dh-textlink">
              Garland homebuyer guidance <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          }
        />

        <ul className="dh-program-grid">
          {PROGRAM_CARDS.map((program) => {
            const Icon = PROGRAM_ICONS[program.slug as keyof typeof PROGRAM_ICONS] ?? BadgeCheck
            return (
              <li key={program.slug}>
                <Link href={`/programs/${program.slug}`} className="dh-program">
                  <span className="dh-program-head">
                    <span className="dh-feature-icon dh-feature-icon-gold">
                      <Icon aria-hidden="true" />
                    </span>
                    <span className="dh-kicker">{program.eyebrow}</span>
                  </span>
                  <h3>{program.name}</h3>
                  <p>{program.summary}</p>
                  <ul className="dh-program-points">
                    {program.audience.slice(0, 3).map((item) => (
                      <li key={item}>
                        <BadgeCheck aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <span className="dh-program-cta">
                    {program.slug === "naca" ? "Explore NACA homebuyer help" : "Explore Homes for Heroes"}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </Band>

      <Band tone="alt" aria-labelledby="programs-role-heading">
        <Split
          media={{
            ...DEBRA_PORTRAIT,
            caption: { label: "REALTOR® · Garland", title: "Debra Allen" },
          }}
          weight="copy"
          ratio="4 / 3"
          plate="green"
          sizes="(max-width: 1000px) 100vw, 520px"
          reverse
        >
          <p className="dh-kicker">
            <ShieldCheck aria-hidden="true" />
            Where the lines are
          </p>
          <h2 id="programs-role-heading">Debra handles the real estate. The program handles the program.</h2>
          <p>
            Qualification, eligibility, savings and mortgage terms belong to the organisation running the program, and
            to your lender. This site will never tell you that you qualify, or what you will save.
          </p>
          <p>
            What Debra does is the part in between: helping you define a search that fits the program you are in,
            structuring an offer that survives it, and keeping the inspection and closing on schedule.
          </p>
          <StatusStrip icon={ShieldCheck} title="Independent guidance">
            <p>
              D&apos;Affordable Homes is independent from the programs described here. Current rules, eligibility and
              terms must be confirmed with each program directly.
            </p>
          </StatusStrip>
        </Split>
      </Band>

      <Band tone="navy" tight aria-labelledby="future-programs-heading">
        <div className="dh-split dh-split-wide-copy">
          <div className="dh-split-copy">
            <p className="dh-kicker">
              <Compass aria-hidden="true" />
              On the way
            </p>
            <h2 id="future-programs-heading">More paths are being written</h2>
            <p>
              Each gets a real page when there is something specific and verified to say about it. If yours is on this
              list, ask Debra now — she can still help with the real-estate side today.
            </p>
          </div>
          <ul className="dh-chips">
            {futurePrograms.map((program) => (
              <li key={program}>
                <Compass aria-hidden="true" />
                {program}
              </li>
            ))}
          </ul>
        </div>
      </Band>

      <CtaBand
        eyebrow="Not sure which path fits?"
        title="Start with a conversation, not an application"
        titleId="programs-cta-heading"
        body="Your goals, your current program status, the area you are looking in, and your timeline. That is enough for Debra to tell you what the next step actually is."
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
