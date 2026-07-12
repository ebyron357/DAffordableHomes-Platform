import type { Metadata } from "next"
import Link from "next/link"
import { PageHeader } from "@/components/page/page-header"
import { Section } from "@/components/page/section"
import { Card } from "@/components/ui/card"
import { ArrowRight, BookOpen, Calculator, ClipboardList, Landmark } from "lucide-react"

export const metadata: Metadata = {
  title: "Resource Library",
  description:
    "Plain-language guides, checklists, and tools to help you plan for homeownership at your own pace — no sign-up required.",
}

const resources = [
  {
    icon: ClipboardList,
    title: "The homeownership roadmap",
    description: "A step-by-step view of the journey from renting to owning, so nothing catches you off guard.",
    href: "/first-time-buyers",
  },
  {
    icon: Landmark,
    title: "NACA program education",
    description: "Understand how the NACA program works and whether its affordability-focused path fits your goals.",
    href: "/naca",
  },
  {
    icon: Calculator,
    title: "Planning tools",
    description: "Budget and readiness tools that help you see where you stand today and what to work on next.",
    href: "/start",
  },
  {
    icon: BookOpen,
    title: "Articles & guides",
    description: "Short, jargon-free reads that explain the parts of buying people find most confusing.",
    href: "/blog",
  },
]

export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Plan"
        title="Everything you need to plan with confidence"
        intro="Free, honest resources you can use at your own pace. No pressure and no sign-up required — just clear information to help you take the next step."
        crumbs={[{ label: "Home", href: "/" }, { label: "Resource Library" }]}
      />
      <Section>
        <ul className="grid gap-6 sm:grid-cols-2">
          {resources.map((r) => {
            const Icon = r.icon
            return (
              <li key={r.title}>
                <Card className="h-full transition-colors hover:border-primary/40">
                  <Link href={r.href} className="group flex h-full flex-col gap-4">
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-serif text-xl text-foreground">{r.title}</span>
                    <span className="leading-relaxed text-muted-foreground">{r.description}</span>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-2 font-medium text-primary">
                      Explore
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </Card>
              </li>
            )
          })}
        </ul>
      </Section>
    </>
  )
}
