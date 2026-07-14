import type { Metadata } from "next"
import Link from "next/link"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"

export const metadata: Metadata = {
  title: "Plan & Resources",
  description:
    "Planning tools and trustworthy resources for future homeowners — budgeting, credit, saving, and understanding assistance programs.",
}

const groups = [
  {
    heading: "Understand your money",
    items: [
      { title: "Budgeting for a home", body: "See how monthly housing costs really work — beyond just the price tag." },
      { title: "Building & repairing credit", body: "What lenders look at, and steady ways to strengthen your profile." },
      { title: "Saving for a down payment", body: "Realistic saving strategies and what down payment assistance can do." },
    ],
  },
  {
    heading: "Understand the process",
    items: [
      { title: "The homeownership roadmap", body: "Every step from renting to keys, explained in plain language." },
      { title: "Assistance & special programs", body: "How programs like NACA and first-time buyer support work." },
      { title: "Working with a REALTOR®", body: "What guidance looks like and what to expect at each stage." },
    ],
  },
]

const links = [
  { label: "First-Time Buyer Guide", href: "/first-time-buyers" },
  { label: "NACA Education", href: "/naca" },
  { label: "Frequently Asked Questions", href: "/faq" },
  { label: "Find Your Next Step", href: "/start" },
]

export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Plan"
        title="Tools and resources to prepare with confidence"
        description="Good preparation removes fear. These resources help you understand your money and the process before you ever make an offer."
      />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            {groups.map((group) => (
              <div key={group.heading}>
                <Eyebrow>{group.heading}</Eyebrow>
                <div className="mt-5 flex flex-col gap-4">
                  {group.items.map((item) => (
                    <div key={item.title} className="rounded-xl border border-border bg-card p-6">
                      <h3 className="font-serif text-lg font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-2xl border border-border bg-secondary/60 p-8">
            <h2 className="font-serif text-xl font-semibold text-foreground">Jump to a guide</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-lg border border-border bg-card px-5 py-4 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>
    </>
  )
}
