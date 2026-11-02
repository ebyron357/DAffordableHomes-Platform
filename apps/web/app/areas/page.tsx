import type { Metadata } from "next"
import Link from "next/link"
import { ClipboardCheck, Compass, Home, MapPin, MessageCircleQuestion, Plane, Route, ShieldCheck, Wallet } from "lucide-react"
import { FIGMA_CITIES } from "@/lib/figma-home"
import { PageHeader } from "@/components/page/page-header"
import { Band, BandLead, CtaBand, Features, QaList, Split, StatusStrip, Steps } from "@/components/page/editorial"
import { JsonLd } from "@/components/seo/json-ld"
import { ArrowLink } from "@/components/page/arrow-link"
import { CONSULTATION_REASSURANCE } from "@/lib/content/conversion"
import { CLOSING_BAND_IMAGE, DEBRA_LIFESTYLE } from "@/lib/content/imagery"

export const metadata: Metadata = {
  title: "North Texas Homebuyer Area Guides",
  description:
    "Homebuyer guidance for Garland and the Dallas–Fort Worth communities around it, written from local knowledge, not copied city pages or unsupported statistics.",
  alternates: { canonical: "/areas" },
}

/**
 * What a guide on this site actually contains.
 *
 * Deliberately about the *reader's* decisions rather than about the publishing
 * process. The previous version of this page explained the content strategy to
 * visitors inside a bordered panel — internal product language on a public
 * page. The strategy has not changed; it simply is not the headline any more.
 */
const GUIDE_CONTENTS = [
  {
    title: "What a month really costs",
    body: "Taxes, insurance, utilities and upkeep in North Texas — the numbers that sit underneath the listing price and decide whether a house stays comfortable.",
    icon: Wallet,
    tone: "gold" as const,
  },
  {
    title: "The housing you'll actually tour",
    body: "The home styles, ages and conditions common to the area, so a first Saturday of showings is not also your first education in what is out there.",
    icon: Home,
    tone: "teal" as const,
  },
  {
    title: "How to rank a location",
    body: "Work, family, schools, routines and drive times weighed against each other honestly — without invented commute claims or neighbourhood rankings.",
    icon: Compass,
    tone: "navy" as const,
  },
  {
    title: "Which programs fit",
    body: "Where NACA, Homes for Heroes and similar programs intersect with a local search, and what has to be confirmed with the program itself.",
    icon: ClipboardCheck,
    tone: "green" as const,
  },
] as const

/** How a move from outside North Texas is narrowed down, in order. */
const RELOCATION_STEPS = [
  {
    title: "Start from where you'll be",
    description:
      "Your workplace, school or base, and how far you are willing to drive, narrow the map faster than any list of cities.",
  },
  {
    title: "Narrow it to one or two areas",
    description:
      "Compare them on monthly cost, the kind of housing you will actually tour and your daily routine — not on a ranking.",
  },
  {
    title: "Tour with a plan",
    description:
      "When you can be here in person, the tours are for specific homes worth seeing, not for learning the metroplex from scratch.",
  },
] as const

/** The cities listed without a guide of their own, named in the FAQ from the same list the page shows. */
const UNGUIDED_CITIES = FIGMA_CITIES.filter((city) => city.name !== "Garland").map((city) => city.name)
const cityList = `${UNGUIDED_CITIES.slice(0, -1).join(", ")} and ${UNGUIDED_CITIES[UNGUIDED_CITIES.length - 1]}`

/**
 * Direct answers to what people ask before choosing where to buy in North
 * Texas. Each uses only facts the site already states: the free first
 * conversation by phone or video (CONVERSION_COPY.md §1), the service-area
 * boundary (lib/local-market.ts), and the VA-lender boundary from the Homes for
 * Heroes page. No remote showings, school ratings or prices are claimed.
 */
const AREA_FAQS = [
  {
    question: "How do I choose where to live in Dallas–Fort Worth?",
    answer:
      "Start from the fixed points: where you will work, study or report for duty, and how long a commute you will accept. That narrows the metroplex faster than any list of cities. Then compare the one or two areas that fit on monthly cost, the kind of homes you would actually tour and your daily routine, and talk them through with Debra before you spend a weekend touring.",
  },
  {
    question: "Can I plan a move to Dallas–Fort Worth before I arrive?",
    answer:
      "Yes. A first conversation with Debra can be by phone or video, so you can talk through areas, budget and timing from wherever you live now. A lender can review your finances before you travel, so the homes you tour are ones that fit your real budget.",
  },
  {
    question: "Which North Texas areas does this site cover?",
    answer: `Garland has a full written guide. ${cityList} are listed without guides of their own yet. Tell Debra where you are hoping to buy, and she will confirm whether she can help with that area before anything else.`,
  },
  {
    question: "What should I check before buying in a particular Garland or DFW neighborhood?",
    answer:
      "Check what changes from one address to the next: property taxes, homeowners association dues and rules, the cost of insurance, flood-zone status, the commute at the hours you would actually drive it, and what the inspection finds. Those come from official records, your insurer and your inspector, not from a city-level summary.",
  },
  {
    question: "I'm moving to North Texas on military orders. Where do I start?",
    answer:
      "Start from your base and the commute you will accept, then talk to a VA-approved lender, who confirms your entitlement and terms. The Homes for Heroes page explains how Debra fits in on the real-estate side.",
  },
] as const

const areaFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: AREA_FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
}

export default function AreasPage() {
  const garland = FIGMA_CITIES.find((city) => city.name === "Garland")
  const others = FIGMA_CITIES.filter((city) => city.name !== "Garland")

  return (
    <>
      <PageHeader
        eyebrow="Local homebuyer guidance"
        eyebrowIcon={MapPin}
        title="Area guides for Garland and North Texas"
        intro="Buying somewhere is a different decision from buying something. These guides cover the part of a home search that is about the place — the costs, the housing, the trade-offs — for Garland and the North Texas communities around it."
        crumbs={[{ label: "Home", href: "/" }, { label: "Area guides" }]}
        facts={[
          { label: "Garland in depth", icon: MapPin },
          { label: "Dallas–Fort Worth metroplex", icon: Route },
        ]}
        motif="roofline"
      >
        <Link href="/areas/garland" className="dh-btn dh-btn-gold">
          Open the Garland guide
        </Link>
        <Link href="/consultation" className="dh-btn dh-btn-light-outline">
          Ask about your area
        </Link>
      </PageHeader>

      <Band tone="white" aria-labelledby="areas-garland-heading">
        <BandLead
          eyebrow="The home market"
          eyebrowIcon={MapPin}
          title="Start in Garland"
          titleId="areas-garland-heading"
          lede="Garland is the site's home market and the community it covers in the most detail. It is the one area on this site with a full written guide behind it."
        />
        <div className="dh-places-layout">
          {garland && (
            <Link href={garland.href} className="dh-place-feature">
              <span className="dh-place-feature-label">
                <MapPin aria-hidden="true" className="size-4" />
                Full area guide
              </span>
              <span className="dh-place-feature-name">Garland</span>
              <span className="dh-place-feature-meta">{garland.county}, Texas</span>
              <span className="dh-place-feature-cta">Open the Garland guide →</span>
            </Link>
          )}
          <Features items={GUIDE_CONTENTS} rule="gold" />
        </div>
      </Band>

      <Band tone="alt" aria-labelledby="areas-local-heading">
        <Split
          media={{
            ...DEBRA_LIFESTYLE,
            caption: { label: "Garland, Texas", title: "Debra Allen, REALTOR®" },
          }}
          weight="copy"
          ratio="3 / 4"
          plate="green"
          sizes="(max-width: 1000px) 100vw, 480px"
          reverse
        >
          <p className="dh-kicker">
            <Compass aria-hidden="true" />
            Local knowledge
          </p>
          <h2 id="areas-local-heading">The part of a search a website can&apos;t answer for you</h2>
          <p>
            A guide can tell you how to weigh a location and what kind of housing to expect. It cannot tell you whether
            the specific street you are looking at floods, what the seller down the road just accepted, or whether the
            house you love has a roof with two years left in it.
          </p>
          <p>
            That is the conversation. Bring the area you are curious about — inside these guides or not — and Debra will
            tell you what she knows, and say plainly when something needs an inspector, a lender or an attorney instead.
          </p>
          <Link href="/consultation" className="dh-btn dh-btn-teal">
            Talk through an area
          </Link>
        </Split>
      </Band>

      <Band tone="navy" aria-labelledby="areas-dfw-heading">
        <BandLead
          eyebrow="Across the metroplex"
          eyebrowIcon={Route}
          title="The North Texas cities around it"
          titleId="areas-dfw-heading"
          lede="Written guides for these are added one at a time. Until then, Debra can talk through any of them with you directly."
        />
        <ul className="dh-places">
          {others.map((city) => (
            <li key={city.name}>
              <Link href={city.href} className="dh-place">
                <MapPin aria-hidden="true" />
                <span>
                  <span className="dh-place-name">
                    <span className="sr-only">Ask Debra about </span>
                    {city.name}
                  </span>
                  <span className="dh-place-county">{city.county}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="dh-note">
          New guides are published when there is something genuinely local to say about a community — not a dozen pages
          that only swap the city name. Representation for a specific area is confirmed with Debra before it is promised.
        </p>
      </Band>

      {/* Moved from /neighborhoods, which now redirects here. */}
      <Band tone="alt" tight aria-label="What is not published here">
        <StatusStrip icon={ShieldCheck} title="What this site will not publish about a neighborhood">
          <p>
            No fabricated rankings, price ranges, school scores or unsupported market claims. Conditions vary street by
            street and change constantly, so every address still needs current verification — which is exactly the part
            Debra does with you.
          </p>
        </StatusStrip>
      </Band>

      {/*
        Relocation. People moving to DFW arrive from the quiz's "Moving to DFW"
        result and used to be sent to the listings page, which has no feed.
        Nothing here promises remote showings or video tours; those wait on
        Debra confirming she offers them (docs/05-content/CONVERSION_COPY.md).
      */}
      <Band tone="white" id="moving-to-dfw" aria-labelledby="areas-moving-heading">
        <BandLead
          eyebrow="Relocating"
          eyebrowIcon={Plane}
          title="Moving to Dallas–Fort Worth? Start with the map, not the listings."
          titleId="areas-moving-heading"
          lede="The metroplex is big, and the right part of it depends on your work, your routine and your budget. Start with a phone or video conversation about where you'll be working, how you like to live and your timeline, and Debra will help you narrow it to one or two areas before you spend a weekend touring."
          aside={
            <div className="dh-cta-stack">
              <Link href="/consultation" className="dh-btn dh-btn-navy">
                Plan your move with Debra
              </Link>
              <p className="dh-reassure">{CONSULTATION_REASSURANCE}</p>
            </div>
          }
        />
        <Steps items={RELOCATION_STEPS} />
        <ul className="dh-band-links">
          <li>
            <ArrowLink href="/calculators/affordability" label="Check what you can afford before you choose an area" />
          </li>
          <li>
            <ArrowLink href="/programs/homes-for-heroes" label="On military orders? Read the Homes for Heroes guidance" />
          </li>
        </ul>
      </Band>

      <Band tone="page" aria-labelledby="areas-faq-heading">
        <JsonLd value={areaFaqJsonLd} />
        <div className="dh-split dh-split-wide-copy">
          <div className="dh-split-copy">
            <p className="dh-kicker">
              <MessageCircleQuestion aria-hidden="true" />
              Direct answers
            </p>
            <h2 id="areas-faq-heading">Questions about choosing where to buy</h2>
            <p>
              What people ask before they pick a part of North Texas — answered without rankings, price claims or
              promises about an area Debra has not confirmed she covers.
            </p>
          </div>
          <QaList items={AREA_FAQS} />
        </div>
      </Band>

      <CtaBand
        eyebrow="Wherever you're looking"
        title="Tell Debra which part of North Texas you have in mind"
        titleId="areas-cta-heading"
        body="Whether it is Garland, somewhere across the metroplex, or you genuinely have not decided yet — that is a good place to start a conversation, not a reason to wait."
        image={CLOSING_BAND_IMAGE}
      >
        <Link href="/consultation" className="dh-btn dh-btn-gold">
          Schedule a consultation
        </Link>
        <Link href="/start" className="dh-btn dh-btn-light-outline">
          Find your next step
        </Link>
      </CtaBand>
    </>
  )
}
