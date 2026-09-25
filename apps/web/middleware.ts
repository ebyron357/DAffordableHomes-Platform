import { NextResponse, type NextRequest } from "next/server"

/**
 * Edge gate for the draft preview routes.
 *
 * `redirect()` and `notFound()` inside a page component are resolved during the
 * render, and this Next version serves the result with HTTP 200 — so a visitor
 * without draft mode would receive a 200 for a page they are not entitled to.
 * Middleware sets the real status before the render happens.
 *
 * Draft mode is identified by Next's own bypass cookie, which is set only by
 * `/api/preview/enable` after the preview secret is verified.
 */
const DRAFT_COOKIE = "__prerender_bypass"

export function middleware(request: NextRequest) {
  if (request.cookies.has(DRAFT_COOKIE)) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = "/blog"
  url.search = ""
  return NextResponse.redirect(url, 307)
}

export const config = {
  matcher: ["/preview/:path*"],
}
