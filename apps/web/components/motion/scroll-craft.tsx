"use client"

import { useEffect } from "react"
import "./scroll-craft.css"

/** Scroll Craft flow/depth patterns, adapted to React without a global reset.
 * All content is server rendered and visible before enhancement. No scroll
 * interception, pinned content, media fetches, or perpetual animation loops.
 */
export function ScrollCraft({ rootId }: { rootId: string }) {
  useEffect(() => {
    const root = document.getElementById(rootId)
    if (!root || !("IntersectionObserver" in window)) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    const desktop = window.matchMedia("(min-width: 900px)")
    const seen = new WeakSet<Element>()
    const animations = new Map<Element, Animation>()
    const active = new Set<HTMLElement>()
    const tracks = Array.from(root.querySelectorAll<HTMLElement>("[data-sc-track]"))
    let frame = 0

    const cancelAnimations = () => {
      animations.forEach((animation) => animation.cancel())
      animations.clear()
    }
    const updateDepth = () => {
      frame = 0
      if (reduced.matches || !desktop.matches) return
      active.forEach((element) => {
        const rect = element.getBoundingClientRect()
        const progress = Math.max(0, Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height)))
        element.style.setProperty("--sc-p", String(progress))
      })
    }
    const scheduleDepth = () => {
      if (!reduced.matches && desktop.matches && !frame) frame = requestAnimationFrame(updateDepth)
    }
    const syncPreference = () => {
      root.dataset.scMotion = reduced.matches ? "off" : "on"
      if (reduced.matches) cancelAnimations()
      if (reduced.matches || !desktop.matches) {
        cancelAnimationFrame(frame)
        frame = 0
        tracks.forEach((element) => element.style.removeProperty("--sc-p"))
      } else scheduleDepth()
    }
    const reveal = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting || seen.has(target)) return
        seen.add(target)
        reveal.unobserve(target)
        if (reduced.matches || target.contains(document.activeElement) || typeof target.animate !== "function") return
        // Animate once from an already readable state. The final DOM has no
        // inline opacity/transform, even if an animation is cancelled.
        const animation = target.animate(
          [{ opacity: 0.72, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }],
          { duration: 520, delay: Math.min(Number((target as HTMLElement).dataset.scDelay) || 0, 160), easing: "cubic-bezier(.23,1,.32,1)" },
        )
        animations.set(target, animation)
        animation.finished.then(() => animations.delete(target), () => animations.delete(target))
      })
    }, { threshold: 0.08 })
    const depth = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) active.add(target as HTMLElement)
        else active.delete(target as HTMLElement)
      })
      scheduleDepth()
    })
    root.querySelectorAll("[data-sc-in]").forEach((element) => reveal.observe(element))
    tracks.forEach((element) => depth.observe(element))
    const settleFocus = (event: FocusEvent) => {
      animations.forEach((animation, element) => {
        if (event.target instanceof Node && element.contains(event.target)) animation.cancel()
      })
    }
    syncPreference()
    window.addEventListener("scroll", scheduleDepth, { passive: true })
    window.addEventListener("resize", scheduleDepth)
    root.addEventListener("focusin", settleFocus)
    reduced.addEventListener("change", syncPreference)
    desktop.addEventListener("change", syncPreference)
    return () => {
      reveal.disconnect()
      depth.disconnect()
      cancelAnimationFrame(frame)
      cancelAnimations()
      tracks.forEach((element) => element.style.removeProperty("--sc-p"))
      delete root.dataset.scMotion
      window.removeEventListener("scroll", scheduleDepth)
      window.removeEventListener("resize", scheduleDepth)
      root.removeEventListener("focusin", settleFocus)
      reduced.removeEventListener("change", syncPreference)
      desktop.removeEventListener("change", syncPreference)
    }
  }, [rootId])
  return null
}
