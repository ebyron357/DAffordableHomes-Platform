import "server-only"

import { createClient, type SanityClient } from "next-sanity"

import {
  SANITY_API_READ_TOKEN,
  SANITY_API_VERSION,
  SANITY_DATASET,
  SANITY_PROJECT_ID,
  isPreviewConfigured,
  isSanityConfigured,
} from "./env"

let publishedClient: SanityClient | null = null
let previewClient: SanityClient | null = null

/**
 * Client for published content. Uses the CDN and Next's data cache; the
 * `article` cache tag is invalidated by the Sanity publish webhook.
 */
export function getPublishedClient(): SanityClient | null {
  if (!isSanityConfigured) return null
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
 * Client for draft content. Requires a read token and is only ever used from
 * a server context that has already verified Next.js draft mode is enabled.
 */
export function getPreviewClient(): SanityClient | null {
  if (!isPreviewConfigured) return null
  previewClient ??= createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: SANITY_API_VERSION,
    useCdn: false,
    perspective: "drafts",
    token: SANITY_API_READ_TOKEN,
    stega: false,
  })
  return previewClient
}
