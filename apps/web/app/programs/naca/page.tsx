import type { Metadata } from "next"
import { ProgramPage } from "@/components/programs/program-page"
import { PROGRAMS } from "@/lib/programs"

export const metadata: Metadata = {
  title: "NACA Homebuyer Help in Garland and Dallas–Fort Worth",
  description:
    "Independent real-estate guidance for buyers using the NACA homebuying program in Garland and the Dallas–Fort Worth area. Search, offer, inspection, and closing support without unsupported program promises.",
  alternates: { canonical: "/programs/naca" },
  openGraph: {
    title: "NACA Homebuyer Help | D'Affordable Homes",
    description:
      "Independent North Texas real-estate guidance for buyers considering or using the NACA homebuying program.",
    url: "/programs/naca",
    type: "website",
  },
}

export default function NacaProgramPage() {
  return <ProgramPage program={PROGRAMS.naca} />
}
