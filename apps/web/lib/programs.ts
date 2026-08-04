export type ProgramSlug = "naca" | "homes-for-heroes"

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
  supportItems: Array<{ title: string; description: string }>
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
  "homes-for-heroes": {
    slug: "homes-for-heroes",
    name: "Homes for Heroes Guidance",
    eyebrow: "Support for community heroes",
    title: "Buying and selling guidance for North Texas community heroes",
    summary:
      "Debra provides a clear real-estate process for military members, veterans, teachers, healthcare professionals, firefighters, EMS professionals, and law-enforcement professionals exploring a move in the Dallas–Fort Worth region.",
    audience: [
      "Active-duty military members and military families",
      "Veterans",
      "Teachers and education professionals",
      "Healthcare professionals",
      "Firefighters and EMS professionals",
      "Law-enforcement professionals",
    ],
    supportTitle: "Real-estate support built around your move",
    supportItems: [
      {
        title: "Buying support",
        description:
          "Clarify your timeline, location priorities, financing questions, home-search plan, offer strategy, and transaction milestones.",
      },
      {
        title: "Selling support",
        description:
          "Prepare the property, establish a fact-based launch plan, evaluate offers, coordinate deadlines, and plan the transition to your next home.",
      },
      {
        title: "Buy-and-sell coordination",
        description:
          "Map the dependencies between two transactions so timing, housing, financing, and contingency decisions are visible early.",
      },
      {
        title: "Program clarification",
        description:
          "Separate Debra's real-estate services from any third-party benefit, eligibility, savings, or rebate process that requires official confirmation.",
      },
    ],
    process: [
      {
        title: "Identify your role and goal",
        description:
          "Share your service category, whether you are buying, selling, or both, and the outcome you are trying to achieve.",
      },
      {
        title: "Confirm third-party program details",
        description:
          "Verify eligibility, enrollment, savings, rebate, or provider requirements directly with the official program before relying on them.",
      },
      {
        title: "Build the real-estate plan",
        description:
          "Define location, timing, property, preparation, financing, and transaction priorities for the Dallas–Fort Worth market.",
      },
      {
        title: "Move through the transaction",
        description:
          "Use clear milestones for search or listing preparation, offers, inspections, negotiations, closing, and transition planning.",
      },
    ],
    faqs: [
      {
        question: "Who may qualify for Homes for Heroes?",
        answer:
          "Eligibility and benefit rules are set by Homes for Heroes and may change. Confirm your profession, service category, enrollment, and current program terms directly with the official program.",
      },
      {
        question: "How does Debra assist Homes for Heroes clients?",
        answer:
          "Debra can provide buyer representation, seller representation, or coordinated buy-and-sell planning. Any third-party savings, rebates, eligibility decisions, or provider status must be separately verified.",
      },
      {
        question: "Can Debra help a veteran or teacher buy in Garland?",
        answer:
          "Debra can discuss your goals and confirm whether representation is available for the specific community and transaction. This site does not publish an unverified blanket service-area promise.",
      },
      {
        question: "Does this page guarantee a rebate or savings amount?",
        answer:
          "No. The page does not promise eligibility, savings, rebates, or transaction outcomes. Obtain current official program terms before making a financial decision.",
      },
    ],
    leadSource: "Homes for Heroes Landing Page",
    disclaimer:
      "Homes for Heroes is a third-party program. D'Affordable Homes does not claim affiliation, approved-provider status, eligibility authority, savings amounts, rebates, or endorsement unless verified documentation is added to the project.",
    primaryCta: "Request hero-focused real-estate guidance",
  },
}

export const PROGRAM_CARDS = [PROGRAMS.naca, PROGRAMS["homes-for-heroes"]] as const
