/**
 * Homepage quiz end-to-end run.
 *
 * Drives "Find Your Homebuying Path" in a real Chromium browser on the running
 * production server: every one of the eight result paths, at desktop with the
 * mouse and at phone width with touch, then fetches every CTA the results
 * offer. Fails if a path resolves to the wrong result, focus does not land on
 * the result heading, a CTA is not a 200, or the page logs a console error.
 *
 * Usage:
 *   node scripts/qa/quiz-e2e.mjs [--base http://127.0.0.1:3111]
 */
import { chromium } from "playwright";
const args = process.argv.slice(2);
const baseIndex = args.indexOf("--base");
const BASE = (baseIndex >= 0 && args[baseIndex + 1] ? args[baseIndex + 1] : "http://127.0.0.1:3111").replace(/\/$/, "");
const PLANS = {
  "first-time": { goal: "first", area: "garland", timeline: "6mo", buyerPosition: "scratch", service: "none" },
  "ready-search": { goal: "first", area: "dallas", timeline: "asap", buyerPosition: "search", service: "none" },
  "researcher": { goal: "next", area: "collin", timeline: "later", buyerPosition: "financing", service: "none" },
  "selling": { goal: "sell", area: "tarrant", timeline: "3mo", sellerPosition: "value", service: "none" },
  "sell-buy": { goal: "sellbuy", area: "other", timeline: "12mo", buyerPosition: "sellfirst", service: "none" },
  "relocating": { goal: "relocate", area: "unsure", timeline: "researching", buyerPosition: "preapproved", service: "notsure" },
  "unsure": { goal: "explore", area: "garland", timeline: "asap", buyerPosition: "scratch", service: "notsure" },
  "hero": { goal: "first", area: "dallas", timeline: "3mo", buyerPosition: "financing", service: "military" },
};
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium" });
const ctas = new Set(); let errors = 0; let ok = 0;
for (const [expected, plan] of Object.entries(PLANS)) {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 375, height: 812 }]) {
    const ctx = await browser.newContext({ viewport, hasTouch: viewport.width < 900, isMobile: viewport.width < 900 });
    const page = await ctx.newPage();
    page.on("console", m => { if (m.type() === "error") { errors++; console.log("console error:", m.text()); } });
    await page.goto(BASE + "/#find-your-path", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Find Your Homebuying Path/ }).click();
    let steps = 0;
    while ((await page.locator(".fh-pathquiz-panel").getAttribute("data-phase")) !== "result") {
      if (steps++ > 8) throw new Error("did not finish");
      const panel = page.locator(".fh-pathquiz-panel");
      const name = await panel.locator("input[type=radio]").first().getAttribute("name");
      const id = name.replace("homebuying-path-", "");
      const value = plan[id];
      const target = value ? panel.locator(`input[type=radio][value="${value}"]`) : panel.locator("input[type=radio]").first();
      if (viewport.width === 375) { await panel.locator(`label:has(input[value="${value}"])`).tap(); } else { await target.check({ force: true }); }
      await panel.locator("button.fh-btn-navy").click();
      await page.waitForTimeout(120);
    }
    const panel = page.locator(".fh-pathquiz-panel");
    const key = await panel.getAttribute("data-path");
    const focusOk = await page.evaluate(() => (document.activeElement?.className || "").includes("fh-pathquiz-title"));
    for (const href of await panel.locator("a").evaluateAll(as => as.map(a => a.getAttribute("href")))) ctas.add(href);
    const pass = key === expected;
    if (pass) ok++;
    console.log(`${viewport.width}px ${expected.padEnd(12)} → ${key.padEnd(12)} ${pass ? "OK" : "MISMATCH"} steps=${steps} focus=${focusOk}`);
    await ctx.close();
  }
}
let bad = 0;
for (const href of ctas) { const res = await fetch(BASE + href, { redirect: "manual" }); if (res.status !== 200) { bad++; console.log("CTA not 200:", href, res.status); } }
console.log(`paths passed=${ok}/16 CTAs=${ctas.size} non-200=${bad} consoleErrors=${errors}`);
await browser.close();
process.exit(ok === 16 && !bad && !errors ? 0 : 1);
