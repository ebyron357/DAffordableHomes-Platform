import type { Metadata } from "next"
import { NextStepLanding } from "@/components/landing/next-step-landing"
import { SHARE_IMAGES } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Find Your Next Homebuying Step in DFW",
  description:
    "Not sure where to start with homeownership in Dallas–Fort Worth? Explore your options, learn about NACA and other pathways, and find an educational next step.",
  alternates: { canonical: "/start" },
  openGraph: {
    title: "Find Your Next Step | D’Affordable Homes",
    description: "Clear, education-first guidance for renters and buyers preparing for homeownership in Dallas–Fort Worth.",
    url: "/start",
    type: "website",
    ...SHARE_IMAGES,
  },
}

export default function StartPage() {
  return <NextStepLanding />
}
