import { draftMode } from "next/headers"
import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"
import { getPreviewClient } from "@/sanity/lib/client"
import { isPreviewConfigured } from "@/sanity/env"

export const dynamic = "force-dynamic"

/**
 * Enables Next.js draft mode for a Studio preview.
 *
 * The requested slug must resolve to a real document through the token-scoped
 * draft client before draft mode is enabled, so the endpoint cannot be used to
 * open preview mode for arbitrary URLs.
 */
export async function GET(request: NextRequest) {
  if (!isPreviewConfigured()) {
    return new Response(
      "Preview is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_READ_TOKEN to enable draft preview.",
      { status: 501, headers: { "content-type": "text/plain; charset=utf-8" } },
    )
  }

  const slug = request.nextUrl.searchParams.get("slug")
  if (!slug) {
    return new Response("Missing slug parameter.", { status: 400 })
  }

  const client = getPreviewClient()
  if (!client) {
    return new Response("Preview client unavailable.", { status: 501 })
  }

  const exists = await client.fetch<string | null>(`*[_type == "article" && slug.current == $slug][0].slug.current`, {
    slug,
  })

  if (!exists) {
    return new Response("No article matches that slug.", { status: 404 })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(`/blog/${exists}`)
}
