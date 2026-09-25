import { draftMode } from "next/headers"
import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"

import { safeInternalPath } from "@/lib/cms/links"

/** Exits draft mode and returns the editor to the public version of the page. */
export async function GET(request: NextRequest) {
  const draft = await draftMode()
  draft.disable()

  const path = safeInternalPath(request.nextUrl.searchParams.get("path") ?? undefined, "/blog")

  redirect(path)
}
