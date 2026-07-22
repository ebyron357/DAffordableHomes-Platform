export type NavItem = {
  label: string
  href: string
  description?: string
}

/** Primary navigation per PRODUCT_REQUIREMENTS.md §5. */
export const PRIMARY_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Buy a Home", href: "/homes", description: "Search and prepare to buy" },
  { label: "Homebuyer Resources", href: "/resources", description: "Guides and practical resources" },
  { label: "Calculators", href: "/resources/calculators", description: "Plan with real numbers" },
  { label: "Neighborhoods", href: "/neighborhoods", description: "Explore local communities" },
  { label: "Events", href: "/events", description: "Workshops and community events" },
  { label: "About Debra", href: "/about", description: "Meet your homeownership advisor" },
]

export const LEARN_LINKS: NavItem[] = [
  { label: "First-Time Buyers", href: "/first-time-buyers" },
  { label: "NACA Education", href: "/naca" },
  { label: "Resource Library", href: "/resources" },
  { label: "Blog & Articles", href: "/blog" },
  { label: "FAQ", href: "/faq" },
]

export const EXPLORE_LINKS: NavItem[] = [
  { label: "Neighborhood Guides", href: "/neighborhoods" },
  { label: "Market Reports", href: "/market-reports" },
  { label: "Home Search", href: "/homes" },
]

export const CONNECT_LINKS: NavItem[] = [
  { label: "Contact Debra", href: "/contact" },
  { label: "Book a Consultation", href: "/book" },
  { label: "Events & Workshops", href: "/events" },
  { label: "Testimonials", href: "/testimonials" },
]

/** Compliance and policy links per PRODUCT_REQUIREMENTS.md §5 core routes. */
export const LEGAL_NAV: NavItem[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Accessibility Statement", href: "/accessibility" },
  { label: "Fair Housing", href: "/fair-housing" },
  { label: "Equal Housing Opportunity", href: "/equal-housing-opportunity" },
]
