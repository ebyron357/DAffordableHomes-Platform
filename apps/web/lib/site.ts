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
  realtorLegalName: "Debra Allen",
  /** Debra's professional designation is verified in the repository README. */
  realtorName: "Debra Allen, REALTOR\u00AE",
  realtorFirstName: "Debra",
  tagline: "Homeownership has steps. You don't have to learn them alone.",
  description:
    "D'Affordable Homes is an education-first digital homeownership platform led by Debra Allen, REALTOR\u00AE. Clear guidance, planning tools, and trustworthy resources for first-time buyers and renters preparing for ownership.",
  url: "https://daffordablehomes.com",
  /** Search and editorial focus; this is not a blanket service-area claim. */
  localContentFocus: ["Garland, Texas", "Dallas–Fort Worth"] as const,
} as const

/**
 * Site build and technology attribution.
 *
 * ClientVerse is the website design and technology vendor for D'Affordable
 * Homes. The attribution is a vendor credit only — it is not an endorsement, a
 * brokerage relationship, or a real-estate affiliation, and the qualification
 * below keeps that boundary explicit wherever the credit is rendered.
 */
export const ATTRIBUTION = {
  vendorName: "ClientVerse",
  vendorUrl: "https://clientverse.io",
  label: "Made by",
  qualification: "Website design and technology vendor for D'Affordable Homes.",
} as const

/**
 * Trust facts that require confirmation before publication. Each is `null` until
 * verified. UI must never invent a value to fill these in.
 */
export const UNVERIFIED_TRUST_FACTS = {
  brokerageName: null as string | null,
  licenseNumber: null as string | null,
  licenseState: null as string | null,
  businessAddress: null as string | null,
  phoneNumber: null as string | null,
  serviceAreas: [] as string[],
  yearsOfExperience: null as number | null,
  familiesServed: null as number | null,
  certifications: [] as string[],
} as const

export function hasVerifiedBrokerage(): boolean {
  return Boolean(UNVERIFIED_TRUST_FACTS.brokerageName)
}
