import Image from "next/image"
import Link from "next/link"

import { CONNECT_LINKS, EXPLORE_LINKS, LEARN_LINKS, LEGAL_NAV } from "@/lib/navigation"
import { SITE } from "@/lib/site"
import { Container } from "@/components/ui/container"
import { CLIENTVERSE } from "@/lib/attribution"

const columns = [
  { heading: "Learn", links: LEARN_LINKS },
  { heading: "Explore", links: EXPLORE_LINKS },
  { heading: "Connect", links: CONNECT_LINKS },
] as const

const complianceLinks = [
  { label: "TREC Information About Brokerage Services", href: "https://www.trec.texas.gov/information-about-brokerage-services-form" },
  { label: "TREC Consumer Protection Notice", href: "https://www.trec.texas.gov/forms/consumer-protection-notice" },
] as const

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-border bg-card text-foreground" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Site footer
      </h2>

      <Container className="py-14 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] lg:gap-20">
          <div>
            <Link href="/" className="inline-flex items-center gap-3" aria-label={`${SITE.name} — Home`}>
              <Image
                src="/manus-storage/dah-logo_ff042b7b.png"
                alt=""
                width={44}
                height={44}
                className="size-11 object-contain"
              />
              <span className="font-serif text-lg leading-tight">{SITE.name}</span>
            </Link>
            <p className="mt-5 max-w-sm text-[0.9375rem] leading-7 text-muted-foreground">
              Real guidance for first-time buyers and families ready to own their future. Education first, with clear
              boundaries about who decides what.
            </p>
            <p className="mt-6 text-sm font-medium text-foreground">{SITE.realtorName}</p>
          </div>

          <nav aria-label="Footer" className="grid gap-10 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.heading}>
                <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                  {column.heading}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[0.9375rem] leading-6 text-muted-foreground underline-offset-4 transition-colors hover:text-accent hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <nav aria-label="Legal and policies">
            <ul className="flex flex-wrap gap-x-6 gap-y-2.5">
              {complianceLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-accent hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              {LEGAL_NAV.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-accent hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>

      <div className="border-t border-border bg-muted/50">
        <Container className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {year} {SITE.name}. All rights reserved.
          </p>

          {/* ClientVerse attribution — required site-wide. */}
          <p className="text-sm text-muted-foreground">
            <span>{CLIENTVERSE.prefix} </span>
            <a
              href={CLIENTVERSE.href}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-foreground underline decoration-accent/50 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
            >
              {CLIENTVERSE.name}
            </a>
            <span className="mt-1 block text-xs text-muted-foreground sm:mt-0 sm:ml-2 sm:inline">
              {CLIENTVERSE.qualification}
            </span>
          </p>
        </Container>
      </div>
    </footer>
  )
}
