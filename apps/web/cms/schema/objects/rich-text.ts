import { defineArrayMember, defineType } from "sanity"

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
                validation: (rule) =>
                  rule
                    .required()
                    .custom((value: string | undefined) =>
                      !value || /^(https?:\/\/|\/|mailto:|tel:)/.test(value)
                        ? true
                        : "Use an absolute URL, a site-relative path, mailto: or tel:",
                    ),
              },
            ],
          },
        ],
      },
    }),
  ],
})
