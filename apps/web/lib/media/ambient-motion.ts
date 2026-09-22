import { existsSync } from "node:fs"
import { join } from "node:path"

export type AmbientMotionSource = {
  src: string
  type: string
}

export type AmbientMotionAsset = {
  poster: string
  label: string
  desktop: AmbientMotionSource[]
  mobile: AmbientMotionSource[]
}

// The hero's North Texas exterior slot.
//
// `.fh-hero-media` draws the brand roofline because the repository holds no
// cleared North Texas exterior. This resolves the photograph and the optional
// motion encodes for that slot at build time, and returns null while neither is
// present — which is what keeps the drawing standing. Nothing here fabricates a
// placeholder: an absent file simply means the slot is still unfilled.
//
// Encodes and stills are served same-origin from apps/web/public so the site
// Content-Security-Policy keeps applying unchanged: it declares no media-src,
// so media falls back to default-src 'self' and a remote CDN URL is blocked.
const HERO_NORTH_TEXAS_EXTERIOR: AmbientMotionAsset = {
  poster: "/images/hero-north-texas-exterior.webp",
  label: "A modest single-story home on a North Texas residential street",
  desktop: [
    { src: "/video/hero-north-texas-exterior-1280.webm", type: "video/webm" },
    { src: "/video/hero-north-texas-exterior-1280.mp4", type: "video/mp4" },
  ],
  mobile: [
    { src: "/video/hero-north-texas-exterior-720.webm", type: "video/webm" },
    { src: "/video/hero-north-texas-exterior-720.mp4", type: "video/mp4" },
  ],
}

function present(path: string) {
  return existsSync(join(process.cwd(), "public", path))
}

function availableSources(sources: AmbientMotionSource[]) {
  return sources.filter((source) => present(source.src))
}

export function resolveHeroMotion(): AmbientMotionAsset | null {
  // The still carries the accessible name and is what a clip is layered over,
  // so without it there is nothing to show and the drawn scene stays.
  if (!present(HERO_NORTH_TEXAS_EXTERIOR.poster)) return null

  return {
    ...HERO_NORTH_TEXAS_EXTERIOR,
    desktop: availableSources(HERO_NORTH_TEXAS_EXTERIOR.desktop),
    mobile: availableSources(HERO_NORTH_TEXAS_EXTERIOR.mobile),
  }
}
