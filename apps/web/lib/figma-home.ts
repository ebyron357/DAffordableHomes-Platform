/**
 * CTA and content map for Figma homepage frame 11:4
 * (file x8TpOO9gK5tsbcjkEsK18A, daffordable-homes-home-page).
 *
 * Destinations use existing repository routes only.
 * No fabricated listings, contact facts, or unverified geography.
 */

export const FIGMA_HOME_NAV = [
  { label: "Home", href: "/" },
  { label: "Buy", href: "/first-time-buyers" },
  { label: "Sell", href: "/contact" },
  { label: "Search Homes", href: "/homes" },
  { label: "New Construction", href: "/consultation" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const

export const FIGMA_HOME_CTA = {
  searchHomes: { label: "Search Homes", href: "/homes" },
  startBuying: { label: "Start Buying", href: "/first-time-buyers" },
  sellMyHome: { label: "Sell My Home", href: "/contact" },
  aboutDebra: { label: "Learn More About Debra", href: "/about" },
  consultation: { label: "Schedule a Consultation", href: "/consultation" },
  searchAllHomes: { label: "Search All Homes", href: "/homes" },
  buyerResources: { label: "Explore Buyer Resources", href: "/first-time-buyers" },
  homeValuation: { label: "Request Home Valuation", href: "/contact" },
} as const

export const FIGMA_SERVICES = [
  {
    title: "Buy a Home",
    body: "Complete buyer representation from custom home search criteria to contract and closing negotiation.",
    href: "/first-time-buyers",
  },
  {
    title: "Sell a Home",
    body: "Strategic marketing plans, accurate home valuation models, and dedicated advocate representation to maximize your equity.",
    href: "/contact",
  },
  {
    title: "Search Homes",
    body: "Access our real-time regional DFW search tools to view MLS listings, property details, and active neighborhood inventories.",
    href: "/homes",
  },
  {
    title: "New Construction",
    body: "Partner with a professional agent to negotiate builder terms, select options, and oversee custom builds from foundation to key-turn.",
    href: "/consultation",
  },
] as const

export const FIGMA_CITIES = [
  { name: "Dallas", href: "/areas" },
  { name: "Fort Worth", href: "/areas" },
  { name: "Arlington", href: "/areas" },
  { name: "Plano", href: "/areas" },
  { name: "Frisco", href: "/areas" },
  { name: "McKinney", href: "/areas" },
  { name: "Irving", href: "/areas" },
  { name: "Garland", href: "/areas/garland" },
] as const

export const FIGMA_BUYER_POINTS = [
  "Personalized Financial Evaluation: Understand debt-to-income and actual purchase power.",
  "Comprehensive Neighborhood Match: Identify DFW communities aligned with your daily routines.",
  "Builder & Vendor Liaison: Navigate standard and newly constructed contract negotiations safely.",
] as const

export const FIGMA_SELLER_POINTS = [
  "Accurate Valuation Analytics: Comprehensive comparative market reports built on verified real sales.",
  "High-Value Strategic Listing Prep: Targeted updates that maximize return on your equity.",
  "Advocate-Level Representation: Strong negotiation of inspector requests, appraisals, and timelines.",
] as const

export const FIGMA_KNOWLEDGE = [
  {
    title: "First-Time Buyer Resources",
    body: "Guides and educational plans dedicated to demystifying the local buying timeline.",
    href: "/first-time-buyers",
  },
  {
    title: "Affordability Planning",
    body: "Practical evaluation calculators designed to map gross income to comfortable monthly bounds.",
    href: "/calculators",
  },
  {
    title: "Financing Resources",
    body: "Overview of conventional loans, down payment grants, and qualification benchmarks.",
    href: "/resources",
  },
  {
    title: "Homebuyer Roadmap",
    body: "Explore a clear 10-stage preparation framework covering education to final key-turn.",
    href: "/start",
  },
  {
    title: "NACA Information",
    body: "A brief optional reference showing alternative program timelines and requirements.",
    href: "/programs/naca",
  },
] as const

export const FIGMA_FOOTER_LINKS = [
  { label: "Buy", href: "/first-time-buyers" },
  { label: "Sell", href: "/contact" },
  { label: "Search Homes", href: "/homes" },
  { label: "New Construction", href: "/consultation" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
] as const

export const FIGMA_FOOTER_LEGAL = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Legal Disclaimers", href: "/fair-housing" },
] as const
