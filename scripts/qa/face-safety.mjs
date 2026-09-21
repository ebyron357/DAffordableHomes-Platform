/**
 * Face-safety check for the approved Debra photographs.
 *
 * Usage:
 *   node scripts/qa/face-safety.mjs [--base http://127.0.0.1:3111]
 *
 * For an `object-fit: cover` image, the browser scales the source to cover the
 * frame and crops the overflow according to `object-position`. This computes
 * the visible source window from the rendered frame, the natural size and the
 * resolved object-position, and reports how much of the top of the source is
 * cut away. The top of her head sits within the first few percent of every one
 * of these sources, so a top crop above ~8% is the defect the owner reported.
 */
import { chromium } from "playwright"
import process from "node:process"

const args = process.argv.slice(2)
const argOf = (name, fallback) => {
  const index = args.indexOf(`--${name}`)
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback
}
const BASE = argOf("base", "http://127.0.0.1:3111").replace(/\/$/, "")

/**
 * Maximum share of the rendered image that may be cropped off the top.
 *
 * Every one of these sources places the top of her head within the first
 * few percent, so a top crop past this eats into it. The band placement used
 * to measure 22% here, which is the defect this check exists to catch.
 */
const MAX_TOP_CROP = 12
const VIEWPORTS = [1440, 1024, 768, 430, 375]
const ROUTES = ["/", "/about", "/areas", "/consultation", "/contact", "/programs", "/programs/naca", "/first-time-buyers", "/blog", "/homes"]

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium" })
let worst = 0
const rows = []

for (const width of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } })
  const page = await ctx.newPage()
  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 45000 })
    await page.evaluate(async () => {
      document.documentElement.style.scrollBehavior = "auto"
      for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
        window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 50))
      }
      window.scrollTo(0, 0)
      for (const img of document.querySelectorAll("img")) img.loading = "eager"
      await new Promise((r) => setTimeout(r, 400))
    })
    const found = await page.evaluate(() => {
      const out = []
      for (const img of document.querySelectorAll("img")) {
        if (!/debra-allen/.test(decodeURIComponent(img.currentSrc || img.src))) continue
        const cs = getComputedStyle(img)
        if (cs.objectFit !== "cover") { out.push({ src: img.src, fit: cs.objectFit, skip: true }); continue }
        const r = img.getBoundingClientRect()
        const nw = img.naturalWidth, nh = img.naturalHeight
        if (!nw || !nh || !r.width || !r.height) { out.push({ src: img.src, broken: true }); continue }
        // cover scale
        const scale = Math.max(r.width / nw, r.height / nh)
        const drawnH = nh * scale
        const overflowY = Math.max(0, drawnH - r.height)
        // resolved object-position vertical component, as a fraction
        const pos = cs.objectPosition.split(" ")
        const rawY = pos[1] ?? "50%"
        const fracY = rawY.endsWith("%") ? parseFloat(rawY) / 100 : rawY === "top" ? 0 : rawY === "bottom" ? 1 : 0.5
        const topCutPx = overflowY * fracY
        out.push({
          src: decodeURIComponent(img.src).split("/").pop().split("?")[0],
          objectPosition: cs.objectPosition,
          natural: `${nw}x${nh}`,
          frame: `${Math.round(r.width)}x${Math.round(r.height)}`,
          topCutPct: Math.round((topCutPx / drawnH) * 1000) / 10,
          bottomCutPct: Math.round(((overflowY - topCutPx) / drawnH) * 1000) / 10,
        })
      }
      return out
    })
    for (const f of found) {
      if (f.skip || f.broken) { rows.push(`${width} ${route} ${f.src ?? ""} ${f.broken ? "BROKEN" : "fit=" + f.fit}`); continue }
      worst = Math.max(worst, f.topCutPct)
      rows.push(`${width} ${route.padEnd(22)} ${f.src.padEnd(34)} pos=${f.objectPosition.padEnd(12)} frame=${f.frame.padEnd(10)} topCut=${f.topCutPct}% bottomCut=${f.bottomCutPct}%`)
    }
  }
  await ctx.close()
}
await browser.close()
console.log(rows.join("\n"))
console.log(`\nworst top crop across every Debra placement: ${worst}% (ceiling ${MAX_TOP_CROP}%)`)
const ok = worst <= MAX_TOP_CROP
console.log(ok ? "PASS" : `FAIL — top crop exceeds the ${MAX_TOP_CROP}% ceiling`)
process.exitCode = ok ? 0 : 1
