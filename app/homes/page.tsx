import type { Metadata } from "next"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"
import { ProviderUnavailable } from "@/components/states/provider-unavailable"
import { mlsStatus } from "@/lib/providers"

export const metadata: Metadata = {
  title: "Home Search",
  description:
    "Search homes with guidance you can trust. Listing search connects to a licensed data source — until it's live, start with the education that makes searching productive.",
}

export default function HomesPage() {
  const mls = mlsStatus()

  return (
    <>
      <PageHeader
        eyebrow="Explore"
        title="Search homes with a plan, not pressure"
        intro="Searching is more productive once you understand your budget, your loan options, and the steps ahead. When our listing search connects to a licensed data source, you'll browse real homes here — never placeholder listings."
        crumbs={[{ label: "Home", href: "/" }, { label: "Home Search" }]}
      />
      <Section>
        {mls.connected ? (
          // Real listing grid renders here once an MLS/IDX adapter is connected.
          <p className="text-muted-foreground">Loading listings…</p>
        ) : (
          <ProviderUnavailable
            title="Live listing search isn't connected yet"
            description="We only show real homes from a licensed listing source, so you'll never see invented properties or prices here. In the meantime, the steps below make your search far more effective when it opens."
            fallback={[
              { label: "Learn the buying steps", href: "/first-time-buyers" },
              { label: "Find your next step", href: "/start" },
              { label: "Explore neighborhoods", href: "/neighborhoods" },
            ]}
          />
        )}
      </Section>
    </>
  )
}
