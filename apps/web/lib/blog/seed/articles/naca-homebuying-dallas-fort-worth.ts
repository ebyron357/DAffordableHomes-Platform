/**
 * Migration payload — "Using NACA to Buy a Home in Dallas–Fort Worth".
 *
 * Migrated verbatim from the pre-CMS route
 * `apps/web/app/blog/naca-homebuying-dallas-fort-worth/page.tsx`
 * (main @ 56b381f). Copy, headings, FAQs, sources, disclaimers, internal links,
 * CTAs, reading time and reviewed date are preserved exactly. The URL is
 * unchanged.
 */

import type { Article } from "../../types"
import {
  areaGuideCta,
  calculatorCta,
  checklist,
  comparisonTable,
  complianceDisclaimer,
  consultationCta,
  faqBlock,
  faqs,
  heroImage,
  inlineImage,
  officialSourcesBlock,
  programCta,
  quickAnswer,
  relatedArticlesBlock,
  resetKeys,
  richTextBlock,
  sources,
} from "../builders"
import { h2, h3, ol, p, richText, ul } from "../portable-text"

resetKeys()

const title = "Using NACA to Buy a Home in Dallas–Fort Worth"
const excerpt =
  "Learn how the NACA homebuying process works, when to begin a DFW home search, and how Debra Allen supports the real-estate side of a purchase."

const articleFaqs = faqs([
  [
    "Do I need to be NACA-qualified to attend a workshop?",
    "No. NACA says its free Homebuyer Workshop is open to everyone and is the first step for people who want to learn about the purchase process.",
  ],
  [
    "Can I start looking at homes before I am qualified?",
    "You can research communities and learn about the market, but an active purchase search should be coordinated with your official NACA status, affordability range, and current instructions.",
  ],
  [
    "Does Debra Allen approve NACA buyers?",
    "No. NACA controls qualification, mortgage requirements, program rules, and official approvals. Debra provides independent real-estate guidance.",
  ],
  [
    "Can an outside real-estate agent represent a NACA buyer?",
    "NACA permits outside agents under its current procedures. Registration, training, buyer-representation, and portal requirements should be confirmed directly with NACA.",
  ],
  [
    "Can NACA be used for any DFW home?",
    "No specific property is automatically approved. The buyer, property, contract, condition, appraisal, insurance, mortgage, and other requirements must satisfy the applicable process.",
  ],
])

const articleSources = sources([
  { label: "NACA: Steps to Homeownership", href: "https://www.naca.com/10steps/", publisher: "NACA" },
  { label: "NACA: Home Purchase Program", href: "https://www.naca.com/purchase/", publisher: "NACA" },
  { label: "NACA: Real Estate Agent Guidance", href: "https://www.naca.com/real-estate/", publisher: "NACA" },
])

export const nacaArticle: Article = {
  _id: "article.naca-homebuying-dallas-fort-worth",
  slug: "naca-homebuying-dallas-fort-worth",
  title,
  excerpt,
  eyebrow: "NACA homebuyer field guide",
  seoTitle: title,
  seoDescription: excerpt,
  category: {
    title: "Homebuyer programs",
    slug: "homebuyer-programs",
    description: "How national and local homeownership programs actually work.",
  },
  author: {
    name: "Debra Allen",
    role: "REALTOR®",
    url: "/about",
    bio: "Debra Allen leads D'Affordable Homes, an education-first homeownership platform for first-time buyers and renters preparing for ownership.",
  },
  publishedAt: "2026-08-05",
  reviewedAt: "2026-08-05",
  readingTime: "10 minute read",
  programs: ["naca"],
  areas: ["dallas-fort-worth", "garland"],
  featuredImage: {
    src: "/images/debra-allen-primary-about.webp",
    alt: "Debra Allen smiling in a yellow blazer at a kitchen counter",
    width: 1536,
    height: 1229,
    focalPoint: "48% center",
  },
  socialImage: {
    src: "/images/debra-allen-primary-about.webp",
    alt: "Debra Allen smiling in a yellow blazer at a kitchen counter",
    width: 1536,
    height: 1229,
  },
  faqs: articleFaqs,
  sources: articleSources,
  notice: richText(
    p(
      "D'Affordable Homes and Debra Allen are independent from NACA. NACA controls its workshops, counseling, qualification, mortgage terms, property requirements, lender processes, and official approvals. Confirm current program details directly with NACA.",
    ),
  ),
  relatedLinks: [
    {
      _key: "rel00",
      label: "NACA home-search guidance",
      href: "/programs/naca",
      description: "See how Debra supports the search, offer, inspection, and closing side.",
    },
    {
      _key: "rel01",
      label: "Garland homebuyer guide",
      href: "/areas/garland",
      description: "Explore practical questions for a Garland and North Texas search.",
    },
    {
      _key: "rel02",
      label: "Affordability calculator",
      href: "/calculators/affordability",
      description: "Test a planning range before comparing properties.",
    },
    {
      _key: "rel03",
      label: "Mortgage-payment calculator",
      href: "/calculators/mortgage-payment",
      description: "Compare principal, interest, tax, and insurance assumptions.",
    },
  ],
  relatedArticleSlugs: ["how-to-buy-home-garland-tx", "homes-for-heroes-north-texas"],
  body: [
    heroImage({
      src: "/images/debra-allen-primary-about.webp",
      alt: "Debra Allen smiling in a yellow blazer at a kitchen counter",
      width: 1536,
      height: 1229,
      focalPoint: "48% center",
    }),

    quickAnswer(
      "The quick answer",
      richText(
        p(
          "You do not need to be NACA-qualified to begin learning about the program. NACA says its free Homebuyer Workshop is open to everyone. Serious house hunting, however, should be coordinated with your official NACA status, documented affordability range, current requirements, and the professionals responsible for the transaction.",
        ),
        p(
          "**NACA controls qualification, financing, and program approvals. Your real-estate agent helps with the search, property evaluation, offer, inspection, and transaction coordination.**",
        ),
      ),
    ),

    richTextBlock(
      richText(
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

        h2("What happens after the Homebuyer Workshop?"),
        p(
          "After the workshop, a prospective buyer generally begins completing the member file and preparing for counseling. NACA may request current financial records, including income documents, tax records, bank statements, housing-payment history, debt information, and explanations for unusual transactions.",
        ),
        p(
          "The purpose is broader than collecting paperwork. Counseling examines whether the expected housing payment is sustainable after normal household expenses.",
        ),
        ul(
          "Property taxes and homeowners insurance",
          "Association dues when applicable",
          "Utilities, transportation, and childcare",
          "Maintenance and unexpected repairs",
          "Existing debts and emergency savings",
        ),
        p("A payment that leaves no room for an air-conditioning repair is not a safe ownership plan in North Texas."),

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

        h2("When should a buyer contact Debra?"),
        p(
          "A prospective buyer can speak with Debra while learning about NACA. Early planning can clarify preferred communities, property needs, commute limits, monthly-cost tolerance, repair expectations, and the desired timeline.",
        ),
        p(
          "An active property search should align with the buyer's official NACA stage. Tell Debra whether you are researching, have attended a workshop, are in counseling, or are already qualified. Clear status information allows the conversation to focus on the next responsible real-estate step.",
        ),
        p("[Explore Debra's NACA home-search guidance](/programs/naca)."),

        h2("Can a NACA buyer use an outside real-estate agent?"),
        p(
          "NACA's current guidance permits members to work with an outside agent. The organization strongly recommends applicable training and has procedures involving agent registration, buyer-representation documentation, and its real-estate portal.",
        ),
        p(
          "Those details should be confirmed before a buyer and agent rely on a particular arrangement. No agent should claim the ability to bypass the program or control an approval reserved for NACA, a lender, an appraiser, or another authorized professional.",
        ),
      ),
    ),

    inlineImage(
      {
        src: "/images/planning-table.png",
        alt: "Notebook, calculator, and printed budget worksheets laid out on a planning table",
        width: 1024,
        height: 1024,
        caption: "Counseling looks at whether the expected payment survives an ordinary month, not just an approval letter.",
      },
      "inset",
    ),

    richTextBlock(
      richText(
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

        h2("What NACA buyers should know about Dallas–Fort Worth"),
        p(
          "DFW is a region rather than a single housing market. Garland, Mesquite, Richardson, Plano, Rowlett, Rockwall, Wylie, Dallas, and surrounding communities can differ materially in taxes, insurance, housing age, inventory, commute patterns, association dues, and repair risk.",
        ),
      ),
    ),

    comparisonTable({
      heading: "Cost factors that differ across DFW communities",
      caption:
        "Four cost factors that commonly separate two similarly priced North Texas homes.",
      columns: ["Cost factor", "What can change the payment"],
      rows: [
        [
          "Property taxes",
          "The seller's current bill may not match the buyer's future obligation because exemptions and assessed values can change.",
        ],
        [
          "Insurance",
          "Roof age, condition, claims, replacement cost, and insurer rules can alter the payment.",
        ],
        [
          "Associations",
          "Dues are only part of the picture; buyers should review restrictions, transfer fees, and potential assessments.",
        ],
        [
          "Transportation",
          "Tolls, fuel, maintenance, parking, and added childcare time belong in the affordability calculation.",
        ],
      ],
    }),

    richTextBlock(
      richText(
        h2("Can NACA be used to buy in Garland?"),
        p(
          "A qualified buyer may explore Garland as part of a North Texas search, subject to current NACA requirements and the facts of the transaction. No article or agent can promise that a particular Garland home will qualify.",
        ),
        p(
          "The buyer must confirm current qualification, affordability, property condition, appraisal, insurance, contract compliance, mortgage conditions, and property-specific approval. Debra can help evaluate Garland homes and coordinate the real-estate process while the responsible organizations make their own decisions.",
        ),
        p("[Use the Garland guide to prepare a local search](/areas/garland)."),

        h2("Seven mistakes that can disrupt the purchase"),
        ol(
          "**Touring seriously before understanding official status.** Research can begin early; an active purchase plan should use verified information.",
          "**Spending to the maximum.** Qualification is a ceiling, not a command.",
          "**Opening new credit.** A vehicle, card, furniture account, personal loan, or co-signed debt can change the file.",
          "**Moving money without records.** Large deposits and transfers may require documentation.",
          "**Letting documents expire.** Income, asset, debt, and payment records must remain current.",
          "**Ignoring condition.** A low price can conceal expensive roof, foundation, drainage, system, or insurance problems.",
          "**Missing deadlines.** A real-estate contract creates time-sensitive obligations that can place the transaction at risk.",
        ),
      ),
    ),

    checklist("A practical pre-search checklist", [
      "Confirm your official NACA status and current affordability range.",
      "Choose a personal payment below the maximum when needed.",
      "Keep requested financial records current.",
      "Confirm the current outside-agent process.",
      "Understand property-review and contract-submission steps.",
      "Define preferred communities, commute limits, and property needs.",
      "Set a repair tolerance and preserve cash reserves.",
      "Know which professional controls each approval.",
    ]),

    calculatorCta({
      heading: "Test a planning range before you compare properties",
      description:
        "The affordability calculator is a planning tool, not a mortgage approval or a NACA decision.",
      href: "/calculators/affordability",
      buttonLabel: "Open the affordability calculator",
    }),

    faqBlock("Frequently asked questions", articleFaqs),

    officialSourcesBlock("Official sources and review notes", articleSources),

    complianceDisclaimer(
      "Program boundary",
      richText(
        p(
          "D'Affordable Homes and Debra Allen are independent from NACA. NACA controls its workshops, counseling, qualification, mortgage terms, property requirements, lender processes, and official approvals. Confirm current program details directly with NACA.",
        ),
      ),
    ),

    programCta({
      heading: "Ready to understand the next real-estate step?",
      description:
        "You do not need to pretend you understand the entire process. You need an accurate picture of your current stage and the next responsible action.",
      href: "/programs/naca",
      buttonLabel: "Start with NACA home-search guidance",
    }),

    areaGuideCta({
      heading: "Planning a Garland search?",
      description: "Continue into the focused Garland home-search resource.",
      href: "/areas/garland",
      buttonLabel: "Open the Garland guide",
    }),

    relatedArticlesBlock("Keep reading"),

    consultationCta({
      heading: "Talk through your stage with Debra",
      description:
        "Bring your current NACA status and your questions. The consultation focuses on the next responsible real-estate step.",
      buttonLabel: "Book consultation",
    }),
  ],
}
