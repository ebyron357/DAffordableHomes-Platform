import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check, Home, KeyRound } from "lucide-react"
import {
  FIGMA_BUYER_POINTS,
  FIGMA_PATHWAY_HIGHLIGHTS,
  FIGMA_CITIES,
  FIGMA_HOME_CTA,
  FIGMA_KNOWLEDGE,
  FIGMA_SELLER_POINTS,
  FIGMA_SERVICES,
} from "@/lib/figma-home"
import { formatArticleDate } from "@/lib/blog/format"
import type { ArticleSummary } from "@/lib/blog/types"
import type { PropertySearchResult } from "@/lib/mls/provider"
import { DEBRA_DESK_BAND } from "@/lib/content/imagery"
import { BrandMotif } from "@/components/page/brand-motif"
import { AmbientMotion } from "@/components/media/ambient-motion"
import { resolveHeroMotion } from "@/lib/media/ambient-motion"
import { FigmaHomeFooter } from "@/components/home/figma-home-footer"
import { FigmaHomeHeader } from "@/components/home/figma-home-header"
import { HomebuyingPathQuiz } from "@/components/home/homebuying-path-quiz"

/**
 * Approved homepage imagery.
 *
 * Provenance, licence, crop rule and alt text for each asset are recorded in
 * `docs/05-content/IMAGE_ASSET_REGISTER.md`. The `objectPosition` values are
 * the register's crop rules, not free-hand choices: Debra's face has to stay
 * whole at every breakpoint.
 */

const DEBRA_PORTRAIT = {
  src: "/images/debra-allen-primary-about.webp",
  alt: "Debra Allen smiling in a yellow blazer at a kitchen counter",
  objectPosition: "48% center",
} as const

/* The closing band is full-bleed and far wider than the source, so it takes
   the register's band crop rather than the upright-frame one. At 30% the band
   removed 22% off the top of the image, which clipped the top of her head. */
const DEBRA_DESK = DEBRA_DESK_BAND

/**
 * Verified positioning qualifiers for the band under the hero.
 *
 * Deliberately not metrics. `lib/site.ts` keeps years of experience, families
 * served and transaction counts `null` until verified, and the benchmark sites'
 * big-number stat blocks are the one pattern this site cannot borrow. Each line
 * below is a positioning fact the repository already asserts.
 */
const TRUST_MARKS = [
  { label: "REALTOR®", detail: "Licensed residential representation" },
  { label: "Garland + DFW", detail: "North Texas is the home market" },
  { label: "Education first", detail: "You understand it before you sign it" },
  { label: "No pressure", detail: "Guidance that matches your timeline" },
] as const

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)
}

export function FigmaHomePage({
  listings,
  latestArticles,
}: {
  listings: PropertySearchResult
  latestArticles: ArticleSummary[]
}) {
  return (
    <div className="figma-home">
      <FigmaHomeHeader />
      <Hero />
      <TrustBand />
      <Pathways />
      <MeetDebra />
      <FindYourPath />
      <Markets />
      <FeaturedListings listings={listings} />
      <GuidanceSplit />
      <KnowledgeBase articles={latestArticles} />
      <FinalCta />
      <FigmaHomeFooter />
    </div>
  )
}

/**
 * Hero.
 *
 * One composition, not a navy block beside a picture. The copy sits on the
 * navy field at the left of the content shell; the approved exterior runs from
 * the middle of the shell to the right edge of the viewport and the field
 * blends into it along the seam, so the photograph emerges from the brand
 * colour rather than butting against it. A small white panel straddles that
 * seam and points to the homepage quiz — the one interactive thing on the page
 * — which is what ties the two halves together and gives the viewport depth
 * without ornament.
 *
 * The first viewport has to say four things without the logo: the practice
 * (the eyebrow is the mark's own tagline), the person (Debra's byline, with her
 * approved portrait), the market (the headline) and a next action (the CTAs).
 *
 * The section is full-bleed. The page used to be locked to a 1440px column,
 * which on any wider monitor boxed the whole site inside near-white margins
 * and made the hero read as a card floating in empty space. Fields now run
 * edge to edge; only content is held to the 1440 shell.
 */
function Hero() {
  const heroMotion = resolveHeroMotion()

  return (
    <section className="fh-hero" aria-labelledby="figma-hero-heading">
      <div className="fh-hero-inner">
        <div className="fh-hero-copy">
          <p className="fh-hero-tagline">Affordable · Accessible · Achievable</p>
          <h1 id="figma-hero-heading">
            Buying a home in <em>Dallas–Fort Worth</em>, with someone who explains it.
          </h1>
          <p className="fh-lede">
            Buyer and seller representation across Garland and the DFW metroplex, done the way Debra teaches:
            plainly, at your pace, and without pushing anyone toward a signature.
          </p>
          <div className="fh-hero-actions">
            <Link href={FIGMA_HOME_CTA.consultation.href} className="fh-btn fh-btn-gold">
              {FIGMA_HOME_CTA.consultation.label}
            </Link>
            <Link href={FIGMA_HOME_CTA.startBuying.href} className="fh-btn fh-btn-light-outline">
              {FIGMA_HOME_CTA.startBuying.label}
            </Link>
          </div>
          {/* The person behind the practice, in the first viewport. The
              portrait is the register's approved primary image at its crop
              rule; it is decorative here because the name beside it carries
              the meaning, and the same photograph anchors Meet Debra below. */}
          <p className="fh-hero-byline">
            <Image
              src={DEBRA_PORTRAIT.src}
              alt=""
              aria-hidden="true"
              width={64}
              height={64}
              sizes="64px"
              style={{ objectPosition: DEBRA_PORTRAIT.objectPosition }}
              className="fh-hero-byline-portrait"
            />
            <span className="fh-hero-byline-text">
              <strong>Debra Allen, REALTOR®</strong>
              <span>Garland + Dallas–Fort Worth</span>
            </span>
          </p>
        </div>
      </div>

      {/* The first viewport has to read as Dallas–Fort Worth residential real
          estate. It used to carry a licensed photograph of a family holding
          hands in a living room — a warm picture of the wrong subject: an
          interior, on the hero of a site about buying and selling houses.

          The approved generated exterior now layers over this scene when its
          registered still is present. The drawn roofline remains as the safe
          fallback if that asset is removed. The image is generic residential
          imagery and must not be presented as a real listing, address, client
          property, transaction, or verified North Texas neighbourhood. */}
      <div className="fh-hero-media">
        <div className="fh-hero-scene" aria-hidden="true">
          <span className="fh-hero-sky" />
          <span className="fh-hero-sun" />
          <BrandMotif variant="roofline" className="dh-motif fh-hero-roofs fh-hero-roofs-far" />
          <BrandMotif variant="roofline" className="dh-motif fh-hero-roofs fh-hero-roofs-near" />
          <span className="fh-hero-ground" />
        </div>
        {/* The approved generated exterior layers over the drawing rather than
            replacing it in the markup. The scene above is the fallback if the
            still is ever absent; the still renders alone while no motion
            encodes are approved. */}
        {heroMotion ? <AmbientMotion asset={heroMotion} sizes="(min-width: 900px) 58vw, 100vw" priority /> : null}
        {/* Mobile only: the copy sits beneath the scene there, so a short
            bottom fade carries it into the navy panel. */}
        <span className="fh-hero-fade" aria-hidden="true" />
      </div>

      {/* Straddles the seam between the navy field and the photograph at
          desktop; a plain block under the copy when stacked. It is a real
          entry to the quiz further down the page, not decoration. */}
      <Link href="#find-your-path" className="fh-hero-path">
        <span className="fh-hero-path-label">Find your homebuying path</span>
        <span className="fh-hero-path-title">
          Not sure where to start? Five questions point you to the right first step.
        </span>
        <span className="fh-hero-path-meta">
          About a minute · no email needed
          <ArrowRight className="size-4" aria-hidden="true" />
        </span>
      </Link>
    </section>
  )
}

/** Teal band of verified qualifiers, bridging the hero into the page. */
function TrustBand() {
  return (
    <section className="fh-trust" aria-label="What this practice is">
      <ul className="fh-shell fh-trust-list">
        {TRUST_MARKS.map((mark) => (
          <li key={mark.label}>
            <strong>{mark.label}</strong>
            <span>{mark.detail}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/**
 * Buying and selling as the two primary paths.
 *
 * The previous version was two solid rectangles, each holding a serif number,
 * a heading, a paragraph and a button. That is a dashboard, and the numbering
 * implied a sequence that does not exist — nobody buys *and then* sells in the
 * order 01, 02. The numbers are gone.
 *
 * What replaces them is a composition: unequal widths, a vertical offset, an
 * icon badge that says what the path *is* before the sentence does, three
 * highlights of the actual work, and the brand's architectural linework washed
 * into the corner of each field. The ornament does the job a photograph would
 * do here, because the approved register has no buying- or selling-specific
 * imagery and a repeated portrait would be worse than none.
 */
function Pathways() {
  const [buy, sell, ...rest] = FIGMA_SERVICES

  return (
    <section className="fh-section fh-pathways" aria-labelledby="figma-services-heading">
      <div className="fh-shell">
        <div className="fh-section-intro fh-section-intro-left">
          <p className="fh-eyebrow">Two ways in</p>
          <h2 id="figma-services-heading">Whichever side of the move you are on</h2>
        </div>

        <div className="fh-path-grid">
          <article className="fh-path fh-path-buy">
            <BrandMotif variant="keys" className="dh-motif fh-path-art" />
            <div className="fh-path-body">
              <span className="fh-path-badge">
                <KeyRound aria-hidden="true" />
              </span>
              <p className="fh-path-label">For buyers</p>
              <h3>{buy.title}</h3>
              <p className="fh-path-copy">{buy.body}</p>
              <ul className="fh-path-points">
                {FIGMA_PATHWAY_HIGHLIGHTS.buy.map((point) => (
                  <li key={point}>
                    <Check className="size-[17px]" aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <Link href={buy.href} className="fh-btn fh-btn-light">
                Start buying
              </Link>
            </div>
          </article>

          <article className="fh-path fh-path-sell">
            <BrandMotif variant="route" className="dh-motif fh-path-art" />
            <div className="fh-path-body">
              <span className="fh-path-badge">
                <Home aria-hidden="true" />
              </span>
              <p className="fh-path-label">For sellers</p>
              <h3>{sell.title}</h3>
              <p className="fh-path-copy">{sell.body}</p>
              <ul className="fh-path-points">
                {FIGMA_PATHWAY_HIGHLIGHTS.sell.map((point) => (
                  <li key={point}>
                    <Check className="size-[17px]" aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <Link href={sell.href} className="fh-btn fh-btn-light">
                Talk about selling
              </Link>
            </div>
          </article>
        </div>

        <ul className="fh-service-row">
          {rest.map((service) => (
            <li key={service.title}>
              <Link href={service.href} className="fh-service-link">
                <span className="fh-service-title">{service.title}</span>
                <span className="fh-service-body">{service.body}</span>
                <ArrowRight className="size-4 fh-service-arrow" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/**
 * "Find Your Homebuying Path" — the homepage's one interactive module.
 *
 * Sits after Meet Debra, so the page reads in order: what the practice is,
 * who runs it, then where the visitor fits. Placing it here also breaks the
 * two navy fields (Meet Debra, Markets) with a light one, which is what gives
 * the middle of the page its rhythm. The hero's seam panel links straight to
 * this section. The quiz is a client component; this wrapper is server-rendered.
 */
function FindYourPath() {
  return (
    <section id="find-your-path" className="fh-section fh-pathquiz" aria-labelledby="figma-path-heading">
      <div className="fh-shell fh-pathquiz-grid">
        <div className="fh-pathquiz-intro">
          <p className="fh-eyebrow">Find your homebuying path</p>
          <h2 id="figma-path-heading">Not sure what your next move in DFW should be?</h2>
          <p className="fh-pathquiz-lede">
            Buying a first home in Garland, selling in Plano, relocating to Dallas–Fort Worth from out of state, or
            checking whether a Homes for Heroes program applies: each starts in a different place. Answer a few
            questions the way you would answer Debra, and the quiz tells you where to begin on this site.
          </p>
          <ul className="fh-pathquiz-facts">
            <li>
              <Check className="size-4" aria-hidden="true" />
              <span>Five questions, about a minute</span>
            </li>
            <li>
              <Check className="size-4" aria-hidden="true" />
              <span>Your result appears immediately; no email or phone number</span>
            </li>
            <li>
              <Check className="size-4" aria-hidden="true" />
              <span>Educational only: not a pre-approval, valuation or eligibility decision</span>
            </li>
          </ul>
        </div>
        <HomebuyingPathQuiz />
      </div>
    </section>
  )
}

/**
 * Debra at the scale the benchmarks set for agent presence: a large portrait
 * that is the composition rather than an inset beside it, with a navy panel
 * carrying the copy and a gold rule tying it to the system.
 */
function MeetDebra() {
  return (
    <section className="fh-meet" aria-labelledby="figma-debra-heading">
      <div className="fh-meet-grid">
        <figure className="fh-meet-portrait">
          <Image
            src={DEBRA_PORTRAIT.src}
            alt={DEBRA_PORTRAIT.alt}
            fill
            sizes="(max-width: 1100px) 100vw, 55vw"
            style={{ objectPosition: DEBRA_PORTRAIT.objectPosition }}
            className="fh-meet-image"
          />
        </figure>

        <div className="fh-meet-panel">
          <p className="fh-eyebrow fh-eyebrow-on-dark">Your REALTOR® &amp; local guide</p>
          <h2 id="figma-debra-heading">Guidance first. Pressure never.</h2>
          <p className="fh-meet-name">Debra Allen, REALTOR®</p>
          <p>
            Debra works with buyers and sellers across the Dallas–Fort Worth metroplex, and she built her practice
            around one idea: people make better decisions about a home when somebody takes the time to explain what is
            actually happening.
          </p>
          <p>
            That means the trade-offs laid out plainly, the numbers tested before you fall for a house, and the parts
            of the process that belong to a lender, an inspector or an attorney named as theirs. First home, moving
            equity you have already built, or weighing a new build — the pace is yours.
          </p>
          <div className="fh-meet-actions">
            <Link href={FIGMA_HOME_CTA.aboutDebra.href} className="fh-btn fh-btn-light">
              {FIGMA_HOME_CTA.aboutDebra.label}
            </Link>
            <Link href={FIGMA_HOME_CTA.consultation.href} className="fh-btn fh-btn-gold-outline">
              {FIGMA_HOME_CTA.consultation.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * Markets on a navy field with Garland pulled out as the home market.
 *
 * The supporting line is each city's county — a verifiable civic fact. The
 * benchmark sites give each neighbourhood a character description; those are
 * written from lived local knowledge, so inventing equivalents here would be
 * exactly the fabrication the publishing standard forbids. Garland gets the
 * feature treatment because it is the one market with a real guide behind it.
 */
function Markets() {
  const garland = FIGMA_CITIES.find((city) => city.name === "Garland")
  const others = FIGMA_CITIES.filter((city) => city.name !== "Garland")

  return (
    <section className="fh-section fh-markets" aria-labelledby="figma-markets-heading">
      <div className="fh-shell">
        <div className="fh-section-intro fh-section-intro-left fh-section-intro-dark">
          <p className="fh-eyebrow fh-eyebrow-on-dark">Where we work</p>
          <h2 id="figma-markets-heading">Garland, and the North Texas cities around it</h2>
          <p className="fh-section-lede fh-section-lede-dark">
            Start a search in any of these, or open the Garland guide for a closer local read.
          </p>
        </div>

        <div className="fh-markets-grid">
          {garland && (
            <Link href={garland.href} className="fh-market-feature">
              <span className="fh-market-feature-label">Home market</span>
              <span className="fh-market-feature-name">{garland.name}</span>
              <span className="fh-market-feature-county">{garland.county}, Texas</span>
              <span className="fh-market-feature-cta">
                Open the Garland guide <ArrowRight className="size-4" aria-hidden="true" />
              </span>
            </Link>
          )}

          <ul className="fh-market-list">
            {others.map((city) => (
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
      </div>
    </section>
  )
}

/**
 * Honest empty state for the listings band.
 *
 * PRODUCT_REQUIREMENTS.md forbids fabricated listings, and a card shaped like a
 * listing with bracketed text inside it is a fabricated listing with the mask
 * off. When no MLS/IDX feed is connected the section says so plainly and offers
 * the two things that are genuinely available.
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
    <section className="fh-section fh-section-white fh-listings" aria-labelledby="figma-listings-heading">
      <div className="fh-shell">
        <div className="fh-listings-head">
          <div>
            <p className="fh-eyebrow">Find a home</p>
            <h2 id="figma-listings-heading">Homes across Dallas–Fort Worth</h2>
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

/** Buyer and seller strategy, each on its own brand field. */
function GuidanceSplit() {
  return (
    <section className="fh-section fh-guidance" aria-labelledby="figma-guidance-heading">
      <div className="fh-shell fh-split">
        <article className="fh-split-card fh-split-buyer">
          <p className="fh-eyebrow fh-eyebrow-on-dark">Buyer strategy</p>
          <h2 id="figma-guidance-heading">Buying in Dallas–Fort Worth with the numbers in front of you</h2>
          <ul>
            {FIGMA_BUYER_POINTS.map((point) => (
              <li key={point}>
                <Check className="size-[18px]" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <Link href={FIGMA_HOME_CTA.buyerResources.href} className="fh-btn fh-btn-light">
            {FIGMA_HOME_CTA.buyerResources.label}
          </Link>
        </article>
        <article className="fh-split-card fh-split-seller">
          <p className="fh-eyebrow">Seller pathway</p>
          <h2>Selling a home in North Texas without the guesswork</h2>
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

/**
 * Knowledge section.
 *
 * The top is the CMS: the three newest published articles, read through the
 * same `listArticles()` path as /blog. Publishing a guide in the Studio changes
 * the homepage with no code change and no deploy, which is what keeps the site
 * from reading as something built once and left.
 *
 * The evergreen planning destinations below stay in the repository — they are
 * effectively navigation, not content an editor should maintain.
 */
function KnowledgeBase({ articles }: { articles: ArticleSummary[] }) {
  return (
    <section className="fh-section fh-knowledge" aria-labelledby="figma-knowledge-heading">
      <div className="fh-shell">
        <div className="fh-section-intro fh-section-intro-left">
          <p className="fh-eyebrow">Learn before you commit</p>
          <h2 id="figma-knowledge-heading">Homebuyer guides and tools for Dallas–Fort Worth</h2>
        </div>

        {articles.length > 0 && (
          <div className="fh-latest">
            <div className="fh-latest-head">
              <h3>Latest guides</h3>
              <Link href="/blog" className="fh-text-link">
                All guides <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
            <ul className="fh-latest-list">
              {articles.map((article) => (
                <li key={article._id}>
                  <Link href={`/blog/${article.slug}`} className="fh-latest-row">
                    <span className="fh-latest-category">{article.category.title}</span>
                    <span className="fh-latest-title">{article.title}</span>
                    <span className="fh-latest-meta">
                      <time dateTime={article.reviewedAt ?? article.publishedAt}>
                        {article.reviewedAt
                          ? `Reviewed ${formatArticleDate(article.reviewedAt)}`
                          : `Published ${formatArticleDate(article.publishedAt)}`}
                      </time>
                      <span>{article.readingTime}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="fh-knowledge-evergreen">
          <h3>Plan your next step</h3>
          <ul className="fh-knowledge-grid">
            {FIGMA_KNOWLEDGE.map((item) => (
              <li key={item.title}>
                <article className="fh-knowledge-card">
                  <h4>{item.title}</h4>
                  <p>{item.body}</p>
                  <Link href={item.href} className="fh-text-link fh-access-link">
                    Open <ArrowRight className="size-3" aria-hidden="true" />
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/** Image-led closing band: the desk portrait under a navy scrim. */
function FinalCta() {
  return (
    <section className="fh-final" aria-labelledby="figma-final-heading">
      <Image
        src={DEBRA_DESK.src}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        style={{ objectPosition: DEBRA_DESK.objectPosition }}
        className="fh-final-image"
      />
      <span className="fh-final-scrim" aria-hidden="true" />
      <div className="fh-final-inner">
        <p className="fh-eyebrow fh-eyebrow-on-dark">Talk it through</p>
        <h2 id="figma-final-heading">Talk through your Dallas–Fort Worth move before you commit to it</h2>
        <p>
          Bring the question you have been sitting on. Debra will tell you what the next step actually is — and what
          it is not — so you can decide with the whole picture in front of you.
        </p>
        <div className="fh-final-actions">
          <Link href={FIGMA_HOME_CTA.consultation.href} className="fh-btn fh-btn-gold">
            {FIGMA_HOME_CTA.consultation.label}
          </Link>
          <Link href={FIGMA_HOME_CTA.startBuying.href} className="fh-btn fh-btn-light-outline">
            {FIGMA_HOME_CTA.startBuying.label}
          </Link>
        </div>
      </div>
    </section>
  )
}
