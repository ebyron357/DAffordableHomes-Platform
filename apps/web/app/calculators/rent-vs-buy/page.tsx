import type { Metadata } from "next"
import { RentVsBuyCalculator } from "@/components/calculators/homebuyer-calculators"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"

export const metadata: Metadata = {
  title: "Rent vs. Buy Calculator",
  description:
    "Compare the simplified costs of renting and owning a home over time, so you can see how the numbers change before you make a decision.",
  alternates: { canonical: "/calculators/rent-vs-buy" },
}

export default function RentVsBuyCalculatorPage() {
  return (
    <>
      <PageHeader
        eyebrow="Planning tool"
        title="Rent vs. buy calculator"
        description="Compare simplified renting and homeownership costs over time."
      />
      <Section>
        <RentVsBuyCalculator />
      </Section>
    </>
  )
}
