import type { Metadata } from "next"
import { PageHeader } from "@/components/page/page-header"
import { Section, Prose } from "@/components/page/section"
import { Button } from "@/components/ui/button"
import { Notice } from "@/components/states/notice"

export const metadata: Metadata = {
  title: "First-Time Buyer Education",
  description:
    "A plain-language introduction to the homebuying process for first-time buyers and renters. Understand the steps before you take them — no pressure, no jargon.",
  alternates: { canonical: "/first-time-buyers" },
}

export default function FirstTimeBuyersPage() {
  return (
    <>
      <PageHeader
        eyebrow="For first-time buyers"
        title="Understand the process before you step into it"
        intro="Buying a home for the first time can feel like a lot. Let's slow it down. This is a plain-language overview of how the journey usually works, so you can move with a plan instead of guessing."
        crumbs={[{ label: "Home", href: "/" }, { label: "Learn" }, { label: "First-Time Buyers" }]}
      >
        <Button href="/start">Find Your Next Step</Button>
      </PageHeader>

      <Section>
        <Prose>
          <h2>Education comes first</h2>
          <p>
            A prepared buyer is a stronger buyer. Before we ever talk about specific homes, it helps to understand the
            shape of the whole process. When you know what&apos;s coming, each step feels smaller and more manageable.
          </p>

          <h3>Getting your bearings</h3>
          <p>
            Most first-time buyers start by learning how ownership differs from renting, what costs are involved beyond
            the purchase price, and how the timeline generally unfolds. There&apos;s no need to have answers yet — this
            stage is about understanding the questions.
          </p>

          <h3>Preparing your foundation</h3>
          <p>
            Preparation often includes getting organized around savings, understanding how credit is viewed, and
            gathering the kinds of documents buyers typically need. We can point you to educational resources for each
            of these. For decisions about your specific finances, a qualified lender or financial professional is the
            right guide.
          </p>

          <h3>Working with the right professionals</h3>
          <p>
            Homeownership is a team effort. A REALTOR&reg; helps you understand the market and represents your
            interests. Lenders handle financing and qualification. Attorneys, inspectors, and tax professionals each
            play a role. Part of our job is helping you know who to ask, and when.
          </p>
        </Prose>

        <div className="mt-10 max-w-2xl">
          <Notice title="This is general education, not advice">
            Nothing on this page is loan approval, or legal, tax, lending, or individualized financial advice. When a
            question belongs to a licensed professional, we&apos;ll help you find the right one.
          </Notice>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button href="/naca" variant="outline">
            Learn about NACA
          </Button>
          <Button href="/resources" variant="outline">
            Browse resources
          </Button>
          <Button href="/book">Talk with Debra</Button>
        </div>
      </Section>
    </>
  )
}
