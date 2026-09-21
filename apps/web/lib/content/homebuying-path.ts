/**
 * "Find Your Homebuying Path" — the homepage's guided quiz.
 *
 * Five short questions identify which of the site's existing pathways fits a
 * visitor, then send them to destinations that already exist in this
 * repository. Nothing here is a qualification check: the questions ask about
 * goals, location and timeline, never about income, credit, or any protected
 * characteristic (PRODUCT_REQUIREMENTS §6.2). Results are educational and are
 * shown immediately — no contact details are collected.
 *
 * Every `href` below must be a real route. `tests/static/homebuying-path.test.mjs`
 * resolves each one against `apps/web/app` and fails if any route is missing.
 */

export type PathChoice = { value: string; label: string }

export type PathQuestion = {
  id: "situation" | "goal" | "location" | "service" | "timeline"
  legend: string
  help?: string
  choices: PathChoice[]
}

export const PATH_QUESTIONS: PathQuestion[] = [
  {
    id: "situation",
    legend: "Where are you starting from?",
    choices: [
      { value: "rent", label: "I rent, or live with family" },
      { value: "own", label: "I own a home right now" },
      { value: "other", label: "Something else" },
    ],
  },
  {
    id: "goal",
    legend: "What are you hoping to do?",
    choices: [
      { value: "first", label: "Buy my first home" },
      { value: "next", label: "Buy my next home" },
      { value: "sellbuy", label: "Sell my current home and buy another" },
      { value: "explore", label: "I'm still exploring my options" },
    ],
  },
  {
    id: "location",
    legend: "Where does Dallas–Fort Worth fit in?",
    choices: [
      { value: "local", label: "I already live in the DFW area" },
      { value: "relocating", label: "I'm moving to DFW from somewhere else" },
      { value: "undecided", label: "I haven't settled on an area yet" },
    ],
  },
  {
    id: "service",
    legend: "Do any of these describe you or someone in your household?",
    help: "Some homebuyer programs are built around these roles. Choosing one only changes which resources we suggest.",
    choices: [
      { value: "military", label: "Active-duty military or veteran" },
      { value: "responder", label: "Firefighter, EMS, or law enforcement" },
      { value: "educator", label: "Teacher or school staff" },
      { value: "healthcare", label: "Healthcare worker" },
      { value: "none", label: "None of these" },
    ],
  },
  {
    id: "timeline",
    legend: "When would you like to make a move?",
    choices: [
      { value: "soon", label: "Within the next 3 months" },
      { value: "year", label: "In 3 to 12 months" },
      { value: "later", label: "More than a year from now" },
      { value: "unsure", label: "I'm not sure yet" },
    ],
  },
]

export type PathKey = "first-time" | "hero" | "relocating" | "sell-buy" | "unsure"

export type PathLink = { label: string; href: string }

export type PathResult = {
  key: PathKey
  name: string
  summary: string
  nextStep: string
  primary: PathLink
  /** An existing guide, tool, or resource that deepens the primary step. */
  secondary: PathLink
  consultation: PathLink
}

export const PATH_RESULTS: Record<PathKey, PathResult> = {
  "first-time": {
    key: "first-time",
    name: "First-Time Buyer",
    summary:
      "You're buying for the first time, so the most useful thing right now is understanding the sequence: what happens before you tour a home, what financing actually involves, and where the real costs sit.",
    nextStep: "Start with the first-time buyer education, then read the step-by-step Garland guide.",
    primary: { label: "Start with buyer education", href: "/first-time-buyers" },
    secondary: { label: "Read: How to buy a home in Garland, Texas", href: "/blog/how-to-buy-home-garland-tx" },
    consultation: { label: "Schedule a Consultation", href: "/consultation" },
  },
  hero: {
    key: "hero",
    name: "North Texas Hero",
    summary:
      "Military members, veterans, first responders, teachers, and healthcare workers have homebuyer programs built around their service. Debra's guide explains what those programs do and do not do, without any promise about eligibility.",
    nextStep: "Read how the Homes for Heroes program works, then decide whether it fits your purchase or sale.",
    primary: { label: "Explore the Homes for Heroes program", href: "/programs/homes-for-heroes" },
    secondary: { label: "Read: How Debra helps North Texas heroes", href: "/blog/homes-for-heroes-north-texas" },
    consultation: { label: "Schedule a Consultation", href: "/consultation" },
  },
  relocating: {
    key: "relocating",
    name: "Moving to Dallas–Fort Worth",
    summary:
      "You're relocating, so the first job is getting a feel for the metroplex: which cities buyers ask about, how neighborhoods differ, and what is actually on the market.",
    nextStep: "Browse the neighborhood guides for local context, then start a home search when you're ready.",
    primary: { label: "Explore DFW neighborhoods", href: "/neighborhoods" },
    secondary: { label: "Search homes across DFW", href: "/homes" },
    consultation: { label: "Schedule a Consultation", href: "/consultation" },
  },
  "sell-buy": {
    key: "sell-buy",
    name: "Selling and Buying",
    summary:
      "You're moving equity from one home into the next. Sequencing matters here: what your current home is likely worth, how the two timelines fit together, and what to line up before listing.",
    nextStep: "Request a home valuation to anchor the plan, then start watching the market you're moving into.",
    primary: { label: "Request a home valuation", href: "/contact" },
    secondary: { label: "Search homes in DFW", href: "/homes" },
    consultation: { label: "Schedule a Consultation", href: "/consultation" },
  },
  unsure: {
    key: "unsure",
    name: "Not Sure Yet",
    summary:
      "That's a completely reasonable place to be. Rather than guessing, take the short readiness check on the Find Your Next Step page; it suggests reading based on where you are, with no contact details required.",
    nextStep: "Take the Find Your Next Step check, then browse the resource library at your own pace.",
    primary: { label: "Find your next step", href: "/start" },
    secondary: { label: "Browse buyer resources", href: "/resources" },
    consultation: { label: "Schedule a Consultation", href: "/consultation" },
  },
}

/** Ordered list of the five paths, used to introduce the quiz. */
export const PATH_ORDER: PathKey[] = ["first-time", "hero", "relocating", "sell-buy", "unsure"]

export type PathAnswers = Partial<Record<PathQuestion["id"], string>>

/**
 * Decide which path fits a set of answers.
 *
 * Priority is deliberate: a service-related program can help a buyer, a
 * seller, or a relocating household, so it wins whenever it applies.
 * Relocation comes next because "where" changes every later step. Selling
 * before buying beats a plain purchase, and a first purchase beats the
 * fallback. Anyone still exploring lands on the readiness check.
 */
export function resolvePath(answers: PathAnswers): PathKey {
  if (answers.service && answers.service !== "none") return "hero"
  if (answers.location === "relocating") return "relocating"
  if (answers.goal === "sellbuy" || (answers.situation === "own" && answers.goal === "next")) return "sell-buy"
  if (answers.goal === "first" || (answers.situation === "rent" && answers.goal === "next")) return "first-time"
  return "unsure"
}

/** One sentence that reflects the visitor's stated timeline back to them. */
export function timelineNote(timeline: string | undefined): string {
  switch (timeline) {
    case "soon":
      return "With a move inside three months, a conversation with Debra early on will save you time later."
    case "year":
      return "Three to twelve months is a comfortable runway to learn the process and get organized before you look."
    case "later":
      return "With more than a year, there is no rush. Education first, and the rest will follow."
    default:
      return "No timeline is fine. Learn at your own pace, and reach out whenever a question comes up."
  }
}
