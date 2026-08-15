/**
 * Editorial content model shared by the Sanity Content Lake and the committed
 * bootstrap content source. Both produce identical shapes so the renderers do
 * not care which source is active.
 */

export type PortableTextSpan = {
  _type: "span"
  _key: string
  text: string
  marks: string[]
}

export type PortableTextMarkDef =
  | { _type: "link"; _key: string; href: string }
  | { _type: "internalLink"; _key: string; path: string }

export type PortableTextBlock = {
  _type: "block"
  _key: string
  style: "normal" | "h2" | "h3" | "h4"
  listItem?: "bullet" | "number"
  level?: number
  markDefs: PortableTextMarkDef[]
  children: PortableTextSpan[]
}

export type ArticleImage = {
  src: string
  alt: string
  caption?: string
  credit?: string
  focalPoint?: string
}

export type QuickAnswerBlock = {
  _type: "quickAnswer"
  _key: string
  heading: string
  body: PortableTextBlock[]
}

export type HeroImageBlock = ArticleImage & { _type: "heroImage"; _key: string }

export type InlineImageBlock = ArticleImage & {
  _type: "inlineImage"
  _key: string
  layout: "wide" | "full" | "inset"
}

export type ImageGalleryBlock = {
  _type: "imageGallery"
  _key: string
  heading?: string
  images: (ArticleImage & { _key: string })[]
}

export type EmbedBlock = {
  _type: "embed"
  _key: string
  title: string
  url: string
  provider: "youtube" | "vimeo"
  description?: string
}

export type PullQuoteBlock = {
  _type: "pullQuote"
  _key: string
  quote: string
  attribution?: string
}

export type CalloutBlock = {
  _type: "callout"
  _key: string
  tone: "note" | "caution" | "success"
  heading?: string
  body: PortableTextBlock[]
}

export type ComplianceDisclaimerBlock = {
  _type: "complianceDisclaimer"
  _key: string
  heading?: string
  body: PortableTextBlock[]
}

export type ChecklistBlock = {
  _type: "checklist"
  _key: string
  heading?: string
  intro?: string
  variant?: "check" | "avoid"
  items: { _key: string; label: string; detail?: string }[]
}

export type ComparisonTableBlock = {
  _type: "comparisonTable"
  _key: string
  heading?: string
  caption?: string
  columns: string[]
  rows: { _key: string; cells: string[] }[]
}

export type FaqGroupBlock = {
  _type: "faqGroup"
  _key: string
  heading?: string
  intro?: string
  faqs: ArticleFaq[]
}

export type SourceListBlock = {
  _type: "sourceList"
  _key: string
  heading?: string
  intro?: string
  sources: ArticleSource[]
}

export type CalculatorCtaBlock = {
  _type: "calculatorCta"
  _key: string
  heading: string
  body?: string
  calculators: { _key: string; label: string; href: string }[]
}

export type LinkCtaBlock = {
  _type: "programCta" | "areaCta"
  _key: string
  heading: string
  body?: string
  href: string
  label: string
}

export type ConsultationCtaBlock = {
  _type: "consultationCta"
  _key: string
  heading: string
  body?: string
  href: string
  label: string
  secondaryHref?: string
  secondaryLabel?: string
}

export type RelatedArticlesBlock = {
  _type: "relatedArticles"
  _key: string
  heading?: string
  intro?: string
  links: ArticleRelatedLink[]
}

export type ArticleBodyBlock =
  | PortableTextBlock
  | QuickAnswerBlock
  | HeroImageBlock
  | InlineImageBlock
  | ImageGalleryBlock
  | EmbedBlock
  | PullQuoteBlock
  | CalloutBlock
  | ComplianceDisclaimerBlock
  | ChecklistBlock
  | ComparisonTableBlock
  | FaqGroupBlock
  | SourceListBlock
  | CalculatorCtaBlock
  | LinkCtaBlock
  | ConsultationCtaBlock
  | RelatedArticlesBlock

/** Every body block type the CMS supports and the frontend renders. */
export const ARTICLE_BODY_BLOCK_TYPES = [
  "block",
  "quickAnswer",
  "heroImage",
  "inlineImage",
  "imageGallery",
  "embed",
  "pullQuote",
  "callout",
  "complianceDisclaimer",
  "checklist",
  "comparisonTable",
  "faqGroup",
  "sourceList",
  "calculatorCta",
  "programCta",
  "areaCta",
  "consultationCta",
  "relatedArticles",
] as const

export type ArticleBodyBlockType = (typeof ARTICLE_BODY_BLOCK_TYPES)[number]

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

export type ArticleRelatedLink = {
  _key: string
  label: string
  href: string
  description?: string
}

export type ArticleAuthor = {
  name: string
  displayName: string
  role?: string
  profilePath?: string
  bio?: string
}

export type ArticleTaxonomyTerm = {
  title: string
  slug?: string
  path?: string
  description?: string
  summary?: string
}

export type Article = {
  _id: string
  title: string
  slug: string
  eyebrow?: string
  excerpt: string
  seoTitle?: string
  seoDescription: string
  canonicalOverride?: string
  status: "draft" | "published"
  publishedAt: string
  reviewedAt: string
  readingTimeMinutes: number
  author: ArticleAuthor
  category: ArticleTaxonomyTerm
  programs: ArticleTaxonomyTerm[]
  areas: ArticleTaxonomyTerm[]
  featuredImage: ArticleImage
  socialImage?: ArticleImage
  faqs: ArticleFaq[]
  sources: ArticleSource[]
  complianceNotice: PortableTextBlock[]
  relatedLinks: ArticleRelatedLink[]
  body: ArticleBodyBlock[]
}

export type ArticleSummary = Pick<
  Article,
  | "_id"
  | "title"
  | "slug"
  | "eyebrow"
  | "excerpt"
  | "publishedAt"
  | "reviewedAt"
  | "readingTimeMinutes"
  | "featuredImage"
  | "status"
> & { category: ArticleTaxonomyTerm; author: ArticleAuthor }
