import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const spa = ["/calculators", "/calculator", "/neighborhoods", "/about", "/consultation"];
const staticRoutes = ["/blog", "/blog/naca-homebuying-dallas-fort-worth", "/blog/homes-for-heroes-north-texas", "/blog/how-to-buy-home-garland-tx", "/programs", "/programs/naca", "/programs/homes-for-heroes", "/areas/garland", "/calculators/affordability", "/calculators/down-payment", "/calculators/rent-vs-buy", "/privacy", "/terms", "/accessibility"];
const file = (route) => `recovered-manus${route}/index.html`;

test("all required static routes and discovery files exist", () => { for (const route of staticRoutes) assert.ok(existsSync(file(route)), route); assert.ok(existsSync("recovered-manus/robots.txt")); assert.ok(existsSync("recovered-manus/sitemap.xml")); });
test("bundle repairs navigation, intake, calculators, and market data", () => { const b = readFileSync("recovered-manus/assets/index-BT_aM9Xt.js", "utf8"); for (const pattern of [/href:"\/programs",label:"Programs"/, /x\.startsWith\("\/programs"\)/, /fetch\("\/api\/consultation"/, /name:"Garland"/, /href:"\/calculators\/affordability"/]) assert.match(b, pattern); for (const fake of ["Eastwood Commons", "Riverside Heights", "Midtown Corridor", "Greenfield Park", "Northside Village", "Westgate District"]) assert.doesNotMatch(b, new RegExp(fake)); });
test("static pages include SEO, navigation, and legal notices", () => { for (const route of staticRoutes) { const p = readFileSync(file(route), "utf8"); assert.match(p, /<link rel="canonical"/); assert.match(p, /<meta property="og:title"/); assert.equal((p.match(/<h1/g) || []).length, 1, route); assert.match(p, /TREC Information About Brokerage Services/); assert.match(p, /TREC Consumer Protection Notice/); assert.match(p, /href="\/programs"/); assert.match(p, /href="\/privacy"/); } });
test("Vercel rewrites only SPA routes", () => { const v = JSON.parse(readFileSync("vercel.json", "utf8")); const r = new Map(v.rewrites.map((x) => [x.source, x.destination])); for (const route of spa) assert.equal(r.get(route), "/index.html"); for (const route of staticRoutes) assert.ok(!r.has(route)); });
test("sitemap and robots cover key routes", () => { const s = readFileSync("recovered-manus/sitemap.xml", "utf8"), r = readFileSync("recovered-manus/robots.txt", "utf8"); assert.match(r, /Sitemap: https:\/\/daffordablehomes-platform\.vercel\.app\/sitemap\.xml/); for (const route of ["/programs/naca", "/areas/garland", "/blog/how-to-buy-home-garland-tx", "/privacy"]) assert.match(s, new RegExp(route.replaceAll("/", "\\/"))); });
test("consultation API reuses production delivery configuration and fails closed", () => { const a = readFileSync("api/consultation.js", "utf8"); for (const env of ["LEAD_WEBHOOK_URL", "PROGRAM_LEAD_WEBHOOK_URL", "GHL_PROGRAM_LEAD_WEBHOOK_URL"]) assert.match(a, new RegExp(env)); assert.match(a, /status\(503\)/); assert.match(a, /AbortSignal\.timeout\(8_000\)/); });
test("every generated internal link resolves to a file or explicit SPA rewrite", () => {
  const html = [];
  const walk = (directory) => { for (const entry of readdirSync(directory, { withFileTypes: true })) { const path = join(directory, entry.name); if (entry.isDirectory()) walk(path); else if (entry.name.endsWith(".html")) html.push(path); } };
  walk("recovered-manus");
  const rewrites = new Set(JSON.parse(readFileSync("vercel.json", "utf8")).rewrites.map(({ source }) => source));
  const missing = [];
  for (const source of html) for (const match of readFileSync(source, "utf8").matchAll(/href="(\/[^"]*)"/g)) { const route = match[1].split(/[?#]/)[0]; if (route.startsWith("//")) continue; const target = route === "/" ? "recovered-manus/index.html" : join("recovered-manus", route, "index.html"); if (!existsSync(target) && !existsSync(join("recovered-manus", route)) && !rewrites.has(route)) missing.push({ source, route }); }
  assert.deepEqual(missing, []);
});
test("blog index uses the premium image-led editorial system", () => {
  const page = readFileSync(file("/blog"), "utf8");
  for (const marker of ["journal-hero", "journal-principles", "lead-story", "story-grid", "journal-note", "editorial-cta"]) assert.match(page, new RegExp(`class="[^"]*${marker}`));
  assert.equal((page.match(/class="story-card"/g) || []).length, 2);
  for (const image of ["debra-allen-primary-about.webp", "couple-consultation_25d3a592.webp", "hero-family_b1fab939.webp", "home-keys-moment_20083d77.webp", "debra-allen-advisor-desk.webp"]) assert.match(page, new RegExp(image.replace(".", "\\.")));
  assert.doesNotMatch(page, /neighborhood-community_101d8dfe/);
});
test("every article has premium editorial structure, meaningful imagery, and authorship", () => {
  for (const route of staticRoutes.filter((route) => route.startsWith("/blog/"))) {
    const page = readFileSync(file(route), "utf8");
    for (const marker of ["article-masthead", "article-meta", "article-hero-media", "article-toc", "article-break", "advisor-rail", "article-related", "editorial-cta"]) assert.match(page, new RegExp(`class="[^"]*${marker}`), `${route}: ${marker}`);
    assert.match(page, /By Debra Allen, REALTOR®/);
    assert.match(page, /Reviewed August 9, 2026/);
    assert.match(page, /<script type="application\/ld\+json">/);
    assert.ok((page.match(/<img /g) || []).length >= 3, `${route}: expected at least three meaningful images`);
    const alternatives = [...page.matchAll(/<img [^>]*alt="([^"]*)"[^>]*>/g)].map((image) => image[1].trim()).filter(Boolean);
    assert.ok(alternatives.length >= 3, `${route}: expected descriptive alternatives for editorial images`);
    assert.doesNotMatch(page, /neighborhood-community_101d8dfe/);
  }
});
test("editorial CSS includes responsive and reduced-motion treatments", () => {
  const css = readFileSync("recovered-manus/blog.css", "utf8");
  for (const selector of [".journal-hero", ".lead-story", ".article-masthead", ".article-layout", ".advisor-rail", ".article-related"]) assert.match(css, new RegExp(selector.replace(".", "\\.")));
  assert.match(css, /@media\(max-width:820px\)/);
  assert.match(css, /@media\(max-width:620px\)/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
});
