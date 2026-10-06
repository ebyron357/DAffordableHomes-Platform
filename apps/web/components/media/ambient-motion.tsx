"use client"

import { getImageProps } from "next/image"
import { preload } from "react-dom"
import { useCallback, useRef, useState, useSyncExternalStore } from "react"
import type { AmbientMotionAsset, AmbientMotionSource } from "@/lib/media/ambient-motion"

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)"
const WIDE_VIEWPORT = "(min-width: 768px)"
// Up to this width the hero frame is too narrow for the landscape still to keep
// the full roofline, so the portrait of the same house is shown instead.
const MOBILE_POSTER_MEDIA = "(max-width: 1600px)"
// The complement of MOBILE_POSTER_MEDIA. The two must stay mutually exclusive:
// they scope the preload hints below, and an overlap would make a visitor fetch
// both stills.
const WIDE_POSTER_MEDIA = "(min-width: 1600.05px)"

function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query)
      list.addEventListener("change", onChange)
      return () => list.removeEventListener("change", onChange)
    },
    [query],
  )

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])

  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}

// The still is what renders, and it carries the accessible name. Motion is
// opt-in: AGENTS.md and the publishing standard both bar autoplay, so the clip
// is not mounted — and nothing is fetched — until the visitor asks for it. It
// is offered only when an encode exists and the visitor has not asked for
// reduced motion. Once running it stays muted, looping and decorative, with
// the toggle as the control for stopping it.
export function AmbientMotion({
  asset,
  sizes,
  priority = false,
  quality,
}: {
  asset: AmbientMotionAsset
  sizes: string
  priority?: boolean
  /**
   * Optimizer quality for both stills. Must be a value declared in
   * `images.qualities` in next.config.mjs, or the optimizer errors instead of
   * serving the image. Left unset, the Next default (75) applies.
   */
  quality?: number
}) {
  const [started, setStarted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const clip = useRef<HTMLVideoElement>(null)
  const reducedMotion = useMediaQuery(REDUCED_MOTION)
  const wideViewport = useMediaQuery(WIDE_VIEWPORT)

  const sources: AmbientMotionSource[] = reducedMotion
    ? []
    : wideViewport
      ? asset.desktop
      : asset.mobile

  // Art direction: both stills go through the image optimizer, so a phone gets a
  // resized portrait rather than the full-size source. getImageProps emits no
  // preload link, so a visitor who sees the portrait never also fetches the
  // landscape still. priority leaves the <img> eager (no loading attribute), but
  // it does not set fetchPriority on its own, so the LCP hint is passed through.
  const shared = {
    alt: asset.label,
    fill: true,
    sizes,
    priority,
    fetchPriority: priority ? ("high" as const) : undefined,
    ...(quality === undefined ? {} : { quality }),
  }
  const poster = getImageProps({ ...shared, src: asset.poster, className: "object-cover" }).props
  const mobilePoster = asset.mobilePoster
    ? getImageProps({ ...shared, src: asset.mobilePoster }).props.srcSet
    : undefined

  /*
   * Media-scoped preload for the still that is actually going to render.
   *
   * Without this the hero is discovered only once the render-blocking
   * stylesheet has been fetched and parsed, which on a throttled connection
   * is most of the Largest Contentful Paint. `getImageProps` deliberately
   * emits no preload of its own because a single unconditional hint would
   * make every visitor fetch both art-directed stills; scoping each hint with
   * the same media query that selects the source keeps that guarantee — the
   * two queries above are mutually exclusive, so exactly one hint ever
   * matches. Only done for the priority (above-the-fold) case.
   */
  if (priority) {
    if (mobilePoster) {
      preload(asset.mobilePoster as string, {
        as: "image",
        imageSrcSet: mobilePoster,
        imageSizes: sizes,
        media: MOBILE_POSTER_MEDIA,
        fetchPriority: "high",
      })
    }
    if (poster.srcSet) {
      preload(asset.poster, {
        as: "image",
        imageSrcSet: poster.srcSet,
        imageSizes: sizes,
        media: mobilePoster ? WIDE_POSTER_MEDIA : undefined,
        fetchPriority: "high",
      })
    }
  }

  const toggle = () => {
    const element = clip.current
    if (!started || !element) {
      setStarted(true)
      return
    }
    if (element.paused) {
      void element.play()
    } else {
      element.pause()
    }
  }

  return (
    <div className="ambient-motion">
      <picture>
        {mobilePoster ? <source media={MOBILE_POSTER_MEDIA} srcSet={mobilePoster} sizes={sizes} /> : null}
        <img {...poster} alt={asset.label} />
      </picture>
      {started && sources.length > 0 ? (
        <video
          ref={clip}
          className={playing ? "ambient-motion-clip is-playing" : "ambient-motion-clip"}
          poster={asset.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          {sources.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
        </video>
      ) : null}
      {sources.length > 0 ? (
        <button type="button" className="ambient-motion-toggle" onClick={toggle} aria-pressed={playing}>
          {playing ? "Pause motion" : "Play motion"}
        </button>
      ) : null}
    </div>
  )
}
