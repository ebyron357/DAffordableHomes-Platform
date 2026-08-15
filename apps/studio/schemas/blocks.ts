import { defineArrayMember, defineField, defineType } from "sanity"

/**
 * Reusable editorial blocks.
 *
 * Article-specific content belongs here (in the CMS). Rendering and design
 * behaviour belongs in `apps/web/components/blog/article-body.tsx`, which has a
 * renderer for every block type defined in this file.
 */

const requiredAlt = defineField({
  name: "alt",
  title: "Alt text",
  type: "string",
  description: "Describe what the image shows. Never claim a location the photograph does not prove.",
  validation: (rule) => rule.required().min(15).error("Meaningful images need descriptive alt text."),
})

/** Image reference: either an uploaded Sanity asset or an approved repository asset path. */
export const articleImage = defineType({
  name: "articleImage",
  title: "Image",
  type: "object",
  fields: [
    defineField({ name: "asset", title: "Uploaded image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "src",
      title: "Approved repository asset path",
      type: "string",
      description: "Use for approved assets already committed to the app, e.g. /images/hero-homeowner.png.",
    }),
    requiredAlt,
    defineField({ name: "caption", type: "string" }),
    defineField({ name: "credit", type: "string" }),
    defineField({
      name: "focalPoint",
      type: "string",
      description: "CSS object-position, e.g. 55% 40%. Controls the crop.",
    }),
  ],
  validation: (rule) =>
    rule.custom((value: { asset?: unknown; src?: string } | undefined) =>
      value?.asset || value?.src ? true : "Provide an uploaded image or an approved repository asset path."
    ),
  preview: { select: { title: "alt", media: "asset" } },
})

/** Rich text: headings, ordered lists, unordered lists, emphasis, and links. */
export const richText = defineArrayMember({
  type: "block",
  styles: [
    { title: "Body", value: "normal" },
    { title: "Heading 2", value: "h2" },
    { title: "Heading 3", value: "h3" },
    { title: "Heading 4", value: "h4" },
  ],
  lists: [
    { title: "Bulleted", value: "bullet" },
    { title: "Numbered", value: "number" },
  ],
  marks: {
    decorators: [
      { title: "Bold", value: "strong" },
      { title: "Italic", value: "em" },
    ],
    annotations: [
      defineArrayMember({
        name: "link",
        title: "External link",
        type: "object",
        fields: [
          defineField({
            name: "href",
            type: "url",
            validation: (rule) => rule.required().uri({ scheme: ["https"] }),
          }),
        ],
      }),
      defineArrayMember({
        name: "internalLink",
        title: "Internal link",
        type: "object",
        fields: [
          defineField({
            name: "path",
            type: "string",
            description: "Site-relative path, e.g. /programs/naca",
            validation: (rule) => rule.required().regex(/^\/(?!\/)/, { name: "site-relative path" }),
          }),
        ],
      }),
    ],
  },
})

const compactText = defineField({
  name: "body",
  type: "array",
  of: [richText],
  validation: (rule) => rule.required().min(1),
})

export const quickAnswer = defineType({
  name: "quickAnswer",
  title: "Quick answer",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string", validation: (rule) => rule.required() }),
    compactText,
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title, subtitle: "Quick answer" }) },
})

export const heroImage = defineType({
  name: "heroImage",
  title: "Hero image",
  type: "object",
  fields: articleImage.fields,
  validation: articleImage.validation,
  preview: { select: { title: "alt", media: "asset" }, prepare: ({ title, media }) => ({ title, subtitle: "Hero image", media }) },
})

export const inlineImage = defineType({
  name: "inlineImage",
  title: "Inline image",
  type: "object",
  fields: [
    ...articleImage.fields,
    defineField({
      name: "layout",
      type: "string",
      initialValue: "wide",
      options: {
        list: [
          { title: "Wide", value: "wide" },
          { title: "Full bleed", value: "full" },
          { title: "Inset (float)", value: "inset" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
  ],
  validation: articleImage.validation,
  preview: { select: { title: "alt", media: "asset" }, prepare: ({ title, media }) => ({ title, subtitle: "Inline image", media }) },
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
      of: [{ type: "articleImage" }],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: title || "Image gallery", subtitle: "Gallery" }) },
})

export const embed = defineType({
  name: "embed",
  title: "Video / embed",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "url",
      type: "url",
      description: "YouTube or Vimeo URL. Anything else renders as a plain link.",
      validation: (rule) => rule.required().uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "provider",
      type: "string",
      initialValue: "youtube",
      options: {
        list: [
          { title: "YouTube", value: "youtube" },
          { title: "Vimeo", value: "vimeo" },
        ],
      },
    }),
    defineField({ name: "description", type: "string" }),
  ],
  preview: { select: { title: "title" }, prepare: ({ title }) => ({ title, subtitle: "Embed" }) },
})

export const pullQuote = defineType({
  name: "pullQuote",
  title: "Pull quote",
  type: "object",
  fields: [
    defineField({ name: "quote", type: "text", rows: 3, validation: (rule) => rule.required() }),
    defineField({ name: "attribution", type: "string" }),
  ],
  preview: { select: { title: "quote" }, prepare: ({ title }) => ({ title, subtitle: "Pull quote" }) },
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
          { title: "Important", value: "caution" },
          { title: "Good practice", value: "success" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "heading", type: "string" }),
    compactText,
  ],
  preview: { select: { title: "heading", subtitle: "tone" } },
})

export const complianceDisclaimer = defineType({
  name: "complianceDisclaimer",
  title: "Compliance disclaimer",
  type: "object",
  fields: [defineField({ name: "heading", type: "string" }), compactText],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "Compliance notice", subtitle: "Disclaimer" }),
  },
})

export const checklist = defineType({
  name: "checklist",
  title: "Checklist",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "intro", type: "text", rows: 2 }),
    defineField({
      name: "items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "checklistItem",
          fields: [
            defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "detail", type: "string" }),
          ],
          preview: { select: { title: "label", subtitle: "detail" } },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: title || "Checklist", subtitle: "Checklist" }) },
})

export const comparisonTable = defineType({
  name: "comparisonTable",
  title: "Comparison table",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "caption", type: "text", rows: 2, description: "Also used as the accessible table caption." }),
    defineField({
      name: "columns",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: "rows",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "tableRow",
          fields: [defineField({ name: "cells", type: "array", of: [{ type: "string" }] })],
          preview: {
            select: { cells: "cells" },
            prepare: ({ cells }: { cells?: string[] }) => ({ title: cells?.[0] ?? "Row" }),
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "Comparison table", subtitle: "Table" }),
  },
})

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "object",
  fields: [
    defineField({ name: "question", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "answer", type: "text", rows: 4, validation: (rule) => rule.required() }),
  ],
  preview: { select: { title: "question", subtitle: "answer" } },
})

export const faqGroup = defineType({
  name: "faqGroup",
  title: "FAQ group",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "intro", type: "text", rows: 2 }),
    defineField({ name: "faqs", type: "array", of: [{ type: "faq" }], validation: (rule) => rule.required().min(1) }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: title || "FAQs", subtitle: "FAQ group" }) },
})

export const source = defineType({
  name: "source",
  title: "Official source",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "href", type: "url", validation: (rule) => rule.required().uri({ scheme: ["https"] }) }),
    defineField({ name: "publisher", type: "string" }),
  ],
  preview: { select: { title: "label", subtitle: "publisher" } },
})

export const sourceList = defineType({
  name: "sourceList",
  title: "Official sources",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "intro", type: "text", rows: 2 }),
    defineField({ name: "sources", type: "array", of: [{ type: "source" }], validation: (rule) => rule.required().min(1) }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "Official sources", subtitle: "Sources" }),
  },
})

export const calculatorCta = defineType({
  name: "calculatorCta",
  title: "Calculator CTA",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "body", type: "text", rows: 2 }),
    defineField({
      name: "calculators",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "calculatorLink",
          fields: [
            defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
            defineField({
              name: "href",
              type: "string",
              validation: (rule) => rule.required().regex(/^\/calculators\//, { name: "calculator path" }),
            }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title, subtitle: "Calculator CTA" }) },
})

function linkCta(name: string, blockLabel: string, pathPrefix: RegExp, prefixLabel: string) {
  return defineType({
    name,
    title: blockLabel,
    type: "object",
    fields: [
      defineField({ name: "heading", type: "string", validation: (rule) => rule.required() }),
      defineField({ name: "body", type: "text", rows: 2 }),
      defineField({
        name: "href",
        type: "string",
        validation: (rule) => rule.required().regex(pathPrefix, { name: prefixLabel }),
      }),
      defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
    ],
    preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title, subtitle: blockLabel }) },
  })
}

export const programCta = linkCta("programCta", "Program CTA", /^\/programs\//, "program path")
export const areaCta = linkCta("areaCta", "Area guide CTA", /^\/areas\//, "area path")

export const consultationCta = defineType({
  name: "consultationCta",
  title: "Consultation CTA",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "body", type: "text", rows: 3 }),
    defineField({
      name: "href",
      type: "string",
      initialValue: "/consultation",
      validation: (rule) => rule.required().regex(/^\//, { name: "site-relative path" }),
    }),
    defineField({ name: "label", type: "string", initialValue: "Book a consultation", validation: (rule) => rule.required() }),
    defineField({ name: "secondaryHref", type: "string" }),
    defineField({ name: "secondaryLabel", type: "string" }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title, subtitle: "Consultation CTA" }) },
})

export const relatedLink = defineType({
  name: "relatedLink",
  title: "Related link",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "href",
      type: "string",
      validation: (rule) => rule.required().regex(/^\//, { name: "site-relative path" }),
    }),
    defineField({ name: "description", type: "string" }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
})

export const relatedArticles = defineType({
  name: "relatedArticles",
  title: "Related articles",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "intro", type: "text", rows: 2 }),
    defineField({ name: "links", type: "array", of: [{ type: "relatedLink" }], validation: (rule) => rule.required().min(1) }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "Related articles", subtitle: "Related" }),
  },
})

/** Every block available in an article body, in Studio insert-menu order. */
export const ARTICLE_BODY_MEMBERS = [
  richText,
  { type: "quickAnswer" },
  { type: "heroImage" },
  { type: "inlineImage" },
  { type: "imageGallery" },
  { type: "embed" },
  { type: "pullQuote" },
  { type: "callout" },
  { type: "complianceDisclaimer" },
  { type: "checklist" },
  { type: "comparisonTable" },
  { type: "faqGroup" },
  { type: "sourceList" },
  { type: "calculatorCta" },
  { type: "programCta" },
  { type: "areaCta" },
  { type: "consultationCta" },
  { type: "relatedArticles" },
]

export const blockTypes = [
  articleImage,
  quickAnswer,
  heroImage,
  inlineImage,
  imageGallery,
  embed,
  pullQuote,
  callout,
  complianceDisclaimer,
  checklist,
  comparisonTable,
  faq,
  faqGroup,
  source,
  sourceList,
  calculatorCta,
  programCta,
  areaCta,
  consultationCta,
  relatedLink,
  relatedArticles,
]
