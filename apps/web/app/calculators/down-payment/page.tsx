import type { Metadata } from "next"
import { DownPaymentPlanner } from "@/components/calculators/homebuyer-calculators"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"

export const metadata: Metadata = {
  title: "Down Payment & Closing Cost Planner",
  description: "Estimate down payment, closing costs, and other cash needed.",
  alternates: { canonical: "/calculators/down-payment" },
}

export default function DownPaymentPlannerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Planning tool"
        title="Down payment & closing cost planner"
        description="Estimate down payment, closing costs, and other cash needed."
      />
      <Section>
        <DownPaymentPlanner />
      </Section>
    </>
  )
}
