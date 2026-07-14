import type { Metadata } from "next"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"
import { FindYourNextStep } from "@/components/next-step/find-your-next-step"

export const metadata: Metadata = {
  title: "Find Your Next Step",
  description:
    "Answer a few short questions to understand where you are in the homeownership journey and find educational resources for your next step. No contact information required.",
  alternates: { canonical: "/start" },
}

export default function StartPage() {
  return (
    <>
      <PageHeader
        eyebrow="Find Your Next Step"
        title="Let's find your next step together"
        intro="Answer a few short questions and we'll suggest educational resources based on where you are today. You don't need to share any contact information, and nothing here is loan approval or financial advice."
        crumbs={[{ label: "Home", href: "/" }, { label: "Find Your Next Step" }]}
      />
      <Section>
        <div className="mx-auto max-w-2xl">
          <FindYourNextStep />
        </div>
      </Section>
    </>
  )
}
