"use client"

import Image from "next/image"
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react"
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

// The poster still is always rendered and always carries the accessible name.
// The clip is decorative ambience layered over it: muted, no audio track, no
// controls, never autoplaying before it is scrolled near, and dropped entirely
// when the visitor asks for reduced motion or no encode has been committed.
export function AmbientMotion({
  asset,
  sizes,
  priority = false,
}: {
  asset: AmbientMotionAsset
  sizes: string
  priority?: boolean
}) {
  const [nearViewport, setNearViewport] = useState(false)
  const frame = useRef<HTMLDivElement>(null)
  const reducedMotion = useMediaQuery(REDUCED_MOTION)
  const wideViewport = useMediaQuery(WIDE_VIEWPORT)

  useEffect(() => {
    const element = frame.current

    if (!element || typeof IntersectionObserver === "undefined") {
      const frameId = requestAnimationFrame(() => setNearViewport(true))
      return () => cancelAnimationFrame(frameId)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNearViewport(true)
          observer.disconnect()
        }
      },
      { rootMargin: "200px" },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const sources: AmbientMotionSource[] = reducedMotion
    ? []
    : wideViewport
      ? asset.desktop
      : asset.mobile

  const clipKey = sources.map((source) => source.src).join("|")

  return (
    <div className="ambient-motion" ref={frame}>
      <Image
        src={asset.poster}
        alt={asset.label}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
      {sources.length > 0 && nearViewport ? (
        <video
          key={clipKey}
          className="ambient-motion-clip"
          poster={asset.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={(event) => event.currentTarget.classList.add("is-playing")}
        >
          {sources.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
        </video>
      ) : null}
    </div>
  )
}
