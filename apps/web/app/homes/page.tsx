import type { Metadata } from "next"
import Link from "next/link"
import {
  Calculator,
  ClipboardList,
  Home,
  KeyRound,
  MapPin,
  MessageCircle,
  Search,
  SignalHigh,
} from "lucide-react"
import { searchListings } from "@/lib/mls/provider"
import { FIGMA_CITIES } from "@/lib/figma-home"
import { PageHeader } from "@/components/page/page-header"
import { Band, BandLead, CtaBand, Features, Split, StatusStrip } from "@/components/page/editorial"
import { CLOSING_BAND_IMAGE, HERO_FAMILY } from "@/lib/content/imagery"

export const metadata: Metadata = {
  title: "Find a Home in Dallas–Fort Worth",
  description:
    "Explore homes across Garland and the Dallas–Fort Worth metroplex with guidance. When a live MLS feed isn't connected, we say so plainly instead of showing placeholder homes.",
  alternates: { canonical: "/homes" },
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)
}

/**
 * What a visitor can genuinely do on this page right now.
 *
 * The previous version of this route was a warning panel and a white card in
 * the middle of an empty page — the site's own status message presented as the
 * whole experience. The honesty is unchanged and non-negotiable: no fabricated
 * listings, prices or addresses. What changed is that the page now offers the
 * four things that are actually available instead of apologising for the one
 * that is not.
 */
const NEXT_STEPS = [
  {
    title: "Ask Debra what's available",
    body: "Debra works the Dallas–Fort Worth market every day. Tell her the area, the budget and the timing, and she can tell you what is realistically out there.",
    href: "/consultation",
    icon: MessageCircle,
    tone: "teal" as const,
    action: "Start a conversation",
  },
  {
    title: "Build your buying plan",
    body: "A short set of questions about where you are, then one clear next step — financing, preparation, or a program worth understanding before you shop.",
    href: "/start",
    icon: ClipboardList,
    tone: "navy" as const,
    action: "Find your next step",
  },
  {
    title: "Know your monthly number",
    body: "Principal, interest, taxes, insurance, mortgage insurance and HOA dues. The figure that decides whether a house fits your life, not just your approval.",
    href: "/calculators/mortgage-payment",
    icon: Calculator,
    tone: "gold" as const,
    action: "Estimate a payment",
  },
  {
    title: "Read the Garland guide",
    body: "How to define a search in Garland, what North Texas housing tends to look like, and which questions to ask before you tour anything.",
    href: "/areas/garland",
    icon: MapPin,
    tone: "green" as const,
    action: "Open the guide",
  },
] as const

const MASTHEAD_FACTS = [
  { label: "Garland + DFW", icon: MapPin },
  { label: "Buyer representation", icon: KeyRound },
  { label: "No placeholder listings", icon: Home },
] as const

export default async function HomesPage() {
  const result = await searchListings()
  const connected = result.status === "connected"
  const garland = FIGMA_CITIES.find((city) => city.name === "Garland")
  const others = FIGMA_CITIES.filter((city) => city.name !== "Garland")

  return (
    <>
      <PageHeader
        eyebrow="Find a home"
        eyebrowIcon={Search}
        title="Homes across Dallas–Fort Worth"
        intro="Searching works best once you know your number and your steps. Start with the plan, and let Debra tell you what is actually on the market while you do."
        crumbs={[{ label: "Home", href: "/" }, { label: "Find a home" }]}
        facts={MASTHEAD_FACTS}
        motif="roofline"
      >
        <Link href="/consultation" className="dh-btn dh-btn-gold">
          Ask Debra what&apos;s available
        </Link>
        <Link href="/start" className="dh-btn dh-btn-light-outline">
          Start your buying plan
        </Link>
      </PageHeader>

      {connected ? (
        <Band tone="white" aria-labelledby="homes-listings-heading">
          <BandLead
            eyebrow="Live from the MLS"
            eyebrowIcon={SignalHigh}
            title="Homes on the market now"
            titleId="homes-listings-heading"
            lede="Listing data is provided by the connected MLS/IDX feed. Details change; confirm anything you intend to act on."
          />
          <ul className="dh-listings">
            {result.listings.map((listing) => (
              <li key={listing.id}>
                <article className="dh-listing">
                  <p className="dh-listing-price">{formatPrice(listing.price)}</p>
                  <p className="dh-listing-address">{listing.address}</p>
                  <p className="dh-listing-meta">
                    <MapPin aria-hidden="true" />
                    {listing.city}
                  </p>
                  <p className="dh-listing-stats">
                    <span>{listing.beds} Beds</span>
                    <span>{listing.baths} Baths</span>
                    <span>{listing.sqft.toLocaleString()} Sq Ft</span>
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </Band>
      ) : (
        <Band tone="white" aria-labelledby="homes-status-heading">
          <Split
            media={{
              ...HERO_FAMILY,
              priority: true,
              caption: { label: "Dallas–Fort Worth", title: "The home comes after the plan" },
            }}
            weight="media"
            ratio="4 / 3"
            plate="teal"
            sizes="(max-width: 1000px) 100vw, 780px"
          >
            <p className="dh-kicker">
              <SignalHigh aria-hidden="true" />
              Property search
            </p>
            <h2 id="homes-status-heading">
              {result.status === "error"
                ? "The property search is having trouble right now"
                : "Live listings are being connected"}
            </h2>
            <StatusStrip
              icon={SignalHigh}
              title={
                result.status === "error"
                  ? "Search is temporarily unavailable"
                  : "No MLS or IDX feed is connected to this site yet"
              }
            >
              <p>{result.reason}</p>
            </StatusStrip>
            <p>
              We would rather tell you that than fill this page with invented homes. Every listing shown here will come
              from an approved MLS or IDX provider, with the attribution that provider requires.
            </p>
            <div className="dh-masthead-actions">
              <Link href="/consultation" className="dh-btn dh-btn-navy">
                Ask Debra what&apos;s on the market
              </Link>
              <Link href="/start" className="dh-btn dh-btn-navy-outline">
                Start your buying plan
              </Link>
            </div>
          </Split>
        </Band>
      )}

      <Band tone="alt" aria-labelledby="homes-next-heading">
        <BandLead
          eyebrow="While you wait for the right house"
          eyebrowIcon={KeyRound}
          title="The work that decides whether the search goes well"
          titleId="homes-next-heading"
          lede="Buyers who know their number, their programs and their non-negotiables move calmly when a house appears. This is that preparation."
        />
        <Features items={NEXT_STEPS} rule="gold" />
      </Band>

      <Band tone="navy" aria-labelledby="homes-areas-heading">
        <BandLead
          eyebrow="Where Debra works"
          eyebrowIcon={MapPin}
          title="Garland, and the North Texas cities around it"
          titleId="homes-areas-heading"
          lede="Garland is the home market and the one with a full local guide behind it. The rest of the metroplex is where Debra works every week."
        />
        <div className="dh-places-layout">
          {garland && (
            <Link href={garland.href} className="dh-place-feature">
              <span className="dh-place-feature-label">
                <MapPin aria-hidden="true" className="size-4" />
                Home market
              </span>
              <span className="dh-place-feature-name">{garland.name}</span>
              <span className="dh-place-feature-meta">{garland.county}, Texas</span>
              <span className="dh-place-feature-cta">Open the Garland guide →</span>
            </Link>
          )}
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
        </div>
        <p className="dh-note">
          Representation for a specific community or property is confirmed with Debra before it is promised. No service
          area beyond that is claimed here.
        </p>
      </Band>

      <CtaBand
        eyebrow="No pressure, no commitment"
        title="Tell Debra what you're looking for"
        titleId="homes-cta-heading"
        body="Bring the area, the budget and the timing — or just the question you have been sitting on. You will get a straight answer about what the next step actually is."
        image={CLOSING_BAND_IMAGE}
      >
        <Link href="/consultation" className="dh-btn dh-btn-gold">
          Schedule a consultation
        </Link>
        <Link href="/contact" className="dh-btn dh-btn-light-outline">
          Send a message
        </Link>
      </CtaBand>
    </>
  )
}
