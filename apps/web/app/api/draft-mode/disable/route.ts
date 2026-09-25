import { draftMode } from "next/headers"
import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"

import { toSafeInternalPath } from "@/lib/safe-path"

export const dynamic = "force-dynamic"

/**
 * Exits draft mode and returns the visitor to a published page.
 *
 * This endpoint is public and takes a redirect target, so the target has to be
 * validated the way a browser will read it — see `lib/safe-path.ts`. A
 * `startsWith("/")` check is not sufficient: browsers normalise backslashes in
 * a `Location` header, so `/\evil.example` becomes protocol-relative and leaves
 * the origin.
 */
export async function GET(request: NextRequest) {
  const draft = await draftMode()
  draft.disable()

  redirect(toSafeInternalPath(request.nextUrl.searchParams.get("redirect"), "/blog"))
}
