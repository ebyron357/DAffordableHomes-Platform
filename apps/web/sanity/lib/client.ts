import { createClient, type SanityClient } from "next-sanity"
import { apiVersion, dataset, isSanityConfigured, projectId, readToken } from "../env"

/**
 * Published-content client. Reads the CDN, never sees drafts, and is safe to
 * use from cached server components.
 */
export function getPublishedClient(): SanityClient | null {
  if (!isSanityConfigured()) return null
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
    perspective: "published",
  })
}

/**
 * Draft-aware client used only inside Next.js draft mode. Requires a viewer
 * token and always bypasses the CDN so editors see the current draft.
 */
export function getPreviewClient(): SanityClient | null {
  if (!isSanityConfigured() || !readToken) return null
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    perspective: "drafts",
    token: readToken,
    stega: false,
  })
}
