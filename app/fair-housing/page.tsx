import type { Metadata } from "next"
import { PageHeader } from "@/components/page/page-header"
import { Section, Prose } from "@/components/page/section"

export const metadata: Metadata = {
  title: "Fair Housing",
  description:
    "D'Affordable Homes is committed to fair housing. We support equal access to housing opportunity for all people, without discrimination.",
}

export default function FairHousingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our commitment"
        title="Fair housing for everyone"
        intro="Everyone deserves a fair chance at homeownership. D'Affordable Homes is committed to upholding fair housing principles in everything we do."
        crumbs={[{ label: "Home", href: "/" }, { label: "Fair Housing" }]}
      />
      <Section>
        <Prose>
          <p>
            D&apos;Affordable Homes supports the Fair Housing Act and the principle of equal housing opportunity. We do not
            discriminate, and we will not tolerate discrimination, on the basis of race, color, religion, sex, disability,
            familial status, national origin, or any other characteristic protected by federal, state, or local law.
          </p>
          <h2>What this means in practice</h2>
          <ul>
            <li>Our education and resources are open to everyone, regardless of background.</li>
            <li>We provide the same honest guidance to every person we work with.</li>
            <li>We never steer people toward or away from neighborhoods based on protected characteristics.</li>
          </ul>
          <h2>Reporting a concern</h2>
          <p>
            If you believe you have experienced housing discrimination, you can file a complaint with the U.S. Department
            of Housing and Urban Development (HUD) at{" "}
            <a href="https://www.hud.gov/fairhousing" target="_blank" rel="noopener noreferrer">
              hud.gov/fairhousing
            </a>
            .
          </p>
        </Prose>
      </Section>
    </>
  )
}
