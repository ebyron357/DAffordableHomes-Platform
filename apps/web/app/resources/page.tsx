import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"
import { Eyebrow } from "@/components/ui/eyebrow"

export const metadata: Metadata = {
  title: "Plan & Resources",
  description:
    "Start with the four questions buyers ask first — what a payment costs, what you can afford, what cash you need at closing, and which programs apply — then go deeper with guides and additional planning tools.",
  alternates: { canonical: "/resources" },
  openGraph: {
    title: "Homebuyer Planning Tools & Resources | D'Affordable Homes",
    description:
      "Four high-value starting points for buyers, plus guides and additional planning tools from Debra Allen, REALTOR®.",
    url: "/resources",
    type: "website",
  },
}

/**
 * Primary visitor actions.
 *
 * The page previously presented every calculator at equal weight, which read
 * as a tool dashboard rather than a place to get help. These four are the
 * questions buyers actually arrive with; everything else is kept, but moved
 * into the quieter "More planning tools" row below.
 */
const PRIMARY_ACTIONS = [
  {
    step: "01",
    title: "Estimate a monthly payment",
    body: "See what principal, interest, taxes, insurance, mortgage insurance and HOA dues add up to each month — the number that actually decides whether a house fits your life.",
    href: "/calculators/mortgage-payment",
    action: "Estimate a payment",
  },
  {
    step: "02",
    title: "Understand what you can afford",
    body: "Work from income, monthly debts and down payment toward a conservative planning price, so you shop in a range you can hold on to after closing.",
    href: "/calculators/affordability",
    action: "Find your range",
  },
  {
    step: "03",
    title: "Prepare the cash for closing",
    body: "Down payment is only part of it. Plan for closing costs, prepaid items and escrow funding so the amount due at the table is not a surprise.",
    href: "/calculators/closing-costs",
    action: "Plan cash to close",
  },
  {
    step: "04",
    title: "Explore buyer education and programs",
    body: "Understand the sequence of a purchase, and learn what assistance programs such as NACA and Homes for Heroes do and do not cover before you apply.",
    href: "/first-time-buyers",
    action: "Start learning",
  },
] as const

/** Kept and working, deliberately quieter. */
const MORE_TOOLS = [
  {
    title: "Down payment planner",
    body: "Compare common down-payment percentages and what each does to your loan balance, mortgage insurance and monthly cost.",
    href: "/calculators/down-payment",
  },
  {
    title: "Rent vs. buy comparison",
    body: "A simplified side-by-side of renting and owning over time, useful when the decision is about timing rather than price.",
    href: "/calculators/rent-vs-buy",
  },
  {
    title: "All planning tools",
    body: "The full calculator index in one place, with the assumptions each tool makes stated up front.",
    href: "/calculators",
  },
] as const

const GUIDES = [
  { label: "Guides & articles", href: "/blog", detail: "Practical reads on programs, local buying and preparation." },
  { label: "First-time buyer guide", href: "/first-time-buyers", detail: "The sequence, start to keys." },
  { label: "Homebuyer programs", href: "/programs", detail: "What to verify before applying." },
  { label: "Garland area guide", href: "/areas/garland", detail: "A local starting point." },
  { label: "Frequently asked questions", href: "/faq", detail: "Short answers to common worries." },
  { label: "Find your next step", href: "/start", detail: "A short assessment, then one clear action." },
] as const

export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Plan"
        title="Start with the question you actually have"
        description="Four places most buyers begin. Work through the one in front of you, then use the guides to understand what the number means and what to do next."
      />

      <Section>
        <ol className="resource-steps">
          {PRIMARY_ACTIONS.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="resource-step">
                <span className="resource-step-number" aria-hidden="true">
                  {item.step}
                </span>
                <span className="resource-step-body">
                  <span className="resource-step-title">{item.title}</span>
                  <span className="resource-step-copy">{item.body}</span>
                  <span className="resource-step-action">
                    {item.action}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
        <p className="resource-disclaimer">
          Every result is a planning estimate, not an approval or a loan offer. Actual terms, taxes, insurance, fees and
          eligibility vary by property, lender, borrower and program.
        </p>
      </Section>

      <Section muted>
        <div className="resource-guides">
          <div>
            <Eyebrow>Keep reading</Eyebrow>
            <h2 className="resource-heading">Understand what the numbers mean</h2>
            <p className="resource-lede">
              A payment estimate is only useful next to the context around it. These explain the process, the programs
              and the local market in plain language.
            </p>
          </div>
          <ul className="resource-guide-list">
            {GUIDES.map((guide) => (
              <li key={guide.href}>
                <Link href={guide.href}>
                  <span>{guide.label}</span>
                  <span>{guide.detail}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section>
        <div className="resource-more">
          <Eyebrow>More planning tools</Eyebrow>
          <ul className="resource-more-list">
            {MORE_TOOLS.map((tool) => (
              <li key={tool.href}>
                <Link href={tool.href}>
                  <strong>{tool.title}</strong>
                  <span>{tool.body}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  )
}
