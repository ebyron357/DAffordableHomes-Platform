import { draftMode } from "next/headers"
import { getPreviewClient, getPublishedClient } from "@/sanity/lib/client"
import {
  anyArticleBySlugQuery,
  publishedArticleBySlugQuery,
  publishedArticleSlugsQuery,
  publishedArticlesQuery,
} from "@/sanity/lib/queries"
import { isSanityConfigured } from "@/sanity/env"
import type { Article, ArticleSummary, ContentSource } from "./types"
import { datasetArticles } from "./dataset"

/**
 * Content access layer.
 *
 * When `NEXT_PUBLIC_SANITY_PROJECT_ID` is configured every read goes to the
 * Sanity Content Lake, and new articles are publishable from the Studio with no
 * code change. When it is not configured the application falls back to the
 * committed canonical dataset — the identical documents the import script
 * pushes into Sanity — so the published article URLs keep working in
 * environments without Content Lake credentials.
 */

export function contentSource(): ContentSource {
  return isSanityConfigured() ? "sanity" : "repository-dataset"
}

function datasetPublished(): Article[] {
  return datasetArticles
    .filter((entry) => entry.status === "published")
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
}

function toSummary(article: Article): ArticleSummary {
  return {
    slug: article.slug,
    title: article.title,
    eyebrow: article.eyebrow,
    excerpt: article.excerpt,
    readingTime: article.readingTime,
    publishedAt: article.publishedAt,
    reviewedAt: article.reviewedAt,
    category: article.category,
    featuredImage: article.featuredImage,
    featuredImageLayout: article.featuredImageLayout,
  }
}

async function previewEnabled(): Promise<boolean> {
  try {
    const { isEnabled } = await draftMode()
    return isEnabled
  } catch {
    return false
  }
}

/** Every published article, newest first. */
export async function getPublishedArticles(): Promise<ArticleSummary[]> {
  const client = getPublishedClient()
  if (client) {
    const articles = await client.fetch<Article[]>(publishedArticlesQuery, {}, { next: { tags: ["article"] } })
    return (articles ?? []).map(toSummary)
  }
  return datasetPublished().map(toSummary)
}

/**
 * A single article by slug. Unpublished documents resolve only when Next.js
 * draft mode is active and a Sanity viewer token is configured.
 */
export async function getArticle(slug: string): Promise<Article | null> {
  const isPreview = await previewEnabled()

  if (isPreview) {
    const previewClient = getPreviewClient()
    if (previewClient) {
      const draft = await previewClient.fetch<Article | null>(anyArticleBySlugQuery, { slug })
      if (draft) return draft
    }
  }

  const client = getPublishedClient()
  if (client) {
    return (
      (await client.fetch<Article | null>(
        publishedArticleBySlugQuery,
        { slug },
        { next: { tags: ["article", `article:${slug}`] } },
      )) ?? null
    )
  }

  return datasetPublished().find((entry) => entry.slug === slug) ?? null
}

/** Published slugs with their most recent review date, for sitemap output. */
export async function getPublishedArticleSlugs(): Promise<{ slug: string; reviewedAt: string }[]> {
  const client = getPublishedClient()
  if (client) {
    const rows = await client.fetch<{ slug: string; reviewedAt: string }[]>(
      publishedArticleSlugsQuery,
      {},
      { next: { tags: ["article"] } },
    )
    return rows ?? []
  }
  return datasetPublished().map((entry) => ({
    slug: entry.slug,
    reviewedAt: entry.reviewedAt ?? entry.publishedAt,
  }))
}
