/**
 * Vendor-agnostic property search provider.
 *
 * Per PRODUCT_REQUIREMENTS.md: property search must NEVER fabricate listings.
 * When no MLS/IDX provider is configured, the resolver returns a "disconnected"
 * result with an honest notice instead of fake homes.
 */

export type Listing = {
  id: string
  address: string
  city: string
  price: number
  beds: number
  baths: number
  sqft: number
}

export type PropertySearchResult =
  | { status: "connected"; providerName: string; listings: Listing[] }
  | { status: "disconnected"; reason: string }
  | { status: "error"; reason: string }

/** Env var names only — never hardcode credentials. */
const REQUIRED_ENV = ["MLS_PROVIDER", "MLS_API_KEY"] as const

export function isPropertyProviderConfigured(): boolean {
  return REQUIRED_ENV.every((key) => Boolean(process.env[key]))
}

export async function searchListings(): Promise<PropertySearchResult> {
  if (!isPropertyProviderConfigured()) {
    return {
      status: "disconnected",
      reason:
        "Live MLS listings aren't connected yet. Rather than show placeholder homes, we keep this honest — real listings appear here once the MLS/IDX feed is connected.",
    }
  }

  // Wiring point: a real adapter (e.g. Canopy MLS) would fetch here.
  // Intentionally not implemented so listings are never fabricated.
  return {
    status: "disconnected",
    reason: "The property search adapter is configured but not yet implemented for release.",
  }
}
