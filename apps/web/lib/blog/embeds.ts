/**
 * Embed-URL resolution shared by the Studio validator and renderer.
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

const YOUTUBE_ID = /^[\\w-]{11}$/
const VIMEO_ID = /^\\d+$/

export function toEmbedUrl(
  url: string | null | undefined,
  provider: VideoProvider,
): string | null {
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
          (/^\\/(embed|shorts|v)\\//.test(parsed.pathname)
            ? parsed.pathname.split("/").filter(Boolean)[1]
            : undefined))
    return id && YOUTUBE_ID.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null
  }

  if (!VIMEO_HOSTS.has(parsed.hostname)) return null
  const id = parsed.pathname.split("/").filter(Boolean).pop()
  return id && VIMEO_ID.test(id) ? `https://player.vimeo.com/video/${id}` : null
}

export function isEmbeddableVideoUrl(
  url: string | null | undefined,
  provider: VideoProvider,
): boolean {
  return toEmbedUrl(url, provider) !== null
}
