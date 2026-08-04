export const LOCAL_MARKET = {
  primaryMarket: "Garland, Texas",
  regionalMarket: "Dallas–Fort Worth",
  stateName: "Texas",
  targetCommunities: ["Garland", "Dallas"] as const,
  verifiedServiceAreas: [] as string[],
  serviceAreaStatus:
    "Service availability for a specific North Texas community must be confirmed directly with Debra before representation is promised.",
} as const

export function hasVerifiedServiceAreas(): boolean {
  return LOCAL_MARKET.verifiedServiceAreas.length > 0
}

export function verifiedAreaServedSchema(): Array<{
  "@type": "City"
  name: string
}> {
  return LOCAL_MARKET.verifiedServiceAreas.map((name) => ({
    "@type": "City" as const,
    name,
  }))
}
