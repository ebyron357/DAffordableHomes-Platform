/**
 * Migration source for /blog/homes-for-heroes-north-texas.
 *
 * Copy is carried over verbatim from the pre-migration route implementation
 * (apps/web/app/blog/homes-for-heroes-north-texas/page.tsx at
 * 56b381f700edd68f3504b073a7a38b0912db13b8).
 *
 * Art direction note: this article uses the editorial type-only hero. No
 * approved photograph in this repository depicts military, education,
 * healthcare, fire, EMS, or law-enforcement professionals, and substituting an
 * unrelated stock photograph would imply a subject the image cannot support.
 */
export function build({ key, prose, block }) {
  const { p, h2, h3, ul, ol } = prose

  return {
    slug: "homes-for-heroes-north-texas",
    title: "How Debra Allen Helps North Texas Heroes Buy or Sell a Home",
    eyebrow: "Real estate for community heroes",
    excerpt:
      "A practical buying, selling, and move-planning guide for military members, veterans, teachers, healthcare workers, firefighters, EMS, and law enforcement.",
    seoTitle: "How Debra Allen Helps North Texas Heroes Buy or Sell a Home",
    seoDescription:
      "A practical real-estate guide for North Texas military members, veterans, teachers, healthcare workers, firefighters, EMS, and law-enforcement professionals.",
    readingTime: "9 minute read",
    publishedAt: "2026-08-05",
    reviewedAt: "2026-08-05",
    status: "published",
    categorySlug: "community-heroes",
    authorSlug: "debra-allen",
    programSlugs: ["homes-for-heroes"],
    areaSlugs: ["garland"],
    featuredImageLayout: "editorial",
    featuredImage: null,
    body: [
      block.quickAnswer("The quick answer", [
        p(
          "Military members, veterans, teachers, healthcare professionals, firefighters, EMS professionals, and law-enforcement professionals often face schedules and move requirements that generic real-estate advice does not fully address.",
        ),
        p(
          "**Debra Allen helps organize the real-estate side of a North Texas purchase, sale, or coordinated move. Homes for Heroes controls its own enrollment, specialist network, eligibility rules, rewards, and disclosures.**",
        ),
      ]),

      block.richText([
        h2("Who is considered a community hero?"),
        p(
          "Homes for Heroes identifies five principal groups: military members and veterans, firefighters and EMS, law enforcement, healthcare professionals, and teachers. Its current information says eligibility may include current, former, and retired members of those groups and is not limited to first-time buyers.",
        ),
        p(
          "Belonging to one of those groups does not by itself guarantee a reward, rebate, savings amount, or transaction outcome. Separate two questions from the beginning:",
        ),
        ol([
          "**Does the official third-party program apply to this person and transaction?**",
          "**What real-estate plan is needed to buy, sell, or move successfully?**",
        ]),
        p("Homes for Heroes answers the first question. Debra helps with the second."),
      ]),

      block.richText([
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
      ]),

      block.richText([
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
      ]),

      block.richText([
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
      ]),

      block.richText([
        h2("Buying and selling at the same time"),
        p(
          "A coordinated move creates dependencies involving equity, down payment, mortgage qualification, closing dates, possession, temporary housing, storage, contingencies, work schedules, and family logistics.",
        ),
      ]),

      block.comparisonTable({
        heading: "Sequencing a coordinated move",
        caption:
          "Comparison of sell-first, buy-first, and coordinated sequencing: what each approach may do, and what it can create.",
        columns: ["Approach", "What it may do", "What it can create"],
        rows: [
          {
            header: "Sell first",
            cells: [
              "May clarify available equity and reduce the risk of carrying two homes",
              "Can create a temporary-housing need",
            ],
          },
          {
            header: "Buy first",
            cells: [
              "May reduce moving pressure",
              "The buyer must qualify while still owning the current home or use another approved structure",
            ],
          },
          {
            header: "Coordinate both",
            cells: [
              "Can connect the transactions through timing and contract terms",
              "Every dependency introduces risk",
            ],
          },
        ],
      }),

      block.richText([p("Debra's role is to make those dependencies visible before the first contract creates a deadline.")]),

      block.richText([
        h2("Homes for Heroes benefits and real-estate service are separate"),
        p(
          "Homes for Heroes controls its eligibility, enrollment, specialist network, reward structure, calculations, terms, and disclosures. Before relying on a benefit, a consumer should confirm:",
        ),
        ul([
          "Whether the profession or service history qualifies",
          "Whether enrollment is required",
          "Whether the selected professional has the required official status",
          "Whether the location and transaction qualify",
          "How any reward is calculated and issued",
          "Whether taxes, lender restrictions, or other conditions apply",
        ]),
        p(
          "The D'Affordable Homes page provides hero-focused real-estate guidance. It does not publish an unverified affiliation or promise a savings amount.",
        ),
      ]),

      block.richText([
        h2("Questions to answer before starting"),
        ol([
          "What is the complete estimated monthly payment?",
          "How much cash and emergency reserve will remain after closing?",
          "Which communities fit the real commute and shift schedule?",
          "How much maintenance and repair risk is acceptable?",
          "Is a home sale required before the purchase can close?",
          "Does an official Homes for Heroes benefit apply to this transaction?",
          "Who is responsible for each financing, program, inspection, appraisal, and legal decision?",
        ]),
      ]),

      block.checklist({
        heading: "Common mistakes to avoid",
        items: [
          { label: "Assuming professional status automatically guarantees a reward" },
          { label: "Choosing a home based only on the lender's maximum approval" },
          { label: "Testing a commute only during light weekend traffic" },
          { label: "Waiting until a transfer, lease end, or school break is too close" },
          { label: "Opening new credit before closing without discussing the effect" },
          { label: "Spending every available dollar and leaving no repair reserve" },
          { label: "Treating every hero household as though it has the same priorities" },
        ],
      }),

      block.programCta({
        program: "homes-for-heroes",
        heading: "Build a real-estate plan around the person—not the label",
        body:
          "A profession may shape the schedule and the move, but it should not reduce the client to a generic category. Debra helps North Texas community heroes create a buying, selling, or coordinated move plan around their goals, timing, budget, and responsibilities.",
        href: "/programs/homes-for-heroes",
        label: "Start with hero-focused guidance from Debra Allen",
      }),
    ],
    faqs: [
      {
        question: "Who may qualify for Homes for Heroes?",
        answer:
          "Homes for Heroes primarily identifies military members and veterans, firefighters and EMS, law enforcement, healthcare professionals, and teachers. Current eligibility and enrollment rules must be confirmed directly through the official program.",
      },
      {
        question: "Is Homes for Heroes only for first-time buyers?",
        answer: "No. The official program says eligible participants are not limited to first-time homebuyers.",
      },
      {
        question: "Does a profession automatically guarantee a reward?",
        answer:
          "No. A professional or service category alone does not guarantee enrollment, eligibility, specialist participation, a particular savings amount, or a transaction benefit.",
      },
      {
        question: "Can Debra help a North Texas hero buy or sell?",
        answer:
          "Debra can provide real-estate planning and representation, subject to availability and the facts of the transaction. Any official third-party program status or benefit must be confirmed separately.",
      },
      {
        question: "Can Debra coordinate a sale and purchase?",
        answer:
          "Yes. A coordinated plan can identify equity, financing, timing, contingency, possession, temporary-housing, and moving dependencies before the transactions begin.",
      },
    ],
    officialSources: [
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
    ],
    disclaimer: [
      p(
        "Homes for Heroes is a third-party program. This article does not guarantee enrollment, eligibility, specialist status, rewards, rebates, savings, or transaction results. D'Affordable Homes should not be represented as officially affiliated unless verified documentation is published.",
      ),
    ],
    relatedLinks: [
      {
        label: "Hero-focused real-estate guidance",
        href: "/programs/homes-for-heroes",
        description: "See Debra's buying, selling, and move-planning support.",
      },
      {
        label: "Garland homebuyer guide",
        href: "/areas/garland",
        description: "Plan a Garland search around cost, condition, commute, and timing.",
      },
      {
        label: "Affordability calculator",
        href: "/calculators/affordability",
        description: "Estimate a comfortable planning range before touring.",
      },
      {
        label: "Closing-cost calculator",
        href: "/calculators/closing-costs",
        description: "Prepare for costs beyond the down payment.",
      },
    ],
    relatedArticleSlugs: ["naca-homebuying-dallas-fort-worth", "how-to-buy-home-garland-tx"],
    key,
  }
}
