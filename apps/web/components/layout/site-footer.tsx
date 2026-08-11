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
        <div><p className="font-semibold">{SITE.name}</p><p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">Real guidance for first-time buyers and families ready to own their future.</p></div>
        <div>
          <nav aria-label="Footer navigation"><ul className="flex flex-wrap gap-x-4 gap-y-2">{PRIMARY_NAV.map((link) => <li key={link.href}><Link href={link.href} className="text-xs text-muted-foreground hover:text-primary hover:underline">{link.label}</Link></li>)}</ul></nav>
          <nav aria-label="Legal and policies" className="mt-3"><ul className="flex flex-wrap gap-x-4 gap-y-2"><li><a href="https://www.trec.texas.gov/information-about-brokerage-services-form" className="text-xs text-muted-foreground hover:text-primary hover:underline">TREC Information About Brokerage Services</a></li><li><a href="https://www.trec.texas.gov/forms/consumer-protection-notice" className="text-xs text-muted-foreground hover:text-primary hover:underline">TREC Consumer Protection Notice</a></li>{LEGAL_NAV.map((link) => <li key={link.href}><Link href={link.href} className="text-xs text-muted-foreground hover:text-primary hover:underline">{link.label}</Link></li>)}</ul></nav>
        </div>
        <div className="text-xs text-muted-foreground md:text-right"><p>&copy; {year} {SITE.name}. All rights reserved.</p><p className="mt-2">Guidance for first-time buyers &amp; families</p></div>
      </Container>
    </footer>
  )
}
