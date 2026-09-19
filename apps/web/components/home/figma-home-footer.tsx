import Link from "next/link"
import { FIGMA_FOOTER_LEGAL, FIGMA_FOOTER_LINKS } from "@/lib/figma-home"
import { SITE } from "@/lib/site"

export function FigmaHomeFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="fh-footer" aria-labelledby="figma-footer-heading">
      <h2 id="figma-footer-heading" className="sr-only">
        Site footer
      </h2>
      <div className="fh-shell fh-footer-columns">
        <div>
          <p className="fh-footer-brand">{SITE.name}</p>
          <p className="fh-footer-blurb">
            Professional representation and trusted real-estate guidance across the Dallas–Fort Worth Metroplex.
            Approachable expertise.
          </p>
        </div>
        <nav aria-label="Quick links">
          <p className="fh-footer-label">Quick Links</p>
          <ul>
            {FIGMA_FOOTER_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="fh-footer-label">Contact</p>
          <p className="fh-footer-blurb">
            Phone, email, and office address are published only after they are verified. Reach Debra through the
            contact form.
          </p>
          <Link href="/contact" className="fh-footer-contact-link">
            Contact Debra
          </Link>
        </div>
        <nav aria-label="Required disclosures">
          <p className="fh-footer-label">Disclosures</p>
          <ul>
            <li>
              <a href="https://www.trec.texas.gov/information-about-brokerage-services-form">
                TREC Information About Brokerage Services
              </a>
            </li>
            <li>
              <a href="https://www.trec.texas.gov/forms/consumer-protection-notice">TREC Consumer Protection Notice</a>
            </li>
            <li>
              <Link href="/equal-housing-opportunity">Equal Housing Opportunity</Link>
            </li>
            <li>
              <Link href="/accessibility">Accessibility</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="fh-shell fh-footer-bottom">
        <p>
          {"© "}
          {year} {SITE.name}. All rights reserved. Guidance led by {SITE.realtorName}.
        </p>
        <nav aria-label="Legal">
          <ul>
            {FIGMA_FOOTER_LEGAL.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}
