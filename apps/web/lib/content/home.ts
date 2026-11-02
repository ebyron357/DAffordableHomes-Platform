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


export type TrustPoint = {
  title: string
  description: string
}

export const TRUST_POINTS: TrustPoint[] = [
  {
    title: "Education-First",
    description: "Clear guidance so visitors can make informed decisions.",
  },
  {
    title: "Trust & Integrity",
    description: "Honest answers and realistic expectations.",
  },
  {
    title: "Community Focused",
    description: "Local knowledge and trusted connections.",
  },
  {
    title: "No Pressure",
    description: "Visitors learn at their own pace and remain in control.",
  },
  {
    title: "Path to Ownership",
    description: "A practical step-by-step plan built around individual goals.",
  },
]
