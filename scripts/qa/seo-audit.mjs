#!/usr/bin/env node
/**
 * Search, answer-engine and AI-crawler audit of a served build.
 *
 *   node scripts/qa/seo-audit.mjs --base http://127.0.0.1:3111 [--out qa-evidence]
 *
 * `site-audit.mjs` proves pages render, are accessible and respond well on
 * every viewport. This audit reads each page the way a crawler does — the
 * server-rendered HTML, with JavaScript off — and checks what decides whether a
 * page is found, understood and quoted:
 *
 * - every sitemap URL: 200, indexable, a self-canonical, a unique title of at
 *   most 60 characters and description of 70–160, complete Open Graph and
 *   Twitter tags, one H1, alt text, and links onward from its main content;
 * - structured data: every block parses, uses schema.org, carries the fields
 *   its type needs, and describes only what the page shows — each FAQ
 *   question is on the page, each breadcrumb matches the visible trail, and no
 *   page has two FAQPage blocks;
 * - the link graph: no sitemap page is an orphan, and every internal link
 *   resolves;
 * - the edges: legacy URLs redirect in one hop, a trailing slash redirects,
 *   unknown URLs return a real 404, noindex pages stay out of the sitemap;
 * - crawler access: robots.txt allows search and AI-search crawlers
 *   (Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, PerplexityBot,
 *   ClaudeBot…), and every URL /llms.txt names resolves.
 *
 * Thin pages are reported as warnings, not failures: word count is a prompt to
 * look, not a verdict. Exit code 1 when any check fails.
 */
import { createRequire } from "node:module"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"

const require = createRequire(new URL("../../package.json", import.meta.url))
const { chromium } = require("playwright")

const args = process.argv.slice(2)
const option = (name, fallback) => {
  const index = args.indexOf(`--${name}`)
  return index === -1 ? fallback : args[index + 1]
}
const BASE = option("base", "http://127.0.0.1:3111").replace(/\/$/, "")
const OUT = option("out", "qa-evidence")
const SITE = "https://daffordablehomes.com"

const failures = []
const warnings = []
const passed = []
const fail = (ok, label, detail = "") => (ok ? passed.push(label) : failures.push(detail ? `${label} — ${detail}` : label))
const warn = (ok, label, detail = "") => {
  if (!ok) warnings.push(detail ? `${label} — ${detail}` : label)
}

const local = (url) => url.replace(SITE, BASE)
const siteRoute = (url) => {
  const { pathname } = new URL(url, SITE)
  return pathname === "/" ? "/" : pathname.replace(/\/$/, "")
}

async function get(route, init = {}) {
  return fetch(`${BASE}${route}`, { redirect: "manual", ...init })
}

/* ---- sitemap, robots, llms.txt ------------------------------------------------ */

const sitemapXml = await (await get("/sitemap.xml")).text()
const sitemapEntries = [...sitemapXml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
  loc: m[1].match(/<loc>([^<]+)<\/loc>/)?.[1] ?? "",
  lastmod: m[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1],
}))
const sitemapRoutes = sitemapEntries.map((entry) => siteRoute(entry.loc))
fail(sitemapRoutes.length > 20, "the sitemap lists the site's pages", `${sitemapRoutes.length} URLs`)
fail(new Set(sitemapRoutes).size === sitemapRoutes.length, "the sitemap lists each URL once")
for (const entry of sitemapEntries) {
  fail(entry.loc.startsWith(`${SITE}`), `sitemap URL ${entry.loc} is on the canonical origin`)
  if (entry.lastmod) fail(!Number.isNaN(Date.parse(entry.lastmod)), `sitemap lastmod for ${entry.loc} is a valid date`, entry.lastmod)
}

const robotsTxt = await (await get("/robots.txt")).text()
const robotsGroups = []
{
  let current = null
  for (const raw of robotsTxt.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim()
    if (!line) continue
    const [key, ...rest] = line.split(":")
    const value = rest.join(":").trim()
    if (/^user-agent$/i.test(key)) {
      if (!current || current.rules.length) robotsGroups.push((current = { agents: [], rules: [] }))
      current.agents.push(value.toLowerCase())
    } else if (/^(allow|disallow)$/i.test(key) && current) {
      current.rules.push({ allow: /^allow$/i.test(key), path: value })
    }
  }
}
/** Whether robots.txt lets `agent` fetch `route` (longest match wins, Allow on ties). */
function robotsAllows(agent, route) {
  const group =
    robotsGroups.find((g) => g.agents.includes(agent.toLowerCase())) ?? robotsGroups.find((g) => g.agents.includes("*"))
  if (!group) return true
  let best = { length: -1, allow: true }
  for (const rule of group.rules) {
    if (!rule.path) continue
    if (route.startsWith(rule.path) && (rule.path.length > best.length || (rule.path.length === best.length && rule.allow))) {
      best = { length: rule.path.length, allow: rule.allow }
    }
  }
  return best.allow
}
fail(/^Sitemap:\s*https:\/\/daffordablehomes\.com\/sitemap\.xml$/im.test(robotsTxt), "robots.txt names the canonical sitemap")
const CRAWLERS = [
  "Googlebot",
  "Bingbot",
  "Applebot",
  "DuckDuckBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "PerplexityBot",
  "ClaudeBot",
  "Claude-SearchBot",
  "Google-Extended",
]
for (const crawler of CRAWLERS) {
  for (const route of ["/", "/programs/naca", "/calculators/affordability", "/llms.txt", "/sitemap.xml"]) {
    fail(robotsAllows(crawler, route), `robots.txt lets ${crawler} fetch ${route}`)
  }
  fail(!robotsAllows(crawler, "/api/leads/contact"), `robots.txt keeps ${crawler} out of /api/`)
}

const llmsResponse = await get("/llms.txt")
const llmsTxt = await llmsResponse.text()
fail(llmsResponse.status === 200, "/llms.txt is served")
fail(/^text\/(plain|markdown)/.test(llmsResponse.headers.get("content-type") ?? ""), "/llms.txt is plain text or markdown", llmsResponse.headers.get("content-type") ?? "")
fail(/^# /.test(llmsTxt), "/llms.txt opens with an H1 title, as the format expects")
const llmsUrls = [...new Set([...llmsTxt.matchAll(/https:\/\/daffordablehomes\.com[^\s)\]>"']*/g)].map((m) => m[0].replace(/[.,;:]+$/, "")))]
for (const url of llmsUrls) {
  const route = siteRoute(url)
  if (route.endsWith(".txt") || route.endsWith(".xml")) continue
  const response = await get(route)
  fail(response.status === 200, `/llms.txt link ${route} resolves`, `status ${response.status}`)
  fail(sitemapRoutes.includes(route), `/llms.txt link ${route} is an indexable sitemap page`)
}

/* ---- the edges -------------------------------------------------------------------- */

const REDIRECTS = {
  "/book": "/consultation",
  "/calculator": "/calculators/mortgage-payment",
  "/naca": "/programs/naca",
  "/resources/calculators": "/calculators",
  "/resources/calculators/affordability": "/calculators/affordability",
  "/resources/calculators/closing-costs": "/calculators/closing-costs",
  "/resources/calculators/down-payment": "/calculators/down-payment",
  "/resources/calculators/mortgage-payment": "/calculators/mortgage-payment",
  "/neighborhoods": "/areas",
  "/about/": "/about",
}
for (const [from, to] of Object.entries(REDIRECTS)) {
  const response = await get(from)
  const location = response.headers.get("location") ?? ""
  fail([301, 308].includes(response.status), `${from} redirects permanently`, `status ${response.status}`)
  fail(siteRoute(new URL(location, BASE).href) === to, `${from} redirects to ${to} in one hop`, location)
}
for (const route of ["/this-page-does-not-exist", "/blog/not-a-real-article"]) {
  const response = await get(route)
  fail(response.status === 404, `${route} returns a real 404`, `status ${response.status}`)
}

/* ---- every page, as a crawler reads it --------------------------------------------- */

// `/homes` and `/events` are noindex while they have no listings feed or no
// confirmed session; the sitemap lists them once they do.
const NOINDEX_ROUTES = [
  "/testimonials",
  "/market-reports",
  ...["/homes", "/events"].filter((route) => !sitemapRoutes.includes(route)),
]
const pages = new Map()
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM ?? "/opt/pw-browsers/chromium" })
const context = await browser.newContext({ javaScriptEnabled: false })
const page = await context.newPage()

for (const route of [...sitemapRoutes, ...NOINDEX_ROUTES, "/this-page-does-not-exist"]) {
  const response = await page.goto(`${BASE}${route === "/" ? "" : route}`, { waitUntil: "domcontentloaded" })
  const headers = response?.headers() ?? {}
  const data = await page.evaluate(() => {
    const meta = (selector) => document.querySelector(selector)?.getAttribute("content") ?? null
    const main = document.querySelector("main")
    const mainClone = main?.cloneNode(true)
    mainClone?.querySelectorAll("script, style, noscript, nav[aria-label*='readcrumb' i]").forEach((node) => node.remove())
    const bodyClone = document.body.cloneNode(true)
    bodyClone.querySelectorAll("script, style, noscript").forEach((node) => node.remove())
    const linksIn = (root) =>
      [...(root?.querySelectorAll("a[href]") ?? [])]
        .map((a) => a.getAttribute("href"))
        .filter((href) => href && href.startsWith("/") && !href.startsWith("//"))
        .map((href) => href.split("#")[0].split("?")[0] || "/")
    const crumbNav = document.querySelector("nav[aria-label*='readcrumb' i]")
    return {
      title: document.title,
      description: meta('meta[name="description"]'),
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null,
      robots: meta('meta[name="robots"]'),
      og: {
        title: meta('meta[property="og:title"]'),
        description: meta('meta[property="og:description"]'),
        url: meta('meta[property="og:url"]'),
        image: meta('meta[property="og:image"]'),
        type: meta('meta[property="og:type"]'),
        siteName: meta('meta[property="og:site_name"]'),
        imageAlt: meta('meta[property="og:image:alt"]'),
      },
      twitter: { card: meta('meta[name="twitter:card"]'), image: meta('meta[name="twitter:image"]') },
      h1s: [...document.querySelectorAll("h1")].map((h) => h.textContent.trim()),
      h2s: [...document.querySelectorAll("main h2")].map((h) => h.textContent.trim()),
      headings: [...document.querySelectorAll("main h1, main h2, main h3, main h4, main h5, main h6")].map((h) => Number(h.tagName[1])),
      questionHeadings: [...document.querySelectorAll("main h2, main h3")].filter((h) => h.textContent.trim().endsWith("?")).length,
      words: (mainClone?.textContent ?? "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean).length,
      bodyText: bodyClone.textContent.replace(/\s+/g, " "),
      mainLinks: linksIn(main),
      allLinks: linksIn(document.body),
      imagesMissingAlt: [...document.querySelectorAll("img")].filter((img) => !img.hasAttribute("alt")).length,
      jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent),
      crumbs: crumbNav ? [...crumbNav.querySelectorAll("li")].map((li) => li.textContent.replace(/\s+/g, " ").trim()) : [],
      lang: document.documentElement.lang,
    }
  })
  pages.set(route, { status: response?.status() ?? 0, xRobots: headers["x-robots-tag"] ?? "", ...data })
}
await browser.close()

const norm = (text) =>
  String(text ?? "")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()

const titles = new Map()
const descriptions = new Map()
const inlinks = new Map(sitemapRoutes.map((route) => [route, { main: new Set(), any: new Set() }]))
const schemaTypes = {}

for (const route of sitemapRoutes) {
  const p = pages.get(route)
  const expectedCanonical = route === "/" ? SITE : `${SITE}${route}`
  fail(p.status === 200, `${route} returns 200`, `status ${p.status}`)
  fail(p.lang === "en", `${route} declares lang="en"`, p.lang)
  fail(!/noindex/i.test(p.robots ?? "") && !/noindex/i.test(p.xRobots), `${route} is indexable`, `${p.robots} ${p.xRobots}`)
  fail(Boolean(p.title) && p.title.length <= 60, `${route} title is set and at most 60 characters`, `${p.title?.length}: ${p.title}`)
  warn((p.title?.length ?? 0) >= 25, `${route} title is descriptive (25+ characters)`, p.title)
  fail(Boolean(p.description) && p.description.length >= 70 && p.description.length <= 160, `${route} description is 70–160 characters`, `${p.description?.length}: ${p.description}`)
  fail(p.canonical === expectedCanonical, `${route} canonical is itself`, `${p.canonical}`)
  fail(Boolean(p.og.title && p.og.description && p.og.image && p.og.type && p.og.siteName), `${route} has complete Open Graph tags`, JSON.stringify(p.og))
  fail(p.og.url === expectedCanonical, `${route} og:url matches the canonical`, `${p.og.url}`)
  fail(/^https:\/\/daffordablehomes\.com\//.test(p.og.image ?? ""), `${route} og:image is absolute on the canonical origin`, `${p.og.image}`)
  fail(Boolean(p.og.imageAlt), `${route} og:image has alt text`)
  fail(p.twitter.card === "summary_large_image" && Boolean(p.twitter.image), `${route} has a large Twitter/X card with an image`, JSON.stringify(p.twitter))
  fail(p.h1s.length === 1 && p.h1s[0].length > 0, `${route} has one non-empty H1`, JSON.stringify(p.h1s))
  fail(p.imagesMissingAlt === 0, `${route} images all carry alt`, `${p.imagesMissingAlt} missing`)
  let previous = 0
  const skipped = p.headings.find((level) => {
    const bad = previous && level > previous + 1
    previous = level
    return bad
  })
  fail(!skipped, `${route} heading levels do not skip`, String(skipped ?? ""))
  const onward = new Set(p.mainLinks.filter((href) => href !== route))
  fail(onward.size >= 2, `${route} links onward from its main content (not a dead end)`, `${onward.size} distinct internal links`)
  warn(p.words >= 300, `${route} has substantive main content (300+ words)`, `${p.words} words`)

  for (const [map, value] of [
    [titles, p.title],
    [descriptions, p.description],
  ]) {
    if (!map.has(value)) map.set(value, [])
    map.get(value).push(route)
  }
  for (const href of p.mainLinks) inlinks.get(href)?.main.add(route)
  for (const href of p.allLinks) inlinks.get(href)?.any.add(route)

  /* structured data */
  const blocks = []
  for (const raw of p.jsonLd) {
    try {
      blocks.push(JSON.parse(raw))
    } catch (error) {
      fail(false, `${route} JSON-LD parses`, String(error).slice(0, 120))
    }
  }
  const nodes = blocks.flatMap((block) => (Array.isArray(block["@graph"]) ? block["@graph"].map((n) => ({ "@context": block["@context"], ...n })) : [block]))
  for (const block of blocks) fail(/schema\.org/.test(String(block["@context"])), `${route} JSON-LD uses the schema.org context`)
  const types = nodes.map((n) => [].concat(n["@type"]).join("+"))
  for (const type of types) schemaTypes[type] = (schemaTypes[type] ?? 0) + 1
  fail(types.filter((t) => t === "FAQPage").length <= 1, `${route} has at most one FAQPage block`, types.join(", "))
  fail(types.filter((t) => t === "BreadcrumbList").length <= 1, `${route} has at most one BreadcrumbList`, types.join(", "))

  const text = norm(p.bodyText)
  for (const node of nodes) {
    const type = [].concat(node["@type"]).join("+")
    if (type === "FAQPage") {
      const questions = node.mainEntity ?? []
      fail(questions.length > 0, `${route} FAQPage has questions`)
      for (const q of questions) {
        fail(q["@type"] === "Question" && Boolean(q.name) && Boolean(q.acceptedAnswer?.text), `${route} FAQ "${String(q.name).slice(0, 50)}" is complete`)
        fail(text.includes(norm(q.name)), `${route} FAQ question is visible on the page`, String(q.name).slice(0, 80))
        const answerStart = norm(q.acceptedAnswer?.text).slice(0, 60)
        fail(text.includes(answerStart), `${route} FAQ answer is visible on the page`, String(q.name).slice(0, 80))
      }
    }
    if (type === "BreadcrumbList") {
      const items = node.itemListElement ?? []
      items.forEach((item, index) => {
        fail(item.position === index + 1, `${route} breadcrumb positions run 1..n`)
        if (index < items.length - 1) fail(/^https:\/\/daffordablehomes\.com/.test(item.item ?? ""), `${route} breadcrumb "${item.name}" links on the canonical origin`)
        fail(p.crumbs.some((crumb) => norm(crumb) === norm(item.name)), `${route} breadcrumb "${item.name}" matches the visible trail`, p.crumbs.join(" › "))
      })
    }
    if (/Article|BlogPosting/.test(type)) {
      fail(Boolean(node.headline) && String(node.headline).length <= 110, `${route} Article headline is at most 110 characters`)
      fail(Boolean(node.datePublished) && !Number.isNaN(Date.parse(node.datePublished)), `${route} Article has a valid datePublished`)
      fail(Boolean(node.author), `${route} Article names its author`)
      warn(Boolean(node.image), `${route} Article has an image (needed for Google's article rich result)`)
    }
    if (type === "WebApplication") fail(Boolean(node.name && node.applicationCategory), `${route} WebApplication has a name and category`)
    if (type === "Service") fail(Boolean(node.provider), `${route} Service names its provider`)
    if (type === "ProfilePage") fail(Boolean(node.mainEntity), `${route} ProfilePage names its subject`)
    for (const forbidden of ["aggregateRating", "review"]) {
      fail(!(forbidden in node), `${route} ${type} carries no ${forbidden} (none are verified)`)
    }
  }
  pages.get(route).schemaTypes = types
}

for (const [title, routes] of titles) fail(routes.length === 1, `title is unique`, `"${title}" on ${routes.join(", ")}`)
for (const [description, routes] of descriptions) fail(routes.length === 1, `description is unique`, `${routes.join(", ")}`)
for (const [route, links] of inlinks) {
  if (route === "/") continue
  fail(links.any.size > 0, `${route} is linked from at least one other page (not an orphan)`)
  warn(links.main.size > 0, `${route} is linked from another page's main content, not only navigation`, `${links.any.size} pages link via nav/footer only`)
}

for (const route of NOINDEX_ROUTES) {
  const p = pages.get(route)
  fail(/noindex/i.test(p.robots ?? ""), `${route} is noindex until it has real content`)
  fail(!sitemapRoutes.includes(route), `${route} is not in the sitemap`)
}
{
  const p = pages.get("/this-page-does-not-exist")
  fail(p.status === 404, "the not-found page is served with status 404", `status ${p.status}`)
  fail(/noindex/i.test(p.robots ?? ""), "the not-found page is noindex", `${p.robots}`)
}

/* every internal link anywhere resolves */
const allTargets = new Set([...pages.values()].flatMap((p) => p.allLinks ?? []))
for (const target of allTargets) {
  if (pages.has(target) || target.startsWith("/api/")) continue
  const response = await get(target)
  const ok = response.status === 200 || ([301, 307, 308].includes(response.status) && Boolean(response.headers.get("location")))
  fail(ok, `internal link ${target} resolves`, `status ${response.status}`)
}

/* the share image itself */
{
  const image = pages.get("/").og.image
  const response = await fetch(local(image))
  fail(response.status === 200 && /^image\//.test(response.headers.get("content-type") ?? ""), "the share image is served as an image", `${response.status} ${response.headers.get("content-type")}`)
}

const report = {
  base: BASE,
  generatedFrom: "scripts/qa/seo-audit.mjs",
  routesAudited: sitemapRoutes.length + NOINDEX_ROUTES.length + 1,
  sitemapRoutes,
  redirectsChecked: Object.keys(REDIRECTS).length,
  internalLinksChecked: allTargets.size,
  crawlersChecked: CRAWLERS,
  llmsTxtLinks: llmsUrls.length,
  schemaTypes,
  pages: Object.fromEntries(
    [...pages].map(([route, p]) => [
      route,
      { status: p.status, title: p.title, description: p.description, h1: p.h1s[0], words: p.words, questionHeadings: p.questionHeadings, schema: p.schemaTypes ?? [], inlinks: inlinks.get(route) ? { main: inlinks.get(route).main.size, any: inlinks.get(route).any.size } : undefined },
    ]),
  ),
  passed: passed.length,
  failures,
  warnings,
}
await mkdir(OUT, { recursive: true })
await writeFile(path.join(OUT, "seo-audit.json"), `${JSON.stringify(report, null, 2)}\n`)

console.log(`routes=${report.routesAudited} sitemap=${sitemapRoutes.length} links=${allTargets.size} redirects=${report.redirectsChecked} crawlers=${CRAWLERS.length} llms-links=${llmsUrls.length}`)
console.log(`schema types: ${Object.entries(schemaTypes).map(([t, n]) => `${t}×${n}`).join(", ")}`)
console.log(`passed=${passed.length} failures=${failures.length} warnings=${warnings.length}`)
for (const line of failures) console.log(`FAIL  ${line}`)
for (const line of warnings) console.log(`WARN  ${line}`)
process.exitCode = failures.length ? 1 : 0
