import { defineArrayMember, defineField, defineType } from "sanity"

/**
 * Reusable editorial block library.
 *
 * Every block in this file describes *structure and authoring rules only*.
 * Article-specific copy lives in the Content Lake (or in the committed
 * canonical dataset used to seed it) — never in these definitions and never in
 * the React renderers that consume them.
 */

const CALCULATOR_OPTIONS = [
  { title: "Affordability", value: "affordability" },
  { title: "Mortgage payment", value: "mortgage-payment" },
  { title: "Closing costs", value: "closing-costs" },
  { title: "Down payment", value: "down-payment" },
  { title: "Rent vs. buy", value: "rent-vs-buy" },
]

/** Portable Text used by every prose-bearing block. */
export const richTextBody = defineType({
  name: "richTextBody",
  title: "Rich text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Paragraph", value: "normal" },
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
            title: "Link",
            type: "object",
            fields: [
              defineField({
                name: "href",
                title: "URL or path",
                type: "string",
                validation: (rule) => rule.required(),
              }),
            ],
          }),
        ],
      },
    }),
  ],
})

/**
 * Image reference that accepts either a Content Lake asset or an approved
 * repository asset path, so migrated articles can keep using vetted artwork
 * that already ships with the application.
 */
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
      description: "Use when the artwork ships with the application, for example /images/planning-table.png",
    }),
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description: "Describe what the image shows. Never restate the headline and never claim a location.",
      validation: (rule) =>
        rule
          .required()
          .min(12)
          .error("Meaningful alternative text is required for every published image."),
    }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
    defineField({ name: "credit", title: "Credit", type: "string" }),
    defineField({
      name: "focalPoint",
      title: "CSS object-position",
      type: "string",
      description: 'Optional crop focus, for example "50% 35%".',
    }),
  ],
  validation: (rule) =>
    rule.custom((value: { asset?: unknown; src?: string } | undefined) => {
      if (!value) return true
      if (value.asset || (value.src && value.src.trim().length > 0)) return true
      return "Provide either an uploaded image or an approved repository asset path."
    }),
})

export const quickAnswerBlock = defineType({
  name: "quickAnswerBlock",
  title: "Quick answer",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string", initialValue: "The quick answer", validation: (r) => r.required() }),
    defineField({ name: "content", type: "richTextBody", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: `Quick answer — ${title ?? ""}` }) },
})

export const heroImageBlock = defineType({
  name: "heroImageBlock",
  title: "Hero image",
  type: "object",
  fields: [defineField({ name: "image", type: "articleImage", validation: (r) => r.required() })],
})

export const inlineImageBlock = defineType({
  name: "inlineImageBlock",
  title: "Inline image",
  type: "object",
  fields: [
    defineField({ name: "image", type: "articleImage", validation: (r) => r.required() }),
    defineField({
      name: "width",
      type: "string",
      options: { list: [{ title: "Content width", value: "content" }, { title: "Full bleed", value: "wide" }] },
      initialValue: "content",
    }),
  ],
})

export const imageGalleryBlock = defineType({
  name: "imageGalleryBlock",
  title: "Image gallery",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({
      name: "images",
      type: "array",
      of: [defineArrayMember({ type: "articleImage" })],
      validation: (r) => r.min(2).error("A gallery needs at least two images."),
    }),
  ],
})

export const videoEmbedBlock = defineType({
  name: "videoEmbedBlock",
  title: "Video or embed",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "url", type: "url", validation: (r) => r.required() }),
    defineField({ name: "description", type: "text", rows: 2 }),
    defineField({ name: "poster", type: "articleImage" }),
  ],
})

export const quoteBlock = defineType({
  name: "quoteBlock",
  title: "Quote",
  type: "object",
  fields: [
    defineField({ name: "quote", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "attribution", type: "string" }),
    defineField({ name: "role", type: "string" }),
  ],
})

export const calloutBlock = defineType({
  name: "calloutBlock",
  title: "Callout",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({
      name: "tone",
      type: "string",
      options: {
        list: [
          { title: "Insight", value: "insight" },
          { title: "Caution", value: "caution" },
          { title: "Key point", value: "key" },
        ],
      },
      initialValue: "insight",
    }),
    defineField({ name: "content", type: "richTextBody", validation: (r) => r.required() }),
  ],
})

export const complianceDisclaimerBlock = defineType({
  name: "complianceDisclaimerBlock",
  title: "Compliance disclaimer",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string", initialValue: "Important notice" }),
    defineField({ name: "content", type: "richTextBody", validation: (r) => r.required() }),
  ],
})

export const checklistBlock = defineType({
  name: "checklistBlock",
  title: "Checklist",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
    defineField({ name: "intro", type: "text", rows: 2 }),
    defineField({
      name: "items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "checklistItem",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "detail", type: "string" }),
          ],
          preview: { select: { title: "label" } },
        }),
      ],
      validation: (r) => r.min(2).error("A checklist needs at least two items."),
    }),
  ],
})

export const comparisonTableBlock = defineType({
  name: "comparisonTableBlock",
  title: "Comparison table",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
    defineField({ name: "caption", type: "text", rows: 2, description: "Accessible summary of what the table compares." }),
    defineField({
      name: "columns",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (r) => r.min(2).error("A comparison table needs at least two columns."),
    }),
    defineField({
      name: "rows",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "comparisonRow",
          fields: [
            defineField({ name: "header", type: "string", validation: (r) => r.required() }),
            defineField({ name: "cells", type: "array", of: [defineArrayMember({ type: "text", rows: 2 })] }),
          ],
          preview: { select: { title: "header" } },
        }),
      ],
      validation: (r) => r.min(1),
    }),
  ],
})

export const faqBlock = defineType({
  name: "faqBlock",
  title: "Frequently asked questions",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string", initialValue: "Frequently asked questions" }),
    defineField({
      name: "faqs",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "faqItem",
          fields: [
            defineField({ name: "question", type: "string", validation: (r) => r.required() }),
            defineField({ name: "answer", type: "text", rows: 4, validation: (r) => r.required() }),
          ],
          preview: { select: { title: "question" } },
        }),
      ],
      validation: (r) => r.min(1).error("An FAQ block needs at least one question."),
    }),
  ],
})

export const officialSourcesBlock = defineType({
  name: "officialSourcesBlock",
  title: "Official sources",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string", initialValue: "Official sources and review notes" }),
    defineField({ name: "intro", type: "text", rows: 3 }),
    defineField({
      name: "sources",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "officialSource",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "href", type: "url", validation: (r) => r.required() }),
            defineField({ name: "publisher", type: "string" }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
      validation: (r) => r.min(1).error("Cite at least one official source."),
    }),
  ],
})

function ctaFields(defaultLabel: string) {
  return [
    defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
    defineField({ name: "body", type: "text", rows: 3 }),
    defineField({ name: "href", type: "string", validation: (r) => r.required() }),
    defineField({ name: "label", type: "string", initialValue: defaultLabel, validation: (r) => r.required() }),
  ]
}

export const calculatorCtaBlock = defineType({
  name: "calculatorCtaBlock",
  title: "Calculator call to action",
  type: "object",
  fields: [
    defineField({
      name: "calculator",
      type: "string",
      options: { list: CALCULATOR_OPTIONS },
      validation: (r) => r.required(),
    }),
    ...ctaFields("Open the calculator"),
  ],
})

export const programCtaBlock = defineType({
  name: "programCtaBlock",
  title: "Program call to action",
  type: "object",
  fields: [
    defineField({
      name: "program",
      type: "string",
      options: { list: [{ title: "NACA", value: "naca" }, { title: "Homes for Heroes", value: "homes-for-heroes" }] },
      validation: (r) => r.required(),
    }),
    ...ctaFields("Read the program guidance"),
  ],
})

export const areaGuideCtaBlock = defineType({
  name: "areaGuideCtaBlock",
  title: "Area guide call to action",
  type: "object",
  fields: [defineField({ name: "area", type: "string", validation: (r) => r.required() }), ...ctaFields("Open the area guide")],
})

export const consultationCtaBlock = defineType({
  name: "consultationCtaBlock",
  title: "Consultation call to action",
  type: "object",
  fields: ctaFields("Book a consultation"),
})

export const relatedArticlesBlock = defineType({
  name: "relatedArticlesBlock",
  title: "Related articles",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string", initialValue: "Continue your plan" }),
    defineField({
      name: "links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "relatedLink",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "href", type: "string", validation: (r) => r.required() }),
            defineField({ name: "description", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
      validation: (r) => r.min(1),
    }),
  ],
})

/** Every block type an article body may contain. */
export const ARTICLE_BODY_BLOCKS = [
  "richTextBlock",
  "quickAnswerBlock",
  "heroImageBlock",
  "inlineImageBlock",
  "imageGalleryBlock",
  "videoEmbedBlock",
  "quoteBlock",
  "calloutBlock",
  "complianceDisclaimerBlock",
  "checklistBlock",
  "comparisonTableBlock",
  "faqBlock",
  "officialSourcesBlock",
  "calculatorCtaBlock",
  "programCtaBlock",
  "areaGuideCtaBlock",
  "consultationCtaBlock",
  "relatedArticlesBlock",
] as const

export const richTextBlock = defineType({
  name: "richTextBlock",
  title: "Rich text",
  type: "object",
  fields: [defineField({ name: "content", type: "richTextBody", validation: (r) => r.required() })],
  preview: { prepare: () => ({ title: "Rich text" }) },
})

export const blockTypes = [
  richTextBody,
  articleImage,
  richTextBlock,
  quickAnswerBlock,
  heroImageBlock,
  inlineImageBlock,
  imageGalleryBlock,
  videoEmbedBlock,
  quoteBlock,
  calloutBlock,
  complianceDisclaimerBlock,
  checklistBlock,
  comparisonTableBlock,
  faqBlock,
  officialSourcesBlock,
  calculatorCtaBlock,
  programCtaBlock,
  areaGuideCtaBlock,
  consultationCtaBlock,
  relatedArticlesBlock,
]
