import type { Metadata } from "next"
import { CalendarCheck, MessageSquare, Route, ShieldCheck } from "lucide-react"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { ContactForm } from "@/components/contact/contact-form"
import { SITE } from "@/lib/site"

export const metadata: Metadata = {
  title: "Book a Consultation",
  description:
    "Request a no-pressure consultation with Debra Allen, REALTOR®. Bring your questions — you'll leave with a clearer next step.",
}

const expectations = [
  {
    icon: MessageSquare,
    title: "A real conversation",
    body: "We start with where you are and where you'd like to be — no scripts, no judgment, and no jargon.",
  },
  {
    icon: Route,
    title: "A clear next step",
    body: "You'll leave with a plain-language look at your next few steps, mapped to your situation.",
  },
  {
    icon: ShieldCheck,
    title: "No pressure, ever",
    body: "Honest answers with no obligation to move faster than you're ready. Explore at your own pace.",
  },
]

const steps = [
  {
    title: "Share a little context",
    body: "Tell Debra what you're hoping to understand or plan. A sentence or two is plenty to get started.",
  },
  {
    title: "Talk it through together",
    body: "Walk through your questions, your goals, and any concerns — from budgeting and credit to the buying process.",
  },
  {
    title: "Leave with a plan",
    body: "You'll come away with a realistic next step and the resources to keep moving at a pace that fits you.",
  },
]

export default function BookPage() {
  return (
    <>
      <PageHeader
        eyebrow="Connect"
        title="Book a no-pressure consultation"
        description="This is a conversation, not a commitment. Come with questions and leave with a clearer understanding of your path — guided by Debra Allen, REALTOR®."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
          {/* Left: what to expect + how it works */}
          <div>
            <Eyebrow>What to expect</Eyebrow>
            <h2 className="mt-3 text-balance font-serif text-3xl text-foreground">
              A welcoming first step, on your terms
            </h2>
            <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
              Many people feel unsure before they reach out — that&apos;s normal, and it&apos;s exactly why {SITE.name}{" "}
              exists. Here&apos;s what a first conversation looks like.
            </p>

            <ul className="mt-8 grid gap-4 sm:grid-cols-1">
              {expectations.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.title} className="flex gap-4 rounded-xl border border-border bg-card p-5">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="mt-10">
              <Eyebrow>How it works</Eyebrow>
              <ol className="mt-5 flex flex-col gap-5">
                {steps.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent font-semibold text-accent-foreground">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-foreground">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Right: request form */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Container className="max-w-none px-0">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <CalendarCheck className="size-5" aria-hidden="true" />
                  </span>
                  <h2 className="font-serif text-xl font-semibold text-foreground">Request your consultation</h2>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Send a note with your questions and Debra will follow up personally.
                </p>
                <div className="mt-6">
                  <ContactForm context="consultation" />
                </div>
              </div>
            </Container>
          </div>
        </div>
      </Section>
    </>
  )
}
