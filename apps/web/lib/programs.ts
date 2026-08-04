export type ProgramSlug = "fha" | "va" | "usda" | "conventional" | "naca" | "homes-for-heroes"

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
  fha: {
    slug: "fha", name: "FHA Loan Guidance", eyebrow: "Lower-down-payment education",
    title: "Understand the FHA homebuying path in Dallas–Fort Worth",
    summary: "Learn how FHA financing can fit into a North Texas home search, which costs and property conditions deserve attention, and what a HUD-approved lender must verify before you rely on any loan terms.",
    audience: ["First-time buyers comparing financing paths", "Buyers planning for a lower down payment", "Buyers rebuilding financial readiness", "DFW buyers who want a step-by-step property search"],
    supportTitle: "How Debra supports an FHA-financed search",
    supportItems: [
      { title: "Search planning", description: "Translate the lender-approved range into a sustainable search plan that includes taxes, insurance, maintenance, and possible mortgage insurance." },
      { title: "Property condition", description: "Notice visible condition questions early and coordinate professional inspections and lender-required appraisal steps." },
      { title: "Offer preparation", description: "Build an offer around the property, market context, financing terms, and deadlines without promising acceptance or approval." },
      { title: "Transaction coordination", description: "Keep lender, appraisal, inspection, title, and closing milestones visible from contract to keys." },
    ],
    process: [
      { title: "Speak with an FHA-approved lender", description: "Ask for current eligibility, credit, income, debt, mortgage-insurance, property, and cash-to-close requirements." },
      { title: "Set the full monthly budget", description: "Plan for principal, interest, taxes, insurance, mortgage insurance, utilities, maintenance, and association dues when applicable." },
      { title: "Search with condition in mind", description: "Compare homes against your needs while allowing the lender and appraiser to make official property decisions." },
      { title: "Complete due diligence", description: "Use qualified inspectors and other professionals, meet deadlines, and verify final figures before closing." },
    ],
    faqs: [
      { question: "Is an FHA loan only for first-time buyers?", answer: "No. FHA-insured loans are not limited to first-time buyers, but eligibility and current rules must be confirmed with an FHA-approved lender or HUD." },
      { question: "How much down payment does an FHA loan require?", answer: "The required amount depends on current FHA rules and the borrower’s verified circumstances. Ask an FHA-approved lender for a written estimate that includes mortgage insurance and cash-to-close assumptions." },
      { question: "Can every house qualify for FHA financing?", answer: "No property should be assumed eligible. The lender and appraiser determine whether the home and transaction satisfy current requirements." },
      { question: "Can Debra approve an FHA loan?", answer: "No. Debra provides real-estate guidance and representation. A qualified lender controls loan eligibility, underwriting, rates, and approval." },
    ],
    leadSource: "FHA Program Page", disclaimer: "This is general real-estate education, not lending or financial advice. FHA and the lender control current program rules, eligibility, appraisal requirements, loan terms, and approval.", primaryCta: "Plan an FHA home search",
  },
  va: {
    slug: "va", name: "VA Home Loan Guidance", eyebrow: "Military and veteran homebuyer education",
    title: "Build a clear VA homebuying plan for North Texas",
    summary: "Military members, veterans, and eligible surviving spouses can learn how the VA loan process connects to a DFW home search while the VA and approved lender control eligibility, entitlement, appraisal, and financing decisions.",
    audience: ["Eligible veterans", "Active-duty service members", "National Guard and Reserve members exploring eligibility", "Eligible surviving spouses"],
    supportTitle: "Real-estate support for a VA-financed move",
    supportItems: [
      { title: "Timeline planning", description: "Map duty, lease, sale, relocation, and closing dates before the search becomes urgent." },
      { title: "Property search", description: "Evaluate homes against verified financing, condition, location, and long-term ownership priorities." },
      { title: "Offer strategy", description: "Coordinate financing details and deadlines in a competitive offer without misrepresenting approval or appraisal outcomes." },
      { title: "Inspection and closing", description: "Keep the independent inspection, VA appraisal, lender conditions, title work, and final walkthrough distinct and organized." },
    ],
    process: [
      { title: "Confirm eligibility and entitlement", description: "Use VA and a VA-approved lender to confirm the Certificate of Eligibility, available entitlement, and current rules." },
      { title: "Review the complete cost", description: "Ask about the funding fee, exemptions, taxes, insurance, closing costs, seller concessions, and monthly payment." },
      { title: "Define the DFW search", description: "Set neutral location, property, condition, travel, and budget priorities that work for your household." },
      { title: "Coordinate the transaction", description: "Complete inspections, appraisal, lender conditions, title work, walkthrough, and closing with the appropriate professionals." },
    ],
    faqs: [
      { question: "Does a VA loan always require no down payment?", answer: "Some eligible borrowers may have a zero-down option, but entitlement, price, appraisal, lender rules, and the complete transaction determine the actual cash required." },
      { question: "Is the VA appraisal the same as a home inspection?", answer: "No. The appraisal supports the lender and VA process. An independent home inspection serves a different purpose and should be discussed separately." },
      { question: "Can VA financing be used in Dallas–Fort Worth?", answer: "Eligible buyers may use VA financing for qualifying transactions in the region. The lender and VA must verify the borrower, property, appraisal, and current program requirements." },
      { question: "Does Debra determine VA eligibility?", answer: "No. VA and the lender determine eligibility and financing. Debra handles the real-estate search and transaction within those verified boundaries." },
    ],
    leadSource: "VA Program Page", disclaimer: "D'Affordable Homes is not the Department of Veterans Affairs or a lender. Verify eligibility, entitlement, fees, appraisal requirements, and loan terms with VA and an approved lender.", primaryCta: "Plan a VA home search",
  },
  usda: {
    slug: "usda", name: "USDA Home Loan Guidance", eyebrow: "Eligible-area homebuyer education",
    title: "Explore a USDA-backed homebuying path around North Texas",
    summary: "Understand how location eligibility, household requirements, lender underwriting, property condition, and practical commute or service needs shape a USDA-financed home search outside the DFW urban core.",
    audience: ["Buyers open to eligible suburban or rural locations", "Households comparing low-down-payment options", "Buyers willing to verify location before touring", "North Texas buyers balancing distance and ownership costs"],
    supportTitle: "Turn program boundaries into a workable search",
    supportItems: [
      { title: "Location screening", description: "Use official USDA tools and lender guidance before treating a city, neighborhood, or property as eligible." },
      { title: "Lifestyle planning", description: "Compare travel, utilities, maintenance, lot size, services, and daily routines alongside the housing payment." },
      { title: "Property evaluation", description: "Identify condition and utility questions for qualified inspectors, the lender, appraiser, and other specialists." },
      { title: "Contract coordination", description: "Build verification time and financing deadlines into the transaction without guaranteeing eligibility." },
    ],
    process: [
      { title: "Check official location eligibility", description: "Use the current USDA eligibility map and an approved lender; city names and ZIP codes alone are not enough." },
      { title: "Confirm household and loan rules", description: "Ask the lender to verify income, occupancy, credit, debt, property, and current program requirements." },
      { title: "Compare the complete ownership fit", description: "Review payment, taxes, insurance, utilities, maintenance, transportation, and property systems." },
      { title: "Verify before closing", description: "Allow the lender and USDA process to confirm eligibility while inspections and title work protect the broader transaction." },
    ],
    faqs: [
      { question: "Is every home outside Dallas eligible for USDA financing?", answer: "No. Eligibility can vary by exact address and program rules. Verify the property through official USDA tools and a qualified lender." },
      { question: "Does USDA financing have income limits?", answer: "USDA programs use current household and program requirements. A lender or USDA representative must evaluate the applicable limit and your circumstances." },
      { question: "Is USDA only for farms?", answer: "No. USDA housing programs may apply to eligible residential properties, but the borrower, location, property, and transaction must meet current requirements." },
      { question: "Can Debra tell me whether I qualify?", answer: "Debra can help plan the real-estate search. USDA and the lender determine eligibility and approval." },
    ],
    leadSource: "USDA Program Page", disclaimer: "USDA and participating lenders control location, household, property, and loan eligibility. This page provides general real-estate education and does not promise approval or zero cash-to-close.", primaryCta: "Plan a USDA home search",
  },
  conventional: {
    slug: "conventional", name: "Conventional Loan Guidance", eyebrow: "Flexible financing education",
    title: "Compare a conventional homebuying path in Dallas–Fort Worth",
    summary: "Learn how down payment, mortgage insurance, credit, reserves, property type, appraisal, and seller terms can affect a conventional-financed North Texas transaction.",
    audience: ["First-time or repeat buyers", "Buyers comparing down-payment choices", "Buyers considering varied property types", "Buyers preparing a competitive DFW offer"],
    supportTitle: "Connect conventional financing to the transaction",
    supportItems: [
      { title: "Scenario comparison", description: "Compare lender-written estimates across down payment, rate, mortgage insurance, cash-to-close, and monthly payment." },
      { title: "Search alignment", description: "Use the verified budget and property criteria to focus the search without treating a preapproval as a spending target." },
      { title: "Offer terms", description: "Balance price, financing, appraisal, inspection, closing date, and other terms with the risks explained clearly." },
      { title: "Closing preparation", description: "Track lender conditions, title work, insurance, final figures, walkthrough, and verified funds-to-close." },
    ],
    process: [
      { title: "Compare qualified lenders", description: "Request written scenarios using the same price, down payment, term, and estimated ownership costs." },
      { title: "Choose a sustainable target", description: "Set a search range below the maximum when needed to protect savings and monthly flexibility." },
      { title: "Evaluate homes and terms", description: "Compare condition, resale considerations, association documents, appraisal risk, and contract terms." },
      { title: "Verify the final transaction", description: "Review the lender’s official disclosures and complete inspection, insurance, title, and closing steps." },
    ],
    faqs: [
      { question: "Do conventional loans always require 20 percent down?", answer: "No. Some programs permit lower down payments, often with mortgage insurance or other requirements. A lender must confirm available options and total costs." },
      { question: "When can private mortgage insurance be removed?", answer: "Rules depend on the loan and applicable law. Ask the lender or servicer for the exact cancellation and termination requirements before relying on future removal." },
      { question: "Is conventional financing better than FHA or VA?", answer: "There is no universal best choice. Compare eligibility, total monthly cost, cash-to-close, mortgage insurance, property rules, and long-term plans with qualified professionals." },
      { question: "Can Debra quote my rate?", answer: "No. Rates and loan terms come from qualified lenders. Debra can help you understand how verified financing affects the real-estate transaction." },
    ],
    leadSource: "Conventional Program Page", disclaimer: "Loan options, rates, mortgage insurance, appraisal requirements, and approval are controlled by qualified lenders and current program rules. This page is general real-estate education.", primaryCta: "Plan a conventional home search",
  },
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

export const PROGRAM_CARDS = [PROGRAMS.fha, PROGRAMS.va, PROGRAMS.usda, PROGRAMS.conventional, PROGRAMS.naca, PROGRAMS["homes-for-heroes"]] as const
