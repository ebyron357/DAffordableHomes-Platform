/**
 * Sanity environment. No secrets are committed; every value is read from the
 * environment. See docs/12-governance/CMS_ENVIRONMENT.md.
 */

export const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ""
export const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production"
export const SANITY_API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-08-01"
/** Server-only. Required for draft previews and never exposed to the browser. */
export const SANITY_READ_TOKEN = process.env.SANITY_API_READ_TOKEN ?? ""
/** Server-only. Shared secret the Sanity webhook uses to trigger revalidation. */
export const SANITY_REVALIDATE_SECRET = process.env.SANITY_REVALIDATE_SECRET ?? ""

/**
 * True once a Sanity project is provisioned. Until then the app serves the
 * committed bootstrap content source, which holds the same documents that
 * `content/sanity/articles.ndjson` imports into the Content Lake.
 */
export function isSanityConfigured(): boolean {
  return SANITY_PROJECT_ID.length > 0
}

/** Draft previews additionally require a read token. */
export function isSanityPreviewConfigured(): boolean {
  return isSanityConfigured() && SANITY_READ_TOKEN.length > 0
}

export function contentSourceName(): "sanity" | "bootstrap" {
  return isSanityConfigured() ? "sanity" : "bootstrap"
}
