import type { FaqItem } from "@/lib/content/home"

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
          "NACA is a program some buyers explore on their path to homeownership. Our NACA page offers a plain-language introduction and points you to official, current sources. For eligibility and program specifics, NACA or a qualified professional is the right source.",
      },
      {
        question: "Do you help with the home search?",
        answer:
          "Home search is offered through an approved MLS/IDX provider. When that provider is connected, you'll be able to explore listings here. Until then, we focus on education, neighborhood context, and helping you prepare.",
      },
    ],
  },
  {
    heading: "Working with Debra",
    items: [
      {
        question: "What happens after I book a consultation?",
        answer:
          "A consultation is a conversation about where you are and what a practical next step could look like. Details about what it covers are confirmed before you book, so you always know what to expect.",
      },
      {
        question: "Will I be pressured to buy?",
        answer:
          "No. There are no guaranteed approvals, no fake urgency, and no shame about credit, savings, or renting. The goal is clarity and a plan you can actually follow — on your timeline.",
      },
    ],
  },
]
