import { defineQuery } from "next-sanity"

const authorProjection = `
  "author": author->{
    name,
    "displayName": coalesce(displayName, name),
    role,
    profilePath,
    bio
  }`

const termProjection = `{ title, "slug": slug.current, path, description, summary }`

const imageProjection = `{
  "src": coalesce(asset->url, src),
  alt,
  caption,
  credit,
  focalPoint
}`

const summaryFields = `
  _id,
  title,
  "slug": slug.current,
  eyebrow,
  excerpt,
  status,
  publishedAt,
  reviewedAt,
  readingTimeMinutes,
  "featuredImage": featuredImage ${imageProjection},
  "category": category->${termProjection},
  ${authorProjection}
`

const fullFields = `
  ${summaryFields},
  seoTitle,
  seoDescription,
  canonicalOverride,
  "socialImage": socialImage ${imageProjection},
  "relatedArticles": relatedArticles[]->{ ${summaryFields} },
  "programs": programs[]->${termProjection},
  "areas": areas[]->${termProjection},
  faqs[]{ _key, question, answer },
  sources[]{ _key, label, href, publisher },
  complianceNotice,
  relatedLinks[]{ _key, label, href, description },
  body[]{
    ...,
    _type == "heroImage" || _type == "inlineImage" => {
      ...,
      "src": coalesce(asset->url, src)
    },
    _type == "imageGallery" => {
      ...,
      images[]{ ..., "src": coalesce(asset->url, src) }
    }
  }
`

/** Published articles, newest first. */
export const publishedArticlesQuery = defineQuery(`
  *[_type == "article" && status == "published" && defined(slug.current) && publishedAt <= now()]
    | order(publishedAt desc) { ${summaryFields} }
`)

/** Every routable slug — used by generateStaticParams and the sitemap. */
export const publishedArticleSlugsQuery = defineQuery(`
  *[_type == "article" && status == "published" && defined(slug.current) && publishedAt <= now()]
    | order(publishedAt desc) { "slug": slug.current, publishedAt, reviewedAt }
`)

/** A single published article. */
export const publishedArticleBySlugQuery = defineQuery(`
  *[_type == "article" && status == "published" && slug.current == $slug && publishedAt <= now()][0] { ${fullFields} }
`)

/** A single article regardless of publication state — draft mode only. */
export const anyArticleBySlugQuery = defineQuery(`
  *[_type == "article" && slug.current == $slug][0] { ${fullFields} }
`)
