import type { Metadata } from "next"
import Link from "next/link"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"
import { Notice } from "@/components/states/notice"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Blog & Articles",
  description:
    "Plain-language articles on credit, budgeting, assistance programs, and the homeownership journey — published as they're ready.",
}

export default function BlogPage() {
  return (
    <>
      <PageHeader
        eyebrow="Learn"
        title="Articles for every step of the journey"
        description="Short, honest reads on the parts of homeownership that feel confusing — written to be understood, not to impress."
      />

      <Section>
        <Container className="max-w-2xl">
          <Notice tone="info" title="Articles are on the way">
            <p>
              Debra is writing the first set of guides now. We publish articles only when they&apos;re genuinely
              helpful and accurate — so you&apos;ll never find filler here. In the meantime, the guides below cover the
              essentials.
            </p>
          </Notice>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/first-time-buyers">First-time buyer guide</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/faq">Read the FAQ</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}
