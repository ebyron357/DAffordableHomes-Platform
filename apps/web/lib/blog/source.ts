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

/**
 * Production source of truth.
 *
 * Once `NEXT_PUBLIC_SANITY_PROJECT_ID` is set, the Content Lake is the only
 * publishing system for this site. The migration seed under `./seed` is
 * bootstrap and migration data — the payload `scripts/sanity/export-seed.mjs`
 * turns into NDJSON, and the content a local checkout renders before anyone has
 * configured a project. It is **not** a second publishing path.
 *
 * That distinction matters because the previous behaviour was a silent
 * fallback: any Content Lake read failure served the seed instead. An editor
 * who unpublished an article, corrected a figure, or changed a reviewed date
 * would have seen the pre-migration copy come back during an outage, with
 * nothing on the page saying so. Stale copy that looks current is worse than
 * an honest gap.
 *
 * The replacement, in order:
 *
 *  1. Sanity is not configured → the seed renders, and `source` reports
 *     `"seed"`. Local and bootstrap only.
 *  2. Sanity is configured and reachable → Content Lake content, cached on
 *     Next's data cache under the `article` tag which the publish webhook
 *     invalidates. The response is also held in `lastGood` below.
 *  3. Sanity is configured and the read fails, and this process has served a
 *     good response before → that response is served again and flagged
 *     `stale`. It is the site's own published content, not migration copy.
 *  4. Sanity is configured, the read fails, and there is nothing cached → the
 *     reader is told the library is temporarily unavailable. No seed, no
 *     invented 404.
 */

/** Cache tag invalidated by the Sanity publish webhook. */
export const ARTICLE_CACHE_TAG = "article"

const CACHE_OPTIONS = {
  next: { tags: [ARTICLE_CACHE_TAG], revalidate: 3600 },
}

/** Where the content in a given response came from. */
export type ContentSource = "sanity" | "seed"

export type ReadState =
  /** Live read, or a seed read in an unconfigured environment. */
  | { status: "ok"; source: ContentSource }
  /** Sanity is configured but unreachable; serving the last good response. */
  | { status: "stale"; source: "sanity"; fetchedAt: string }
  /** Sanity is configured, unreachable, and nothing has been cached yet. */
  | { status: "unavailable"; source: "sanity" }

export type ArticleListResult = { articles: ArticleSummary[]; state: ReadState }
export type ArticleResult = { article: Article | null; state: ReadState }

/**
 * Last successful Content Lake response, per process.
 *
 * Deliberately in-process and unbounded in age but not in size: it holds one
 * index plus one entry per article this instance has served. A cold instance
 * has an empty cache and degrades to the honest "unavailable" state rather
 * than to something that merely looks published.
 */
type CacheEntry<T> = { value: T; fetchedAt: string }
const lastGoodSummaries = new Map<string, CacheEntry<ArticleSummary[]>>()
const lastGoodSlugs = new Map<string, CacheEntry<string[]>>()
const lastGoodArticles = new Map<string, CacheEntry<Article | null>>()

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

/**
 * Runs a Content Lake read and applies the degradation ladder above.
 *
 * The failure is logged rather than swallowed, so an outage is visible in the
 * platform logs instead of looking like a quiet content change.
 */
async function readFromSanity<T>(
  label: string,
  read: () => Promise<T>,
  cache: Map<string, CacheEntry<T>>,
  cacheKey: string,
  emptyValue: T,
): Promise<{ value: T; state: ReadState }> {
  try {
    const value = await read()
    cache.set(cacheKey, { value, fetchedAt: new Date().toISOString() })
    return { value, state: { status: "ok", source: "sanity" } }
  } catch (error) {
    const cached = cache.get(cacheKey)
    if (cached) {
      console.error(
        `[blog] Sanity read failed (${label}); serving the last good response from ${cached.fetchedAt}.`,
        error,
      )
      return {
        value: cached.value,
        state: { status: "stale", source: "sanity", fetchedAt: cached.fetchedAt },
      }
    }
    console.error(
      `[blog] Sanity read failed (${label}) with nothing cached; reporting the library as unavailable.`,
      error,
    )
    return { value: emptyValue, state: { status: "unavailable", source: "sanity" } }
  }
}

/** Lists published articles, newest first. */
export async function listArticles(): Promise<ArticleListResult> {
  const client = getPublishedClient()
  if (!client) {
    return { articles: SEED_ARTICLES.map(toSummary), state: { status: "ok", source: "seed" } }
  }

  const { value, state } = await readFromSanity<ArticleSummary[]>(
    "listArticles",
    async () => (await client.fetch<ArticleSummary[]>(ARTICLES_QUERY, {}, CACHE_OPTIONS)) ?? [],
    lastGoodSummaries,
    "index",
    [],
  )
  return { articles: value, state }
}

/** Every article slug, for callers that only need the URL set. */
export async function listArticleSlugs(): Promise<{ slugs: string[]; state: ReadState }> {
  const client = getPublishedClient()
  if (!client) {
    return { slugs: SEED_ARTICLES.map((article) => article.slug), state: { status: "ok", source: "seed" } }
  }

  const { value, state } = await readFromSanity<string[]>(
    "listArticleSlugs",
    async () => (await client.fetch<string[]>(ARTICLE_SLUGS_QUERY, {}, CACHE_OPTIONS)) ?? [],
    lastGoodSlugs,
    "slugs",
    [],
  )
  return { slugs: value, state }
}

/**
 * Loads one article.
 *
 * `article: null` with an `ok` state means the slug genuinely does not exist
 * (or is unpublished and this is not a draft request), and the route renders a
 * real 404. An `unavailable` state means the CMS could not be reached and the
 * route must say so instead — a 404 would tell the reader, and every crawler,
 * that a published article had been withdrawn.
 */
export async function getArticle(slug: string): Promise<ArticleResult> {
  if (!isSanityConfigured) {
    const match = SEED_ARTICLES.find((article) => article.slug === slug)
    return {
      article: match ? hydrateRelated(match, SEED_ARTICLES) : null,
      state: { status: "ok", source: "seed" },
    }
  }

  if (await isDraftRequest()) {
    const preview = getPreviewClient()
    if (preview) {
      // A draft read must never fall back to published or cached content —
      // that would show an editor stale copy while claiming to be a preview.
      const draft = await preview.fetch<Article | null>(ARTICLE_BY_SLUG_PREVIEW_QUERY, { slug })
      return { article: draft ?? null, state: { status: "ok", source: "sanity" } }
    }
  }

  const client = getPublishedClient()
  if (!client) return { article: null, state: { status: "unavailable", source: "sanity" } }

  const { value, state } = await readFromSanity<Article | null>(
    `getArticle(${slug})`,
    async () =>
      (await client.fetch<Article | null>(ARTICLE_BY_SLUG_QUERY, { slug }, CACHE_OPTIONS)) ?? null,
    lastGoodArticles,
    slug,
    null,
  )
  return { article: value, state }
}

/**
 * Which system is authoritative in this environment.
 *
 * `"sanity"` means articles are created and edited in `/studio` and published
 * without a code change or a deploy. `"seed"` means no project is configured,
 * so the checkout is rendering migration fixtures.
 */
export function getContentSource(): ContentSource {
  return isSanityConfigured ? "sanity" : "seed"
}
