import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { register } from "node:module";
import { test } from "node:test";
import { pathToFileURL } from "node:url";

/**
 * The full-site search, answer-engine and AI-discoverability pass (ACT-023).
 * `scripts/qa/seo-audit.mjs` checks the served build; these pin the source
 * decisions so a later change cannot quietly undo them.
 */

register("../../scripts/sanity/ts-resolver.mjs", import.meta.url);

const read = (file) => readFileSync(file, "utf8");
const WEB = "apps/web";
const load = (file) => import(pathToFileURL(`${WEB}/${file}`).href);

test("/neighborhoods, a thin duplicate of /areas, redirects there in one hop", () => {
  assert.match(read(`${WEB}/next.config.mjs`), /\{ source: '\/neighborhoods', destination: '\/areas', permanent: true \}/);
  assert.match(read(`${WEB}/app/neighborhoods/page.tsx`), /permanentRedirect\("\/areas"\)/);
  assert.doesNotMatch(read(`${WEB}/app/sitemap.ts`), /"\/neighborhoods"/);
  // Its one unique passage moved, and nothing links to the old URL.
  assert.match(read(`${WEB}/app/areas/page.tsx`), /What this site will not publish about a neighborhood/);
  for (const file of ["lib/content/homebuying-path.ts", "lib/content/next-step.ts", "lib/navigation.ts", "app/areas/page.tsx"]) {
    assert.doesNotMatch(read(`${WEB}/${file}`), /href: "\/neighborhoods"|href="\/neighborhoods"/, file);
  }
});

test("/homes and /events stay out of the index until they have real content", () => {
  const homes = read(`${WEB}/app/homes/page.tsx`);
  assert.match(homes, /isPropertySearchLive\(\)\) \? \{\} : \{ robots: \{ index: false, follow: true \} \}/);
  const events = read(`${WEB}/app/events/page.tsx`);
  assert.match(events, /hasConfirmedSessions\(\) \? \{\} : \{ robots: \{ index: false, follow: true \} \}/);
  // The sitemap lists each only under the same condition.
  const sitemap = read(`${WEB}/app/sitemap.ts`);
  assert.match(sitemap, /isPropertySearchLive\(\)\) \? \["\/homes"\] : \[\]/);
  assert.match(sitemap, /hasConfirmedSessions\(\) \? \["\/events"\] : \[\]/);
  assert.doesNotMatch(sitemap.slice(sitemap.indexOf("const staticRoutes"), sitemap.indexOf("] as const")), /"\/homes"|"\/events"/);
});

test("no event is listed until it is confirmed, and each confirmed one gets Event markup", async () => {
  const { CONFIRMED_SESSIONS } = await load("lib/content/events.ts");
  assert.deepEqual([...CONFIRMED_SESSIONS], []);
  const events = read(`${WEB}/app/events/page.tsx`);
  assert.match(events, /"@type": "Event"/);
  assert.match(events, /eventStatus: "https:\/\/schema\.org\/EventScheduled"/);
});

test("/areas answers relocation and area questions in visible FAQ text with matching markup", () => {
  const areas = read(`${WEB}/app/areas/page.tsx`);
  assert.match(areas, /<QaList items=\{AREA_FAQS\} \/>/);
  assert.match(areas, /mainEntity: AREA_FAQS\.map/);
  assert.match(areas, /How do I choose where to live in Dallas–Fort Worth\?/);
  assert.match(areas, /Can I plan a move to Dallas–Fort Worth before I arrive\?/);
  // The facts it uses are the confirmed ones, and it claims nothing else.
  assert.match(areas, /can be by phone or video/);
  assert.match(areas, /she will confirm whether she can help with that area/);
  const faqs = areas.slice(areas.indexOf("const AREA_FAQS"), areas.indexOf("const areaFaqJsonLd"));
  assert.doesNotMatch(faqs, /virtual tour|video tour|remote showing|school rating|best neighborhood|we serve|Debra serves/i);
});

test("every /start FAQ answer is in the HTML, and the FAQPage markup describes them", () => {
  const start = read(`${WEB}/components/landing/next-step-landing.tsx`);
  assert.match(start, /<p id=\{`start-faq-\$\{index\}`\} hidden=\{openFaq !== index\}>\{faq\.answer\}<\/p>/);
  assert.doesNotMatch(start, /\{openFaq === index && <p>/);
  assert.match(start, /mainEntity: FAQS\.map/);
  assert.match(start, /<JsonLd value=\{FAQ_JSON_LD\} \/>/);
});

test("the footer links every buyer-facing page that only one or two pages linked before", () => {
  const footer = read(`${WEB}/components/layout/site-footer.tsx`);
  for (const href of ["/programs/naca", "/programs/homes-for-heroes", "/calculators/down-payment", "/calculators/rent-vs-buy"]) {
    assert.ok(footer.includes(`href="${href}"`), href);
  }
});

test("/fair-housing links onward instead of ending the visit", () => {
  const page = read(`${WEB}/app/fair-housing/page.tsx`);
  for (const href of ["/equal-housing-opportunity", "/accessibility", "/about#what-debra-wont-do", "/contact"]) {
    assert.ok(page.includes(`href="${href}"`), href);
  }
  assert.match(read(`${WEB}/app/about/page.tsx`), /id="what-debra-wont-do"/);
});

test("IndexNow serves the key only when one is set, and the submit script verifies it first", async () => {
  const { indexNowKey } = await load("lib/indexnow.ts");
  assert.equal(indexNowKey({}), undefined);
  assert.equal(indexNowKey({ INDEXNOW_KEY: "short" }), undefined);
  assert.equal(indexNowKey({ INDEXNOW_KEY: "not a key!" }), undefined);
  assert.equal(indexNowKey({ INDEXNOW_KEY: " 3f2b8c1d9e0a4b7c8d6e5f4a3b2c1d0e " }), "3f2b8c1d9e0a4b7c8d6e5f4a3b2c1d0e");
  assert.ok(existsSync(`${WEB}/app/indexnow.txt/route.ts`));
  const script = read("scripts/seo/indexnow.mjs");
  assert.match(script, /does not return this key yet/);
  assert.match(script, /https:\/\/api\.indexnow\.org\/indexnow/);
  assert.match(read(".env.example"), /^INDEXNOW_KEY=$/m);
  assert.match(read("package.json"), /"seo:indexnow": "node scripts\/seo\/indexnow\.mjs"/);
});

test("robots.txt lets search and AI-search crawlers in, and keeps the API and Studio out", () => {
  const robots = read(`${WEB}/app/robots.ts`);
  assert.match(robots, /userAgent: "\*"/);
  assert.match(robots, /allow: "\/"/);
  assert.match(robots, /disallow: \["\/api\/", "\/studio", "\/studio\/"\]/);
  // No crawler-specific group that could shut out OAI-SearchBot, Bingbot or the rest.
  assert.doesNotMatch(robots, /GPTBot|OAI-SearchBot|ChatGPT-User|Bingbot|PerplexityBot|ClaudeBot|Google-Extended/);
});

test("llms.txt states the confirmed facts and names the ones an assistant must not infer", () => {
  const route = read(`${WEB}/app/llms.txt/route.ts`);
  assert.match(route, /"## Key facts"/);
  assert.match(route, /free, carries no commitment, and can happen by phone or video/);
  assert.match(route, /Do not infer or state them\./);
});

test("the Resources page title says what it is", () => {
  assert.match(read(`${WEB}/app/resources/page.tsx`), /title: "Homebuyer Planning Tools & Resources"/);
});
