import "server-only"

import { getSanityClient, getSanityPreviewClient } from "./client"
import { isSanityConfigured } from "./env"
import { bootstrapArticleBySlug, bootstrapArticles } from "./bootstrap"
import {
  anyArticleBySlugQuery,
  publishedArticleBySlugQuery,
  publishedArticleSlugsQuery,
  publishedArticlesQuery,
} from "./queries"
import type { Article, ArticleSummary } from "./types"

/** Revalidation window for CMS-backed pages. Webhooks revalidate immediately. */
export const ARTICLE_REVALIDATE_SECONDS = 300

export type ArticleSlugRecord = {
  slug: string
  publishedAt: string
  reviewedAt: string
}

function toSummary(article: Article): ArticleSummary {
  return {
    _id: article._id,
    title: article.title,
    slug: article.slug,
    eyebrow: article.eyebrow,
    excerpt: article.excerpt,
    status: article.status,
    publishedAt: article.publishedAt,
    reviewedAt: article.reviewedAt,
    readingTimeMinutes: article.readingTimeMinutes,
    featuredImage: article.featuredImage,
    category: article.category,
    author: article.author,
  }
}

export async function getArticleSummaries(): Promise<ArticleSummary[]> {
  const client = getSanityClient()
  if (!client) return bootstrapArticles().map(toSummary)
  return client.fetch(
    publishedArticlesQuery,
    {},
    { next: { revalidate: ARTICLE_REVALIDATE_SECONDS, tags: ["article"] } }
  ) as Promise<ArticleSummary[]>
}

export async function getArticleSlugRecords(): Promise<ArticleSlugRecord[]> {
  const client = getSanityClient()
  if (!client) {
    return bootstrapArticles().map((article) => ({
      slug: article.slug,
      publishedAt: article.publishedAt,
      reviewedAt: article.reviewedAt,
    }))
  }
  return client.fetch(
    publishedArticleSlugsQuery,
    {},
    { next: { revalidate: ARTICLE_REVALIDATE_SECONDS, tags: ["article"] } }
  ) as Promise<ArticleSlugRecord[]>
}

/**
 * Fetches one article. In draft mode the preview client is used so unpublished
 * work is visible to an authenticated editor only; it never reaches the public
 * cache because draft-mode responses are always dynamic.
 */
export async function getArticle(slug: string, options: { draft?: boolean } = {}): Promise<Article | null> {
  if (!isSanityConfigured()) {
    return bootstrapArticleBySlug(slug)
  }

  if (options.draft) {
    const preview = getSanityPreviewClient()
    if (preview) {
      const draft = (await preview.fetch(anyArticleBySlugQuery, { slug })) as Article | null
      if (draft) return draft
    }
  }

  const client = getSanityClient()
  if (!client) return null
  return client.fetch(
    publishedArticleBySlugQuery,
    { slug },
    { next: { revalidate: ARTICLE_REVALIDATE_SECONDS, tags: ["article", `article:${slug}`] } }
  ) as Promise<Article | null>
}

/**
 * Related reading for an article. Editor-selected links win; otherwise the most
 * recent other articles are used so every article ends with a real next step.
 */
export async function getRelatedArticles(article: Article, limit = 3): Promise<ArticleSummary[]> {
  const summaries = await getArticleSummaries()
  return summaries.filter((candidate) => candidate.slug !== article.slug).slice(0, limit)
}
