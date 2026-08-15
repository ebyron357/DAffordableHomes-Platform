import { defineField, defineType } from "sanity"

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "role",
      type: "string",
      description: "Public-facing designation, e.g. “REALTOR®”. Never publish an unverified credential.",
    }),
    defineField({ name: "bio", type: "text", rows: 4 }),
    defineField({
      name: "url",
      type: "string",
      initialValue: "/about",
      description: "Site-relative profile path.",
    }),
    defineField({ name: "image", type: "articleImage" }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "image" } },
})
