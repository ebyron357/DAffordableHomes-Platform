import { draftMode } from "next/headers"
import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"

import { getPreviewClient } from "@/cms/client"
import { isPreviewConfigured } from "@/cms/env"

export const dynamic = "force-dynamic"

/**
 * Enables Next.js draft mode for a single article and redirects to it.
 *
 * The slug is verified against the Content Lake before draft mode is enabled,
 * so this endpoint cannot be used to turn on draft rendering for arbitrary
 * paths or to probe for documents that do not exist.
 */
export async function GET(request: NextRequest) {
  if (!isPreviewConfigured) {
    return new Response(
      "Draft preview is not configured. Set SANITY_API_READ_TOKEN and the Sanity project variables.",
      { status: 503, headers: { "content-type": "text/plain; charset=utf-8" } },
    )
  }

  const slug = request.nextUrl.searchParams.get("slug")
  if (!slug || !/^[a-z0-9][a-z0-9-]{0,95}$/.test(slug)) {
    return new Response("A valid `slug` query parameter is required.", { status: 400 })
  }

  const client = getPreviewClient()
  if (!client) {
    return new Response("Draft preview client is unavailable.", { status: 503 })
  }

  const exists = await client.fetch<string | null>(
    /* groq */ `*[_type == "article" && slug.current == $slug][0].slug.current`,
    { slug },
  )

  if (!exists) {
    return new Response("No article matches that slug.", { status: 404 })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(`/blog/${exists}`)
}
