import type { Metadata } from "next"
import { NextStepLanding } from "@/components/landing/next-step-landing"

export const metadata: Metadata = {
  title: "Find Your Next Step | DFW Homeownership Guidance",
  description:
    "Not sure where to start with homeownership in Dallas–Fort Worth? Explore your options, learn about NACA and homebuyer pathways, and find an educational next step with D’Affordable Homes.",
  alternates: { canonical: "/start" },
  openGraph: {
    title: "Find Your Next Step | D’Affordable Homes",
    description: "Clear, education-first guidance for renters and buyers preparing for homeownership in Dallas–Fort Worth.",
    url: "/start",
    type: "website",
  },
}

export default function StartPage() {
  return <NextStepLanding />
}
