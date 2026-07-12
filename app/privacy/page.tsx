import type { Metadata } from "next"
import { PageHeader } from "@/components/page/page-header"
import { Section, Prose } from "@/components/page/section"
import { Notice } from "@/components/states/notice"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How D'Affordable Homes handles your information. We collect only what we need and never sell your personal data.",
}

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy policy"
        intro="Your trust matters. This page explains, in plain language, how we handle information on this site."
        crumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
      />
      <Section>
        <Prose>
          <p>
            D&apos;Affordable Homes respects your privacy. We collect only the information needed to respond to your
            questions and provide the education and services you request. We do not sell your personal information.
          </p>
          <h2>Information we collect</h2>
          <ul>
            <li>Details you choose to share, such as your name, email, and message when you contact us.</li>
            <li>Basic, non-identifying usage information that helps us improve the site.</li>
          </ul>
          <h2>How we use it</h2>
          <ul>
            <li>To respond to your questions and follow up on your request.</li>
            <li>To improve our education, tools, and resources.</li>
          </ul>
          <h2>Your choices</h2>
          <p>
            You can ask us what information we hold about you, request corrections, or ask us to delete it. Reach out any
            time through our <a href="/contact">contact page</a>.
          </p>
        </Prose>
        <Notice title="This policy is being finalized" tone="muted" className="mt-10 max-w-2xl">
          The full legal privacy policy is under review before publication. This summary reflects our intended practices;
          the final version will be posted here once confirmed.
        </Notice>
      </Section>
    </>
  )
}
