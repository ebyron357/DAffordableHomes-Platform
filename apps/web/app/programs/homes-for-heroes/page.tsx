import type { Metadata } from "next"
import { ProgramPage } from "@/components/programs/program-page"
import { PROGRAMS } from "@/lib/programs"

export const metadata: Metadata = {
  title: "Homes for Heroes Real-Estate Guidance in North Texas",
  description:
    "Buying, selling, and move-planning guidance for veterans, military families, teachers, healthcare workers, firefighters, EMS, and law-enforcement professionals exploring Garland and Dallas–Fort Worth.",
  alternates: { canonical: "/programs/homes-for-heroes" },
  openGraph: {
    title: "Homes for Heroes Guidance | D'Affordable Homes",
    description:
      "North Texas real-estate guidance for eligible community heroes, without unsupported savings or affiliation claims.",
    url: "/programs/homes-for-heroes",
    type: "website",
  },
}

export default function HomesForHeroesProgramPage() {
  return <ProgramPage program={PROGRAMS["homes-for-heroes"]} />
}
