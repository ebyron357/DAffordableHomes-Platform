/**
 * Embed-URL resolution for the `videoEmbed` block.
 *
 * This lives outside the renderer because the Studio validator needs the same
 * predicate. The schema used to require only "an https URI", while the renderer
 * accepted a watch URL only if it could pull a video id out of it. An editor
 * could save `https://example.com/article` against the YouTube provider, the
 * Studio would report a successful save, and the block would then render as
 * nothing at all — the published article silently lost a section, with no
 * message anywhere explaining why.
 *
 * That is the same defect class as the href allowlist in `lib/safe-path.ts`:
 * two predicates for one question, kept in step by hand until they drift. One
 * function answers it for both callers here.
 */

export type VideoProvider = "youtube" | "vimeo"

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
])

const VIMEO_HOSTS = new Set(["vimeo.com", "www.vimeo.com", "player.vimeo.com"])

/** A YouTube id is 11 characters of the URL-safe base64 alphabet. */
const YOUTUBE_ID = /^[\w-]{11}$/
/** A Vimeo id is numeric. */
const VIMEO_ID = /^\d+$/

/**
 * Converts a public watch URL into a privacy-friendly embed URL, or returns
 * `null` when the value is not a watch URL this provider can embed.
 *
 * The host is checked, not just the id shape. Without that, any https URL whose
 * last path segment happened to be numeric resolved to a Vimeo embed, so a
 * typo'd or hostile link produced a plausible-looking iframe pointing at
 * somebody else's video.
 */
export function toEmbedUrl(url: string | null | undefined, provider: VideoProvider): string | null {
  if (!url) return null

  let parsed: URL
  try {
    parsed = new URL(url.trim())
  } catch {
    return null
  }

  if (parsed.protocol !== "https:") return null

  if (provider === "youtube") {
    if (!YOUTUBE_HOSTS.has(parsed.hostname) && parsed.hostname !== "youtu.be") return null
    const id =
      parsed.hostname === "youtu.be"
        ? parsed.pathname.split("/").filter(Boolean)[0]
        : (parsed.searchParams.get("v") ??
          // /embed/<id> and /shorts/<id> are watch URLs too.
          (/^\/(embed|shorts|v)\//.test(parsed.pathname)
            ? parsed.pathname.split("/").filter(Boolean)[1]
            : undefined))
    return id && YOUTUBE_ID.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null
  }

  if (!VIMEO_HOSTS.has(parsed.hostname)) return null
  const id = parsed.pathname.split("/").filter(Boolean).pop()
  return id && VIMEO_ID.test(id) ? `https://player.vimeo.com/video/${id}` : null
}

/** Whether this provider can embed this URL — the Studio-facing form. */
export function isEmbeddableVideoUrl(
  url: string | null | undefined,
  provider: VideoProvider,
): boolean {
  return toEmbedUrl(url, provider) !== null
}
