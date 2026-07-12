import type { Metadata } from "next"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"
import { ProviderUnavailable } from "@/components/states/provider-unavailable"
import { marketDataStatus } from "@/lib/providers"

export const metadata: Metadata = {
  title: "Market Reports",
  description:
    "Plain-language market context so you can tell the difference between noise and the numbers that actually affect your decision.",
}

export default function MarketReportsPage() {
  const market = marketDataStatus()

  return (
    <>
      <PageHeader
        eyebrow="Explore"
        title="Understand the market without the hype"
        intro="Headlines are loud; the numbers that matter for your decision are usually quieter. When our market data source is connected, you'll find clear, current context here."
        crumbs={[{ label: "Home", href: "/" }, { label: "Market Reports" }]}
      />
      <Section>
        {market.connected ? (
          <p className="text-muted-foreground">Loading market reports…</p>
        ) : (
          <ProviderUnavailable
            title="Market reports aren't connected yet"
            description="We publish market data only from a verified source — no estimated or invented figures. Until reports are live, the education below explains how rates, inventory, and pricing affect a real buying decision."
            fallback={[
              { label: "How buying works", href: "/first-time-buyers" },
              { label: "Common questions", href: "/faq" },
            ]}
          />
        )}
      </Section>
    </>
  )
}
