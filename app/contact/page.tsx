import type { Metadata } from "next"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"
import { ContactForm } from "@/components/contact/contact-form"

export const metadata: Metadata = {
  title: "Contact Debra",
  description:
    "Have a question or ready to talk? Reach out to Debra Allen, REALTOR\u00AE. No pressure — just a real conversation about your next step.",
}

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Connect"
        title="Let's start with a conversation"
        intro="Whether you're years away or nearly ready, Debra is glad to hear from you. Share a little about where you are, and she'll help you find a sensible next step — no pressure, ever."
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact Debra" }]}
      />
      <Section>
        <ContactForm />
      </Section>
    </>
  )
}
