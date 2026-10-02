import type { Metadata } from "next"
import { ProgramPage } from "@/components/programs/program-page"
import { PROGRAMS } from "@/lib/programs"
import { SHARE_IMAGES } from "@/lib/seo"

export const metadata: Metadata = {
  title: "NACA Homebuyer Help in Garland and DFW",
  description:
    "Real-estate guidance for NACA homebuyers in Garland and Dallas–Fort Worth: search, offer, inspection, and closing support, without unsupported program promises.",
  alternates: { canonical: "/programs/naca" },
  openGraph: {
    title: "NACA Homebuyer Help | D'Affordable Homes",
    description:
      "Independent North Texas real-estate guidance for buyers considering or using the NACA homebuying program.",
    url: "/programs/naca",
    type: "website",
    ...SHARE_IMAGES,
  },
}

export default function NacaProgramPage() {
  return <ProgramPage program={PROGRAMS.naca} />
}
