import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"

const paths = [
  ["Compare calculators", "/calculators", "Plan affordability, cash needs, mortgage payments, and rent-versus-buy scenarios.", "Open calculators"],
  ["Explore neighborhoods", "/neighborhoods", "Compare verified DFW areas without fabricated scores, rankings, or price claims.", "View neighborhoods"],
  ["Work with Debra", "/consultation", "Talk through your goals and leave with a clear next action.", "Book consultation"],
] as const

const tools = [
  ["Mortgage payment", "/calculators/mortgage-payment", "Estimate principal, interest, taxes, insurance, and total monthly housing cost."],
  ["Home affordability", "/calculators/affordability", "Explore a conservative planning range based on income, debts, and assumptions."],
  ["Closing costs", "/calculators/closing-costs", "Estimate cash needed beyond the down payment."],
  ["Down payment planning", "/calculators/down-payment", "Compare common down-payment scenarios and cash-to-close needs."],
] as const

const programs = [
  {
    title: "NACA homebuyer help",
    href: "/programs/naca",
    body: "Understand the process before a DFW search and keep official program requirements visible.",
    action: "Explore NACA",
  },
  {
    title: "Homes for Heroes guidance",
    href: "/programs/homes-for-heroes",
    body: "Guidance for community heroes without unsupported promises about eligibility or benefits.",
    action: "Explore Homes for Heroes",
  },
] as const

const phases = [
  ["Assess readiness", "Review goals, timeline, credit, income, debts, and realistic starting options."],
  ["Prepare finances", "Understand financing paths, documents, savings, and cash-to-close needs."],
  ["Search and evaluate", "Compare homes, neighborhoods, tradeoffs, and true monthly costs."],
  ["Offer, close, transition", "Prepare an offer, navigate due diligence, close, and move forward confidently."],
] as const

export function ControlledHomeSections({ placement }: { placement: "before-debra" | "after-debra" }) {
  if (placement === "before-debra") {
    return (
      <>
        <section className="bg-card py-14 md:py-16" aria-labelledby="pathways-heading">
          <Container>
            <h2 id="pathways-heading" className="font-serif text-[31px] font-normal sm:text-[38px]">Start with the question in front of you.</h2>
            <p className="mt-3 max-w-3xl text-muted-foreground">Choose the clearest next step without forcing every visitor into the same path.</p>
            <div className="mt-7 grid md:grid-cols-3">
              {paths.map(([title, href, body, action], index) => (
                <article key={title} className="border-b border-border py-6 md:border-b-0 md:border-l md:px-7 md:first:border-l-0 md:first:pl-0">
                  <p className="text-xs font-semibold text-accent">0{index + 1}</p>
                  <h3 className="mt-3 font-sans text-xl font-semibold">{title}</h3>
                  <p className="mt-3 max-w-sm text-[15px] leading-6 text-muted-foreground">{body}</p>
                  <Link href={href} className="mt-4 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline">{action} →</Link>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section className="py-14 md:py-20" aria-labelledby="tools-heading">
          <Container>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 id="tools-heading" className="font-serif text-[31px] font-normal sm:text-[38px]">Planning tools that answer real questions</h2>
                <p className="mt-3 max-w-3xl text-muted-foreground">Use straightforward estimates to prepare better questions for a lender or consultation.</p>
              </div>
              <Link href="/resources/calculators" className="shrink-0 text-sm font-semibold text-primary hover:underline">View all calculators →</Link>
            </div>
            <div className="mt-7 border-t border-border">
              {tools.map(([title, href, body]) => (
                <Link key={href} href={href} className="grid gap-2 border-b border-border py-5 hover:bg-card md:grid-cols-[280px_1fr_auto] md:items-center md:gap-6">
                  <span className="font-semibold">{title}</span>
                  <span className="text-sm leading-6 text-muted-foreground">{body}</span>
                  <span className="text-sm font-semibold text-primary">Open tool →</span>
                </Link>
              ))}
            </div>
          </Container>
        </section>

        <section className="border-y border-border bg-card py-14 md:py-20" aria-labelledby="programs-heading">
          <Container>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Homebuyer programs</p>
                <h2 id="programs-heading" className="mt-3 font-serif text-[31px] font-normal sm:text-[38px]">Program-specific help, connected to one clear process</h2>
                <p className="mt-3 max-w-3xl text-muted-foreground">Understand the path before choosing it.</p>
              </div>
              <Link href="/programs" className="shrink-0 text-sm font-semibold text-primary hover:underline">Program overview →</Link>
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {programs.map((program) => (
                <article key={program.href} className="border border-border bg-background p-7 sm:p-9">
                  <h3 className="font-serif text-3xl font-normal">{program.title}</h3>
                  <p className="mt-4 leading-7 text-muted-foreground">{program.body}</p>
                  <Link href={program.href} className="mt-6 inline-block text-sm font-semibold text-primary hover:underline">{program.action} →</Link>
                </article>
              ))}
            </div>
          </Container>
        </section>
      </>
    )
  }

  return (
    <>
      <section className="py-14 md:py-20" aria-labelledby="process-heading">
        <Container>
          <h2 id="process-heading" className="font-serif text-[31px] font-normal sm:text-[38px]">Four phases. One informed decision at a time.</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">A professional overview of the journey—one clear decision at a time.</p>
          <ol className="mt-7 grid md:grid-cols-4">
            {phases.map(([title, body], index) => (
              <li key={title} className="border-b border-border py-5 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0">
                <span className="text-xs font-semibold text-accent">0{index + 1}</span>
                <h3 className="mt-3 font-sans text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-[1.6] text-muted-foreground">{body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>
      <section className="bg-primary py-11 text-primary-foreground">
        <Container className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="font-serif text-3xl font-normal">Ready for a clearer next step?</h2>
            <p className="mt-3 max-w-3xl text-primary-foreground/80">Schedule a homebuyer consultation to discuss your goals, questions, and current starting point.</p>
          </div>
          <Button href="/consultation" variant="secondary" size="lg">Book Consultation</Button>
        </Container>
      </section>
    </>
  )
}
