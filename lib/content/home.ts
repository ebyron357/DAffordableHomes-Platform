/**
 * Homepage editorial content. Voice follows docs/02-brand/BRAND_VOICE.md.
 * No fabricated statistics, credentials, outcomes, or program details.
 */

export type Pathway = {
  key: string
  title: string
  promise: string
  description: string
  href: string
  cta: string
}

export const PATHWAYS: Pathway[] = [
  {
    key: "learn",
    title: "Learn",
    promise: "Understand the process",
    description:
      "Plain-language education for first-time buyers and renters — the homebuying process, first-time buyer preparation, NACA information, and answers to common questions.",
    href: "/first-time-buyers",
    cta: "Start learning",
  },
  {
    key: "plan",
    title: "Plan",
    promise: "Build a plan you can follow",
    description:
      "Practical resources and planning tools to help you see where you are today and identify a realistic next step — no pressure, no promises.",
    href: "/resources",
    cta: "Explore resources",
  },
  {
    key: "explore",
    title: "Explore",
    promise: "Get to know the area",
    description:
      "Neighborhood guides, local context, and a compliant home search that connects to an approved provider when it is available.",
    href: "/homes",
    cta: "Explore neighborhoods",
  },
  {
    key: "connect",
    title: "Connect",
    promise: "Move forward with a guide",
    description:
      "When personalized real-estate guidance is the right next step, connect with Debra through a consultation, a workshop, or a simple conversation.",
    href: "/contact",
    cta: "Connect with Debra",
  },
]

export type RoadmapStep = {
  number: number
  title: string
  summary: string
}

/** Educational sequence only — not guaranteed timelines. */
export const ROADMAP_STEPS: RoadmapStep[] = [
  { number: 1, title: "Explore", summary: "Learn how homeownership works and what the journey involves." },
  { number: 2, title: "Prepare", summary: "Understand credit, savings, and documents so you feel ready." },
  { number: 3, title: "Plan financing", summary: "Learn how buyers work with lenders and programs — from an approved source." },
  { number: 4, title: "Search", summary: "Explore neighborhoods and homes with clear, compliant information." },
  { number: 5, title: "Offer & contract", summary: "Understand what happens when you make an offer and reach agreement." },
  { number: 6, title: "Due diligence", summary: "Learn about inspections, appraisals, and the review period." },
  { number: 7, title: "Close", summary: "Know what to expect on the day you receive your keys." },
  { number: 8, title: "Early ownership", summary: "Settle in with confidence and keep building stability." },
]

export type FaqItem = {
  question: string
  answer: string
}

export const FAQ_PREVIEW: FaqItem[] = [
  {
    question: "I'm not sure I'm ready to buy. Is this still for me?",
    answer:
      "Yes. Many people start here long before they are ready to buy. The first step is not always house hunting — sometimes it is simply understanding the process and making a plan. You are welcome to learn at your own pace.",
  },
  {
    question: "Do I have to share my contact information to use the site?",
    answer:
      "No. You can read, learn, and use the educational resources without submitting any contact information. If and when you want to talk with Debra, you can choose to reach out.",
  },
  {
    question: "Can this site tell me if I qualify for a loan?",
    answer:
      "No. D'Affordable Homes provides education and general information. It does not approve loans or provide legal, tax, lending, or individualized financial advice. When those questions come up, we point you to the right licensed professional.",
  },
  {
    question: "What happens after I book a consultation?",
    answer:
      "A consultation is a conversation about where you are and what a practical next step could look like. Details about what it covers are confirmed before you book, so you always know what to expect.",
  },
]

export type TrustPoint = {
  title: string
  description: string
}

export const TRUST_POINTS: TrustPoint[] = [
  {
    title: "Education before pressure",
    description:
      "You will understand the process before anyone talks about listings or timelines. A prepared buyer is a stronger buyer.",
  },
  {
    title: "Honest guidance",
    description:
      "No guaranteed approvals, no fake urgency, and no shame about credit, savings, or renting. Just clear, realistic information.",
  },
  {
    title: "The right professional",
    description:
      "When a question belongs to a lender, attorney, inspector, or tax professional, we say so — and help you get to the right person.",
  },
]
