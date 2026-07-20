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
        eyebrow="Affordability planner"
        title="Explore a purchase range that fits the rest of your life"
        description="Use income, monthly debts, available down payment, and ownership-cost assumptions to create a conservative planning range. A lender determines qualification and loan terms."
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
