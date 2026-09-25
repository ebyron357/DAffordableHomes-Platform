import type { Metadata } from "next"
import Link from "next/link"
import {
  BookOpen,
  Calculator,
  ClipboardCheck,
  Compass,
  GraduationCap,
  Handshake,
  HeartHandshake,
  KeyRound,
  PiggyBank,
  ShieldCheck,
  Users,
} from "lucide-react"
import { PageHeader } from "@/components/page/page-header"
import { Band, BandLead, CtaBand, Features, Split, StatusStrip, Steps } from "@/components/page/editorial"
import { CLOSING_BAND_IMAGE, DEBRA_PORTRAIT } from "@/lib/content/imagery"

export const metadata: Metadata = {
  title: "First-Time Buyer Education",
  description:
    "A plain-language introduction to the homebuying process for first-time buyers and renters. Understand the steps before you take them — no pressure, no jargon.",
  alternates: { canonical: "/first-time-buyers" },
}

/**
 * The shape of the journey, as stages rather than a wall of prose.
 *
 * Same content as before — this page used to be one narrow column of headings
 * and paragraphs on near-white with the right half of every viewport empty.
 * Nothing here promises a timeline or an outcome; each stage describes what a
 * buyer is *learning*, which is the only claim this page is entitled to make.
 */
const STAGES = [
  {
    title: "Getting your bearings",
    description:
      "How ownership differs from renting, what costs exist beyond the purchase price, and roughly how the timeline unfolds. No answers needed yet — this stage is about learning the questions.",
  },
  {
    title: "Preparing your foundation",
    description:
      "Getting organised around savings, understanding how credit is viewed, and gathering the documents buyers typically need. For decisions about your finances, a qualified lender is the right guide.",
  },
  {
    title: "Building the search",
    description:
      "Turning a budget and a set of priorities into a realistic shortlist — the part where knowing your monthly number early saves you from falling for the wrong house.",
  },
  {
    title: "Offer, inspection, close",
    description:
      "The stretch where representation matters most: structuring an offer, handling what the inspection turns up, and keeping the closing timeline intact.",
  },
] as const

const TEAM = [
  {
    title: "Your REALTOR®",
    body: "Understands the market and represents your interests through the search, the offer and the close.",
    icon: Handshake,
    tone: "teal" as const,
  },
  {
    title: "Your lender",
    body: "Handles financing and qualification. Approval, rates and terms are theirs to decide, never this site's.",
    icon: PiggyBank,
    tone: "navy" as const,
  },
  {
    title: "Your inspector",
    body: "Tells you what the house is actually like behind the paint, before the decision becomes permanent.",
    icon: ClipboardCheck,
    tone: "gold" as const,
  },
  {
    title: "Attorneys and tax professionals",
    body: "For the legal and tax questions a home purchase raises. Part of Debra's job is telling you when it is their question.",
    icon: Users,
    tone: "green" as const,
  },
] as const

const NEXT = [
  {
    title: "Learn about NACA",
    body: "What the program does, what it controls, and how a NACA purchase changes the real-estate side of a search.",
    href: "/programs/naca",
    icon: ClipboardCheck,
    tone: "teal" as const,
    action: "Open the program guide",
  },
  {
    title: "Run your numbers",
    body: "Monthly payment, affordability range and cash to close — the three figures worth having before you shop.",
    href: "/calculators",
    icon: Calculator,
    tone: "gold" as const,
    action: "Use the calculators",
  },
  {
    title: "Browse the resources",
    body: "Guides, planning tools and local context, organised by the question you are actually asking.",
    href: "/resources",
    icon: BookOpen,
    tone: "navy" as const,
    action: "Open resources",
  },
] as const

export default function FirstTimeBuyersPage() {
  return (
    <>
      <PageHeader
        eyebrow="For first-time buyers"
        eyebrowIcon={KeyRound}
        title="Understand the process before you step into it"
        intro="Buying a home for the first time can feel like a lot. Let's slow it down. This is a plain-language overview of how the journey usually works, so you can move with a plan instead of guessing."
        crumbs={[{ label: "Home", href: "/" }, { label: "Learn" }, { label: "First-Time Buyers" }]}
        facts={[
          { label: "Education first", icon: GraduationCap },
          { label: "No pressure, no jargon", icon: HeartHandshake },
        ]}
        motif="roofline"
      >
        <Link href="/start" className="dh-btn dh-btn-gold">
          Find your next step
        </Link>
        <Link href="/consultation" className="dh-btn dh-btn-light-outline">
          Talk with Debra
        </Link>
      </PageHeader>

      <Band tone="white" aria-labelledby="ftb-stages-heading">
        <BandLead
          eyebrow="Education comes first"
          eyebrowIcon={GraduationCap}
          title="A prepared buyer is a stronger buyer"
          titleId="ftb-stages-heading"
          lede="Before anyone talks about specific homes, it helps to see the shape of the whole process. When you know what is coming, each step feels smaller."
        />
        <Steps items={STAGES} />
      </Band>

      <Band tone="alt" aria-labelledby="ftb-team-heading">
        <Split
          media={{
            ...DEBRA_PORTRAIT,
            caption: { label: "REALTOR® · Garland", title: "Debra Allen" },
          }}
          weight="copy"
          ratio="4 / 3"
          plate="teal"
          sizes="(max-width: 1000px) 100vw, 520px"
        >
          <p className="dh-kicker">
            <Users aria-hidden="true" />
            Who does what
          </p>
          <h2 id="ftb-team-heading">Homeownership is a team effort</h2>
          <p>
            Several licensed people touch a home purchase, and each one owns a different decision. Knowing which
            question belongs to whom is most of what makes a first purchase feel manageable.
          </p>
          <p>
            Part of Debra&apos;s job is telling you who to ask, and when — including the times the honest answer is
            &ldquo;that one is not mine.&rdquo;
          </p>
          <StatusStrip icon={ShieldCheck} title="This is general education, not advice">
            <p>
              Nothing on this page is loan approval, or legal, tax, lending or individualised financial advice. When a
              question belongs to a licensed professional, Debra will help you find the right one.
            </p>
          </StatusStrip>
        </Split>
      </Band>

      <Band tone="white" aria-label="The professionals involved">
        <Features items={TEAM} rule="green" />
      </Band>

      <Band tone="page" aria-labelledby="ftb-next-heading">
        <BandLead
          eyebrow="Where to go next"
          eyebrowIcon={Compass}
          title="Three useful places to start"
          titleId="ftb-next-heading"
        />
        <Features items={NEXT} rule="gold" />
      </Band>

      <CtaBand
        eyebrow="First home, first questions"
        title="Ask the thing you think is a silly question"
        titleId="ftb-cta-heading"
        body="It almost certainly is not, and it is almost certainly the one that matters. Debra would rather answer it now than have it surface a week before closing."
        image={CLOSING_BAND_IMAGE}
      >
        <Link href="/consultation" className="dh-btn dh-btn-gold">
          Talk with Debra
        </Link>
        <Link href="/start" className="dh-btn dh-btn-light-outline">
          Find your next step
        </Link>
      </CtaBand>
    </>
  )
}
