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
        description="D'Affordable Homes publishes client feedback only after the statement and permission to publish are verified."
      />

      <Section>
        <Container className="max-w-2xl">
          <Notice tone="info" title="Verified reviews only">
            <p>
              No testimonial is published without confirmation and permission. Until verified reviews are supplied, use Debra&apos;s buyer guides, process explanations, and consultation expectations to evaluate whether the approach fits your needs.
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
