import { NextResponse } from "next/server"

/**
 * Cross-site guard for the public lead endpoints.
 *
 * A browser lets any website POST to these routes without a CORS preflight as
 * long as the request is a "simple" one, for example `text/plain`. Each visitor
 * of a hostile page would then submit a fabricated lead from their own address,
 * which also spreads the load across the per-caller rate limit. Two checks close
 * that path:
 *
 * 1. The body must be declared as JSON. A cross-site `application/json` POST
 *    forces a preflight, which these routes never answer, so the browser blocks
 *    it before it is sent.
 * 2. When the browser states where the request came from (`Origin`), that origin
 *    must be this site. Requests with no `Origin` (server-to-server tools, older
 *    clients) are not rejected on that ground alone; the JSON requirement still
 *    applies to them.
 *
 * The site's own forms already send `content-type: application/json` from the
 * same origin, so legitimate submissions are unaffected.
 */
export function rejectCrossSite(request: Request): NextResponse | null {
  const contentType = request.headers.get("content-type") ?? ""
  if (!/^application\/json\b/i.test(contentType.trim())) {
    return NextResponse.json({ ok: false, error: "Send the form as JSON." }, { status: 415 })
  }

  const origin = request.headers.get("origin")
  if (origin && !isSameOrigin(origin, request)) {
    return NextResponse.json({ ok: false, error: "Cross-site submissions are not accepted." }, { status: 403 })
  }

  return null
}

function isSameOrigin(origin: string, request: Request): boolean {
  let originHost: string
  try {
    originHost = new URL(origin).host.toLowerCase()
  } catch {
    return false
  }

  // Behind Vercel the request URL carries the deployment host; the host the
  // visitor actually used arrives as x-forwarded-host / host.
  const candidates = [
    request.headers.get("x-forwarded-host"),
    request.headers.get("host"),
    safeHost(request.url),
  ]
  return candidates.some((host) => host?.split(",")[0]?.trim().toLowerCase() === originHost)
}

function safeHost(url: string): string | null {
  try {
    return new URL(url).host
  } catch {
    return null
  }
}
