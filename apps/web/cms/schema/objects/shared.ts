import { defineField, defineType } from "sanity"

import { isSafeInternalPath } from "@/lib/safe-path"

/**
 * Image with mandatory, meaningful alternative text.
 *
 * Alt text is validated for length and rejected when it is a filename or a
 * generic filler phrase, because an unusable alt string passes a presence
 * check while still failing a real accessibility audit.
 */
export const articleImage = defineType({
  name: "articleImage",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description: "Describe what the image shows for readers using a screen reader.",
      validation: (rule) =>
        rule
          .required()
          .min(10)
          .max(180)
          .custom((value: string | undefined) => {
            if (!value) return true
            if (/\.(jpe?g|png|webp|gif|avif)$/i.test(value.trim())) {
              return "Alt text must describe the image, not repeat the filename."
            }
            if (/^(image|photo|picture|graphic|placeholder)\b/i.test(value.trim())) {
              return "Write descriptive alt text instead of a generic label."
            }
            return true
          }),
    }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
    defineField({ name: "credit", title: "Credit", type: "string" }),
  ],
})

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "object",
  fields: [
    defineField({
      name: "question",
      type: "string",
      validation: (rule) => rule.required().min(8),
    }),
    defineField({
      name: "answer",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().min(20),
    }),
  ],
  preview: { select: { title: "question", subtitle: "answer" } },
})

export const officialSource = defineType({
  name: "officialSource",
  title: "Official source",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "href",
      title: "URL",
      type: "url",
      validation: (rule) => rule.required().uri({ scheme: ["https"] }),
    }),
    defineField({ name: "publisher", type: "string" }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
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
      validation: (rule) =>
        rule
          .required()
          .custom((value: string | undefined) =>
            isSafeInternalPath(value) || value?.startsWith("https://")
              ? true
              : "Use a site-relative path or an https URL. Protocol-relative values such as //example.com leave the site.",
          ),
    }),
    defineField({ name: "description", type: "string", validation: (rule) => rule.required() }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
})
