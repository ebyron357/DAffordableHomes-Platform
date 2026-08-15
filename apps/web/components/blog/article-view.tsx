import Link from "next/link"
import { ArrowRight, ChevronRight } from "lucide-react"
import { ArticleBody } from "@/components/blog/article-blocks"
import { ArticleImage } from "@/components/blog/article-image"
import { ArticleFaqs, ArticleRelatedLinks, ArticleSources } from "@/components/blog/article-modules"
import { ArticleProse } from "@/components/blog/portable-text"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import type { Article } from "@/lib/blog/types"
import { articleUrl, formatArticleDate, socialImageUrl } from "@/lib/blog/article-meta"
import { SITE } from "@/lib/site"

/**
 * The rendered article. Shared by the public /blog/[slug] route and the
 * draft-only /preview/[slug] route so both show byte-identical output.
 *
 * Presentation only: every string comes from the content source.
 */

function JsonLd({ value }: { value: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(value).replace(/</g, "\\u003c") }}
    />
  )
}

const formatDate = formatArticleDate

export function ArticleView({ article, isDraft }: { article: Article; isDraft: boolean }) {
  const url = articleUrl(article.slug)
  const image = socialImageUrl(article)
  const authorName = article.author.credential
    ? `${article.author.name}, ${article.author.credential}`
    : article.author.name

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.seoDescription,
    datePublished: article.publishedAt,
    dateModified: article.reviewedAt ?? article.publishedAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    articleSection: article.category?.title,
    wordCount: undefined,
    image: image ? [image] : undefined,
    author: {
      "@type": "Person",
      name: authorName,
      url: `${SITE.url}${article.author.profileUrl ?? "/about"}`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    about: [
      ...(article.programs ?? []).map((program) => program.title),
      ...(article.areas ?? []).map((area) => area.title),
    ],
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Blogs", item: `${SITE.url}/blog` },
      { "@type": "ListItem", position: 3, name: article.title, item: url },
    ],
  }

  const faqs = article.faqs ?? []
  const faqSchema = faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null

  const hasHeroImage = article.featuredImageLayout !== "editorial" && Boolean(article.featuredImage)

  return (
    <>
      <JsonLd value={articleSchema} />
      <JsonLd value={breadcrumbSchema} />
      {faqSchema ? <JsonLd value={faqSchema} /> : null}

      {isDraft ? (
        <div className="bg-warning text-warning-foreground">
          <Container className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm font-medium">
            <span>
              Preview mode — you are viewing unpublished content
              {article.status !== "published" ? ` (status: ${article.status})` : ""}.
            </span>
            <a href="/api/preview/disable" className="underline underline-offset-4">
              Exit preview
            </a>
          </Container>
        </div>
      ) : null}

      <article>
        <header className={hasHeroImage ? "bg-primary text-primary-foreground" : "border-b border-border bg-card"}>
          <Container className="pt-8 pb-12 md:pt-10 md:pb-16">
            <nav
              aria-label="Breadcrumb"
              className={hasHeroImage ? "text-sm text-primary-foreground/75" : "text-sm text-muted-foreground"}
            >
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link href="/" className="hover:underline">
                    Home
                  </Link>
                </li>
                <ChevronRight className="size-3.5" aria-hidden="true" />
                <li>
                  <Link href="/blog" className="hover:underline">
                    Blogs
                  </Link>
                </li>
                <ChevronRight className="size-3.5" aria-hidden="true" />
                <li aria-current="page" className="max-w-full truncate font-medium">
                  {article.title}
                </li>
              </ol>
            </nav>

            {/* Two columns only above 1280px: below that the headline needs the
                full measure to avoid wrapping into a narrow column. */}
            <div className="mt-8 grid gap-10 xl:grid-cols-[1.05fr_0.95fr] xl:items-center xl:gap-14">
              <div>
                <p
                  className={
                    hasHeroImage
                      ? "text-xs font-semibold uppercase tracking-[0.18em] text-accent-inverse"
                      : "text-xs font-semibold uppercase tracking-[0.18em] text-accent"
                  }
                >
                  {article.eyebrow ?? article.category?.title}
                </p>
                <h1 className="mt-4 max-w-3xl text-balance font-serif text-[2.375rem] leading-[1.08] sm:text-[3rem] lg:text-[3.25rem]">
                  {article.title}
                </h1>
                <p
                  className={cnHeroText(
                    hasHeroImage,
                    "mt-6 max-w-2xl text-pretty text-lg leading-8",
                  )}
                >
                  {article.excerpt}
                </p>
                <dl
                  className={cnHeroText(
                    hasHeroImage,
                    "mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm",
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <dt className="sr-only">Author</dt>
                    <dd>By {authorName}</dd>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <dt className="sr-only">Reading time</dt>
                    <dd>{article.readingTime}</dd>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <dt className="sr-only">Published</dt>
                    <dd>
                      <time dateTime={article.publishedAt}>Published {formatDate(article.publishedAt)}</time>
                    </dd>
                  </div>
                  {article.reviewedAt && article.reviewedAt !== article.publishedAt ? (
                    <div className="flex items-center gap-1.5">
                      <dt className="sr-only">Reviewed</dt>
                      <dd>
                        <time dateTime={article.reviewedAt}>Reviewed {formatDate(article.reviewedAt)}</time>
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </div>

              {hasHeroImage && article.featuredImage ? (
                <figure>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-primary-foreground/15 bg-muted">
                    <ArticleImage
                      image={article.featuredImage}
                      sizes="(min-width: 1280px) 40rem, (min-width: 640px) 92vw, 100vw"
                      priority
                    />
                  </div>
                  {article.featuredImage.caption ? (
                    <figcaption className="mt-3 text-sm leading-6 text-primary-foreground/70">
                      {article.featuredImage.caption}
                    </figcaption>
                  ) : null}
                </figure>
              ) : (
                <aside
                  className="rounded-2xl border-l-4 border-accent bg-muted p-6 sm:p-8"
                  aria-label="Editorial standard"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                    D&apos;Affordable Homes editorial standard
                  </p>
                  <p className="mt-3 leading-7 text-muted-foreground">
                    Answer-first, locally relevant guidance with clear program boundaries, visible sources, and
                    practical next steps.
                  </p>
                </aside>
              )}
            </div>
          </Container>
        </header>

        <Container className="grid gap-14 py-14 lg:grid-cols-[minmax(0,44rem)_minmax(0,1fr)] lg:gap-20 lg:py-20">
          <div className="min-w-0">
            <ArticleBody blocks={article.body} />

            <ArticleFaqs faqs={faqs} id="article-faqs" />

            <ArticleSources sources={article.officialSources ?? []} id="article-sources" />

            {article.disclaimer?.length ? (
              <aside
                className="mt-10 rounded-2xl border border-border bg-muted p-6 sm:p-8"
                aria-label="Program boundaries and important notice"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Important notice</p>
                <ArticleProse
                  value={article.disclaimer}
                  className="mt-2 [&_p]:text-[0.9375rem] [&_p]:leading-7 [&_p]:text-muted-foreground"
                />
              </aside>
            ) : null}
          </div>

          <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start" aria-label="Related resources">
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Written and reviewed by</p>
              <p className="mt-3 font-serif text-xl text-foreground">{authorName}</p>
              {article.author.bio ? (
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{article.author.bio}</p>
              ) : null}
              <Link
                href={article.author.profileUrl ?? "/about"}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline decoration-accent/50 underline-offset-4"
              >
                Meet {article.author.name.split(" ")[0]}
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>

            {article.relatedLinks?.length ? (
              <div className="mt-8">
                <ArticleRelatedLinks links={article.relatedLinks} id="article-related-resources" />
              </div>
            ) : null}

            <div className="mt-8 rounded-2xl border border-border bg-muted p-6">
              <p className="font-serif text-xl leading-snug text-foreground">Ready to talk about your next step?</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                A consultation is a calm conversation about where you are today and what a practical next step could
                look like.
              </p>
              <Button href="/consultation" className="mt-5 w-full">
                Book a consultation
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </aside>
        </Container>

        {article.relatedArticles?.length ? (
          <section className="border-t border-border bg-card py-14 md:py-20" aria-labelledby="keep-reading-heading">
            <Container>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Keep reading</p>
              <h2 id="keep-reading-heading" className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">
                More field guides from Debra
              </h2>
              <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {article.relatedArticles.map((related) => (
                  <li key={related.slug}>
                    <Link
                      href={`/blog/${related.slug}`}
                      className="group flex h-full flex-col rounded-2xl border border-border bg-background p-6 transition-colors hover:border-accent"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{related.eyebrow}</p>
                      <h3 className="mt-3 font-serif text-xl leading-snug text-foreground group-hover:text-primary">
                        {related.title}
                      </h3>
                      <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{related.excerpt}</p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                        {related.readingTime}
                        <ArrowRight
                          className="size-3.5 transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Container>
          </section>
        ) : null}
      </article>
    </>
  )}

function cnHeroText(onDark: boolean, base: string): string {
  return `${base} ${onDark ? "text-primary-foreground/85" : "text-muted-foreground"}`
}
