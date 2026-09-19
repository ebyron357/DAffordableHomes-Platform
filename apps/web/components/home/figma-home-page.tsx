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
      <div className="fh-shell fh-hero-grid">
        <div className="fh-hero-copy">
          <p className="fh-eyebrow">Dallas–Fort Worth Real Estate</p>
          <h1 id="figma-hero-heading">Professional representation. Trusted guidance for your next move.</h1>
          <p className="fh-lede">
            Navigating the competitive DFW market doesn&apos;t have to be overwhelming. We pair premier local
            real-estate expertise with accessible, approachable guidance so you can buy or sell with absolute
            confidence.
          </p>
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
        <div className="fh-hero-media">
          <Image
            src="/images/black-family-home-pexels-7114188.webp"
            alt="A Black family of five holding hands together in a bright living room"
            fill
            priority
            sizes="(min-width: 1024px) 548px, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section className="fh-section fh-section-white" aria-labelledby="figma-services-heading">
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
    <section className="fh-section fh-meet" aria-labelledby="figma-debra-heading">
      <div className="fh-shell fh-meet-grid">
        <div className="fh-meet-portrait">
          <Image
            src="/images/debra-allen-primary-about.webp"
            alt="Debra Allen smiling in a yellow blazer at a kitchen counter"
            fill
            sizes="(min-width: 1024px) 440px, 100vw"
            className="object-cover object-[48%_center]"
          />
        </div>
        <div className="fh-meet-copy">
          <p className="fh-eyebrow">Your REALTOR® &amp; local guide</p>
          <h2 id="figma-debra-heading">Guidance first, pressure never. Meet Debra Allen.</h2>
          <p>
            As a REALTOR® serving Garland and the Dallas–Fort Worth metroplex, Debra Allen helps buyers and sellers
            slow the process down. Built on professional advocacy, clear education, and community commitment, she
            guides people through complex transactions without high-pressure sales tactics.
          </p>
          <p>
            Whether you are looking to purchase your first home, transition your equity, or navigate a custom build,
            Debra delivers strategic support that honors your unique timeline.
          </p>
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
    <section className="fh-section fh-section-white" aria-labelledby="figma-markets-heading">
      <div className="fh-shell">
        <div className="fh-section-intro">
          <p className="fh-eyebrow">Locations we serve</p>
          <h2 id="figma-markets-heading">Serving the Dallas–Fort Worth Metroplex</h2>
        </div>
        <ul className="fh-city-grid">
          {FIGMA_CITIES.map((city) => (
            <li key={city.name}>
              <article className="fh-city-card">
                <div className="fh-city-well" aria-hidden="true" />
                <h3>{city.name}</h3>
                <Link href={city.href}>
                  {city.name === "Garland" ? "Read the Garland area guide →" : "Explore North Texas area guides →"}
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function FeaturedListings({ listings }: { listings: PropertySearchResult }) {
  const connected = listings.status === "connected" ? listings.listings.slice(0, 3) : []

  return (
    <section className="fh-section" aria-labelledby="figma-listings-heading">
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
                    <p className="fh-listing-price">{formatPrice(listing.price)}</p>
                    <p className="fh-listing-address">{listing.address}</p>
                    <p className="fh-listing-meta">
                      {listing.city} · Dallas–Fort Worth MLS
                    </p>
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
            <div className="fh-listing-grid fh-listing-grid-empty" aria-hidden="true">
              <div className="fh-listing-card">
                <div className="fh-listing-photo" />
                <div className="fh-listing-body">
                  <p className="fh-listing-slot">Listing slot</p>
                  <p className="fh-listing-meta">Waiting for an approved MLS/IDX feed</p>
                </div>
              </div>
              <div className="fh-listing-card">
                <div className="fh-listing-photo" />
                <div className="fh-listing-body">
                  <p className="fh-listing-slot">Listing slot</p>
                  <p className="fh-listing-meta">No invented prices or addresses</p>
                </div>
              </div>
              <div className="fh-listing-card">
                <div className="fh-listing-photo" />
                <div className="fh-listing-body">
                  <p className="fh-listing-slot">Listing slot</p>
                  <p className="fh-listing-meta">Real homes appear here when connected</p>
                </div>
              </div>
            </div>
            <div className="fh-listing-notice" role="status">
              <h3>
                {listings.status === "error"
                  ? "Search is temporarily unavailable"
                  : "Live listings aren’t connected yet"}
              </h3>
              <p>
                {listings.status === "connected"
                  ? "The feed is connected, but no listings are available to display right now."
                  : listings.reason}
              </p>
              <Link href="/homes">See the homes search status</Link>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function GuidanceSplit() {
  return (
    <section className="fh-section fh-section-white" aria-labelledby="figma-guidance-heading">
      <div className="fh-shell fh-split">
        <article className="fh-split-card">
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
          <Link href={FIGMA_HOME_CTA.buyerResources.href} className="fh-btn fh-btn-navy">
            {FIGMA_HOME_CTA.buyerResources.label}
          </Link>
        </article>
        <article className="fh-split-card">
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
          <Link href={FIGMA_HOME_CTA.homeValuation.href} className="fh-btn fh-btn-navy">
            {FIGMA_HOME_CTA.homeValuation.label}
          </Link>
        </article>
      </div>
    </section>
  )
}

function KnowledgeBase() {
  return (
    <section className="fh-section" aria-labelledby="figma-knowledge-heading">
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
                <Link href={item.href} className="fh-text-link">
                  Access Guide <ArrowRight className="size-3" aria-hidden="true" />
                </Link>
              </article>
            </li>
          ))}
        </ul>
        <p className="fh-knowledge-more">
          Homebuyer programs continue on the site:{" "}
          <Link href="/programs/naca">NACA homebuyer help</Link>
          {" · "}
          <Link href="/programs/homes-for-heroes">Homes for Heroes guidance</Link>
        </p>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="fh-final" aria-labelledby="figma-final-heading">
      <div className="fh-shell fh-final-inner">
        <p className="fh-eyebrow fh-eyebrow-on-dark">Ready to take the next step?</p>
        <h2 id="figma-final-heading">Let’s build a clear, pressure-free path to homeownership</h2>
        <p>
          Debra Allen is ready to deliver professional representation in the DFW metroplex. Start planning your
          transaction when you are ready—no invented urgency, and no fabricated promises.
        </p>
        <div className="fh-final-actions">
          <Link href={FIGMA_HOME_CTA.searchHomes.href} className="fh-btn fh-btn-light">
            {FIGMA_HOME_CTA.searchHomes.label}
          </Link>
          <Link href={FIGMA_HOME_CTA.startBuying.href} className="fh-btn fh-btn-light-outline">
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
