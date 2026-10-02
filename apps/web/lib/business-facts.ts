import { SITE, UNVERIFIED_TRUST_FACTS } from "@/lib/site"

/**
 * Turns the trust facts in `lib/site.ts` into what the site displays and marks
 * up, so supplying a verified value is a one-line change there and nothing else.
 *
 * Every fact is still `null` today, so both functions return nothing and no
 * page shows or asserts a brokerage, licence, phone number or address. Each
 * value appears on its own the moment it is filled in; nothing here invents a
 * fallback. `tests/static/business-facts.test.mjs` pins both behaviours.
 *
 * Texas advertising rules expect the sponsoring broker's name wherever a
 * licence holder advertises, so the brokerage is listed first. Whether the
 * wording satisfies TREC is the broker's sign-off, not this file's.
 */

export type TrustFacts = {
  readonly brokerageName: string | null
  readonly licenseNumber: string | null
  readonly licenseState: string | null
  readonly businessAddress: string | null
  readonly phoneNumber: string | null
  readonly serviceAreas: readonly string[]
}

export type ProfessionalDetail = {
  key: "brokerage" | "license" | "phone" | "address"
  label: string
  value: string
  /** Set for the phone number, so it can be tapped to call. */
  href?: string
}

/** The verified professional details, in display order. Empty until supplied. */
export function professionalDetails(facts: TrustFacts = UNVERIFIED_TRUST_FACTS): ProfessionalDetail[] {
  const details: ProfessionalDetail[] = []
  if (facts.brokerageName) {
    details.push({ key: "brokerage", label: "Brokerage", value: facts.brokerageName })
  }
  if (facts.licenseNumber) {
    details.push({
      key: "license",
      label: facts.licenseState ? `${facts.licenseState} real estate license` : "Real estate license",
      value: facts.licenseNumber,
    })
  }
  if (facts.phoneNumber) {
    details.push({ key: "phone", label: "Phone", value: facts.phoneNumber, href: `tel:${telephone(facts.phoneNumber)}` })
  }
  if (facts.businessAddress) {
    details.push({ key: "address", label: "Office", value: facts.businessAddress })
  }
  return details
}

/** True once a visitor can reach Debra by phone or at an office, not only online. */
export function hasDirectContact(facts: TrustFacts = UNVERIFIED_TRUST_FACTS): boolean {
  return Boolean(facts.phoneNumber || facts.businessAddress)
}

/**
 * The local-business entity for search engines, or `null`.
 *
 * Emitted only when both the address and the phone number are verified: a
 * local listing without an address is not eligible for local results, and a
 * name, address and phone that disagree with the business profile do more
 * harm than no markup at all.
 */
export function localBusinessJsonLd(facts: TrustFacts = UNVERIFIED_TRUST_FACTS): Record<string, unknown> | null {
  if (!facts.businessAddress || !facts.phoneNumber) return null
  const logo = `${SITE.url}/images/daffordable-homes-official-logo.png`
  return {
    "@type": "RealEstateAgent",
    "@id": `${SITE.url}/#local-business`,
    name: SITE.name,
    url: SITE.url,
    logo,
    image: logo,
    telephone: telephone(facts.phoneNumber),
    address: facts.businessAddress,
    ...(facts.serviceAreas.length > 0
      ? { areaServed: facts.serviceAreas.map((name) => ({ "@type": "Place", name })) }
      : {}),
    ...(facts.brokerageName ? { parentOrganization: { "@type": "Organization", name: facts.brokerageName } } : {}),
    employee: { "@id": `${SITE.url}/#debra-allen` },
  }
}

/** A dialable form of a displayed number: digits, keeping a leading `+`. */
function telephone(display: string): string {
  const digits = display.replace(/[^\d+]/g, "")
  return digits.startsWith("+") ? digits : `+1${digits.replace(/^1(?=\d{10}$)/, "")}`
}
