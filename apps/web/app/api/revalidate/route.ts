import { revalidateTag } from "next/cache"
import type { NextRequest } from "next/server"
import { parseBody } from "next-sanity/webhook"
import { revalidateSecret } from "@/sanity/env"

export const dynamic = "force-dynamic"

type WebhookPayload = {
  _type?: string
  slug?: { current?: string } | string
}

/**
 * Sanity publish webhook.
 *
 * Configure a webhook in Sanity Manage that POSTs to
 * `${SITE_URL}/api/revalidate` with the shared secret in
 * `SANITY_REVALIDATE_SECRET`. Publishing an article then invalidates the cached
 * article list and the specific article route.
 *
 * The endpoint fails closed: without a configured secret, or with an invalid
 * signature, nothing is revalidated.
 */
export async function POST(request: NextRequest) {
  if (!revalidateSecret) {
    return Response.json(
      { revalidated: false, reason: "SANITY_REVALIDATE_SECRET is not configured." },
      { status: 501 },
    )
  }

  let body: WebhookPayload | null = null
  try {
    const parsed = await parseBody<WebhookPayload>(request, revalidateSecret)
    if (!parsed.isValidSignature) {
      return Response.json({ revalidated: false, reason: "Invalid signature." }, { status: 401 })
    }
    body = parsed.body
  } catch (error) {
    return Response.json(
      { revalidated: false, reason: error instanceof Error ? error.message : "Unreadable webhook payload." },
      { status: 400 },
    )
  }

  if (body?._type !== "article") {
    return Response.json({ revalidated: false, reason: `Ignored document type: ${body?._type ?? "unknown"}.` })
  }

  const slug = typeof body.slug === "string" ? body.slug : body.slug?.current

  revalidateTag("article", "max")
  if (slug) revalidateTag(`article:${slug}`, "max")

  /*
   * Article routes are statically generated from generateStaticParams so that
   * unknown slugs return a real HTTP 404. A newly published slug therefore
   * needs a deployment before it is routable. When a Vercel deploy hook is
   * configured, publishing triggers one automatically.
   */
  let deploymentTriggered = false
  const deployHook = process.env.VERCEL_DEPLOY_HOOK_URL
  if (deployHook) {
    const hookResponse = await fetch(deployHook, { method: "POST" })
    deploymentTriggered = hookResponse.ok
  }

  return Response.json({
    revalidated: true,
    tags: slug ? ["article", `article:${slug}`] : ["article"],
    deploymentTriggered,
    deployHookConfigured: Boolean(deployHook),
  })
}
