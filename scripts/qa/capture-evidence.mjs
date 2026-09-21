/**
 * Committed visual-evidence capture.
 *
 * `site-audit.mjs --screenshots` writes full-resolution PNGs to
 * `qa-evidence/screenshots/`, which is gitignored — ~33MB per run. This writes
 * the compressed, committed set to `qa-evidence/visual/`, so a reviewer can see
 * what the site actually looked like at a given commit without cloning 33MB.
 *
 * It re-checks the content contract while it is on each page: a screenshot
 * nobody reads is not evidence, so the run fails loudly if a route regresses
 * rather than quietly capturing a picture of the regression.
 *
 * Usage:
 *   node scripts/qa/capture-evidence.mjs --base http://127.0.0.1:3111
 */

import { mkdir, rm } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

import { chromium } from "playwright"

const args = process.argv.slice(2)
const argOf = (name, fallback) => {
  const index = args.indexOf(`--${name}`)
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback
}

const BASE = argOf("base", "http://127.0.0.1:3111").replace(/\/$/, "")
const OUT = path.resolve(argOf("out", "qa-evidence/visual"))

/** Every route the owner review requires evidence for. */
const ROUTES = [
  ["home", "/"],
  ["resources", "/resources"],
  ["calculators", "/calculators"],
  ["blog-index", "/blog"],
  ["article-naca", "/blog/naca-homebuying-dallas-fort-worth"],
  ["article-heroes", "/blog/homes-for-heroes-north-texas"],
  ["article-garland", "/blog/how-to-buy-home-garland-tx"],
  ["about", "/about"],
  ["consultation", "/consultation"],
  ["start", "/start"],
  ["programs", "/programs"],
  ["areas-garland", "/areas/garland"],
  ["contact", "/contact"],
]

const VIEWPORTS = [
  ["desktop-1440", 1440, 900],
  ["laptop-1024", 1024, 768],
  ["tablet-768", 768, 1024],
  ["mobile-430", 430, 932],
  ["mobile-375", 375, 812],
]

/** Copy that must never be on screen. Mirrors scripts/qa/site-audit.mjs. */
const FORBIDDEN_TEXT = [
  "Placeholder",
  "[Price",
  "[Property Address",
  "Lorem ipsum",
  "field guide",
  "Field Guide",
]

const failures = []

async function main() {
  await rm(OUT, { recursive: true, force: true })
  await mkdir(OUT, { recursive: true })

  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium",
  })

  for (const [viewportName, width, height] of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width, height } })
    const page = await context.newPage()

    for (const [label, route] of ROUTES) {
      const response = await page.goto(`${BASE}${route}`, { waitUntil: "load" })
      const status = response?.status() ?? 0
      if (status !== 200) failures.push(`${route} @${viewportName} returned ${status}`)

      // Lazy images below the fold would otherwise be captured mid-load and
      // would report naturalWidth 0, which is indistinguishable from broken.
      await page.evaluate(async () => {
        // `scroll-behavior: smooth` is set on <html>, so scrollTo() animates and
        // a fixed wait lands mid-animation on a 15,000px article page. Disable
        // it for the duration of the measurement and restore it afterwards.
        const root = document.documentElement
        const previousBehavior = root.style.scrollBehavior
        root.style.scrollBehavior = "auto"
        const step = window.innerHeight
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y)
          await new Promise((resolve) => setTimeout(resolve, 70))
        }
        window.scrollTo(0, 0)
        root.style.scrollBehavior = previousBehavior
        const images = [...document.querySelectorAll("img")]
        for (const img of images) img.loading = "eager"
        await Promise.all(
          images.map(
            (img) =>
              new Promise((resolve) => {
                if (img.complete) return resolve()
                img.addEventListener("load", resolve, { once: true })
                img.addEventListener("error", resolve, { once: true })
                setTimeout(resolve, 6000)
              }),
          ),
        )
      })
      await page.waitForTimeout(200)

      const audit = await page.evaluate((forbidden) => {
        const text = document.body.innerText
        const element = document.documentElement
        return {
          found: forbidden.filter((needle) => text.includes(needle)),
          broken: [...document.images]
            .filter((img) => img.naturalWidth === 0)
            .map((img) => img.currentSrc || img.src),
          horizontalScroll: element.scrollWidth > element.clientWidth + 1,
        }
      }, FORBIDDEN_TEXT)

      if (audit.found.length > 0) {
        failures.push(`${route} @${viewportName} shows placeholder copy: ${audit.found.join(", ")}`)
      }
      if (audit.broken.length > 0) {
        failures.push(`${route} @${viewportName} has broken images: ${audit.broken.join(" | ")}`)
      }
      if (audit.horizontalScroll) {
        failures.push(`${route} @${viewportName} scrolls horizontally`)
      }

      // Eager-loading the images above reflows the page, which can leave the
      // viewport part-way down. A viewport-height capture has to start at the
      // masthead, so return to the top instantly and confirm it landed.
      await page.evaluate(() => {
        const root = document.documentElement
        const previousBehavior = root.style.scrollBehavior
        root.style.scrollBehavior = "auto"
        window.scrollTo(0, 0)
        root.style.scrollBehavior = previousBehavior
      })
      await page.waitForTimeout(150)
      const scrollY = await page.evaluate(() => window.scrollY)
      if (scrollY !== 0) failures.push(`${route} @${viewportName} did not return to the top (scrollY=${scrollY})`)

      // Articles are 8,000-15,000px tall; a full-page capture of each at five
      // viewports is most of the committed evidence weight and adds little a
      // reviewer can read. Their masthead, crop and byline are what matters
      // here, and the audit report covers the rest of the page.
      await page.screenshot({
        path: path.join(OUT, `${viewportName}__${label}.jpg`),
        type: "jpeg",
        quality: 48,
        fullPage: !route.startsWith("/blog/"),
      })
    }

    await context.close()
  }

  await browser.close()

  const captured = ROUTES.length * VIEWPORTS.length
  console.log(`Captured ${captured} screenshots to ${OUT}`)
  console.log(`Routes: ${ROUTES.length}   Viewports: ${VIEWPORTS.map(([n]) => n).join(", ")}`)

  if (failures.length > 0) {
    console.error(`\n${failures.length} failure(s):`)
    for (const failure of failures) console.error(`  FAIL ${failure}`)
    process.exitCode = 1
    return
  }
  console.log("Clean: every route 200, no placeholder copy, no broken images, no horizontal scroll.")
}

await main()
