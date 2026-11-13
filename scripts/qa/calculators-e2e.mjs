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
        if (width === 375) {
          await page.evaluate(() => { document.documentElement.style.fontSize = "200%" })
          await input.fill("")
          await page.getByText("Enter a number to update your estimate.", { exact: true }).waitFor()
          const resized = await page.evaluate(() => {
            const panel = document.querySelector('[class~="group/calculator"]')
            const bounds = panel.getBoundingClientRect()
            const elements = [...panel.querySelectorAll("label, input, select, [id$='-error']")]
            return {
              rootFontSize: getComputedStyle(document.documentElement).fontSize,
              rootStyle: document.documentElement.getAttribute("style"),
              fontSize: parseFloat(getComputedStyle(panel.querySelector("input")).fontSize),
              inputFonts: [...panel.querySelectorAll("input, select")].map((el) => ({
                id: el.id,
                fontSize: getComputedStyle(el).fontSize,
                style: el.getAttribute("style"),
              })),
              clipped: elements.filter((el) => {
                const rect = el.getBoundingClientRect()
                return rect.left < bounds.left - 1 || rect.right > bounds.right + 1
              }).map((el) => el.id || el.textContent),
            }
          })
          console.log(`RESIZE ${route}: ${JSON.stringify(resized)}`)
          await page.screenshot({ path: `/tmp/agent-browser/qc-${route}-375-text-200-error.png`, fullPage: true })
          assert.ok(resized.fontSize >= 32, `${route}: inputs resize to 200%: ${JSON.stringify(resized)}`)
          assert.deepEqual(resized.clipped, [], `${route}: fields and errors must not be clipped at 200%`)
          await input.fill(original)
          await page.getByRole("link", { name: "Discuss these estimates with Debra" }).waitFor()
          await page.screenshot({ path: `/tmp/agent-browser/qc-${route}-375-text-200.png`, fullPage: true })
          console.log(`PASS ${route} 375: 200% text resizing, unclipped fields/errors, recovery`)
        }
        await page.close()
      }
    } finally {
      await context.close()
    }
  }
} finally {
  await browser.close()
}
