/**
 * CTA and content map for Figma homepage frame 11:4
 * (file x8TpOO9gK5tsbcjkEsK18A, daffordable-homes-home-page).
 *
 * Destinations use existing repository routes only.
 * No fabricated listings, contact facts, or unverified geography.
 */

/**
 * Primary navigation.
 *
 * `condensed` marks the items that survive at laptop widths. The full eight
 * items need about 1100px; below that the header used to drop straight to a
 * hamburger, which left a 1024px viewport showing a logo, a mostly empty bar
 * and a menu button. The condensed set keeps the five paths people actually
 * come for, and the mobile menu still carries everything.
 */
export const FIGMA_HOME_NAV = [
  { label: "Home", href: "/", condensed: false },
  { label: "Buy", href: "/first-time-buyers", condensed: true },
  { label: "Sell", href: "/contact", condensed: true },
  { label: "Search Homes", href: "/homes", condensed: true },
  { label: "New Construction", href: "/consultation", condensed: false },
  { label: "Resources", href: "/resources", condensed: true },
  { label: "About", href: "/about", condensed: true },
  { label: "Contact", href: "/contact", condensed: false },
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

/**
 * Markets presented as an editorial list rather than eight photo cards.
 *
 * The supporting line is the county each city sits in — a verifiable civic
 * fact — so the section carries real local context without inventing market
 * statistics, price claims, or inventory counts. No image wells: the approved
 * asset library has no licensed city photography, and a labelled empty frame
 * is worse than a well-set row of type.
 */
export const FIGMA_CITIES = [
  { name: "Dallas", county: "Dallas County", href: "/homes" },
  { name: "Fort Worth", county: "Tarrant County", href: "/homes" },
  { name: "Arlington", county: "Tarrant County", href: "/homes" },
  { name: "Plano", county: "Collin County", href: "/homes" },
  { name: "Frisco", county: "Collin and Denton counties", href: "/homes" },
  { name: "McKinney", county: "Collin County", href: "/homes" },
  { name: "Irving", county: "Dallas County", href: "/homes" },
  { name: "Garland", county: "Dallas County", href: "/areas/garland" },
] as const

/**
 * Short highlights for the two homepage pathways.
 *
 * Every line describes something Debra *does*, not something a buyer or seller
 * will *get*. That distinction is the publishing standard: no price, timeline,
 * approval, saving or outcome is promised anywhere on this site, so a pathway
 * panel earns its benefit list by naming the work rather than the result.
 */
export const FIGMA_PATHWAY_HIGHLIGHTS = {
  buy: [
    "A search built around your real monthly number",
    "Offers explained in full before you sign one",
    "Inspection and closing kept on schedule",
  ],
  sell: [
    "Pricing discussed with the evidence in front of you",
    "A preparation plan you approve, not one you are handed",
    "Negotiation handled as your advocate",
  ],
} as const

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

/**
 * Compliance row. Texas real-estate practice requires the two TREC notices to
 * be reachable from the site, so they stay — but they belong in the small
 * bottom row, not in a column competing with primary navigation.
 *
 * `external` entries are TREC-hosted documents and render as plain anchors.
 */
export const FIGMA_FOOTER_LEGAL = [
  {
    label: "TREC Information About Brokerage Services",
    href: "https://www.trec.texas.gov/information-about-brokerage-services-form",
    external: true,
  },
  {
    label: "TREC Consumer Protection Notice",
    href: "https://www.trec.texas.gov/forms/consumer-protection-notice",
    external: true,
  },
  { label: "Privacy", href: "/privacy", external: false },
  { label: "Terms", href: "/terms", external: false },
  { label: "Accessibility", href: "/accessibility", external: false },
  { label: "Fair Housing", href: "/fair-housing", external: false },
] as const
