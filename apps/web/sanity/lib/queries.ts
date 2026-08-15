import { defineQuery } from "next-sanity"

/**
 * Shared projection for every article read. Reference fields are resolved so
 * the frontend never needs a second round trip, and image assets are projected
 * to plain URLs so the renderers stay source-agnostic.
 */
const IMAGE_PROJECTION = `{
  "url": asset->url,
  "dimensions": asset->metadata.dimensions{width, height},
  src,
  alt,
  caption,
  credit,
  focalPoint
}`

const ARTICLE_PROJECTION = `{
  "id": _id,
  "slug": slug.current,
  title,
  eyebrow,
  excerpt,
  readingTime,
  publishedAt,
  reviewedAt,
  status,
  seoTitle,
  seoDescription,
  featuredImageLayout,
  "featuredImage": featuredImage${IMAGE_PROJECTION},
  "socialImage": socialImage${IMAGE_PROJECTION},
  "author": author->{"name": name, credential, "profileUrl": profileUrl, bio},
  "category": category->{"title": title, "slug": slug.current, description},
  "programs": programs[]->{"title": title, "slug": slug.current, href, boundary},
  "areas": areas[]->{"title": title, "slug": slug.current, href, description},
  body,
  faqs,
  officialSources,
  disclaimer,
  relatedLinks,
  "relatedArticles": relatedArticles[]->{"slug": slug.current, title, excerpt, readingTime, eyebrow}
}`

/** Every published article, newest first. */
export const publishedArticlesQuery = defineQuery(`
  *[_type == "article" && status == "published" && defined(slug.current)]
    | order(publishedAt desc) ${ARTICLE_PROJECTION}
`)

/** A single published article by slug. */
export const publishedArticleBySlugQuery = defineQuery(`
  *[_type == "article" && status == "published" && slug.current == $slug][0] ${ARTICLE_PROJECTION}
`)

/**
 * A single article by slug regardless of publication state. Only ever executed
 * through the draft-mode client so unpublished work never reaches the public
 * site.
 */
export const anyArticleBySlugQuery = defineQuery(`
  *[_type == "article" && slug.current == $slug][0] ${ARTICLE_PROJECTION}
`)

/** Slugs of published articles, used for sitemap and static generation. */
export const publishedArticleSlugsQuery = defineQuery(`
  *[_type == "article" && status == "published" && defined(slug.current)]
    | order(publishedAt desc) {"slug": slug.current, "reviewedAt": coalesce(reviewedAt, publishedAt)}
`)
