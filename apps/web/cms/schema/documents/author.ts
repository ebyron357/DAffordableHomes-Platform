import { defineField, defineType } from "sanity"

import { isSafeInternalPath } from "@/lib/safe-path"

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
      // This value is published as the author's identity in Article JSON-LD and
      // in Open Graph metadata, so an off-origin value is an attribution claim
      // pointing at somebody else's site. Constrained to a same-origin path;
      // the renderers sanitise it again, because schema validation only covers
      // what the Studio can save.
      validation: (rule) =>
        rule.custom((value: string | undefined) =>
          value === undefined || isSafeInternalPath(value)
            ? true
            : "Use a site-relative path such as /about. Absolute or protocol-relative values would publish an off-site author identity.",
        ),
    }),
    defineField({ name: "image", type: "articleImage" }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "image" } },
})
