/**
 * Structured data generated from CMS fields.
 *
 * Nothing here is hand-authored per article: every value comes from the
 * article document, so a newly published article emits complete JSON-LD
 * without a code change.
 */

import { toSafeHref, toSafeInternalPath } from "@/lib/safe-path"
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

/**
 * Display names for the CMS topic values.
 *
 * Title-casing the slug produced "Naca" and "Dallas Fort Worth" — a misspelled
 * program name published as the article's subject. These mirror the `title` of
 * each option in `cms/schema/documents/article.ts`; a test fails if a schema
 * value has no entry here. Unknown values still fall back to title case.
 */
export const TOPIC_LABELS: Record<string, string> = {
  naca: "NACA",
  "homes-for-heroes": "Homes for Heroes",
  "first-time-buyers": "First-time buyer programs",
  garland: "Garland",
  "dallas-fort-worth": "Dallas–Fort Worth",
  "north-texas": "North Texas",
}

function topicLabel(topic: string): string {
  return (
    TOPIC_LABELS[topic] ??
    topic
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  )
}

/**
 * The article's author as a schema.org Person.
 *
 * When the author is the site's own REALTOR®, the node carries the same `@id`
 * as the Person in the site-wide graph (app/layout.tsx), so search and answer
 * engines resolve the byline to one entity instead of an unlinked name. The
 * role is published as `jobTitle`, not appended to the name: "Debra Allen,
 * REALTOR®" is a person plus a title, not a different person.
 */
function authorNode(article: Article): Record<string, unknown> {
  const isSiteRealtor = article.author.name === SITE.realtorLegalName
  return {
    "@type": "Person",
    ...(isSiteRealtor ? { "@id": `${SITE.url}/#debra-allen` } : {}),
    name: article.author.name,
    ...(article.author.role ? { jobTitle: article.author.role } : {}),
    url: absolute(authorProfilePath(article)),
  }
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
    // `image` is recommended, not required, by schema.org. An article with no
    // photograph of its own subject publishes no image property rather than
    // asserting that an unrelated photograph depicts it.
    ...(image ? { image: [absolute(image.src)] } : {}),
    inLanguage: "en-US",
    author: authorNode(article),
    publisher: {
      "@type": "Organization",
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
      url: SITE.url,
      logo: { "@type": "ImageObject", url: `${SITE.url}/images/daffordable-homes-official-logo.png` },
    },
    about: [...article.programs, ...article.areas].map((topic) => ({
      "@type": "Thing",
      name: topicLabel(topic),
    })),
    citation: citations(article),
  }
}

function citations(article: Article): Record<string, unknown>[] {
  return article.sources.flatMap((source) => {
    const href = toSafeHref(source.href)
    if (!href) return []
    return [
      {
        "@type": "CreativeWork",
        name: source.label,
        url: href.startsWith("/") ? `${SITE.url}${href}` : href,
        ...(source.publisher
          ? { publisher: { "@type": "Organization", name: source.publisher } }
          : {}),
      },
    ]
  })
}

export function breadcrumbJsonLd(article: Article): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE.url}/blog` },
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
