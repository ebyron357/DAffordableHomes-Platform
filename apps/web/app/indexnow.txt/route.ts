import { indexNowKey } from "@/lib/indexnow"

/** The IndexNow key file; 404 until `INDEXNOW_KEY` holds a valid key. See lib/indexnow.ts. */
export function GET() {
  const key = indexNowKey()
  if (!key) return new Response("Not found", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } })
  return new Response(key, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } })
}
