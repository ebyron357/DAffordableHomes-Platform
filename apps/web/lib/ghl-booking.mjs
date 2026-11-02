/**
 * The GoHighLevel booking calendar embedded on /consultation.
 *
 * Plain JavaScript on purpose: `next.config.mjs` needs the same answer to build
 * the Content Security Policy, and it cannot import TypeScript. The page reads
 * it through `ghl-booking.d.mts`. One parser means the frame the page renders
 * and the frame origin the policy allows can never disagree — a mismatch would
 * leave a blank box where the calendar should be.
 *
 * The owner copies the calendar's embed or share link from GoHighLevel
 * (Calendars → the calendar → Share / Embed) into `GHL_BOOKING_URL` in Vercel
 * and redeploys. Both the page and the policy are built at deploy time, so a
 * new value needs a redeploy, exactly like the other variables.
 *
 * Accepted: an https link whose path is a GoHighLevel booking widget —
 * `/widget/booking/<id>` for one calendar, `/widget/group/<id>` for a group.
 * That covers the default hosts (api.leadconnectorhq.com, link.msgsndr.com)
 * and a white-labelled domain the agency has pointed at GoHighLevel. Anything
 * else is ignored, and the page falls back to the message form alone.
 */

const WIDGET_PATH = /^\/widget\/(?:booking|group)\/[A-Za-z0-9_-]+\/?$/

/**
 * @param {string | undefined} raw the configured value, or a pasted embed snippet
 * @returns {{ url: string, origin: string } | null}
 */
export function parseBookingUrl(raw) {
  if (typeof raw !== "string") return null
  const trimmed = raw.trim()
  if (!trimmed) return null

  // Owners often paste the whole <iframe> snippet GoHighLevel shows; take its src.
  const candidate = trimmed.match(/\bsrc=["']([^"']+)["']/)?.[1] ?? trimmed

  let url
  try {
    url = new URL(candidate)
  } catch {
    return null
  }

  if (url.protocol !== "https:") return null
  if (url.username || url.password) return null
  if (!WIDGET_PATH.test(url.pathname)) return null

  return { url: url.toString(), origin: url.origin }
}

/**
 * @param {Record<string, string | undefined>} [env]
 * @returns {{ url: string, origin: string } | null}
 */
export function bookingEmbed(env = process.env) {
  return parseBookingUrl(env.GHL_BOOKING_URL)
}
