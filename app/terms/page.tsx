import type { Metadata } from "next"
import { PageHeader } from "@/components/page/page-header"
import { Section, Prose } from "@/components/page/section"
import { Notice } from "@/components/states/notice"

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms for using the D'Affordable Homes website. Our content is educational and is not legal, financial, or mortgage advice.",
}

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms of use"
        intro="A few important notes about using this site and the educational nature of its content."
        crumbs={[{ label: "Home", href: "/" }, { label: "Terms of Use" }]}
      />
      <Section>
        <Prose>
          <h2>Educational content</h2>
          <p>
            The information on this site is provided for general educational purposes. It is not legal, financial, tax, or
            mortgage advice, and it should not be relied on as a substitute for advice from a qualified professional
            licensed in your area.
          </p>
          <h2>No guarantees</h2>
          <p>
            Homeownership programs, rates, and requirements change and vary by situation. We do not guarantee eligibility,
            approval, or specific outcomes. Always confirm details with the relevant lender, program, or authority.
          </p>
          <h2>Acceptable use</h2>
          <p>
            Please use this site lawfully and respectfully. Do not attempt to disrupt the site or misuse the information
            provided here.
          </p>
        </Prose>
        <Notice title="This document is being finalized" tone="muted" className="mt-10 max-w-2xl">
          The complete terms of use are under legal review. This summary reflects our intended terms; the final version
          will be posted here once confirmed.
        </Notice>
      </Section>
    </>
  )
}
