import type { Metadata } from "next"
import Link from "next/link"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"
import { Container } from "@/components/ui/container"
import { Prose } from "@/components/page/prose"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How D'Affordable Homes collects, uses, and protects your information. We only use what you share to help you, and never sell your data.",
}

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Policies" title="Privacy Policy" />
      <Section>
        <Container>
          <Prose>
            <p><strong>Effective date: August 4, 2026.</strong> This policy explains how D&apos;Affordable Homes handles information when you use this website.</p>
            <h2>What we collect</h2>
            <p>
              The educational pages and calculators do not require an account. When you choose to submit a configured contact or program form, we may collect your name, email, phone number, location preferences, timing, questions, consent choice, referral page, and campaign parameters. Do not submit Social Security numbers, bank information, account numbers, or sensitive financial documents.
            </p>
            <h2>How we use it</h2>
            <ul>
              <li>To respond to your questions and consultation requests</li>
              <li>To share resources you ask for</li>
              <li>To improve our education and tools</li>
              <li>To protect the site from spam, fraud, misuse, and security threats</li>
            </ul>
            <h2>Analytics and device information</h2>
            <p>Analytics tools are loaded only when configured. They may collect device, browser, page, referral, and interaction information. The site does not intentionally send form contents or calculator inputs to analytics.</p>
            <h2>Sharing and service providers</h2>
            <p>We do not sell personal information. Information may be shared with service providers used to operate the website or deliver a request, and when required by law or needed to protect rights and security. Provider access is limited to the applicable service.</p>
            <h2>Retention and security</h2>
            <p>Information should be kept only as long as reasonably needed for the request, legal obligations, dispute resolution, and security. Reasonable safeguards are used, but no internet transmission or storage method is guaranteed secure.</p>
            <h2>Your choices</h2>
            <p>You may ask to access, correct, or delete information you submitted, subject to legal and operational requirements. You may also decline to submit a form and continue using the educational content and calculators.</p>
            <h2>Children and external links</h2>
            <p>This site is intended for adults planning a real-estate transaction and is not directed to children under 13. External websites have their own privacy practices.</p>
            <h2>Policy updates</h2>
            <p>Material changes will be posted on this page with a revised effective date.</p>
            <h2>Contact</h2>
            <p>
              Questions or privacy requests may be submitted through the <Link href="/contact">contact page</Link>. A direct privacy email or mailing address must be added after the client confirms the official contact information.
            </p>
          </Prose>
        </Container>
      </Section>
    </>
  )
}
