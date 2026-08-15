import { draftMode } from "next/headers"
import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

/** Exits draft mode and returns the visitor to a published page. */
export async function GET(request: NextRequest) {
  const draft = await draftMode()
  draft.disable()

  const requested = request.nextUrl.searchParams.get("redirect")
  // Only same-site paths; never honour an absolute or protocol-relative URL.
  const target = requested && /^\/(?!\/)/.test(requested) ? requested : "/blog"

  redirect(target)
}
