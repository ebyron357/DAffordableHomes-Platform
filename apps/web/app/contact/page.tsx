import type { Metadata } from "next"
import Link from "next/link"
import { CalendarCheck, Compass, HeartHandshake, MapPin, MessageCircle, ShieldCheck } from "lucide-react"
import { PageHeader } from "@/components/page/page-header"
import { DEBRA_PORTRAIT } from "@/lib/content/imagery"
import { Band, StatusStrip } from "@/components/page/editorial"
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
        eyebrowIcon={MessageCircle}
        title="Reach out — wherever you are in the process"
        description="Whether you're years away or ready to start, Debra is glad to help you understand your next step. No pressure, no judgment."
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        facts={[
          { label: "Garland + Dallas–Fort Worth", icon: MapPin },
          { label: "No pressure, no judgment", icon: HeartHandshake },
        ]}
        media={{
          ...DEBRA_PORTRAIT,
          priority: true,
          caption: { label: "REALTOR® · Garland", title: "Debra Allen" },
        }}
      />

      <section className="dh-band dh-band-white" aria-labelledby="contact-form-heading">
        <Container>
          <div className="dh-consult">
            <div className="dh-consult-form">
              <h2 id="contact-form-heading">Send Debra a message</h2>
              <p>
                A sentence is plenty. Say where you are in the process and what you are trying to work out — that is
                enough for a useful reply.
              </p>
              <ContactForm context="general" />
            </div>

            <aside className="dh-consult-aside" aria-labelledby="contact-aside-heading">
              <p className="dh-kicker">
                <Compass aria-hidden="true" />
                Before you write
              </p>
              <h2 id="contact-aside-heading">Two things worth knowing</h2>
              <ul className="dh-checklist">
                <li>
                  <ShieldCheck aria-hidden="true" />
                  <span>
                    <strong>Keep sensitive details out of the form</strong>
                    No Social Security numbers, account numbers or financial account details. Nothing here needs them.
                  </span>
                </li>
                <li>
                  <HeartHandshake aria-hidden="true" />
                  <span>
                    <strong>You do not need to be ready</strong>
                    &ldquo;I am not sure yet&rdquo; is a completely normal place to start a message from.
                  </span>
                </li>
              </ul>
              <StatusStrip icon={CalendarCheck} title="Prefer to talk it through?" onDark>
                <p>
                  A consultation is a longer conversation about your situation, with a clear next step at the end of it.
                </p>
              </StatusStrip>
              <Link href="/consultation" className="dh-btn dh-btn-gold">
                Book a consultation
              </Link>
            </aside>
          </div>
        </Container>
      </section>

      <Band tone="alt" tight aria-label="Other ways to start">
        <div className="dh-lead-row">
          <div className="dh-lead dh-lead-flush">
            <p className="dh-kicker">
              <Compass aria-hidden="true" />
              Not sure what to ask?
            </p>
            <h2>Let the assessment find the question for you</h2>
            <p>Six short questions about where you are, then one clear next step you can act on.</p>
          </div>
          <Link href="/start" className="dh-btn dh-btn-navy">
            Find your next step
          </Link>
        </div>
      </Band>
    </>
  )
}
