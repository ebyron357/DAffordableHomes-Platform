import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { draftMode } from "next/headers"

import { ArticleBlockRenderer, FaqSection, OfficialSources, READING_WIDTH } from "@/components/blog/blocks"
import { ArticleHeader } from "@/components/blog/article-header"
import { DraftBanner } from "@/components/blog/draft-banner"
import { Prose } from "@/components/blog/portable-text"
import { Container } from "@/components/ui/container"
import { getArticle } from "@/lib/blog/source"
import {
  articleJsonLd,
  authorProfilePath,
  breadcrumbJsonLd,
  collectFaqs,
  faqJsonLd,
} from "@/lib/blog/structured-data"
import type { Article } from "@/lib/blog/types"
import { toSafeHref } from "@/lib/safe-path"
import { SITE } from "@/lib/site"
import { cn } from "@/lib/utils"

/**
 * The single CMS-driven article route.
 *
 * Publishing a new article in Sanity puts it live here — no new route file, no
 * deploy. Unknown slugs return a real 404, and unpublished documents are only
 * reachable through authenticated draft mode.
 */

/**
 * Rendered on demand so that an unknown slug produces a *real* HTTP 404.
 *
 * Getting a genuine 404 here took three attempts, each ruled out by testing the
 * served status rather than by reading the code:
 *
 *  1. ISR (a route-level `revalidate`) makes Next treat an unknown slug as a
 *     cacheable miss and serve the not-found page with HTTP 200.
 *  2. `dynamicParams = false` does return 404 — at the routing layer, before
 *     render — but `generateStaticParams` is only evaluated at build time.
 *     ISR and `revalidatePath` never expand the allowed set, so a newly
 *     published article would 404 until the next deploy and a draft slug
 *     (absent from the published list) could never be previewed at all.
 *  3. `force-dynamic` alone still returned 200, because the app had a root
 *     `loading.tsx`. That Suspense boundary let Next flush the shell — and
 *     commit the 200 status — before this component ever called `notFound()`.
 *     Removing it fixed the status for every route in the app, not just this
 *     one. Do not reintroduce a root-level `loading.tsx`.
 *
 * `fetchCache` keeps the CMS reads on the tagged data cache, so dynamic
 * rendering does not mean a Content Lake round trip per request — the
 * `article` tag is invalidated by the publish webhook.
 */
export const dynamic = "force-dynamic"

export const fetchCache = "default-cache"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    // `notFound()` here, not a "not found" title: metadata resolves before the
    // page renders, and returning a normal Metadata object for a missing
    // article lets Next settle the response at HTTP 200 even though the page
    // itself later calls `notFound()`.
    notFound()
  }

  const canonical = `/blog/${article.slug}`
  const socialImage = article.socialImage ?? article.featuredImage

  return {
    title: article.seoTitle ?? article.title,
    description: article.seoDescription,
    alternates: { canonical },
    // Sanitised for the same reason as the JSON-LD author node: `author.url` is
    // free-form CMS text, and concatenating it raw both corrupts the URL and
    // publishes an off-site author identity.
    authors: [{ name: article.author.name, url: `${SITE.url}${authorProfilePath(article)}` }],
    openGraph: {
      type: "article",
      title: article.seoTitle ?? article.title,
      description: article.seoDescription,
      url: canonical,
      siteName: SITE.name,
      publishedTime: article.publishedAt,
      modifiedTime: article.reviewedAt ?? article.publishedAt,
      authors: [article.author.name],
      section: article.category.title,
      images: [{ url: socialImage.src, alt: socialImage.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.seoTitle ?? article.title,
      description: article.seoDescription,
      images: [socialImage.src],
    },
  }
}

function JsonLd({ value }: { value: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(value).replace(/</g, "\\u003c") }}
    />
  )
}

/** Blocks the article already renders in its body are not repeated at the end. */
function hasBlock(article: Article, type: string): boolean {
  return article.body.some((block) => block._type === type)
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    notFound()
  }

  const { isEnabled: isDraft } = await draftMode()

  return (
    <>
      <JsonLd value={articleJsonLd(article)} />
      <JsonLd value={breadcrumbJsonLd(article)} />
      {/* Covers FAQs supplied on the article and on any faqBlock in the body. */}
      {collectFaqs(article).length > 0 && <JsonLd value={faqJsonLd(article)} />}

      {isDraft && <DraftBanner slug={article.slug} />}

      <article>
        <ArticleHeader article={article} />

        <Container className="py-14 md:py-20">
          <div className="flex flex-col gap-14 md:gap-16">
            {article.body.map((block) => (
              <ArticleBlockRenderer key={block._key} block={block} />
            ))}

            {/* Article-level FAQs and sources render here when the editor has
                not placed the corresponding block inside the body. */}
            {!hasBlock(article, "faqBlock") && <FaqSection faqs={article.faqs} />}
            {!hasBlock(article, "officialSourcesBlock") && (
              <OfficialSources sources={article.sources} />
            )}

            {!hasBlock(article, "complianceDisclaimer") && article.notice.length > 0 && (
              <aside
                className={cn(READING_WIDTH, "rounded-xl border border-border bg-card p-6 sm:p-7")}
                aria-label="Important notice"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                  Important notice
                </p>
                <Prose
                  value={article.notice}
                  className="mt-3 text-[15px] leading-[1.75] text-muted-foreground"
                />
              </aside>
            )}

            {article.relatedLinks.length > 0 && (
              <nav
                className={cn(READING_WIDTH, "rounded-xl border border-border bg-muted/50 p-7 sm:p-9")}
                aria-label="Continue your plan"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                  Continue your plan
                </p>
                <ul className="mt-5 grid gap-x-8 divide-y divide-border sm:grid-cols-2 sm:divide-y-0">
                  {article.relatedLinks.map((link) => {
                    // Same runtime allowlist as rich-text links: schema
                    // validation only covers what the Studio can save.
                    const href = toSafeHref(link.href)
                    return (
                    <li key={link._key} className="py-4 sm:py-3">
                      {href ? (
                      <a
                        href={href}
                        className="font-semibold text-foreground underline decoration-transparent underline-offset-[3px] transition-colors hover:text-primary hover:decoration-accent"
                      >
                        {link.label}
                      </a>
                      ) : (
                        <span className="font-semibold text-foreground">{link.label}</span>
                      )}
                      <span className="mt-1 block text-[15px] leading-[1.6] text-muted-foreground">
                        {link.description}
                      </span>
                    </li>
                    )
                  })}
                </ul>
              </nav>
            )}
          </div>
        </Container>
      </article>
    </>
  )
}
