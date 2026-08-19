import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ArticleImage } from "@/components/blog/article-image"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { getPublishedArticles } from "@/lib/blog/source"
import type { ArticleSummary } from "@/lib/blog/types"
import { SITE } from "@/lib/site"
import { cn } from "@/lib/utils"

const TITLE = "Blogs"
const DESCRIPTION = "Practical North Texas homebuyer field guides from Debra Allen."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `${TITLE} | ${SITE.name}`,
    description: DESCRIPTION,
    url: "/blog",
    type: "website",
  },
}

function formatDate(value: string): string {
  return new Date(`${value}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
}

function ArticleMeta({ article, className }: { article: ArticleSummary; className?: string }) {
  return (
    <p className={className}>
      <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
      <span aria-hidden="true"> · </span>
      {article.readingTime}
    </p>
  )
}

function LeadArticle({ article }: { article: ArticleSummary }) {
  const hasImage = article.featuredImageLayout !== "editorial" && Boolean(article.featuredImage)

  return (
    <article className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Latest — {article.category?.title ?? article.eyebrow}
        </p>
        <h2 className="mt-4 text-balance font-serif text-[2rem] leading-[1.1] sm:text-[2.75rem]">
          <Link href={`/blog/${article.slug}`} className="transition-colors hover:text-primary">
            {article.title}
          </Link>
        </h2>
        <p className="mt-5 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">{article.excerpt}</p>
        <ArticleMeta article={article} className="mt-6 text-sm text-muted-foreground" />
        <Link
          href={`/blog/${article.slug}`}
          className="mt-7 inline-flex min-h-12 items-center gap-2 text-[15px] font-semibold text-primary underline decoration-accent/50 underline-offset-4 hover:decoration-accent"
        >
          Read the guide
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      {hasImage && article.featuredImage ? (
        <Link
          href={`/blog/${article.slug}`}
          aria-hidden="true"
          tabIndex={-1}
          className="relative block aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted"
        >
          <ArticleImage image={article.featuredImage} sizes="(min-width: 1024px) 36rem, 100vw" priority />
        </Link>
      ) : (
        <div
          aria-hidden="true"
          className="flex aspect-[4/3] items-end rounded-2xl border border-border bg-primary p-8 text-primary-foreground"
        >
          <p className="font-serif text-2xl leading-snug text-primary-foreground/90">
            {article.eyebrow ?? article.category?.title}
          </p>
        </div>
      )}
    </article>
  )
}

function ArticleCard({ article, index }: { article: ArticleSummary; index: number }) {
  const hasImage = article.featuredImageLayout !== "editorial" && Boolean(article.featuredImage)

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-accent">
      {hasImage && article.featuredImage ? (
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <ArticleImage image={article.featuredImage} sizes="(min-width: 1024px) 32rem, (min-width: 768px) 46vw, 100vw" />
        </div>
      ) : (
        // Editorial treatment for articles with no trustworthy, non-misleading
        // photograph. A typographic panel, not an empty placeholder.
        <div
          aria-hidden="true"
          className="flex aspect-[16/10] flex-col justify-between bg-primary p-6 text-primary-foreground"
        >
          <span className="font-serif text-4xl leading-none text-primary-foreground/45">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-serif text-2xl leading-snug text-primary-foreground">
            {article.eyebrow ?? article.category?.title}
          </span>
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          {article.category?.title ?? article.eyebrow}
        </p>
        <h3 className="mt-3 font-serif text-xl leading-snug text-foreground sm:text-2xl">
          <Link href={`/blog/${article.slug}`} className="transition-colors group-hover:text-primary">
            {article.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-[0.9375rem] leading-7 text-muted-foreground">{article.excerpt}</p>
        <ArticleMeta article={article} className="mt-6 text-sm text-muted-foreground" />
      </div>
    </article>
  )
}

export default async function BlogIndexPage() {
  const articles = await getPublishedArticles()
  const lead: ArticleSummary | undefined = articles[0]
  const rest = articles.slice(1)

  return (
    <>
      <header className="border-b border-border bg-card">
        <Container className="py-14 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-center lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Homebuyer resources</p>
              <h1 className="mt-4 max-w-4xl text-balance font-serif text-[2.5rem] leading-[1.06] sm:text-[3.5rem]">
                Clear answers for the decisions ahead.
              </h1>
              <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
                Practical North Texas guidance to help you understand the process, prepare with confidence, and know
                what to ask next.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/consultation" size="lg">
                  Book Consultation
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
                <Button href="/calculators" variant="outline" size="lg">
                  Use the calculators
                </Button>
              </div>
            </div>
            <figure className="relative mx-auto aspect-[4/5] w-full max-w-[320px] overflow-hidden rounded-2xl border border-border bg-muted">
              <Image
                src="/images/debra-allen-primary-about.webp"
                alt="Debra Allen smiling in a yellow blazer at a kitchen counter"
                fill
                sizes="320px"
                className="object-cover object-[48%_center]"
                priority
              />
            </figure>
          </div>
        </Container>
      </header>

      {!lead ? (
        <Container className="py-20">
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
            No articles are published yet. Published guides appear here as soon as they go live.
          </p>
        </Container>
      ) : (
        <>
          <section className="py-14 md:py-20" aria-labelledby="latest-guide-heading">
            <Container>
              <h2 id="latest-guide-heading" className="sr-only">
                Latest field guide
              </h2>
              <LeadArticle article={lead} />
            </Container>
          </section>

          {rest.length ? (
            <section className="border-t border-border py-14 md:py-20" aria-labelledby="all-guides-heading">
              <Container>
                <div className="flex flex-wrap items-end justify-between gap-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">All field guides</p>
                    <h2 id="all-guides-heading" className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">
                      Start with the question in front of you.
                    </h2>
                  </div>
                  <p className="max-w-md text-[0.9375rem] leading-7 text-muted-foreground">
                    Every guide names the organization responsible for each decision, cites its sources, and ends with a
                    practical next step.
                  </p>
                </div>
                {/* Column count follows the article count so a short list never
                    leaves an empty track on wide screens. */}
                <ul
                  className={cn(
                    "mt-12 grid gap-6 md:grid-cols-2",
                    rest.length >= 3 && "lg:grid-cols-3",
                    rest.length === 2 && "lg:max-w-5xl",
                  )}
                >
                  {rest.map((article, index) => (
                    <li key={article.slug} className="flex">
                      <ArticleCard article={article} index={index + 1} />
                    </li>
                  ))}
                </ul>
              </Container>
            </section>
          ) : null}
        </>
      )}

      <section className="border-t border-border bg-muted/50 py-14" aria-labelledby="article-standard-heading">
        <Container className="grid gap-8 md:grid-cols-3 md:gap-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Answer-first</p>
            <h2 id="article-standard-heading" className="mt-3 font-serif text-2xl leading-snug">
              Built for people and search systems
            </h2>
          </div>
          <p className="leading-7 text-muted-foreground">
            Clear questions, concise answers, meaningful headings, visible authorship, reviewed dates, and structured
            data help readers and answer engines understand each page.
          </p>
          <p className="leading-7 text-muted-foreground">
            No fabricated statistics, rankings, affiliations, testimonials, rebates, or approval promises. Program
            decisions stay with the organizations responsible for them.
          </p>
        </Container>
      </section>
    </>
  )
}
