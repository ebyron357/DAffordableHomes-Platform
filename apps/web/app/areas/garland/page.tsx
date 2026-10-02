import type { Metadata } from "next"
import Link from "next/link"
import {
  ClipboardCheck,
  Compass,
  HeartHandshake,
  Home,
  MapPin,
  MessageCircleQuestion,
  Route,
  Wallet,
  Wrench,
} from "lucide-react"
import { BrandMotif } from "@/components/page/brand-motif"
import { PageHeader } from "@/components/page/page-header"
import { Band, BandLead, CtaBand, Features, QaList } from "@/components/page/editorial"
import { CLOSING_BAND_IMAGE } from "@/lib/content/imagery"
import { SITE } from "@/lib/site"

export const metadata: Metadata = {
  title: "Garland Texas Homebuyer Guide and Affordable-Homeownership Help",
  description:
    "A practical Garland, Texas homebuyer guide covering search preparation, attainable North Texas home styles, NACA and Homes for Heroes guidance, property evaluation, and next steps with Debra.",
  alternates: { canonical: "/areas/garland" },
  openGraph: {
    title: "Garland Homebuyer Guide | D'Affordable Homes",
    description:
      "Clear home-search and affordable-homeownership guidance for people exploring Garland, Texas.",
    url: "/areas/garland",
    type: "article",
  },
}

const SEARCH_PREP = [
  {
    title: "Monthly ownership cost",
    body: "Plan beyond the purchase price: principal, interest, taxes, insurance, utilities, maintenance, and possible association costs.",
    icon: Wallet,
    tone: "gold" as const,
  },
  {
    title: "Home condition",
    body: "Decide how much repair work, updating, inspection risk, and ongoing maintenance you can realistically accept.",
    icon: Wrench,
    tone: "teal" as const,
  },
  {
    title: "Location priorities",
    body: "Rank access to work, family, services, transportation and daily routines — without relying on unsupported commute claims.",
    icon: Compass,
    tone: "navy" as const,
  },
  {
    title: "Program requirements",
    body: "Keep official NACA, lender, assistance-program, or third-party requirements visible while you evaluate each property.",
    icon: ClipboardCheck,
    tone: "green" as const,
  },
] as const

/**
 * The housing a Garland search tends to put in front of you.
 *
 * Home styles, not inventory. No count, no price, no availability claim — the
 * roofline ornament beside this list draws the same four shapes it names, which
 * is why the section can be visual without a photograph the register does not
 * contain.
 */
const HOUSING_CHARACTER = [
  "One-story brick and ranch-style homes",
  "Two-story suburban brick homes",
  "Brick-and-stone facades",
  "Modest starter homes and townhomes",
  "Garages and driveways common to North Texas",
  "Flat or gently graded streets with Texas landscaping",
] as const

const PROGRAM_PATHS = [
  {
    title: "Using NACA?",
    body: "Understand how Debra supports the search, offer, inspection and closing process while NACA controls the official program requirements.",
    href: "/programs/naca",
    icon: ClipboardCheck,
    tone: "teal" as const,
    action: "Explore NACA homebuyer help",
  },
  {
    title: "A community hero?",
    body: "Build a buying, selling or coordinated move plan without unsupported promises about eligibility, savings, rebates or provider status.",
    href: "/programs/homes-for-heroes",
    icon: HeartHandshake,
    tone: "green" as const,
    action: "Explore Homes for Heroes guidance",
  },
] as const

const faqs = [
  {
    question: "Does Debra help first-time homebuyers in Garland?",
    answer:
      "Debra can discuss your Garland homebuying goals, current preparation, and program needs, then confirm whether representation is available for your specific transaction. The site does not publish an unverified blanket service-area promise.",
  },
  {
    question: "What should I prepare before searching for a home in Garland?",
    answer:
      "Prepare a realistic monthly-cost range, financing or program status, desired home features, preferred areas, timing, and questions about inspections, repairs, taxes, insurance, and ongoing ownership costs.",
  },
  {
    question: "Can a NACA buyer explore homes in Garland?",
    answer:
      "A buyer can discuss Garland as a search goal, but current NACA rules, qualification, property eligibility, and transaction requirements must be confirmed through NACA and the appropriate professionals.",
  },
  {
    question: "What kinds of homes should I expect to compare?",
    answer:
      "A North Texas search may include modest one-story brick homes, ranch-style homes, two-story suburban homes, brick-and-stone facades, townhomes, and newer construction. Actual availability changes and should come from an approved live property source.",
  },
]

export default function GarlandAreaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Garland Texas Homebuyer Guide",
        description: metadata.description,
        url: `${SITE.url}/areas/garland`,
        about: { "@type": "City", name: "Garland, Texas" },
        isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
          { "@type": "ListItem", position: 2, name: "Area guides", item: `${SITE.url}/areas` },
          { "@type": "ListItem", position: 3, name: "Garland", item: `${SITE.url}/areas/garland` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <PageHeader
        eyebrow="Garland, Texas"
        eyebrowIcon={MapPin}
        title="Build a Garland home search around the life you can sustain"
        intro="A useful search starts with monthly cost, home condition, location priorities, program status, and the trade-offs you are willing to make — not a promise that every property or program will fit."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Area guides", href: "/areas" },
          { label: "Garland" },
        ]}
        facts={[
          { label: "Dallas County", icon: MapPin },
          { label: "Debra's home market", icon: Home },
          { label: "Dallas–Fort Worth metroplex", icon: Route },
        ]}
        motif="roofline"
      >
        <Link href="/consultation" className="dh-btn dh-btn-gold">
          Plan a Garland consultation
        </Link>
        <Link href="/programs" className="dh-btn dh-btn-light-outline">
          Explore homebuyer programs
        </Link>
      </PageHeader>

      <Band tone="white" aria-labelledby="search-heading">
        <BandLead
          eyebrow="Search preparation"
          eyebrowIcon={Compass}
          title="Define the search before touring homes"
          titleId="search-heading"
          lede="Garland is where Debra's practice is based and the community she can speak about in the most detail. Availability for a specific property or transaction is still confirmed with her directly."
        />
        <Features items={SEARCH_PREP} rule="teal" />
      </Band>

      <Band tone="teal" aria-labelledby="homes-heading">
        <div className="dh-illus">
          <div className="dh-lead dh-lead-flush">
            <p className="dh-kicker">
              <Home aria-hidden="true" />
              What you&apos;ll be touring
            </p>
            <h2 id="homes-heading">The housing a Garland search puts in front of you</h2>
            <p>
              Attainable North Texas homes, more often than not. Knowing the shapes before you start means a first
              Saturday of showings is about the specific house, not about learning what this market looks like.
            </p>
            <ul className="dh-chips">
              {HOUSING_CHARACTER.map((item) => (
                <li key={item}>
                  <Home aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="dh-note">
              No listing inventory is shown on this page. Live property availability comes from an approved MLS or IDX
              provider with the required attribution and permissions.
            </p>
          </div>
          <BrandMotif variant="roofline" className="dh-motif dh-illus-art" />
        </div>
      </Band>

      <Band tone="page" aria-labelledby="programs-heading">
        <BandLead
          eyebrow="Programs and the local search"
          eyebrowIcon={ClipboardCheck}
          title="Connect the location to your homebuyer path"
          titleId="programs-heading"
          lede="A program changes how an offer is structured and what has to be confirmed before it. Here is where each one meets a Garland search."
        />
        <Features items={PROGRAM_PATHS} rule="green" />
      </Band>

      <Band tone="alt" aria-labelledby="garland-faq-heading">
        <div className="dh-split dh-split-wide-copy">
          <div className="dh-split-copy">
            <p className="dh-kicker">
              <MessageCircleQuestion aria-hidden="true" />
              Garland questions
            </p>
            <h2 id="garland-faq-heading">Answers without made-up market data</h2>
            <p>
              Where a question needs a lender, an inspector, an attorney or a program office, the answer says so instead
              of guessing on their behalf.
            </p>
          </div>
          <QaList items={faqs} />
        </div>
      </Band>

      <CtaBand
        eyebrow="Garland and the metroplex"
        title="Start the Garland conversation with a real question"
        titleId="garland-cta-heading"
        body="Bring a street, a budget, a program, or the thing that has been stopping you. Debra will tell you what the next step is — and what it isn't."
        image={CLOSING_BAND_IMAGE}
      >
        <Link href="/consultation" className="dh-btn dh-btn-gold">
          Plan a Garland consultation
        </Link>
        <Link href="/areas" className="dh-btn dh-btn-light-outline">
          All area guides
        </Link>
      </CtaBand>
    </>
  )
}
