/**
 * Structured data generated from CMS fields.
 *
 * Nothing here is hand-authored per article: every value comes from the
 * article document, so a newly published article emits complete JSON-LD
 * without a code change.
 */

import { SITE } from "@/lib/site"
import type { Article, ArticleFaq } from "./types"

function absolute(path: string): string {
  return path.startsWith("http") ? path : `${SITE.url}${path}`
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
      url: absolute(article.author.url ?? "/about"),
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
 * Every FAQ visible on the page, from the article field and from any `faqBlock`
 * in the body, deduplicated by question.
 *
 * Both sources have to be considered. An editor can leave the article-level
 * list empty and put the FAQs on a block instead; the block renders them, so
 * emitting JSON-LD from `article.faqs` alone would ship visible FAQs with no
 * matching structured data. Blocks that reuse the article-level list resolve to
 * the same entries, which is why this dedupes rather than concatenates.
 */
export function collectFaqs(article: Article): ArticleFaq[] {
  const seen = new Set<string>()
  const collected: ArticleFaq[] = []

  const add = (faq: ArticleFaq) => {
    const key = faq.question.trim().toLowerCase()
    if (!key || seen.has(key)) return
    seen.add(key)
    collected.push(faq)
  }

  for (const faq of article.faqs) add(faq)
  for (const block of article.body) {
    if (block._type === "faqBlock") {
      for (const faq of block.faqs) add(faq)
    }
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
