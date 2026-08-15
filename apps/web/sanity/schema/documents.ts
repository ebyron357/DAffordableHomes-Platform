import { defineArrayMember, defineField, defineType } from "sanity"
import { ARTICLE_BODY_BLOCKS } from "./blocks"

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "credential", type: "string", description: 'Verified designation only, for example "REALTOR®".' }),
    defineField({ name: "bio", type: "text", rows: 4 }),
    defineField({ name: "profileUrl", type: "string", description: "Path to the on-site profile, for example /about." }),
    defineField({ name: "image", type: "articleImage" }),
  ],
  preview: { select: { title: "name", subtitle: "credential" } },
})

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "description", type: "text", rows: 3 }),
  ],
  preview: { select: { title: "title", subtitle: "description" } },
})

export const program = defineType({
  name: "program",
  title: "Program",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "href", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "boundary",
      title: "Program boundary statement",
      type: "text",
      rows: 3,
      description: "Who controls eligibility and approvals for this program.",
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: "title", subtitle: "href" } },
})

export const area = defineType({
  name: "area",
  title: "Area",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "href", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", type: "text", rows: 3 }),
  ],
  preview: { select: { title: "title", subtitle: "href" } },
})

export const article = defineType({
  name: "article",
  title: "Article",
  type: "document",
  groups: [
    { name: "editorial", title: "Editorial", default: true },
    { name: "media", title: "Media" },
    { name: "seo", title: "SEO" },
    { name: "associations", title: "Associations" },
    { name: "publication", title: "Publication" },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "editorial",
      validation: (r) => r.required().min(12).max(120),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "editorial",
      options: { source: "title", maxLength: 96 },
      description: "Published article URLs must never change once live.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      group: "editorial",
      description: "Short kicker shown above the headline.",
    }),
    defineField({
      name: "excerpt",
      type: "text",
      rows: 3,
      group: "editorial",
      validation: (r) => r.required().min(60).max(320),
    }),
    defineField({
      name: "author",
      type: "reference",
      to: [{ type: "author" }],
      group: "editorial",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      type: "reference",
      to: [{ type: "category" }],
      group: "editorial",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "readingTime",
      title: "Reading time",
      type: "string",
      group: "editorial",
      description: 'For example "10 minute read".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "featuredImage",
      title: "Featured image",
      type: "articleImage",
      group: "media",
      description:
        "Required for publication. Use approved artwork only, never imagery that implies a location the article cannot support.",
    }),
    defineField({
      name: "featuredImageLayout",
      title: "Featured image treatment",
      type: "string",
      group: "media",
      options: {
        list: [
          { title: "Photographic hero", value: "photographic" },
          { title: "Editorial type-only hero", value: "editorial" },
        ],
      },
      initialValue: "photographic",
      description:
        "Choose the type-only treatment when no trustworthy, non-misleading photograph exists for the subject.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Publish date",
      type: "date",
      group: "publication",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "reviewedAt",
      title: "Reviewed date",
      type: "date",
      group: "publication",
      validation: (r) =>
        r.custom((reviewedAt: string | undefined, context) => {
          const publishedAt = (context.document as { publishedAt?: string } | undefined)?.publishedAt
          if (!reviewedAt || !publishedAt) return true
          return reviewedAt >= publishedAt ? true : "The reviewed date cannot precede the publish date."
        }),
    }),
    defineField({
      name: "status",
      title: "Publication state",
      type: "string",
      group: "publication",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Published", value: "published" },
          { title: "Archived", value: "archived" },
        ],
        layout: "radio",
      },
      initialValue: "draft",
      validation: (r) => r.required(),
    }),
    defineField({ name: "seoTitle", title: "SEO title", type: "string", group: "seo", validation: (r) => r.max(70) }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      rows: 3,
      group: "seo",
      validation: (r) => r.required().min(70).max(180),
    }),
    defineField({ name: "socialImage", title: "Social image", type: "articleImage", group: "seo" }),
    defineField({
      name: "body",
      title: "Body blocks",
      type: "array",
      group: "editorial",
      of: ARTICLE_BODY_BLOCKS.map((type) => defineArrayMember({ type })),
      validation: (r) => r.required().min(1).error("An article needs at least one body block."),
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      group: "editorial",
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
    }),
    defineField({
      name: "officialSources",
      title: "Official sources",
      type: "array",
      group: "editorial",
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
    }),
    defineField({
      name: "disclaimer",
      title: "Compliance disclaimer",
      type: "richTextBody",
      group: "editorial",
      description: "Program boundaries and limits shown at the end of the article.",
    }),
    defineField({
      name: "relatedArticles",
      title: "Related articles",
      type: "array",
      group: "associations",
      of: [defineArrayMember({ type: "reference", to: [{ type: "article" }] })],
    }),
    defineField({
      name: "relatedLinks",
      title: "Related resources",
      type: "array",
      group: "associations",
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
    }),
    defineField({
      name: "programs",
      title: "Program associations",
      type: "array",
      group: "associations",
      of: [defineArrayMember({ type: "reference", to: [{ type: "program" }] })],
    }),
    defineField({
      name: "areas",
      title: "Area associations",
      type: "array",
      group: "associations",
      of: [defineArrayMember({ type: "reference", to: [{ type: "area" }] })],
    }),
  ],
  validation: (rule) =>
    rule.custom((doc: Record<string, unknown> | undefined) => {
      if (!doc || doc.status !== "published") return true
      const featured = doc.featuredImage as { asset?: unknown; src?: string; alt?: string } | undefined
      const layout = doc.featuredImageLayout
      if (layout === "photographic") {
        if (!featured || (!featured.asset && !featured.src)) {
          return "A published article needs a featured image, or the editorial type-only treatment."
        }
        if (!featured.alt || featured.alt.trim().length < 12) {
          return "A published featured image needs meaningful alternative text."
        }
      }
      return true
    }),
  preview: {
    select: { title: "title", subtitle: "status", slug: "slug.current" },
    prepare: ({ title, subtitle, slug }) => ({ title, subtitle: `${subtitle ?? "draft"} — /blog/${slug ?? ""}` }),
  },
  orderings: [
    { title: "Publish date, newest", name: "publishedDesc", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
})

export const documentTypes = [article, author, category, program, area]
