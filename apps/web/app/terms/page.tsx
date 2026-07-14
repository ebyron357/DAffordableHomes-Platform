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
            <p>
              Welcome to D&apos;Affordable Homes. By using this website, you agree to these terms. A finalized legal
              version will be published prior to public launch.
            </p>
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
