import type { Metadata } from "next"
import Link from "next/link"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"
import { Container } from "@/components/ui/container"
import { Prose } from "@/components/page/prose"

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms for using the D'Affordable Homes website. Our content is educational and not legal, financial, or lending advice.",
}

export default function TermsPage() {
  return (
    <>
      <PageHeader eyebrow="Policies" title="Terms of Use" />
      <Section>
        <Container>
          <Prose>
            <p><strong>Effective date: August 4, 2026.</strong> By accessing this website, you agree to these Terms of Use. If you do not agree, do not use the site.</p>
            <h2>Educational purpose</h2>
            <p>
              The content on this site is provided for general educational purposes. It is not legal, financial, tax,
              or mortgage-lending advice, and it should not be relied upon as a guarantee of loan approval, rates, or
              outcomes. Always consult a qualified professional for advice specific to your situation.
            </p>
            <h2>No fabricated guarantees</h2>
            <p>
              We strive for accuracy and honesty. Program details, assistance options, and market conditions change;
              we encourage you to verify specifics with the relevant institution or program before making decisions.
            </p>
            <h2>Your use of the site</h2>
            <ul>
              <li>Use the site lawfully and respectfully</li>
              <li>Don&apos;t attempt to disrupt or misuse the service</li>
              <li>Information you submit should be accurate and your own</li>
            </ul>
            <h2>No agency relationship</h2>
            <p>Using the website, calculators, guides, or contact forms does not create a brokerage, representation, lender, attorney-client, tax-advisor, or other professional relationship. Any representation relationship requires the applicable written agreements and disclosures.</p>
            <h2>Programs, listings, and third parties</h2>
            <p>Government, nonprofit, lending, assistance, and third-party program rules can change. External links are provided for convenience and do not imply control or endorsement. Live property information is not available unless supplied through an approved MLS or IDX provider.</p>
            <h2>Calculators and estimates</h2>
            <p>Calculator outputs are educational estimates based on user-entered assumptions. They are not appraisals, loan offers, approvals, disclosures, or advice and may omit costs that apply to a specific property or transaction.</p>
            <h2>Intellectual property</h2>
            <p>Site text, design, branding, and original materials may not be copied, republished, or used commercially without permission, except for lawful personal use of educational information.</p>
            <h2>Availability and liability</h2>
            <p>The site may be changed, suspended, or unavailable. To the extent permitted by law, D&apos;Affordable Homes is not responsible for decisions made solely from website content, third-party services, or interrupted availability.</p>
            <h2>Texas law</h2>
            <p>These terms are governed by applicable Texas and United States law, without overriding rights that cannot legally be waived.</p>
            <h2>Questions</h2>
            <p>
              If anything here is unclear, please <Link href="/contact">contact us</Link>.
            </p>
          </Prose>
        </Container>
      </Section>
    </>
  )
}
