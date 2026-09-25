import type { Metadata } from "next"
import Link from "next/link"
import { ClipboardCheck, Compass, Home, MapPin, Route, Wallet } from "lucide-react"
import { FIGMA_CITIES } from "@/lib/figma-home"
import { PageHeader } from "@/components/page/page-header"
import { Band, BandLead, CtaBand, Features, Split } from "@/components/page/editorial"
import { CLOSING_BAND_IMAGE, DEBRA_LIFESTYLE } from "@/lib/content/imagery"

export const metadata: Metadata = {
  title: "North Texas Homebuyer Area Guides",
  description:
    "Useful, differentiated homebuyer guidance for Garland and the Dallas–Fort Worth communities around it — written from local knowledge rather than copied city pages or unsupported market statistics.",
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

export default function AreasPage() {
  const garland = FIGMA_CITIES.find((city) => city.name === "Garland")
  const others = FIGMA_CITIES.filter((city) => city.name !== "Garland")

  return (
    <>
      <PageHeader
        eyebrow="Local homebuyer guidance"
        eyebrowIcon={MapPin}
        title="Area guides for Garland and North Texas"
        intro="Buying somewhere is a different decision from buying something. These guides cover the part of a home search that is about the place — the costs, the housing, the trade-offs — for the communities Debra works in."
        crumbs={[{ label: "Home", href: "/" }, { label: "Area guides" }]}
        facts={[
          { label: "Garland is home base", icon: MapPin },
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
          lede="Garland is where Debra's practice is based and the community she can speak about in the most detail. It is the one area on this site with a full written guide behind it."
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
          lede="Written guides for these are still being built one at a time. Until then, each opens the property search — and Debra can talk through any of them directly."
        />
        <ul className="dh-places">
          {others.map((city) => (
            <li key={city.name}>
              <Link href={city.href} className="dh-place">
                <MapPin aria-hidden="true" />
                <span>
                  <span className="dh-place-name">{city.name}</span>
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
