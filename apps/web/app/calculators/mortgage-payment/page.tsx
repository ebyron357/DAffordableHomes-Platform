import type { Metadata } from "next"
import { MortgageCalculator } from "@/components/calculators/homebuyer-calculators"
import { CalculatorGuide, calculatorCrumbs } from "@/components/calculators/calculator-guide"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"

export const metadata: Metadata = {
  title: "Mortgage Payment Calculator",
  description:
    "Estimate a monthly mortgage payment with principal, interest, PMI, property taxes, and homeowners insurance. A planning estimate only, not a loan quote.",
  alternates: { canonical: "/calculators/mortgage-payment" },
}

/*
 * This route was the last calculator still on the pre-redesign layout: a bare
 * heading on the page background, no breadcrumb, and a closing aside the other
 * four tools did not have. It now shares their masthead and guide, and the
 * "Review it with Debra" step lives in the guide's closing band.
 */
export default function MortgagePaymentCalculatorPage() {
  return (
    <>
      <PageHeader
        eyebrow="Planning tool"
        crumbs={calculatorCrumbs("mortgage-payment")}
        title="Mortgage payment calculator"
        description="Estimate principal, interest, taxes, insurance, mortgage insurance and HOA dues together. This is a planning estimate, not a loan quote."
      />
      <Section>
        <MortgageCalculator />
      </Section>
      <CalculatorGuide slug="mortgage-payment" />
    </>
  )
}
