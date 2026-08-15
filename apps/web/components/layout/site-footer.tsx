import Image from "next/image"
import Link from "next/link"
import { LEGAL_NAV, PRIMARY_NAV } from "@/lib/navigation"
import { SITE } from "@/lib/site"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"

export function SiteFooter() {
  const year = new Date().getFullYear()
  return <footer className="site-footer" aria-labelledby="footer-heading"><h2 id="footer-heading" className="sr-only">Site footer</h2><Container className="footer-grid"><div><Image src="/images/daffordable-homes-official-logo.png" alt="D'Affordable Homes" width={640} height={427} className="footer-logo" /><p className="footer-tagline">Affordable. Accessible. Achievable.</p><p className="footer-copy">Clear, practical guidance for the homeownership decisions in front of you.</p><Button href="/consultation" size="sm">Talk with Debra</Button></div><div><p className="footer-label">Explore</p><nav aria-label="Footer navigation"><ul className="footer-links">{PRIMARY_NAV.map((link) => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}<li><Link href="/contact">Contact Debra</Link></li></ul></nav></div><div><p className="footer-label">Legal + accessibility</p><nav aria-label="Legal and policies"><ul className="footer-links"><li><a href="https://www.trec.texas.gov/information-about-brokerage-services-form">TREC Information About Brokerage Services</a></li><li><a href="https://www.trec.texas.gov/forms/consumer-protection-notice">TREC Consumer Protection Notice</a></li>{LEGAL_NAV.map((link) => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul></nav></div></Container><Container className="footer-bottom"><span>© {year} {SITE.name}. All rights reserved.</span><span>Guidance led by Debra Allen, REALTOR®</span></Container></footer>
}
