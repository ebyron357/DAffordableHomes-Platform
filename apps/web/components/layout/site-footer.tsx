import Image from "next/image"
import Link from "next/link"
import { BadgeCheck, MapPin, Route } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { CLIENTVERSE } from "@/lib/clientverse"
import { LEGAL_NAV, PRIMARY_NAV } from "@/lib/navigation"
import { SITE } from "@/lib/site"

/**
 * Shared site footer for every interior route.
 *
 * Composition matches the homepage footer so the two do not read as different
 * sites, in descending visual weight:
 *
 *   1. Brand band — logo, promise, primary next action. The band is the light
 *      page surface, which is what lets the opaque logo PNG sit flush instead
 *      of on the white plate it used to need against navy.
 *   2. Navigation band.
 *   3. Vendor credit.
 *   4. A small compliance row: the two TREC notices Texas practice requires to
 *      be reachable, plus the policy pages. Reachable and legible, and no
 *      longer a full column competing with site navigation.
 *
 * The vendor attribution is a release requirement; `tests/static/clientverse.test.mjs`
 * asserts its text, destination and single placement.
 */

const TREC_LINKS = [
  {
    label: "TREC Information About Brokerage Services",
    href: "https://www.trec.texas.gov/information-about-brokerage-services-form",
  },
  {
    label: "TREC Consumer Protection Notice",
    href: "https://www.trec.texas.gov/forms/consumer-protection-notice",
  },
] as const

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Site footer
      </h2>

      <div className="footer-brand-band">
        <Container className="footer-brand-inner">
          <div className="footer-identity">
            {/* The mark is an opaque PNG, so it gets a designed white plate on
                the brand's green-gray band rather than a bare white field. */}
            <span className="footer-logo-plate">
              <Image
                src="/images/daffordable-homes-official-logo.png"
                alt="D'Affordable Homes — Affordable, Accessible, Achievable"
                width={640}
                height={427}
                sizes="210px"
                className="footer-logo"
              />
            </span>
            <p className="footer-copy">
              {SITE.realtorName} — clear, practical guidance for the homeownership decisions in front of you, across
              Garland and Dallas–Fort Worth.
            </p>
          </div>
          <div className="footer-local">
            <p className="footer-local-label">Where Debra works</p>
            <ul>
              <li>
                <MapPin aria-hidden="true" />
                <span>
                  <strong>Garland, Texas</strong>
                  The home market, and the one with a full area guide.
                </span>
              </li>
              <li>
                <Route aria-hidden="true" />
                <span>
                  <strong>Dallas–Fort Worth</strong>
                  Buyer and seller representation across the metroplex.
                </span>
              </li>
              <li>
                <BadgeCheck aria-hidden="true" />
                <span>
                  <strong>REALTOR&reg;</strong>
                  Availability for a specific transaction is confirmed with Debra.
                </span>
              </li>
            </ul>
          </div>

          <div className="footer-action">
            <p className="footer-action-label">Start a conversation</p>
            <p className="footer-action-copy">
              Bring a question, not a commitment. No pressure and no judgment about where you are in the process.
            </p>
            <Button href="/consultation" size="sm">
              Talk with Debra
            </Button>
          </div>
        </Container>
      </div>

      <Container className="footer-grid">
        <div>
          <p className="footer-label">Explore</p>
          <nav aria-label="Footer navigation">
            <ul className="footer-links">
              {PRIMARY_NAV.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/blog">Guides &amp; Articles</Link>
              </li>
              <li>
                <Link href="/contact">Contact Debra</Link>
              </li>
            </ul>
          </nav>
        </div>

        <div>
          <p className="footer-label">Plan</p>
          <nav aria-label="Planning tools">
            <ul className="footer-links">
              <li>
                <Link href="/calculators/mortgage-payment">Monthly payment</Link>
              </li>
              <li>
                <Link href="/calculators/affordability">What you can afford</Link>
              </li>
              <li>
                <Link href="/calculators/closing-costs">Cash to close</Link>
              </li>
              <li>
                <Link href="/calculators">All planning tools</Link>
              </li>
            </ul>
          </nav>
        </div>

        <div>
          <p className="footer-label">Learn</p>
          <nav aria-label="Education">
            <ul className="footer-links">
              <li>
                <Link href="/first-time-buyers">First-time buyers</Link>
              </li>
              <li>
                <Link href="/programs">Homebuyer programs</Link>
              </li>
              <li>
                <Link href="/areas/garland">Garland area guide</Link>
              </li>
              <li>
                <Link href="/faq">Frequently asked questions</Link>
              </li>
            </ul>
          </nav>
        </div>
      </Container>

      <Container className="footer-bottom">
        <div className="footer-bottom-primary">
          <span>
            &copy; {year} {SITE.name}. All rights reserved.
          </span>
          <span>Guidance led by Debra Allen, REALTOR&reg;</span>
          {/*
            Vendor attribution. The relationship is stated explicitly rather than
            implied, and `rel="noopener"` keeps the outbound link safe.
          */}
          <span>
            <a
              href={CLIENTVERSE.href}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-attribution"
            >
              {CLIENTVERSE.attributionText}
            </a>{" "}
            {CLIENTVERSE.relationshipNote}
          </span>
        </div>

        <nav aria-label="Legal and compliance" className="footer-compliance">
          <ul>
            {TREC_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
            {LEGAL_NAV.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  )
}
