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
  /** One sentence under the support heading: what Debra is for, in plain terms. */
  supportLede?: string
  supportItems: Array<{ title: string; description: string }>
  /**
   * What to do next at each stage of the program, shown under "Start with your
   * actual program stage". Each step names who handles it.
   */
  stageGuide?: Array<{ stage: string; next: string }>
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
    supportLede:
      "Buying, selling or both, Debra handles the real-estate side — and helps you keep it separate from anything a benefit program decides.",
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
          "Each program sets its own list of eligible professions and its own rules, and they can change. If you serve in the military, are a veteran, or work in education, healthcare, fire, EMS or law enforcement, it's worth checking two places: the national Homes for Heroes program, and TSAHC's Homes for Texas Heroes home loan program for eligible Texas professionals. Debra can help you work out what to ask each one, and she handles the real-estate side either way.",
      },
      {
        question: "Is Homes for Heroes the same as Homes for Texas Heroes?",
        answer:
          "No. Homes for Texas Heroes is a separate home loan program from the Texas State Affordable Housing Corporation (TSAHC) for eligible Texas professionals in certain public-service roles, offered through participating lenders. Homes for Heroes is a different, national program. Confirm the terms of each directly with the organization that runs it; Debra can help with the real-estate side of either.",
      },
      {
        question: "How does Debra assist Homes for Heroes clients?",
        answer:
          "Debra can provide buyer representation, seller representation, or coordinated buy-and-sell planning. Any third-party savings, rebates, eligibility decisions, or provider status must be separately verified.",
      },
      {
        question: "Can Debra help a veteran or teacher buy in Garland?",
        answer:
          "Debra can talk with you about buying in Garland. Tell her the area, your timing and what you're looking for, and she'll confirm whether she can represent you for that specific purchase.",
      },
      {
        question: "I'm on military orders to Dallas–Fort Worth. Can Debra help?",
        answer:
          "Military moves often come with short timelines and searching from a distance. Tell Debra your report date and how much of the search you can do in person, and she'll plan around it. If you'll use a VA home loan, a VA-approved lender confirms your entitlement and terms; Debra handles the real-estate side.",
      },
      {
        question: "Does this page guarantee a rebate or savings amount?",
        answer:
          "No. The page does not promise eligibility, savings, rebates, or transaction outcomes. Obtain current official program terms before making a financial decision.",
      },
    ],
    leadSource: "Homes for Heroes Landing Page",
    disclaimer:
      "Homes for Heroes is a third-party program. D'Affordable Homes does not claim affiliation with it, approved-provider status, the authority to decide eligibility, or any savings, rebate or endorsement. Confirm current terms with the program directly.",
    primaryCta: "Request hero-focused real-estate guidance",
  },
}

export const PROGRAM_CARDS = [PROGRAMS.naca, PROGRAMS["homes-for-heroes"]] as const
