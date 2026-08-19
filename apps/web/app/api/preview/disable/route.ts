import { draftMode } from "next/headers"
import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"
import { safeRedirectPath } from "@/lib/blog/safe-href"

export const dynamic = "force-dynamic"

/**
 * Exits draft mode and returns the reader to a published page.
 *
 * The redirect target is resolved through `safeRedirectPath`, which accepts
 * only a single-leading-slash local path. A protocol-relative value such as
 * `//attacker.example/` would otherwise pass a naive leading-slash prefix test
 * and turn this unauthenticated endpoint into an open redirect.
 */
export async function GET(request: NextRequest) {
  const draft = await draftMode()
  draft.disable()

  redirect(safeRedirectPath(request.nextUrl.searchParams.get("redirect"), "/blog"))
}
