import type { Metadata } from 'next';
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
          <a href="/" aria-label="D'Affordable Homes home"><strong>D&apos;Affordable Homes</strong></a>
          <nav aria-label="Primary navigation">
            <ul className="nav-list">
              <li><a href="/start">Start Here</a></li>
              <li><a href="/learn">Learn</a></li>
              <li><a href="/plan">Plan</a></li>
              <li><a href="/explore">Explore</a></li>
              <li><a href="/contact">Contact</a></li>
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
