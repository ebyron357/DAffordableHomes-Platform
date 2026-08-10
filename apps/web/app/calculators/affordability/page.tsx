import type { Metadata } from "next"
import { AffordabilityCalculator } from "@/components/calculators/homebuyer-calculators"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"

export const metadata: Metadata = {
  title: "Affordability Calculator",
  description: "Estimate a responsible planning range from income, debts, rate, and cash available.",
  alternates: { canonical: "/calculators/affordability" },
}

export default function AffordabilityCalculatorPage() {
  return (
    <>
      <PageHeader
        eyebrow="Planning tool"
        title="Affordability calculator"
        description="Estimate a responsible planning range from income, debts, rate, and cash available."
      />
      <Section>
        <AffordabilityCalculator />
      </Section>
    </>
  )
}
