import type { Metadata } from "next"
import { MortgageCalculator } from "@/components/calculators/homebuyer-calculators"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"

export const metadata: Metadata = {
  title: "Mortgage Payment Calculator",
  description:
    "Estimate a monthly housing payment with principal, interest, property taxes, homeowners insurance, mortgage insurance, and HOA costs.",
}

export default function MortgagePaymentCalculatorPage() {
  return (
    <>
      <PageHeader
        eyebrow="Plan"
        title="Mortgage payment calculator"
        description="See the full estimated monthly housing cost — not only principal and interest. Adjust every assumption to match the property and financing you are considering."
        crumbs={[
          { label: "Plan & Resources", href: "/resources" },
          { label: "Mortgage payment calculator" },
        ]}
      />
      <Section>
        <MortgageCalculator />
      </Section>
    </>
  )
}
