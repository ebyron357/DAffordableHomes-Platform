import type { Metadata } from "next"
import { AffordabilityCalculator } from "@/components/calculators/homebuyer-calculators"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"

export const metadata: Metadata = {
  title: "Home Affordability Calculator",
  description:
    "Create a conservative home-price planning estimate using household income, monthly debts, down payment, interest rate, taxes, insurance, and HOA costs.",
}

export default function AffordabilityCalculatorPage() {
  return (
    <>
      <PageHeader
        eyebrow="Plan"
        title="Home affordability calculator"
        description="Estimate a responsible planning price before searching. This tool is designed to clarify the numbers, not replace lender pre-approval or professional guidance."
        crumbs={[
          { label: "Plan & Resources", href: "/resources" },
          { label: "Home affordability calculator" },
        ]}
      />
      <Section>
        <AffordabilityCalculator />
      </Section>
    </>
  )
}
