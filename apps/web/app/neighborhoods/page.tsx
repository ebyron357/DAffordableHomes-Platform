import type { Metadata } from "next"
import Link from "next/link"
import { Compass, MapPin, Route, ShieldCheck } from "lucide-react"
import { FIGMA_CITIES } from "@/lib/figma-home"
import { PageHeader } from "@/components/page/page-header"
import { Band, BandLead, CtaBand, StatusStrip } from "@/components/page/editorial"
import { CLOSING_BAND_IMAGE } from "@/lib/content/imagery"

export const metadata: Metadata = {
  title: "Neighborhood Guides",
  description:
    "Honest neighborhood guides to help you understand communities, not just listings. Published as guides are researched and verified.",
}

export default function NeighborhoodsPage() {
  const garland = FIGMA_CITIES.find((city) => city.name === "Garland")
  const others = FIGMA_CITIES.filter((city) => city.name !== "Garland")

  return (
    <>
      <PageHeader
        eyebrow="Neighborhoods"
        eyebrowIcon={MapPin}
        title="Garland and the DFW areas around it"
        description="Compare North Texas cities without fabricated prices, rankings or school scores. Where a guide exists, it is written from local knowledge; where it does not, this page says so."
        crumbs={[{ label: "Home", href: "/" }, { label: "Neighborhoods" }]}
        facts={[
          { label: "Garland is home base", icon: MapPin },
          { label: "Dallas–Fort Worth metroplex", icon: Route },
        ]}
        media={{
          src: "/manus-storage/neighborhood-community_101d8dfe.jpg",
          alt: "A welcoming North Texas neighborhood street",
          caption: { label: "North Texas", title: "Where the search happens" },
        }}
      >
        <Link href="/areas/garland" className="dh-btn dh-btn-gold">
          Explore Garland
        </Link>
        <Link href="/consultation" className="dh-btn dh-btn-light-outline">
          Ask about an area
        </Link>
      </PageHeader>

      <Band tone="navy" aria-labelledby="neighborhoods-places-heading">
        <BandLead
          eyebrow="Where Debra works"
          eyebrowIcon={Compass}
          title="Start with the market that has a full guide"
          titleId="neighborhoods-places-heading"
          lede="Garland is the one community on this site with a complete written guide behind it. The rest link into the property search while their guides are written."
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
              <span className="dh-place-feature-cta">Read the Garland guide →</span>
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
      </Band>

      <Band tone="white" tight aria-label="What is not published here">
        <StatusStrip icon={ShieldCheck} title="What this site will not publish about a neighborhood">
          <p>
            No fabricated rankings, price ranges, school scores or unsupported market claims. Conditions vary street by
            street and change constantly, so every address still needs current verification — which is exactly the part
            Debra does with you.
          </p>
        </StatusStrip>
      </Band>

      <CtaBand
        eyebrow="Somewhere specific in mind?"
        title="Ask about the street, not just the city"
        titleId="neighborhoods-cta-heading"
        body="City-level generalisations rarely survive contact with an actual block. Bring the area you are considering and Debra will tell you what she knows about it."
        image={CLOSING_BAND_IMAGE}
      >
        <Link href="/consultation" className="dh-btn dh-btn-gold">
          Book a consultation
        </Link>
        <Link href="/areas" className="dh-btn dh-btn-light-outline">
          All area guides
        </Link>
      </CtaBand>
    </>
  )
}
