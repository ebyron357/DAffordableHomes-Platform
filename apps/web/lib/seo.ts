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
 * time. In order of preference:
 *
 * 1. The title with the brand suffix, when that fits.
 * 2. The title alone. The reader needs the topic more than the site name,
 *    which Open Graph already carries as `og:site_name`.
 * 3. The title shortened at a word boundary, with an ellipsis. The schema
 *    allows a 120-character article title, and without this a long one
 *    shipped whole. The Studio warns the editor to write an SEO title instead,
 *    so this is the safety net, not the expected path.
 */
export function fittedTitle(title: string): Metadata["title"] {
  if (title.length + TITLE_SUFFIX.length <= TITLE_LIMIT) return title
  if (title.length <= TITLE_LIMIT) return { absolute: title }
  return { absolute: shortenAtWord(title, TITLE_LIMIT) }
}

/** `text` cut to at most `limit` characters, ellipsis included, on a word boundary. */
export function shortenAtWord(text: string, limit: number): string {
  if (text.length <= limit) return text
  const room = limit - 1 // the ellipsis takes one character
  const head = text.slice(0, room + 1)
  const lastSpace = head.lastIndexOf(" ")
  // Prefer the last whole word; fall back to a hard cut only when the title is
  // one very long word, where a word boundary would leave almost nothing.
  const cut = lastSpace >= room * 0.6 ? head.slice(0, lastSpace) : text.slice(0, room)
  return `${cut.replace(/[\s,.;:!?–—-]+$/u, "")}…`
}

/**
 * Ownership tags for Google Search Console and Bing Webmaster Tools.
 *
 * Each service gives the owner a token to publish as a `<meta>` tag. Set it in
 * Vercel as `GOOGLE_SITE_VERIFICATION` or `BING_SITE_VERIFICATION` and
 * redeploy; nothing is emitted while a variable is unset. The values are not
 * secrets (they are public by design), but they are read from the environment
 * so no account identifier is committed. Owners often paste the whole tag the
 * service shows, so the token is extracted from a pasted `content="…"` too.
 */
export function searchVerification(
  env: Record<string, string | undefined> = process.env,
): Metadata["verification"] | undefined {
  const google = verificationToken(env.GOOGLE_SITE_VERIFICATION)
  const bing = verificationToken(env.BING_SITE_VERIFICATION)
  if (!google && !bing) return undefined
  return {
    ...(google ? { google } : {}),
    ...(bing ? { other: { "msvalidate.01": bing } } : {}),
  }
}

/** The bare token from a token or a pasted meta tag; anything else is ignored. */
function verificationToken(raw: string | undefined): string | undefined {
  const value = raw?.trim().match(/content=["']([^"']+)["']/)?.[1] ?? raw?.trim()
  return value && /^[A-Za-z0-9_-]{8,128}$/.test(value) ? value : undefined
}
