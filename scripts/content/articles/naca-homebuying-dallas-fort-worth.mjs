/**
 * Migration source for /blog/naca-homebuying-dallas-fort-worth.
 *
 * Copy is carried over verbatim from the pre-migration route implementation
 * (apps/web/app/blog/naca-homebuying-dallas-fort-worth/page.tsx at
 * 56b381f700edd68f3504b073a7a38b0912db13b8). Nothing is shortened, rewritten,
 * or invented; only the container structure changed from hardcoded JSX to
 * reusable editorial blocks.
 */
export function build({ key, prose, block }) {
  const { p, h2, h3, ul, ol } = prose

  return {
    slug: "naca-homebuying-dallas-fort-worth",
    title: "Using NACA to Buy a Home in Dallas–Fort Worth",
    eyebrow: "NACA homebuyer field guide",
    excerpt:
      "Understand workshops, counseling, qualification, outside-agent procedures, property review, and Debra's role in the real-estate transaction.",
    seoTitle: "Using NACA to Buy a Home in Dallas–Fort Worth",
    seoDescription:
      "Learn how the NACA homebuying process works, when to begin a DFW home search, and how Debra Allen supports the real-estate side of a purchase.",
    readingTime: "10 minute read",
    publishedAt: "2026-08-05",
    reviewedAt: "2026-08-05",
    status: "published",
    categorySlug: "naca-field-guide",
    authorSlug: "debra-allen",
    programSlugs: ["naca"],
    areaSlugs: ["garland"],
    featuredImageLayout: "photographic",
    featuredImage: {
      src: "/images/planning-table.png",
      alt: "An open notebook, reading glasses, a pen, and a cup of coffee on a wooden table beside a potted plant",
      caption: "Preparation — documents, budgeting, and counseling — comes before the property search.",
      focalPoint: "50% 62%",
    },
    body: [
      block.quickAnswer("The quick answer", [
        p(
          "You do not need to be NACA-qualified to begin learning about the program. NACA says its free Homebuyer Workshop is open to everyone. Serious house hunting, however, should be coordinated with your official NACA status, documented affordability range, current requirements, and the professionals responsible for the transaction.",
        ),
        p(
          "**NACA controls qualification, financing, and program approvals. Your real-estate agent helps with the search, property evaluation, offer, inspection, and transaction coordination.**",
        ),
      ]),

      block.richText([
        h2("NACA is a process—not simply a loan application"),
        p(
          "People often first hear about NACA because the organization promotes a mortgage with no down payment, no traditional closing costs, no fees, and no mortgage insurance for qualified members under its current terms. Those headline benefits are only one part of the program.",
        ),
        p(
          "The purchase path includes education, financial-document preparation, housing counseling, budgeting, qualification, purchase education, a home search, property-specific review, mortgage processing, and closing requirements. Buyers do not all move through those stages at the same speed.",
        ),
        p(
          "One household may already have organized records and stable finances. Another may need time to establish stronger payment habits, reduce debt, document income, or build savings. Preparation is not failure. It is part of building a purchase that can last.",
        ),
      ]),

      block.richText([
        h2("What happens after the Homebuyer Workshop?"),
        p(
          "After the workshop, a prospective buyer generally begins completing the member file and preparing for counseling. NACA may request current financial records, including income documents, tax records, bank statements, housing-payment history, debt information, and explanations for unusual transactions.",
        ),
        p(
          "The purpose is broader than collecting paperwork. Counseling examines whether the expected housing payment is sustainable after normal household expenses.",
        ),
        ul([
          "Property taxes and homeowners insurance",
          "Association dues when applicable",
          "Utilities, transportation, and childcare",
          "Maintenance and unexpected repairs",
          "Existing debts and emergency savings",
        ]),
        p("A payment that leaves no room for an air-conditioning repair is not a safe ownership plan in North Texas."),
      ]),

      block.richText([
        h2("What NACA qualification does—and does not—mean"),
        p(
          "NACA qualification is a major milestone that establishes an approved affordability position under the organization's current process. It is not final permission to close on any property a buyer chooses.",
        ),
        p(
          "The selected home, contract, property condition, appraisal, inspection, insurance, title work, lender conditions, and mortgage application must still move through the required reviews.",
        ),
        p(
          "A buyer should also avoid treating the maximum qualified amount as a spending target. The better question is whether the payment leaves room for repairs, tax or insurance changes, transportation, savings, and the buyer's actual life.",
        ),
      ]),

      block.richText([
        h2("When should a buyer contact Debra?"),
        p(
          "A prospective buyer can speak with Debra while learning about NACA. Early planning can clarify preferred communities, property needs, commute limits, monthly-cost tolerance, repair expectations, and the desired timeline.",
        ),
        p(
          "An active property search should align with the buyer's official NACA stage. Tell Debra whether you are researching, have attended a workshop, are in counseling, or are already qualified. Clear status information allows the conversation to focus on the next responsible real-estate step.",
        ),
        p("[Explore Debra's NACA home-search guidance](/programs/naca)."),
      ]),

      block.richText([
        h2("Can a NACA buyer use an outside real-estate agent?"),
        p(
          "NACA's current guidance permits members to work with an outside agent. The organization strongly recommends applicable training and has procedures involving agent registration, buyer-representation documentation, and its real-estate portal.",
        ),
        p(
          "Those details should be confirmed before a buyer and agent rely on a particular arrangement. No agent should claim the ability to bypass the program or control an approval reserved for NACA, a lender, an appraiser, or another authorized professional.",
        ),
      ]),

      block.richText([
        h2("How Debra supports the real-estate side"),
        h3("Build a focused North Texas search"),
        p(
          "Dallas–Fort Worth is too large for a useful search built around “something affordable somewhere.” Debra helps define location priorities, commute needs, home type, property age, space, accessibility, association preferences, repair tolerance, and long-term ownership goals.",
        ),
        h3("Evaluate complete ownership cost"),
        p(
          "Two similarly priced homes may carry very different taxes, insurance, dues, utilities, repair needs, and transportation costs. The lower listing price is not automatically the more affordable home.",
        ),
        h3("Prepare a fact-based offer"),
        p(
          "An offer strategy may consider comparable properties, current competition, days on market, condition, seller priorities, inspection needs, contract protections, and program timing. No responsible agent can guarantee acceptance.",
        ),
        h3("Coordinate inspections and deadlines"),
        p(
          "Debra can help organize the contract, earnest-money deadline, inspections, repair discussions, program communication, appraisal access, title work, final walkthrough, and closing preparation. Each professional remains responsible for their own expertise and approvals.",
        ),
      ]),

      block.richText([
        h2("What NACA buyers should know about Dallas–Fort Worth"),
        p(
          "DFW is a region rather than a single housing market. Garland, Mesquite, Richardson, Plano, Rowlett, Rockwall, Wylie, Dallas, and surrounding communities can differ materially in taxes, insurance, housing age, inventory, commute patterns, association dues, and repair risk.",
        ),
        ul([
          "**Property taxes:** the seller's current bill may not match the buyer's future obligation because exemptions and assessed values can change.",
          "**Insurance:** roof age, condition, claims, replacement cost, and insurer rules can alter the payment.",
          "**Associations:** dues are only part of the picture; buyers should review restrictions, transfer fees, and potential assessments.",
          "**Transportation:** tolls, fuel, maintenance, parking, and added childcare time belong in the affordability calculation.",
        ]),
      ]),

      block.richText([
        h2("Can NACA be used to buy in Garland?"),
        p(
          "A qualified buyer may explore Garland as part of a North Texas search, subject to current NACA requirements and the facts of the transaction. No article or agent can promise that a particular Garland home will qualify.",
        ),
        p(
          "The buyer must confirm current qualification, affordability, property condition, appraisal, insurance, contract compliance, mortgage conditions, and property-specific approval. Debra can help evaluate Garland homes and coordinate the real-estate process while the responsible organizations make their own decisions.",
        ),
        p("[Use the Garland guide to prepare a local search](/areas/garland)."),
      ]),

      block.richText([
        h2("Seven mistakes that can disrupt the purchase"),
        ol([
          "**Touring seriously before understanding official status.** Research can begin early; an active purchase plan should use verified information.",
          "**Spending to the maximum.** Qualification is a ceiling, not a command.",
          "**Opening new credit.** A vehicle, card, furniture account, personal loan, or co-signed debt can change the file.",
          "**Moving money without records.** Large deposits and transfers may require documentation.",
          "**Letting documents expire.** Income, asset, debt, and payment records must remain current.",
          "**Ignoring condition.** A low price can conceal expensive roof, foundation, drainage, system, or insurance problems.",
          "**Missing deadlines.** A real-estate contract creates time-sensitive obligations that can place the transaction at risk.",
        ]),
      ]),

      block.checklist({
        heading: "A practical pre-search checklist",
        items: [
          { label: "Confirm your official NACA status and current affordability range." },
          { label: "Choose a personal payment below the maximum when needed." },
          { label: "Keep requested financial records current." },
          { label: "Confirm the current outside-agent process." },
          { label: "Understand property-review and contract-submission steps." },
          { label: "Define preferred communities, commute limits, and property needs." },
          { label: "Set a repair tolerance and preserve cash reserves." },
          { label: "Know which professional controls each approval." },
        ],
      }),

      block.programCta({
        program: "naca",
        heading: "Ready to understand the next real-estate step?",
        body:
          "You do not need to pretend you understand the entire process. You need an accurate picture of your current stage and the next responsible action.",
        href: "/programs/naca",
        label: "Start with NACA home-search guidance from Debra Allen",
      }),
    ],
    faqs: [
      {
        question: "Do I need to be NACA-qualified to attend a workshop?",
        answer:
          "No. NACA says its free Homebuyer Workshop is open to everyone and is the first step for people who want to learn about the purchase process.",
      },
      {
        question: "Can I start looking at homes before I am qualified?",
        answer:
          "You can research communities and learn about the market, but an active purchase search should be coordinated with your official NACA status, affordability range, and current instructions.",
      },
      {
        question: "Does Debra Allen approve NACA buyers?",
        answer:
          "No. NACA controls qualification, mortgage requirements, program rules, and official approvals. Debra provides independent real-estate guidance.",
      },
      {
        question: "Can an outside real-estate agent represent a NACA buyer?",
        answer:
          "NACA permits outside agents under its current procedures. Registration, training, buyer-representation, and portal requirements should be confirmed directly with NACA.",
      },
      {
        question: "Can NACA be used for any DFW home?",
        answer:
          "No specific property is automatically approved. The buyer, property, contract, condition, appraisal, insurance, mortgage, and other requirements must satisfy the applicable process.",
      },
    ],
    officialSources: [
      { label: "NACA: Steps to Homeownership", href: "https://www.naca.com/10steps/", publisher: "NACA" },
      { label: "NACA: Home Purchase Program", href: "https://www.naca.com/purchase/", publisher: "NACA" },
      { label: "NACA: Real Estate Agent Guidance", href: "https://www.naca.com/real-estate/", publisher: "NACA" },
    ],
    disclaimer: [
      p(
        "D'Affordable Homes and Debra Allen are independent from NACA. NACA controls its workshops, counseling, qualification, mortgage terms, property requirements, lender processes, and official approvals. Confirm current program details directly with NACA.",
      ),
    ],
    relatedLinks: [
      {
        label: "NACA home-search guidance",
        href: "/programs/naca",
        description: "See how Debra supports the search, offer, inspection, and closing side.",
      },
      {
        label: "Garland homebuyer guide",
        href: "/areas/garland",
        description: "Explore practical questions for a Garland and North Texas search.",
      },
      {
        label: "Affordability calculator",
        href: "/calculators/affordability",
        description: "Test a planning range before comparing properties.",
      },
      {
        label: "Mortgage-payment calculator",
        href: "/calculators/mortgage-payment",
        description: "Compare principal, interest, tax, and insurance assumptions.",
      },
    ],
    relatedArticleSlugs: ["how-to-buy-home-garland-tx", "homes-for-heroes-north-texas"],
    key,
  }
}
