import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"

const paths = [
  ["Assess my readiness", "/start", "Use the affordability and payment tools to understand your starting point.", "Check my numbers"],
  ["Build my homebuyer plan", "/resources", "Learn the steps, documents, financing paths, and decisions ahead.", "Explore resources"],
  ["Work with Debra", "/book", "Talk through your goals and leave with a clear next action.", "Schedule a consultation"],
] as const
const tools = [
  ["Mortgage payment", "/resources/calculators/mortgage-payment", "Estimate principal, interest, taxes, insurance, and total monthly housing cost."],
  ["Home affordability", "/resources/calculators/affordability", "Explore a conservative planning range based on income, debts, and assumptions."],
  ["Closing costs", "/resources/calculators/closing-costs", "Estimate cash needed beyond the down payment."],
  ["Down payment planning", "/resources/calculators/down-payment", "Compare common down-payment scenarios and cash-to-close needs."],
] as const
const phases = [
  ["Assess readiness", "Review goals, timeline, credit, income, debts, and realistic starting options."],
  ["Prepare finances", "Understand financing paths, documents, savings, and cash-to-close needs."],
  ["Search and evaluate", "Compare homes, neighborhoods, tradeoffs, and true monthly costs."],
  ["Offer, close, transition", "Prepare an offer, navigate due diligence, close, and move forward confidently."],
] as const

export function ControlledHomeSections({ placement }: { placement: "before-debra" | "after-debra" }) {
  if (placement === "before-debra") return <>
    <section className="bg-card py-14 md:py-16" aria-labelledby="pathways-heading"><Container><h2 id="pathways-heading" className="font-serif text-[31px] font-normal sm:text-[38px]">Start with what you need today</h2><p className="mt-3 max-w-3xl text-muted-foreground">Three direct ways to move forward—without forcing every visitor into the same path.</p><div className="mt-7 grid md:grid-cols-3">{paths.map(([title, href, body, action], index) => <article key={title} className="border-b border-border py-6 md:border-b-0 md:border-l md:px-7 md:first:border-l-0 md:first:pl-0"><p className="text-xs font-semibold text-accent">0{index + 1}</p><h3 className="mt-3 font-sans text-xl font-semibold">{title}</h3><p className="mt-3 max-w-sm text-[15px] leading-6 text-muted-foreground">{body}</p><Link href={href} className="mt-4 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline">{action} →</Link></article>)}</div></Container></section>
    <section className="py-14 md:py-20" aria-labelledby="tools-heading"><Container><div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><h2 id="tools-heading" className="font-serif text-[31px] font-normal sm:text-[38px]">Planning tools that answer real questions</h2><p className="mt-3 max-w-3xl text-muted-foreground">Use straightforward estimates to prepare better questions for a lender or consultation.</p></div><Link href="/resources/calculators" className="shrink-0 text-sm font-semibold text-primary hover:underline">View all calculators →</Link></div><div className="mt-7 border-t border-border">{tools.map(([title, href, body]) => <Link key={href} href={href} className="grid gap-2 border-b border-border py-5 hover:bg-card md:grid-cols-[280px_1fr_auto] md:items-center md:gap-6"><span className="font-semibold">{title}</span><span className="text-sm leading-6 text-muted-foreground">{body}</span><span className="text-sm font-semibold text-primary">Open tool →</span></Link>)}</div></Container></section>
  </>
  return <>
    <section className="py-14 md:py-20" aria-labelledby="process-heading"><Container><h2 id="process-heading" className="font-serif text-[31px] font-normal sm:text-[38px]">Four phases. One informed decision at a time.</h2><p className="mt-3 max-w-3xl text-muted-foreground">A professional overview of the journey—one clear decision at a time.</p><ol className="mt-7 grid md:grid-cols-4">{phases.map(([title, body], index) => <li key={title} className="border-b border-border py-5 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0"><span className="text-xs font-semibold text-accent">0{index + 1}</span><h3 className="mt-3 font-sans text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-[1.6] text-muted-foreground">{body}</p></li>)}</ol></Container></section>
    <section className="bg-primary py-11 text-primary-foreground"><Container className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center"><div><h2 className="font-serif text-3xl font-normal">Ready for a clearer next step?</h2><p className="mt-3 max-w-3xl text-primary-foreground/80">Schedule a homebuyer consultation to discuss your goals, questions, and current starting point.</p></div><Button href="/book" variant="secondary" size="lg">Schedule a Homebuyer Consultation</Button></Container></section>
  </>
}
