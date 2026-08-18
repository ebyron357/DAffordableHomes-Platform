import type { Metadata } from "next"
import { Hero } from "@/components/home/hero"
import { ControlledHomeSections } from "@/components/home/controlled-home-sections"
import { FAQ_PREVIEW } from "@/lib/content/home"
import { SITE } from "@/lib/site"

export const metadata: Metadata = {
  title: "Debra Allen, REALTOR® | Garland + DFW Home Guidance",
  description: "Clear, practical residential real-estate guidance from Debra Allen, REALTOR®, for first-time buyers and families in Garland and Dallas–Fort Worth.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Debra Allen, REALTOR® | Garland + DFW Home Guidance",
    description: "Clear, practical residential real-estate guidance for first-time buyers and families preparing to buy in Garland and Dallas–Fort Worth.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Debra Allen, REALTOR® | Garland + DFW Home Guidance",
    description: "Practical homebuyer guidance, planning tools, and next steps for Garland and Dallas–Fort Worth.",
  },
}

export default function HomePage() {
  const homePageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE.url}/#webpage`,
    url: SITE.url,
    name: "Debra Allen, REALTOR® | Garland + DFW Home Guidance",
    description: metadata.description,
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

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageJsonLd).replace(/</g, "\\u003c") }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }} />
    <Hero />
    <ControlledHomeSections />
  </>
}
