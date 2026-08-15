/**
 * Bootstrap content source.
 *
 * Holds the exact documents that `content/sanity/articles.ndjson` imports into
 * the Sanity Content Lake. It keeps the production blog serving real content
 * while the Sanity project is being provisioned, and it is what the app falls
 * back to whenever `NEXT_PUBLIC_SANITY_PROJECT_ID` is not set.
 *
 * Once Sanity is configured this module is never read: `lib/cms/articles.ts`
 * routes every query to the Content Lake, and publishing a new article then
 * requires no code change at all.
 *
 * Regenerate with: node scripts/cms/build-content.mjs
 */

import garland from "@/content/articles/how-to-buy-home-garland-tx.json"
import heroes from "@/content/articles/homes-for-heroes-north-texas.json"
import naca from "@/content/articles/naca-homebuying-dallas-fort-worth.json"
import taxonomy from "@/content/taxonomy.json"

import type {
  Article,
  ArticleAuthor,
  ArticleBodyBlock,
  ArticleTaxonomyTerm,
  PortableTextBlock,
} from "./types"

type RawReference = { _ref: string }
type RawDocument = Record<string, unknown>

const documentsById = new Map<string, RawDocument>()
for (const group of [taxonomy.authors, taxonomy.categories, taxonomy.programs, taxonomy.areas]) {
  for (const doc of group as RawDocument[]) {
    documentsById.set(String(doc._id), doc)
  }
}

function resolveAuthor(reference: RawReference | undefined): ArticleAuthor {
  const doc = reference ? documentsById.get(reference._ref) : undefined
  const name = String(doc?.name ?? "")
  return {
    name,
    displayName: String(doc?.displayName ?? name),
    role: doc?.role as string | undefined,
    profilePath: doc?.profilePath as string | undefined,
    bio: doc?.bio as string | undefined,
  }
}

function resolveTerm(reference: RawReference | undefined): ArticleTaxonomyTerm {
  const doc = reference ? documentsById.get(reference._ref) : undefined
  const slug = doc?.slug as { current?: string } | undefined
  return {
    title: String(doc?.title ?? ""),
    slug: slug?.current,
    path: doc?.path as string | undefined,
    description: doc?.description as string | undefined,
    summary: doc?.summary as string | undefined,
  }
}

function resolveTerms(references: RawReference[] | undefined): ArticleTaxonomyTerm[] {
  return (references ?? []).map((reference) => resolveTerm(reference))
}

function toArticle(raw: RawDocument): Article {
  const slug = raw.slug as { current: string }
  return {
    _id: String(raw._id),
    title: String(raw.title),
    slug: slug.current,
    eyebrow: raw.eyebrow as string | undefined,
    excerpt: String(raw.excerpt),
    seoTitle: raw.seoTitle as string | undefined,
    seoDescription: String(raw.seoDescription),
    canonicalOverride: raw.canonicalOverride as string | undefined,
    status: raw.status === "draft" ? "draft" : "published",
    publishedAt: String(raw.publishedAt),
    reviewedAt: String(raw.reviewedAt),
    readingTimeMinutes: Number(raw.readingTimeMinutes),
    author: resolveAuthor(raw.author as RawReference | undefined),
    category: resolveTerm(raw.category as RawReference | undefined),
    programs: resolveTerms(raw.programs as RawReference[] | undefined),
    areas: resolveTerms(raw.areas as RawReference[] | undefined),
    featuredImage: raw.featuredImage as Article["featuredImage"],
    socialImage: raw.socialImage as Article["socialImage"],
    faqs: (raw.faqs ?? []) as Article["faqs"],
    sources: (raw.sources ?? []) as Article["sources"],
    complianceNotice: (raw.complianceNotice ?? []) as PortableTextBlock[],
    relatedLinks: (raw.relatedLinks ?? []) as Article["relatedLinks"],
    body: (raw.body ?? []) as ArticleBodyBlock[],
  }
}

const BOOTSTRAP_ARTICLES: Article[] = [naca, heroes, garland]
  .map((raw) => toArticle(raw as unknown as RawDocument))
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

export function bootstrapArticles(): Article[] {
  return BOOTSTRAP_ARTICLES.filter((article) => article.status === "published")
}

export function bootstrapArticleBySlug(slug: string): Article | null {
  return bootstrapArticles().find((article) => article.slug === slug) ?? null
}
