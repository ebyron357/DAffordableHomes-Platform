import createImageUrlBuilder from "@sanity/image-url"
import { dataset, isSanityConfigured, projectId } from "../env"

const builder = isSanityConfigured() ? createImageUrlBuilder({ projectId, dataset }) : null

/**
 * Resolves a Content Lake image reference to a CDN URL.
 *
 * The article image object stores its upload under an `image` field, so a
 * GROQ `asset->url` projection cannot dereference it — the reference lives one
 * level deeper. Building the URL from the raw reference here works uniformly
 * for featured images, social images, and images nested inside body blocks,
 * none of which are dereferenced by the shared projection.
 */
export function imageUrl(source: unknown): string | null {
  if (!builder || !source) return null
  try {
    return builder.image(source as Parameters<typeof builder.image>[0]).auto("format").fit("max").url()
  } catch {
    return null
  }
}
