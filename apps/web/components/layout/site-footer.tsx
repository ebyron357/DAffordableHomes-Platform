import Link from "next/link"
import { LEGAL_NAV, PRIMARY_NAV } from "@/lib/navigation"
import { SITE } from "@/lib/site"
import { Container } from "@/components/ui/container"

export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-border bg-card text-foreground" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Site footer</h2>
      <Container className="grid gap-6 py-9 md:grid-cols-[1fr_1.2fr_0.9fr] md:items-start">
        <div><p className="font-semibold">D&apos;AFFORDABLE HOMES</p><p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">Clear homeownership guidance and professional representation.</p></div>
        <div>
          <nav aria-label="Footer navigation"><ul className="flex flex-wrap gap-x-4 gap-y-2">{PRIMARY_NAV.map((link) => <li key={link.href}><Link href={link.href} className="text-xs text-muted-foreground hover:text-primary hover:underline">{link.label}</Link></li>)}</ul></nav>
          <nav aria-label="Legal and policies" className="mt-3"><ul className="flex flex-wrap gap-x-4 gap-y-2">{LEGAL_NAV.map((link) => <li key={link.href}><Link href={link.href} className="text-xs text-muted-foreground hover:text-primary hover:underline">{link.label}</Link></li>)}</ul></nav>
        </div>
        <div className="text-xs text-muted-foreground md:text-right"><p className="font-medium text-primary">Real Estate Technology by <a href="https://clientverse.io" className="rounded underline decoration-current underline-offset-2 transition-colors hover:text-foreground">ClientVerse.io</a></p><p className="mt-2">&copy; {year} {SITE.name}</p></div>
      </Container>
    </footer>
  )
}
