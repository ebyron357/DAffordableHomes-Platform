import Link from "next/link"
import { Home } from "lucide-react"
import { CONNECT_LINKS, EXPLORE_LINKS, LEARN_LINKS, LEGAL_NAV } from "@/lib/navigation"
import { SITE, UNVERIFIED_TRUST_FACTS } from "@/lib/site"
import { Container } from "@/components/ui/container"

const columns = [
  { title: "Learn", links: LEARN_LINKS },
  { title: "Explore", links: EXPLORE_LINKS },
  { title: "Connect", links: CONNECT_LINKS },
]

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 border-t border-border bg-muted/40" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Site footer
      </h2>
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <p className="font-serif text-xl font-semibold text-foreground">
              <span className="text-primary">D&apos;Affordable</span> Homes
            </p>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">{SITE.tagline}</p>
            <p className="mt-4 text-sm font-medium text-foreground">{SITE.realtorName}</p>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {col.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="rounded text-sm text-foreground/85 transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Fair Housing / Equal Housing — required real-estate trust block */}
        <div className="mt-12 flex flex-col gap-4 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-start">
          <Home className="size-6 shrink-0 text-primary" aria-hidden="true" />
          <div className="text-sm leading-relaxed text-muted-foreground">
            <p className="font-medium text-foreground">Equal Housing Opportunity</p>
            <p className="mt-1">
              D&apos;Affordable Homes is committed to the letter and spirit of U.S. policy for the achievement of
              equal housing opportunity. We do not discriminate based on race, color, religion, sex, disability,
              familial status, or national origin. Read our{" "}
              <Link href="/fair-housing" className="font-medium text-primary underline underline-offset-2">
                Fair Housing Statement
              </Link>
              .
            </p>
            {!UNVERIFIED_TRUST_FACTS.brokerageName && (
              <p className="mt-3 text-xs">
                Brokerage, licensing, and IDX attribution details will be published here once confirmed for release.
              </p>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>&copy; {year} {SITE.name}. {SITE.realtorName}. All rights reserved.</p>
            <p>
              Real Estate Technology by{" "}
              <a
                href="https://clientverse.io"
                className="rounded underline decoration-current/50 underline-offset-2 transition-colors hover:text-primary"
              >
                ClientVerse.io
              </a>
            </p>
          </div>
          <nav aria-label="Legal and policies">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {LEGAL_NAV.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded text-xs text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  )
}
