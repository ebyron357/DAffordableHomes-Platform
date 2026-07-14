import type { Metadata } from "next"
import Link from "next/link"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"
import { Notice } from "@/components/states/notice"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Real stories from people Debra has guided toward homeownership. We publish only verified, consented reviews — never invented ones.",
}

export default function TestimonialsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Connect"
        title="Stories from the people Debra has guided"
        description="The best measure of this work is how people feel walking through it. Verified stories will be shared here with permission."
      />

      <Section>
        <Container className="max-w-2xl">
          <Notice tone="info" title="Verified reviews only">
            <p>
              We don&apos;t publish invented or placeholder testimonials. Real, consented stories — and any connected
              Google reviews — will appear here as they&apos;re confirmed for release.
            </p>
          </Notice>
          <div className="mt-8">
            <Button asChild>
              <Link href="/book">Start your own story</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}
