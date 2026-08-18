import { revalidatePath, revalidateTag } from "next/cache"
import { parseBody } from "next-sanity/webhook"
import type { NextRequest } from "next/server"

import { ARTICLE_CACHE_TAG } from "@/lib/blog/source"
import { SANITY_REVALIDATE_SECRET } from "@/cms/env"

export const dynamic = "force-dynamic"

type WebhookPayload = {
  _type?: string
  slug?: { current?: string } | string
}

function slugOf(payload: WebhookPayload | null): string | null {
  if (!payload) return null
  if (typeof payload.slug === "string") return payload.slug
  return payload.slug?.current ?? null
}

/**
 * Sanity publish webhook.
 *
 * Configured in the Sanity project as a POST to `/api/revalidate` with the
 * shared secret from `SANITY_REVALIDATE_SECRET`. The signature is verified
 * before anything is revalidated; an unsigned or misconfigured request is
 * rejected rather than silently accepted.
 */
export async function POST(request: NextRequest) {
  if (!SANITY_REVALIDATE_SECRET) {
    return Response.json(
      { revalidated: false, reason: "SANITY_REVALIDATE_SECRET is not configured." },
      { status: 503 },
    )
  }

  let body: WebhookPayload | null
  let isValidSignature: boolean | null

  try {
    ;({ body, isValidSignature } = await parseBody<WebhookPayload>(
      request,
      SANITY_REVALIDATE_SECRET,
    ))
  } catch (error) {
    return Response.json(
      { revalidated: false, reason: error instanceof Error ? error.message : "Invalid payload." },
      { status: 400 },
    )
  }

  if (!isValidSignature) {
    return Response.json({ revalidated: false, reason: "Invalid signature." }, { status: 401 })
  }

  if (body?._type !== "article") {
    return Response.json(
      { revalidated: false, reason: `Ignored document type: ${body?._type ?? "unknown"}` },
      { status: 200 },
    )
  }

  // Next 16 requires an explicit cache-life profile. "max" expires the tagged
  // entries immediately on the next request rather than waiting out the TTL.
  revalidateTag(ARTICLE_CACHE_TAG, "max")
  revalidatePath("/blog")
  revalidatePath("/sitemap.xml")

  const slug = slugOf(body)
  if (slug) revalidatePath(`/blog/${slug}`)

  return Response.json({ revalidated: true, tag: ARTICLE_CACHE_TAG, slug })
}
