import { SITE } from "@/lib/site"

import type { Article } from "./types"

export function articleUrl(slug: string): string {
  return `${SITE.url}/blog/${slug}`
}

export function articleCanonical(article: Pick<Article, "slug" | "canonicalOverride">): string {
  return article.canonicalOverride?.trim() || articleUrl(article.slug)
}

function absolute(path: string | undefined): string | undefined {
  if (!path) return undefined
  if (path.startsWith("http://") || path.startsWith("https://")) return path
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`
}

export function buildArticleSchema(article: Article) {
  const url = articleCanonical(article)
  const image = absolute(article.socialImage?.src ?? article.featuredImage.src)

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.seoDescription,
    ...(image ? { image: [image] } : {}),
    datePublished: article.publishedAt,
    dateModified: article.reviewedAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    wordCount: undefined,
    articleSection: article.category.title || undefined,
    author: {
      "@type": "Person",
      name: article.author.displayName || SITE.realtorName,
      ...(article.author.profilePath ? { url: absolute(article.author.profilePath) } : {}),
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
      url: SITE.url,
    },
    about: [
      ...article.programs.map((program) => program.title),
      ...article.areas.map((area) => area.title),
    ].filter(Boolean),
    isAccessibleForFree: true,
  }
}

export function buildFaqSchema(article: Article) {
  if (!article.faqs.length) return null
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

export function buildBreadcrumbSchema(article: Pick<Article, "slug" | "title" | "canonicalOverride">) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Blogs", item: `${SITE.url}/blog` },
      { "@type": "ListItem", position: 3, name: article.title, item: articleCanonical(article) },
    ],
  }
}

export { absolute as absoluteUrl }
