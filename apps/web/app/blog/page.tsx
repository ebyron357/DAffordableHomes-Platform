import type { Metadata } from "next"
import Link from "next/link"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Homebuyer Field Guides and Articles",
  description:
    "In-depth North Texas homebuyer field guides from Debra Allen covering NACA, community heroes, Garland, affordability, and practical transaction planning.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Homebuyer Field Guides | D'Affordable Homes",
    description: "Original, fact-checked North Texas real-estate guidance from Debra Allen, REALTOR®.",
    url: "/blog",
    type: "website",
  },
}

const articles = [
  {
    href: "/blog/naca-homebuying-dallas-fort-worth",
    eyebrow: "NACA field guide",
    title: "Using NACA to Buy a Home in Dallas–Fort Worth",
    description:
      "Understand workshops, counseling, qualification, outside-agent procedures, property review, and Debra's role in the real-estate transaction.",
    readingTime: "10 minute read",
  },
  {
    href: "/blog/homes-for-heroes-north-texas",
    eyebrow: "Community heroes",
    title: "How Debra Allen Helps North Texas Heroes Buy or Sell a Home",
    description:
      "A practical buying, selling, and move-planning guide for military members, veterans, teachers, healthcare workers, firefighters, EMS, and law enforcement.",
    readingTime: "9 minute read",
  },
  {
    href: "/blog/how-to-buy-home-garland-tx",
    eyebrow: "Garland field guide",
    title: "How to Buy a Home in Garland, Texas",
    description:
      "A step-by-step guide to budgeting, financing, local assistance boundaries, touring, inspections, offers, underwriting, and closing.",
    readingTime: "12 minute read",
  },
] as const

export default function BlogPage() {
  return (
    <>
      <header className="border-b border-border bg-card">
        <Container className="py-12 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">D&apos;Affordable Homes editorial</p>
          <h1 className="mt-4 max-w-5xl font-serif text-[42px] font-normal leading-[1.08] sm:text-[58px]">
            Homebuyer field guides built for real decisions
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            Original, source-backed guidance from Debra Allen, REALTOR®—written to answer the question first, explain the tradeoffs clearly, and connect North Texas buyers with the right next step.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/book">Schedule a consultation</Button>
            <Button href="/resources/calculators" variant="outline">Use the planning calculators</Button>
          </div>
        </Container>
      </header>

      <main>
        <section className="py-14 md:py-20" aria-labelledby="latest-guides-heading">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Latest field guides</p>
                <h2 id="latest-guides-heading" className="mt-3 font-serif text-3xl font-normal sm:text-4xl">Read deeply. Act clearly.</h2>
                <p className="mt-4 max-w-xl leading-7 text-muted-foreground">Each article includes a direct answer, visible program boundaries, local context, official sources, frequently asked questions, and related planning tools.</p>
              </div>
              <div className="border-t border-border">
                {articles.map((article, index) => (
                  <article key={article.href} className="grid gap-5 border-b border-border py-8 sm:grid-cols-[4rem_1fr_auto] sm:items-start">
                    <p className="text-xs font-semibold text-accent">0{index + 1}</p>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">{article.eyebrow}</p>
                      <h3 className="mt-3 font-serif text-2xl font-normal leading-tight sm:text-3xl">
                        <Link href={article.href} className="hover:text-primary">{article.title}</Link>
                      </h3>
                      <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">{article.description}</p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-sm text-muted-foreground">{article.readingTime}</p>
                      <Link href={article.href} className="mt-3 inline-block font-semibold text-primary underline underline-offset-4">Read the guide</Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </Container>
        </section>

        <section className="border-y border-border bg-muted/50 py-12" aria-labelledby="article-standard-heading">
          <Container className="grid gap-8 md:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Answer-first</p>
              <h2 id="article-standard-heading" className="mt-3 font-serif text-2xl font-normal">Built for people and search systems</h2>
            </div>
            <p className="leading-7 text-muted-foreground">Clear questions, concise answers, meaningful headings, visible authorship, reviewed dates, and structured data help readers and answer engines understand each page.</p>
            <p className="leading-7 text-muted-foreground">No fabricated statistics, rankings, affiliations, testimonials, rebates, or approval promises. Program decisions stay with the organizations responsible for them.</p>
          </Container>
        </section>
      </main>
    </>
  )
}
