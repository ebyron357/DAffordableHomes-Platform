import type { Metadata } from "next"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"
import { ProviderUnavailable } from "@/components/states/provider-unavailable"

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Real words from real people Debra has guided. We publish testimonials only with permission — never invented reviews.",
}

export default function TestimonialsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Connect"
        title="Stories from the people Debra has guided"
        intro="The best measure of this work is how people feel walking through it. As clients share their experiences, their words will live here."
        crumbs={[{ label: "Home", href: "/" }, { label: "Testimonials" }]}
      />
      <Section>
        <ProviderUnavailable
          title="Testimonials are collected with care"
          description="We only publish testimonials with a person's explicit permission, and we never fabricate reviews. As verified stories come in, they'll appear here in the clients' own words."
          fallback={[
            { label: "Work with Debra", href: "/contact" },
            { label: "About Debra", href: "/about" },
          ]}
        />
      </Section>
    </>
  )
}
