import { defineArrayMember, defineType } from "sanity"

import { toSafeHref } from "@/lib/safe-path"

/**
 * Portable Text used by every prose surface.
 *
 * Headings, ordered lists and unordered lists are Portable Text styles and list
 * types rather than separate block objects — that is how editors expect to work
 * and it keeps heading hierarchy inside a single flowing document.
 */
export const richText = defineType({
  name: "richText",
  title: "Rich text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Body", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Heading 4", value: "h4" },
        { title: "Quote", value: "blockquote" },
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
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              {
                name: "href",
                type: "string",
                title: "URL",
                /**
                 * Delegates to the renderer's own allowlist.
                 *
                 * This used to be a separate `https?://|mailto:|tel:` regex, and
                 * the two contracts drifted: the renderer stopped accepting
                 * `http:`, while this still let an editor save one. The link then
                 * rendered as plain text with nothing in the Studio to explain
                 * why. Calling `toSafeHref` means "the Studio accepts it" and
                 * "the renderer will render it" are the same predicate by
                 * construction, so they cannot disagree again.
                 */
                validation: (rule) =>
                  rule
                    .required()
                    .custom((value: string | undefined) =>
                      toSafeHref(value) !== null
                        ? true
                        : "Use an https URL, a site-relative path, mailto: or tel:. Plain http and protocol-relative values such as //example.com are not rendered as links.",
                    ),
              },
            ],
          },
        ],
      },
    }),
  ],
})
