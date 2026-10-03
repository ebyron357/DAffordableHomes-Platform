export const LOCAL_MARKET = {
  primaryMarket: "Garland, Texas",
  regionalMarket: "Dallas–Fort Worth",
  stateName: "Texas",
  targetCommunities: ["Garland", "Dallas"] as const,
  verifiedServiceAreas: [] as string[],
  // Same boundary as before — no service area is claimed — written as an
  // invitation rather than a legal notice. Verified areas replace it.
  serviceAreaStatus:
    "Debra focuses on Garland and the wider Dallas–Fort Worth area. Tell her where you're hoping to buy, and she'll confirm whether she can help with that area before anything else.",
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
