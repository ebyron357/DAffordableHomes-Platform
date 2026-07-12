import type { Metadata } from "next"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"
import { Container } from "@/components/ui/container"
import { ContactForm } from "@/components/contact/contact-form"

export const metadata: Metadata = {
  title: "Contact Debra",
  description:
    "Reach out to Debra Allen, REALTOR®. Ask a question, share where you are in the process, or just say hello — no pressure.",
}

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Connect"
        title="Reach out — wherever you are in the process"
        description="Whether you're years away or ready to start, Debra is glad to help you understand your next step. No pressure, no judgment."
      />

      <Section>
        <Container className="max-w-xl">
          <ContactForm context="general" />
        </Container>
      </Section>
    </>
  )
}
