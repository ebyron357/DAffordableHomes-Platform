import type { Metadata } from "next"
import { Hero } from "@/components/home/hero"
import { ConsultationBand, ControlledHomeSections } from "@/components/home/controlled-home-sections"
import { LatestGuides } from "@/components/home/latest-guides"
import { FAQ_PREVIEW } from "@/lib/content/home"

export const metadata: Metadata = {
  title: "Debra Allen, REALTOR® | Garland + DFW Home Guidance",
  description: "Clear, practical residential real-estate guidance from Debra Allen, REALTOR®, for first-time buyers and families in Garland and Dallas–Fort Worth.",
  alternates: { canonical: "/" },
}

export const revalidate = 300

export default async function HomePage() {
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <ControlledHomeSections />
      <LatestGuides />
      <ConsultationBand />
    </>
  )
}
