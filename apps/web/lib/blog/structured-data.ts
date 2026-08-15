/**
 * Structured data generated from CMS fields.
 *
 * Nothing here is hand-authored per article: every value comes from the
 * article document, so a newly published article emits complete JSON-LD
 * without a code change.
 */

import { SITE } from "@/lib/site"
import type { Article } from "./types"

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

export function faqJsonLd(article: Article): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  }
}
