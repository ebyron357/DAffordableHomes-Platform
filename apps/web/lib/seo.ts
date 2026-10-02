import type { Metadata } from "next"

import { SITE } from "@/lib/site"

/**
 * Search and social metadata shared across routes.
 *
 * ## Why the share image is explicit, not a file-convention default
 *
 * Next merges `openGraph` by replacement, not field by field: a route that
 * declares its own `openGraph` object drops the parent's entirely, images
 * included. A root `opengraph-image` file would therefore reach only the routes
 * that declare no `openGraph` at all, and silently miss the homepage, the
 * program pages and every article. Every route that declares `openGraph` spreads
 * `SHARE_IMAGES` instead, and `tests/static/search-metadata.test.mjs` fails if
 * one does not.
 *
 * The card is built only from approved material: the official logo, the brand
 * palette, and copy already published on the homepage. It carries no photograph,
 * so it can never be read as depicting a property or a person.
 */
export const SHARE_IMAGE = {
  url: "/images/share/daffordable-homes-share.png",
  width: 1200,
  height: 630,
  alt: `${SITE.name} — Buying a home in Dallas–Fort Worth, with someone who explains it. ${SITE.realtorName}.`,
} as const

export const SHARE_IMAGES = { images: [SHARE_IMAGE] }

/** What the layout's title template appends to every page title. */
const TITLE_SUFFIX = ` — ${SITE.name}`

/** Roughly where search results start truncating a title. */
export const TITLE_LIMIT = 60

/**
 * A page title that stays inside the search-result width.
 *
 * Article titles come from the CMS, so their length is not known at build
 * time. When the templated form would run past the limit, the brand suffix is
 * dropped rather than the title itself: the reader needs the topic more than
 * the site name, which Open Graph already carries as `og:site_name`.
 */
export function fittedTitle(title: string): Metadata["title"] {
  return title.length + TITLE_SUFFIX.length > TITLE_LIMIT ? { absolute: title } : title
}
