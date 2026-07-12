import type { Metadata } from "next"
import { PageHeader } from "@/components/page/page-header"
import { Section, Prose } from "@/components/page/section"

export const metadata: Metadata = {
  title: "Equal Housing Opportunity",
  description:
    "D'Affordable Homes proudly supports Equal Housing Opportunity. All are welcome, and all are served equally.",
}

export default function EqualHousingOpportunityPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our commitment"
        title="Equal Housing Opportunity"
        intro="D'Affordable Homes is an advocate for and supporter of Equal Housing Opportunity."
        crumbs={[{ label: "Home", href: "/" }, { label: "Equal Housing Opportunity" }]}
      />
      <Section>
        <Prose>
          <p>
            We are pledged to the letter and spirit of U.S. policy for the achievement of equal housing opportunity
            throughout the nation. We encourage and support an affirmative advertising and marketing program in which
            there are no barriers to obtaining housing because of race, color, religion, sex, disability, familial status,
            or national origin.
          </p>
          <p>
            For more information on your rights, visit the U.S. Department of Housing and Urban Development at{" "}
            <a href="https://www.hud.gov" target="_blank" rel="noopener noreferrer">
              hud.gov
            </a>
            . See also our{" "}
            <a href="/fair-housing">Fair Housing commitment</a>.
          </p>
        </Prose>
      </Section>
    </>
  )
}
