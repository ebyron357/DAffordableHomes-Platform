import type { Metadata } from "next"
import { Hero } from "@/components/home/hero"
import { AboutDebra } from "@/components/home/about-debra"
import { ControlledHomeSections } from "@/components/home/controlled-home-sections"
import { LatestGuides } from "@/components/home/latest-guides"
import { SITE } from "@/lib/site"
import { FAQ_PREVIEW } from "@/lib/content/home"

export const metadata: Metadata = {
  title: "Trusted homeownership guidance",
  description: SITE.description,
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
      <ControlledHomeSections placement="before-debra" />
      <AboutDebra />
      <LatestGuides />
      <ControlledHomeSections placement="after-debra" />
    </>
  )
}
