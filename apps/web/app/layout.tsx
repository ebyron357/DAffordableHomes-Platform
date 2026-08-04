import type { Metadata, Viewport } from "next"
import { Inter, Source_Serif_4 } from "next/font/google"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { SITE } from "@/lib/site"
import "./globals.css"

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-serif",
})

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Trusted homeownership guidance`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
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
      publisher: { "@id": `${SITE.url}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
      url: SITE.url,
      description: SITE.description,
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
    <html lang="en" className={`${sourceSerif.variable} ${inter.variable} bg-background`}>
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
