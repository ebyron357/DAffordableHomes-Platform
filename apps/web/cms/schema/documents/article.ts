import { defineArrayMember, defineField, defineType } from "sanity"

import { articleBodyBlocks } from "../objects/blocks"

const PROGRAMS = [
  { title: "NACA", value: "naca" },
  { title: "Homes for Heroes", value: "homes-for-heroes" },
  { title: "First-time buyer programs", value: "first-time-buyers" },
]

const AREAS = [
  { title: "Garland", value: "garland" },
  { title: "Dallas–Fort Worth", value: "dallas-fort-worth" },
  { title: "North Texas", value: "north-texas" },
]

/**
 * Article — the only document type a new blog post needs.
 *
 * Publishing a new article requires no new route file: `/blog/[slug]` reads
 * every article from here.
 */
export const article = defineType({
  name: "article",
  title: "Article",
  type: "document",
  groups: [
    { name: "editorial", title: "Editorial", default: true },
    { name: "media", title: "Media" },
    { name: "seo", title: "SEO" },
    { name: "relationships", title: "Relationships" },
    { name: "compliance", title: "Compliance" },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "editorial",
      validation: (rule) => rule.required().min(10).max(120),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "editorial",
      description:
        "Published URLs must never change. Editing the slug of a live article breaks its links and search history.",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      group: "editorial",
      description: "Short kicker above the headline, e.g. “NACA homebuyer field guide”.",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "excerpt",
      type: "text",
      rows: 3,
      group: "editorial",
      validation: (rule) => rule.required().min(60).max(320),
    }),
    defineField({
      name: "author",
      type: "reference",
      to: [{ type: "author" }],
      group: "editorial",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      type: "reference",
      to: [{ type: "category" }],
      group: "editorial",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Publish date",
      type: "date",
      group: "editorial",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "reviewedAt",
      title: "Reviewed date",
      type: "date",
      group: "editorial",
      description: "Required once the article has been fact-checked or updated.",
      validation: (rule) =>
        rule.custom((value: string | undefined, context) => {
          const published = context.document?.publishedAt as string | undefined
          if (!value || !published) return true
          return value >= published
            ? true
            : "The reviewed date cannot be earlier than the publish date."
        }),
    }),
    defineField({
      name: "readingTime",
      type: "string",
      group: "editorial",
      description: "For example “10 minute read”.",
      validation: (rule) =>
        rule
          .required()
          .custom((value: string | undefined) =>
            !value || /^\d+ minute read$/.test(value)
              ? true
              : "Use the format “10 minute read”.",
          ),
    }),
    defineField({
      name: "publicationState",
      title: "Publication state",
      type: "string",
      group: "editorial",
      initialValue: "draft",
      options: {
        list: [
          { title: "Draft — not visible publicly", value: "draft" },
          { title: "Published — live on the site", value: "published" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "featuredImage",
      type: "articleImage",
      group: "media",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "socialImage",
      type: "articleImage",
      group: "media",
      description: "Optional. Falls back to the featured image.",
    }),

    defineField({
      name: "body",
      type: "array",
      group: "editorial",
      of: articleBodyBlocks.map((block) => defineArrayMember({ type: block.name })),
      validation: (rule) => rule.required().min(1),
    }),

    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      group: "editorial",
      of: [defineArrayMember({ type: "faq" })],
    }),
    defineField({
      name: "sources",
      title: "Official sources",
      type: "array",
      group: "compliance",
      of: [defineArrayMember({ type: "officialSource" })],
    }),
    defineField({
      name: "notice",
      title: "Editorial notice",
      type: "richText",
      group: "compliance",
      description:
        "Program boundary or educational disclaimer shown at the end of the article.",
    }),

    defineField({
      name: "relatedLinks",
      type: "array",
      group: "relationships",
      of: [defineArrayMember({ type: "relatedLink" })],
    }),
    defineField({
      name: "relatedArticles",
      type: "array",
      group: "relationships",
      of: [defineArrayMember({ type: "reference", to: [{ type: "article" }] })],
      validation: (rule) => rule.max(3).unique(),
    }),
    defineField({
      name: "programs",
      title: "Program associations",
      type: "array",
      group: "relationships",
      of: [defineArrayMember({ type: "string" })],
      options: { list: PROGRAMS },
    }),
    defineField({
      name: "areas",
      title: "Area associations",
      type: "array",
      group: "relationships",
      of: [defineArrayMember({ type: "string" })],
      options: { list: AREAS },
    }),

    defineField({
      name: "seoTitle",
      title: "SEO title",
      type: "string",
      group: "seo",
      description: "Optional. Falls back to the article title.",
      validation: (rule) => rule.max(70),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      rows: 3,
      group: "seo",
      validation: (rule) => rule.required().min(70).max(320),
    }),
  ],
  preview: {
    select: {
      title: "title",
      state: "publicationState",
      media: "featuredImage",
      date: "publishedAt",
    },
    prepare: ({ title, state, media, date }) => ({
      title,
      subtitle: `${state === "published" ? "Published" : "Draft"}${date ? ` · ${date}` : ""}`,
      media,
    }),
  },
})
