import type { Metadata } from "next"
import Link from "next/link"
import { CalendarCheck, GraduationCap, PiggyBank, Users } from "lucide-react"
import { PageHeader } from "@/components/page/page-header"
import { Band, BandLead, CtaBand, Features, StatusStrip } from "@/components/page/editorial"
import { CLOSING_BAND_IMAGE } from "@/lib/content/imagery"
import { CONFIRMED_SESSIONS, hasConfirmedSessions, type EventSession } from "@/lib/content/events"
import { JsonLd } from "@/components/seo/json-ld"
import { SITE } from "@/lib/site"

export const metadata: Metadata = {
  title: "Events & Workshops",
  description:
    "Homebuyer education workshops and community events led by Debra Allen. Schedule is published here once dates are confirmed.",
  alternates: { canonical: "/events" },
  // An events page with no confirmed events is thin. It is indexed again as
  // soon as a session is added to lib/content/events.ts.
  ...(hasConfirmedSessions() ? {} : { robots: { index: false, follow: true } }),
}

const when = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/Chicago",
  timeZoneName: "short",
})

function eventJsonLd(session: EventSession): Record<string, unknown> {
  const online = session.location === "Online"
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: session.title,
    description: session.description,
    startDate: session.startDate,
    ...(session.endDate ? { endDate: session.endDate } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: online
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    location:
      session.location === "Online"
        ? { "@type": "VirtualLocation", url: session.registrationUrl ?? `${SITE.url}/events` }
        : {
            "@type": "Place",
            name: session.location.name,
            ...(session.location.address ? { address: session.location.address } : {}),
          },
    organizer: { "@id": `${SITE.url}/#organization` },
    url: session.registrationUrl ?? `${SITE.url}/events`,
  }
}

const FORMATS = [
  {
    title: "First-time buyer workshops",
    body: "Small-group sessions that walk through the roadmap from renting to keys, with time for your questions.",
    icon: GraduationCap,
    tone: "teal" as const,
  },
  {
    title: "Credit & budget clinics",
    body: "Practical, judgment-free help understanding credit and building a realistic saving plan.",
    icon: PiggyBank,
    tone: "gold" as const,
  },
  {
    title: "Community gatherings",
    body: "Relaxed events — sometimes with a little line dancing — to connect neighbours preparing for ownership.",
    icon: Users,
    tone: "green" as const,
  },
] as const

export default function EventsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Events & workshops"
        eyebrowIcon={CalendarCheck}
        title="Learn together, in person and online"
        description="Workshops and community events designed to make the path to homeownership feel clear and shared. Dates appear here once they are confirmed."
        crumbs={[{ label: "Home", href: "/" }, { label: "Events" }]}
        facts={[{ label: "Real sessions only", icon: CalendarCheck }]}
        motif="roofline"
      >
        <Link href="/contact" className="dh-btn dh-btn-gold">
          Tell me about the next one
        </Link>
      </PageHeader>

      <Band tone="white" aria-labelledby="events-formats-heading">
        <BandLead
          eyebrow="The three formats"
          eyebrowIcon={GraduationCap}
          title="What each session is built around"
          titleId="events-formats-heading"
          lede="Different rooms for different questions. All of them are built around explaining, not selling."
        />
        <Features items={FORMATS} rule="teal" />
      </Band>

      {hasConfirmedSessions() ? (
        <Band tone="alt" aria-labelledby="events-upcoming-heading">
          <BandLead
            eyebrow="Confirmed dates"
            eyebrowIcon={CalendarCheck}
            title="Upcoming sessions"
            titleId="events-upcoming-heading"
          />
          <ul className="dh-checklist">
            {CONFIRMED_SESSIONS.map((session) => (
              <li key={`${session.startDate}-${session.title}`}>
                <CalendarCheck aria-hidden="true" />
                <span>
                  <strong>{session.title}</strong>
                  {when.format(new Date(session.startDate))} ·{" "}
                  {session.location === "Online" ? "Online" : session.location.name}. {session.description}{" "}
                  {session.registrationUrl && <a href={session.registrationUrl}>Register for {session.title}</a>}
                </span>
                <JsonLd value={eventJsonLd(session)} />
              </li>
            ))}
          </ul>
        </Band>
      ) : (
        <Band tone="alt" tight aria-label="Schedule status">
          <StatusStrip icon={CalendarCheck} title="Upcoming dates are not published yet">
            <p>
              The workshop calendar appears here once dates are scheduled and confirmed. No placeholder events are listed
              — you will only ever see sessions you can actually attend.
            </p>
          </StatusStrip>
        </Band>
      )}

      <CtaBand
        eyebrow="Want to know when the next one is?"
        title="Ask to be told when a date is confirmed"
        titleId="events-cta-heading"
        body="Send a short note and Debra will let you know when the next workshop is announced. In the meantime, the first-time buyer guide covers the same ground at your own pace."
        image={CLOSING_BAND_IMAGE}
      >
        <Link href="/contact" className="dh-btn dh-btn-gold">
          Get in touch
        </Link>
        <Link href="/first-time-buyers" className="dh-btn dh-btn-light-outline">
          Start learning now
        </Link>
      </CtaBand>
    </>
  )
}
