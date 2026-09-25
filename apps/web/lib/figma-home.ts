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
    body: "Representation from the first search criteria to the closing table, with each step in a Dallas–Fort Worth purchase explained before you commit to it.",
    href: "/first-time-buyers",
  },
  {
    title: "Sell a Home",
    body: "Pricing built from recent comparable sales in your North Texas neighborhood, a preparation plan you approve, and negotiation handled as your advocate.",
    href: "/contact",
  },
  {
    title: "Search Homes",
    body: "Search by city across DFW, from Garland and Dallas to Plano and Frisco, and ask Debra what is actually on the market before you tour.",
    href: "/homes",
  },
  {
    title: "New Construction",
    body: "Builder contracts, option selections and construction timelines in the North Texas growth corridors, negotiated with someone on your side of the table.",
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

/**
 * Buyer and seller strategy points. Each names work Debra does in a DFW
 * transaction, in plain language; none promises a price, a saving or an
 * outcome (PUBLISHING_STANDARD.md).
 */
export const FIGMA_BUYER_POINTS = [
  "Your monthly number tested with the payment and affordability calculators before you tour a single home.",
  "Neighborhood fit across Dallas, Garland, Plano, Frisco, Fort Worth and the cities between, matched to your commute and routine.",
  "Offers, inspections, repair requests and builder contracts explained in full and negotiated as your advocate.",
] as const

export const FIGMA_SELLER_POINTS = [
  "Pricing built from recent comparable sales in your neighborhood, with the evidence in front of you.",
  "A preparation plan aimed at what North Texas buyers actually pay for, not a renovation for its own sake.",
  "Inspection requests, the appraisal and the closing timeline negotiated so you keep the equity you have built.",
] as const

export const FIGMA_KNOWLEDGE = [
  {
    title: "First-Time Buyer Guide",
    body: "How a first purchase works in Dallas–Fort Worth, from the first budget conversation to the day you get keys.",
    href: "/first-time-buyers",
  },
  {
    title: "Planning Calculators",
    body: "Test a monthly payment, cash to close, a down payment, and rent versus buy at North Texas prices.",
    href: "/calculators",
  },
  {
    title: "Financing Basics",
    body: "Plain-language notes on loan types, down-payment assistance, and what lenders look at before they say yes.",
    href: "/resources",
  },
  {
    title: "Readiness Check",
    body: "A short assessment that suggests where to start, followed by a stage-by-stage plan you can work through.",
    href: "/start",
  },
  {
    title: "NACA Information",
    body: "What the NACA program is, how its timeline differs from a conventional purchase, and where to verify the requirements.",
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
