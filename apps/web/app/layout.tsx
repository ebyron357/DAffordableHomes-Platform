import type { Metadata, Viewport } from "next"
import { Inter, Source_Serif_4 } from "next/font/google"
import { HideOnHome } from "@/components/layout/hide-on-home"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { SHARE_IMAGES } from "@/lib/seo"
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
  /**
   * No `title` or `description` here on purpose. Next fills an absent Open
   * Graph title and description from the route's own `title` and
   * `description`, and Twitter from Open Graph. Setting them at this level
   * gave every route without its own `openGraph` the same generic share text.
   *
   * `url: "./"` resolves against each route's path, exactly like the canonical
   * above; a fixed `SITE.url` pointed 23 routes' `og:url` at the homepage.
   */
  openGraph: {
    type: "website",
    siteName: SITE.name,
    url: "./",
    ...SHARE_IMAGES,
  },
  twitter: {
    card: "summary_large_image",
  },
  /*
   * No site-wide `robots` default. Indexing is already the default, and an
   * explicit `index, follow` here was emitted alongside the `noindex` Next adds
   * to 404 responses, giving the not-found page two contradictory directives.
   * Routes that must stay out of the index set `robots` themselves.
   */
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
      // The client-approved portrait already published on /about and the
      // homepage; see docs/05-content/IMAGE_ASSET_REGISTER.md.
      image: `${SITE.url}/images/debra-allen-primary-about.webp`,
      // Only subjects this site publishes guidance on. No service area,
      // address, phone, licence or `sameAs` profile is asserted until those
      // facts are verified — see UNVERIFIED_TRUST_FACTS in lib/site.ts.
      knowsAbout: [
        "First-time home buying",
        "NACA homebuying program",
        "Homes for Heroes program",
        "Buying a home in Garland, Texas",
        "Buying a home in Dallas–Fort Worth",
      ],
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
        <HideOnHome>
          <SiteHeader />
        </HideOnHome>
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <HideOnHome>
          <SiteFooter />
        </HideOnHome>
      </body>
    </html>
  )
}
