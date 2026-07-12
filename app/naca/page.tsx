import type { Metadata } from "next"
import { PageHeader } from "@/components/page/page-header"
import { Section, Prose } from "@/components/page/section"
import { Button } from "@/components/ui/button"
import { Notice } from "@/components/states/notice"

export const metadata: Metadata = {
  title: "NACA Education",
  description:
    "A plain-language introduction to the NACA process for first-time buyers, with a clear boundary between general information and official program guidance.",
  alternates: { canonical: "/naca" },
}

export default function NacaPage() {
  return (
    <>
      <PageHeader
        eyebrow="Learn"
        title="A plain-language introduction to NACA"
        intro="NACA is one path some buyers explore on their way to homeownership. Here's a general overview to help you understand what it is — and where to go for official, current details."
        crumbs={[{ label: "Home", href: "/" }, { label: "Learn" }, { label: "NACA" }]}
      />

      <Section>
        <div className="max-w-2xl">
          <Notice title="Where program details come from" tone="info">
            Program requirements, eligibility, and terms change over time and are set by NACA — not by D&apos;Affordable
            Homes. For current, official information, always confirm directly with NACA or a qualified professional. We
            provide general education only.
          </Notice>
        </div>

        <div className="mt-10">
          <Prose>
            <h2>What this page is for</h2>
            <p>
              The goal here is simply to reduce confusion. Many first-time buyers hear about NACA but aren&apos;t sure
              what it involves or whether it fits their situation. This overview helps you ask better questions when you
              speak with the official source.
            </p>

            <h3>Understanding the process generally</h3>
            <p>
              Programs like NACA typically involve education, documentation, and a series of steps a buyer works
              through over time. Preparation and consistency matter. What matters most is that you get accurate,
              up-to-date requirements from the program itself rather than relying on secondhand summaries.
            </p>

            <h3>How Debra can help</h3>
            <p>
              As a REALTOR&reg;, Debra can help you understand the general landscape and how a program like this fits
              into the broader homebuying journey. Questions about eligibility, approval, and program-specific terms
              belong to NACA or a qualified professional, and we&apos;ll always point you there.
            </p>
          </Prose>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button href="/first-time-buyers" variant="outline">
            First-time buyer basics
          </Button>
          <Button href="/book">Talk through your options</Button>
        </div>
      </Section>
    </>
  )
}
