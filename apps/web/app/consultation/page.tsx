import type { Metadata } from "next"
import Link from "next/link"
import { Calculator, CalendarCheck, ClipboardList, Compass, HeartHandshake, MapPin, MessageCircle, ShieldCheck } from "lucide-react"
import { BookingCalendar } from "@/components/contact/booking-calendar"
import { ContactForm } from "@/components/contact/contact-form"
import { WorriesList } from "@/components/conversion/worries"
import { Container } from "@/components/ui/container"
import { PageHeader } from "@/components/page/page-header"
import {
  CONSULTATION_CALENDAR_NOTE,
  CONSULTATION_HELPFUL,
  CONSULTATION_IS_NOT,
  CONSULTATION_STEPS,
  CONSULTATION_TERMS,
  WORRIES_HEADING,
} from "@/lib/content/conversion"
import { DEBRA_DESK_MASTHEAD } from "@/lib/content/imagery"
import { bookingEmbed } from "@/lib/ghl-booking.mjs"
import { Band, BandLead, Features, StatusStrip, Steps } from "@/components/page/editorial"

export const metadata: Metadata = {
  title: "Book a Free Consultation",
  description:
    "Request a free, no-pressure homebuyer consultation with Debra Allen, REALTOR®, about where you are now and a practical next step.",
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
  // Read at build time, like the Content Security Policy that must allow it.
  const booking = bookingEmbed()

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

      {/*
        How a consultation is arranged, before anyone is asked for anything.
        Visitors who cannot picture what happens after "Request consultation"
        tend not to press it.
      */}
      <Band tone="page" aria-labelledby="consultation-how-heading">
        <BandLead
          eyebrow="How it works"
          eyebrowIcon={ClipboardList}
          title="How a consultation works"
          titleId="consultation-how-heading"
          lede={`Three steps — ${CONSULTATION_TERMS[0].toLowerCase()} and ${CONSULTATION_TERMS[1].toLowerCase()} at any point.`}
        />
        <Steps items={CONSULTATION_STEPS} />
        {booking && <p className="dh-band-note">{CONSULTATION_CALENDAR_NOTE}</p>}
        <div className="dh-scope dh-scope-spaced">
          <section className="dh-scope-col" aria-labelledby="consultation-helpful-heading">
            <h3 id="consultation-helpful-heading">Helpful to have, but not required</h3>
            <ul>
              {CONSULTATION_HELPFUL.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="dh-scope-col dh-scope-col-out" aria-labelledby="consultation-not-heading">
            <h3 id="consultation-not-heading">What a consultation is not</h3>
            <p>{CONSULTATION_IS_NOT}</p>
          </section>
        </div>
      </Band>

      {booking && <BookingCalendar booking={booking} />}

      <section
        className={booking ? "dh-band dh-band-alt" : "dh-band dh-band-white"}
        aria-labelledby="consultation-form-heading"
      >
        <Container>
          <div className="dh-consult">
            <div className="dh-consult-form">
              <h2 id="consultation-form-heading">
                {booking ? "Rather send a note first?" : "Request a consultation"}
              </h2>
              <p>
                A short form so Debra can understand what you would like to discuss. Please do not include Social
                Security numbers, account numbers, or other sensitive financial information.
              </p>
              <ContactForm context="consultation" calendarAvailable={Boolean(booking)} />
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

      <Band tone="alt" aria-labelledby="consultation-worries-heading">
        <BandLead eyebrow="Common worries" title={WORRIES_HEADING} titleId="consultation-worries-heading" />
        <WorriesList />
      </Band>

      <Band tone="page" aria-labelledby="consultation-not-ready-heading">
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
