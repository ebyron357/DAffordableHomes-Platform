import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { register } from "node:module";
import path from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";

/**
 * Structured data and answer-ready copy added by the 2026-10-03 SEO/AEO/GEO
 * pass. The crawl that motivated it found the pages aimed at the largest
 * queries in the keyword research — the five calculators and
 * /first-time-buyers — were the thinnest on the site, with no breadcrumbs and
 * no page-level structured data, and that BreadcrumbList existed on four
 * routes although the strategy document said every page had it.
 */

register("../../scripts/sanity/ts-resolver.mjs", import.meta.url);

const read = (file) => readFileSync(file, "utf8");
const APP = "apps/web/app";
const load = (file) => import(pathToFileURL(file).href);

const { breadcrumbJsonLd } = await load("apps/web/lib/seo.ts");
const calc = await load("apps/web/lib/calculators.ts");
const { CALCULATOR_GUIDES } = await load("apps/web/lib/content/calculator-guides.ts");
const { postalAddress, profileLinks, sameAs } = await load("apps/web/lib/business-facts.ts");

const SLUGS = ["mortgage-payment", "affordability", "closing-costs", "down-payment", "rent-vs-buy"];

/* ---- breadcrumbs ------------------------------------------------------- */

test("a breadcrumb trail becomes a BreadcrumbList Google accepts", () => {
  const ld = breadcrumbJsonLd([
    { label: "Home", href: "/" },
    { label: "Calculators", href: "/calculators" },
    { label: "Closing cost calculator" },
  ]);
  assert.equal(ld["@type"], "BreadcrumbList");
  assert.deepEqual(ld.itemListElement, [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://daffordablehomes.com" },
    { "@type": "ListItem", position: 2, name: "Calculators", item: "https://daffordablehomes.com/calculators" },
    // The last step may omit `item`; Google then uses the page's own URL.
    { "@type": "ListItem", position: 3, name: "Closing cost calculator" },
  ]);
});

test("a section label without a page is left out, and positions stay contiguous", () => {
  const ld = breadcrumbJsonLd([{ label: "Home", href: "/" }, { label: "Learn" }, { label: "First-Time Buyers" }]);
  assert.deepEqual(
    ld.itemListElement.map(({ position, name }) => [position, name]),
    [
      [1, "Home"],
      [2, "First-Time Buyers"],
    ],
  );
});

test("one step is not a trail, and only same-origin paths become URLs", () => {
  assert.equal(breadcrumbJsonLd([{ label: "Home", href: "/" }]), null);
  const ld = breadcrumbJsonLd([
    { label: "Elsewhere", href: "https://example.com/" },
    { label: "Protocol-relative", href: "//example.com/" },
    { label: "Home", href: "/" },
    { label: "Here" },
  ]);
  assert.deepEqual(
    ld.itemListElement.map((item) => item.name),
    ["Home", "Here"],
  );
});

test("the masthead emits the markup from the crumbs it renders, and only the last crumb is current", () => {
  const header = read("apps/web/components/page/page-header.tsx");
  assert.match(header, /const breadcrumbs = crumbs \? breadcrumbJsonLd\(crumbs\) : null/);
  assert.match(header, /\{breadcrumbs && <JsonLd value=\{breadcrumbs\} \/>\}/);
  assert.match(header, /aria-current=\{i === crumbs\.length - 1 \? "page" : undefined\}/);
});

/** Every .ts/.tsx file under a directory. */
function sources(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return sources(full);
    return /\.tsx?$/.test(name) ? [full] : [];
  });
}

test("no route hand-writes a BreadcrumbList the masthead would duplicate", () => {
  // Articles build theirs in lib/blog/structured-data.ts from the article
  // header, which is not the shared masthead; everything else goes through it.
  const handWritten = [...sources(APP), ...sources("apps/web/components")].filter((file) =>
    /"@type": "BreadcrumbList"/.test(read(file)),
  );
  assert.deepEqual(handWritten, []);
});

test("every interior route that uses the masthead passes it a breadcrumb trail", () => {
  const missing = sources(APP)
    .filter((file) => file.endsWith("page.tsx"))
    .filter((file) => /<PageHeader\b/.test(read(file)))
    .filter((file) => !/crumbs=/.test(read(file)));
  assert.deepEqual(missing, [], `pages with a masthead but no breadcrumbs: ${missing.join(", ")}`);
});

/* ---- calculators ------------------------------------------------------- */

test("every calculator route shows its breadcrumbs and its guide", () => {
  for (const slug of SLUGS) {
    const page = read(`${APP}/calculators/${slug}/page.tsx`);
    assert.match(page, new RegExp(`crumbs=\\{calculatorCrumbs\\("${slug}"\\)\\}`), `${slug} breadcrumbs`);
    assert.match(page, new RegExp(`<CalculatorGuide slug="${slug}" />`), `${slug} guide`);
  }
});

test("the explanations are built from the rules the arithmetic uses", () => {
  const housing = `${Math.round(calc.HOUSING_RATIO_LIMIT * 100)}%`;
  const total = `${Math.round(calc.TOTAL_DEBT_RATIO_LIMIT * 100)}%`;
  assert.match(CALCULATOR_GUIDES.affordability.answer, new RegExp(`${housing} of gross monthly income`));
  assert.match(CALCULATOR_GUIDES.affordability.answer, new RegExp(`at or below ${total}`));

  for (const value of calc.DOWN_PAYMENT_SCENARIOS) {
    assert.ok(CALCULATOR_GUIDES["down-payment"].answer.includes(`${value}%`), `down payment answer names ${value}%`);
  }
  assert.ok(
    CALCULATOR_GUIDES["mortgage-payment"].includes.some((line) =>
      line.includes(`${calc.MORTGAGE_INSURANCE_CUTOFF_PERCENT}% of the price`),
    ),
  );
  assert.match(CALCULATOR_GUIDES["rent-vs-buy"].answer, new RegExp(`${calc.RENT_VS_BUY_TERM_YEARS}-year loan`));

  // And the arithmetic really uses them: a change to a constant moves a result.
  const source = read("apps/web/lib/calculators.ts");
  for (const name of [
    "HOUSING_RATIO_LIMIT",
    "TOTAL_DEBT_RATIO_LIMIT",
    "MORTGAGE_INSURANCE_CUTOFF_PERCENT",
    "DOWN_PAYMENT_SCENARIOS",
    "RENT_VS_BUY_TERM_YEARS",
  ]) {
    assert.ok(source.split(name).length > 2, `${name} is declared and used`);
  }
  assert.doesNotMatch(source, /monthlyIncome \* 0\.\d|>= 20\b/, "no bare rule values left in the arithmetic");
});

test("no guide states a figure the calculators do not themselves apply", () => {
  // Percentages may only be the calculators' own rules. Dollar amounts, rates
  // and "typical" costs are market claims this site does not make.
  const allowed = new Set([
    Math.round(calc.HOUSING_RATIO_LIMIT * 100),
    Math.round(calc.TOTAL_DEBT_RATIO_LIMIT * 100),
    calc.MORTGAGE_INSURANCE_CUTOFF_PERCENT,
    ...calc.DOWN_PAYMENT_SCENARIOS,
  ]);
  for (const guide of Object.values(CALCULATOR_GUIDES)) {
    const text = JSON.stringify(guide);
    for (const [, value] of text.matchAll(/(\d+(?:\.\d+)?)%/g)) {
      assert.ok(allowed.has(Number(value)), `${guide.slug} states ${value}%`);
    }
    assert.doesNotMatch(text, /\$\s?\d/, `${guide.slug} states a dollar amount`);
    // "Not local averages" is the disclaimer, so the bare word is allowed.
    assert.doesNotMatch(text, /\b(?:typically costs?|on average|the average|guarantee)/i, `${guide.slug} makes a market claim`);
    assert.doesNotMatch(text, /\d\.\d{3,}/, `${guide.slug} prints floating-point residue`);
  }
});

test("each guide answers its question, names the lender's role, and links onward", () => {
  for (const slug of SLUGS) {
    const guide = CALCULATOR_GUIDES[slug];
    assert.equal(guide.slug, slug);
    assert.ok(guide.question.endsWith("?"), `${slug} heading is a question`);
    assert.ok(guide.answer.length > 200, `${slug} answer stands on its own`);
    assert.ok(guide.includes.length >= 3 && guide.leavesOut.length >= 3, `${slug} scope both ways`);
    assert.ok(guide.faqs.length >= 3, `${slug} has questions`);
    assert.match(JSON.stringify(guide), /lender/i, `${slug} says what belongs to a lender`);
    for (const related of guide.related) {
      assert.ok(SLUGS.includes(related) && related !== slug, `${slug} links to another calculator`);
    }
  }
  // No two calculators answer the same question; the H1 is not repeated as the H2.
  assert.equal(new Set(SLUGS.map((slug) => CALCULATOR_GUIDES[slug].question)).size, SLUGS.length);
  assert.doesNotMatch(read(`${APP}/calculators/affordability/page.tsx`), /title="What decides how much house/);
});

test("the guide marks up only what it shows", () => {
  const component = read("apps/web/components/calculators/calculator-guide.tsx");
  assert.match(component, /"@type": "WebApplication"/);
  assert.match(component, /mainEntity: guide\.faqs\.map/);
  assert.match(component, /<QaList items=\{guide\.faqs\} \/>/);
  assert.match(component, /isAccessibleForFree: true/);
  assert.match(component, /publisher: \{ "@id": `\$\{SITE\.url\}\/#organization` \}/);
});

test("llms.txt lists every calculator from the same guide content", () => {
  const route = read(`${APP}/llms.txt/route.ts`);
  assert.match(route, /Object\.values\(CALCULATOR_GUIDES\)\.map/);
  assert.match(route, /## Planning calculators/);
});

/* ---- first-time buyers, about, entity facts ------------------------------ */

test("/first-time-buyers answers 'steps to buying a house' in markup it also shows", () => {
  const page = read(`${APP}/first-time-buyers/page.tsx`);
  assert.match(page, /question: "What are the steps to buying a house\?"/);
  assert.match(page, /mainEntity: FAQS\.map/);
  assert.match(page, /<QaList items=\{FAQS\} \/>/);
  // Program questions send readers to the agencies, never an amount.
  const faqs = page.slice(page.indexOf("const FAQS"), page.indexOf("export default"));
  assert.doesNotMatch(faqs, /\$\s?\d|\d+%/);
});

test("/about is the profile page of the site-wide Person", () => {
  const page = read(`${APP}/about/page.tsx`);
  assert.match(page, /"@type": "ProfilePage"/);
  assert.match(page, /mainEntity: \{ "@id": `\$\{SITE\.url\}\/#debra-allen` \}/);
});

test("program pages name the site-wide Person as provider, not a second person", () => {
  const page = read("apps/web/components/programs/program-page.tsx");
  assert.match(page, /provider: \{ "@id": `\$\{SITE\.url\}\/#debra-allen` \}/);
  assert.doesNotMatch(page, /"@type": "Person"/);
});

test("sameAs appears only once a profile is supplied, and only https profiles", () => {
  const NONE = { brokerageName: null, licenseNumber: null, licenseState: null, businessAddress: null, phoneNumber: null, serviceAreas: [] };
  assert.deepEqual(sameAs(NONE), {});
  assert.deepEqual(sameAs({ ...NONE, profileUrls: [] }), {});
  assert.deepEqual(
    profileLinks({
      ...NONE,
      profileUrls: [
        "https://www.linkedin.com/in/example",
        " https://www.linkedin.com/in/example ",
        "http://insecure.example.com/",
        "not a url",
      ],
    }),
    ["https://www.linkedin.com/in/example"],
  );
  // The live facts are still empty, so the live site publishes no sameAs.
  assert.deepEqual(sameAs(), {});
  assert.match(read(`${APP}/layout.tsx`), /\.\.\.sameAs\(\),/);
});

test("an office address is published as a structured postal address when it can be read", () => {
  assert.deepEqual(postalAddress("100 Example St, Suite 2, Garland, TX 75040"), {
    "@type": "PostalAddress",
    streetAddress: "100 Example St, Suite 2",
    addressLocality: "Garland",
    addressRegion: "TX",
    postalCode: "75040",
    addressCountry: "US",
  });
  assert.equal(postalAddress("100 Example St, Garland, Texas 75040-1234").addressRegion, "TX");
  assert.equal(postalAddress("100 Example St, Garland, Texas 75040-1234").postalCode, "75040-1234");
  // Not in the documented shape: left as written, never guessed at.
  assert.equal(postalAddress("Garland, TX"), null);
  assert.equal(postalAddress("100 Example St, Garland 75040"), null);
});
