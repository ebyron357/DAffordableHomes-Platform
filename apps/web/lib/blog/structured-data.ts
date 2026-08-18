/**
 * Structured data generated from CMS fields.
 *
 * Nothing here is hand-authored per article: every value comes from the
 * article document, so a newly published article emits complete JSON-LD
 * without a code change.
 */

import { toSafeInternalPath } from "@/lib/safe-path"
import { SITE } from "@/lib/site"
import type { Article, ArticleBlock, ArticleFaq } from "./types"

function absolute(path: string): string {
  return path.startsWith("http") ? path : `${SITE.url}${path}`
}

/**
 * The author's profile path, constrained to this origin.
 *
 * `author.url` is a free-form CMS string that is published as the author's
 * identity in Article JSON-LD and in Open Graph metadata. Left unsanitised, an
 * absolute value passes straight through `absolute()` and attributes the
 * article to another site, and a protocol-relative one becomes a path that
 * leaves the origin. Anything that is not already a safe same-origin path falls
 * back to `/about`.
 */
export function authorProfilePath(article: Article): string {
  return toSafeInternalPath(article.author.url, "/about")
}

export function articleJsonLd(article: Article): Record<string, unknown> {
  const url = `${SITE.url}/blog/${article.slug}`
  const image = article.socialImage ?? article.featuredImage

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.seoDescription,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: article.publishedAt,
    dateModified: article.reviewedAt ?? article.publishedAt,
    articleSection: article.category.title,
    image: [absolute(image.src)],
    inLanguage: "en-US",
    author: {
      "@type": "Person",
      name: article.author.role
        ? `${article.author.name}, ${article.author.role}`
        : article.author.name,
      url: absolute(authorProfilePath(article)),
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
      url: SITE.url,
    },
    about: [...article.programs, ...article.areas].map((topic) => ({
      "@type": "Thing",
      name: topic
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    })),
    citation: article.sources.map((source) => ({
      "@type": "CreativeWork",
      name: source.label,
      url: source.href,
      ...(source.publisher
        ? { publisher: { "@type": "Organization", name: source.publisher } }
        : {}),
    })),
  }
}

export function breadcrumbJsonLd(article: Article): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Blogs", item: `${SITE.url}/blog` },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `${SITE.url}/blog/${article.slug}`,
      },
    ],
  }
}

/**
 * The FAQs that are actually rendered on the page.
 *
 * This has to mirror the article route exactly, because JSON-LD that does not
 * match the visible page is worse than none:
 *
 *  - When the body contains one or more `faqBlock`s, those blocks render and
 *    the article-level list does not. Collecting the union here would publish
 *    FAQs that never appear on the page.
 *  - When the body contains no `faqBlock`, the route falls back to rendering
 *    the article-level list.
 *
 * Blocks that reuse the article-level list resolve to the same entries — the
 * three migrated articles do exactly that — so this dedupes by question rather
 * than concatenating.
 */
export function collectFaqs(article: Article): ArticleFaq[] {
  const blocks = article.body.filter(
    (block): block is Extract<ArticleBlock, { _type: "faqBlock" }> =>
      block._type === "faqBlock",
  )

  const source = blocks.length > 0 ? blocks.flatMap((block) => block.faqs) : article.faqs

  const seen = new Set<string>()
  const collected: ArticleFaq[] = []

  for (const faq of source) {
    const key = faq.question.trim().toLowerCase()
    if (!key || seen.has(key)) continue
    seen.add(key)
    collected.push(faq)
  }

  return collected
}

export function faqJsonLd(article: Article): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: collectFaqs(article).map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  }
}
