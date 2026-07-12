import type { Metadata } from "next"
import { PageHeader } from "@/components/page/page-header"
import { Section, Prose } from "@/components/page/section"

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description:
    "D'Affordable Homes is committed to digital accessibility, targeting WCAG 2.2 AA so everyone can use this site.",
}

export default function AccessibilityPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our commitment"
        title="Accessibility statement"
        intro="We want everyone to be able to learn about and plan for homeownership here — including people who use assistive technology."
        crumbs={[{ label: "Home", href: "/" }, { label: "Accessibility Statement" }]}
      />
      <Section>
        <Prose>
          <p>
            D&apos;Affordable Homes is committed to making this website accessible to the widest possible audience. We aim
            to conform to the Web Content Accessibility Guidelines (WCAG) 2.2 at the AA level, which help make web content
            more accessible to people with a wide range of disabilities.
          </p>
          <h2>What we do</h2>
          <ul>
            <li>Use semantic HTML and clear heading structure.</li>
            <li>Provide text alternatives for meaningful images.</li>
            <li>Support keyboard navigation and visible focus indicators.</li>
            <li>Maintain sufficient color contrast for text and interactive elements.</li>
            <li>Include a skip link so keyboard users can jump straight to the main content.</li>
          </ul>
          <h2>Feedback</h2>
          <p>
            Accessibility is ongoing work. If you encounter a barrier on this site, please{" "}
            <a href="/contact">let us know</a> and we&apos;ll do our best to fix it and provide the information you need in
            another format.
          </p>
        </Prose>
      </Section>
    </>
  )
}
