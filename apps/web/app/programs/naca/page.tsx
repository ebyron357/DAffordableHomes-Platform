import type { Metadata } from "next"
import { ProgramPage } from "@/components/programs/program-page"
import { PROGRAMS } from "@/lib/programs"
import { OPEN_GRAPH_BASE } from "@/lib/seo"

export const metadata: Metadata = {
  title: "NACA Program Help in Garland and DFW",
  description:
    "How the NACA program works, and real-estate help for NACA buyers in Garland and Dallas–Fort Worth: search, offer, inspection and closing.",
  alternates: { canonical: "/programs/naca" },
  openGraph: {
    title: "NACA Homebuyer Help | D'Affordable Homes",
    description:
      "Independent North Texas real-estate guidance for buyers considering or using the NACA homebuying program.",
    url: "/programs/naca",
    type: "website",
    ...OPEN_GRAPH_BASE,
  },
}

export default function NacaProgramPage() {
  return <ProgramPage program={PROGRAMS.naca} />
}
