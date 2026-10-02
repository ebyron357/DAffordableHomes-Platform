import type { Metadata } from "next"
import Link from "next/link"
import { Calculator, Coins, HandCoins, Home, Scale, ShieldCheck, Wallet } from "lucide-react"
import { PageHeader } from "@/components/page/page-header"
import { Band, BandLead, CtaBand, Features, StatusStrip } from "@/components/page/editorial"
import { CLOSING_BAND_IMAGE } from "@/lib/content/imagery"

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
 *
 * Each tool carries the icon for the question it answers — a wallet for the
 * monthly number, a house for the price range, coins for the cash at closing —
 * so the page reads as a set of questions rather than a list of links.
 */
const PRIMARY = [
  {
    title: "Mortgage payment",
    body: "Estimate principal, interest, taxes, insurance, mortgage insurance and HOA costs — the number that has to fit your month.",
    href: "/calculators/mortgage-payment",
    icon: Wallet,
    tone: "teal" as const,
    action: "Estimate a payment",
  },
  {
    title: "Affordability",
    body: "Work from income, monthly debts and down payment toward a conservative planning price you can hold on to after closing.",
    href: "/calculators/affordability",
    icon: Home,
    tone: "navy" as const,
    action: "Find your range",
  },
  {
    title: "Closing costs",
    body: "Down payment, closing costs, prepaid items and escrow funding — the full amount due at the table, not just part of it.",
    href: "/calculators/closing-costs",
    icon: Coins,
    tone: "gold" as const,
    action: "Plan cash to close",
  },
] as const

const SECONDARY = [
  {
    title: "Down payment planner",
    body: "Compare common down-payment percentages and what each does to your loan balance, mortgage insurance and monthly cost.",
    href: "/calculators/down-payment",
    icon: HandCoins,
    tone: "green" as const,
    action: "Compare options",
  },
  {
    title: "Rent vs. buy",
    body: "A simplified side-by-side of renting and owning over time, useful when the decision is about timing rather than price.",
    href: "/calculators/rent-vs-buy",
    icon: Scale,
    tone: "teal" as const,
    action: "Compare over time",
  },
] as const

export default function CalculatorHubPage() {
  return (
    <>
      <PageHeader
        eyebrow="Homebuyer calculators"
        eyebrowIcon={Calculator}
        title="Plan with real numbers before you make a move"
        intro="Use these estimates to explore trade-offs and prepare better questions for a lender or advisor. Results are planning estimates — not approvals or loan offers."
        crumbs={[{ label: "Home", href: "/" }, { label: "Calculators" }]}
        facts={[
          { label: "Nothing is saved", icon: ShieldCheck },
          { label: "Estimates, not offers", icon: Scale },
        ]}
        motif="route"
      >
        <Link href="/calculators/mortgage-payment" className="dh-btn dh-btn-gold">
          Start with a monthly payment
        </Link>
        <Link href="/start" className="dh-btn dh-btn-light-outline">
          Not sure where to start?
        </Link>
      </PageHeader>

      <Band tone="white" aria-labelledby="calculators-primary-heading">
        <BandLead
          eyebrow="Start here"
          eyebrowIcon={Calculator}
          title="The three questions buyers ask first"
          titleId="calculators-primary-heading"
          lede="What will it cost each month, what can I sensibly spend, and how much cash do I need on the day. Answer these and the rest of the search gets much calmer."
        />
        <Features items={PRIMARY} rule="teal" />
      </Band>

      <Band tone="alt" aria-labelledby="calculators-more-heading">
        <BandLead
          eyebrow="More planning tools"
          eyebrowIcon={Scale}
          title="When the question is a trade-off"
          titleId="calculators-more-heading"
          lede="Useful once the basics are in place — for deciding how much to put down, or whether the timing is right at all."
        />
        <Features items={SECONDARY} rule="green" />
        <div className="dh-stack-top">
          <StatusStrip icon={ShieldCheck} title="No personal financial data is saved by these tools">
            <p>
              Everything runs in your browser. Actual loan terms, taxes, insurance, fees and eligibility vary by
              property, lender, borrower and program — confirm anything you intend to act on.
            </p>
          </StatusStrip>
        </div>
      </Band>

      <CtaBand
        eyebrow="Once you have a number"
        title="Bring it to someone who can tell you what it means"
        titleId="calculators-cta-heading"
        body="A figure on a screen is a starting point. Debra can tell you what it changes about your search, and which parts belong to a lender instead."
        image={CLOSING_BAND_IMAGE}
      >
        <Link href="/consultation" className="dh-btn dh-btn-gold">
          Talk it through with Debra
        </Link>
        <Link href="/resources" className="dh-btn dh-btn-light-outline">
          Back to planning resources
        </Link>
      </CtaBand>
    </>
  )
}
