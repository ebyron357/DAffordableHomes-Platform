import type { Metadata } from "next"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"
import { ProviderUnavailable } from "@/components/states/provider-unavailable"
import { contentStatus } from "@/lib/providers"

export const metadata: Metadata = {
  title: "Blog & Articles",
  description:
    "Short, jargon-free articles that explain the parts of buying a home people find most confusing.",
}

export default function BlogPage() {
  const content = contentStatus()

  return (
    <>
      <PageHeader
        eyebrow="Learn"
        title="Clear answers, one article at a time"
        intro="Homeownership comes with a lot of new vocabulary. These articles break it down in plain language, so each part of the process feels a little less intimidating."
        crumbs={[{ label: "Home", href: "/" }, { label: "Blog & Articles" }]}
      />
      <Section>
        {content.connected ? (
          <p className="text-muted-foreground">Loading articles…</p>
        ) : (
          <ProviderUnavailable
            title="Articles are being written"
            description="We publish articles here as they're ready — real, reviewed content rather than filler. In the meantime, the guides below cover the essentials of getting started."
            fallback={[
              { label: "First-time buyer guide", href: "/first-time-buyers" },
              { label: "Common questions", href: "/faq" },
            ]}
          />
        )}
      </Section>
    </>
  )
}
