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
 *
 * A configured-but-failing provider falls back the same way. An outage in the
 * Content Lake must not take down `/blog`, the article routes, or the sitemap;
 * degrading to the committed dataset is exactly what that dataset is for.
 */

export function contentSource(): ContentSource {
  return isSanityConfigured() ? "sanity" : "repository-dataset"
}

type FetchResult<T> = { ok: true; value: T } | { ok: false }

/**
 * Runs a Content Lake read without throwing, so the caller can serve the
 * committed dataset during a provider failure.
 *
 * Success and failure are distinguished explicitly. A successful read that
 * returned nothing is authoritative — falling back on it would resurrect an
 * unpublished or archived article from the seed dataset.
 */
async function tryFetch<T>(operation: string, run: () => Promise<T>): Promise<FetchResult<T>> {
  try {
    return { ok: true, value: await run() }
  } catch (error) {
    console.warn(
      `[content] Sanity read "${operation}" failed; serving the committed article dataset. ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
    return { ok: false }
  }
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
    const articles = await tryFetch("publishedArticles", () =>
      client.fetch<Article[]>(publishedArticlesQuery, {}, { next: { tags: ["article"] } }),
    )
    if (articles.ok) return (articles.value ?? []).map(toSummary)
  }
  return datasetPublished().map(toSummary)
}

/**
 * A single article by slug. Unpublished documents resolve only when Next.js
 * draft mode is active and a Sanity viewer token is configured.
 */
export async function getArticle(slug: string): Promise<Article | null> {
  if (await previewEnabled()) {
    const previewClient = getPreviewClient()
    if (previewClient) {
      const draft = await tryFetch("draftArticle", () =>
        previewClient.fetch<Article | null>(anyArticleBySlugQuery, { slug }),
      )
      if (draft.ok && draft.value) return draft.value
    }
  }

  const client = getPublishedClient()
  if (client) {
    const article = await tryFetch("publishedArticle", () =>
      client.fetch<Article | null>(
        publishedArticleBySlugQuery,
        { slug },
        { next: { tags: ["article", `article:${slug}`] } },
      ),
    )
    if (article.ok) return article.value ?? null
  }

  return datasetPublished().find((entry) => entry.slug === slug) ?? null
}

/** Published slugs with their most recent review date, for sitemap output. */
export async function getPublishedArticleSlugs(): Promise<{ slug: string; reviewedAt: string }[]> {
  const client = getPublishedClient()
  if (client) {
    const rows = await tryFetch("publishedArticleSlugs", () =>
      client.fetch<{ slug: string; reviewedAt: string }[]>(
        publishedArticleSlugsQuery,
        {},
        { next: { tags: ["article"] } },
      ),
    )
    if (rows.ok) return rows.value ?? []
  }
  return datasetPublished().map((entry) => ({
    slug: entry.slug,
    reviewedAt: entry.reviewedAt ?? entry.publishedAt,
  }))
}
