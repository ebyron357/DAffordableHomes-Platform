import "server-only"

import { createClient, type SanityClient } from "next-sanity"

import {
  SANITY_API_VERSION,
  SANITY_DATASET,
  SANITY_PROJECT_ID,
  SANITY_READ_TOKEN,
  isSanityConfigured,
  isSanityPreviewConfigured,
} from "./env"

let publishedClient: SanityClient | null = null
let previewClient: SanityClient | null = null

/** Published-content client. CDN-cached; safe for public requests. */
export function getSanityClient(): SanityClient | null {
  if (!isSanityConfigured()) return null
  publishedClient ??= createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: SANITY_API_VERSION,
    useCdn: true,
    perspective: "published",
  })
  return publishedClient
}

/**
 * Draft-content client. Requires a server-only read token and always bypasses
 * the CDN so editors see the current draft.
 */
export function getSanityPreviewClient(): SanityClient | null {
  if (!isSanityPreviewConfigured()) return null
  previewClient ??= createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: SANITY_API_VERSION,
    useCdn: false,
    perspective: "drafts",
    token: SANITY_READ_TOKEN,
    stega: false,
  })
  return previewClient
}
