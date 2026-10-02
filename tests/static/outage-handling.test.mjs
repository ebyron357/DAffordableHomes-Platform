import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"

/**
 * Honest behaviour when the Content Lake cannot be read.
 *
 * `listArticles()` distinguishes three states: `ok`, `stale` (serving the last
 * good response) and `unavailable` (nothing cached). Callers that destructure
 * only `articles` silently turn the third into "there are no articles", which is
 * indistinguishable from an editorial decision. These assertions pin the callers
 * that were doing exactly that.
 */

const read = (file) => readFileSync(file, "utf8")

test("the homepage passes the read state through instead of dropping it", () => {
  const page = read("apps/web/app/page.tsx")

  assert.match(
    page,
    /latestArticlesState=\{articles\.state\}/,
    "the homepage must hand the read state to the knowledge section",
  )
})

test("the homepage renders an outage rather than an empty guide list", () => {
  const home = read("apps/web/components/home/figma-home-page.tsx")

  assert.match(home, /state: ReadState/, "KnowledgeBase must receive the read state")
  assert.match(
    home,
    /state\.status === "unavailable"/,
    "an unavailable read must be rendered, not folded into a length check",
  )
  assert.match(
    home,
    /isn&apos;t loading right now/,
    "the outage copy must say the guides are not loading, not imply none exist",
  )

  // The bug was that the section vanished when the array was empty. The
  // unavailable branch has to be decided before that check, not after it.
  assert.ok(
    home.indexOf('state.status === "unavailable"') < home.indexOf("articles.length > 0"),
    "the unavailable state must be checked before the empty-list check",
  )
})

test("the sitemap refuses to publish without article URLs during an outage", () => {
  const sitemap = read("apps/web/app/sitemap.ts")

  assert.match(sitemap, /const \{ articles, state \} = await listArticles\(\)/)
  assert.match(
    sitemap,
    /if \(state\.status === "unavailable"\) \{\s*throw new Error\(/,
    "an unavailable read must fail the route so the last good sitemap stays authoritative",
  )

  // A stale read serves the last good article set, so the document is complete
  // and must still be published.
  assert.doesNotMatch(
    sitemap,
    /state\.status === "stale"[^\n]*throw/,
    "a stale read is complete and must not fail the sitemap",
  )

  assert.ok(
    sitemap.indexOf("throw new Error") < sitemap.indexOf("const staticEntries"),
    "the guard must run before the document is assembled",
  )
})

test("the revalidate webhook accepts every type the article queries dereference", () => {
  const route = read("apps/web/app/api/revalidate/route.ts")
  const queries = read("apps/web/lib/blog/queries.ts")

  // These are the dereferences that make an author or category edit change
  // rendered article output.
  assert.match(queries, /"category": category->/)
  assert.match(queries, /"author": author->/)

  assert.match(
    route,
    /const REVALIDATING_TYPES = new Set\(\["article", "author", "category"\]\)/,
    "the route must accept article, author and category",
  )
  assert.match(route, /REVALIDATING_TYPES\.has\(body\?\._type \?\? ""\)/)
  assert.doesNotMatch(
    route,
    /body\?\._type !== "article"/,
    "the article-only filter is what left author and category edits stale",
  )

  // Only an article has its own page; the others clear the shared tag.
  assert.match(route, /body\?\._type === "article" \? slugOf\(body\) : null/)
})

test("the documented Sanity webhook filter matches the route", () => {
  const route = read("apps/web/app/api/revalidate/route.ts")
  const setup = read("docs/13-cms/SANITY_SETUP.md")

  const declared = route.match(/const REVALIDATING_TYPES = new Set\(\[([^\]]+)\]\)/)
  assert.ok(declared, "the route should declare its accepted types as a literal")
  const types = declared[1].split(",").map((part) => part.trim().replace(/"/g, ""))

  // A filter narrower than the route silently drops revalidations, so the two
  // must agree. This is the assertion that fails if one side is changed alone.
  for (const type of types) {
    assert.match(
      setup,
      new RegExp(`_type in \\[[^\\]]*"${type}"`),
      `the documented webhook filter must include ${type}`,
    )
  }
  assert.doesNotMatch(
    setup,
    /\| Filter \| `_type == "article"` \|/,
    "the documented filter must no longer be article-only",
  )
})
