export type NavItem = {
  label: string
  href: string
  description?: string
}

export const PRIMARY_NAV: NavItem[] = [
  { label: "Buying", href: "/first-time-buyers", description: "Prepare with a clear plan" },
  { label: "Areas", href: "/areas", description: "Garland and DFW guidance" },
  { label: "Resources", href: "/resources", description: "Programs, tools, and articles" },
  { label: "Blog", href: "/blog", description: "Field guides and articles" },
  { label: "About Debra", href: "/about", description: "Meet your REALTOR®" },
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
  { label: "Talk with Debra", href: "/consultation" },
  { label: "Events & Workshops", href: "/events" },
  { label: "Testimonials", href: "/testimonials" },
]

export const LEGAL_NAV: NavItem[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Accessibility Statement", href: "/accessibility" },
  { label: "Fair Housing", href: "/fair-housing" },
  { label: "Equal Housing Opportunity", href: "/equal-housing-opportunity" },
]
