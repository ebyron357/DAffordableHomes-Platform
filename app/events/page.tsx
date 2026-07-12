import type { Metadata } from "next"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"
import { ProviderUnavailable } from "@/components/states/provider-unavailable"
import { contentStatus } from "@/lib/providers"

export const metadata: Metadata = {
  title: "Events & Workshops",
  description:
    "Free homebuyer workshops and community events led by Debra Allen. Learn the steps alongside others walking the same path.",
}

export default function EventsPage() {
  const content = contentStatus()

  return (
    <>
      <PageHeader
        eyebrow="Connect"
        title="Learn alongside your community"
        intro="Debra hosts workshops and community events to make the path to ownership less lonely. Come with questions and leave with a clearer plan."
        crumbs={[{ label: "Home", href: "/" }, { label: "Events & Workshops" }]}
      />
      <Section>
        {content.connected ? (
          <p className="text-muted-foreground">Loading upcoming events…</p>
        ) : (
          <ProviderUnavailable
            title="The events calendar is being scheduled"
            description="We'll list real workshops here with confirmed dates and locations — never placeholder events. Want to know when the next one is announced? Reach out and Debra will keep you posted."
            fallback={[
              { label: "Contact Debra", href: "/contact" },
              { label: "Start learning now", href: "/first-time-buyers" },
            ]}
          />
        )}
      </Section>
    </>
  )
}
