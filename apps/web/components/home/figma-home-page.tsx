import Link from "next/link"
import { ArrowRight, Check, House } from "lucide-react"
import {
  FIGMA_BUYER_POINTS,
  FIGMA_CITIES,
  FIGMA_HOME_CTA,
  FIGMA_KNOWLEDGE,
  FIGMA_SELLER_POINTS,
  FIGMA_SERVICES,
} from "@/lib/figma-home"
import type { PropertySearchResult } from "@/lib/mls/provider"
import { FigmaHomeFooter } from "@/components/home/figma-home-footer"
import { FigmaHomeHeader } from "@/components/home/figma-home-header"

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)
}

export function FigmaHomePage({ listings }: { listings: PropertySearchResult }) {
  return (
    <div className="figma-home">
      <FigmaHomeHeader />
      <Hero />
      <Services />
      <MeetDebra />
      <Markets />
      <FeaturedListings listings={listings} />
      <GuidanceSplit />
      <KnowledgeBase />
      <FinalCta />
      <FigmaHomeFooter />
    </div>
  )
}

function Hero() {
  return (
    <section className="fh-hero" aria-labelledby="figma-hero-heading">
      <div className="fh-hero-grid">
        <div className="fh-hero-copy">
          <div className="fh-hero-text">
            <p className="fh-eyebrow">Dallas–Fort Worth Real Estate</p>
            <h1 id="figma-hero-heading">Professional representation. Trusted guidance for your next move.</h1>
            <p className="fh-lede">
              Navigating the competitive DFW market doesn&apos;t have to be overwhelming. We pair premier local
              real-estate expertise with accessible, approachable guidance so you can buy or sell with absolute
              confidence.
            </p>
          </div>
          <div className="fh-hero-actions">
            <Link href={FIGMA_HOME_CTA.searchHomes.href} className="fh-btn fh-btn-navy">
              {FIGMA_HOME_CTA.searchHomes.label}
            </Link>
            <Link href={FIGMA_HOME_CTA.startBuying.href} className="fh-btn fh-btn-teal">
              {FIGMA_HOME_CTA.startBuying.label}
            </Link>
            <Link href={FIGMA_HOME_CTA.sellMyHome.href} className="fh-btn fh-btn-navy-outline">
              {FIGMA_HOME_CTA.sellMyHome.label}
            </Link>
          </div>
        </div>
        <div className="fh-hero-right">
          <div className="fh-hero-media">
            <p className="fh-placeholder">
              [Premium Dallas–Fort Worth Real Estate Architectural Photography Placeholder]
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section className="fh-section fh-section-white fh-services" aria-labelledby="figma-services-heading">
      <div className="fh-shell">
        <div className="fh-section-intro">
          <p className="fh-eyebrow">Our capabilities</p>
          <h2 id="figma-services-heading">Professional pathways to match your goals</h2>
        </div>
        <ul className="fh-service-grid">
          {FIGMA_SERVICES.map((service) => (
            <li key={service.title}>
              <article className="fh-service-card">
                <div className="fh-icon-well" aria-hidden="true">
                  <House className="size-6" />
                </div>
                <h3>{service.title}</h3>
                <p>{service.body}</p>
                <Link href={service.href} className="fh-text-link">
                  Learn More <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function MeetDebra() {
  return (
    <section className="fh-meet" aria-labelledby="figma-debra-heading">
      <div className="fh-shell fh-meet-grid">
        <div className="fh-meet-portrait">
          <p className="fh-placeholder">
            [Debra Allen Portrait Placeholder — Warm, professional real-estate advisor portrait]
          </p>
        </div>
        <div className="fh-meet-copy">
          <div className="fh-meet-text">
            <p className="fh-eyebrow">Your REALTOR® &amp; local guide</p>
            <h2 id="figma-debra-heading">Guidance first, pressure never. Meet Debra Allen.</h2>
            <p>
              As an established REALTOR® serving the Dallas–Fort Worth metroplex, Debra Allen has spent her career
              redefining what a real-estate relationship looks like. Built on a foundation of professional advocacy,
              clear education, and lifelong community commitment, she guides buyers and sellers through complex
              transactions without high-pressure sales tactics.
            </p>
            <p>
              Whether you are looking to purchase your first home, transition your equity, or navigate the custom build
              process, Debra delivers strategic support that honors your unique timeline.
            </p>
          </div>
          <div className="fh-meet-actions">
            <Link href={FIGMA_HOME_CTA.aboutDebra.href} className="fh-btn fh-btn-navy">
              {FIGMA_HOME_CTA.aboutDebra.label}
            </Link>
            <Link href={FIGMA_HOME_CTA.consultation.href} className="fh-btn fh-btn-teal">
              {FIGMA_HOME_CTA.consultation.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function Markets() {
  return (
    <section className="fh-section fh-section-white fh-markets" aria-labelledby="figma-markets-heading">
      <div className="fh-shell">
        <div className="fh-section-intro">
          <p className="fh-eyebrow">Locations we serve</p>
          <h2 id="figma-markets-heading">Serving the Dallas–Fort Worth Metroplex</h2>
        </div>
        <ul className="fh-city-grid">
          {FIGMA_CITIES.map((city) => (
            <li key={city.name}>
              <article className="fh-city-card">
                <div className="fh-city-well">
                  <p className="fh-placeholder">{city.well}</p>
                </div>
                <div className="fh-city-copy">
                  <h3>{city.name}</h3>
                  <Link href={city.href}>Explore active MLS listings →</Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function ListingPlaceholderCard() {
  return (
    <article className="fh-listing-card">
      <div className="fh-listing-photo">
        <p className="fh-placeholder">
          [Featured Property Photography Area — Active MLS Feed Integration Point]
        </p>
      </div>
      <div className="fh-listing-body">
        <div className="fh-listing-copy">
          <p className="fh-listing-price">[Price Placeholder]</p>
          <p className="fh-listing-address">[Property Address Placeholder]</p>
          <p className="fh-listing-meta">[City, TX] · Dallas–Fort Worth MLS</p>
        </div>
        <p className="fh-listing-stats">
          <span>[X] Beds</span>
          <span>[Y] Baths</span>
          <span>[Sq Ft] Sq Ft</span>
        </p>
      </div>
    </article>
  )
}

function FeaturedListings({ listings }: { listings: PropertySearchResult }) {
  const connected = listings.status === "connected" ? listings.listings.slice(0, 3) : []

  return (
    <section className="fh-section fh-listings" aria-labelledby="figma-listings-heading">
      <div className="fh-shell">
        <div className="fh-listings-head">
          <div>
            <p className="fh-eyebrow">Featured listings</p>
            <h2 id="figma-listings-heading">Find Your Next Home</h2>
          </div>
          <Link href={FIGMA_HOME_CTA.searchAllHomes.href} className="fh-btn fh-btn-navy">
            {FIGMA_HOME_CTA.searchAllHomes.label}
          </Link>
        </div>

        {connected.length > 0 ? (
          <ul className="fh-listing-grid">
            {connected.map((listing) => (
              <li key={listing.id}>
                <article className="fh-listing-card">
                  <div className="fh-listing-photo" aria-hidden="true" />
                  <div className="fh-listing-body">
                    <div className="fh-listing-copy">
                      <p className="fh-listing-price">{formatPrice(listing.price)}</p>
                      <p className="fh-listing-address">{listing.address}</p>
                      <p className="fh-listing-meta">{listing.city} · Dallas–Fort Worth MLS</p>
                    </div>
                    <p className="fh-listing-stats">
                      <span>{listing.beds} Beds</span>
                      <span>{listing.baths} Baths</span>
                      <span>{listing.sqft.toLocaleString()} Sq Ft</span>
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <div className="fh-listing-empty">
            <p className="sr-only" role="status">
              {listings.status === "error"
                ? "Search is temporarily unavailable"
                : "Live listings aren’t connected yet"}
            </p>
            <ul className="fh-listing-grid">
              <li><ListingPlaceholderCard /></li>
              <li><ListingPlaceholderCard /></li>
              <li><ListingPlaceholderCard /></li>
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

function GuidanceSplit() {
  return (
    <section className="fh-section fh-section-white fh-guidance" aria-labelledby="figma-guidance-heading">
      <div className="fh-shell fh-split">
        <article className="fh-split-card fh-split-buyer">
          <p className="fh-eyebrow">Buyer strategy</p>
          <h2 id="figma-guidance-heading">Buying with absolute clarity</h2>
          <ul>
            {FIGMA_BUYER_POINTS.map((point) => (
              <li key={point}>
                <Check className="size-[18px]" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <Link href={FIGMA_HOME_CTA.buyerResources.href} className="fh-btn fh-btn-teal">
            {FIGMA_HOME_CTA.buyerResources.label}
          </Link>
        </article>
        <article className="fh-split-card fh-split-seller">
          <p className="fh-eyebrow">Seller pathway</p>
          <h2>Maximize value, minimize stress</h2>
          <ul>
            {FIGMA_SELLER_POINTS.map((point) => (
              <li key={point}>
                <Check className="size-[18px]" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <Link href={FIGMA_HOME_CTA.homeValuation.href} className="fh-btn fh-btn-navy-outline">
            {FIGMA_HOME_CTA.homeValuation.label}
          </Link>
        </article>
      </div>
    </section>
  )
}

function KnowledgeBase() {
  return (
    <section className="fh-section fh-knowledge" aria-labelledby="figma-knowledge-heading">
      <div className="fh-shell">
        <div className="fh-section-intro">
          <p className="fh-eyebrow">Knowledge base</p>
          <h2 id="figma-knowledge-heading">Empower your decisions</h2>
        </div>
        <ul className="fh-knowledge-grid">
          {FIGMA_KNOWLEDGE.map((item) => (
            <li key={item.title}>
              <article className="fh-knowledge-card">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <Link href={item.href} className="fh-text-link fh-access-link">
                  Access Guide <ArrowRight className="size-3" aria-hidden="true" />
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="fh-final" aria-labelledby="figma-final-heading">
      <div className="fh-final-inner">
        <p className="fh-eyebrow fh-eyebrow-on-dark">Ready to take the next step?</p>
        <h2 id="figma-final-heading">Let’s build a clear, pressure-free path to homeownership</h2>
        <p>
          Our dedicated team is ready to deliver the high-level professional representation you deserve in the DFW
          metroplex. Contact Debra Allen to start planning your transaction.
        </p>
        <div className="fh-final-actions">
          <Link href={FIGMA_HOME_CTA.searchHomes.href} className="fh-btn fh-btn-light">
            {FIGMA_HOME_CTA.searchHomes.label}
          </Link>
          <Link href={FIGMA_HOME_CTA.startBuying.href} className="fh-btn fh-btn-gold-outline">
            {FIGMA_HOME_CTA.startBuying.label}
          </Link>
          <Link href={FIGMA_HOME_CTA.sellMyHome.href} className="fh-btn fh-btn-light-outline">
            {FIGMA_HOME_CTA.sellMyHome.label}
          </Link>
        </div>
      </div>
    </section>
  )
}
