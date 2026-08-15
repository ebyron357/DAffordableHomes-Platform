import { draftMode } from "next/headers"
import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

/** Exits draft mode and returns the reader to a published page. */
export async function GET(request: NextRequest) {
  const draft = await draftMode()
  draft.disable()

  const target = request.nextUrl.searchParams.get("redirect")
  redirect(target && target.startsWith("/") ? target : "/blog")
}
