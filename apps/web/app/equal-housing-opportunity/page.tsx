import type { Metadata } from "next"
import Link from "next/link"
import { Home } from "lucide-react"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"
import { Container } from "@/components/ui/container"
import { Prose } from "@/components/page/prose"

export const metadata: Metadata = {
  title: "Equal Housing Opportunity",
  description:
    "D'Affordable Homes proudly supports Equal Housing Opportunity and the fair treatment of every person seeking a home.",
}

export default function EqualHousingPage() {
  return (
    <>
      <PageHeader eyebrow="Our commitment" title="Equal Housing Opportunity" />
      <Section>
        <Container>
          <div className="mb-8 flex items-center gap-4 rounded-xl border border-border bg-card p-6">
            <Home className="size-8 shrink-0 text-primary" aria-hidden="true" />
            <p className="text-sm font-medium text-foreground">
              We support Equal Housing Opportunity and serve all clients fairly and without discrimination.
            </p>
          </div>
          <Prose>
            <p>
              D&apos;Affordable Homes supports the principle of Equal Housing Opportunity. We are committed to providing
              equal service and access to information to all people, without regard to race, color, religion, sex,
              disability, familial status, or national origin.
            </p>
            <p>
              This commitment is central to our mission. Homeownership is a path to stability and legacy, and we believe
              that path should be open, understandable, and welcoming to everyone.
            </p>
            <p>
              For more detail on how we uphold this commitment, read our{" "}
              <Link href="/fair-housing">Fair Housing Statement</Link>.
            </p>
          </Prose>
        </Container>
      </Section>
    </>
  )
}
