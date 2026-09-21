import type { Metadata } from "next"
import { FigmaHomePage } from "@/components/home/figma-home-page"
import { FAQ_PREVIEW } from "@/lib/content/home"
import { listArticles } from "@/lib/blog/source"
import { searchListings } from "@/lib/mls/provider"
import { SITE } from "@/lib/site"

const HOME_TITLE = "Debra Allen, REALTOR® | Garland + DFW Home Guidance"
const HOME_DESCRIPTION =
  "Clear, practical residential real-estate guidance from Debra Allen, REALTOR®, for first-time buyers and families in Garland and Dallas–Fort Worth."

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: HOME_TITLE,
    description:
      "Clear, practical residential real-estate guidance for first-time buyers and families preparing to buy in Garland and Dallas–Fort Worth.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: "Practical homebuyer guidance, planning tools, and next steps for Garland and Dallas–Fort Worth.",
  },
}

export default async function HomePage() {
  // The homepage's knowledge section is driven by the same CMS articles as
  // /blog, so publishing a guide in the Studio changes the homepage — no code
  // change, no deploy. This is the one editorial module worth wiring to the
  // CMS: navigation, legal and compliance copy stay in the repository, where
  // review and version history belong.
  const [listings, articles] = await Promise.all([searchListings(), listArticles()])
  const homePageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE.url}/#webpage`,
    url: SITE.url,
    name: HOME_TITLE,
    description: HOME_DESCRIPTION,
    inLanguage: "en-US",
    isPartOf: { "@id": `${SITE.url}/#website` },
    about: [
      { "@type": "Thing", name: "First-time home buying" },
      { "@type": "Thing", name: "Homebuyer planning" },
      { "@type": "Place", name: "Garland, Texas" },
      { "@type": "Place", name: "Dallas–Fort Worth" },
    ],
  }
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_PREVIEW.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageJsonLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />
      <FigmaHomePage listings={listings} latestArticles={articles.articles.slice(0, 3)} />
    </>
  )
}
