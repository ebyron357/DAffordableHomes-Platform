import type { Metadata } from "next"
import Link from "next/link"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"
import { Notice } from "@/components/states/notice"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Events & Workshops",
  description:
    "Homebuyer education workshops and community events led by Debra Allen. Schedule is published here once dates are confirmed.",
}

const formats = [
  {
    title: "First-time buyer workshops",
    body: "Small-group sessions that walk through the roadmap from renting to keys, with time for your questions.",
  },
  {
    title: "Credit & budget clinics",
    body: "Practical, judgment-free help understanding credit and building a realistic saving plan.",
  },
  {
    title: "Community gatherings",
    body: "Relaxed events — sometimes with a little line dancing — to connect neighbors preparing for ownership.",
  },
]

export default function EventsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Events"
        title="Learn together, in person and online"
        description="Debra hosts workshops and community events designed to make the path to homeownership feel clear and shared."
      />

      <Section>
        <Container className="max-w-3xl">
          <div className="grid gap-6 sm:grid-cols-3">
            {formats.map((f) => (
              <div key={f.title} className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-serif text-base font-semibold text-foreground">{f.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Notice tone="info" title="Upcoming dates coming soon">
              <p>
                The workshop calendar will appear here once dates are scheduled and confirmed. We don&apos;t list
                placeholder events — you&apos;ll only ever see real sessions you can actually attend.
              </p>
            </Notice>
          </div>

          <div className="mt-10 rounded-xl border border-border bg-secondary/60 p-6">
            <h2 className="font-serif text-lg font-semibold text-foreground">Want to be notified?</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Reach out and Debra will let you know when the next workshop is announced.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/contact">Get in touch</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/first-time-buyers">Start learning now</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
