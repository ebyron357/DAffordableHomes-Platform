import type { Metadata } from "next"
import Link from "next/link"
import { BarChart3, Calculator, MapPin, MessageCircle, ShieldCheck } from "lucide-react"
import { PageHeader } from "@/components/page/page-header"
import { Band, BandLead, CtaBand, Features, StatusStrip } from "@/components/page/editorial"
import { CLOSING_BAND_IMAGE } from "@/lib/content/imagery"

export const metadata: Metadata = {
  title: "Market Reports",
  description:
    "Clear, honest market context to help you plan. Reports publish here once the data source is connected — never estimated or fabricated.",
}

const INSTEAD = [
  {
    title: "Ask Debra what she is seeing",
    body: "A working REALTOR® in this market is a live data source. Tell her the area and price band and she can tell you how it is behaving.",
    href: "/consultation",
    icon: MessageCircle,
    tone: "teal" as const,
    action: "Ask Debra",
  },
  {
    title: "Model your own numbers",
    body: "Payment, affordability and cash to close, run with your figures. More useful for a decision than a regional average ever is.",
    href: "/calculators",
    icon: Calculator,
    tone: "gold" as const,
    action: "Open the calculators",
  },
  {
    title: "Read the Garland guide",
    body: "Local housing context written from knowledge rather than scraped statistics, with the questions a search there turns on.",
    href: "/areas/garland",
    icon: MapPin,
    tone: "green" as const,
    action: "Open the guide",
  },
] as const

export default function MarketReportsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Market context"
        eyebrowIcon={BarChart3}
        title="Market context, explained simply"
        description="Understanding the market helps you plan with confidence. When reports are available here, they will come with an explanation of what the numbers mean for you."
        crumbs={[{ label: "Home", href: "/" }, { label: "Market reports" }]}
        facts={[{ label: "Sourced data only", icon: ShieldCheck }]}
        motif="route"
      />

      <Band tone="white" tight aria-label="Data source status">
        <StatusStrip icon={BarChart3} title="Reports are not connected yet">
          <p>
            Market reports require a verified data source. Rather than publish estimated or invented figures, this page
            stays honest — real, sourced reports will appear once the data feed is connected.
          </p>
        </StatusStrip>
      </Band>

      <Band tone="alt" aria-labelledby="market-instead-heading">
        <BandLead
          eyebrow="Until then"
          eyebrowIcon={Calculator}
          title="Three things that answer the question behind the question"
          titleId="market-instead-heading"
          lede="People rarely want a market report. They want to know whether now is a sensible time for them, specifically."
        />
        <Features items={INSTEAD} rule="gold" />
      </Band>

      <CtaBand
        eyebrow="The market, for your situation"
        title="Ask about the market you are actually buying in"
        titleId="market-cta-heading"
        body="A metro-wide figure rarely describes a single street or a single price band. Debra can tell you what she is seeing in yours."
        image={CLOSING_BAND_IMAGE}
      >
        <Link href="/consultation" className="dh-btn dh-btn-gold">
          Talk with Debra
        </Link>
        <Link href="/resources" className="dh-btn dh-btn-light-outline">
          Explore planning resources
        </Link>
      </CtaBand>
    </>
  )
}
