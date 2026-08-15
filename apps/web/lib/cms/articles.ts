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

/**
 * Runs a Content Lake read and degrades honestly.
 *
 * If Sanity is unreachable, misconfigured, or slow, the page must not throw —
 * an editorial outage should never take the homepage, the blog index, or the
 * sitemap down with it. The committed bootstrap documents are real, approved,
 * previously published content, so serving them is a safe degraded state rather
 * than a fabricated one.
 */
async function withFallback<T>(label: string, read: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    return await read()
  } catch (error) {
    console.error(`[cms] ${label} failed; serving the bootstrap content source instead.`, error)
    return fallback()
  }
}

export async function getArticleSummaries(): Promise<ArticleSummary[]> {
  const client = getSanityClient()
  if (!client) return bootstrapArticles().map(toSummary)

  return withFallback(
    "getArticleSummaries",
    () =>
      client.fetch(
        publishedArticlesQuery,
        {},
        { next: { revalidate: ARTICLE_REVALIDATE_SECONDS, tags: ["article"] } }
      ) as Promise<ArticleSummary[]>,
    () => bootstrapArticles().map(toSummary)
  )
}

export async function getArticleSlugRecords(): Promise<ArticleSlugRecord[]> {
  const bootstrapRecords = () =>
    bootstrapArticles().map((article) => ({
      slug: article.slug,
      publishedAt: article.publishedAt,
      reviewedAt: article.reviewedAt,
    }))

  const client = getSanityClient()
  if (!client) return bootstrapRecords()

  return withFallback(
    "getArticleSlugRecords",
    () =>
      client.fetch(
        publishedArticleSlugsQuery,
        {},
        { next: { revalidate: ARTICLE_REVALIDATE_SECONDS, tags: ["article"] } }
      ) as Promise<ArticleSlugRecord[]>,
    bootstrapRecords
  )
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
      try {
        const draft = (await preview.fetch(anyArticleBySlugQuery, { slug })) as Article | null
        if (draft) return draft
      } catch (error) {
        console.error(`[cms] draft read for "${slug}" failed.`, error)
      }
    }
  }

  const client = getSanityClient()
  if (!client) return bootstrapArticleBySlug(slug)

  return withFallback(
    `getArticle(${slug})`,
    () =>
      client.fetch(
        publishedArticleBySlugQuery,
        { slug },
        { next: { revalidate: ARTICLE_REVALIDATE_SECONDS, tags: ["article", `article:${slug}`] } }
      ) as Promise<Article | null>,
    () => bootstrapArticleBySlug(slug)
  )
}

/**
 * Related reading for an article.
 *
 * The editor's curated `relatedArticles` selection wins. Anything it does not
 * fill is topped up with the most recent other articles so every article still
 * ends with a real next step.
 */
export async function getRelatedArticles(article: Article, limit = 3): Promise<ArticleSummary[]> {
  const curated = (article.relatedArticles ?? []).filter(
    (candidate) => candidate?.slug && candidate.slug !== article.slug
  )
  if (curated.length >= limit) return curated.slice(0, limit)

  const seen = new Set([article.slug, ...curated.map((candidate) => candidate.slug)])
  const summaries = await getArticleSummaries()
  const filler = summaries.filter((candidate) => !seen.has(candidate.slug))

  return [...curated, ...filler].slice(0, limit)
}
