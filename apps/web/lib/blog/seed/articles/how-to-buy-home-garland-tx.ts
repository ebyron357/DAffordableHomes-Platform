/**
 * Migration payload — "How to Buy a Home in Garland, Texas".
 *
 * Migrated verbatim from the pre-CMS route
 * `apps/web/app/blog/how-to-buy-home-garland-tx/page.tsx` (main @ 56b381f).
 * Copy, headings, FAQs, sources, disclaimers, internal links, CTAs, reading
 * time and reviewed date are preserved exactly. The URL is unchanged.
 */

import type { Article } from "../../types"
import {
  areaGuideCta,
  calculatorCta,
  callout,
  checklist,
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
import { h2, h3, p, richText, ul } from "../portable-text"

resetKeys()

const title = "How to Buy a Home in Garland, Texas"
const excerpt =
  "A step-by-step first-time buyer guide to budgeting, financing, touring, inspections, and closing on a home in Garland, Texas."

const articleFaqs = faqs([
  [
    "Is Garland a good place for a first-time buyer?",
    "Garland may fit buyers who want access to the wider Dallas–Fort Worth region and established housing options. The right answer depends on budget, commute, taxes, insurance, property condition, and long-term goals.",
  ],
  [
    "How much money do I need to buy a Garland home?",
    "The amount depends on the mortgage, down payment, closing costs, inspections, appraisal, prepaid expenses, assistance, seller credits, moving costs, and the reserves you keep after closing.",
  ],
  [
    "Does Garland offer assistance to every first-time buyer?",
    "No. Garland's Housing Choice Voucher Home Ownership Program is a specialized option for qualifying voucher participants, not a general citywide benefit for every buyer.",
  ],
  [
    "Should I get preapproved before touring?",
    "An active search should generally begin after a meaningful financing review so the price, payment, cash requirement, and property restrictions are understood.",
  ],
  [
    "Can I use NACA to buy in Garland?",
    "A buyer may explore Garland through NACA, subject to current qualification, affordability, property, mortgage, and transaction requirements. Confirm official decisions directly with NACA.",
  ],
])

const articleSources = sources([
  {
    label: "City of Garland: Housing Choice Voucher Home Ownership Program",
    href: "https://www.garlandtx.gov/478/Home-Ownership-Program",
    publisher: "City of Garland",
  },
  {
    label: "Texas Department of Housing and Community Affairs: Homebuyer Program",
    href: "https://welcomehome.tdhca.texas.gov/welcome-home",
    publisher: "TDHCA",
  },
  { label: "NACA: Home Purchase Program", href: "https://www.naca.com/purchase/", publisher: "NACA" },
])

export const garlandArticle: Article = {
  _id: "article.how-to-buy-home-garland-tx",
  slug: "how-to-buy-home-garland-tx",
  title,
  excerpt,
  eyebrow: "Garland first-time buyer field guide",
  seoTitle: title,
  seoDescription: excerpt,
  category: {
    title: "First-time buyers",
    slug: "first-time-buyers",
    description: "Step-by-step guidance for a first purchase.",
  },
  author: {
    name: "Debra Allen",
    role: "REALTOR®",
    url: "/about",
    bio: "Debra Allen leads D'Affordable Homes, an education-first homeownership platform for first-time buyers and renters preparing for ownership.",
  },
  publishedAt: "2026-08-05",
  reviewedAt: "2026-08-05",
  readingTime: "12 minute read",
  programs: ["naca"],
  areas: ["garland", "dallas-fort-worth"],
  featuredImage: {
    src: "/images/debra-allen-lifestyle-full-body.webp",
    alt: "Debra Allen standing at a kitchen island in a yellow blazer",
    width: 1153,
    height: 1536,
    focalPoint: "center 35%",
  },
  socialImage: {
    src: "/images/debra-allen-lifestyle-full-body.webp",
    alt: "Debra Allen standing at a kitchen island in a yellow blazer",
    width: 1153,
    height: 1536,
  },
  faqs: articleFaqs,
  sources: articleSources,
  notice: richText(
    p(
      "This article provides general real-estate education. It is not a mortgage approval, legal or tax opinion, inspection, appraisal, insurance quote, program decision, or guarantee of eligibility. Confirm current requirements with the professional or organization responsible for the decision.",
    ),
  ),
  relatedLinks: [
    {
      _key: "rel00",
      label: "Garland area guide",
      href: "/areas/garland",
      description: "Continue into the site's focused Garland home-search resource.",
    },
    {
      _key: "rel01",
      label: "Affordability calculator",
      href: "/calculators/affordability",
      description: "Estimate a conservative planning range.",
    },
    {
      _key: "rel02",
      label: "Closing-cost calculator",
      href: "/calculators/closing-costs",
      description: "Prepare for cash needs beyond the down payment.",
    },
    {
      _key: "rel03",
      label: "NACA home-search guidance",
      href: "/programs/naca",
      description: "Understand Debra's role when exploring or using NACA.",
    },
  ],
  relatedArticleSlugs: ["naca-homebuying-dallas-fort-worth", "homes-for-heroes-north-texas"],
  body: [
    heroImage({
      src: "/images/debra-allen-lifestyle-full-body.webp",
      alt: "Debra Allen standing at a kitchen island in a yellow blazer",
      width: 1153,
      height: 1536,
      focalPoint: "center 35%",
    }),

    quickAnswer(
      "The quick answer",
      richText(
        p(
          "Buying in Garland begins before the listing search. A prepared buyer understands a comfortable monthly payment, cash needs, financing and assistance possibilities, taxes, insurance, association costs, commute, property condition, inspection rights, and the responsibilities of each professional in the transaction.",
        ),
        p(
          "**The right Garland home is not simply the property with the lowest price. It is the home whose complete cost, condition, location, and maintenance demands fit the buyer's life.**",
        ),
      ),
    ),

    richTextBlock(
      richText(
        h2("Why Garland belongs in a DFW home search"),
        p(
          "Garland is part of the wider Dallas–Fort Worth region, but buyers should not treat every nearby city as interchangeable. Garland offers established residential areas, different home ages and property types, regional access, and the ability to compare multiple ownership possibilities.",
        ),
        p(
          "Those broad qualities do not make every neighborhood or property a match. A useful search evaluates the specific home, commute, taxes, insurance, association requirements, visible condition, likely maintenance, and total ownership cost.",
        ),
        p("[Start with the dedicated Garland area guide](/areas/garland)."),

        h2("Step 1: Decide whether you are financially ready"),
        p(
          "Readiness is not determined by one credit score or the largest mortgage a lender will discuss. Review stable and documentable income, every recurring debt, normal household spending, available savings, and the amount that would remain after closing.",
        ),
        h3("List the expenses underwriting may not fully capture"),
        ul(
          "Food, childcare, healthcare, and insurance premiums",
          "Transportation, tolls, parking, and vehicle maintenance",
          "Family obligations and savings goals",
          "Utilities, maintenance, and emergency repairs",
        ),
        p(
          "A household can qualify for a mortgage and still become financially strained. Build the ownership decision around take-home reality, not only gross-income guidelines.",
        ),

        h2("Step 2: Set the complete monthly budget"),
        p(
          "The full housing cost may include principal, interest, property taxes, homeowners insurance, mortgage insurance, association dues, flood insurance when applicable, utilities, maintenance, and assessments.",
        ),
        p(
          "A principal-and-interest quote is not the complete payment. Test several scenarios and preserve room for groceries, transportation, medical costs, retirement, repairs, and emergencies.",
        ),
        p(
          "[Use the affordability calculator as a planning tool](/calculators/affordability), not as a mortgage approval.",
        ),

        h2("Step 3: Review credit and protect the file"),
        p(
          "Review credit reports for unfamiliar accounts, wrong balances, duplicates, outdated records, or identity errors. Do not dispute accurate negative information simply because it is unfavorable; an unnecessary dispute can complicate underwriting.",
        ),
        p(
          "During the mortgage process, avoid financing a vehicle, opening furniture or credit accounts, taking personal loans, co-signing, or making unexplained large transactions without discussing the possible effect with the appropriate loan professional.",
        ),

        h2("Step 4: Compare financing paths by total cost"),
        p(
          "The appropriate mortgage depends on the buyer, property, lender, credit profile, income, savings, and transaction. A low down payment is useful only when the full payment and long-term cost remain manageable.",
        ),
        h3("FHA-insured financing"),
        p(
          "FHA may offer more flexible underwriting for some borrowers. Compare the down payment, upfront and monthly mortgage insurance, property standards, lender rules, and complete payment.",
        ),
        h3("Conventional financing"),
        p(
          "Conventional options can include lower-down-payment products and mortgage insurance that may be removable when applicable requirements are met. Pricing can be sensitive to credit, down payment, property type, and occupancy.",
        ),
        h3("VA-backed financing"),
        p(
          "Eligible veterans, service members, and certain surviving spouses may explore VA-backed financing. A possible zero-down path does not eliminate inspections, fees, moving costs, repairs, underwriting, property standards, or the need for reserves.",
        ),
        h3("USDA-backed financing"),
        p(
          "USDA requires household and address eligibility. Do not assume a Garland property qualifies; check the current rules for the specific address.",
        ),
        h3("NACA"),
        p(
          "NACA uses its own workshop, counseling, qualification, property, mortgage, and transaction process. Buyers can learn before qualification, but an active search should align with official status and instructions. [Review NACA home-search guidance](/programs/naca).",
        ),

        h2("Step 5: Investigate assistance without assuming it is free money"),
        p(
          "Texas buyers may be able to explore mortgage, down-payment, or closing-cost assistance through state, local, nonprofit, employer, or other programs. TDHCA's current homebuyer program connects qualifying buyers with approved professionals and requires approved homebuyer education for its assistance.",
        ),
        p(
          "Assistance may be a grant, forgivable loan, deferred loan, repayable second mortgage, or benefit tied to a particular first mortgage. Ask whether it creates a lien, affects the rate, must be repaid after a sale or refinance, imposes occupancy rules, or requires a participating lender.",
        ),

        h2("Step 6: Understand Garland's specialized voucher option"),
        p(
          "Garland operates a Housing Choice Voucher Home Ownership Program for certain qualifying participants. It is not general assistance for every Garland resident or every first-time buyer.",
        ),
        p(
          "The City's current criteria include existing voucher participation for at least one year, program-specific first-time-homeowner requirements, income and employment conditions, and other agency rules. Interested participants should contact their Garland Housing Agency caseworker before relying on the program.",
        ),

        h2("Step 7: Obtain a meaningful financing review"),
        p(
          "A useful preapproval is based on reviewed financial information rather than a few answers in an online form. Ask what income, credit, debts, assets, funds, payment assumptions, and property restrictions were actually reviewed.",
        ),
        ul(
          "How long is the preapproval valid?",
          "What property-tax and insurance assumptions were used?",
          "Are mortgage insurance and association dues included?",
          "What changes could affect the result?",
          "Which documents must remain current?",
        ),
        p("A preapproval is not a final approval. The property and transaction must qualify too."),

        h2("Step 8: Build the search around daily life"),
        p(
          "Test work routes during the hours you actually travel. Include tolls, fuel, parking, vehicle wear, and added childcare time. Consider family responsibilities, medical access, community connections, maintenance preferences, and how long you expect to own the home.",
        ),
        h3("Separate needs from cosmetic preferences"),
        p(
          "Non-negotiables may include payment, bedrooms, accessibility, commute, parking, or property type. Strong preferences might include a yard, office, garage, or layout. Paint, fixtures, and decorating choices are usually easier to change than location, structure, or affordability.",
        ),
      ),
    ),

    inlineImage(
      {
        src: "/manus-storage/home-keys-moment_20083d77.jpg",
        alt: "A set of house keys being handed from one person to another",
        width: 1920,
        height: 1440,
        caption:
          "Closing is the last step, not the first. Everything before it decides whether the payment is sustainable.",
      },
      "inset",
    ),

    richTextBlock(
      richText(
        h2("Step 9: Evaluate taxes, insurance, dues, and condition"),
        p(
          "The seller's current property-tax bill may not equal the buyer's future amount because exemptions, assessed value, ownership changes, and taxing jurisdictions can affect it. Ask how the lender calculated the estimate.",
        ),
        p(
          "Request an insurance indication early. Roof age, property condition, construction, claim history, replacement cost, deductible, and insurer requirements can materially change the budget.",
        ),
        p(
          "For association properties, review dues, transfer charges, rules, maintenance responsibilities, pending assessments, financial information, and use restrictions rather than evaluating the community by the monthly fee alone.",
        ),

        h2("Step 10: Tour with a repeatable system"),
        p(
          "Record price, estimated payment, taxes, insurance, dues, commute, roof and system age, drainage, visible moisture, layout, storage, parking, noise, immediate repairs, and long-term fit. After several tours, details blur.",
        ),
        p(
          "Fresh paint, staging, lighting, and furniture improve presentation. They do not prove that the roof, foundation, plumbing, electrical system, drainage, or heating and cooling equipment are sound.",
        ),

        h2("Step 11: Prepare a fact-based offer"),
        p(
          "Offer strategy may consider comparable sales, current competition, days on market, seller timing, condition, financing, appraisal risk, inspection terms, requested concessions, and contract deadlines.",
        ),
        p(
          "A strong offer is not always the highest number. Clear terms, reliable documentation, practical timing, and manageable risk can matter. No ethical agent can guarantee seller acceptance.",
        ),

        h2("Step 12: Use inspections and specialists wisely"),
        p(
          "A general inspector may evaluate visible and accessible roofing, foundation, structure, electrical, plumbing, heating and cooling, appliances, drainage, moisture, and safety conditions. Depending on the findings, a buyer may need a structural engineer, roofer, plumber, electrician, HVAC contractor, sewer specialist, pest professional, or another expert.",
        ),
        p(
          "An appraisal is not a substitute for an inspection. The appraisal generally supports a lender's value and property review; the inspection helps the buyer understand observed condition.",
        ),

        h2("Step 13: Protect the closing"),
        p(
          "During underwriting, keep income, employment, credit, assets, and requested documents current. Review the final price, loan amount, rate, payment, cash to close, credits, taxes, insurance, association charges, closing date, and possession terms.",
        ),
      ),
    ),

    callout(
      "caution",
      "Protect yourself from wire fraud",
      richText(
        p(
          "**Verify wire instructions through an independently confirmed contact method.** Do not rely only on an unexpected email containing new instructions.",
        ),
      ),
    ),

    richTextBlock(
      richText(
        p(
          "Use the final walkthrough to confirm the property remains in expected condition, agreed work appears complete, included items remain, and no new material damage is visible.",
        ),

        h2("Step 14: Plan for the first year"),
        p(
          "Prepare for utility transfers, locks, tax exemptions when eligible, routine maintenance, filters, pest control, landscaping, appliance care, association requirements, and emergency repairs. Keep inspection reports, warranties, receipts, closing records, and repair information together.",
        ),
        p(
          "A home does not need to look finished in the first month. Protecting reserves is more important than financing furniture for every room.",
        ),

        h2("How Debra Allen supports a Garland buyer"),
        p(
          "Debra can help clarify goals, organize a location strategy, evaluate options, review comparable information, prepare offers, coordinate inspections, manage contract deadlines, communicate with transaction professionals, and prepare for the final walkthrough and closing.",
        ),
        p(
          "She does not approve mortgages, determine program eligibility, inspect or appraise the property, issue legal or tax advice, guarantee seller acceptance, or guarantee closing. Clear boundaries help buyers know which professional should answer each question.",
        ),
      ),
    ),

    checklist(
      "Before you tour: a readiness checklist",
      [
        "Know the complete monthly payment you can sustain, not just principal and interest.",
        "Know the cash required at closing and the reserve that will remain afterward.",
        "Obtain a financing review based on documents, not an online form.",
        "Ask which tax and insurance assumptions the payment estimate used.",
        "Test the commute at the hours you actually travel.",
        "Separate non-negotiables from cosmetic preferences.",
        "Decide how much repair and maintenance risk is acceptable.",
        "Confirm which professional is responsible for each decision.",
      ],
      "Every item below appears somewhere in the fourteen steps above. Together they are the shortest honest summary of readiness.",
    ),

    calculatorCta({
      heading: "Estimate a conservative planning range",
      description:
        "Use the affordability calculator as a planning tool. It is not a mortgage approval or a program decision.",
      href: "/calculators/affordability",
      buttonLabel: "Open the affordability calculator",
    }),

    faqBlock("Frequently asked questions", articleFaqs),

    officialSourcesBlock("Official sources and review notes", articleSources),

    complianceDisclaimer(
      "Educational boundary",
      richText(
        p(
          "This article provides general real-estate education. It is not a mortgage approval, legal or tax opinion, inspection, appraisal, insurance quote, program decision, or guarantee of eligibility. Confirm current requirements with the professional or organization responsible for the decision.",
        ),
      ),
    ),

    areaGuideCta({
      heading: "Turn the Garland search into a plan",
      description:
        "Know the payment you can sustain, the cash you may need, the condition you can handle, the locations that fit your routine, and how much reserve will remain after closing.",
      href: "/areas/garland",
      buttonLabel: "Continue with the Garland homebuyer guide",
    }),

    programCta({
      heading: "Exploring NACA for a Garland purchase?",
      description: "Understand Debra's role when exploring or using NACA.",
      href: "/programs/naca",
      buttonLabel: "Review NACA home-search guidance",
    }),

    relatedArticlesBlock("Keep reading"),

    consultationCta({
      heading: "Start the Garland plan with Debra",
      description:
        "Bring your budget questions, your commute, and your timeline. The consultation focuses on the next practical step.",
      buttonLabel: "Book consultation",
    }),
  ],
}
