import { defineField, defineType } from "sanity"

import { ARTICLE_BODY_MEMBERS, richText } from "./blocks"

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "displayName",
      type: "string",
      description: "Byline as published, e.g. Debra Allen, REALTOR®",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "role", type: "string" }),
    defineField({ name: "profilePath", type: "string", description: "Site-relative path, e.g. /about" }),
    defineField({ name: "bio", type: "text", rows: 4 }),
  ],
  preview: { select: { title: "displayName", subtitle: "role" } },
})

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "description", type: "text", rows: 3 }),
  ],
})

function taxonomyDocument(name: string, title: string, pathHint: string) {
  return defineType({
    name,
    title,
    type: "document",
    fields: [
      defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
      defineField({
        name: "slug",
        type: "slug",
        options: { source: "title", maxLength: 96 },
        validation: (rule) => rule.required(),
      }),
      defineField({ name: "path", type: "string", description: `Site-relative path, e.g. ${pathHint}` }),
      defineField({ name: "summary", type: "text", rows: 3 }),
    ],
  })
}

export const program = taxonomyDocument("program", "Program", "/programs/naca")
export const area = taxonomyDocument("area", "Area", "/areas/garland")

export const article = defineType({
  name: "article",
  title: "Article",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "editorial", title: "Editorial" },
    { name: "seo", title: "SEO & social" },
    { name: "relationships", title: "Relationships" },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "content",
      description: "Published article URLs must never change once live.",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "eyebrow", type: "string", group: "content" }),
    defineField({
      name: "excerpt",
      type: "text",
      rows: 3,
      group: "content",
      validation: (rule) => rule.required().min(60).max(320),
    }),
    defineField({
      name: "featuredImage",
      type: "articleImage",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      type: "array",
      group: "content",
      of: ARTICLE_BODY_MEMBERS,
      validation: (rule) => rule.required().min(1).error("An article needs at least one body block."),
    }),

    defineField({
      name: "status",
      title: "Publication state",
      type: "string",
      group: "editorial",
      initialValue: "draft",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Published", value: "published" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
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
      type: "datetime",
      group: "editorial",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "reviewedAt",
      title: "Last reviewed",
      type: "datetime",
      group: "editorial",
      validation: (rule) =>
        rule.required().custom((reviewedAt, context) => {
          const publishedAt = (context.document as { publishedAt?: string } | undefined)?.publishedAt
          if (!reviewedAt || !publishedAt) return true
          return new Date(reviewedAt) >= new Date(publishedAt) ? true : "Review date cannot precede the publish date."
        }),
    }),
    defineField({
      name: "readingTimeMinutes",
      title: "Reading time (minutes)",
      type: "number",
      group: "editorial",
      validation: (rule) => rule.required().integer().min(1).max(90),
    }),
    defineField({
      name: "faqs",
      type: "array",
      of: [{ type: "faq" }],
      group: "editorial",
      description: "Rendered on the page and emitted as FAQPage structured data.",
    }),
    defineField({ name: "sources", type: "array", of: [{ type: "source" }], group: "editorial" }),
    defineField({
      name: "complianceNotice",
      title: "Compliance notice",
      type: "array",
      of: [richText],
      group: "editorial",
      description: "Program boundaries and disclaimers shown at the end of the article.",
    }),

    defineField({ name: "seoTitle", type: "string", group: "seo", validation: (rule) => rule.max(70) }),
    defineField({
      name: "seoDescription",
      type: "text",
      rows: 3,
      group: "seo",
      validation: (rule) => rule.required().min(70).max(180),
    }),
    defineField({
      name: "canonicalOverride",
      title: "Canonical URL override",
      type: "url",
      group: "seo",
      description: "Leave empty unless this article canonicalises to another URL.",
      validation: (rule) => rule.uri({ scheme: ["https"] }),
    }),
    defineField({ name: "socialImage", type: "articleImage", group: "seo" }),

    defineField({
      name: "programs",
      type: "array",
      of: [{ type: "reference", to: [{ type: "program" }] }],
      group: "relationships",
    }),
    defineField({
      name: "areas",
      type: "array",
      of: [{ type: "reference", to: [{ type: "area" }] }],
      group: "relationships",
    }),
    defineField({
      name: "relatedArticles",
      type: "array",
      of: [{ type: "reference", to: [{ type: "article" }] }],
      group: "relationships",
    }),
    defineField({
      name: "relatedLinks",
      title: "Continue-your-plan links",
      type: "array",
      of: [{ type: "relatedLink" }],
      group: "relationships",
    }),
  ],
  orderings: [
    { name: "publishedDesc", title: "Newest first", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", status: "status", media: "featuredImage.asset", date: "publishedAt" },
    prepare: ({ title, status, media, date }) => ({
      title,
      subtitle: `${status === "published" ? "Published" : "Draft"}${date ? ` · ${String(date).slice(0, 10)}` : ""}`,
      media,
    }),
  },
})

export const documentTypes = [article, author, category, program, area]
