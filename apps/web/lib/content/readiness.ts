/**
 * Readiness assessment — the single source of truth.
 *
 * These questions and this result engine were defined inside
 * `components/landing/next-step-landing.tsx` (the `/start` conversion flow from
 * PR #26). The homepage now offers the same assessment as a lighter entry
 * point, so the logic moved here and both surfaces import it. Neither one owns
 * a private copy: a change to a question or a routing rule takes effect in both
 * places, which is the whole reason this file exists.
 *
 * GOVERNANCE (PRODUCT_REQUIREMENTS §6.2): these questions are educational.
 * They do not assess loan qualification, and no result may promise approval,
 * eligibility, financing, savings or program acceptance. `getResult` routes to
 * an explanatory section; it never returns a decision.
 */

import type { LucideIcon } from "lucide-react"

export type PathKey = "traditional" | "naca" | "heroes" | "unsure"

export type AssessmentAnswer = {
  id: string
  label: string
  value: string
}

export type Question = {
  id: string
  label: string
  help?: string
  answers: AssessmentAnswer[]
}

export type ReadinessResult = {
  key: string
  label: string
  heading: string
  body: string
  primaryHref: string
  primaryLabel: string
  secondary?: string
}

export type PathDefinition = {
  key: PathKey
  number: string
  title: string
  body: string
  cta: string
  icon: LucideIcon
}

/** Attribution parameters captured on first touch and replayed with a lead. */
export const ATTRIBUTION_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid", "landing_variant"]
/** Shared with the homepage quiz so a started assessment resumes on /start. */
export const STORAGE_KEY = "daffordable-next-step-v1"

export const QUESTIONS: Question[] = [
  {
    id: "housing",
    label: "Where are you today?",
    answers: [
      { id: "renting", label: "Renting", value: "renting" },
      { id: "family", label: "Living with family", value: "family" },
      { id: "owner", label: "I currently own a home", value: "owner" },
      { id: "other", label: "Other", value: "other" },
    ],
  },
  {
    id: "timeline",
    label: "When would you ideally like to buy?",
    answers: [
      { id: "soon", label: "0–3 months", value: "0-3" },
      { id: "next", label: "3–6 months", value: "3-6" },
      { id: "later", label: "6–12 months", value: "6-12" },
      { id: "year", label: "More than a year", value: "year-plus" },
      { id: "unsure", label: "I’m not sure", value: "unsure" },
    ],
  },
  {
    id: "help",
    label: "What do you need the most help understanding?",
    answers: [
      { id: "afford", label: "What I can realistically afford", value: "affordability" },
      { id: "credit", label: "Credit / financial preparation", value: "credit" },
      { id: "down", label: "Down-payment options", value: "down-payment" },
      { id: "naca", label: "NACA", value: "naca" },
      { id: "heroes", label: "Homes for Heroes", value: "heroes" },
      { id: "process", label: "The buying process", value: "process" },
      { id: "unsure", label: "I’m not sure", value: "unsure" },
    ],
  },
  {
    id: "prepared",
    label: "Have you started preparing financially for homeownership?",
    answers: [
      { id: "yes", label: "Yes", value: "yes" },
      { id: "little", label: "A little", value: "little" },
      { id: "not-yet", label: "Not yet", value: "not-yet" },
      { id: "unknown", label: "I don’t know what I should be doing", value: "unknown" },
    ],
  },
  {
    id: "hero",
    label: "Do any of these describe you?",
    answers: [
      { id: "military", label: "Military / Veteran", value: "military" },
      { id: "teacher", label: "Teacher / Educator", value: "teacher" },
      { id: "healthcare", label: "Healthcare Professional", value: "healthcare" },
      { id: "fire", label: "Firefighter / EMS", value: "fire" },
      { id: "law", label: "Law Enforcement", value: "law" },
      { id: "none", label: "None of these", value: "none" },
    ],
  },
  {
    id: "naca",
    label: "Are you already participating in NACA?",
    answers: [
      { id: "yes", label: "Yes", value: "yes" },
      { id: "no", label: "No", value: "no" },
      { id: "considering", label: "I’m considering it", value: "considering" },
      { id: "learning", label: "I don’t know enough about it yet", value: "learning" },
    ],
  },
]

export function getResult(answers: Record<string, string>, selectedPath: PathKey | null) {
  const isHero = answers.hero && answers.hero !== "none"
  const isNaca = answers.help === "naca" || answers.naca === "yes" || answers.naca === "considering"
  const isTraditional = selectedPath === "traditional" || answers.timeline === "0-3" || answers.timeline === "3-6"

  if (selectedPath === "naca" || isNaca) {
    return {
      key: "naca",
      label: "NACA exploration",
      heading: "Start by understanding the NACA process.",
      body: "Based on what you shared, NACA may be worth exploring. The useful next step is learning how preparation, documentation, counseling, home selection, and mortgage processing fit together.",
      primaryHref: "#naca",
      primaryLabel: "Explore the NACA path",
      secondary: isHero ? "Homes for Heroes may also be worth exploring." : undefined,
    }
  }

  if (selectedPath === "heroes" || isHero) {
    return {
      key: "hero",
      label: "Homes for Heroes exploration",
      heading: "Explore the homebuying options connected to your service.",
      body: "Your service may make a Homes for Heroes resource worth investigating. Start with the details that apply to your role and confirm current requirements with the applicable program.",
      primaryHref: "#heroes",
      primaryLabel: "Explore hero options",
      secondary: isTraditional ? "Traditional purchase planning may also be useful." : undefined,
    }
  }

  if (isTraditional) {
    return {
      key: "traditional",
      label: "Traditional purchase planning",
      heading: "Build the plan before you start shopping.",
      body: "You may be ready to focus on a traditional purchase plan. Understanding affordability, financing questions, neighborhoods, and the offer process can help you move with more clarity.",
      primaryHref: "#traditional",
      primaryLabel: "Build my homebuying path",
      secondary: answers.help === "down-payment" ? "Down-payment options may also deserve attention." : undefined,
    }
  }

  return {
    key: "readiness",
    label: "Homeownership readiness",
    heading: "Your next step is getting oriented.",
    body: "You do not need every answer today. Start by understanding the process, organizing the questions in front of you, and choosing one practical preparation step.",
    primaryHref: "#readiness",
    primaryLabel: "See the readiness path",
    secondary: answers.help === "down-payment" ? "Local assistance may also be worth exploring." : undefined,
  }
}
