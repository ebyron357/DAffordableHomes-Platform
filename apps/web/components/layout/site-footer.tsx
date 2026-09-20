import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { CLIENTVERSE } from "@/lib/clientverse"
import { LEGAL_NAV, PRIMARY_NAV } from "@/lib/navigation"
import { SITE } from "@/lib/site"

/**
 * Shared site footer.
 *
 * Structure and styling follow the Warm Residential Editorial design that
 * landed on `main` in PR #23. The vendor attribution is carried forward from
 * this branch: it is a release requirement, it belongs in the shared footer so
 * it appears site-wide, and `tests/static/clientverse.test.mjs` asserts its
 * text, destination and single placement.
 */
export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Site footer
      </h2>

      <Container className="footer-grid">
        <div>
          <Image
            src="/images/daffordable-homes-official-logo.png"
            alt="D'Affordable Homes"
            width={640}
            height={427}
            className="footer-logo"
          />
          <p className="footer-tagline">Affordable. Accessible. Achievable.</p>
          <p className="footer-copy">
            Clear, practical guidance for the homeownership decisions in front of you.
          </p>
          <Button href="/consultation" variant="secondary" size="sm">
            Talk with Debra
          </Button>
        </div>

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
                <Link href="/blog">Blog &amp; Articles</Link>
              </li>
              <li>
                <Link href="/contact">Contact Debra</Link>
              </li>
            </ul>
          </nav>
        </div>

        <div>
          <p className="footer-label">Legal + accessibility</p>
          <nav aria-label="Legal and policies">
            <ul className="footer-links">
              <li>
                <a
                  href="https://www.trec.texas.gov/information-about-brokerage-services-form"
                  target="_blank"
                  rel="noreferrer"
                >
                  TREC Information About Brokerage Services
                </a>
              </li>
              <li>
                <a
                  href="https://www.trec.texas.gov/forms/consumer-protection-notice"
                  target="_blank"
                  rel="noreferrer"
                >
                  TREC Consumer Protection Notice
                </a>
              </li>
              {LEGAL_NAV.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>

      <Container className="footer-bottom">
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
      </Container>
    </footer>
  )
}
