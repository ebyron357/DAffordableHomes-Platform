import type { Metadata } from "next"
import { ClosingCostCalculator } from "@/components/calculators/homebuyer-calculators"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"

export const metadata: Metadata = {
  title: "Closing Cost Estimator",
  description: "Estimate cash needed at closing, including the down payment, closing costs, prepaid items, escrow funding, and known credits.",
  alternates: { canonical: "/calculators/closing-costs" },
}

export default function ClosingCostCalculatorPage() {
  return (
    <>
      <PageHeader
        eyebrow="Planning tool"
        title="Closing cost estimator"
        description="Estimate cash needed at closing, including the down payment, closing costs, prepaid items, escrow funding, and known credits."
      />
      <Section>
        <ClosingCostCalculator />
      </Section>
    </>
  )
}
