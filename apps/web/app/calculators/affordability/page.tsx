import type { Metadata } from "next"
import { AffordabilityCalculator } from "@/components/calculators/homebuyer-calculators"
import { CalculatorGuide, calculatorCrumbs } from "@/components/calculators/calculator-guide"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"

export const metadata: Metadata = {
  title: "How Much House Can I Afford? Calculator",
  description:
    "How much house can you afford? Estimate a responsible price range from your income, debts, rate and cash on hand. A planning estimate, not a loan approval.",
  alternates: { canonical: "/calculators/affordability" },
}

export default function AffordabilityCalculatorPage() {
  return (
    <>
      <PageHeader
        eyebrow="Planning tool"
        crumbs={calculatorCrumbs("affordability")}
        title="How much house can I afford?"
        description="Estimate a responsible planning range from income, debts, rate, and cash available."
      />
      <Section>
        <AffordabilityCalculator />
      </Section>
      <CalculatorGuide slug="affordability" />
    </>
  )
}
