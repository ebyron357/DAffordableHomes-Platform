import type { Metadata } from "next"
import Link from "next/link"
import { Container } from "@/components/ui/container"

export const metadata: Metadata = {
  title: "Homebuyer Calculators",
  description: "Plan affordability, cash needs, mortgage payments, and rent-versus-buy scenarios.",
  alternates: { canonical: "/calculators" },
}

/**
 * The calculator index.
 *
 * `/resources` is the front door and leads with three of these as primary
 * actions; this page is the full inventory. It keeps the same ordering so the
 * two pages agree about what matters most, and every tool stays reachable.
 */
const PRIMARY = [
  ["Mortgage payment", "Estimate principal, interest, taxes, insurance, mortgage insurance, and HOA costs.", "/calculators/mortgage-payment"],
  ["Affordability", "Explore a purchase range using income, debts, down payment, and planning assumptions.", "/calculators/affordability"],
  ["Closing costs", "Plan the down payment, closing costs, prepaid items, and escrow funding due at the table.", "/calculators/closing-costs"],
] as const

const SECONDARY = [
  ["Down payment planner", "Compare down-payment percentages and their effect on loan balance and monthly cost.", "/calculators/down-payment"],
  ["Rent vs. buy", "Compare simplified renting and homeownership costs over time.", "/calculators/rent-vs-buy"],
] as const

export default function CalculatorHubPage() {
  return (
    <>
      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">Homebuyer calculators</p>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-tight sm:text-5xl">
            Plan with real numbers before you make a move.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            Use these estimates to explore tradeoffs and prepare better questions for a lender or advisor. Results are planning estimates—not approvals or loan offers.
          </p>
        </Container>
      </section>
      <section className="py-12 md:py-16">
        <Container>
          <div className="divide-y divide-border border-y border-border">
            {PRIMARY.map(([title, body, href]) => (
              <Link key={href} href={href} className="group grid gap-2 py-7 md:grid-cols-[0.45fr_0.55fr] md:items-center">
                <h2 className="font-sans text-xl font-semibold text-primary group-hover:underline">{title} →</h2>
                <p className="text-sm leading-6 text-muted-foreground">{body}</p>
              </Link>
            ))}
          </div>

          <h2 className="mt-12 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            More planning tools
          </h2>
          <div className="mt-4 divide-y divide-border border-y border-border">
            {SECONDARY.map(([title, body, href]) => (
              <Link key={href} href={href} className="group grid gap-1 py-5 md:grid-cols-[0.45fr_0.55fr] md:items-center">
                <h3 className="font-sans text-base font-semibold text-primary group-hover:underline">{title} →</h3>
                <p className="text-sm leading-6 text-muted-foreground">{body}</p>
              </Link>
            ))}
          </div>

          <p className="mt-8 max-w-3xl text-sm leading-6 text-muted-foreground">
            No personal financial data is saved by these tools. Actual loan terms, taxes, insurance, fees, and eligibility vary by property, lender, borrower, and program.
          </p>
        </Container>
      </section>
    </>
  )
}
