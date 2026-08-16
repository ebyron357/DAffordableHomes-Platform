import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { ArticleBody, FaqList, SourceLinks } from "@/components/blog/article-body"
import { RichText } from "@/components/blog/portable-text"
import { JsonLd } from "@/components/json-ld"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { getRelatedArticles } from "@/lib/cms/articles"
import { buildArticleSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/cms/structured-data"
import { SITE } from "@/lib/site"
import { formatArticleDate } from "@/lib/format"
import { safeInternalPath } from "@/lib/cms/links"
import type { Article } from "@/lib/cms/types"

/**
 * The article page itself. Shared by the public `/blog/[slug]` route and the
 * draft-only `/preview/[slug]` route so an editor previews exactly what will
 * publish, with no second implementation to drift.
 */
export async function ArticleView({ article, isDraft = false }: { article: Article; isDraft?: boolean }) {
  const related = await getRelatedArticles(article)
  const faqSchema = buildFaqSchema(article)
  const author = article.author.displayName || SITE.realtorName

  return (
    <>
      <JsonLd value={buildArticleSchema(article)} />
      {faqSchema && <JsonLd value={faqSchema} />}
      <JsonLd value={buildBreadcrumbSchema(article)} />

      {isDraft && (
        <div className="bg-warning text-warning-foreground">
          <Container className="flex flex-wrap items-center justify-between gap-3 py-2.5 text-sm">
            <p className="font-semibold">
              Draft preview — this page shows unpublished content and is not indexed.
            </p>
            <a
              href={`/api/preview/disable?path=${encodeURIComponent(
                article.status === "published" ? `/blog/${article.slug}` : "/blog"
              )}`}
              className="font-semibold underline underline-offset-4"
            >
              Exit preview
            </a>
          </Container>
        </div>
      )}

      <article>
        {/* ------------------------------------------------------------- */}
        {/* Masthead                                                      */}
        {/* ------------------------------------------------------------- */}
        <header className="border-b border-border bg-card">
          <Container className="py-10 md:py-16">
            <nav aria-label="Breadcrumb" className="-my-2">
              <ol className="flex flex-wrap items-center gap-x-1 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/"
                    className="inline-flex min-h-11 items-center px-1 underline-offset-4 hover:text-accent hover:underline"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href="/blog"
                    className="inline-flex min-h-11 items-center px-1 underline-offset-4 hover:text-accent hover:underline"
                  >
                    Blogs
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="max-w-full truncate py-2 pl-1 font-medium text-foreground" aria-current="page">
                  {article.title}
                </li>
              </ol>
            </nav>

            <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-14">
              <div>
                {article.eyebrow && (
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{article.eyebrow}</p>
                )}
                <h1 className="mt-4 text-balance text-[2.25rem] leading-[1.1] sm:text-[3rem] lg:text-[3.25rem]">
                  {article.title}
                </h1>
                <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">{article.excerpt}</p>

                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-6 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {article.author.profilePath ? (
                      <Link
                        href={safeInternalPath(article.author.profilePath)}
                        className="inline-flex min-h-11 items-center underline-offset-4 hover:text-accent hover:underline"
                      >
                        {author}
                      </Link>
                    ) : (
                      author
                    )}
                  </span>
                  {article.category.title && (
                    <span className="rounded-full border border-border px-3 py-1 text-xs font-medium uppercase tracking-[0.08em]">
                      {article.category.title}
                    </span>
                  )}
                  <span>{article.readingTimeMinutes} minute read</span>
                  <time dateTime={article.reviewedAt}>Reviewed {formatArticleDate(article.reviewedAt)}</time>
                </div>
              </div>

              <figure className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted sm:aspect-[3/2] lg:aspect-[4/5]">
                <Image
                  src={article.featuredImage.src}
                  alt={article.featuredImage.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 34rem, (min-width: 640px) 90vw, 100vw"
                  className="object-cover"
                  style={
                    article.featuredImage.focalPoint ? { objectPosition: article.featuredImage.focalPoint } : undefined
                  }
                />
              </figure>
            </div>
          </Container>
        </header>

        {/* ------------------------------------------------------------- */}
        {/* Body + rail                                                   */}
        {/* ------------------------------------------------------------- */}
        <Container className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-16 lg:py-20">
          <div className="min-w-0 lg:max-w-[46rem]">
            <ArticleBody body={article.body} />

            {article.faqs.length > 0 && (
              <section aria-labelledby="article-faq-heading" className="mt-16 border-t border-border pt-12">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Direct answers</p>
                <h2 id="article-faq-heading" className="mt-3 text-[1.75rem] leading-tight sm:text-[2rem]">
                  Frequently asked questions
                </h2>
                <FaqList faqs={article.faqs} idPrefix="article-faq" />
              </section>
            )}

            {article.sources.length > 0 && (
              <section aria-labelledby="article-sources-heading" className="mt-16 border-t border-border pt-12">
                <h2 id="article-sources-heading" className="text-[1.75rem] leading-tight sm:text-[2rem]">
                  Official sources and review notes
                </h2>
                <p className="mt-4 leading-7 text-muted-foreground">
                  Program rules and public resources can change. Confirm current requirements with the organization
                  responsible for the decision.
                </p>
                <SourceLinks sources={article.sources} />
                <p className="mt-6 text-sm text-muted-foreground">
                  Published {formatArticleDate(article.publishedAt)} · Last reviewed{" "}
                  {formatArticleDate(article.reviewedAt)} by {author}.
                </p>
              </section>
            )}

            {article.complianceNotice.length > 0 && (
              <aside
                className="mt-10 rounded-xl border border-border bg-muted/70 p-6 text-[0.9375rem] leading-7 text-muted-foreground"
                aria-label="Important notice"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Important notice
                </p>
                <div className="mt-3">
                  <RichText value={article.complianceNotice} compact />
                </div>
              </aside>
            )}

            <div className="mt-12">
              <Link
                href="/blog"
                className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent underline-offset-4 hover:underline"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                All field guides
              </Link>
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start" aria-label="Related resources">
            {article.author.bio && (
              <div className="rounded-xl border border-border bg-card p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Written and reviewed by</p>
                <p className="mt-3 font-serif text-lg">{author}</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{article.author.bio}</p>
                {article.author.profilePath && (
                  <Link
                    href={safeInternalPath(article.author.profilePath)}
                    className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-accent underline-offset-4 hover:underline"
                  >
                    About {article.author.name.split(" ")[0]}
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                )}
              </div>
            )}

            {article.relatedLinks.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Continue your plan</p>
                <ul className="mt-4 divide-y divide-border">
                  {article.relatedLinks.map((link) => (
                    <li key={link._key}>
                      <Link href={safeInternalPath(link.href)} className="group block py-4 first:pt-0 last:pb-0">
                        <span className="font-medium text-foreground group-hover:text-accent">{link.label}</span>
                        {link.description && (
                          <span className="mt-1 block text-sm leading-6 text-muted-foreground">{link.description}</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-xl bg-primary p-6 text-primary-foreground">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground/70">
                Talk it through
              </p>
              <p className="mt-3 font-serif text-lg leading-snug">Get a clear next step for your situation.</p>
              <Button href="/consultation" variant="secondary" className="mt-5 w-full">
                Book a consultation
              </Button>
            </div>
          </aside>
        </Container>

        {/* ------------------------------------------------------------- */}
        {/* Keep reading                                                  */}
        {/* ------------------------------------------------------------- */}
        {related.length > 0 && (
          <section className="border-t border-border bg-card py-14 md:py-20" aria-labelledby="keep-reading-heading">
            <Container>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Keep reading</p>
                  <h2 id="keep-reading-heading" className="mt-3 text-[1.75rem] leading-tight sm:text-[2.25rem]">
                    More field guides
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent underline-offset-4 hover:underline"
                >
                  View all
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>

              <ul
                className={`mt-10 grid gap-8 sm:grid-cols-2 ${related.length >= 3 ? "lg:grid-cols-3" : "lg:max-w-4xl"}`}
              >
                {related.map((summary) => (
                  <li key={summary._id}>
                    <Link href={`/blog/${summary.slug}`} className="group flex h-full flex-col">
                      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted">
                        <Image
                          src={summary.featuredImage.src}
                          alt={summary.featuredImage.alt}
                          fill
                          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                          style={
                            summary.featuredImage.focalPoint
                              ? { objectPosition: summary.featuredImage.focalPoint }
                              : undefined
                          }
                        />
                      </div>
                      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                        {summary.eyebrow ?? summary.category.title}
                      </p>
                      <h3 className="mt-2.5 text-xl leading-snug group-hover:text-accent">{summary.title}</h3>
                      <p className="mt-3 line-clamp-3 text-[0.9375rem] leading-7 text-muted-foreground">
                        {summary.excerpt}
                      </p>
                      <p className="mt-4 text-sm text-muted-foreground">{summary.readingTimeMinutes} minute read</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </Container>
          </section>
        )}
      </article>
    </>
  )
}
