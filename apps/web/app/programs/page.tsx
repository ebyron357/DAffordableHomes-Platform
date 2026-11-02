import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ClipboardCheck,
  Compass,
  GraduationCap,
  HandCoins,
  HeartHandshake,
  Home,
  Landmark,
  MapPin,
  ShieldCheck,
} from "lucide-react"
import { PageHeader } from "@/components/page/page-header"
import { Band, BandLead, CtaBand, Features, Split, StatusStrip, type Feature } from "@/components/page/editorial"
import { CLOSING_BAND_IMAGE, DEBRA_PORTRAIT } from "@/lib/content/imagery"
import { PROGRAM_CARDS } from "@/lib/programs"
import { OPEN_GRAPH_BASE } from "@/lib/seo"
import { CONSULTATION_REASSURANCE } from "@/lib/content/conversion"

export const metadata: Metadata = {
  title: "Homebuyer Programs in Garland and DFW",
  description:
    "NACA and Homes for Heroes guidance from Debra Allen, REALTOR®, plus the official Texas, Dallas and Garland homebuyer assistance programs to check.",
  alternates: { canonical: "/programs" },
  openGraph: {
    title: "Homebuyer Programs | D'Affordable Homes",
    description:
      "Program-specific real-estate guidance for buyers and community heroes exploring Garland and the Dallas–Fort Worth region.",
    url: "/programs",
    type: "website",
    ...OPEN_GRAPH_BASE,
  },
}

const PROGRAM_ICONS = {
  naca: ClipboardCheck,
  "homes-for-heroes": HeartHandshake,
} as const

/**
 * Public assistance programs run by state, county and city agencies.
 *
 * Search demand for Texas and Dallas first-time-buyer programs is far higher
 * than for any single program name (OpenSEO, 2026-10-02), and the results are
 * led by these agencies' own pages. Listing them, with what each one is and a
 * link to the source, answers that search honestly: the site names who runs
 * each program and sends the reader there, and states no amount, limit or
 * eligibility rule of its own. Each URL is the agency's own page, and each was
 * confirmed live, with the program names used here, on 2026-10-02. Re-check
 * them, and the date in the lede, whenever this list changes.
 */
const officialPrograms: Feature[] = [
  {
    title: "Texas Homebuyer Program (TDHCA)",
    body: "The Texas Department of Housing and Community Affairs offers statewide down payment assistance and low-interest mortgages through a network of participating lenders.",
    href: "https://welcomehome.tdhca.texas.gov/welcome-home",
    icon: Landmark,
    action: "TDHCA's official page",
  },
  {
    title: "TSAHC home loans and down payment assistance",
    body: "The Texas State Affordable Housing Corporation runs statewide programs, including Homes for Texas Heroes and Home Sweet Texas, through participating lenders.",
    href: "https://www.tsahc.org/homebuyers-renters/loans-and-down-payment-assistance/",
    icon: HandCoins,
    tone: "gold",
    action: "TSAHC's official page",
  },
  {
    title: "City of Garland Home Ownership Program",
    body: "The City of Garland's homeownership option for eligible Housing Choice Voucher participants, run by the city.",
    href: "https://www.garlandtx.gov/478/Home-Ownership-Program",
    icon: Home,
    tone: "green",
    action: "City of Garland's page",
  },
  {
    title: "Dallas Homebuyer Assistance Program",
    body: "City of Dallas assistance for eligible low- and moderate-income households buying a home in the City of Dallas. Garland is a separate city.",
    href: "https://dallascityhall.com/departments/housing-and-homelessness/pages/dallas-homebuyer-assistance-program-dhap.aspx",
    icon: Building2,
    action: "City of Dallas page",
  },
  {
    title: "Dallas County Home Loan Counseling Center",
    body: "Dallas County Health and Human Services offers homebuyer education, mortgage counseling and down payment assistance programs.",
    href: "https://www.dallascounty.org/departments/dchhs/human-services/home-loan.php",
    icon: GraduationCap,
    tone: "navy",
    action: "Dallas County's page",
  },
]

const futurePrograms = [
  "First-Time Homebuyer Assistance",
  "VA Homebuyers",
  "Down Payment Assistance",
  "FHA Buyers",
  "USDA Buyers",
  "Homebuyer Education",
  "Community Hero Sellers",
] as const

/** Situation → where to start. Names programs only; claims no eligibility. */
const PROGRAM_SORT = [
  { situation: "Thinking about NACA", label: "NACA guide", href: "/programs/naca" },
  {
    situation: "Military, veteran, teacher, healthcare, fire, EMS or police",
    label: "Homes for Heroes guide",
    href: "/programs/homes-for-heroes",
  },
  {
    situation: "Short on a down payment",
    label: "Official assistance programs",
    href: "#official-programs-heading",
  },
  { situation: "Still not sure", label: "Find your next step", href: "/start" },
] as const

export default function ProgramsPage() {
  return (
    <>
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
        note={CONSULTATION_REASSURANCE}
      >
        <Link href="/consultation" className="dh-btn dh-btn-gold">
          Talk through your options
        </Link>
        <Link href="/start" className="dh-btn dh-btn-light-outline">
          Find your next step
        </Link>
      </PageHeader>

      {/*
        A visitor should not have to read both program pages to learn which one
        applies. Each row names a situation and sends it to the right place.
      */}
      <Band tone="page" tight aria-labelledby="programs-sort-heading">
        <h2 id="programs-sort-heading" className="dh-sort-heading">
          Not sure which applies to you?
        </h2>
        <ul className="dh-sort">
          {PROGRAM_SORT.map((row) => (
            <li key={row.situation}>
              <span>{row.situation}</span>
              <Link href={row.href} className="dh-textlink">
                {row.label} <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </Band>

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

      <Band tone="white" aria-labelledby="official-programs-heading">
        <BandLead
          eyebrow="Official sources"
          eyebrowIcon={Landmark}
          title="Texas, Dallas and Garland homebuyer assistance programs"
          titleId="official-programs-heading"
          lede="State, county and city agencies run their own down payment and mortgage assistance, each with its own eligibility and income limits. These are their official pages. A participating lender confirms what you qualify for, and Debra can help with the real-estate side of any of them. Links checked October 2, 2026."
        />
        <p className="dh-band-note dh-band-note-lead">
          <strong>Haven&apos;t saved much?</strong> Down payment assistance exists for buyers in exactly that position.
          Each agency decides who qualifies, and a participating lender confirms it; Debra helps with how assistance
          fits into your search and your offer.
        </p>
        <Features items={officialPrograms} rule="teal" />
      </Band>

      <Band tone="navy" tight aria-labelledby="future-programs-heading">
        <div className="dh-split dh-split-wide-copy">
          <div className="dh-split-copy">
            <p className="dh-kicker">
              <Compass aria-hidden="true" />
              On the way
            </p>
            <h2 id="future-programs-heading">Using FHA, VA, USDA or down payment assistance?</h2>
            <p>
              Those guides are still being written — each gets a page when there is something specific and verified to
              say. Debra can help with the real-estate side of any of them today.
            </p>
            <Link href="/consultation" className="dh-btn dh-btn-gold">
              Talk with Debra
            </Link>
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
