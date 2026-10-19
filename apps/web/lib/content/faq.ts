import { COMMON_WORRIES, CONSULTATION_TERMS } from "@/lib/content/conversion"
import type { FaqItem } from "@/lib/content/home"

const [COST, COMMITMENT] = CONSULTATION_TERMS

export type FaqGroup = {
  heading: string
  items: FaqItem[]
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    heading: "Getting started",
    items: [
      {
        question: "I'm not sure I'm ready to buy. Is this still for me?",
        answer:
          "Yes. Many people start here long before they are ready to buy. The first step is not always house hunting — sometimes it is simply understanding the process and making a plan. You are welcome to learn at your own pace.",
      },
      {
        question: "Where should I begin?",
        answer:
          "A good starting point is Find Your Next Step. It asks a few short questions and points you to educational resources for your stage. From there, the first-time buyer basics explain how the overall process works.",
      },
      {
        question: "Do I have to share my contact information to use the site?",
        answer:
          "No. You can read, learn, and use the educational resources without submitting any contact information. If and when you want to talk with Debra, you can choose to reach out.",
      },
    ],
  },
  {
    // The reasons people give for not getting in touch, from the same source
    // as the consultation and first-time-buyer pages.
    heading: "Common worries",
    items: COMMON_WORRIES.map(({ question, answer }) => ({ question, answer })),
  },
  {
    heading: "The process",
    items: [
      {
        question: "Can this site tell me if I qualify for a loan?",
        answer:
          "No. D'Affordable Homes provides education and general information. It does not approve loans or provide legal, tax, lending, or individualized financial advice. When those questions come up, we point you to the right licensed professional.",
      },
      {
        question: "What is NACA?",
        answer:
          "NACA (Neighborhood Assistance Corporation of America) is a nonprofit housing counseling organization. NACA says its free Homebuyer Workshop is open to everyone and is the first step; after it, buyers work through counseling and qualification with NACA before searching for a home. NACA controls every requirement. Our NACA page explains the process and Debra's real-estate role once you are ready to search.",
      },
      {
        question: "Do you help with the home search?",
        answer:
          "Yes. Debra helps you define the search, tour homes, write offers and get to closing. What isn't connected yet is a live listings feed on this website, so for now, tell Debra the area, budget and timing and she'll tell you what's available.",
      },
    ],
  },
  {
    heading: "Working with Debra",
    items: [
      {
        question: "What happens after I book a consultation?",
        answer:
          `Debra gets back to you to set a time, and then you talk by phone or video call about where you are and what you're trying to work out. ${COST}, ${COMMITMENT.toLowerCase()}, and you leave with a clear next step — even if that step is "keep saving and check back in the spring."`,
      },
      {
        question: "Will I be pressured to buy?",
        answer:
          "No. There are no guaranteed approvals, no fake urgency, and no shame about credit, savings, or renting. The goal is clarity and a plan you can actually follow — on your timeline.",
      },
    ],
  },
]
