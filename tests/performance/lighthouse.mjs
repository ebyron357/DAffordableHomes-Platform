import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { mkdir, writeFile } from "node:fs/promises"
import process from "node:process"
import { launch } from "chrome-launcher"
import chromiumBinary from "@sparticuz/chromium"
import lighthouse from "lighthouse"
import desktopConfig from "lighthouse/core/config/desktop-config.js"

const port = 3101
const baseUrl = `http://127.0.0.1:${port}`
const evidenceDir = process.env.EVIDENCE_DIR || "/tmp/daffordablehomes-performance-evidence"
let serverExited = false

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

let chrome
try {
  await waitForServer()
  await mkdir(evidenceDir, { recursive: true })

  chrome = await launch({
    chromePath: await chromiumBinary.executablePath(),
    chromeFlags: [
      ...chromiumBinary.args.filter((argument) => argument !== "--single-process" && argument !== "--no-zygote"),
      "--headless",
      "--hide-scrollbars",
      "--no-sandbox",
      "--disable-dev-shm-usage",
    ],
  })

  const result = await lighthouse(baseUrl, {
    port: chrome.port,
    logLevel: "error",
    output: "html",
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
  }, desktopConfig)
  assert.ok(result, "Lighthouse should return an audit result")

  const categories = Object.fromEntries(
    Object.entries(result.lhr.categories).map(([key, category]) => [key, Math.round((category.score ?? 0) * 100)]),
  )
  const metrics = {
    largestContentfulPaintMs: result.lhr.audits["largest-contentful-paint"].numericValue,
    cumulativeLayoutShift: result.lhr.audits["cumulative-layout-shift"].numericValue,
    totalBlockingTimeMs: result.lhr.audits["total-blocking-time"].numericValue,
  }
  const failedAudits = Object.values(result.lhr.audits)
    .filter((audit) => audit.score !== null && audit.score < 0.9 && audit.scoreDisplayMode !== "notApplicable")
    .map(({ id, title, score, displayValue, errorMessage }) => ({ id, title, score, displayValue, errorMessage }))
  const performanceAudits = result.lhr.categories.performance.auditRefs
    .filter(({ weight }) => weight > 0)
    .map(({ id, weight }) => ({ id, weight, score: result.lhr.audits[id].score, displayValue: result.lhr.audits[id].displayValue }))
  const layoutShiftItems = result.lhr.audits["layout-shifts"].details?.items ?? []
  const summary = { url: baseUrl, categories, metrics, performanceAudits, layoutShiftItems, failedAudits, auditedAt: new Date().toISOString() }

  await writeFile(`${evidenceDir}/lighthouse-home.html`, result.report)
  await writeFile(`${evidenceDir}/lighthouse-summary.json`, `${JSON.stringify(summary, null, 2)}\n`)
  process.stdout.write(`${JSON.stringify(summary)}\n`)

  assert.ok(categories.performance >= 95, `Performance score should be at least 95; received ${categories.performance}`)
  assert.equal(categories.accessibility, 100, "Accessibility score should be 100")
  assert.equal(categories["best-practices"], 100, "Best Practices score should be 100")
  assert.equal(categories.seo, 100, "SEO score should be 100")
  assert.ok(metrics.largestContentfulPaintMs < 2500, "LCP should remain below 2.5 seconds")
  assert.ok(metrics.cumulativeLayoutShift < 0.1, "CLS should remain below 0.1")
  assert.ok(metrics.totalBlockingTimeMs < 200, "Total Blocking Time should remain below 200ms as a lab responsiveness guardrail")
} catch (error) {
  process.stderr.write(`${serverOutput}\n`)
  throw error
} finally {
  if (chrome) await chrome.kill()
  if (server.pid) {
    try {
      process.kill(-server.pid, "SIGTERM")
    } catch {
      server.kill("SIGTERM")
    }
  }
}
