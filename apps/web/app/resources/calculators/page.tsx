import type { Metadata } from "next"
import Link from "next/link"
import { Container } from "@/components/ui/container"

export const metadata: Metadata = { title: "Homebuyer Calculators", description: "Professional planning tools for mortgage payments, affordability, closing costs, and down payments." }

const tools = [
  ["Mortgage payment", "Estimate principal, interest, taxes, insurance, mortgage insurance, and HOA costs.", "/resources/calculators/mortgage-payment"],
  ["Affordability", "Explore a purchase range using income, debts, down payment, and planning assumptions.", "/resources/calculators/affordability"],
  ["Closing costs", "Estimate common cash-to-close categories before you make an offer.", "/resources/calculators/closing-costs"],
  ["Down-payment planner", "Compare savings goals, upfront cash, and monthly-cost scenarios.", "/resources/calculators/down-payment"],
] as const

export default function CalculatorHubPage() { return <>
  <section className="border-b border-border py-16 md:py-24"><Container><p className="text-sm font-semibold uppercase tracking-widest text-accent">Homebuyer calculators</p><h1 className="mt-4 max-w-4xl font-serif text-4xl leading-tight sm:text-5xl">Plan with real numbers before you make a move.</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">Use these estimates to explore tradeoffs and prepare better questions for a lender or advisor. Results are planning estimates—not approvals or loan offers.</p></Container></section>
  <section className="py-12 md:py-16"><Container><div className="divide-y divide-border border-y border-border">{tools.map(([title, body, href]) => <Link key={href} href={href} className="group grid gap-2 py-7 md:grid-cols-[0.45fr_0.55fr] md:items-center"><h2 className="font-sans text-xl font-semibold text-primary group-hover:underline">{title} →</h2><p className="text-sm leading-6 text-muted-foreground">{body}</p></Link>)}</div><p className="mt-8 max-w-3xl text-sm leading-6 text-muted-foreground">No personal financial data is saved by these tools. Actual loan terms, taxes, insurance, fees, and eligibility vary by property, lender, borrower, and program.</p></Container></section>
  </> }
