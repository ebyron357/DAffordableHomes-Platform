/**
 * Copy that helps a visitor decide to get in touch: what a consultation is,
 * what it costs, what happens after a form is sent, and answers to the worries
 * that stop people booking.
 *
 * It lives in one module because the same promises appear beside several
 * buttons and forms. Written once, they cannot drift apart, and a correction
 * from Debra is a one-line change. `tests/static/conversion-copy.test.mjs`
 * fails if a route re-types one of these promises instead of importing it.
 *
 * ## Confirmed business facts
 *
 * Four statements here are business facts, confirmed by the owner on
 * 2026-10-03 and recorded in `docs/05-content/CONVERSION_COPY.md`:
 *
 * - the consultation is free;
 * - there is no commitment;
 * - Debra personally replies to each message;
 * - consultations may happen by phone or video.
 *
 * Lines marked `CONFIRMED` rely on them. Anything else stated here is either a
 * description of how the site works or general education with the deciding
 * party named.
 *
 * Rules, from AGENTS.md: no response-time promise, no service-area claim, no
 * statement about compensation, eligibility or approval, and nothing a lender
 * or program decides presented as Debra's. Those wait for verified facts; see
 * "Client-fact-dependent copy" in the same document.
 */

/** The three facts that sit under every primary consultation button. CONFIRMED */
export const CONSULTATION_TERMS = ["No cost", "No commitment", "Phone or video call"] as const

/** One-line form of the above, for places that take a sentence. CONFIRMED */
export const CONSULTATION_REASSURANCE = CONSULTATION_TERMS.join(" · ")

/** How a consultation is arranged, in order. */
export const CONSULTATION_STEPS = [
  {
    title: "Send a short request",
    description:
      "Tell Debra where you are and what you are trying to work out. A sentence or two is enough.",
  },
  {
    // CONFIRMED: Debra personally replies to each message
    title: "Debra replies to set a time",
    description:
      "She reads every request herself and gets back to you using the details you share.",
  },
  {
    // CONFIRMED: phone or video; free; no commitment
    title: "Talk it through by phone or video call",
    description:
      "Your situation, your questions, and the one or two things worth doing next. You leave with a clear next step, whether or not you are ready to buy.",
  },
] as const

/** Shown beside the steps when the booking calendar is switched on. */
export const CONSULTATION_CALENDAR_NOTE = "When the booking calendar is shown above, you can pick a time yourself instead."

/** Useful to mention in a consultation. None of it is required. */
export const CONSULTATION_HELPFUL = [
  "A rough idea of the monthly payment you would be comfortable with",
  "Where you would like to live, and roughly when",
  "Your NACA stage or your profession, if a program is part of your plan",
  "A pre-approval letter, if you already have one",
] as const

/** What a consultation is not. Every clause is true of a conversation with a REALTOR®. */
export const CONSULTATION_IS_NOT =
  "It isn't a loan application, a credit check or a pre-approval, and it doesn't commit you to working with Debra. Please don't bring or send account numbers, Social Security numbers or financial documents — a consultation doesn't need them."

export type Worry = {
  /** The worry in the visitor's own words, without quotation marks. */
  worry: string
  /** The same worry as a question, for the FAQ page and its markup. */
  question: string
  answer: string
  link?: { href: string; label: string }
}

/**
 * The reasons first-time buyers give for not getting in touch, answered.
 *
 * Each answer says what Debra can do and names who decides the rest. No
 * eligibility, approval, amount or frequency is claimed: the programs named
 * are the official ones already linked on /programs, and the counseling
 * centre is Dallas County's own service as described there.
 */
export const COMMON_WORRIES: readonly Worry[] = [
  {
    worry: "My credit isn't perfect.",
    question: "What if my credit isn't perfect?",
    answer:
      "You can still talk with Debra. She can't check your credit or tell you what you will qualify for — a lender does that — but she can help you see where credit fits in your plan and point you to homebuyer counseling, such as the Dallas County Home Loan Counseling Center.",
    link: { href: "/programs", label: "Counseling and assistance programs" },
  },
  {
    worry: "I don't have much saved.",
    question: "What if I don't have much saved?",
    answer:
      "Homebuyer assistance programs exist through the Texas agencies TDHCA and TSAHC, the City of Dallas and Dallas County, each with its own rules. Each program and a participating lender decide who qualifies. Debra can help you understand how assistance fits into your search and your offer.",
    link: { href: "/programs", label: "See the official programs" },
  },
  {
    worry: "I'm not ready to buy yet.",
    question: "What if I'm not ready to buy yet?",
    answer:
      "Most of the work that makes a purchase go well happens before you look at houses. A consultation can be about next year's plan, and you won't be asked to commit to anything.",
  },
  {
    // CONFIRMED: free; no commitment
    worry: "Does it cost anything to talk?",
    question: "Does it cost anything to talk with Debra?",
    answer: "No. The consultation is free and doesn't commit you to working with Debra.",
  },
  {
    worry: "Do I need a lender or a pre-approval before we talk?",
    question: "Do I need a lender or a pre-approval before I talk with Debra?",
    answer: "No. If you don't have a lender yet, that's a normal place to start.",
  },
] as const

/** Heading over the worries wherever they appear in full. */
export const WORRIES_HEADING = "Worried you're not ready? Start here anyway."

/** The homepage's one-line version, linking to the consultation page. */
export const WORRIES_SHORT =
  "Credit still a work in progress? Little saved? Not ready for months? None of those is a reason to wait to talk."

/** Under every form's submit button. */
export const FORM_PRIVACY = "Your details go straight to Debra's inquiry system and are used only to reply to you."
