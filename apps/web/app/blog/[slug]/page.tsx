import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { draftMode } from "next/headers"

import { ArticleBlockRenderer, FaqSection, OfficialSources, READING_WIDTH } from "@/components/blog/blocks"
import { ArticleHeader } from "@/components/blog/article-header"
import { DraftBanner } from "@/components/blog/draft-banner"
import { Prose } from "@/components/blog/portable-text"
import { Container } from "@/components/ui/container"
import { getArticle, listArticleSlugs } from "@/lib/blog/source"
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/blog/structured-data"
import type { Article } from "@/lib/blog/types"
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
 * Only slugs returned by `generateStaticParams` are routable.
 *
 * This is what makes an unknown slug a *real* 404. With `dynamicParams` left
 * at its default, Next treats an unknown slug as a cacheable ISR miss and
 * serves the not-found page with HTTP 200 — which looks right in a browser
 * and is wrong for every crawler.
 *
 * The published slug list is refreshed by ISR (`revalidate` below) and by the
 * Sanity publish webhook, which calls `revalidatePath("/blog")` and the
 * article path. Publishing still needs no new route file.
 */
export const dynamicParams = false

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await listArticleSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    return { title: "Article not found", robots: { index: false, follow: false } }
  }

  const canonical = `/blog/${article.slug}`
  const socialImage = article.socialImage ?? article.featuredImage

  return {
    title: article.seoTitle ?? article.title,
    description: article.seoDescription,
    alternates: { canonical },
    authors: [{ name: article.author.name, url: `${SITE.url}${article.author.url ?? "/about"}` }],
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
      {article.faqs.length > 0 && <JsonLd value={faqJsonLd(article)} />}

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
                  {article.relatedLinks.map((link) => (
                    <li key={link._key} className="py-4 sm:py-3">
                      <a
                        href={link.href}
                        className="font-semibold text-foreground underline decoration-transparent underline-offset-[3px] transition-colors hover:text-primary hover:decoration-accent"
                      >
                        {link.label}
                      </a>
                      <span className="mt-1 block text-[15px] leading-[1.6] text-muted-foreground">
                        {link.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </Container>
      </article>
    </>
  )
}
