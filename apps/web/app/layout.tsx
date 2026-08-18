import type { Metadata, Viewport } from "next"
import { Inter, Source_Serif_4 } from "next/font/google"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { SITE } from "@/lib/site"
import "./globals.css"

/**
 * Brand typefaces, self-hosted by Next at build time.
 *
 * `globals.css` already declared `--font-inter` and `--font-source-serif` with
 * system-font placeholders; these bindings supply the real faces without
 * loosening the `font-src 'self' data:` CSP, because the files are served from
 * this origin.
 */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-source-serif",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Trusted homeownership guidance`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  /**
   * Default self-referencing canonical. Next resolves "./" against each route's
   * own path, so every page ships a canonical without repeating it per file;
   * routes that need a different target still override `alternates.canonical`.
   */
  alternates: { canonical: "./" },
  keywords: [
    "first-time home buyer education",
    "homeownership guidance",
    "home buying process",
    "affordable homeownership",
    "buyer readiness",
    "Garland homebuyer guidance",
    "Dallas Fort Worth homebuyer programs",
    "NACA real estate guidance",
    "Homes for Heroes real estate guidance",
    "REALTOR",
    "Debra Allen",
  ],
  authors: [{ name: SITE.realtorLegalName, url: `${SITE.url}/about` }],
  creator: SITE.realtorLegalName,
  publisher: SITE.name,
  openGraph: {
    type: "website",
    title: `${SITE.name} — Clear guidance for buying a home`,
    description: SITE.description,
    siteName: SITE.name,
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name}`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: "#102b4e",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
}

const entityGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      description: SITE.description,
      inLanguage: "en-US",
      about: [
        { "@type": "Thing", name: "First-time home buying" },
        { "@type": "Thing", name: "Homeownership planning" },
        { "@type": "Thing", name: "Homebuyer education" },
      ],
      publisher: { "@id": `${SITE.url}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
      url: SITE.url,
      description: SITE.description,
      logo: `${SITE.url}/images/daffordable-homes-official-logo.png`,
      founder: { "@id": `${SITE.url}/#debra-allen` },
    },
    {
      "@type": "Person",
      "@id": `${SITE.url}/#debra-allen`,
      name: SITE.realtorLegalName,
      jobTitle: "REALTOR®",
      url: `${SITE.url}/about`,
      worksFor: { "@id": `${SITE.url}/#organization` },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSerif.variable} bg-background`}>
      <body className="flex min-h-dvh flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entityGraph).replace(/</g, "\\u003c") }}
        />
        <a
          href="#main-content"
          className="sr-only rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}
