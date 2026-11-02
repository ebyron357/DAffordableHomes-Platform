import type { Metadata } from "next"
import { ClosingCostCalculator } from "@/components/calculators/homebuyer-calculators"
import { CalculatorGuide, calculatorCrumbs } from "@/components/calculators/calculator-guide"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"

export const metadata: Metadata = {
  title: "Closing Cost Calculator",
  description:
    "Estimate closing costs and the total cash you need to close: down payment, closing costs, prepaid items, escrow funding and known credits.",
  alternates: { canonical: "/calculators/closing-costs" },
}

export default function ClosingCostCalculatorPage() {
  return (
    <>
      <PageHeader
        eyebrow="Planning tool"
        crumbs={calculatorCrumbs("closing-costs")}
        title="Closing cost calculator"
        description="Estimate cash needed at closing, including the down payment, closing costs, prepaid items, escrow funding, and known credits."
      />
      <Section>
        <ClosingCostCalculator />
      </Section>
      <CalculatorGuide slug="closing-costs" />
    </>
  )
}
