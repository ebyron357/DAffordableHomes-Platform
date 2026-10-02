import type { Metadata } from "next"
import Link from "next/link"
import { BookOpen, HeartHandshake, MessageCircle, Quote, ShieldCheck } from "lucide-react"
import { PageHeader } from "@/components/page/page-header"
import { Band, BandLead, CtaBand, Features, StatusStrip } from "@/components/page/editorial"
import { CLOSING_BAND_IMAGE } from "@/lib/content/imagery"

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Real stories from people Debra has guided toward homeownership. We publish only verified, consented reviews — never invented ones.",
}

/** Real things a visitor can do instead of reading reviews that do not exist yet. */
const INSTEAD = [
  {
    title: "Read how Debra works",
    body: "The approach, the commitments, and what a conversation with her is actually like — in her own words rather than someone else's.",
    href: "/about",
    icon: HeartHandshake,
    tone: "teal" as const,
    action: "About Debra",
  },
  {
    title: "Read the guides she writes",
    body: "The clearest signal of how someone explains things is watching them explain something. Each guide carries an author and a reviewed date.",
    href: "/blog",
    icon: BookOpen,
    tone: "gold" as const,
    action: "Open the guides",
  },
  {
    title: "Have the conversation yourself",
    body: "A consultation costs nothing and commits you to nothing. It is the most direct way to find out whether this is a fit.",
    href: "/consultation",
    icon: MessageCircle,
    tone: "navy" as const,
    action: "Book a consultation",
  },
] as const

export default function TestimonialsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Client stories"
        eyebrowIcon={Quote}
        title="Stories from the people Debra has guided"
        description="The best measure of this work is how people feel walking through it. Verified stories will be shared here with permission."
        crumbs={[{ label: "Home", href: "/" }, { label: "Testimonials" }]}
        facts={[{ label: "Consented stories only", icon: ShieldCheck }]}
        motif="route"
      />

      <Band tone="white" tight aria-label="Review policy">
        <StatusStrip icon={ShieldCheck} title="Verified reviews only">
          <p>
            We do not publish invented or placeholder testimonials. Real, consented stories — and any connected Google
            reviews — will appear here as they are confirmed for release.
          </p>
        </StatusStrip>
      </Band>

      <Band tone="alt" aria-labelledby="testimonials-instead-heading">
        <BandLead
          eyebrow="In the meantime"
          eyebrowIcon={BookOpen}
          title="Three better ways to judge whether this is a fit"
          titleId="testimonials-instead-heading"
          lede="A page of quotes is easy to write and hard to verify. These are things you can check for yourself."
        />
        <Features items={INSTEAD} rule="gold" />
      </Band>

      <CtaBand
        eyebrow="Your story is the next one"
        title="Start with a conversation about where you are"
        titleId="testimonials-cta-heading"
        body="No pressure and no obligation — just a clear read on what your next step is, and whether now is even the right time for it."
        image={CLOSING_BAND_IMAGE}
      >
        <Link href="/consultation" className="dh-btn dh-btn-gold">
          Start your own story
        </Link>
        <Link href="/about" className="dh-btn dh-btn-light-outline">
          Meet Debra
        </Link>
      </CtaBand>
    </>
  )
}
