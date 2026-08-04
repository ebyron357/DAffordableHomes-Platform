import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { mkdir } from "node:fs/promises"
import process from "node:process"
import AxeBuilder from "@axe-core/playwright"
import { chromium } from "@playwright/test"
import chromiumBinary from "@sparticuz/chromium"
import sharp from "sharp"

const port = 3100
const baseUrl = `http://127.0.0.1:${port}`
const evidenceDir = process.env.EVIDENCE_DIR || "/tmp/daffordablehomes-browser-evidence"
let serverExited = false
const routes = [
  "/", "/about", "/accessibility", "/areas", "/areas/garland", "/blog", "/book", "/contact",
  "/equal-housing-opportunity", "/events", "/fair-housing", "/faq", "/first-time-buyers", "/homes",
  "/market-reports", "/neighborhoods", "/privacy", "/programs", "/programs/homes-for-heroes",
  "/programs/naca", "/resources", "/resources/calculators", "/resources/calculators/affordability",
  "/resources/calculators/closing-costs", "/resources/calculators/down-payment",
  "/resources/calculators/mortgage-payment", "/start", "/terms", "/testimonials",
]

async function waitForServer() {
  const deadline = Date.now() + 45_000
  while (Date.now() < deadline) {
    if (serverExited) throw new Error("Next.js production server exited before becoming ready.")
    try {
      const response = await fetch(baseUrl)
      if (response.ok) return
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 300))
  }
  throw new Error("Next.js production server did not become ready within 45 seconds.")
}

const server = spawn("npm", ["--workspace", "apps/web", "run", "start", "--", "-H", "127.0.0.1", "-p", String(port)], {
  cwd: process.cwd(),
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
  stdio: ["ignore", "pipe", "pipe"],
  detached: true,
})

let serverOutput = ""
server.stdout.on("data", (chunk) => { serverOutput += chunk.toString() })
server.stderr.on("data", (chunk) => { serverOutput += chunk.toString() })
server.on("exit", () => { serverExited = true })

try {
  await waitForServer()
  await mkdir(evidenceDir, { recursive: true })

  const browser = await chromium.launch({
    args: chromiumBinary.args,
    executablePath: await chromiumBinary.executablePath(),
    headless: true,
    env: { ...process.env, XDG_CACHE_HOME: "/tmp/daffordablehomes-browser-cache" },
  })

  try {
    const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
    const desktop = await desktopContext.newPage()
    desktop.setDefaultTimeout(15_000)

    for (const route of routes) {
      process.stdout.write(`Checking ${route}\n`)
      const response = await desktop.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded", timeout: 15_000 })
      assert.equal(response?.status(), 200, `${route} should return HTTP 200`)
      assert.equal(await desktop.locator("main").count(), 1, `${route} should have one main landmark`)
      assert.equal(await desktop.locator("h1").count(), 1, `${route} should have one h1`)
      assert.equal(
        await desktop.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth),
        true,
        `${route} should not overflow horizontally at 1440px`,
      )
      assert.equal(await desktop.locator("[data-nextjs-dialog]").count(), 0, `${route} should not show a Next.js error overlay`)

      const accessibility = await new AxeBuilder({ page: desktop })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze()
      const seriousViolations = accessibility.violations.filter(({ impact }) => impact === "critical" || impact === "serious")
      assert.deepEqual(
        seriousViolations.map(({ id, impact, nodes }) => ({
          id,
          impact,
          nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
        })),
        [],
        `${route} should have no serious or critical automated accessibility violations`,
      )
    }

    await desktop.goto(baseUrl, { waitUntil: "domcontentloaded" })
    const desktopScreenshot = await desktop.screenshot({ fullPage: true })
    await sharp(desktopScreenshot).webp({ quality: 82 }).toFile(`${evidenceDir}/home-desktop-1440.webp`)

    await desktop.setViewportSize({ width: 375, height: 812 })
    await desktop.goto(`${baseUrl}/book`, { waitUntil: "domcontentloaded" })
    const mobileOverflow = await desktop.evaluate(() => {
      const viewportWidth = document.documentElement.clientWidth
      return [...document.querySelectorAll("body *")]
        .map((element) => {
          const rect = element.getBoundingClientRect()
          return {
            element: `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ""}${element.classList.length ? `.${[...element.classList].join(".")}` : ""}`,
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            width: Math.round(rect.width),
          }
        })
        .filter(({ left, right }) => left < -1 || right > viewportWidth + 1)
        .slice(0, 10)
    })
    assert.deepEqual(mobileOverflow, [], "/book should not overflow horizontally at 375px")
    const mobileScreenshot = await desktop.screenshot({ fullPage: true })
    await sharp(mobileScreenshot).webp({ quality: 82 }).toFile(`${evidenceDir}/consultation-mobile-375.webp`)
    await desktopContext.close()
    process.stdout.write(`Browser evidence saved to ${evidenceDir}\n`)
  } finally {
    await browser.close()
  }
} catch (error) {
  process.stderr.write(`${serverOutput}\n`)
  throw error
} finally {
  if (server.pid) {
    try {
      process.kill(-server.pid, "SIGTERM")
    } catch {
      server.kill("SIGTERM")
    }
  }
}
