/**
 * Sanity environment configuration.
 *
 * Every value is read from environment variables. No project identifier, token,
 * dataset name, or secret is ever committed to this repository.
 *
 * Required for a live Content Lake connection:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID   Sanity project id
 *   NEXT_PUBLIC_SANITY_DATASET      dataset name (defaults to "production")
 *
 * Optional:
 *   NEXT_PUBLIC_SANITY_API_VERSION  Content Lake API date (defaults below)
 *   SANITY_API_READ_TOKEN           viewer token, required for draft preview
 *   SANITY_REVALIDATE_SECRET        shared secret for the publish webhook
 *   NEXT_PUBLIC_SITE_URL            canonical origin override for previews
 */

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-08-01"

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production"

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ""

export const readToken = process.env.SANITY_API_READ_TOKEN ?? ""

export const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET ?? ""

export const studioBasePath = "/studio"

/**
 * True when a Sanity project id is configured for this environment.
 *
 * When false the application serves the committed canonical article dataset
 * (`content/articles/*.json`) — the exact same documents the import script
 * pushes into Sanity — so the published routes remain intact in environments
 * that have no Content Lake credentials.
 */
export function isSanityConfigured(): boolean {
  return projectId.trim().length > 0
}

/**
 * True when draft/preview reads are possible. Previewing unpublished content
 * requires a viewer token in addition to a configured project.
 */
export function isPreviewConfigured(): boolean {
  return isSanityConfigured() && readToken.trim().length > 0
}
