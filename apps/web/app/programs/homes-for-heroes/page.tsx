import type { Metadata } from "next"
import { ProgramPage } from "@/components/programs/program-page"
import { PROGRAMS } from "@/lib/programs"
import { OPEN_GRAPH_BASE } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Homes for Heroes Help in North Texas",
  description:
    "Buying, selling, and move guidance for veterans, military families, teachers, healthcare workers, firefighters, EMS, and law enforcement in Garland and DFW.",
  alternates: { canonical: "/programs/homes-for-heroes" },
  openGraph: {
    title: "Homes for Heroes Guidance | D'Affordable Homes",
    description:
      "North Texas real-estate guidance for eligible community heroes, without unsupported savings or affiliation claims.",
    url: "/programs/homes-for-heroes",
    type: "website",
    ...OPEN_GRAPH_BASE,
  },
}

export default function HomesForHeroesProgramPage() {
  return <ProgramPage program={PROGRAMS["homes-for-heroes"]} />
}
