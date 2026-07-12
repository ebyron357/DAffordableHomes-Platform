import type { Metadata } from "next"
import Link from "next/link"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"
import { Notice } from "@/components/states/notice"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Neighborhood Guides",
  description:
    "Honest neighborhood guides to help you understand communities, not just listings. Published as guides are researched and verified.",
}

export default function NeighborhoodsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Explore"
        title="Understand communities, not just addresses"
        description="A home is also a neighborhood. These guides will help you weigh what matters — schools, commute, amenities, and feel."
      />

      <Section>
        <Container className="max-w-2xl">
          <Notice tone="info" title="Guides are being researched">
            <p>
              We&apos;re building neighborhood guides with verified, up-to-date information rather than generic
              summaries. They&apos;ll appear here as each one is completed. For now, Debra is happy to talk through
              specific areas with you directly.
            </p>
          </Notice>
          <div className="mt-8">
            <Button asChild>
              <Link href="/contact">Ask Debra about an area</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}
