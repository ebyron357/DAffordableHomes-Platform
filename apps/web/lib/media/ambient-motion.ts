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

// Homepage neighborhood motion band. Encodes are served same-origin from
// public/video so the site Content-Security-Policy keeps applying unchanged:
// it declares no media-src, so media falls back to default-src 'self'.
// Until the approved encodes are committed, resolve* returns no sources and
// every surface renders the approved still photography instead.
const HOME_NEIGHBORHOOD_MOTION: AmbientMotionAsset = {
  poster: "/images/black-family-home-pexels-7114188.webp",
  label: "A family together in a bright home",
  desktop: [
    { src: "/video/home-neighborhood-1280.webm", type: "video/webm" },
    { src: "/video/home-neighborhood-1280.mp4", type: "video/mp4" },
  ],
  mobile: [
    { src: "/video/home-neighborhood-720.webm", type: "video/webm" },
    { src: "/video/home-neighborhood-720.mp4", type: "video/mp4" },
  ],
}

function availableSources(sources: AmbientMotionSource[]) {
  const publicDirectory = join(process.cwd(), "public")
  return sources.filter((source) => existsSync(join(publicDirectory, source.src)))
}

export function resolveHomeNeighborhoodMotion(): AmbientMotionAsset {
  return {
    ...HOME_NEIGHBORHOOD_MOTION,
    desktop: availableSources(HOME_NEIGHBORHOOD_MOTION.desktop),
    mobile: availableSources(HOME_NEIGHBORHOOD_MOTION.mobile),
  }
}
