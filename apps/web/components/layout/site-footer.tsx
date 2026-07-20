import Link from "next/link"
import { LEGAL_NAV, PRIMARY_NAV } from "@/lib/navigation"
import { SITE } from "@/lib/site"
import { Container } from "@/components/ui/container"

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Site footer
      </h2>
      <Container className="grid gap-6 py-9 md:grid-cols-[1fr_1.2fr_0.9fr] md:items-start">
          <div>
            <p className="text-sm font-semibold text-foreground">D&apos;AFFORDABLE HOMES</p>
            <p className="mt-2 max-w-sm text-[13px] leading-5 text-muted-foreground">Clear homeownership guidance and professional representation.</p>
          </div>
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-3 gap-y-2 text-[13px] text-muted-foreground">
              {PRIMARY_NAV.map((link) => <li key={link.href}><Link href={link.href} className="hover:text-primary hover:underline">{link.label}</Link></li>)}
            </ul>
            <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-2 text-[13px] text-muted-foreground">
              {LEGAL_NAV.map((link) => <li key={link.href}><Link href={link.href} className="hover:text-primary hover:underline">{link.label}</Link></li>)}
            </ul>
          </nav>
          <div className="space-y-2 text-xs text-muted-foreground md:text-right">
            <p>
              Real Estate Technology by{" "}
              <a
                href="https://clientverse.io"
                className="rounded-sm text-primary underline decoration-current underline-offset-2 transition-colors hover:text-foreground"
              >
                ClientVerse.io
              </a>
            </p>
            <p>&copy; {year} {SITE.name}</p>
          </div>
      </Container>
    </footer>
  )
}
