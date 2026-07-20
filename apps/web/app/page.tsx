import type { Metadata } from "next"
import { Hero } from "@/components/home/hero"
import { ThreePathways } from "@/components/home/three-pathways"
import { Pathways } from "@/components/home/pathways"
import { FirstTimeEducation } from "@/components/home/first-time-education"
import { RoadmapPreview } from "@/components/home/roadmap-preview"
import { ResourcesWorkshops } from "@/components/home/resources-workshops"
import { AboutDebra } from "@/components/home/about-debra"
import { TrustProcess } from "@/components/home/trust-process"
import { FaqPreview } from "@/components/home/faq-preview"
import { ConsultationCta } from "@/components/home/consultation-cta"
import { SITE } from "@/lib/site"
import { FAQ_PREVIEW } from "@/lib/content/home"

export const metadata: Metadata = {
  title: "Education-first homeownership guidance",
  description: SITE.description,
  alternates: { canonical: "/" },
}

export default function HomePage() {
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Hero />
      <ThreePathways />
      <TrustProcess />
      <Pathways />
      <FirstTimeEducation />
      <RoadmapPreview />
      <ResourcesWorkshops />
      <AboutDebra />
      <FaqPreview />
      <ConsultationCta />
    </>
  )
}
