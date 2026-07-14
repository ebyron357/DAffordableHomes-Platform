import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: "D'Affordable Homes | Homeownership has steps",
    template: "%s | D'Affordable Homes"
  },
  description:
    'Education-first homeownership guidance for first-time buyers and renters preparing for a practical next step.',
  metadataBase: new URL('https://www.daffordablehomes.com'),
  alternates: { canonical: '/' },
  openGraph: {
    title: "D'Affordable Homes",
    description: 'Homeownership has steps. You do not have to learn them alone.',
    type: 'website',
    url: 'https://www.daffordablehomes.com'
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <header className="site-header" aria-label="Site header">
          <Link href="/" aria-label="D'Affordable Homes home"><strong>D&apos;Affordable Homes</strong></Link>
          <nav aria-label="Primary navigation">
            <ul className="nav-list">
              <li><Link href="/start">Start Here</Link></li>
              <li><Link href="/learn">Learn</Link></li>
              <li><Link href="/plan">Plan</Link></li>
              <li><Link href="/explore">Explore</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </nav>
        </header>
        <main id="main-content">{children}</main>
        <footer className="site-footer">
          <p>Debra Allen, REALTOR® — education-first real estate guidance. Brokerage, licensing, and Equal Housing Opportunity details must be approved before launch.</p>
        </footer>
      </body>
    </html>
  );
}
