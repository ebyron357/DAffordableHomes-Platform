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
            <p>
              Your trust matters to us. This policy explains, in plain language, how D&apos;Affordable Homes handles
              information you choose to share. A finalized legal version will be published prior to public launch.
            </p>
            <h2>What we collect</h2>
            <p>
              We only collect information you provide directly — such as your name, email, and message when you contact
              us or request a consultation. We do not require you to create an account to learn on this site.
            </p>
            <h2>How we use it</h2>
            <ul>
              <li>To respond to your questions and consultation requests</li>
              <li>To share resources you ask for</li>
              <li>To improve our education and tools</li>
            </ul>
            <h2>What we don&apos;t do</h2>
            <p>
              We do not sell your personal information. We do not send high-pressure marketing. You can ask us to
              delete your information at any time.
            </p>
            <h2>Contact</h2>
            <p>
              Questions about privacy? <Link href="/contact">Reach out</Link> and we&apos;ll be glad to help.
            </p>
          </Prose>
        </Container>
      </Section>
    </>
  )
}
