import type { Metadata } from "next"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"
import { ProviderUnavailable } from "@/components/states/provider-unavailable"
import { schedulingStatus } from "@/lib/providers"

export const metadata: Metadata = {
  title: "Book a Consultation",
  description:
    "Schedule a free, no-pressure consultation with Debra Allen, REALTOR\u00AE, to talk through your homeownership goals.",
}

export default function BookPage() {
  const scheduling = schedulingStatus()

  return (
    <>
      <PageHeader
        eyebrow="Connect"
        title="Book a free consultation"
        intro="A consultation is a relaxed conversation about your goals and your options — not a sales pitch. You'll leave with a clearer sense of your next step."
        crumbs={[{ label: "Home", href: "/" }, { label: "Book a Consultation" }]}
      />
      <Section>
        {scheduling.connected ? (
          <p className="text-muted-foreground">Loading available times…</p>
        ) : (
          <ProviderUnavailable
            title="Online booking is being set up"
            description="Real-time scheduling connects to Debra's calendar once a provider is configured, so you'll never book a time that isn't actually open. Until then, send a message and Debra will arrange a time that works for you."
            fallback={[
              { label: "Contact Debra", href: "/contact" },
              { label: "Find your next step", href: "/start" },
            ]}
          />
        )}
      </Section>
    </>
  )
}
