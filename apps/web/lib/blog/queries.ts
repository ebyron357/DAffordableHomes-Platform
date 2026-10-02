/**
 * GROQ query layer.
 *
 * Every query projects Content Lake documents into the shapes declared in
 * `lib/blog/types.ts`, so renderers never branch on where the data came from.
 *
 * Two rules this file has to hold up, because the renderers assume both:
 *
 *  1. **Optional list fields are never null.** Sanity omits unset optional
 *     fields, and GROQ returns `null` for them. The page and the structured-data
 *     builders call `.length` and `.map` directly, so an article that simply has
 *     no FAQs would 500. Everything list-shaped is coalesced to `[]` here.
 *  2. **Nothing unpublished leaks through a reference.** Listing queries filter
 *     on `publicationState`, so dereferenced related articles must filter too —
 *     otherwise a draft's title, excerpt and image surface on a live page.
 */

/** Shared image projection: resolves the asset and its dimensions/LQIP. */
const IMAGE = /* groq */ `{
  "src": asset->url,
  "alt": coalesce(alt, ""),
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "lqip": asset->metadata.lqip,
  "focalPoint": select(
    defined(hotspot) => string(round(hotspot.x * 100)) + "% " + string(round(hotspot.y * 100)) + "%",
    null
  ),
  caption,
  credit
}`

const AUTHOR = /* groq */ `{
  name,
  role,
  bio,
  "url": coalesce(url, "/about"),
  "image": image${IMAGE}
}`

const CATEGORY = /* groq */ `{
  title,
  "slug": slug.current,
  description
}`

const SUMMARY_FIELDS = /* groq */ `
  _id,
  "slug": slug.current,
  title,
  excerpt,
  eyebrow,
  "category": category->${CATEGORY},
  "author": author->${AUTHOR},
  publishedAt,
  reviewedAt,
  readingTime,
  "featuredImage": featuredImage${IMAGE}
`

/** Published-only dereference of the article's related-article references. */
const RELATED_ARTICLES = /* groq */ `
  coalesce(
    ^.relatedArticles[]->{${SUMMARY_FIELDS}, publicationState}[publicationState == "published"],
    []
  )
`

/**
 * Body blocks. Image-bearing blocks resolve their assets inline.
 *
 * `faqBlock` and `officialSourcesBlock` fall back to the article-level lists
 * when their own list is *empty as well as* when it is unset — the schema tells
 * editors to "leave the list empty to reuse the article-level" entries, and
 * `coalesce` alone would treat `[]` as a present value and render nothing.
 */
const BODY = /* groq */ `body[]{
  ...,
  _type == "heroImage" => { _type, _key, "image": image${IMAGE} },
  _type == "inlineImage" => { _type, _key, size, "image": image${IMAGE} },
  _type == "imageGallery" => { _type, _key, heading, "images": coalesce(images[]${IMAGE}, []) },
  _type == "richTextBlock" => { _type, _key, "content": coalesce(content, []) },
  _type == "faqBlock" => {
    _type, _key, heading,
    "faqs": select(count(faqs) > 0 => faqs, coalesce(^.faqs, []))
  },
  _type == "officialSourcesBlock" => {
    _type, _key, heading,
    "sources": select(count(sources) > 0 => sources, coalesce(^.sources, []))
  },
  _type == "checklist" => { _type, _key, heading, intro, "items": coalesce(items, []) },
  _type == "comparisonTable" => {
    _type, _key, heading, caption,
    "columns": coalesce(columns, []),
    "rows": coalesce(rows[]{_key, "cells": coalesce(cells, [])}, [])
  },
  _type == "relatedArticlesBlock" => {
    _type, _key, heading,
    "articles": ${RELATED_ARTICLES}
  }
}`

const ARTICLE_FIELDS = /* groq */ `
  ${SUMMARY_FIELDS},
  seoTitle,
  seoDescription,
  "socialImage": socialImage${IMAGE},
  "body": coalesce(${BODY}, []),
  "faqs": coalesce(faqs, []),
  "sources": coalesce(sources, []),
  "notice": coalesce(notice, []),
  "relatedLinks": coalesce(relatedLinks, []),
  "relatedArticleSlugs": coalesce(
    relatedArticles[]->{slug, publicationState}[publicationState == "published"].slug.current,
    []
  ),
  "programs": coalesce(programs, []),
  "areas": coalesce(areas, [])
`

/** Published articles only, newest first. */
export const ARTICLES_QUERY = /* groq */ `
*[_type == "article" && defined(slug.current) && publicationState == "published"]
  | order(publishedAt desc, _createdAt desc)
  {${SUMMARY_FIELDS}}
`

/** A single published article. */
export const ARTICLE_BY_SLUG_QUERY = /* groq */ `
*[_type == "article" && slug.current == $slug && publicationState == "published"][0]
  {${ARTICLE_FIELDS}}
`

/**
 * A single article regardless of publication state. Only reachable through
 * draft mode, which requires an authenticated Studio preview session.
 */
export const ARTICLE_BY_SLUG_PREVIEW_QUERY = /* groq */ `
*[_type == "article" && slug.current == $slug][0]
  {${ARTICLE_FIELDS}}
`

/** All published slugs, used by the sitemap. */
export const ARTICLE_SLUGS_QUERY = /* groq */ `
*[_type == "article" && defined(slug.current) && publicationState == "published"].slug.current
`
