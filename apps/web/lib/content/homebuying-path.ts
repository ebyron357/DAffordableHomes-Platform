/**
 * "Find Your Homebuying Path" — the homepage's guided quiz.
 *
 * Five or six short questions, branched on the visitor's goal, identify which
 * of the site's existing pathways fits and turn the answers into a concrete
 * next move. Every destination is a route that already exists in this
 * repository; `tests/static/homebuying-path.test.mjs` resolves each one
 * against `apps/web/app` and fails if any is missing.
 *
 * Boundaries (PRODUCT_REQUIREMENTS §6.2): nothing here asks about income,
 * credit, or any protected characteristic; no result implies loan approval,
 * program eligibility, a valuation, or affordability. The Homes for Heroes
 * groups below are the ones `lib/programs.ts` already publishes; the program,
 * not this quiz, confirms who qualifies. Results are shown immediately and no
 * contact details are collected.
 */

export type PathChoice = { value: string; label: string }

export type PathQuestionId = "goal" | "area" | "timeline" | "buyerPosition" | "sellerPosition" | "service"

export type PathAnswers = Partial<Record<PathQuestionId, string>>

export type PathQuestion = {
  id: PathQuestionId
  legend: string
  help?: string
  choices: PathChoice[]
  /** Branching: when present, the question is asked only if this returns true. */
  showIf?: (answers: PathAnswers) => boolean
}

const BUYING_GOALS = new Set(["first", "next", "relocate", "sellbuy", "explore"])

export const PATH_QUESTIONS: PathQuestion[] = [
  {
    id: "goal",
    legend: "What are you planning to do in the Dallas–Fort Worth market?",
    choices: [
      { value: "first", label: "Buy my first home" },
      { value: "next", label: "Buy my next home" },
      { value: "sell", label: "Sell my current home" },
      { value: "sellbuy", label: "Sell and buy at the same time" },
      { value: "relocate", label: "Relocate to Dallas–Fort Worth" },
      { value: "explore", label: "Explore my options" },
    ],
  },
  {
    id: "area",
    legend: "Which part of DFW are you focused on?",
    help: "These are the North Texas cities Debra works in most. Garland is the home market.",
    choices: [
      { value: "garland", label: "Garland" },
      { value: "dallas", label: "Dallas" },
      { value: "collin", label: "Plano, Frisco or McKinney" },
      { value: "tarrant", label: "Fort Worth, Arlington or Irving" },
      { value: "other", label: "Another DFW community" },
      { value: "unsure", label: "I'm not sure yet" },
    ],
  },
  {
    id: "timeline",
    legend: "When would you ideally like to make your move?",
    choices: [
      { value: "asap", label: "As soon as possible" },
      { value: "3mo", label: "Within 3 months" },
      { value: "6mo", label: "3 to 6 months" },
      { value: "12mo", label: "6 to 12 months" },
      { value: "later", label: "More than a year away" },
      { value: "researching", label: "I'm researching right now" },
    ],
  },
  {
    id: "buyerPosition",
    legend: "Where are you in the homebuying process?",
    showIf: (answers) => BUYING_GOALS.has(answers.goal ?? ""),
    choices: [
      { value: "scratch", label: "I'm starting from scratch" },
      { value: "financing", label: "I need to understand financing" },
      { value: "search", label: "I'm ready to search for homes" },
      { value: "preapproved", label: "I'm already pre-approved" },
      { value: "sellfirst", label: "I need help selling before I buy" },
    ],
  },
  {
    id: "sellerPosition",
    legend: "Where are you in the selling process?",
    showIf: (answers) => answers.goal === "sell",
    choices: [
      { value: "deciding", label: "Still deciding whether to sell" },
      { value: "value", label: "I want to know what my home might sell for" },
      { value: "prep", label: "Getting the home ready to list" },
      { value: "ready", label: "Ready to list soon" },
    ],
  },
  {
    id: "service",
    legend: "Could a North Texas Heroes homebuying program apply to you or someone in your household?",
    help:
      "Homes for Heroes works with these groups. Your answer only changes which guide we point you to; the program confirms eligibility, not this quiz.",
    choices: [
      { value: "military", label: "Active-duty military, military family or veteran" },
      { value: "responder", label: "Firefighter, EMS or law enforcement" },
      { value: "educator", label: "Teacher or education professional" },
      { value: "healthcare", label: "Healthcare professional" },
      { value: "none", label: "None of these" },
      { value: "notsure", label: "Not sure" },
    ],
  },
]

/** The questions a visitor with these answers actually sees, in order. */
export function visibleQuestions(answers: PathAnswers): PathQuestion[] {
  return PATH_QUESTIONS.filter((question) => !question.showIf || question.showIf(answers))
}

export type PathKey =
  | "first-time"
  | "hero"
  | "relocating"
  | "selling"
  | "sell-buy"
  | "ready-search"
  | "researcher"
  | "unsure"

export type PathLink = { label: string; href: string }

export type PathResult = {
  key: PathKey
  name: string
  /** "Your next move: …" */
  heading: string
  /** Why this path, in the visitor's own terms. */
  summary: string
  nextStep: string
  primary: PathLink
  /** An existing guide or tool that deepens the primary step. */
  resource: PathLink
  consultation: PathLink
}

const CONSULTATION: PathLink = { label: "Schedule a Consultation", href: "/consultation" }
const HEROES_GROUPS = new Set(["military", "responder", "educator", "healthcare"])

/**
 * Decide which path fits a set of answers.
 *
 * Priority is deliberate. A Homes for Heroes group applies whether the person
 * is buying, selling or relocating, so it wins whenever it applies. Relocation
 * comes next because "where" changes every later step. Selling before buying
 * beats a plain sale; a sale beats a purchase; someone ready to search or
 * already pre-approved goes to the search; a first purchase goes to buyer
 * education; a repeat buyer still working out financing, or anyone exploring
 * on a long horizon, goes to research; everyone else lands on the readiness
 * check.
 */
export function resolvePath(answers: PathAnswers): PathKey {
  if (HEROES_GROUPS.has(answers.service ?? "")) return "hero"
  if (answers.goal === "relocate") return "relocating"
  if (answers.goal === "sellbuy" || answers.buyerPosition === "sellfirst") return "sell-buy"
  if (answers.goal === "sell") return "selling"
  if (answers.buyerPosition === "search" || answers.buyerPosition === "preapproved") return "ready-search"
  if (answers.goal === "first") return "first-time"
  if (answers.goal === "next") return "researcher"
  if (answers.goal === "explore") {
    return answers.timeline === "later" || answers.timeline === "researching" ? "researcher" : "unsure"
  }
  return "unsure"
}

const AREA_NAME: Record<string, string> = {
  garland: "Garland",
  dallas: "Dallas",
  collin: "Plano, Frisco and McKinney",
  tarrant: "Fort Worth, Arlington and Irving",
}

/** Where a search for this area starts. Garland has a written guide; the rest go to the search. */
function areaResource(answers: PathAnswers): PathLink {
  if (answers.area === "garland") return { label: "Read the Garland area guide", href: "/areas/garland" }
  if (answers.area === "unsure" || answers.area === "other" || !answers.area) {
    return { label: "Compare DFW neighborhoods", href: "/neighborhoods" }
  }
  return { label: `Search homes in ${AREA_NAME[answers.area]}`, href: "/homes" }
}

/** One sentence that reflects the visitor's timeline back to them, honestly. */
export function timelineNote(timeline: string | undefined): string {
  switch (timeline) {
    case "asap":
      return "Moving as soon as possible means the order of operations matters more than anything else. Talk with Debra early so nothing gets done twice."
    case "3mo":
      return "Three months is enough time to get financing questions answered before you fall for a house, but not enough to leave them for later."
    case "6mo":
      return "Three to six months is a comfortable runway: learn the process now, line up the numbers next, and search with a clear head."
    case "12mo":
      return "With six to twelve months, you can improve your position before you buy. Small steps now, taken in the right order, pay off later."
    case "later":
      return "More than a year out is the best time to learn. There is no rush, and the reading you do now will make every later decision easier."
    default:
      return "No fixed date is fine. Read at your own pace, and use the planning tools when you want to test a number."
  }
}

/** A short line about where the person is in the process, used in the summary. */
function positionNote(answers: PathAnswers): string {
  switch (answers.buyerPosition) {
    case "scratch":
      return "You are starting from scratch, so the sequence comes first: what happens before a tour, what financing actually involves, and where the real costs sit."
    case "financing":
      return "You want to understand financing before you shop, which is the right instinct. Loan types, down-payment help and what lenders look at are covered on this site."
    case "search":
      return "You are ready to search, so the useful work now is a real monthly number and a short list of areas."
    case "preapproved":
      return "You said you are already pre-approved, so the search itself is the next step, with the offer and inspection stages explained before you reach them."
    case "sellfirst":
      return "You need to sell before you buy, so the two timelines have to be planned together."
    default:
      return ""
  }
}

function sellerNote(answers: PathAnswers): string {
  switch (answers.sellerPosition) {
    case "deciding":
      return "You are still deciding whether to sell. A realistic read on what your home might bring, with no obligation, is the first useful input."
    case "value":
      return "You want to know what your home might sell for. That answer comes from recent comparable sales in your neighborhood, not from an online estimate."
    case "prep":
      return "You are getting the home ready. The goal is to spend on what North Texas buyers actually pay for, and nothing else."
    case "ready":
      return "You are close to listing, so pricing, timing and how offers will be handled should be settled before the sign goes up."
    default:
      return ""
  }
}

function areaSentence(answers: PathAnswers): string {
  if (answers.area === "garland") return "Garland is Debra's home market, and there is a step-by-step guide written specifically for buying there."
  if (answers.area && AREA_NAME[answers.area]) return `You are focused on ${AREA_NAME[answers.area]}, which is inside the North Texas area Debra works in.`
  if (answers.area === "other") return "You have a DFW community in mind. Debra works across the metroplex, so the same process applies."
  return "You have not settled on an area yet, so comparing neighborhoods is part of the plan rather than a detail for later."
}

function joinSentences(...parts: string[]): string {
  return parts.filter(Boolean).join(" ")
}

/**
 * Build the visitor's result from their answers.
 *
 * The heading, next step and destinations are fixed per path; the summary is
 * assembled from the answers so the result reads as a response to what the
 * person said, not a brochure paragraph.
 */
export function buildResult(answers: PathAnswers): PathResult {
  const key = resolvePath(answers)
  const area = areaResource(answers)

  switch (key) {
    case "first-time":
      return {
        key,
        name: "First-Time Buyer",
        heading: "Your next move: build your DFW buying plan.",
        summary: joinSentences(
          "You are buying your first home in Dallas–Fort Worth.",
          positionNote(answers),
          areaSentence(answers),
        ),
        nextStep:
          "Start with the first-time buyer guide, then test a monthly payment with the affordability calculator before you look at listings.",
        primary: { label: "Start the first-time buyer guide", href: "/first-time-buyers" },
        resource:
          answers.area === "garland"
            ? { label: "Read: How to buy a home in Garland, Texas", href: "/blog/how-to-buy-home-garland-tx" }
            : { label: "Test a monthly payment", href: "/calculators/affordability" },
        consultation: CONSULTATION,
      }
    case "hero":
      return {
        key,
        name: "North Texas Hero",
        heading: "Your next move: see whether Homes for Heroes fits your move.",
        summary: joinSentences(
          "You or someone in your household works in one of the groups Homes for Heroes serves: military and veterans, firefighters, EMS and law enforcement, teachers, and healthcare professionals.",
          answers.goal === "sell" || answers.goal === "sellbuy"
            ? "The program covers sellers as well as buyers, so it is worth reading before you list."
            : "The program is worth understanding before you buy, and the guide explains what it does and does not do.",
          areaSentence(answers),
        ),
        nextStep:
          "Read how the program works and who confirms eligibility, then decide whether to use it for your purchase or sale.",
        primary: { label: "Explore the Homes for Heroes program", href: "/programs/homes-for-heroes" },
        resource: { label: "Read: How Debra helps North Texas heroes", href: "/blog/homes-for-heroes-north-texas" },
        consultation: CONSULTATION,
      }
    case "relocating":
      return {
        key,
        name: "Moving to DFW",
        heading: "Your next move: get oriented in Dallas–Fort Worth before you search.",
        summary: joinSentences(
          "You are relocating to Dallas–Fort Worth, so the first job is understanding the metroplex: how Dallas, Garland, Plano, Frisco, Fort Worth and the cities between them differ, and what a commute really looks like.",
          positionNote(answers),
        ),
        nextStep:
          "Compare neighborhoods first, then start a search in one or two cities rather than the whole metroplex.",
        primary: { label: "Compare DFW neighborhoods", href: "/neighborhoods" },
        resource:
          answers.area === "garland"
            ? { label: "Read the Garland area guide", href: "/areas/garland" }
            : { label: "Search homes across DFW", href: "/homes" },
        consultation: CONSULTATION,
      }
    case "selling":
      return {
        key,
        name: "Selling a Home",
        heading: "Your next move: find out what your home is likely to sell for.",
        summary: joinSentences(
          "You are selling a home in North Texas.",
          sellerNote(answers),
          areaSentence(answers),
        ),
        nextStep:
          "Request a valuation conversation so pricing starts from recent comparable sales, then decide what preparation is actually worth doing.",
        primary: { label: "Request a home valuation", href: "/contact" },
        resource: { label: "Ask what Debra is seeing in the market", href: "/market-reports" },
        consultation: CONSULTATION,
      }
    case "sell-buy":
      return {
        key,
        name: "Selling and Buying",
        heading: "Your next move: sequence the sale and the purchase.",
        summary: joinSentences(
          "You are selling one home and buying another, so the two timelines have to be planned together: what your current home is likely to bring, what the next payment looks like, and which has to close first.",
          areaSentence(answers),
        ),
        nextStep:
          "Start with a valuation conversation for the home you are leaving, then test the payment on the one you are moving to.",
        primary: { label: "Request a home valuation", href: "/contact" },
        resource: { label: "Test the next home's payment", href: "/calculators/affordability" },
        consultation: CONSULTATION,
      }
    case "ready-search":
      return {
        key,
        name: "Ready to Search",
        heading: "Your next move: search with a real budget in hand.",
        summary: joinSentences(
          positionNote(answers),
          "Debra's role at this stage is to keep the search disciplined: the right cities, a payment you have already tested, and offers written with the inspection and appraisal in mind.",
          areaSentence(answers),
        ),
        nextStep:
          "Search the cities on your list, and check the monthly payment on anything you like before you tour it.",
        primary: { label: "Search homes in DFW", href: "/homes" },
        resource:
          answers.area === "garland"
            ? area
            : { label: "Check a monthly payment", href: "/calculators/mortgage-payment" },
        consultation: CONSULTATION,
      }
    case "researcher":
      return {
        key,
        name: "Early-Stage Researcher",
        heading: "Your next move: learn the process before you need it.",
        summary: joinSentences(
          answers.goal === "next"
            ? "You have bought before, but you want the financing and the sequence clear before you commit again. That is a sensible reset."
            : "You are exploring, and your timeline gives you room to learn before any decision is on the table.",
          positionNote(answers),
          areaSentence(answers),
        ),
        nextStep:
          "Read the planning resources at your own pace, and use the rent-versus-buy and affordability calculators when you want to test a number.",
        primary: { label: "Browse the planning resources", href: "/resources" },
        resource: { label: "Compare renting and buying", href: "/calculators/rent-vs-buy" },
        consultation: CONSULTATION,
      }
    default:
      return {
        key: "unsure",
        name: "Not Sure Yet",
        heading: "Your next move: a short readiness check.",
        summary: joinSentences(
          "You are weighing your options and have not landed on a direction yet, which is a reasonable place to be.",
          "The Find Your Next Step check asks a few more questions and suggests reading based on where you are, with no contact details required.",
          areaSentence(answers),
        ),
        nextStep: "Take the readiness check, then come back to the guides that match what it suggests.",
        primary: { label: "Take the readiness check", href: "/start" },
        resource: { label: "Read the homebuyer FAQ", href: "/faq" },
        consultation: CONSULTATION,
      }
  }
}

/** Ordered list of the eight paths, used to introduce the quiz. */
export const PATH_ORDER: PathKey[] = [
  "first-time",
  "hero",
  "relocating",
  "selling",
  "sell-buy",
  "ready-search",
  "researcher",
  "unsure",
]

export const PATH_NAMES: Record<PathKey, string> = {
  "first-time": "First-Time Buyer",
  hero: "North Texas Hero",
  relocating: "Moving to DFW",
  selling: "Selling a Home",
  "sell-buy": "Selling and Buying",
  "ready-search": "Ready to Search",
  researcher: "Early-Stage Researcher",
  unsure: "Not Sure Yet",
}

/** Shown when the visitor answered "Not sure" to the Heroes question. */
export const HEROES_HINT: PathLink = {
  label: "Not sure whether Homes for Heroes applies? See who the program serves",
  href: "/programs/homes-for-heroes",
}
