/**
 * Migration payload — "How Debra Allen Helps North Texas Heroes Buy or Sell a Home".
 *
 * Migrated verbatim from the pre-CMS route
 * `apps/web/app/blog/homes-for-heroes-north-texas/page.tsx` (main @ 56b381f).
 * Copy, headings, FAQs, sources, disclaimers, internal links, CTAs, reading
 * time and reviewed date are preserved exactly. The URL is unchanged.
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

const title = "How Debra Allen Helps North Texas Heroes Buy or Sell a Home"
const excerpt =
  "A practical real-estate guide for North Texas military members, veterans, teachers, healthcare workers, firefighters, EMS, and law-enforcement professionals."

const articleFaqs = faqs([
  [
    "Who may qualify for Homes for Heroes?",
    "Homes for Heroes primarily identifies military members and veterans, firefighters and EMS, law enforcement, healthcare professionals, and teachers. Current eligibility and enrollment rules must be confirmed directly through the official program.",
  ],
  [
    "Is Homes for Heroes only for first-time buyers?",
    "No. The official program says eligible participants are not limited to first-time homebuyers.",
  ],
  [
    "Does a profession automatically guarantee a reward?",
    "No. A professional or service category alone does not guarantee enrollment, eligibility, specialist participation, a particular savings amount, or a transaction benefit.",
  ],
  [
    "Can Debra help a North Texas hero buy or sell?",
    "Debra can provide real-estate planning and representation, subject to availability and the facts of the transaction. Any official third-party program status or benefit must be confirmed separately.",
  ],
  [
    "Can Debra coordinate a sale and purchase?",
    "Yes. A coordinated plan can identify equity, financing, timing, contingency, possession, temporary-housing, and moving dependencies before the transactions begin.",
  ],
])

const articleSources = sources([
  {
    label: "Homes for Heroes: Who We Serve",
    href: "https://www.homesforheroes.com/heroes/",
    publisher: "Homes for Heroes",
  },
  {
    label: "Homes for Heroes: Program Disclosures",
    href: "https://www.homesforheroes.com/imprint/",
    publisher: "Homes for Heroes",
  },
])

export const heroesArticle: Article = {
  _id: "article.homes-for-heroes-north-texas",
  slug: "homes-for-heroes-north-texas",
  title,
  excerpt,
  eyebrow: "Real estate for community heroes",
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
  readingTime: "9 minute read",
  programs: ["homes-for-heroes"],
  areas: ["dallas-fort-worth", "garland"],
  featuredImage: {
    src: "/images/debra-allen-advisor-desk.webp",
    alt: "Debra Allen seated at her desk reviewing documents on a tablet",
    width: 1153,
    height: 1536,
    focalPoint: "50% 35%",
  },
  socialImage: {
    src: "/images/debra-allen-advisor-desk.webp",
    alt: "Debra Allen seated at her desk reviewing documents on a tablet",
    width: 1153,
    height: 1536,
  },
  faqs: articleFaqs,
  sources: articleSources,
  notice: richText(
    p(
      "Homes for Heroes is a third-party program. This article does not guarantee enrollment, eligibility, specialist status, rewards, rebates, savings, or transaction results. D'Affordable Homes should not be represented as officially affiliated unless verified documentation is published.",
    ),
  ),
  relatedLinks: [
    {
      _key: "rel00",
      label: "Hero-focused real-estate guidance",
      href: "/programs/homes-for-heroes",
      description: "See Debra's buying, selling, and move-planning support.",
    },
    {
      _key: "rel01",
      label: "Garland homebuyer guide",
      href: "/areas/garland",
      description: "Plan a Garland search around cost, condition, commute, and timing.",
    },
    {
      _key: "rel02",
      label: "Affordability calculator",
      href: "/calculators/affordability",
      description: "Estimate a comfortable planning range before touring.",
    },
    {
      _key: "rel03",
      label: "Closing-cost calculator",
      href: "/calculators/closing-costs",
      description: "Prepare for costs beyond the down payment.",
    },
  ],
  relatedArticleSlugs: ["naca-homebuying-dallas-fort-worth", "how-to-buy-home-garland-tx"],
  body: [
    heroImage({
      src: "/images/debra-allen-advisor-desk.webp",
      alt: "Debra Allen seated at her desk reviewing documents on a tablet",
      width: 1153,
      height: 1536,
      focalPoint: "50% 35%",
    }),

    quickAnswer(
      "The quick answer",
      richText(
        p(
          "Military members, veterans, teachers, healthcare professionals, firefighters, EMS professionals, and law-enforcement professionals often face schedules and move requirements that generic real-estate advice does not fully address.",
        ),
        p(
          "**Debra Allen helps organize the real-estate side of a North Texas purchase, sale, or coordinated move. Homes for Heroes controls its own enrollment, specialist network, eligibility rules, rewards, and disclosures.**",
        ),
      ),
    ),

    richTextBlock(
      richText(
        h2("Who is considered a community hero?"),
        p(
          "Homes for Heroes identifies five principal groups: military members and veterans, firefighters and EMS, law enforcement, healthcare professionals, and teachers. Its current information says eligibility may include current, former, and retired members of those groups and is not limited to first-time buyers.",
        ),
        p(
          "Belonging to one of those groups does not by itself guarantee a reward, rebate, savings amount, or transaction outcome. Separate two questions from the beginning:",
        ),
        ol(
          "**Does the official third-party program apply to this person and transaction?**",
          "**What real-estate plan is needed to buy, sell, or move successfully?**",
        ),
        p("Homes for Heroes answers the first question. Debra helps with the second."),

        h2("Why hero households may need a different plan"),
        h3("Military members and veterans"),
        p(
          "Military households may face relocation orders, deployment, training, remote searches, limited touring time, or a need to sell and move quickly. Veterans may also need to distinguish VA loan eligibility from the larger affordability decision. A possible zero-down transaction does not eliminate inspections, moving expenses, insurance, taxes, repairs, or the need for reserves.",
        ),
        h3("Teachers and education professionals"),
        p(
          "Teachers may coordinate around contract dates, school calendars, summer availability, commute requirements, and family schedules. A desired summer closing still depends on inventory, lender timelines, inspections, appraisal, title, and the seller's needs.",
        ),
        h3("Healthcare professionals"),
        p(
          "Healthcare workers may have overnight shifts, rotating days, on-call responsibilities, multiple work locations, or contract assignments. A search should test commute conditions at the hours the buyer actually travels.",
        ),
        h3("Firefighters, EMS, and law enforcement"),
        p(
          "Extended shifts and callouts can make ordinary scheduling difficult. Concentrated tour blocks, digital document review, clear deadline reminders, parking, commute, and privacy needs may carry unusual weight.",
        ),

        h2("How Debra helps hero homebuyers"),
        h3("Clarify the goal"),
        p(
          "The plan begins with why the buyer is moving, preferred timing, current housing, job location, commute limits, property needs, financing status, available savings, and a comfortable monthly cost.",
        ),
        h3("Build a realistic location strategy"),
        p(
          "Dallas–Fort Worth is a large region. Debra can help compare communities using commute patterns, toll dependence, taxes, insurance, home age, inventory, association costs, property condition, and proximity to work or family.",
        ),
        h3("Evaluate the complete cost"),
        p(
          "The ownership budget may include principal, interest, taxes, insurance, mortgage insurance, association dues, utilities, transportation, maintenance, repairs, and special assessments. A lender's maximum approval does not include every expense in the household's life.",
        ),
        h3("Tour and compare efficiently"),
        p(
          "For buyers with demanding schedules, the goal is not to see the largest number of homes. It is to prioritize the most relevant options, schedule efficient tours, document differences, and investigate concerns before emotion takes over.",
        ),
        h3("Prepare and manage the transaction"),
        p(
          "Debra can help with comparable information, offer terms, contract deadlines, inspections, repair discussions, appraisal access, title communication, lender coordination, insurance questions, final walkthrough, and closing preparation. Each licensed or authorized professional remains responsible for their own decisions.",
        ),
        p("[Explore Debra's hero-focused real-estate guidance](/programs/homes-for-heroes)."),
      ),
    ),

    inlineImage(
      {
        src: "/manus-storage/couple-consultation_25d3a592.jpg",
        alt: "Two clients sitting across a table from an advisor reviewing paperwork together",
        width: 1920,
        height: 1440,
        caption:
          "Demanding schedules change how a search is run — concentrated tours, digital review, and clear deadlines.",
      },
      "inset",
    ),

    richTextBlock(
      richText(
        h2("How Debra helps hero home sellers"),
        h3("Prepare without renovating blindly"),
        p(
          "Preparation may include decluttering, cleaning, minor repairs, safety concerns, curb appeal, photography readiness, showing access, and documentation. Not every property needs a costly renovation before sale.",
        ),
        h3("Build a fact-based launch"),
        p(
          "A listing strategy can consider condition, comparable sales, active competition, timing, photography, showings, pricing position, and the seller's objectives. Overpricing can reduce attention and weaken future negotiating leverage.",
        ),
        h3("Compare the whole offer"),
        p(
          "The highest price is not always the strongest offer. Financing, down payment, deposits, inspection terms, requested concessions, appraisal language, contingencies, closing date, and possession can materially change risk.",
        ),

        h2("Buying and selling at the same time"),
        p(
          "A coordinated move creates dependencies involving equity, down payment, mortgage qualification, closing dates, possession, temporary housing, storage, contingencies, work schedules, and family logistics.",
        ),
      ),
    ),

    comparisonTable({
      heading: "Three ways to sequence a coordinated move",
      caption: "Each sequence trades one kind of pressure for another.",
      columns: ["Sequence", "What it can do — and what it costs"],
      rows: [
        [
          "Sell first",
          "May clarify available equity and reduce the risk of carrying two homes, but can create a temporary-housing need.",
        ],
        [
          "Buy first",
          "May reduce moving pressure, but the buyer must qualify while still owning the current home or use another approved structure.",
        ],
        [
          "Coordinate both",
          "Can connect the transactions through timing and contract terms, but every dependency introduces risk.",
        ],
      ],
    }),

    richTextBlock(
      richText(
        p("Debra's role is to make those dependencies visible before the first contract creates a deadline."),

        h2("Homes for Heroes benefits and real-estate service are separate"),
        p(
          "Homes for Heroes controls its eligibility, enrollment, specialist network, reward structure, calculations, terms, and disclosures. Before relying on a benefit, a consumer should confirm:",
        ),
        ul(
          "Whether the profession or service history qualifies",
          "Whether enrollment is required",
          "Whether the selected professional has the required official status",
          "Whether the location and transaction qualify",
          "How any reward is calculated and issued",
          "Whether taxes, lender restrictions, or other conditions apply",
        ),
        p(
          "The D'Affordable Homes page provides hero-focused real-estate guidance. It does not publish an unverified affiliation or promise a savings amount.",
        ),
      ),
    ),

    checklist(
      "Questions to answer before starting",
      [
        "What is the complete estimated monthly payment?",
        "How much cash and emergency reserve will remain after closing?",
        "Which communities fit the real commute and shift schedule?",
        "How much maintenance and repair risk is acceptable?",
        "Is a home sale required before the purchase can close?",
        "Does an official Homes for Heroes benefit apply to this transaction?",
        "Who is responsible for each financing, program, inspection, appraisal, and legal decision?",
      ],
    ),

    richTextBlock(
      richText(
        h2("Common mistakes to avoid"),
        ul(
          "Assuming professional status automatically guarantees a reward",
          "Choosing a home based only on the lender's maximum approval",
          "Testing a commute only during light weekend traffic",
          "Waiting until a transfer, lease end, or school break is too close",
          "Opening new credit before closing without discussing the effect",
          "Spending every available dollar and leaving no repair reserve",
          "Treating every hero household as though it has the same priorities",
        ),
      ),
    ),

    calculatorCta({
      heading: "Prepare for the cash you need beyond the down payment",
      description:
        "The closing-cost calculator is a planning tool. It is not a loan estimate or a program decision.",
      href: "/calculators/closing-costs",
      buttonLabel: "Open the closing-cost calculator",
    }),

    faqBlock("Frequently asked questions", articleFaqs),

    officialSourcesBlock("Official sources and review notes", articleSources),

    complianceDisclaimer(
      "Program boundary",
      richText(
        p(
          "Homes for Heroes is a third-party program. This article does not guarantee enrollment, eligibility, specialist status, rewards, rebates, savings, or transaction results. D'Affordable Homes should not be represented as officially affiliated unless verified documentation is published.",
        ),
      ),
    ),

    programCta({
      heading: "Build a real-estate plan around the person—not the label",
      description:
        "A profession may shape the schedule and the move, but it should not reduce the client to a generic category. Debra helps North Texas community heroes create a buying, selling, or coordinated move plan around their goals, timing, budget, and responsibilities.",
      href: "/programs/homes-for-heroes",
      buttonLabel: "Start with hero-focused guidance",
    }),

    areaGuideCta({
      heading: "Searching in Garland?",
      description: "Plan a Garland search around cost, condition, commute, and timing.",
      href: "/areas/garland",
      buttonLabel: "Open the Garland guide",
    }),

    relatedArticlesBlock("Keep reading"),

    consultationCta({
      heading: "Plan the move around your schedule",
      description:
        "Bring your timing, your shift pattern, and your must-haves. The consultation focuses on sequencing the transaction realistically.",
      buttonLabel: "Book consultation",
    }),
  ],
}
