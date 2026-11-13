import assert from "node:assert/strict"
import { mkdir } from "node:fs/promises"
import { chromium } from "playwright"

const base = process.env.QA_BASE_URL || "http://127.0.0.1:3111"
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || chromium.executablePath() })
const routes = [
  ["affordability", "affordability-income", "90000"],
  ["mortgage-payment", "mortgage-home-price", "350000"],
  ["closing-costs", "closing-price", "350000"],
  ["down-payment", "down-price", "350000"],
  ["rent-vs-buy", "rent-home-price", "300000"],
]
await mkdir("/tmp/agent-browser", { recursive: true })

try {
  for (const width of [375, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 812 }, reducedMotion: "reduce" })
    try {
      for (const [route, id, original] of routes) {
        const page = await context.newPage()
        const errors = []
        page.on("pageerror", (error) => errors.push(error.message))
        await page.goto(`${base}/calculators/${route}`)
        const input = page.locator(`#${id}`)
        await input.fill("")
        await page.getByText("Enter a number to update your estimate.", { exact: true }).waitFor()
        assert.equal(await input.getAttribute("aria-invalid"), "true")
        await page.getByText("Your estimate is paused.", { exact: false }).waitFor()
        assert.equal(await page.getByRole("link", { name: "Discuss these estimates with Debra" }).isVisible(), false)
        await input.fill("-1")
        await page.getByText("Enter 0 or more.", { exact: true }).waitFor()
        await input.fill(original)
        await page.getByRole("link", { name: "Discuss these estimates with Debra" }).waitFor()
        assert.equal(await input.getAttribute("aria-invalid"), "false")
        assert.equal(await page.getByRole("link", { name: "Discuss these estimates with Debra" }).getAttribute("href"), "/consultation")
        if (route === "mortgage-payment" || route === "closing-costs") {
          await input.fill("10000")
          await page.getByText("Enter 10,000 or less.", { exact: true }).waitFor()
          await page.getByText("Your estimate is paused.", { exact: false }).waitFor()
          await input.fill(original)
        }
        if (width === 375 && route !== "down-payment") {
          await page.getByRole("link", { name: "Jump to your estimate" }).focus()
          await page.keyboard.press("Enter")
          await page.waitForFunction(() => document.activeElement?.getAttribute("aria-label") === "Planning results")
        }
        const layout = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth,
          inputSizes: [...document.querySelectorAll("input[type=number]")].map((el) => ({
            fontSize: parseFloat(getComputedStyle(el).fontSize),
            height: el.getBoundingClientRect().height,
          })),
        }))
        assert.equal(layout.overflow, false, `${route} at ${width}: horizontal overflow`)
        assert.ok(layout.inputSizes.every((size) => size.fontSize >= 16 && size.height >= 44))
        assert.deepEqual(errors, [])
        await page.screenshot({ path: `/tmp/agent-browser/qc-${route}-${width}.png`, fullPage: true })
        console.log(`PASS ${route} ${width}: empty, range, recovery, layout, next step`)
        await page.close()
      }
    } finally {
      await context.close()
    }
  }
} finally {
  await browser.close()
}
