import "server-only"

import { draftMode } from "next/headers"

import { getPreviewClient, getPublishedClient } from "@/cms/client"
import { isPreviewConfigured, isSanityConfigured } from "@/cms/env"

import {
  ARTICLES_QUERY,
  ARTICLE_BY_SLUG_PREVIEW_QUERY,
  ARTICLE_BY_SLUG_QUERY,
  ARTICLE_SLUGS_QUERY,
} from "./queries"
import { SEED_ARTICLES } from "./seed"
import type { Article, ArticleSummary } from "./types"

/** Cache tag invalidated by the Sanity publish webhook. */
export const ARTICLE_CACHE_TAG = "article"

const CACHE_OPTIONS = {
  next: { tags: [ARTICLE_CACHE_TAG], revalidate: 3600 },
}

function toSummary(article: Article): ArticleSummary {
  return {
    _id: article._id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    eyebrow: article.eyebrow,
    category: article.category,
    author: article.author,
    publishedAt: article.publishedAt,
    reviewedAt: article.reviewedAt,
    readingTime: article.readingTime,
    featuredImage: article.featuredImage,
  }
}

/** True when the current request is an authenticated draft preview. */
async function isDraftRequest(): Promise<boolean> {
  if (!isPreviewConfigured) return false
  try {
    const { isEnabled } = await draftMode()
    return isEnabled
  } catch {
    // `draftMode()` throws outside a request scope (e.g. during the sitemap
    // build). Treat that as a published-only read.
    return false
  }
}

/**
 * Resolves related-article summaries for the `relatedArticlesBlock`, which the
 * seed leaves empty because relationships are expressed as slugs.
 */
function hydrateRelated(article: Article, all: Article[]): Article {
  const related = article.relatedArticleSlugs
    .map((slug) => all.find((candidate) => candidate.slug === slug))
    .filter((candidate): candidate is Article => Boolean(candidate))
    .map(toSummary)

  if (related.length === 0) return article

  return {
    ...article,
    body: article.body.map((block) =>
      block._type === "relatedArticlesBlock" && block.articles.length === 0
        ? { ...block, articles: related }
        : block,
    ),
  }
}

/** Lists published articles, newest first. */
export async function listArticles(): Promise<ArticleSummary[]> {
  const client = getPublishedClient()
  if (!client) return SEED_ARTICLES.map(toSummary)

  const articles = await client.fetch<ArticleSummary[]>(ARTICLES_QUERY, {}, CACHE_OPTIONS)
  return articles ?? []
}

/** Every slug that should be prerendered and listed in the sitemap. */
export async function listArticleSlugs(): Promise<string[]> {
  const client = getPublishedClient()
  if (!client) return SEED_ARTICLES.map((article) => article.slug)

  const slugs = await client.fetch<string[]>(ARTICLE_SLUGS_QUERY, {}, CACHE_OPTIONS)
  return slugs ?? []
}

/**
 * Loads one article. Returns `null` for unknown slugs and for unpublished
 * documents outside draft mode, so `/blog/[slug]` can render a real 404.
 */
export async function getArticle(slug: string): Promise<Article | null> {
  if (!isSanityConfigured) {
    const seeded = SEED_ARTICLES.find((article) => article.slug === slug)
    return seeded ? hydrateRelated(seeded, SEED_ARTICLES) : null
  }

  if (await isDraftRequest()) {
    const preview = getPreviewClient()
    if (preview) {
      const draft = await preview.fetch<Article | null>(ARTICLE_BY_SLUG_PREVIEW_QUERY, { slug })
      return draft ?? null
    }
  }

  const client = getPublishedClient()
  if (!client) return null

  const article = await client.fetch<Article | null>(
    ARTICLE_BY_SLUG_QUERY,
    { slug },
    CACHE_OPTIONS,
  )
  return article ?? null
}

/** Whether the blog is currently served from the Content Lake or the seed. */
export function getContentSource(): "sanity" | "seed" {
  return isSanityConfigured ? "sanity" : "seed"
}
