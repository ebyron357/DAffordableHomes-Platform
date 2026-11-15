export type ProgramSlug = "naca"

export type ProgramFaq = {
  question: string
  answer: string
}

export type ProgramDefinition = {
  slug: ProgramSlug
  name: string
  eyebrow: string
  title: string
  summary: string
  audience: string[]
  supportTitle: string
  /** One sentence under the support heading: what Debra is for, in plain terms. */
  supportLede?: string
  supportItems: Array<{ title: string; description: string }>
  /**
   * What to do next at each stage of the program, shown under "Start with your
   * actual program stage". Each step names who handles it.
   */
  stageGuide?: Array<{ stage: string; next: string }>
  /** The long-form guide on the same subject; the guide already links back here. */
  relatedGuide?: { label: string; href: string }
  process: Array<{ title: string; description: string }>
  faqs: ProgramFaq[]
  leadSource: string
  disclaimer: string
  primaryCta: string
}

export const PROGRAMS: Record<ProgramSlug, ProgramDefinition> = {
  naca: {
    slug: "naca",
    name: "NACA Homebuyer Help",
    eyebrow: "Independent program guidance",
    title: "Real-estate guidance for Dallas–Fort Worth buyers using NACA",
    summary:
      "Debra helps buyers translate an approved homebuying path into a practical search, offer, inspection, and closing plan. Program eligibility, qualification, mortgage terms, and official requirements remain controlled by NACA.",
    audience: [
      "Buyers considering the NACA homebuying program",
      "Buyers who have attended a NACA workshop",
      "NACA-qualified buyers preparing to search for a home",
      "First-time buyers who need a clearer real-estate process",
    ],
    supportTitle: "How Debra can support your home search",
    relatedGuide: { label: "Read the full guide: Using NACA to buy a home in Dallas–Fort Worth", href: "/blog/naca-homebuying-dallas-fort-worth" },
    supportLede:
      "NACA guides you through counseling and qualification. Debra is on your side for the house itself: which homes fit the purchase NACA approves, how to make an offer, and keeping every deadline on track.",
    stageGuide: [
      {
        stage: "Researching NACA",
        next: "Start with NACA's free Homebuyer Workshop; sign-up is on naca.com. You're welcome to talk with Debra now about what the home-search side will look like.",
      },
      {
        stage: "Workshop attended, or working toward qualification",
        next: "Keep working with your NACA counselor. In the meantime, Debra can help you decide where and what to search for, so you're ready when NACA says go.",
      },
      {
        stage: "NACA-qualified",
        next: "This is when Debra's role starts in earnest: the search, tours, offer, inspection and closing.",
      },
    ],
    supportItems: [
      {
        title: "Search preparation",
        description:
          "Clarify location priorities, housing needs, realistic tradeoffs, and the documents your real-estate search may require.",
      },
      {
        title: "Property evaluation",
        description:
          "Review homes through the lens of condition, affordability, program instructions, and your long-term ownership goals.",
      },
      {
        title: "Offer and negotiation guidance",
        description:
          "Prepare a fact-based offer strategy and coordinate required program or lender communication without promising acceptance.",
      },
      {
        title: "Inspection and closing coordination",
        description:
          "Stay organized through inspections, repair decisions, deadlines, final walkthrough, and closing preparation.",
      },
    ],
    process: [
      {
        title: "Confirm your official program status",
        description:
          "Use NACA's official channels to verify current eligibility, qualification status, required documents, and program rules.",
      },
      {
        title: "Define your North Texas search",
        description:
          "Discuss preferred communities, home type, timing, transportation needs, and the total monthly cost you are prepared to carry.",
      },
      {
        title: "Tour and evaluate homes",
        description:
          "Compare attainable homes carefully and confirm that each property can proceed under current program and lender requirements.",
      },
      {
        title: "Offer, inspect, and close",
        description:
          "Coordinate the real-estate side of the transaction while NACA and other licensed professionals control their respective approvals and requirements.",
      },
    ],
    faqs: [
      {
        question: "How does the NACA program work?",
        answer:
          "NACA (Neighborhood Assistance Corporation of America) is a nonprofit housing counseling organization. NACA says its free Homebuyer Workshop is open to everyone and is the first step. After the workshop, buyers prepare their financial documents and work through counseling, which looks at whether the expected payment is sustainable, before NACA qualifies them to search for a home. NACA controls every step and requirement; Debra's role is the real-estate side once you are ready to search.",
      },
      {
        question: "Where can I find a NACA workshop near Dallas?",
        answer:
          "NACA lists its upcoming Homebuyer Workshops, including Dallas-area sessions and its larger Achieve the Dream events, on naca.com, where you can sign up. Check there for current dates and locations.",
      },
      {
        question: "How can a real-estate agent help a NACA buyer in Dallas–Fort Worth?",
        answer:
          "A real-estate agent can help define the search, identify and evaluate homes, prepare offers, coordinate inspections, and manage transaction deadlines. NACA controls program qualification, financing terms, and official requirements.",
      },
      {
        question: "Can I use NACA to buy a home in Garland, Texas?",
        answer:
          "That depends on current NACA rules, your qualification, the property, and other transaction requirements. Confirm program availability and property eligibility directly with NACA before relying on a specific home or location.",
      },
      {
        question: "What types of homes can NACA buyers consider in North Texas?",
        answer:
          "Property options depend on current program guidance, condition requirements, affordability, and your approved search criteria. Debra can help evaluate homes, but official eligibility must be confirmed through NACA and the appropriate professionals.",
      },
      {
        question: "When should I contact Debra?",
        answer:
          "You can contact Debra while learning about the process or after qualification. Sharing your current NACA stage helps her identify the most useful next real-estate step.",
      },
    ],
    leadSource: "NACA Landing Page",
    disclaimer:
      "D'Affordable Homes and Debra Allen are independent from NACA. This page does not represent, operate, control, or guarantee the NACA program. Confirm current rules, eligibility, qualification, and financing terms with NACA directly.",
    primaryCta: "Request NACA home-search guidance",
  },
}

export const PROGRAM_CARDS = [PROGRAMS.naca] as const
