import type { Metadata } from "next"
import Link from "next/link"
import { searchListings } from "@/lib/mls/provider"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"
import { Notice } from "@/components/states/notice"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Explore Homes",
  description:
    "Explore homes and neighborhoods with guidance. When live listings aren't connected, we tell you honestly instead of showing placeholder homes.",
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)
}

export default async function HomesPage() {
  const result = await searchListings()

  return (
    <>
      <PageHeader
        eyebrow="Explore"
        title="Explore homes with a plan, not pressure"
        description="Searching is exciting, but it works best once you understand your budget and your steps. Start with the education, then explore when you're ready."
      />

      <Section>
        <Container>
          {result.status === "connected" ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {result.listings.map((listing) => (
                <Card key={listing.id}>
                  <p className="font-serif text-xl font-semibold text-foreground">{formatPrice(listing.price)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {listing.address}, {listing.city}
                  </p>
                  <p className="mt-3 text-sm text-foreground/80">
                    {listing.beds} bd · {listing.baths} ba · {listing.sqft.toLocaleString()} sqft
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-2xl">
              <Notice
                tone={result.status === "error" ? "warning" : "info"}
                title={result.status === "error" ? "Search is temporarily unavailable" : "Live listings aren't connected yet"}
              >
                <p>{result.reason}</p>
              </Notice>
              <div className="mt-8 rounded-xl border border-border bg-card p-6">
                <h2 className="font-serif text-lg font-semibold text-foreground">While listings are offline</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  The most valuable work happens before you search anyway. Get your steps in order so you&apos;re ready
                  to move with confidence when the right home appears.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button asChild>
                    <Link href="/start">Find your next step</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/first-time-buyers">Start with the basics</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
