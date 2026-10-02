import type { Metadata } from "next"
import Link from "next/link"
import { CalendarCheck, GraduationCap, PiggyBank, Users } from "lucide-react"
import { PageHeader } from "@/components/page/page-header"
import { Band, BandLead, CtaBand, Features, StatusStrip } from "@/components/page/editorial"
import { CLOSING_BAND_IMAGE } from "@/lib/content/imagery"

export const metadata: Metadata = {
  title: "Events & Workshops",
  description:
    "Homebuyer education workshops and community events led by Debra Allen. Schedule is published here once dates are confirmed.",
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
        description="Debra hosts workshops and community events designed to make the path to homeownership feel clear and shared."
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
          title="What a session usually looks like"
          titleId="events-formats-heading"
          lede="Different rooms for different questions. All of them are built around explaining, not selling."
        />
        <Features items={FORMATS} rule="teal" />
      </Band>

      <Band tone="alt" tight aria-label="Schedule status">
        <StatusStrip icon={CalendarCheck} title="Upcoming dates are not published yet">
          <p>
            The workshop calendar appears here once dates are scheduled and confirmed. No placeholder events are listed
            — you will only ever see sessions you can actually attend.
          </p>
        </StatusStrip>
      </Band>

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
