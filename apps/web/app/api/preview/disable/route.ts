import { draftMode } from "next/headers"
import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"

/** Exits draft mode and returns the editor to the public version of the page. */
export async function GET(request: NextRequest) {
  const draft = await draftMode()
  draft.disable()

  const requested = request.nextUrl.searchParams.get("path") ?? "/blog"
  const path = requested.startsWith("/") && !requested.startsWith("//") ? requested : "/blog"

  redirect(path)
}
