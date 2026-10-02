/**
 * Typed block builders for the migration seed.
 *
 * Every builder returns a fully-formed `ArticleBlock` with a deterministic
 * `_key`, so the NDJSON export in `scripts/sanity/export-seed.mjs` is stable
 * across runs and safe to re-import.
 */

import type {
  ArticleBlock,
  ArticleFaq,
  ArticleImage,
  ArticleSource,
  CalloutTone,
  ComparisonRow,
  RichText,
} from "../types"

let sequence = 0

function nextKey(prefix: string): string {
  sequence += 1
  return `${prefix}${sequence.toString(36).padStart(3, "0")}`
}

/** Resets the key counter so each article's keys are independent and stable. */
export function resetKeys(): void {
  sequence = 0
}

export const richTextBlock = (content: RichText): ArticleBlock => ({
  _type: "richTextBlock",
  _key: nextKey("rt"),
  content,
})

export const quickAnswer = (heading: string, content: RichText): ArticleBlock => ({
  _type: "quickAnswer",
  _key: nextKey("qa"),
  heading,
  content,
})

export const heroImage = (image: ArticleImage): ArticleBlock => ({
  _type: "heroImage",
  _key: nextKey("hi"),
  image,
})

export const inlineImage = (
  image: ArticleImage,
  size: "inset" | "full" = "inset",
): ArticleBlock => ({
  _type: "inlineImage",
  _key: nextKey("ii"),
  image,
  size,
})

export const imageGallery = (heading: string, images: ArticleImage[]): ArticleBlock => ({
  _type: "imageGallery",
  _key: nextKey("ig"),
  heading,
  images,
})

export const videoEmbed = (input: {
  url: string
  title: string
  provider: "youtube" | "vimeo"
  description?: string
}): ArticleBlock => ({
  _type: "videoEmbed",
  _key: nextKey("ve"),
  ...input,
})

export const quote = (text: string, attribution?: string, role?: string): ArticleBlock => ({
  _type: "quote",
  _key: nextKey("qt"),
  text,
  attribution,
  role,
})

export const callout = (
  tone: CalloutTone,
  heading: string,
  content: RichText,
): ArticleBlock => ({
  _type: "callout",
  _key: nextKey("co"),
  tone,
  heading,
  content,
})

export const complianceDisclaimer = (heading: string, content: RichText): ArticleBlock => ({
  _type: "complianceDisclaimer",
  _key: nextKey("cd"),
  heading,
  content,
})

export const checklist = (
  heading: string,
  items: string[],
  intro?: string,
): ArticleBlock => ({
  _type: "checklist",
  _key: nextKey("cl"),
  heading,
  intro,
  items,
})

export const comparisonTable = (input: {
  heading: string
  caption?: string
  columns: string[]
  rows: string[][]
}): ArticleBlock => ({
  _type: "comparisonTable",
  _key: nextKey("ct"),
  heading: input.heading,
  caption: input.caption,
  columns: input.columns,
  rows: input.rows.map<ComparisonRow>((cells, index) => ({
    _key: `row${index.toString().padStart(2, "0")}`,
    cells,
  })),
})

export const faqBlock = (heading: string, faqs: ArticleFaq[]): ArticleBlock => ({
  _type: "faqBlock",
  _key: nextKey("fq"),
  heading,
  faqs,
})

export const officialSourcesBlock = (
  heading: string,
  sources: ArticleSource[],
): ArticleBlock => ({
  _type: "officialSourcesBlock",
  _key: nextKey("os"),
  heading,
  sources,
})

export const calculatorCta = (input: {
  heading: string
  description: string
  href: string
  buttonLabel: string
}): ArticleBlock => ({ _type: "calculatorCta", _key: nextKey("cc"), ...input })

export const programCta = (input: {
  heading: string
  description: string
  href: string
  buttonLabel: string
}): ArticleBlock => ({ _type: "programCta", _key: nextKey("pc"), ...input })

export const areaGuideCta = (input: {
  heading: string
  description: string
  href: string
  buttonLabel: string
}): ArticleBlock => ({ _type: "areaGuideCta", _key: nextKey("ac"), ...input })

export const consultationCta = (input: {
  heading: string
  description: string
  buttonLabel: string
}): ArticleBlock => ({ _type: "consultationCta", _key: nextKey("sc"), ...input })

export const relatedArticlesBlock = (heading: string): ArticleBlock => ({
  _type: "relatedArticlesBlock",
  _key: nextKey("ra"),
  heading,
  // Resolved at query time from the article's `relatedArticleSlugs`.
  articles: [],
})

/** Builds FAQ entries with stable keys. */
export const faqs = (entries: Array<[question: string, answer: string]>): ArticleFaq[] =>
  entries.map(([question, answer], index) => ({
    _key: `faq${index.toString().padStart(2, "0")}`,
    question,
    answer,
  }))

/** Builds official-source entries with stable keys. */
export const sources = (
  entries: Array<{ label: string; href: string; publisher?: string }>,
): ArticleSource[] =>
  entries.map((entry, index) => ({
    _key: `src${index.toString().padStart(2, "0")}`,
    ...entry,
  }))
