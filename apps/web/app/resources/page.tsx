import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Calculator, House, PiggyBank, ReceiptText } from "lucide-react"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"
import { Eyebrow } from "@/components/ui/eyebrow"

export const metadata: Metadata = {
  title: "Plan & Resources",
  description:
    "Free homebuyer calculators and trustworthy resources for understanding monthly payments, affordability, closing costs, down payments, credit, and the buying process.",
}

const calculatorLinks = [
  {
    title: "Mortgage payment calculator",
    body: "Estimate principal, interest, taxes, insurance, mortgage insurance, HOA costs, and the total monthly housing payment.",
    href: "/resources/calculators/mortgage-payment",
    icon: Calculator,
  },
  {
    title: "Home affordability calculator",
    body: "Create a conservative planning price using household income, monthly debts, down payment, and ownership costs.",
    href: "/resources/calculators/affordability",
    icon: House,
  },
  {
    title: "Closing cost estimator",
    body: "Plan for the down payment, estimated closing costs, prepaid items, escrow funding, and known credits.",
    href: "/resources/calculators/closing-costs",
    icon: ReceiptText,
  },
  {
    title: "Down payment planner",
    body: "Compare common down-payment percentages, upfront cash, loan balances, mortgage insurance, and monthly costs.",
    href: "/resources/calculators/down-payment",
    icon: PiggyBank,
  },
]

const groups = [
  {
    heading: "Understand your money",
    items: [
      { title: "Budgeting for a home", body: "See how monthly housing costs really work — beyond just the price tag." },
      { title: "Building and repairing credit", body: "What lenders review, and steady ways to strengthen your profile." },
      { title: "Saving for a down payment", body: "Realistic saving strategies and what assistance programs may do." },
    ],
  },
  {
    heading: "Understand the process",
    items: [
      { title: "The homeownership roadmap", body: "Every step from renting to keys, explained in plain language." },
      { title: "Assistance and special programs", body: "How programs such as NACA and first-time buyer support work." },
      { title: "Working with a REALTOR®", body: "What guidance looks like and what to expect at each stage." },
    ],
  },
]

const guideLinks = [
  { label: "First-Time Buyer Guide", href: "/first-time-buyers" },
  { label: "NACA Education", href: "/naca" },
  { label: "Frequently Asked Questions", href: "/faq" },
  { label: "Find Your Next Step", href: "/start" },
]

export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Plan"
        title="Make the numbers clear before making a move"
        description="Use the planning tools to test different scenarios, then use the guides to understand what the numbers mean and what to do next."
      />

      <Section>
        <div>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Eyebrow>Homebuyer planning tools</Eyebrow>
              <h2 className="mt-3 max-w-2xl text-3xl font-semibold text-foreground">
                Four tools for the questions buyers ask first
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Every result is a planning estimate. Change the assumptions, compare scenarios, and bring the results to a consultation or lender conversation.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {calculatorLinks.map((item) => {
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                        Open tool
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </Section>

      <Section muted>
        <div className="grid gap-12 lg:grid-cols-2">
          {groups.map((group) => (
            <div key={group.heading}>
              <Eyebrow>{group.heading}</Eyebrow>
              <div className="mt-5 flex flex-col gap-4">
                {group.items.map((item) => (
                  <div key={item.title} className="rounded-xl border border-border bg-card p-6">
                    <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-border bg-card p-8">
          <h2 className="text-xl font-semibold text-foreground">Continue with a guide</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {guideLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-lg border border-border bg-background px-5 py-4 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  )
}
