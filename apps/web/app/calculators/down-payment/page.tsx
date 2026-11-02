import type { Metadata } from "next"
import { DownPaymentPlanner } from "@/components/calculators/homebuyer-calculators"
import { CalculatorGuide, calculatorCrumbs } from "@/components/calculators/calculator-guide"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"

export const metadata: Metadata = {
  title: "Down Payment Calculator and Planner",
  description:
    "Estimate your down payment, closing costs, and the other cash you may need to buy a home. A planning estimate only, not a loan quote or approval.",
  alternates: { canonical: "/calculators/down-payment" },
}

export default function DownPaymentPlannerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Planning tool"
        crumbs={calculatorCrumbs("down-payment")}
        title="Down payment calculator and planner"
        description="Estimate down payment, closing costs, and other cash needed."
      />
      <Section>
        <DownPaymentPlanner />
      </Section>
      <CalculatorGuide slug="down-payment" />
    </>
  )
}
