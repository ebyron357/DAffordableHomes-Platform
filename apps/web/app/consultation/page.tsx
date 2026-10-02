import type { Metadata } from "next"
import Link from "next/link"
import { Calculator, CalendarCheck, ClipboardList, Compass, HeartHandshake, MapPin, MessageCircle, ShieldCheck } from "lucide-react"
import { ContactForm } from "@/components/contact/contact-form"
import { Container } from "@/components/ui/container"
import { PageHeader } from "@/components/page/page-header"
import { DEBRA_DESK_MASTHEAD } from "@/lib/content/imagery"
import { Band, BandLead, Features, StatusStrip } from "@/components/page/editorial"

export const metadata: Metadata = {
  title: "Book a Free Consultation",
  description: "Request a free homebuyer consultation with Debra Allen.",
  alternates: { canonical: "/consultation" },
}

const EXPECTATIONS = [
  {
    title: "A focused planning conversation",
    body: "About your situation, not a script. Bring the question you have actually been sitting on.",
    icon: MessageCircle,
  },
  {
    title: "A review of your current position",
    body: "Where you are today with savings, timing and preparation — without judgement about any of it.",
    icon: Compass,
  },
  {
    title: "Clear next steps without pressure",
    body: "One or two things worth doing next, and an honest note about which ones can wait.",
    icon: ClipboardList,
  },
  {
    title: "Resources matched to your situation",
    body: "The guide, the calculator or the professional that fits what you described — not a generic packet.",
    icon: HeartHandshake,
  },
] as const

const NOT_READY = [
  {
    title: "Estimate a monthly payment",
    body: "Principal, interest, taxes, insurance and HOA dues, with your own numbers in it.",
    href: "/calculators/mortgage-payment",
    icon: Calculator,
    tone: "teal" as const,
    action: "Open the calculator",
  },
  {
    title: "Find your next step",
    body: "A short set of questions about where you are, then one clear thing to do next.",
    href: "/start",
    icon: ClipboardList,
    tone: "navy" as const,
    action: "Start the assessment",
  },
  {
    title: "Read a guide first",
    body: "Plain-language answers on programs, preparation and buying locally in North Texas.",
    href: "/blog",
    icon: Compass,
    tone: "gold" as const,
    action: "Browse the guides",
  },
] as const

export default function ConsultationPage() {
  return (
    <>
      <PageHeader
        eyebrow="A clear next step"
        eyebrowIcon={CalendarCheck}
        title="Start with a conversation, not a sales pitch"
        intro="Tell Debra enough to understand your starting point. You will leave with a clearer understanding of what to do next, even if buying is not your immediate next move."
        crumbs={[{ label: "Home", href: "/" }, { label: "Consultation" }]}
        facts={[
          { label: "No cost, no commitment", icon: HeartHandshake },
          { label: "Garland + Dallas–Fort Worth", icon: MapPin },
        ]}
        media={{
          ...DEBRA_DESK_MASTHEAD,
          priority: true,
          caption: { label: "Your REALTOR®", title: "Debra Allen" },
        }}
      />

      <section className="dh-band dh-band-white" aria-labelledby="consultation-form-heading">
        <Container>
          <div className="dh-consult">
            <div className="dh-consult-form">
              <h2 id="consultation-form-heading">Request a consultation</h2>
              <p>
                A short form so Debra can understand what you would like to discuss. Please do not include Social
                Security numbers, account numbers, or other sensitive financial information.
              </p>
              <ContactForm context="consultation" />
            </div>

            <aside className="dh-consult-aside" aria-labelledby="consultation-expect-heading">
              <p className="dh-kicker">
                <CalendarCheck aria-hidden="true" />
                What to expect
              </p>
              <h2 id="consultation-expect-heading">Four things, every time</h2>
              <ul className="dh-checklist">
                {EXPECTATIONS.map((item) => (
                  <li key={item.title}>
                    <item.icon aria-hidden="true" />
                    <span>
                      <strong>{item.title}</strong>
                      {item.body}
                    </span>
                  </li>
                ))}
              </ul>
              <StatusStrip icon={ShieldCheck} title="You do not need to be ready" onDark>
                <p>
                  Perfect credit, a lender, and every answer are not prerequisites for a conversation. Most people book
                  one precisely because they do not have those yet.
                </p>
              </StatusStrip>
            </aside>
          </div>
        </Container>
      </section>

      <Band tone="alt" aria-labelledby="consultation-not-ready-heading">
        <BandLead
          eyebrow="Not ready to schedule?"
          eyebrowIcon={Compass}
          title="Come back when you have a question worth asking"
          titleId="consultation-not-ready-heading"
          lede="There is no wrong order here. Plenty of people work through one of these first and book afterwards."
        />
        <Features items={NOT_READY} rule="gold" />
      </Band>

      <Band tone="navy" tight aria-label="Other ways to reach Debra">
        <div className="dh-lead-row">
          <div className="dh-lead dh-lead-flush">
            <p className="dh-kicker">
              <MessageCircle aria-hidden="true" />
              Prefer to write first?
            </p>
            <h2>Send a message instead</h2>
            <p>A short note works just as well. Same person reads it, same absence of a sales pitch.</p>
          </div>
          <Link href="/contact" className="dh-btn dh-btn-light">
            Contact Debra
          </Link>
        </div>
      </Band>
    </>
  )
}
