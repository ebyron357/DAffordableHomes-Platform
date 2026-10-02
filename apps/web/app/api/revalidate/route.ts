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

/**
 * Document types whose edits change rendered article output.
 *
 * `author` and `category` are here because the article queries dereference them
 * (`author->`, `category->` in lib/blog/queries.ts). Accepting only `article`
 * meant renaming an author or retitling a category left every cached article,
 * metadata block and JSON-LD node stale until the cache life expired, with no
 * way for an editor to force the update. The Sanity webhook filter must list the
 * same three types — see docs/13-cms/SANITY_SETUP.md.
 */
const REVALIDATING_TYPES = new Set(["article", "author", "category"])

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

  if (!REVALIDATING_TYPES.has(body?._type ?? "")) {
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

  // Only an article has its own page. An author or category edit clears the
  // shared tag above, which is what every article's cached output hangs from.
  const slug = body?._type === "article" ? slugOf(body) : null
  if (slug) revalidatePath(`/blog/${slug}`)

  return Response.json({ revalidated: true, type: body?._type, tag: ARTICLE_CACHE_TAG, slug })
}
