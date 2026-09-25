import { draftMode } from "next/headers"
import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"

import { safeInternalPath } from "@/lib/cms/links"

import { SANITY_PREVIEW_SECRET, isSanityPreviewConfigured } from "@/lib/cms/env"

/**
 * Enables Next.js draft mode so an editor can view unpublished Sanity content.
 *
 * Requires the shared preview secret, so a public visitor cannot turn draft mode
 * on. Only in-app paths are accepted as a redirect target.
 */
export async function GET(request: NextRequest) {
  if (!isSanityPreviewConfigured()) {
    return new Response("Preview is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_READ_TOKEN.", {
      status: 501,
    })
  }

  if (!SANITY_PREVIEW_SECRET) {
    return new Response("Preview is not configured. Set SANITY_PREVIEW_SECRET.", { status: 501 })
  }

  const secret = request.nextUrl.searchParams.get("secret")
  if (secret !== SANITY_PREVIEW_SECRET) {
    return new Response("Invalid preview secret.", { status: 401 })
  }

  const path = safeInternalPath(request.nextUrl.searchParams.get("path") ?? undefined, "/blog")

  const draft = await draftMode()
  draft.enable()

  redirect(path)
}
