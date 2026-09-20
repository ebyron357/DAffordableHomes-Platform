/**
 * Canonical editorial content model.
 *
 * This module is the single shape contract shared by three things:
 *  1. the Sanity schema (`apps/web/sanity/schema`),
 *  2. the GROQ projection (`apps/web/lib/blog/queries.ts`),
 *  3. the frontend renderers (`apps/web/components/blog`).
 *
 * Article copy never lives here. It lives in Sanity, and the reproducible
 * migration payload for the three launch articles lives in `lib/blog/seed`.
 */

/* ------------------------------------------------------------------ */
/* Portable Text                                                       */
/* ------------------------------------------------------------------ */

export type PortableTextSpan = {
  _type: "span"
  _key: string
  text: string
  marks: string[]
}

export type PortableTextMarkDef = {
  _type: "link"
  _key: string
  href: string
}

export type PortableTextBlock = {
  _type: "block"
  _key: string
  style: "normal" | "h2" | "h3" | "h4" | "blockquote"
  listItem?: "bullet" | "number"
  level?: number
  markDefs: PortableTextMarkDef[]
  children: PortableTextSpan[]
}

export type RichText = PortableTextBlock[]

/* ------------------------------------------------------------------ */
/* Media                                                               */
/* ------------------------------------------------------------------ */

/**
 * Resolved image reference. `src` is either a Sanity CDN URL (when the image
 * came from the Content Lake) or a repository-relative path under `/public`
 * (approved local assets referenced by the migration seed).
 */
export type ArticleImage = {
  src: string
  /** Meaningful alternative text. Required by the schema; never decorative-empty. */
  alt: string
  width?: number
  height?: number
  /** CSS `object-position` used to control the crop focal point. */
  focalPoint?: string
  caption?: string
  credit?: string
  /** Low-quality placeholder produced by Sanity's LQIP when available. */
  lqip?: string
}

/* ------------------------------------------------------------------ */
/* Editorial blocks                                                    */
/* ------------------------------------------------------------------ */

export type CalloutTone = "note" | "important" | "caution"

export type ComparisonRow = {
  _key: string
  cells: string[]
}

export type ArticleBlock =
  | { _type: "richTextBlock"; _key: string; content: RichText }
  | { _type: "quickAnswer"; _key: string; heading: string; content: RichText }
  | { _type: "heroImage"; _key: string; image: ArticleImage }
  | { _type: "inlineImage"; _key: string; image: ArticleImage; size?: "inset" | "full" }
  | { _type: "imageGallery"; _key: string; heading?: string; images: ArticleImage[] }
  | {
      _type: "videoEmbed"
      _key: string
      url: string
      title: string
      provider: "youtube" | "vimeo"
      description?: string
    }
  | { _type: "quote"; _key: string; text: string; attribution?: string; role?: string }
  | { _type: "callout"; _key: string; tone: CalloutTone; heading?: string; content: RichText }
  | { _type: "complianceDisclaimer"; _key: string; heading?: string; content: RichText }
  | { _type: "checklist"; _key: string; heading?: string; intro?: string; items: string[] }
  | {
      _type: "comparisonTable"
      _key: string
      heading?: string
      caption?: string
      columns: string[]
      rows: ComparisonRow[]
    }
  | { _type: "faqBlock"; _key: string; heading?: string; faqs: ArticleFaq[] }
  | { _type: "officialSourcesBlock"; _key: string; heading?: string; sources: ArticleSource[] }
  | {
      _type: "calculatorCta"
      _key: string
      heading: string
      description: string
      href: string
      buttonLabel: string
    }
  | {
      _type: "programCta"
      _key: string
      heading: string
      description: string
      href: string
      buttonLabel: string
    }
  | {
      _type: "areaGuideCta"
      _key: string
      heading: string
      description: string
      href: string
      buttonLabel: string
    }
  | {
      _type: "consultationCta"
      _key: string
      heading: string
      description: string
      buttonLabel: string
    }
  | { _type: "relatedArticlesBlock"; _key: string; heading?: string; articles: ArticleSummary[] }

/* ------------------------------------------------------------------ */
/* Supporting records                                                  */
/* ------------------------------------------------------------------ */

export type ArticleFaq = {
  _key: string
  question: string
  answer: string
}

export type ArticleSource = {
  _key: string
  label: string
  href: string
  publisher?: string
}

export type ArticleAuthor = {
  name: string
  /** Public-facing role, e.g. "REALTOR®". */
  role?: string
  bio?: string
  url?: string
  image?: ArticleImage
}

export type ArticleCategory = {
  title: string
  slug: string
  description?: string
}

export type ArticleRelatedLink = {
  _key: string
  label: string
  href: string
  description: string
}

/** Lightweight article shape used by listings and related-content modules. */
export type ArticleSummary = {
  _id: string
  slug: string
  title: string
  excerpt: string
  eyebrow: string
  category: ArticleCategory
  author: ArticleAuthor
  publishedAt: string
  reviewedAt?: string
  readingTime: string
  featuredImage: ArticleImage
}

export type Article = ArticleSummary & {
  seoTitle?: string
  seoDescription: string
  socialImage?: ArticleImage
  body: ArticleBlock[]
  faqs: ArticleFaq[]
  sources: ArticleSource[]
  /** Editorial boundary / compliance notice rendered at the end of the article. */
  notice: RichText
  relatedLinks: ArticleRelatedLink[]
  relatedArticleSlugs: string[]
  /** Program associations, e.g. `naca`, `homes-for-heroes`. */
  programs: string[]
  /** Area associations, e.g. `garland`, `dallas-fort-worth`. */
  areas: string[]
}
