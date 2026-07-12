import type { Metadata } from "next"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"
import { ProviderUnavailable } from "@/components/states/provider-unavailable"
import { marketDataStatus } from "@/lib/providers"

export const metadata: Metadata = {
  title: "Neighborhood Guides",
  description:
    "Understand the areas you're considering — what daily life feels like, what to research, and the questions worth asking before you commit.",
}

export default function NeighborhoodsPage() {
  const market = marketDataStatus()

  return (
    <>
      <PageHeader
        eyebrow="Explore"
        title="Get to know the neighborhoods"
        intro="Where you buy shapes daily life as much as the home itself. Neighborhood guides help you weigh commute, schools, amenities, and long-term value with clear eyes."
        crumbs={[{ label: "Home", href: "/" }, { label: "Neighborhood Guides" }]}
      />
      <Section>
        {market.connected ? (
          <p className="text-muted-foreground">Loading neighborhood guides…</p>
        ) : (
          <ProviderUnavailable
            title="Neighborhood guides are in preparation"
            description="We're building guides grounded in verified local data rather than guesswork. Until they're published with a connected data source, use the questions and education below to research any area with confidence."
            fallback={[
              { label: "Questions to ask", href: "/first-time-buyers" },
              { label: "Talk with Debra", href: "/contact" },
            ]}
          />
        )}
      </Section>
    </>
  )
}
