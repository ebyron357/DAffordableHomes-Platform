import type { Metadata } from "next"
import { DownPaymentPlanner } from "@/components/calculators/homebuyer-calculators"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"

export const metadata: Metadata = {
  title: "Down Payment Planner",
  description:
    "Compare common down-payment percentages, upfront cash, estimated loan balances, mortgage insurance, and monthly housing costs.",
}

export default function DownPaymentPlannerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Plan"
        title="Down payment planner"
        description="Compare several common down-payment scenarios side by side. The lowest upfront option is not always the lowest total monthly cost."
        crumbs={[
          { label: "Plan & Resources", href: "/resources" },
          { label: "Down payment planner" },
        ]}
      />
      <Section>
        <DownPaymentPlanner />
      </Section>
    </>
  )
}
