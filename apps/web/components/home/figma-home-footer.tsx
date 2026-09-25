import Image from "next/image"
import Link from "next/link"
import { BadgeCheck, MapPin, Route } from "lucide-react"
import { CLIENTVERSE } from "@/lib/clientverse"
import { FIGMA_FOOTER_LEGAL, FIGMA_FOOTER_LINKS } from "@/lib/figma-home"
import { SITE } from "@/lib/site"

/**
 * Homepage footer.
 *
 * Composition, in descending visual weight:
 *
 *   1. Brand band — logo, promise, and the one primary next action. This band
 *      is light (`--fh-page`), which is also what stops the logo reading as a
 *      white card: the asset is an opaque PNG with no alpha, so on the navy
 *      band it could only ever be presented on its own panel.
 *   2. Navigation band — quick links and how to reach Debra.
 *   3. Vendor credit.
 *   4. A small compliance row carrying the two TREC notices and the policy
 *      pages. Required to be reachable; deliberately not competing with nav.
 *
 * Contact details are links, not digits: `lib/site.ts` keeps the phone number
 * and business address `null` until they are verified, and inventing them here
 * would be exactly the fabrication the publishing standard forbids.
 */
export function FigmaHomeFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="fh-footer" aria-labelledby="figma-footer-heading">
      <h2 id="figma-footer-heading" className="sr-only">
        Site footer
      </h2>

      <div className="fh-footer-brand-band">
        <div className="fh-shell fh-footer-brand-inner">
          <div className="fh-footer-identity">
            {/* Opaque PNG: the plate is deliberate, not an accident of the
                asset. See the note on .fh-footer-brand-band. */}
            <span className="fh-footer-logo-plate">
              <Image
                src="/images/daffordable-homes-official-logo.png"
                alt="D'Affordable Homes — Affordable, Accessible, Achievable"
                width={640}
                height={427}
                sizes="210px"
                quality={90}
                className="fh-footer-logo"
              />
            </span>
            <p className="fh-footer-blurb">
              {SITE.realtorName} — professional representation and clear, unhurried guidance for buyers and sellers
              across Garland and the Dallas–Fort Worth metroplex.
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

          <div className="fh-footer-action">
            <p className="fh-eyebrow">Start a conversation</p>
            <p className="fh-footer-action-copy">
              Bring a question, not a commitment. Debra will tell you what the next step is and what it costs you to
              take it.
            </p>
            <Link href="/consultation" className="fh-btn fh-btn-navy">
              Schedule a Consultation
            </Link>
            <Link href="/contact" className="fh-text-link fh-footer-contact-link">
              Or send a message instead
            </Link>
          </div>
        </div>
      </div>

      <div className="fh-shell fh-footer-columns">
        <nav aria-label="Quick links">
          <p className="fh-footer-label">Explore</p>
          <ul>
            {FIGMA_FOOTER_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Learn">
          <p className="fh-footer-label">Learn</p>
          <ul>
            <li>
              <Link href="/blog">Guides &amp; Articles</Link>
            </li>
            <li>
              <Link href="/first-time-buyers">First-Time Buyers</Link>
            </li>
            <li>
              <Link href="/programs">Homebuyer Programs</Link>
            </li>
            <li>
              <Link href="/calculators">Planning Tools</Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Contact">
          <p className="fh-footer-label">Contact</p>
          <ul>
            <li>
              <Link href="/contact">Send Debra a message</Link>
            </li>
            <li>
              <Link href="/consultation">Book a consultation</Link>
            </li>
            <li>
              <Link href="/about">About Debra Allen</Link>
            </li>
          </ul>
          {/* Stated rather than silently omitted: an empty contact column reads
              as neglect, a fabricated phone number is worse than both. */}
          <p className="fh-footer-note">
            Direct phone and office details are published here once they are confirmed for release.
          </p>
        </nav>
      </div>

      <div className="fh-shell fh-footer-bottom">
        <p className="fh-footer-copy">
          <span>
            {"© "}
            {year} {SITE.name}. All rights reserved.
          </span>
          {/* Vendor attribution is a site-wide release requirement (see lib/clientverse.ts);
              the homepage renders its own footer, so it is carried here as well. */}
          <span className="fh-footer-attribution">
            <a href={CLIENTVERSE.href} target="_blank" rel="noopener noreferrer">
              {CLIENTVERSE.attributionText}
            </a>{" "}
            {CLIENTVERSE.relationshipNote}
          </span>
        </p>
        <nav aria-label="Legal and compliance" className="fh-footer-legal">
          <ul>
            {FIGMA_FOOTER_LEGAL.map((link) =>
              link.external ? (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                </li>
              ) : (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ),
            )}
          </ul>
        </nav>
      </div>
    </footer>
  )
}
