import Image from "next/image"
import Link from "next/link"
import { CONNECT_LINKS, EXPLORE_LINKS, LEARN_LINKS, LEGAL_NAV, type NavItem } from "@/lib/navigation"
import { ATTRIBUTION, SITE } from "@/lib/site"
import { Container } from "@/components/ui/container"

const TREC_LINKS = [
  {
    label: "TREC Information About Brokerage Services",
    href: "https://www.trec.texas.gov/information-about-brokerage-services-form",
  },
  { label: "TREC Consumer Protection Notice", href: "https://www.trec.texas.gov/forms/consumer-protection-notice" },
]

function FooterColumn({ title, links }: { title: string; links: NavItem[] }) {
  const headingId = `footer-${title.toLowerCase().replace(/\s+/g, "-")}`
  return (
    <nav aria-labelledby={headingId}>
      <h3 id={headingId} className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-block py-1 text-[0.9375rem] leading-6 text-muted-foreground transition-colors hover:text-primary hover:underline hover:underline-offset-4"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-border bg-card text-foreground" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Site footer
      </h2>

      <Container className="py-14 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2.4fr] lg:gap-16">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-3 rounded-sm">
              <Image
                src="/manus-storage/dah-logo_ff042b7b.png"
                alt=""
                width={44}
                height={44}
                className="h-11 w-11 object-contain"
              />
              <span className="font-serif text-xl leading-tight text-foreground">{SITE.name}</span>
            </Link>
            <p className="mt-5 text-[0.9375rem] leading-7 text-muted-foreground">
              Real guidance for first-time buyers and families ready to own their future.
            </p>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{SITE.tagline}</p>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            <FooterColumn title="Learn" links={LEARN_LINKS} />
            <FooterColumn title="Explore" links={EXPLORE_LINKS} />
            <FooterColumn title="Connect" links={CONNECT_LINKS} />
          </div>
        </div>

        <div className="mt-14 border-t border-border pt-8">
          <nav aria-label="Legal, policies, and required notices">
            <h3 className="sr-only">Legal, policies, and required notices</h3>
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {TREC_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block py-1 text-sm text-muted-foreground transition-colors hover:text-primary hover:underline hover:underline-offset-4"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              {LEGAL_NAV.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block py-1 text-sm text-muted-foreground transition-colors hover:text-primary hover:underline hover:underline-offset-4"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-8 flex flex-col gap-4 border-t border-border pt-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
            <p>
              &copy; {year} {SITE.name}. All rights reserved.
            </p>

            {/*
              Site-wide vendor attribution. The qualification keeps the credit
              from reading as an endorsement or a real-estate affiliation.
            */}
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>
                {ATTRIBUTION.label}{" "}
                <a
                  href={ATTRIBUTION.vendorUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block py-1 font-semibold text-primary underline decoration-accent/50 underline-offset-4 transition-colors hover:decoration-accent"
                >
                  {ATTRIBUTION.vendorName}
                </a>
              </span>
              <span className="text-xs text-muted-foreground">{ATTRIBUTION.qualification}</span>
            </p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
