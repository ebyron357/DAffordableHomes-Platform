#!/usr/bin/env node
/**
 * Submit the live sitemap to IndexNow (Bing, Yandex, Seznam, Naver; Bing's
 * index also feeds Copilot and ChatGPT search).
 *
 *   INDEXNOW_KEY=<the key set in Vercel> node scripts/seo/indexnow.mjs [--site https://daffordablehomes.com] [--dry-run]
 *
 * Run it once after the domain points at the new site, and again after
 * publishing or substantially changing pages. It refuses to submit unless the
 * live /indexnow.txt returns exactly this key, because a submission the
 * engines cannot verify is ignored. Only URLs from the live sitemap are sent,
 * so nothing noindexed or redirected is ever submitted.
 */
const args = process.argv.slice(2)
const option = (name, fallback) => {
  const index = args.indexOf(`--${name}`)
  return index === -1 ? fallback : args[index + 1]
}
const site = option("site", "https://daffordablehomes.com").replace(/\/$/, "")
const dryRun = args.includes("--dry-run")
const key = process.env.INDEXNOW_KEY?.trim()

if (!key || !/^[A-Za-z0-9-]{8,128}$/.test(key)) {
  console.error("Set INDEXNOW_KEY to the key configured in Vercel (8–128 letters, digits or dashes).")
  process.exit(1)
}

const keyLocation = `${site}/indexnow.txt`
const served = await fetch(keyLocation).then((response) => (response.ok ? response.text() : ""))
if (served.trim() !== key) {
  console.error(`${keyLocation} does not return this key yet. Set INDEXNOW_KEY in Vercel and redeploy first.`)
  process.exit(1)
}

const sitemap = await fetch(`${site}/sitemap.xml`).then((response) => response.text())
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]).filter((url) => url.startsWith(site))
if (urlList.length === 0) {
  console.error(`No URLs on ${site} found in ${site}/sitemap.xml.`)
  process.exit(1)
}

const body = { host: new URL(site).host, key, keyLocation, urlList }
if (dryRun) {
  console.log(JSON.stringify({ ...body, key: "<redacted>" }, null, 2))
  process.exit(0)
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
})
// 200 accepted, 202 accepted pending key verification; anything else is a problem worth reading.
console.log(`IndexNow: HTTP ${response.status} for ${urlList.length} URLs`)
if (response.status !== 200 && response.status !== 202) {
  console.error(await response.text())
  process.exit(1)
}
