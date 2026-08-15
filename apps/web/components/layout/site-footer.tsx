import Link from "next/link"

import { Container } from "@/components/ui/container"
import { CLIENTVERSE } from "@/lib/clientverse"
import { LEGAL_NAV, PRIMARY_NAV } from "@/lib/navigation"
import { SITE } from "@/lib/site"

const TREC_LINKS = [
  {
    label: "TREC Information About Brokerage Services",
    href: "https://www.trec.texas.gov/information-about-brokerage-services-form",
  },
  {
    label: "TREC Consumer Protection Notice",
    href: "https://www.trec.texas.gov/forms/consumer-protection-notice",
  },
]

// `inline-block py-1` keeps each footer link at least 24px tall, which is the
// WCAG 2.2 target-size minimum for a standalone (non-inline-in-text) control.
const linkClass =
  "inline-block py-1 text-sm leading-6 text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-[3px]"

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card text-foreground" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Site footer
      </h2>

      <Container className="py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr] md:gap-12">
          <div>
            <p className="font-serif text-2xl leading-tight">{SITE.name}</p>
            <p className="mt-4 max-w-sm text-[15px] leading-[1.7] text-muted-foreground">
              Real guidance for first-time buyers and families ready to own their future.
            </p>
            <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
              Equal Housing Opportunity
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5">
              {PRIMARY_NAV.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal and policies">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Policies &amp; disclosures
            </h3>
            <ul className="mt-4 space-y-2.5">
              {TREC_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noreferrer" className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
              {LEGAL_NAV.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-7 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {SITE.name}. All rights reserved.
          </p>
          {/*
            Vendor attribution. The relationship is stated explicitly rather than
            implied, and `rel="noopener"` plus an outbound label keeps it honest.
          */}
          <p className="text-sm">
            <a
              href={CLIENTVERSE.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground underline decoration-accent/50 underline-offset-[3px] transition-colors hover:text-primary hover:decoration-accent"
            >
              {CLIENTVERSE.attributionText}
            </a>
            <span className="ml-2 text-muted-foreground">{CLIENTVERSE.relationshipNote}</span>
          </p>
        </div>
      </Container>
    </footer>
  )
}
