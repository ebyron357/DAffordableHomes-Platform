/**
 * Canonical site facts.
 *
 * GOVERNANCE: Per AGENTS.md and PUBLISHING_STANDARD.md, this file must contain
 * ONLY verified information. Unverified trust facts (brokerage, license number,
 * service area, certifications, years of experience, families served) must remain
 * `null` and are surfaced in the UI as an honest "to be confirmed" state — never
 * as fabricated or placeholder values presented as real.
 */

export const SITE = {
  name: "D'Affordable Homes",
  /** Debra's professional designation is verified in the repository README. */
  realtorName: "Debra Allen, REALTOR\u00AE",
  realtorFirstName: "Debra",
  tagline: "Homeownership has steps. You don't have to learn them alone.",
  description:
    "D'Affordable Homes is an education-first digital homeownership platform led by Debra Allen, REALTOR\u00AE. Clear guidance, planning tools, and trustworthy resources for first-time buyers and renters preparing for ownership.",
  url: "https://daffordablehomes.com",
} as const

/**
 * Trust facts that require confirmation before publication. Each is `null` until
 * verified. UI must never invent a value to fill these in.
 */
export const UNVERIFIED_TRUST_FACTS = {
  brokerageName: null as string | null,
  licenseNumber: null as string | null,
  licenseState: null as string | null,
  serviceAreas: [] as string[],
  yearsOfExperience: null as number | null,
  familiesServed: null as number | null,
  certifications: [] as string[],
} as const

export function hasVerifiedBrokerage(): boolean {
  return Boolean(UNVERIFIED_TRUST_FACTS.brokerageName)
}
