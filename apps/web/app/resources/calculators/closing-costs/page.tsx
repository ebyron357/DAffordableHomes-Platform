import type { Metadata } from "next"
import { ClosingCostCalculator } from "@/components/calculators/homebuyer-calculators"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"

export const metadata: Metadata = {
  title: "Closing Cost Estimator",
  description:
    "Estimate cash needed at closing, including the down payment, closing costs, prepaid items, escrow funding, and known credits.",
}

export default function ClosingCostCalculatorPage() {
  return (
    <>
      <PageHeader
        eyebrow="Plan"
        title="Closing cost estimator"
        description="Plan for more than the down payment. Adjust the assumptions using lender or local guidance as it becomes available."
        crumbs={[
          { label: "Plan & Resources", href: "/resources" },
          { label: "Closing cost estimator" },
        ]}
      />
      <Section>
        <ClosingCostCalculator />
      </Section>
    </>
  )
}
