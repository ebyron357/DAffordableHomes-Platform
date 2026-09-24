"use client"

import Image from "next/image"
import { useCallback, useRef, useState, useSyncExternalStore } from "react"
import type { AmbientMotionAsset, AmbientMotionSource } from "@/lib/media/ambient-motion"

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)"
const WIDE_VIEWPORT = "(min-width: 768px)"

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
}: {
  asset: AmbientMotionAsset
  sizes: string
  priority?: boolean
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
        {asset.mobilePoster ? <source media="(max-width: 1600px)" srcSet={asset.mobilePoster} /> : null}
        <Image
          src={asset.poster}
          alt={asset.label}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
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
