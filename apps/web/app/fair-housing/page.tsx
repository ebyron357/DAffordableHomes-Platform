import type { Metadata } from "next"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"
import { Container } from "@/components/ui/container"
import { Prose } from "@/components/page/prose"

export const metadata: Metadata = {
  title: "Fair Housing Statement",
  description:
    "D'Affordable Homes is committed to fair housing for all. We do not discriminate and we support equal opportunity in housing.",
}

export default function FairHousingPage() {
  return (
    <>
      <PageHeader eyebrow="Our commitment" title="Fair Housing Statement" />
      <Section>
        <Container>
          <Prose>
            <p>
              D&apos;Affordable Homes and Debra Allen, REALTOR&reg;, are committed to the letter and spirit of United
              States policy for the achievement of equal housing opportunity throughout the nation.
            </p>
            <h2>Our promise</h2>
            <p>
              We do not discriminate against any person because of race, color, religion, sex, disability, familial
              status, national origin, or any other class protected by applicable federal, state, or local law. Every
              person deserves to be treated with dignity and respect throughout the homeownership journey.
            </p>
            <h2>Education for everyone</h2>
            <p>
              Our education-first approach exists to widen access to homeownership. We aim to make information clear and
              available to all, regardless of background, income level, or prior experience.
            </p>
            <h2>Report a concern</h2>
            <p>
              If you believe you have experienced housing discrimination, you may file a complaint with the U.S.
              Department of Housing and Urban Development (HUD) at{" "}
              <a href="https://www.hud.gov/fairhousing" target="_blank" rel="noopener noreferrer">
                hud.gov/fairhousing
              </a>
              .
            </p>
          </Prose>
        </Container>
      </Section>
    </>
  )
}
