import type { Metadata } from "next"
import { MortgageCalculator } from "@/components/calculators/homebuyer-calculators"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = { title: "Mortgage Payment Calculator", description: "Estimate a monthly housing payment with principal, interest, property taxes, homeowners insurance, mortgage insurance, and HOA costs." }

export default function MortgagePaymentCalculatorPage() {
  return <>
    <section className="py-12 md:py-16"><Container><p className="text-xs font-semibold uppercase tracking-[0.1em] text-accent">Planning tool</p><h1 className="mt-4 font-serif text-[42px] font-normal leading-tight sm:text-[52px]">Mortgage payment calculator</h1><p className="mt-4 text-lg text-muted-foreground">Estimate the monthly cost of a home before you begin touring.</p><p className="mt-5 text-sm">This is a planning estimate—not a loan quote. Debra can help you review the result in context.</p></Container></section>
    <section className="pb-12 md:pb-16"><Container><MortgageCalculator /></Container></section>
    <section className="pb-16 md:pb-20"><Container className="grid gap-8 md:grid-cols-[1fr_340px] md:items-start"><div><h2 className="font-serif text-3xl font-normal">What this number means</h2><p className="mt-4 max-w-3xl leading-7 text-muted-foreground">Use the estimate to compare scenarios—not to decide what you can safely afford by itself. Your budget should also account for savings, repairs, debt, and changes in monthly expenses.</p></div><aside className="bg-secondary p-6"><h2 className="font-serif text-2xl font-normal">Review it with Debra</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Bring your estimate to a no-pressure planning conversation.</p><Button href="/book" className="mt-4">Schedule a review</Button></aside></Container></section>
  </>
}
