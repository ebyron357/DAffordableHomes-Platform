import { revalidatePath, revalidateTag } from "next/cache"
import type { NextRequest } from "next/server"

import { SANITY_REVALIDATE_SECRET } from "@/lib/cms/env"

type SanityWebhookBody = {
  _type?: string
  slug?: { current?: string } | string
}

/**
 * Sanity publish webhook. Configure it in the Sanity project as a POST webhook
 * that includes the document `_type` and `slug`, with the shared secret sent as
 * `?secret=` or the `x-revalidate-secret` header.
 *
 * Publishing therefore takes effect immediately instead of waiting for the
 * 5-minute time-based revalidation window.
 */
export async function POST(request: NextRequest) {
  if (!SANITY_REVALIDATE_SECRET) {
    return Response.json({ revalidated: false, reason: "SANITY_REVALIDATE_SECRET is not configured" }, { status: 501 })
  }

  // Prefer the header. The query parameter remains supported because Sanity's
  // webhook UI cannot always set custom headers, but it is never the same value
  // as the preview secret.
  const secret = request.headers.get("x-revalidate-secret") ?? request.nextUrl.searchParams.get("secret")
  if (secret !== SANITY_REVALIDATE_SECRET) {
    return Response.json({ revalidated: false, reason: "invalid secret" }, { status: 401 })
  }

  let body: SanityWebhookBody = {}
  try {
    body = (await request.json()) as SanityWebhookBody
  } catch {
    body = {}
  }

  const slug = typeof body.slug === "string" ? body.slug : body.slug?.current

  revalidateTag("article", "max")
  if (slug) revalidateTag(`article:${slug}`, "max")
  revalidatePath("/blog", "page")
  if (slug) revalidatePath(`/blog/${slug}`, "page")
  revalidatePath("/sitemap.xml", "page")

  /**
   * `/blog/[slug]` closes its param set so unknown URLs 404 correctly, which
   * means a brand-new slug becomes routable only after `generateStaticParams`
   * runs again. Firing the deploy hook keeps publishing a code-free operation.
   */
  let rebuildTriggered = false
  const deployHook = process.env.VERCEL_DEPLOY_HOOK_URL
  if (deployHook) {
    try {
      const hookResponse = await fetch(deployHook, { method: "POST" })
      rebuildTriggered = hookResponse.ok
    } catch {
      rebuildTriggered = false
    }
  }

  return Response.json({
    revalidated: true,
    type: body._type ?? null,
    slug: slug ?? null,
    rebuildTriggered,
  })
}
