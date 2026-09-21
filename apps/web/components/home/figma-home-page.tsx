import Image from "next/image"
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

/**
 * Approved homepage imagery.
 *
 * Provenance, licence, crop rule and alt text for each asset are recorded in
 * `docs/05-content/IMAGE_ASSET_REGISTER.md`. The `objectPosition` values below
 * are the register's crop rules, not free-hand choices: Debra's face has to
 * stay legible at every breakpoint, so her portrait is pinned at `48% center`.
 */
const HERO_IMAGE = {
  src: "/images/black-family-home-pexels-7114188.webp",
  alt: "A Black family of five holding hands together in a bright living room",
  objectPosition: "center",
} as const

const DEBRA_PORTRAIT = {
  src: "/images/debra-allen-primary-about.webp",
  alt: "Debra Allen smiling in a yellow blazer at a kitchen counter",
  objectPosition: "48% center",
} as const

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
            <Image
              src={HERO_IMAGE.src}
              alt={HERO_IMAGE.alt}
              fill
              sizes="(max-width: 1100px) 100vw, 548px"
              style={{ objectPosition: HERO_IMAGE.objectPosition }}
              priority
              className="fh-hero-image"
            />
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
        <figure className="fh-meet-portrait">
          <Image
            src={DEBRA_PORTRAIT.src}
            alt={DEBRA_PORTRAIT.alt}
            fill
            sizes="(max-width: 1100px) 100vw, 440px"
            style={{ objectPosition: DEBRA_PORTRAIT.objectPosition }}
            className="fh-meet-image"
          />
          <figcaption className="fh-portrait-plate">
            <span>Your REALTOR&reg;</span>
            <strong>Debra Allen</strong>
          </figcaption>
        </figure>
        <div className="fh-meet-copy">
          <div className="fh-meet-text">
            <p className="fh-eyebrow">Your REALTOR® &amp; local guide</p>
            <h2 id="figma-debra-heading">Guidance first, pressure never. Meet Debra Allen.</h2>
            <p>
              Debra Allen is a REALTOR® working with buyers and sellers across the Dallas–Fort Worth metroplex. She
              built her practice around a simple idea: people make better decisions about a home when someone takes
              the time to explain what is actually happening, and when nobody is pushing them toward a signature.
            </p>
            <p>
              Whether you are buying your first home, moving the equity you have already built, or weighing a new
              build, you get straight answers, the trade-offs laid out plainly, and a pace that matches your timeline
              instead of somebody else&apos;s.
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
        <div className="fh-section-intro fh-section-intro-left">
          <p className="fh-eyebrow">Locations we serve</p>
          <h2 id="figma-markets-heading">Serving the Dallas–Fort Worth Metroplex</h2>
          <p className="fh-section-lede">
            Garland is home base. These are the North Texas cities buyers most often ask about — start a search in any
            of them, or open the Garland guide for a closer local read.
          </p>
        </div>
        <ul className="fh-market-list">
          {FIGMA_CITIES.map((city) => (
            <li key={city.name}>
              <Link href={city.href} className="fh-market-row">
                <span className="fh-market-name">{city.name}</span>
                <span className="fh-market-county">{city.county}</span>
                <ArrowRight className="size-4 fh-market-arrow" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/**
 * Honest empty state for the listings band.
 *
 * PRODUCT_REQUIREMENTS.md forbids fabricated listings, and a card shaped like a
 * listing with bracketed text inside it is a fabricated listing with the mask
 * off. When no MLS/IDX feed is connected the section says so in plain language
 * and offers the two things that are actually available right now.
 */
function ListingsEmptyState({ reason, errored }: { reason: string; errored: boolean }) {
  return (
    <div className="fh-listing-empty" role="status">
      <div className="fh-listing-empty-copy">
        <p className="fh-eyebrow">{errored ? "Search temporarily unavailable" : "Live listings not connected yet"}</p>
        <h3>{errored ? "The property search is having trouble right now." : "No live MLS feed is connected to this site yet."}</h3>
        <p>{reason}</p>
      </div>
      <div className="fh-listing-empty-actions">
        <Link href={FIGMA_HOME_CTA.consultation.href} className="fh-btn fh-btn-navy">
          Ask Debra what&apos;s on the market
        </Link>
        <Link href="/first-time-buyers" className="fh-btn fh-btn-teal">
          Get ready to buy
        </Link>
      </div>
    </div>
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
          <ListingsEmptyState
            errored={listings.status === "error"}
            reason={listings.status === "connected" ? "" : listings.reason}
          />
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
                  Open <ArrowRight className="size-3" aria-hidden="true" />
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
          Bring the question you have been sitting on. Debra will tell you what the next step actually is — and what
          it is not — so you can decide with the whole picture in front of you.
        </p>
        <div className="fh-final-actions">
          <Link href={FIGMA_HOME_CTA.consultation.href} className="fh-btn fh-btn-light">
            {FIGMA_HOME_CTA.consultation.label}
          </Link>
          <Link href={FIGMA_HOME_CTA.startBuying.href} className="fh-btn fh-btn-gold-outline">
            {FIGMA_HOME_CTA.startBuying.label}
          </Link>
          <Link href={FIGMA_HOME_CTA.searchHomes.href} className="fh-btn fh-btn-light-outline">
            {FIGMA_HOME_CTA.searchHomes.label}
          </Link>
        </div>
      </div>
    </section>
  )
}
