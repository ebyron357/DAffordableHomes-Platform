import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"

const paths = [
  ["Assess My Readiness", "/start", "Understand what is prepared and what needs attention."],
  ["Use Homebuyer Tools", "/resources/calculators", "Explore financial tradeoffs with practical estimates."],
  ["Speak With Debra", "/book", "Talk through your goals and decide on a realistic next step."],
] as const

const tools = [
  ["Mortgage payment", "/resources/calculators/mortgage-payment"],
  ["Affordability", "/resources/calculators/affordability"],
  ["Closing costs", "/resources/calculators/closing-costs"],
  ["Down-payment planner", "/resources/calculators/down-payment"],
] as const

const resources = [
  ["Buyer guides", "/first-time-buyers"],
  ["Events and workshops", "/events"],
  ["Neighborhoods", "/neighborhoods"],
  ["Market education", "/market-reports"],
] as const

export function ControlledHomeSections({ placement }: { placement: "before-debra" | "after-debra" }) {
  if (placement === "before-debra") return <>
    <section className="border-b border-border bg-card py-16 md:py-20" aria-labelledby="pathways-heading"><Container><h2 id="pathways-heading" className="font-serif text-3xl sm:text-4xl">Choose the right starting point</h2><div className="mt-10 grid gap-8 md:grid-cols-3">{paths.map(([title, href, body]) => <div key={title} className="border-t-2 border-primary pt-5"><h3 className="font-sans text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p><Link href={href} className="mt-5 inline-block font-semibold text-primary underline-offset-4 hover:underline">Explore this path →</Link></div>)}</div></Container></section>
    <section className="bg-muted py-16 md:py-20" aria-labelledby="tools-heading"><Container><h2 id="tools-heading" className="font-serif text-3xl sm:text-4xl">Plan with real numbers</h2><p className="mt-4 max-w-2xl text-muted-foreground">Professional planning tools for clearer questions—not approvals, promises, or financial advice.</p><div className="mt-10 divide-y divide-border border-y border-border">{tools.map(([label, href]) => <Link key={href} href={href} className="flex min-h-16 items-center justify-between py-4 text-lg font-semibold text-primary hover:underline"><span>{label}</span><span aria-hidden="true">→</span></Link>)}</div></Container></section>
  </>

  return <>
    <section className="border-y border-border py-16 md:py-20" aria-labelledby="process-heading"><Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]"><div><p className="text-sm font-semibold uppercase tracking-widest text-accent">The buyer process</p><h2 id="process-heading" className="mt-3 font-serif text-3xl sm:text-4xl">A clear path from questions to closing</h2></div><ol className="divide-y divide-border border-y border-border">{["Assess readiness", "Prepare finances", "Search and evaluate", "Offer, close, and transition"].map((item, index) => <li key={item} className="flex gap-6 py-5"><span className="font-semibold tabular-nums text-accent">0{index + 1}</span><span className="text-lg font-semibold">{item}</span></li>)}</ol></Container></section>
    <section className="bg-card py-16 md:py-20" aria-labelledby="resources-heading"><Container><h2 id="resources-heading" className="font-serif text-3xl sm:text-4xl">Resources for the decisions ahead</h2><div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">{resources.map(([label, href]) => <Link key={href} href={href} className="font-semibold text-primary underline-offset-4 hover:underline">{label} →</Link>)}</div></Container></section>
    <section className="bg-primary py-16 text-primary-foreground md:py-20"><Container className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center"><div><h2 className="font-serif text-3xl sm:text-4xl">Talk through your next homebuying decision</h2><p className="mt-4 max-w-2xl text-primary-foreground/80">For buyers who want a realistic plan, a clearer sense of readiness, or professional guidance before taking the next step.</p></div><Button href="/book" variant="secondary" size="lg">Schedule a Homebuyer Consultation</Button></Container></section>
  </>
}
