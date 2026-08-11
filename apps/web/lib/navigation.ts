export type NavItem = {
  label: string
  href: string
  description?: string
}

/** Primary navigation per PRODUCT_REQUIREMENTS.md §5. */
export const PRIMARY_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Calculators", href: "/calculators", description: "Plan with real numbers" },
  { label: "Neighborhoods", href: "/neighborhoods", description: "Explore Garland and DFW areas" },
  { label: "Programs", href: "/programs", description: "NACA and Homes for Heroes guidance" },
  { label: "Blogs", href: "/blog", description: "Read the field guides" },
  { label: "About Debra", href: "/about", description: "Meet your homeownership advisor" },
]

export const LEARN_LINKS: NavItem[] = [
  { label: "First-Time Buyers", href: "/first-time-buyers" },
  { label: "Homebuyer Programs", href: "/programs" },
  { label: "NACA Homebuyer Help", href: "/programs/naca" },
  { label: "Homes for Heroes", href: "/programs/homes-for-heroes" },
  { label: "Resource Library", href: "/resources" },
  { label: "Blog & Articles", href: "/blog" },
  { label: "FAQ", href: "/faq" },
]

export const EXPLORE_LINKS: NavItem[] = [
  { label: "Garland Area Guide", href: "/areas/garland" },
  { label: "North Texas Area Guides", href: "/areas" },
  { label: "Neighborhood Guides", href: "/neighborhoods" },
  { label: "Market Reports", href: "/market-reports" },
  { label: "Home Search", href: "/homes" },
]

export const CONNECT_LINKS: NavItem[] = [
  { label: "Contact Debra", href: "/contact" },
  { label: "Book a Consultation", href: "/consultation" },
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
