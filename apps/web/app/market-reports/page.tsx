import type { Metadata } from "next"
import Link from "next/link"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"
import { Notice } from "@/components/states/notice"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Market Reports",
  description:
    "Clear, honest market context to help you plan. Reports publish here once the data source is connected — never estimated or fabricated.",
}

export default function MarketReportsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Explore"
        title="Market context, explained simply"
        description="Understanding the market helps you plan with confidence. When reports are available, we'll explain what the numbers mean for you."
      />

      <Section>
        <Container className="max-w-2xl">
          <Notice tone="info" title="Reports aren't connected yet">
            <p>
              Market reports require a verified data source. Rather than publish estimated or made-up figures, we keep
              this honest — real, sourced reports will appear here once the data feed is connected.
            </p>
          </Notice>
          <div className="mt-8">
            <Button asChild variant="outline">
              <Link href="/resources">Explore planning resources</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}
