/**
 * "Find Your Next Step" — signature educational flow.
 *
 * GOVERNANCE (PRODUCT_REQUIREMENTS §6.2): questions must be non-discriminatory,
 * must not assess loan qualification, and results are educational only. No
 * protected-class, steering, or qualification questions are permitted.
 */

export type Choice = { value: string; label: string }

export type Question = {
  id: string
  legend: string
  help?: string
  choices: Choice[]
}

export const NEXT_STEP_QUESTIONS: Question[] = [
  {
    id: "stage",
    legend: "Which of these sounds most like you right now?",
    choices: [
      { value: "curious", label: "I'm just starting to think about buying a home someday." },
      { value: "preparing", label: "I want to prepare, but I'm not sure where to begin." },
      { value: "planning", label: "I'm actively making a plan to buy in the next while." },
      { value: "searching", label: "I feel ready and want to start looking at homes." },
    ],
  },
  {
    id: "focus",
    legend: "What feels most useful to understand first?",
    help: "This only helps us suggest resources. There are no wrong answers.",
    choices: [
      { value: "process", label: "How the overall homebuying process works" },
      { value: "money", label: "Saving, budgeting, and getting financially prepared" },
      { value: "programs", label: "Programs and options for first-time buyers, including NACA" },
      { value: "area", label: "Neighborhoods and what's available in the area" },
    ],
  },
  {
    id: "support",
    legend: "How would you like to move forward?",
    choices: [
      { value: "self", label: "I'd like to keep learning on my own for now." },
      { value: "guided", label: "I'd like some guidance from Debra when I'm ready." },
      { value: "soon", label: "I'd like to talk with Debra soon." },
    ],
  },
]

export type Recommendation = {
  href: string
  title: string
  description: string
}

export type StageResult = {
  stageLabel: string
  summary: string
}

export const STAGE_RESULTS: Record<string, StageResult> = {
  curious: {
    stageLabel: "Exploring",
    summary:
      "You're in the exploring stage — learning what homeownership involves before making any commitments. That's a great place to start, and there's no rush.",
  },
  preparing: {
    stageLabel: "Preparing",
    summary:
      "You're in the preparing stage — ready to build a foundation. The focus now is understanding the process and getting organized, one step at a time.",
  },
  planning: {
    stageLabel: "Planning",
    summary:
      "You're in the planning stage — turning your goal into a practical plan. Learning how financing and the search work will help you feel confident about what comes next.",
  },
  searching: {
    stageLabel: "Actively looking",
    summary:
      "You're feeling ready to explore homes. It's still worth confirming your plan and understanding the search and offer process so you can move with clarity.",
  },
}

const RESOURCE_LIBRARY: Record<string, Recommendation> = {
  process: {
    href: "/first-time-buyers",
    title: "First-time buyer basics",
    description: "A plain-language walk through how the homebuying process works.",
  },
  money: {
    href: "/resources",
    title: "Saving & preparation resources",
    description: "Practical education on budgeting, saving, and getting financially organized.",
  },
  programs: {
    href: "/naca",
    title: "NACA & first-time buyer education",
    description: "Introductory information about the NACA process and what to expect.",
  },
  area: {
    href: "/neighborhoods",
    title: "Neighborhood guides",
    description: "Get to know the area with neutral, verified local context.",
  },
  roadmap: {
    href: "/start#roadmap",
    title: "The homeownership roadmap",
    description: "See the full journey from exploring to early ownership.",
  },
  consult: {
    href: "/book",
    title: "Book a consultation",
    description: "A calm conversation with Debra about your next step — no pressure.",
  },
}

export function buildRecommendations(answers: Record<string, string>): Recommendation[] {
  const recs: Recommendation[] = []
  const focus = answers.focus
  if (focus && RESOURCE_LIBRARY[focus]) recs.push(RESOURCE_LIBRARY[focus])

  // Everyone benefits from understanding the overall process if they didn't pick it.
  if (focus !== "process") recs.push(RESOURCE_LIBRARY.process)

  if (answers.support === "guided" || answers.support === "soon") {
    recs.push(RESOURCE_LIBRARY.consult)
  } else {
    recs.push(RESOURCE_LIBRARY.roadmap)
  }
  // De-duplicate by href.
  return recs.filter((rec, i, arr) => arr.findIndex((r) => r.href === rec.href) === i)
}
