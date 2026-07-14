import type { Metadata } from "next"
import Link from "next/link"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"
import { Container } from "@/components/ui/container"
import { Prose } from "@/components/page/prose"

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description:
    "D'Affordable Homes is committed to WCAG 2.2 AA accessibility so everyone can use our education and planning tools.",
}

export default function AccessibilityPage() {
  return (
    <>
      <PageHeader eyebrow="Our commitment" title="Accessibility Statement" />
      <Section>
        <Container>
          <Prose>
            <p>
              D&apos;Affordable Homes is committed to ensuring digital accessibility for people of all abilities. We are
              continually improving the user experience for everyone and applying the relevant accessibility standards.
            </p>
            <h2>Our standard</h2>
            <p>
              We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.2 at Level AA. These guidelines
              explain how to make web content more accessible for people with a wide range of disabilities.
            </p>
            <h2>What we do</h2>
            <ul>
              <li>Provide clear text alternatives for meaningful images</li>
              <li>Support full keyboard navigation and a visible skip-to-content link</li>
              <li>Maintain sufficient color contrast and readable typography</li>
              <li>Use semantic structure and ARIA where appropriate for assistive technology</li>
              <li>Respect reduced-motion preferences</li>
            </ul>
            <h2>Feedback</h2>
            <p>
              If you encounter any accessibility barriers, please <Link href="/contact">let us know</Link>. We take
              this seriously and will work to resolve the issue and improve.
            </p>
          </Prose>
        </Container>
      </Section>
    </>
  )
}
