import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"

const read = (file) => readFileSync(file, "utf8")

test("home and blog pages publish page-level, answer-ready schema", () => {
  const home = read("apps/web/app/page.tsx")
  const blog = read("apps/web/app/blog/page.tsx")

  assert.match(home, /"@type": "WebPage"/)
  assert.match(home, /"@type": "FAQPage"/)
  assert.match(home, /JSON\.stringify\(homePageJsonLd\)\.replace\(\/</)
  assert.match(blog, /"@type": "CollectionPage"/)
  assert.match(blog, /"@type": "ItemList"/)
  assert.match(blog, /itemListElement: articles\.map/)
  assert.match(blog, /Homebuyer Guides for North Texas/)
  // Public wording is plain consumer language; "field guide" read as military
  // kit rather than as help for someone buying a house.
  assert.doesNotMatch(blog, /Field Guides|field guides</)
})

test("resource hubs send readers directly to canonical destinations", () => {
  const resources = read("apps/web/app/resources/page.tsx")

  assert.match(resources, /alternates: \{ canonical: "\/resources" \}/)
  assert.doesNotMatch(resources, /href: "\/resources\/calculators\//)
  assert.doesNotMatch(resources, /href: "\/naca"/)
  // NACA is only ever linked at its canonical route, never the legacy alias.
  if (/naca/i.test(resources)) {
    assert.doesNotMatch(resources, /href: "\/naca"/)
  }
  for (const href of [
    "/calculators/mortgage-payment",
    "/calculators/affordability",
    "/calculators/closing-costs",
    "/calculators/down-payment",
    "/calculators/rent-vs-buy",
    "/calculators",
    "/first-time-buyers",
    "/start",
    "/programs",
    "/blog",
  ]) {
    assert.match(resources, new RegExp(`href: "${href}"`.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))
  }
})

test("the sitemap does not fabricate a new modification date for every public route", () => {
  const sitemap = read("apps/web/app/sitemap.ts")

  assert.match(sitemap, /import \{ listArticles \} from "@\/lib\/blog\/source"/)
  assert.doesNotMatch(sitemap, /new Date\(\)/)
  assert.match(sitemap, /lastModified: article\.reviewedAt \?\? article\.publishedAt/)
})

test("the global site entity identifies language, topical focus, and the verified logo asset", () => {
  const layout = read("apps/web/app/layout.tsx")

  assert.match(layout, /inLanguage: "en-US"/)
  assert.match(layout, /Homebuyer education/)
  assert.match(layout, /daffordable-homes-official-logo\.png/)
})
