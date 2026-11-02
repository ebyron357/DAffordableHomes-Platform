#!/usr/bin/env node
/**
 * Automated accessibility scan (axe-core) against a running production build.
 *
 *   node scripts/qa/axe-audit.mjs --base http://127.0.0.1:3111 [--out qa-evidence]
 *
 * Runs WCAG 2.0–2.2 A/AA rules on the public routes at a phone and a desktop
 * width. Any violation fails the run. This closes RISK-003's "add automated
 * accessibility tests early": the structural checks in site-audit.mjs did not
 * catch keyboard-unreachable scroll regions, which axe does.
 *
 * Automated rules catch roughly a third of WCAG issues. A manual keyboard and
 * screen-reader pass is still required before release.
 */
import { readFileSync } from "node:fs"
import { createRequire } from "node:module"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import { chromium } from "playwright"

const require = createRequire(import.meta.url)
const AXE_SOURCE = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8")

const args = process.argv.slice(2)
const option = (name, fallback) => {
  const index = args.indexOf(`--${name}`)
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback
}
const BASE = option("base", "http://127.0.0.1:3111").replace(/\/$/, "")
const OUT = path.resolve(option("out", "qa-evidence"))

const ROUTES = [
  "/",
  "/start",
  "/homes",
  "/areas",
  "/areas/garland",
  "/resources",
  "/calculators",
  "/calculators/down-payment",
  "/first-time-buyers",
  "/faq",
  "/programs",
  "/programs/naca",
  "/programs/homes-for-heroes",
  "/blog",
  "/blog/naca-homebuying-dallas-fort-worth",
  "/blog/homes-for-heroes-north-texas",
  "/blog/how-to-buy-home-garland-tx",
  "/consultation",
  "/contact",
  "/about",
  "/testimonials",
  "/privacy",
]

const VIEWPORTS = [
  { name: "mobile-390", width: 390, height: 844 },
  { name: "desktop-1280", width: 1280, height: 900 },
]

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium",
})

const results = []
let violations = 0

try {
  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce" })
    const page = await context.newPage()
    for (const route of ROUTES) {
      const response = await page.goto(`${BASE}${route}`, { waitUntil: "load" })
      if (!response || response.status() >= 400) {
        violations += 1
        results.push({ route, viewport: viewport.name, error: `HTTP ${response?.status() ?? "no response"}` })
        console.log(`FAIL ${viewport.name} ${route}: HTTP ${response?.status() ?? "no response"}`)
        continue
      }
      await page.addScriptTag({ content: AXE_SOURCE })
      const found = await page.evaluate(async (tags) => {
        // eslint-disable-next-line no-undef
        const run = await axe.run(document, { runOnly: { type: "tag", values: tags } })
        return run.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          help: v.help,
          targets: v.nodes.slice(0, 5).map((n) => n.target.join(" ")),
        }))
      }, TAGS)
      results.push({ route, viewport: viewport.name, violations: found })
      violations += found.length
      if (found.length === 0) {
        console.log(`PASS ${viewport.name} ${route}`)
      } else {
        for (const v of found) {
          console.log(`FAIL ${viewport.name} ${route}: [${v.impact}] ${v.id}: ${v.help}\n      ${v.targets.join("\n      ")}`)
        }
      }
    }
    await context.close()
  }
} finally {
  await browser.close()
}

await mkdir(OUT, { recursive: true })
await writeFile(
  path.join(OUT, "axe-audit.json"),
  `${JSON.stringify({ base: BASE, tags: TAGS, routes: ROUTES.length, viewports: VIEWPORTS, violations, results }, null, 2)}\n`,
)

console.log(`\n${ROUTES.length * VIEWPORTS.length} page scans, ${violations} violation(s).`)
process.exit(violations === 0 ? 0 : 1)
