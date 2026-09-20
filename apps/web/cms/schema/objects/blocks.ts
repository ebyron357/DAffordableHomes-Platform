import { defineArrayMember, defineField, defineType } from "sanity"

import { isSafeInternalPath } from "@/lib/safe-path"

/**
 * Reusable editorial blocks.
 *
 * Every block here has exactly one renderer in
 * `apps/web/components/blog/blocks`. Blocks carry structure and copy; they
 * never carry article-specific copy in code.
 */

export const richTextBlock = defineType({
  name: "richTextBlock",
  title: "Rich text",
  type: "object",
  fields: [
    defineField({
      name: "content",
      title: "Content",
      type: "richText",
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { content: "content" },
    prepare: ({ content }) => ({
      title: "Rich text",
      subtitle: firstLine(content),
    }),
  },
})

export const quickAnswer = defineType({
  name: "quickAnswer",
  title: "Quick answer",
  type: "object",
  description: "Answer-first summary shown near the top of an article.",
  fields: [
    defineField({
      name: "heading",
      type: "string",
      initialValue: "The quick answer",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      type: "richText",
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: title ?? "Quick answer" }) },
})

export const heroImage = defineType({
  name: "heroImage",
  title: "Hero image",
  type: "object",
  fields: [
    defineField({ name: "image", type: "articleImage", validation: (rule) => rule.required() }),
  ],
  preview: { select: { media: "image", title: "image.alt" } },
})

export const inlineImage = defineType({
  name: "inlineImage",
  title: "Inline image",
  type: "object",
  fields: [
    defineField({ name: "image", type: "articleImage", validation: (rule) => rule.required() }),
    defineField({
      name: "size",
      type: "string",
      initialValue: "inset",
      options: {
        list: [
          { title: "Inset (reading width)", value: "inset" },
          { title: "Full bleed", value: "full" },
        ],
        layout: "radio",
      },
    }),
  ],
  preview: { select: { media: "image", title: "image.alt" } },
})

export const imageGallery = defineType({
  name: "imageGallery",
  title: "Image gallery",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({
      name: "images",
      type: "array",
      of: [defineArrayMember({ type: "articleImage" })],
      validation: (rule) => rule.required().min(2).max(6),
    }),
  ],
  preview: {
    select: { title: "heading", images: "images" },
    prepare: ({ title, images }) => ({
      title: title ?? "Image gallery",
      subtitle: `${Array.isArray(images) ? images.length : 0} images`,
    }),
  },
})

export const videoEmbed = defineType({
  name: "videoEmbed",
  title: "Video / embed",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "provider",
      type: "string",
      initialValue: "youtube",
      options: {
        list: [
          { title: "YouTube", value: "youtube" },
          { title: "Vimeo", value: "vimeo" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      type: "url",
      description: "Public watch URL. The renderer converts it to a privacy-friendly embed.",
      validation: (rule) => rule.required().uri({ scheme: ["https"] }),
    }),
    defineField({ name: "description", type: "text", rows: 2 }),
  ],
  preview: { select: { title: "title", subtitle: "url" } },
})

export const quote = defineType({
  name: "quote",
  title: "Pull quote",
  type: "object",
  fields: [
    defineField({ name: "text", type: "text", rows: 3, validation: (rule) => rule.required() }),
    defineField({ name: "attribution", type: "string" }),
    defineField({ name: "role", type: "string" }),
  ],
  preview: { select: { title: "text", subtitle: "attribution" } },
})

export const callout = defineType({
  name: "callout",
  title: "Callout",
  type: "object",
  fields: [
    defineField({
      name: "tone",
      type: "string",
      initialValue: "note",
      options: {
        list: [
          { title: "Note", value: "note" },
          { title: "Important", value: "important" },
          { title: "Caution", value: "caution" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "content", type: "richText", validation: (rule) => rule.required().min(1) }),
  ],
  preview: {
    select: { title: "heading", subtitle: "tone" },
    prepare: ({ title, subtitle }) => ({ title: title ?? "Callout", subtitle }),
  },
})

export const complianceDisclaimer = defineType({
  name: "complianceDisclaimer",
  title: "Compliance disclaimer",
  type: "object",
  description: "Program boundaries and legal notices. Rendered with a distinct treatment.",
  fields: [
    defineField({ name: "heading", type: "string", initialValue: "Program boundary" }),
    defineField({ name: "content", type: "richText", validation: (rule) => rule.required().min(1) }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: title ?? "Disclaimer" }) },
})

export const checklist = defineType({
  name: "checklist",
  title: "Checklist",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "intro", type: "text", rows: 2 }),
    defineField({
      name: "items",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(2),
    }),
  ],
  preview: {
    select: { title: "heading", items: "items" },
    prepare: ({ title, items }) => ({
      title: title ?? "Checklist",
      subtitle: `${Array.isArray(items) ? items.length : 0} items`,
    }),
  },
})

export const comparisonTable = defineType({
  name: "comparisonTable",
  title: "Comparison table",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "caption", type: "text", rows: 2 }),
    defineField({
      name: "columns",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(2).max(4),
    }),
    defineField({
      name: "rows",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "comparisonRow",
          fields: [
            defineField({
              name: "cells",
              type: "array",
              of: [defineArrayMember({ type: "text", rows: 2 })],
              validation: (rule) => rule.required().min(2),
            }),
          ],
          preview: {
            select: { cells: "cells" },
            prepare: ({ cells }) => ({
              title: Array.isArray(cells) ? String(cells[0] ?? "Row") : "Row",
            }),
          },
        }),
      ],
      validation: (rule) => rule.required().min(2),
    }),
  ],
  preview: { select: { title: "heading" } },
})

export const faqBlock = defineType({
  name: "faqBlock",
  title: "FAQ section",
  type: "object",
  description:
    "Renders the article's FAQs. Leave the list empty to reuse the article-level FAQs.",
  fields: [
    defineField({ name: "heading", type: "string", initialValue: "Frequently asked questions" }),
    defineField({ name: "faqs", type: "array", of: [defineArrayMember({ type: "faq" })] }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: title ?? "FAQs" }) },
})

export const officialSourcesBlock = defineType({
  name: "officialSourcesBlock",
  title: "Official sources",
  type: "object",
  description:
    "Renders the article's sources. Leave the list empty to reuse the article-level sources.",
  fields: [
    defineField({
      name: "heading",
      type: "string",
      initialValue: "Official sources and review notes",
    }),
    defineField({ name: "sources", type: "array", of: [defineArrayMember({ type: "officialSource" })] }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: title ?? "Sources" }) },
})

function ctaFields(defaultHref: string, defaultLabel: string) {
  return [
    defineField({ name: "heading", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "description", type: "text", rows: 3, validation: (rule) => rule.required() }),
    defineField({
      name: "href",
      type: "string",
      initialValue: defaultHref,
      description: "Site-relative path, e.g. /calculators/affordability.",
      validation: (rule) =>
        rule
          .required()
          .custom((value: string | undefined) =>
            isSafeInternalPath(value)
              ? true
              : "Use a site-relative path. Protocol-relative values such as //example.com leave the site.",
          ),
    }),
    defineField({
      name: "buttonLabel",
      type: "string",
      initialValue: defaultLabel,
      validation: (rule) => rule.required(),
    }),
  ]
}

export const calculatorCta = defineType({
  name: "calculatorCta",
  title: "Calculator CTA",
  type: "object",
  fields: ctaFields("/calculators/affordability", "Open the calculator"),
  preview: { select: { title: "heading", subtitle: "href" } },
})

export const programCta = defineType({
  name: "programCta",
  title: "Program CTA",
  type: "object",
  fields: ctaFields("/programs", "Explore the guidance"),
  preview: { select: { title: "heading", subtitle: "href" } },
})

export const areaGuideCta = defineType({
  name: "areaGuideCta",
  title: "Area guide CTA",
  type: "object",
  fields: ctaFields("/areas/garland", "Open the area guide"),
  preview: { select: { title: "heading", subtitle: "href" } },
})

export const consultationCta = defineType({
  name: "consultationCta",
  title: "Consultation CTA",
  type: "object",
  description: "Closing call to action. Always links to /consultation.",
  fields: [
    defineField({ name: "heading", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "description", type: "text", rows: 3, validation: (rule) => rule.required() }),
    defineField({
      name: "buttonLabel",
      type: "string",
      initialValue: "Book consultation",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: "heading" } },
})

export const relatedArticlesBlock = defineType({
  name: "relatedArticlesBlock",
  title: "Related articles",
  type: "object",
  description: "Renders the articles selected in the article's Related articles field.",
  fields: [defineField({ name: "heading", type: "string", initialValue: "Keep reading" })],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title ?? "Related articles" }),
  },
})

type PreviewBlock = { children?: Array<{ text?: string }> }

function firstLine(content: unknown): string {
  if (!Array.isArray(content)) return ""
  const first = content[0] as PreviewBlock | undefined
  return first?.children?.map((child) => child.text ?? "").join("").slice(0, 80) ?? ""
}

/** Every block available inside an article body, in editor menu order. */
export const articleBodyBlocks = [
  richTextBlock,
  quickAnswer,
  heroImage,
  inlineImage,
  imageGallery,
  videoEmbed,
  quote,
  callout,
  complianceDisclaimer,
  checklist,
  comparisonTable,
  faqBlock,
  officialSourcesBlock,
  calculatorCta,
  programCta,
  areaGuideCta,
  consultationCta,
  relatedArticlesBlock,
]
