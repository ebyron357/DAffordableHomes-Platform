import type { Metadata } from "next"
import { MortgageCalculator } from "@/components/calculators/homebuyer-calculators"
import { Container } from "@/components/ui/container"

export const metadata: Metadata = {
  title: "Mortgage Payment Calculator",
  description:
    "Estimate a monthly housing payment with principal, interest, property taxes, homeowners insurance, mortgage insurance, and HOA costs.",
}

export default function MortgagePaymentCalculatorPage() {
  return (
    <>
      <section className="py-13 md:py-18"><Container><p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Planning tool</p><h1 className="mt-4 font-serif text-[42px] leading-tight sm:text-[54px]">Mortgage payment calculator</h1><p className="mt-4 max-w-3xl text-[17px] leading-7 text-muted-foreground">Estimate the monthly cost of a home before you begin touring.</p><p className="mt-5 text-sm leading-6">This is a planning estimate—not a loan quote. Debra can help you review the result in context.</p></Container></section>
      <section className="pb-16 md:pb-20"><Container><MortgageCalculator /><div className="mt-12 grid gap-8 md:grid-cols-[1fr_320px]"><div><h2 className="font-serif text-3xl">What this number means</h2><p className="mt-3 max-w-2xl text-[15px] leading-6 text-muted-foreground">Use the estimate to compare scenarios—not to decide what you can safely afford by itself. Your budget should also account for savings, repairs, debt, and changes in monthly expenses.</p></div><div className="bg-muted p-6"><h2 className="font-serif text-2xl">Review it with Debra</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Bring your estimate to a no-pressure planning conversation.</p></div></div></Container></section>
    </>
  )
}
