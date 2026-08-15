import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { getArticleSummaries } from "@/lib/cms/articles"
import { formatArticleDate } from "@/lib/format"
import { SITE } from "@/lib/site"

const title = "Blogs"
const description =
  "Practical North Texas homebuyer field guides from Debra Allen — answer-first guidance with visible sources, clear program boundaries, and a real next step."

export const revalidate = 300

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `${title} | ${SITE.name}`,
    description,
    url: `${SITE.url}/blog`,
    siteName: SITE.name,
    type: "website",
  },
}

export default async function BlogPage() {
  const articles = await getArticleSummaries()
  const [lead, ...rest] = articles

  return (
    <>
      {/* ----------------------------------------------------------------- */}
      {/* Editorial masthead                                                */}
      {/* ----------------------------------------------------------------- */}
      <header className="border-b border-border bg-card">
        <Container className="py-12 md:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              The D&apos;Affordable Homes field guides
            </p>
            <h1 className="mt-5 text-balance text-[2.5rem] leading-[1.05] sm:text-[3.5rem] lg:text-[4rem]">
              Clear answers for the decisions ahead.
            </h1>
            <p className="mt-6 text-pretty text-lg leading-8 text-muted-foreground">
              Practical North Texas guidance to help you understand the process, prepare with confidence, and know what
              to ask next.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/consultation">Book a consultation</Button>
              <Button href="/calculators" variant="outline">
                Use the calculators
              </Button>
            </div>
          </div>

          <dl className="mt-12 grid gap-6 border-t border-border pt-8 sm:grid-cols-3">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Answer first</dt>
              <dd className="mt-2 text-[0.9375rem] leading-7 text-muted-foreground">
                Every guide opens with the direct answer, then explains what it depends on.
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Sources you can check</dt>
              <dd className="mt-2 text-[0.9375rem] leading-7 text-muted-foreground">
                Official program and agency links, with review dates and named authorship.
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Clear boundaries</dt>
              <dd className="mt-2 text-[0.9375rem] leading-7 text-muted-foreground">
                No fabricated statistics, rankings, affiliations, rebates, or approval promises.
              </dd>
            </div>
          </dl>
        </Container>
      </header>

      {articles.length === 0 ? (
        <Container className="py-20">
          <p className="text-lg text-muted-foreground">No field guides are published yet. Please check back soon.</p>
        </Container>
      ) : (
        <>
          {/* ------------------------------------------------------------- */}
          {/* Lead story                                                    */}
          {/* ------------------------------------------------------------- */}
          {lead && (
            <section className="py-14 md:py-20" aria-labelledby="lead-guide-heading">
              <Container>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Latest guide</p>
                <Link href={`/blog/${lead.slug}`} className="group mt-6 grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-14">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={lead.featuredImage.src}
                      alt={lead.featuredImage.alt}
                      fill
                      priority
                      sizes="(min-width: 1024px) 40rem, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      style={lead.featuredImage.focalPoint ? { objectPosition: lead.featuredImage.focalPoint } : undefined}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                      {lead.eyebrow ?? lead.category.title}
                    </p>
                    <h2
                      id="lead-guide-heading"
                      className="mt-4 text-balance text-[2rem] leading-[1.12] group-hover:text-accent sm:text-[2.75rem]"
                    >
                      {lead.title}
                    </h2>
                    <p className="mt-5 max-w-2xl text-pretty leading-8 text-muted-foreground">{lead.excerpt}</p>
                    <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{lead.author.displayName}</span>
                      <span>{lead.readingTimeMinutes} minute read</span>
                      <time dateTime={lead.reviewedAt}>Reviewed {formatArticleDate(lead.reviewedAt)}</time>
                    </div>
                    <span className="mt-7 inline-flex items-center gap-2 font-semibold text-accent underline-offset-4 group-hover:underline">
                      Read the guide
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </Container>
            </section>
          )}

          {/* ------------------------------------------------------------- */}
          {/* Remaining guides                                              */}
          {/* ------------------------------------------------------------- */}
          {rest.length > 0 && (
            <section className="border-t border-border py-14 md:py-20" aria-labelledby="more-guides-heading">
              <Container>
                <h2 id="more-guides-heading" className="text-[1.75rem] leading-tight sm:text-[2.25rem]">
                  Start with the question in front of you.
                </h2>
                <ul className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((article) => (
                    <li key={article._id}>
                      <Link href={`/blog/${article.slug}`} className="group flex h-full flex-col">
                        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted">
                          <Image
                            src={article.featuredImage.src}
                            alt={article.featuredImage.alt}
                            fill
                            sizes="(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 100vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                            style={
                              article.featuredImage.focalPoint
                                ? { objectPosition: article.featuredImage.focalPoint }
                                : undefined
                            }
                          />
                        </div>
                        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                          {article.eyebrow ?? article.category.title}
                        </p>
                        <h3 className="mt-2.5 text-balance text-[1.375rem] leading-snug group-hover:text-accent">
                          {article.title}
                        </h3>
                        <p className="mt-3 flex-1 text-[0.9375rem] leading-7 text-muted-foreground">{article.excerpt}</p>
                        <p className="mt-5 text-sm text-muted-foreground">
                          {article.readingTimeMinutes} minute read · Reviewed {formatArticleDate(article.reviewedAt)}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Container>
            </section>
          )}
        </>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Closing CTA                                                       */}
      {/* ----------------------------------------------------------------- */}
      <section className="border-t border-border bg-primary py-16 text-primary-foreground md:py-20">
        <Container className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground/70">Next step</p>
            <h2 className="mt-4 text-balance text-[2rem] leading-tight sm:text-[2.5rem]">
              Reading is preparation. A conversation is a plan.
            </h2>
            <p className="mt-5 max-w-2xl leading-8 text-primary-foreground/85">
              Bring your questions, your timeline, and your budget. You will leave knowing the next responsible step —
              not a sales pitch.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Button href="/consultation" variant="secondary">
              Book a consultation
            </Button>
            <Button
              href="/start"
              variant="ghost"
              className="border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              Find your next step
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}
