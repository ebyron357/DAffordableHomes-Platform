/**
 * Browser QA harness.
 *
 * Crawls the running application with a real Chromium browser and produces the
 * evidence the release checklist requires: route status codes, internal-link
 * resolution, canonical tags, structured data, accessibility structure,
 * console errors, and responsive screenshots.
 *
 * Usage:
 *   node scripts/qa/site-audit.mjs --base http://127.0.0.1:3111 --out qa-evidence
 *
 * Exit code is non-zero when any check fails, so this can gate a release.
 */

import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

import { chromium } from "playwright"

const args = process.argv.slice(2)
const argOf = (name, fallback) => {
  const index = args.indexOf(`--${name}`)
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback
}

const BASE = (argOf("base", "http://127.0.0.1:3111")).replace(/\/$/, "")
const OUT = path.resolve(argOf("out", "qa-evidence"))
const SHOOT = args.includes("--screenshots")

const VIEWPORTS = [
  { name: "mobile-375", width: 375, height: 812 },
  { name: "mobile-430", width: 430, height: 932 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "laptop-1024", width: 1024, height: 768 },
  { name: "desktop-1440", width: 1440, height: 900 },
]

/** Pages that get full visual + responsive QA. */
const VISUAL_ROUTES = [
  "/",
  "/resources",
  "/calculators",
  "/blog",
  "/blog/naca-homebuying-dallas-fort-worth",
  "/blog/homes-for-heroes-north-texas",
  "/blog/how-to-buy-home-garland-tx",
  "/programs",
  "/areas/garland",
  "/consultation",
  "/about",
  "/contact",
  "/start",
]

const ARTICLE_ROUTES = VISUAL_ROUTES.filter((route) => route.startsWith("/blog/"))

/**
 * Content and image integrity contract.
 *
 * A previous audit reported a clean run while the homepage visibly carried
 * bracketed placeholder copy and empty image wells, because every check was
 * structural — status codes, canonicals, landmarks, heading order. None of
 * them looked at what a visitor actually reads, or at whether an <img> decoded.
 * These do.
 */

/** Rendered text that must never appear on a public page. */
const FORBIDDEN_TEXT = [
  "Placeholder",
  "[Price",
  "[Property Address",
  "[City, TX]",
  "[X] Beds",
  "[Y] Baths",
  "[Sq Ft]",
  "Lorem ipsum",
  "TODO",
  "TBD",
  "Active MLS Feed Integration Point",
]

/** Approved assets that must actually render on the routes that use them. */
const REQUIRED_IMAGES = {
  "/": [
    "black-family-home-pexels-7114188",
    "debra-allen-primary-about",
    "daffordable-homes-official-logo",
  ],
}

/** Retired asset that must not reappear anywhere. */
const RETIRED_ASSETS = ["dah-logo_ff042b7b", "manus-storage/dah-logo"]

const failures = []
const notes = []
const record = (ok, label, detail = "") => {
  if (!ok) failures.push(`${label}${detail ? ` — ${detail}` : ""}`)
  return ok
}

async function routesFromSitemap() {
  const response = await fetch(`${BASE}/sitemap.xml`)
  if (!response.ok) throw new Error(`sitemap.xml returned ${response.status}`)
  const xml = await response.text()
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => match[1])
    .map((url) => new URL(url).pathname)
}

/* ------------------------------------------------------------------ */

async function main() {
  await mkdir(OUT, { recursive: true })
  // PLAYWRIGHT_BROWSERS_PATH points at a pre-installed Chromium; honour an
  // explicit override so this runs unchanged in CI.
  const executablePath = process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium"
  const browser = await chromium.launch({ executablePath })

  const sitemapRoutes = await routesFromSitemap()
  record(
    ARTICLE_ROUTES.every((route) => sitemapRoutes.includes(route)),
    "sitemap lists all three preserved article URLs",
  )
  notes.push(`sitemap routes: ${sitemapRoutes.length}`)

  const crawlRoutes = [...new Set([...sitemapRoutes, ...VISUAL_ROUTES, "/faq", "/first-time-buyers"])]

  /* -------------------- route crawl + console review -------------- */

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const consoleErrors = []
  const routeReport = []
  const internalLinks = new Set()

  for (const route of crawlRoutes) {
    const page = await context.newPage()
    const pageErrors = []
    page.on("console", (message) => {
      if (message.type() !== "error") return
      // The public CSP carries `upgrade-insecure-requests`. Against a plain-http
      // test origin Chromium upgrades same-origin prefetches to https://127.0.0.1,
      // which nothing serves locally. That is a property of the rig, not the
      // page, so it is recorded as a note rather than a failure. On an https
      // origin the same message would be a real error and still fails the run.
      if (BASE.startsWith("http://") && /ERR_SSL_PROTOCOL_ERROR/.test(message.text())) {
        notes.push(`${route}: ignored upgrade-insecure-requests artifact on http test origin — ${message.text()}`)
        return
      }
      pageErrors.push(`${route}: ${message.text()}`)
    })
    page.on("pageerror", (error) => pageErrors.push(`${route}: ${error.message}`))

    const response = await page.goto(`${BASE}${route}`, { waitUntil: "load" })
    const status = response?.status() ?? 0
    record(status === 200, `route ${route} returns 200`, `got ${status}`)

    // An image that has not loaded reports naturalWidth 0 exactly like a broken
    // one, and most of this site's images are lazy and below the fold. Walking
    // the page is not enough on its own — the walk can finish before the last
    // requests settle — so every image is also switched to eager and awaited.
    // After this, naturalWidth 0 means the image genuinely failed to decode.
    await page.evaluate(async () => {
      // `scroll-behavior: smooth` is set on <html>, so scrollTo() animates and
      // a fixed wait lands mid-animation on a long page. Disable it for the
      // duration of the measurement and restore it afterwards.
      const root = document.documentElement
      const previousBehavior = root.style.scrollBehavior
      root.style.scrollBehavior = "auto"
      const step = window.innerHeight
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y)
        await new Promise((resolve) => setTimeout(resolve, 80))
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
              // Never hang the audit on one slow asset; a still-incomplete
              // image is reported as broken, which is the safe direction.
              setTimeout(resolve, 8000)
            }),
        ),
      )
    })
    await page.waitForTimeout(250)

    const data = await page.evaluate(() => {
      const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null
      const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')]
        .map((node) => {
          try {
            return JSON.parse(node.textContent ?? "{}")
          } catch {
            return { __invalid: true }
          }
        })
      const h1s = [...document.querySelectorAll("h1")].map((node) => node.textContent?.trim() ?? "")
      const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((node) =>
        Number(node.tagName.slice(1)),
      )
      // An explicit alt="" is the correct WCAG marker for a decorative image
      // (the site logo sits next to visible brand text). Only a *missing* alt
      // attribute is a defect.
      const imagesMissingAlt = [...document.querySelectorAll("img")].filter(
        (img) => img.getAttribute("alt") === null,
      ).length
      const allHrefs = [...document.querySelectorAll("a[href]")].map(
        (a) => a.getAttribute("href") ?? "",
      )
      const links = allHrefs.filter((href) => href.startsWith("/"))
      // Behavioural counterpart to the render-time allowlist: whatever a
      // renderer *meant* to emit, no anchor on a served page may carry a
      // scheme that executes script, embeds a document, or silently leaves
      // the origin. This catches a render site the unit tests do not know
      // about, so it mirrors `toSafeHref` rather than approximating it.
      //
      // Two traps, both of which a looser check walks into:
      //  - "/\evil.example" starts with "/" but the browser normalises the
      //    backslash to a slash, making it protocol-relative.
      //  - resolving "//evil.example" against the page URL yields an
      //    "https:" protocol, so a scheme test on the *resolved* URL calls
      //    an off-origin destination safe. The raw value has to be judged
      //    first, and absolutes parsed with no base.
      const allowedSchemes = ["https:", "mailto:", "tel:"]
      const unsafeHrefs = allHrefs.filter((href) => {
        const value = href.trim()
        if (!value) return false
        if (value.startsWith("#")) return false
        const normalised = value.replace(/\\/g, "/").replace(/[\u0000-\u001f\u007f]/g, "")
        if (normalised.startsWith("/")) return normalised.startsWith("//")
        try {
          return !allowedSchemes.includes(new URL(value).protocol)
        } catch {
          return true
        }
      })
      const landmarks = {
        header: document.querySelectorAll("header").length,
        nav: document.querySelectorAll("nav").length,
        main: document.querySelectorAll("main").length,
        footer: document.querySelectorAll("footer").length,
      }
      const inputsMissingLabel = [...document.querySelectorAll("input,select,textarea")].filter(
        (field) => {
          if (field.type === "hidden" || field.type === "submit") return false
          const id = field.getAttribute("id")
          const labelled =
            (id && document.querySelector(`label[for="${CSS.escape(id)}"]`)) ||
            field.closest("label") ||
            field.getAttribute("aria-label") ||
            field.getAttribute("aria-labelledby")
          return !labelled
        },
      ).length
      const nestedInteractive = [...document.querySelectorAll("a,button")].filter((node) =>
        node.querySelector("a,button"),
      ).length
      // `innerText` is what a sighted visitor reads — it excludes <script>,
      // <style> and display:none, so a match here is copy that is genuinely on
      // screen rather than a string that happens to be in the document.
      const visibleText = document.body.innerText
      // `naturalWidth` is 0 for an image that failed to decode *and* for one
      // that has not loaded yet, so the caller scrolls the page first.
      const images = [...document.querySelectorAll("img")].map((img) => ({
        src: img.currentSrc || img.src,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        alt: img.getAttribute("alt"),
        loading: img.getAttribute("loading"),
      }))
      return {
        canonical,
        jsonLd,
        h1s,
        headings,
        imagesMissingAlt,
        links,
        unsafeHrefs,
        landmarks,
        inputsMissingLabel,
        nestedInteractive,
        visibleText,
        images,
        title: document.title,
        description:
          document.querySelector('meta[name="description"]')?.getAttribute("content") ?? null,
      }
    })

    for (const link of data.links) internalLinks.add(link.split(/[?#]/)[0])

    record(data.h1s.length === 1, `${route} has exactly one <h1>`, `found ${data.h1s.length}`)
    record(data.imagesMissingAlt === 0, `${route} images all have alt text`, `${data.imagesMissingAlt} missing`)

    /* ---- visible placeholder copy ---- */
    const foundPlaceholders = FORBIDDEN_TEXT.filter((needle) => data.visibleText.includes(needle))
    record(
      foundPlaceholders.length === 0,
      `${route} shows no placeholder copy`,
      foundPlaceholders.join(", "),
    )

    /* ---- broken images ---- */
    const brokenImages = data.images.filter((img) => img.naturalWidth === 0)
    record(
      brokenImages.length === 0,
      `${route} has no broken images (naturalWidth > 0)`,
      brokenImages.map((img) => img.src).slice(0, 3).join(" | "),
    )

    /* ---- approved assets actually render ---- */
    for (const asset of REQUIRED_IMAGES[route] ?? []) {
      const match = data.images.find((img) => decodeURIComponent(img.src).includes(asset))
      record(
        Boolean(match) && match.naturalWidth > 0,
        `${route} renders the approved asset ${asset}`,
        match ? `naturalWidth=${match.naturalWidth}` : "not present",
      )
    }

    /* ---- retired assets stay retired ---- */
    const retired = data.images
      .map((img) => decodeURIComponent(img.src))
      .filter((src) => RETIRED_ASSETS.some((needle) => src.includes(needle)))
    record(retired.length === 0, `${route} does not serve a retired logo asset`, retired.join(" | "))
    record(data.landmarks.main === 1, `${route} has a single <main> landmark`)
    record(data.landmarks.footer >= 1, `${route} has a footer landmark`)
    record(data.inputsMissingLabel === 0, `${route} form fields are labelled`, `${data.inputsMissingLabel} unlabelled`)
    record(data.nestedInteractive === 0, `${route} has no nested interactive controls`, `${data.nestedInteractive} found`)
    record(
      data.unsafeHrefs.length === 0,
      `${route} anchors all use an allowlisted scheme`,
      data.unsafeHrefs.slice(0, 3).join(" | "),
    )
    record(Boolean(data.canonical), `${route} declares a canonical URL`)
    record(
      !data.jsonLd.some((entry) => entry.__invalid),
      `${route} JSON-LD parses`,
    )

    // Heading hierarchy must not skip a level.
    let previous = 0
    let skipped = null
    for (const level of data.headings) {
      if (previous && level > previous + 1) skipped = `h${previous} -> h${level}`
      previous = level
    }
    record(!skipped, `${route} heading hierarchy has no skipped level`, skipped ?? "")

    routeReport.push({ route, status, ...data, jsonLd: data.jsonLd.map((e) => e["@type"]) })
    consoleErrors.push(...pageErrors)
    await page.close()
  }

  record(consoleErrors.length === 0, "no browser console errors", consoleErrors.slice(0, 5).join(" | "))

  /* -------------------- CMS publishing contract ------------------- */

  // The owner requirement this encodes: publishing an article must not need a
  // route file and must not need a deploy. A static read of the repository can
  // show the route is dynamic; only this can show that the *served* article
  // pages are all coming through that one route.
  {
    const { readdirSync, readFileSync } = await import("node:fs")

    // Exactly one route file under app/blog, and it is the [slug] segment.
    const blogDir = readdirSync("apps/web/app/blog", { withFileTypes: true })
    const perArticleRoutes = blogDir
      .filter((entry) => entry.isDirectory() && entry.name !== "[slug]")
      .map((entry) => entry.name)
    record(
      perArticleRoutes.length === 0,
      "no per-article route files exist under app/blog",
      perArticleRoutes.join(", "),
    )
    record(
      blogDir.some((entry) => entry.isDirectory() && entry.name === "[slug]"),
      "the CMS article route is the dynamic [slug] segment",
    )

    // Every article URL in the sitemap is served by that one route, so a new
    // article published in the Studio is live without a code change.
    const articleRoutes = sitemapRoutes.filter((route) => route.startsWith("/blog/"))
    record(articleRoutes.length > 0, "the sitemap lists CMS-driven article URLs")
    for (const route of articleRoutes) {
      const entry = routeReport.find((item) => item.route === route)
      record(Boolean(entry) && entry.status === 200, `CMS article ${route} is served by /blog/[slug]`)
    }

    // The route renders on demand, so a publish webhook invalidation takes
    // effect without a rebuild.
    const routeSource = readFileSync("apps/web/app/blog/[slug]/page.tsx", "utf8")
    record(routeSource.includes('export const dynamic = "force-dynamic"'), "the article route renders on demand")
    // The route's comment explains at length *why* generateStaticParams is not
    // used, so this has to look for the export rather than for the word.
    record(
      !/export\s+(async\s+)?function\s+generateStaticParams/.test(routeSource),
      "the article route does not pin a build-time slug set",
    )

    // Draft preview and publish revalidation are wired.
    for (const [file, label] of [
      ["apps/web/app/api/draft-mode/enable/route.ts", "draft preview enable endpoint exists"],
      ["apps/web/app/api/draft-mode/disable/route.ts", "draft preview disable endpoint exists"],
      ["apps/web/app/api/revalidate/route.ts", "publish revalidation webhook exists"],
    ]) {
      let present = true
      try {
        readFileSync(file, "utf8")
      } catch {
        present = false
      }
      record(present, label)
    }
  }

  /* -------------------- public language ---------------------------- */

  // "Field guide" was removed from customer-facing copy. Asserted on rendered
  // text so it cannot come back through the CMS either.
  for (const route of ["/blog", ...ARTICLE_ROUTES, "/resources", "/consultation"]) {
    const entry = routeReport.find((item) => item.route === route)
    if (!entry) continue
    record(
      !/field guide/i.test(entry.visibleText),
      `${route} uses plain consumer language, not "field guide"`,
    )
  }

  /* -------------------- canonical + structured data --------------- */

  for (const route of ARTICLE_ROUTES) {
    const entry = routeReport.find((item) => item.route === route)
    if (!entry) continue
    const expected = `${BASE}${route}`.replace(BASE, "")
    record(
      (entry.canonical ?? "").endsWith(expected),
      `${route} canonical points at itself`,
      `canonical=${entry.canonical}`,
    )
    for (const type of ["Article", "BreadcrumbList", "FAQPage"]) {
      record(entry.jsonLd.includes(type), `${route} emits ${type} JSON-LD`)
    }
  }

  /* -------------------- sitemap freshness ------------------------- */

  // The sitemap used to stamp every route with `new Date()`, telling search
  // engines that all 33 URLs changed on every deploy. The replacement is
  // guarded in the unit tests by a regex asserting `new Date()` is absent —
  // which cannot show the new value is *right*: any other build-time source
  // would satisfy it just as well. This compares the served sitemap against
  // the date each article publishes about itself, so two independent surfaces
  // have to agree on a real content date before this passes.
  {
    const xml = await (await fetch(`${BASE}/sitemap.xml`)).text()
    const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => {
      const block = match[1]
      const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1] ?? ""
      const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] ?? null
      return { path: new URL(loc).pathname, lastmod }
    })

    // Derived from the sitemap, never from the hard-coded visual-QA list.
    // `sitemap.ts` dates every article `listArticles()` returns, so pinning
    // this to the three preserved slugs would fail the moment a fourth article
    // is published in the CMS — the no-deploy publish path this whole PR
    // exists to provide. It would also mean that fourth article never got the
    // date-parity assertion below.
    const isArticlePath = (path) => path.startsWith("/blog/")
    const articlePaths = entries.map((entry) => entry.path).filter(isArticlePath)
    const stamped = entries.filter((entry) => entry.lastmod)

    record(
      stamped.length > 0 && stamped.every((entry) => isArticlePath(entry.path)),
      "only article routes carry a lastmod",
      stamped
        .map((entry) => entry.path)
        .filter((path) => !isArticlePath(path))
        .join(" | "),
    )

    record(
      articlePaths.length > 0 && articlePaths.every((path) => stamped.some((entry) => entry.path === path)),
      "every article in the sitemap carries a lastmod",
      articlePaths.filter((path) => !stamped.some((entry) => entry.path === path)).join(" | "),
    )

    for (const route of articlePaths) {
      const entry = entries.find((item) => item.path === route)
      if (!entry) continue

      const html = await (await fetch(`${BASE}${route}`)).text()
      let published = null
      for (const found of html.matchAll(
        /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
      )) {
        try {
          const parsed = JSON.parse(found[1])
          if (parsed["@type"] === "Article") published = parsed.dateModified ?? parsed.datePublished
        } catch {
          // A JSON-LD block that does not parse is already recorded as a
          // failure by the crawl above; do not double-report it here.
        }
      }

      record(
        Boolean(entry.lastmod) &&
          Boolean(published) &&
          entry.lastmod.slice(0, 10) === String(published).slice(0, 10),
        `${route} sitemap lastmod matches the date the article publishes`,
        `sitemap=${entry.lastmod} article=${published}`,
      )
    }
  }

  /* -------------------- internal link validation ------------------ */

  const linkResults = []
  for (const link of [...internalLinks].sort()) {
    if (link.startsWith("/api/")) continue
    const response = await fetch(`${BASE}${link}`, { redirect: "manual" })
    const ok = response.status === 200 || (response.status >= 300 && response.status < 400)
    record(ok, `internal link ${link} resolves`, `status ${response.status}`)
    linkResults.push({ link, status: response.status })
  }
  notes.push(`internal links checked: ${linkResults.length}`)

  /* -------------------- 404 behaviour ----------------------------- */

  const missing = await fetch(`${BASE}/blog/this-article-does-not-exist`)
  record(missing.status === 404, "unknown article slug returns a real 404", `status ${missing.status}`)

  /* -------------------- served security headers ------------------- */

  // Asserted against the real response, not the config file. Next keeps the
  // last value for a duplicated header key, so a catch-all rule can silently
  // replace a more specific one — which a config-text assertion cannot see.
  {
    const publicHeaders = await fetch(`${BASE}/blog`, { redirect: "manual" })
    const publicCsp = publicHeaders.headers.get("content-security-policy") ?? ""
    record(publicCsp.length > 0, "public pages send a Content-Security-Policy")
    record(
      !publicCsp.includes("unsafe-eval"),
      "public CSP does not allow unsafe-eval",
      publicCsp,
    )

    const studioHeaders = await fetch(`${BASE}/studio`, { redirect: "manual" })
    const studioCsp = studioHeaders.headers.get("content-security-policy") ?? ""
    record(
      studioCsp.includes("unsafe-eval") && studioCsp.includes("sanity.io"),
      "/studio receives the Studio CSP, not the public one",
      studioCsp,
    )
    record(
      (studioHeaders.headers.get("x-robots-tag") ?? "").includes("noindex"),
      "/studio is marked noindex",
    )
  }

  /* -------------------- robots ------------------------------------ */

  const robots = await fetch(`${BASE}/robots.txt`)
  const robotsBody = await robots.text()
  record(robots.status === 200, "robots.txt served")
  record(/Sitemap:\s*https:\/\/daffordablehomes\.com\/sitemap\.xml/.test(robotsBody), "robots.txt points at the canonical sitemap")
  record(/Disallow:\s*\/studio/.test(robotsBody), "robots.txt disallows /studio")

  /* -------------------- consultation CTA navigation --------------- */

  {
    const page = await context.newPage()
    await page.goto(`${BASE}/blog/how-to-buy-home-garland-tx`, { waitUntil: "load" })
    // Scope to the article body so this tests the in-article CTA, not the
    // site header's button.
    const cta = page
      .locator("main")
      .getByRole("link", { name: /book consultation/i })
      .last()
    await cta.click()
    await page.waitForURL(/\/consultation$/, { timeout: 15000 }).catch(() => {})
    record(
      new URL(page.url()).pathname === "/consultation",
      "article consultation CTA navigates to /consultation",
      page.url(),
    )
    await page.close()
  }

  /* -------------------- keyboard focus ---------------------------- */

  {
    const page = await context.newPage()
    await page.goto(`${BASE}/blog`, { waitUntil: "load" })
    await page.keyboard.press("Tab")
    const first = await page.evaluate(() => {
      const active = document.activeElement
      if (!active) return null
      const style = getComputedStyle(active)
      return {
        text: active.textContent?.trim().slice(0, 40) ?? "",
        outline: style.outlineWidth,
        boxShadow: style.boxShadow,
      }
    })
    record(
      Boolean(first && (first.outline !== "0px" || first.boxShadow !== "none")),
      "first tab stop has a visible focus indicator",
      JSON.stringify(first),
    )
    record(/skip to main content/i.test(first?.text ?? ""), "first tab stop is the skip link", first?.text ?? "")
    await page.close()
  }

  await context.close()

  /* -------------------- responsive QA + screenshots --------------- */

  const responsive = []
  for (const viewport of VIEWPORTS) {
    const viewportContext = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
    })
    for (const route of VISUAL_ROUTES) {
      const page = await viewportContext.newPage()
      await page.goto(`${BASE}${route}`, { waitUntil: "load" })

      const overflow = await page.evaluate(
        (width) => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: width,
          culprits: [...document.querySelectorAll("body *")]
            .filter((node) => node.getBoundingClientRect().right > width + 1)
            .slice(0, 3)
            .map((node) => `${node.tagName.toLowerCase()}.${String(node.className).slice(0, 40)}`),
        }),
        viewport.width,
      )

      const ok = overflow.scrollWidth <= viewport.width + 1
      record(
        ok,
        `${route} @ ${viewport.width}px has no horizontal overflow`,
        `scrollWidth=${overflow.scrollWidth} culprits=${overflow.culprits.join(", ")}`,
      )

      // Touch targets on the narrowest viewport.
      if (viewport.width === 375) {
        // WCAG 2.2 SC 2.5.8 exempts links rendered inline within a sentence and
        // targets that are off-screen until focused (the skip link). Everything
        // else must clear 24px.
        const small = await page.evaluate(() =>
          [...document.querySelectorAll("a,button,summary")]
            .filter((node) => {
              const rect = node.getBoundingClientRect()
              if (rect.width === 0 || rect.height === 0 || rect.height >= 24) return false
              if (node.closest(".sr-only") || node.classList.contains("sr-only")) return false
              // Inline-in-text exception: the link sits inside flowing prose.
              const parent = node.parentElement
              if (!parent) return false
              const inProse = ["P", "LI", "SPAN", "TD", "FIGCAPTION"].includes(parent.tagName)
              const hasSiblingText = (parent.textContent ?? "").trim() !== (node.textContent ?? "").trim()
              return !(inProse && hasSiblingText)
            })
            .slice(0, 6)
            .map((node) => `${node.tagName.toLowerCase()}:${node.textContent?.trim().slice(0, 24)}`),
        )
        record(
          small.length === 0,
          `${route} @375px standalone targets meet the 24px minimum`,
          small.join(" | "),
        )
      }

      if (SHOOT) {
        const dir = path.join(OUT, "screenshots", viewport.name)
        await mkdir(dir, { recursive: true })
        const name = route === "/" ? "home" : route.replace(/^\//, "").replaceAll("/", "_")
        await page.screenshot({
          path: path.join(dir, `${name}.png`),
          fullPage: route.startsWith("/blog/") ? false : true,
        })
      }

      responsive.push({ route, viewport: viewport.name, ...overflow, ok })
      await page.close()
    }
    await viewportContext.close()
  }

  await browser.close()

  /* -------------------- report ------------------------------------ */

  const summary = {
    base: BASE,
    generatedFrom: "scripts/qa/site-audit.mjs",
    routesCrawled: routeReport.length,
    internalLinksChecked: linkResults.length,
    viewports: VIEWPORTS.map((v) => v.name),
    consoleErrors,
    failures,
    notes,
    routes: routeReport.map(({ links, headings, ...rest }) => ({
      ...rest,
      internalLinkCount: links.length,
      headingCount: headings.length,
    })),
    internalLinks: linkResults,
    responsive,
  }

  await writeFile(path.join(OUT, "site-audit.json"), `${JSON.stringify(summary, null, 2)}\n`)

  console.log(`Routes crawled:        ${routeReport.length}`)
  console.log(`Internal links:        ${linkResults.length}`)
  console.log(`Console errors:        ${consoleErrors.length}`)
  console.log(`Responsive checks:     ${responsive.length}`)
  console.log(`Failures:              ${failures.length}`)
  for (const failure of failures) console.log(`  FAIL ${failure}`)
  for (const note of notes) console.log(`  note ${note}`)

  process.exit(failures.length === 0 ? 0 : 1)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
