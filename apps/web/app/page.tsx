import type { Metadata } from "next"
import { FigmaHomePage } from "@/components/home/figma-home-page"
import { FAQ_PREVIEW } from "@/lib/content/home"
import { searchListings } from "@/lib/mls/provider"

export const metadata: Metadata = {
  title: "Debra Allen, REALTOR® | Garland + DFW Home Guidance",
  description:
    "Clear, practical residential real-estate guidance from Debra Allen, REALTOR®, for first-time buyers and families in Garland and Dallas–Fort Worth.",
  alternates: { canonical: "/" },
}

export default async function HomePage() {
  const listings = await searchListings()
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <FigmaHomePage listings={listings} />
    </>
  )
}
