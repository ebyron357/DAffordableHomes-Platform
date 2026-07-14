import type { Metadata } from "next"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"
import { Container } from "@/components/ui/container"
import { ContactForm } from "@/components/contact/contact-form"

export const metadata: Metadata = {
  title: "Book a Consultation",
  description:
    "Request a no-pressure consultation with Debra Allen, REALTOR®. Bring your questions — you'll leave with a clearer next step.",
}

const expect = [
  "A friendly conversation about where you are and where you'd like to be",
  "A plain-language look at your next few steps — no jargon",
  "Honest answers, with no obligation to move faster than you're ready",
]

export default function BookPage() {
  return (
    <>
      <PageHeader
        eyebrow="Connect"
        title="Book a no-pressure consultation"
        description="This is a conversation, not a commitment. Come with questions and leave with a clearer understanding of your path."
      />

      <Section>
        <Container className="max-w-xl">
          <div className="mb-8 rounded-xl border border-border bg-secondary/60 p-6">
            <h2 className="font-serif text-lg font-semibold text-foreground">What to expect</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {expect.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <ContactForm context="consultation" />
        </Container>
      </Section>
    </>
  )
}
