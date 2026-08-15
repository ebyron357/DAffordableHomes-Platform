/**
 * Source-agnostic article model.
 *
 * Both content sources — the Sanity Content Lake and the committed canonical
 * dataset that seeds it — resolve to these types, so every renderer works
 * identically regardless of where the document came from.
 */

export type PortableTextSpan = {
  _type: "span"
  _key: string
  text: string
  marks?: string[]
}

export type PortableTextMarkDef = {
  _type: "link"
  _key: string
  href: string
}

export type PortableTextBlock = {
  _type: "block"
  _key: string
  style?: "normal" | "h2" | "h3" | "h4"
  listItem?: "bullet" | "number"
  level?: number
  children: PortableTextSpan[]
  markDefs?: PortableTextMarkDef[]
}

export type ArticleImage = {
  /** Resolved Content Lake asset URL, when the image was uploaded to Sanity. */
  url?: string | null
  /** Approved repository asset path, when the artwork ships with the app. */
  src?: string | null
  dimensions?: { width: number; height: number } | null
  alt: string
  caption?: string | null
  credit?: string | null
  focalPoint?: string | null
}

export type ArticleFaq = { _key?: string; question: string; answer: string }

export type ArticleSource = { _key?: string; label: string; href: string; publisher?: string | null }

export type ArticleRelatedLink = { _key?: string; label: string; href: string; description: string }

export type ArticleBodyBlock =
  | { _type: "richTextBlock"; _key: string; content: PortableTextBlock[] }
  | { _type: "quickAnswerBlock"; _key: string; heading: string; content: PortableTextBlock[] }
  | { _type: "heroImageBlock"; _key: string; image: ArticleImage }
  | { _type: "inlineImageBlock"; _key: string; image: ArticleImage; width?: "content" | "wide" }
  | { _type: "imageGalleryBlock"; _key: string; heading?: string | null; images: ArticleImage[] }
  | {
      _type: "videoEmbedBlock"
      _key: string
      title: string
      url: string
      description?: string | null
      poster?: ArticleImage | null
    }
  | { _type: "quoteBlock"; _key: string; quote: string; attribution?: string | null; role?: string | null }
  | {
      _type: "calloutBlock"
      _key: string
      heading?: string | null
      tone?: "insight" | "caution" | "key"
      content: PortableTextBlock[]
    }
  | { _type: "complianceDisclaimerBlock"; _key: string; heading?: string | null; content: PortableTextBlock[] }
  | {
      _type: "checklistBlock"
      _key: string
      heading: string
      intro?: string | null
      items: { _key?: string; label: string; detail?: string | null }[]
    }
  | {
      _type: "comparisonTableBlock"
      _key: string
      heading: string
      caption?: string | null
      columns: string[]
      rows: { _key?: string; header: string; cells: string[] }[]
    }
  | { _type: "faqBlock"; _key: string; heading?: string | null; faqs: ArticleFaq[] }
  | {
      _type: "officialSourcesBlock"
      _key: string
      heading?: string | null
      intro?: string | null
      sources: ArticleSource[]
    }
  | {
      _type: "calculatorCtaBlock"
      _key: string
      calculator: string
      heading: string
      body?: string | null
      href: string
      label: string
    }
  | {
      _type: "programCtaBlock"
      _key: string
      program: string
      heading: string
      body?: string | null
      href: string
      label: string
    }
  | {
      _type: "areaGuideCtaBlock"
      _key: string
      area: string
      heading: string
      body?: string | null
      href: string
      label: string
    }
  | { _type: "consultationCtaBlock"; _key: string; heading: string; body?: string | null; href: string; label: string }
  | { _type: "relatedArticlesBlock"; _key: string; heading?: string | null; links: ArticleRelatedLink[] }

export type ArticleAuthor = {
  name: string
  credential?: string | null
  profileUrl?: string | null
  bio?: string | null
}

export type ArticleCategory = { title: string; slug: string; description?: string | null }

export type ArticleProgram = { title: string; slug: string; href: string; boundary?: string | null }

export type ArticleArea = { title: string; slug: string; href: string; description?: string | null }

export type ArticleSummary = {
  slug: string
  title: string
  eyebrow?: string | null
  excerpt: string
  readingTime: string
  publishedAt: string
  reviewedAt?: string | null
  category?: ArticleCategory | null
  featuredImage?: ArticleImage | null
  featuredImageLayout?: "photographic" | "editorial"
}

export type Article = ArticleSummary & {
  id?: string
  status: "draft" | "published" | "archived"
  seoTitle?: string | null
  seoDescription: string
  socialImage?: ArticleImage | null
  author: ArticleAuthor
  programs?: ArticleProgram[] | null
  areas?: ArticleArea[] | null
  body: ArticleBodyBlock[]
  faqs?: ArticleFaq[] | null
  officialSources?: ArticleSource[] | null
  disclaimer?: PortableTextBlock[] | null
  relatedLinks?: ArticleRelatedLink[] | null
  relatedArticles?: Pick<ArticleSummary, "slug" | "title" | "excerpt" | "readingTime" | "eyebrow">[] | null
}

/** Which backend answered a content request. Surfaced for operational evidence. */
export type ContentSource = "sanity" | "repository-dataset"
