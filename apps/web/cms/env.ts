/**
 * Sanity environment resolution.
 *
 * No secrets live in the repository. Every value below comes from environment
 * variables, and the application degrades honestly when they are absent:
 * `isSanityConfigured` is false, the Content Lake is never contacted, and
 * `lib/blog/source.ts` serves the migration seed instead of failing the build.
 */

export const SANITY_API_VERSION =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-08-01"

export const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ""

export const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production"

/**
 * Server-only token with Viewer access. Required for draft-mode previews and
 * for reading unpublished documents. Never exposed to the browser.
 */
export const SANITY_API_READ_TOKEN = process.env.SANITY_API_READ_TOKEN ?? ""

/** Shared secret asserted by the publish webhook before revalidating. */
export const SANITY_REVALIDATE_SECRET = process.env.SANITY_REVALIDATE_SECRET ?? ""

/** Sanity project IDs are lowercase alphanumeric. */
const PROJECT_ID_PATTERN = /^[a-z0-9]+$/

/** True only when the Content Lake can actually be queried. */
export const isSanityConfigured =
  SANITY_PROJECT_ID.length > 0 && PROJECT_ID_PATTERN.test(SANITY_PROJECT_ID)

/** True when draft previews can be served. */
export const isPreviewConfigured =
  isSanityConfigured && SANITY_API_READ_TOKEN.length > 0

export const STUDIO_BASE_PATH = "/studio"

/**
 * Explains the current configuration state in one line. Surfaced by the Studio
 * route and the CMS status test so a misconfigured deploy is visible rather
 * than silent.
 */
export function describeSanityConfig(): string {
  if (!isSanityConfigured) {
    return "Sanity is not configured: NEXT_PUBLIC_SANITY_PROJECT_ID is missing or invalid."
  }
  if (!isPreviewConfigured) {
    return `Sanity is configured for project ${SANITY_PROJECT_ID} / dataset ${SANITY_DATASET}. Draft preview is disabled: SANITY_API_READ_TOKEN is missing.`
  }
  return `Sanity is configured for project ${SANITY_PROJECT_ID} / dataset ${SANITY_DATASET} with draft preview enabled.`
}
