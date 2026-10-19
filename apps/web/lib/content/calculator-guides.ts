import {
  DOWN_PAYMENT_SCENARIOS,
  HOUSING_RATIO_LIMIT,
  MORTGAGE_INSURANCE_CUTOFF_PERCENT,
  RENT_VS_BUY_TERM_YEARS,
  TOTAL_DEBT_RATIO_LIMIT,
} from "@/lib/calculators"

/**
 * The explanation published beside each planning calculator.
 *
 * Each calculator route opens with the tool and follows it with a direct answer
 * to the question people type into a search box ("how much house can I
 * afford?"), what the estimate counts, what it leaves out, and the questions
 * people ask next. That is what lets a search or answer engine quote the page
 * accurately, and what tells a reader when the number stops being useful.
 *
 * Rules for this file, from AGENTS.md and the publishing standard:
 *
 * - Every statement about how a calculator works is built from the constants in
 *   `lib/calculators.ts`, so the copy and the arithmetic cannot disagree.
 *   `tests/static/calculator-guides.test.mjs` re-derives them.
 * - No market figure, rate, typical cost, program amount or eligibility rule is
 *   stated. Defaults are described as starting values, never as local averages.
 * - Anything a lender, program or other professional decides is attributed to
 *   them, in the answer itself rather than in a footnote.
 */

export type CalculatorSlug = "mortgage-payment" | "affordability" | "closing-costs" | "down-payment" | "rent-vs-buy"

export type CalculatorGuide = {
  slug: CalculatorSlug
  /** The tool's name, as the breadcrumb and the structured data call it. */
  name: string
  /** One line for structured data and llms.txt. */
  summary: string
  /** The searcher's question, used as the heading over the answer. */
  question: string
  /** A direct answer, readable on its own, that says how this tool answers it. */
  answer: string
  includes: readonly string[]
  leavesOut: readonly string[]
  faqs: readonly { question: string; answer: string }[]
  /** Where a reader usually goes next. Calculators first, then one guide. */
  related: readonly CalculatorSlug[]
  guide: { title: string; body: string; href: string; action: string }
}

/** 0.28 → 28, without floating-point residue (0.28 * 100 is 28.000000000000004). */
const wholePercent = (ratio: number) => Math.round(ratio * 1000) / 10
const percent = (ratio: number) => `${wholePercent(ratio)}%`
const HOUSING = percent(HOUSING_RATIO_LIMIT)
const TOTAL_DEBT = percent(TOTAL_DEBT_RATIO_LIMIT)
const MI_CUTOFF = `${MORTGAGE_INSURANCE_CUTOFF_PERCENT}%`

/** "3%, 3.5%, 5%, 10% and 20%" */
const SCENARIO_LIST = (() => {
  const items = DOWN_PAYMENT_SCENARIOS.map((value) => `${value}%`)
  return items.length > 1 ? `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}` : (items[0] ?? "")
})()

const PROGRAMS_GUIDE = {
  title: "Homebuyer programs and assistance",
  body: "Who runs the Texas, Garland, Dallas and Dallas County homebuyer programs, with links to each agency's own page.",
  href: "/programs",
  action: "Open the programs guide",
} as const

const STEPS_GUIDE = {
  title: "The steps to buying a house",
  body: "Where this number fits in the whole process, from getting ready to closing day.",
  href: "/first-time-buyers",
  action: "Read the steps",
} as const

export const CALCULATOR_GUIDES: Record<CalculatorSlug, CalculatorGuide> = {
  "mortgage-payment": {
    slug: "mortgage-payment",
    name: "Mortgage payment calculator",
    summary:
      "Estimates a monthly mortgage payment: principal and interest, property taxes, homeowners insurance, mortgage insurance and HOA dues.",
    question: "What goes into a monthly mortgage payment?",
    answer:
      "Usually more than the loan. Principal and interest repay what you borrow; property taxes and homeowners insurance are often collected with the payment through an escrow account; mortgage insurance may apply when the down payment is small; and HOA dues, where a home has them, arrive every month too. This calculator adds all five, so the number on the screen is closer to the month you would actually live with.",
    includes: [
      "Principal and interest, from the loan amount, interest rate and term you enter.",
      "Property taxes and homeowners insurance, from the yearly amounts you enter, divided by twelve.",
      `Mortgage insurance at the rate you enter, removed once the down payment reaches ${MI_CUTOFF} of the price.`,
      "Monthly HOA dues.",
    ],
    leavesOut: [
      "Utilities, maintenance and repairs.",
      "Changes to taxes or insurance after you buy.",
      "Your actual interest rate, which only a lender can quote.",
      "Loan types that charge mortgage insurance differently, or for longer, than this simple rule.",
    ],
    faqs: [
      {
        question: "Is this a loan quote?",
        answer:
          "No. It is a planning estimate built from the numbers you enter. A lender's Loan Estimate is the document that shows a real rate, payment and costs for a specific loan.",
      },
      {
        question: `Why does mortgage insurance drop off at ${MI_CUTOFF} down?`,
        answer: `On many conventional loans, mortgage insurance is required when the down payment is less than ${MI_CUTOFF} of the price, and this calculator follows that simple rule. Other loan types handle it differently, so ask your lender how it works on the loan you are considering.`,
      },
      {
        question: "Where do I find property tax and insurance numbers?",
        answer:
          "For a specific home, the county appraisal district's records show the current tax figures, and an insurance agent can quote coverage. Until you have a home in mind, the starting values in the calculator are placeholders to replace with your own numbers, not local averages.",
      },
    ],
    related: ["affordability", "closing-costs"],
    guide: STEPS_GUIDE,
  },

  affordability: {
    slug: "affordability",
    name: "Home affordability calculator",
    summary: `Estimates a home price range from household income, monthly debts, down payment and ownership costs, using the ${wholePercent(HOUSING_RATIO_LIMIT)}/${wholePercent(TOTAL_DEBT_RATIO_LIMIT)} guideline.`,
    question: "What decides how much house you can afford?",
    answer: `Mostly your income, your existing debts and the full monthly cost of owning. This calculator applies a common lending guideline: keep your total monthly housing cost at or below ${HOUSING} of gross monthly income, and housing plus your other monthly debt payments at or below ${TOTAL_DEBT}. It uses whichever limit is lower, then finds the highest home price whose full monthly cost — principal, interest, taxes, insurance, mortgage insurance and HOA dues — fits inside it. Lenders set their own limits, so treat the result as a planning range, not an approval.`,
    includes: [
      "Gross household income and the minimum payments on your existing debts.",
      "The down payment you have available, the interest rate and the loan term.",
      "Property taxes and homeowners insurance as a yearly percentage of the price.",
      `HOA dues, and mortgage insurance whenever the down payment is under ${MI_CUTOFF} of the price.`,
    ],
    leavesOut: [
      "Closing costs and the savings you keep in reserve — the closing cost calculator estimates the first.",
      "How your credit affects the rate a lender offers.",
      "Everyday spending that is not a debt payment, such as childcare, transport and savings goals.",
      "Each lender's and program's own debt-to-income limits.",
    ],
    faqs: [
      {
        question: "What is a debt-to-income ratio?",
        answer: `Your monthly debt payments, including the new housing payment, divided by your gross monthly income. The results show the estimate's total debt-to-income, so you can see how close a scenario sits to the ${TOTAL_DEBT} guideline this calculator uses.`,
      },
      {
        question: "Should I spend the full amount the calculator shows?",
        answer:
          "Not necessarily. The guideline sets a ceiling, not a target. A payment that leaves room for savings, repairs and the rest of your life is often the more comfortable number, and that is worth deciding before you start looking at homes.",
      },
      {
        question: "Is this the same as being pre-approved?",
        answer:
          "No. A pre-approval comes from a lender after reviewing your income, debts, credit and documents. This estimate uses only the numbers you type, and nothing you enter is saved.",
      },
    ],
    related: ["mortgage-payment", "down-payment"],
    guide: PROGRAMS_GUIDE,
  },

  "closing-costs": {
    slug: "closing-costs",
    name: "Closing cost calculator",
    summary:
      "Estimates cash to close: down payment, closing costs, prepaid items and escrow deposits, minus known seller or lender credits.",
    question: "How much are closing costs?",
    answer:
      "It depends on the price, the loan, the lender and the title and escrow charges on your purchase, which is why this calculator lets you set the rate instead of assuming one. It multiplies the purchase price by your closing-cost and prepaid-and-escrow percentages, adds the down payment, and subtracts any seller or lender credits you already know about, to estimate the total cash you would bring to closing.",
    includes: [
      "The down payment.",
      "Closing costs, as the percentage of the purchase price you enter.",
      "Prepaid items and initial escrow deposits, as a second percentage.",
      "Seller or lender credits you already know about, never more than the costs they offset.",
    ],
    leavesOut: [
      "Individual fees such as title, appraisal and lender charges — the estimate uses one percentage instead.",
      "Costs paid before closing day, such as an inspection.",
      "Tax prorations and other adjustments between buyer and seller.",
      "Program-specific fees or assistance.",
    ],
    faqs: [
      {
        question: "What is the difference between closing costs and cash to close?",
        answer:
          "Closing costs are the fees and charges for the loan and the purchase. Cash to close is everything you bring on closing day: the down payment, plus closing costs, prepaid items and escrow deposits, minus any credits.",
      },
      {
        question: "What are prepaids and escrow?",
        answer:
          "Prepaids are costs paid in advance at closing, such as homeowners insurance and some interest. Escrow deposits start the account a lender may use to pay your property taxes and insurance on your behalf.",
      },
      {
        question: "Can the seller pay some of my closing costs?",
        answer:
          "Sometimes. A seller may agree to a credit toward the buyer's costs as part of the negotiated contract, and loan programs limit how much a credit can cover. If a credit is already agreed, enter it here.",
      },
      {
        question: "Where do I get the real numbers?",
        answer:
          "From your lender. The Loan Estimate you receive after applying, and the Closing Disclosure before closing, itemise the actual costs for your loan.",
      },
    ],
    related: ["down-payment", "mortgage-payment"],
    guide: PROGRAMS_GUIDE,
  },

  "down-payment": {
    slug: "down-payment",
    name: "Down payment calculator",
    summary: `Compares down payments of ${SCENARIO_LIST} of a home's price, with the loan amount, mortgage insurance and monthly payment for each.`,
    question: "How much should I put down on a house?",
    answer: `There is no single right amount. This planner compares ${SCENARIO_LIST} of the price side by side, showing the down payment, loan amount, mortgage insurance and estimated monthly payment for each, so you can see what a larger or smaller down payment changes. Which minimum you can use depends on the loan and the program, and that is your lender's call.`,
    includes: [
      `The down payment at each of ${SCENARIO_LIST} of the price.`,
      "The loan amount that leaves.",
      `Mortgage insurance at the rate you enter, below ${MI_CUTOFF} down.`,
      "Principal and interest, property taxes, homeowners insurance and HOA dues.",
    ],
    leavesOut: [
      "Whether a given minimum is available to you — that depends on the lender, the loan and the program.",
      "Down payment assistance.",
      "Closing costs and reserves — the closing cost calculator estimates the first.",
      "Loan types that price mortgage insurance their own way.",
    ],
    faqs: [
      {
        question: `Do I need ${MI_CUTOFF} down to buy a house?`,
        answer:
          "No. Many loan types allow less, and programs vary. The usual trade-off is mortgage insurance and a larger loan, which this planner shows as a higher monthly payment. Which minimum applies to you is the lender's call.",
      },
      {
        question: "Can I get help with a down payment in Texas?",
        answer:
          "Down payment assistance exists through state agencies, some cities and some lenders, each with its own rules. The programs page links to the official Texas, City of Garland, City of Dallas and Dallas County sources rather than restating their amounts.",
      },
      {
        question: "Should I put everything I have toward the down payment?",
        answer:
          "Cash to close is more than the down payment, and the first months in a home bring their own costs. Plan for both before deciding how much to put down; the closing cost calculator estimates the first part.",
      },
    ],
    related: ["closing-costs", "affordability"],
    guide: PROGRAMS_GUIDE,
  },

  "rent-vs-buy": {
    slug: "rent-vs-buy",
    name: "Rent vs. buy calculator",
    summary:
      "Compares the cash cost of renting with the cash cost of owning over a chosen number of years. It does not count equity or appreciation.",
    question: "Is it better to rent or buy?",
    answer: `It depends on how long you stay, what you pay now, and what owning would really cost. This calculator compares cash out of pocket over the years you choose: rent on one side; on the other, the down payment, principal and interest on a ${RENT_VS_BUY_TERM_YEARS}-year loan, and a yearly allowance for taxes, insurance and maintenance. It is a cash comparison, not a wealth comparison — it does not count equity, appreciation or the cost of selling.`,
    includes: [
      "Monthly rent for every month of the comparison.",
      "The down payment.",
      `Principal and interest on a ${RENT_VS_BUY_TERM_YEARS}-year loan at the rate you enter.`,
      "Taxes, insurance and maintenance, as a yearly percentage of the price.",
    ],
    leavesOut: [
      "Equity you build, and any change in the home's value.",
      "The cost of selling later.",
      "Rent increases.",
      "Tax effects, and what the down payment might earn if you kept it.",
      "Your actual interest rate, which only a lender can quote.",
    ],
    faqs: [
      {
        question: "Why doesn't the calculator count home equity?",
        answer:
          "Because equity depends on what the home is worth when you sell, which nobody can promise. Leaving it out keeps the comparison honest about cash. Debra can talk through how equity fits your plans, and a financial professional can model it for your situation.",
      },
      {
        question: "How long do I need to stay for buying to make sense?",
        answer:
          "There is no fixed number. Buying has upfront costs that renting does not, so the longer you stay, the more time those costs have to spread out. Try the comparison at a few different lengths to see how the gap changes.",
      },
      {
        question: "What should go into the ownership cost rate?",
        answer:
          "Property taxes, homeowners insurance and an allowance for maintenance and repairs, as a yearly percentage of the price. The starting value is a placeholder to replace with figures for a real home, not a local average.",
      },
    ],
    related: ["affordability", "down-payment"],
    guide: STEPS_GUIDE,
  },
}

export const calculatorPath = (slug: CalculatorSlug) => `/calculators/${slug}`
