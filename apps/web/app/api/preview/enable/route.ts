import { defineEnableDraftMode } from "next-sanity/draft-mode"
import { getPreviewClient } from "@/sanity/lib/client"

export const dynamic = "force-dynamic"

/**
 * Enables Next.js draft mode for a Studio preview.
 *
 * Authorisation is delegated to Sanity. `defineEnableDraftMode` validates the
 * incoming preview URL against the Content Lake before any cookie is set, so
 * only a caller who holds a valid Studio session or preview secret can turn
 * draft mode on. Checking that a slug exists would authenticate nothing —
 * published slugs are public, so that alone would let any visitor read
 * unpublished revisions of live articles.
 *
 * The Studio drives this route through the Presentation tool
 * (`previewUrl.previewMode.enable` in sanity.config.ts).
 */
const client = getPreviewClient()

const handler = client
  ? defineEnableDraftMode({ client })
  : {
      GET: async () =>
        new Response(
          "Preview is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_READ_TOKEN to enable draft preview.",
          { status: 501, headers: { "content-type": "text/plain; charset=utf-8" } },
        ),
    }

export const { GET } = handler
