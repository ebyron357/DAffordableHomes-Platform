/**
 * GROQ query layer.
 *
 * Every query projects Content Lake documents into the shapes declared in
 * `lib/blog/types.ts`, so renderers never branch on where the data came from.
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

/** Body blocks. Image-bearing blocks resolve their assets inline. */
const BODY = /* groq */ `body[]{
  ...,
  _type == "heroImage" => { _type, _key, "image": image${IMAGE} },
  _type == "inlineImage" => { _type, _key, size, "image": image${IMAGE} },
  _type == "imageGallery" => { _type, _key, heading, "images": images[]${IMAGE} },
  _type == "richTextBlock" => { _type, _key, content },
  _type == "faqBlock" => { _type, _key, heading, "faqs": coalesce(faqs, ^.faqs) },
  _type == "officialSourcesBlock" => { _type, _key, heading, "sources": coalesce(sources, ^.sources) },
  _type == "relatedArticlesBlock" => {
    _type, _key, heading,
    "articles": ^.relatedArticles[]->{${SUMMARY_FIELDS}}
  }
}`

const ARTICLE_FIELDS = /* groq */ `
  ${SUMMARY_FIELDS},
  seoTitle,
  seoDescription,
  "socialImage": socialImage${IMAGE},
  ${BODY},
  faqs,
  sources,
  notice,
  relatedLinks,
  "relatedArticleSlugs": relatedArticles[]->slug.current,
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
 * draft mode, which requires the server-side read token.
 */
export const ARTICLE_BY_SLUG_PREVIEW_QUERY = /* groq */ `
*[_type == "article" && slug.current == $slug][0]
  {${ARTICLE_FIELDS}}
`

/** All published slugs, used by `generateStaticParams` and the sitemap. */
export const ARTICLE_SLUGS_QUERY = /* groq */ `
*[_type == "article" && defined(slug.current) && publicationState == "published"].slug.current
`
