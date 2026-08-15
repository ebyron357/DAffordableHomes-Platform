import { defineEnableDraftMode } from "next-sanity/draft-mode"

import { getPreviewClient } from "@/cms/client"

export const dynamic = "force-dynamic"

/**
 * Enables Next.js draft mode for an authenticated Studio user.
 *
 * `defineEnableDraftMode` validates a single-use preview secret that the
 * Studio's Presentation tool mints in the Content Lake. Only someone with an
 * authenticated Studio session can produce a valid URL, so an anonymous visitor
 * cannot obtain a draft-mode cookie by guessing a slug.
 *
 * An earlier version of this route checked only that the requested slug existed
 * — which any unauthenticated visitor could satisfy for a published article,
 * handing them a draft cookie and read access to unpublished editorial content.
 */
const client = getPreviewClient()

const handler = client
  ? defineEnableDraftMode({ client })
  : {
      GET: async () =>
        new Response(
          "Draft preview is not configured. Set SANITY_API_READ_TOKEN and the Sanity project variables.",
          { status: 503, headers: { "content-type": "text/plain; charset=utf-8" } },
        ),
    }

export const { GET } = handler
