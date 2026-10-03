import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { register } from "node:module";
import path from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";

/**
 * Conversion copy from the 2026-10-03 written-content audit (QW1–QW5).
 *
 * The audit found the site honest and clear about what things are, and quiet
 * at the moment a visitor decides: success messages that said nothing about
 * what happens next, no account of how a consultation works, no answer to
 * "my credit / my savings / I'm not ready", and buttons that led nowhere.
 * These cases keep each fix in place and keep the copy inside the rules in
 * AGENTS.md: no new claim, no amount, no eligibility, no frequency, no staff.
 */

register("../../scripts/sanity/ts-resolver.mjs", import.meta.url);

const read = (file) => readFileSync(file, "utf8");
const WEB = "apps/web";
const load = (file) => import(pathToFileURL(`${WEB}/${file}`).href);

const conversion = await load("lib/content/conversion.ts");
const { FAQ_GROUPS } = await load("lib/content/faq.ts");
const { FIGMA_CITIES, FIGMA_HOME_CTA } = await load("lib/figma-home.ts");
const { LOCAL_MARKET } = await load("lib/local-market.ts");
const { buildResult } = await load("lib/content/homebuying-path.ts");

/** Every .ts/.tsx source under the app, for repository-wide copy checks. */
function sources(dir = WEB) {
  return readdirSync(dir).flatMap((name) => {
    if (name === "node_modules" || name === ".next") return [];
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return sources(full);
    return /\.tsx?$/.test(name) ? [full] : [];
  });
}

/** Copy only: comments are explanation, not text a visitor sees. */
const withoutComments = (source) => source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

/* ---- the shared promises --------------------------------------------- */

test("the consultation promises are written once and imported where they appear", () => {
  assert.deepEqual([...conversion.CONSULTATION_TERMS], ["No cost", "No commitment", "Phone or video call"]);
  assert.equal(conversion.CONSULTATION_REASSURANCE, "No cost · No commitment · Phone or video call");

  for (const file of [
    "components/home/figma-home-page.tsx",
    "components/programs/program-page.tsx",
    "app/programs/page.tsx",
    "app/about/page.tsx",
    "app/first-time-buyers/page.tsx",
  ]) {
    const source = read(`${WEB}/${file}`);
    assert.match(source, /CONSULTATION_REASSURANCE/, `${file} shows the reassurance`);
    assert.doesNotMatch(source, /No cost · No commitment/, `${file} re-types the reassurance instead of importing it`);
  }
});

test("every promise awaiting approval is listed for Debra", () => {
  const register = read("docs/05-content/CONVERSION_COPY.md");
  for (const claim of ["no cost", "no commitment", "reads and replies", "phone or video call", "next workshop date"]) {
    assert.match(register.toLowerCase(), new RegExp(claim), `the approval register names "${claim}"`);
  }
  // The module points to the register, so whoever edits one finds the other.
  assert.match(read(`${WEB}/lib/content/conversion.ts`), /docs\/05-content\/CONVERSION_COPY\.md/);
});

test("the worries are answered without an amount, an eligibility rule, a frequency or a promise", () => {
  assert.equal(conversion.COMMON_WORRIES.length, 5);
  const text = JSON.stringify(conversion.COMMON_WORRIES);
  assert.doesNotMatch(text, /\$\s?\d|\d+%/, "no amounts or percentages");
  assert.doesNotMatch(text, /guarantee|approved|most (common|people)|many people|every day|always/i);
  // Qualifying may be mentioned only alongside whoever decides it — "She can't
  // tell you what you will qualify for — a lender does that" — never as a
  // statement that the visitor qualifies.
  for (const { answer } of conversion.COMMON_WORRIES) {
    for (const sentence of answer.split(/(?<=\.)\s+/)) {
      if (/qualif/i.test(sentence)) assert.match(sentence, /lender|program/i, `"${sentence}" names who decides`);
    }
  }

  const byWorry = Object.fromEntries(conversion.COMMON_WORRIES.map((w) => [w.worry, w]));
  // Whoever actually decides is named in the answer itself.
  assert.match(byWorry["My credit isn't perfect."].answer, /a lender does that/);
  assert.match(byWorry["I don't have much saved."].answer, /Each program and a participating lender decide who qualifies/);
  // The programs named are the official ones already linked on /programs.
  const programs = read(`${WEB}/app/programs/page.tsx`);
  for (const agency of ["TDHCA", "TSAHC", "City of Dallas", "Dallas County"]) {
    assert.ok(byWorry["I don't have much saved."].answer.includes(agency));
    assert.ok(programs.includes(agency), `${agency} is on /programs`);
  }
  for (const worry of conversion.COMMON_WORRIES) {
    assert.ok(worry.question.endsWith("?"), `${worry.worry} has a question form for the FAQ`);
    if (worry.link) assert.ok(existsSync(`${WEB}/app${worry.link.href}/page.tsx`), `${worry.link.href} exists`);
  }
});

test("the worries appear in full on the consultation page, first-time buyers and the FAQ", () => {
  for (const file of ["app/consultation/page.tsx", "app/first-time-buyers/page.tsx"]) {
    assert.match(read(`${WEB}/${file}`), /<WorriesList \/>/, file);
  }
  const worriesGroup = FAQ_GROUPS.find((group) => group.heading === "Common worries");
  assert.ok(worriesGroup, "the FAQ has a Common worries group");
  assert.deepEqual(
    worriesGroup.items.map((item) => item.question),
    conversion.COMMON_WORRIES.map((worry) => worry.question),
  );
  // Visible, not behind a disclosure: the list is not built from <details>.
  assert.doesNotMatch(read(`${WEB}/components/conversion/worries.tsx`), /<details|<summary/);
  // And the homepage carries the short version, linking to how it works.
  const home = read(`${WEB}/components/home/figma-home-page.tsx`);
  assert.match(home, /\{WORRIES_SHORT\}/);
  assert.match(home, /href="\/consultation#consultation-how-heading"/);
  assert.match(read(`${WEB}/app/consultation/page.tsx`), /titleId="consultation-how-heading"/);
});

/* ---- QW2: how a consultation works ------------------------------------- */

test("the consultation page explains the process before asking for anything", () => {
  const page = read(`${WEB}/app/consultation/page.tsx`);
  const how = page.indexOf('aria-labelledby="consultation-how-heading"');
  const form = page.indexOf('aria-labelledby="consultation-form-heading"');
  assert.ok(how > 0 && how < form, "the explanation comes before the form");
  assert.match(page, /<Steps items=\{CONSULTATION_STEPS\} \/>/);
  assert.match(page, /CONSULTATION_HELPFUL\.map/);
  assert.match(page, /\{CONSULTATION_IS_NOT\}/);
  assert.equal(conversion.CONSULTATION_STEPS.length, 3);
  assert.match(conversion.CONSULTATION_IS_NOT, /isn't a loan application, a credit check or a pre-approval/);
  assert.match(conversion.CONSULTATION_IS_NOT, /Social Security numbers/);
});

/* ---- QW1: success states ------------------------------------------------ */

test("every form's success message says what happens next, and moves focus to itself", () => {
  const contact = read(`${WEB}/components/contact/contact-form.tsx`);
  assert.match(contact, /Thank you — your consultation request is in/);
  assert.match(contact, /Here&apos;s what happens next:/);
  assert.match(contact, /Thank you — your message is with Debra/);
  assert.match(contact, /calendarAvailable &&/);

  const program = read(`${WEB}/components/programs/program-lead-form.tsx`);
  assert.match(program, /Thank you — Debra has your NACA details/);
  assert.match(program, /sign\s+up on naca\.com/);
  assert.match(program, /Thank you — Debra has your details/);
  assert.match(program, /Homes for Texas Heroes/);

  const start = read(`${WEB}/components/landing/next-step-landing.tsx`);
  assert.match(start, /Thanks — Debra has your next-step request\./);

  for (const [file, source, ref] of [
    ["contact-form", contact, "successRef"],
    ["program-lead-form", program, "successRef"],
    ["next-step-landing", start, "leadSuccessRef"],
  ]) {
    assert.match(source, new RegExp(`ref=\\{${ref}\\} tabIndex=\\{-1\\}`), `${file} success can take focus`);
    assert.match(source, new RegExp(`${ref}\\.current\\?\\.focus\\(\\)`), `${file} moves focus on success`);
  }
});

test("no copy implies staff the site has not verified", () => {
  const offenders = sources()
    .filter((file) => /Debra[’']s team|her team\b/.test(withoutComments(read(file))))
    .map((file) => file);
  assert.deepEqual(offenders, []);
});

/* ---- QW4: microcopy ------------------------------------------------------ */

test("the forms explain themselves, and the program form keeps its boundary and its consent", () => {
  const contact = read(`${WEB}/components/contact/contact-form.tsx`);
  const program = read(`${WEB}/components/programs/program-lead-form.tsx`);

  for (const [file, source] of [["contact-form", contact], ["program-lead-form", program]]) {
    assert.match(source, /\{FORM_PRIVACY\}/, `${file} privacy line`);
    assert.match(source, /href="\/privacy"/, `${file} links the privacy policy`);
  }
  // Help text is tied to its field, not floating beside it.
  assert.match(contact, /aria-describedby=\{phoneHelpId\}/);
  assert.match(contact, /aria-describedby=\{messageHelpId\}/);
  assert.match(program, /aria-describedby=\{`\$\{formId\}-phone-help`\}/);
  assert.match(program, /Only your name, email and phone are required/);

  // The no-guarantee boundary survives the rewrite.
  assert.match(program, /Eligibility, approval, savings and outcomes are decided by\s+the program and your lender, and aren&apos;t guaranteed/);
  // Consent wording is a compliance decision; this pass must not change it.
  assert.match(
    program,
    /I consent to be contacted by D&apos;Affordable Homes about my real-estate request\./,
  );
});

test("primary consultation buttons say what pressing them commits you to", () => {
  const header = read(`${WEB}/components/page/page-header.tsx`);
  assert.match(header, /\{note && <p className="dh-reassure">\{note\}<\/p>\}/);
  const home = read(`${WEB}/components/home/figma-home-page.tsx`);
  assert.match(home, /<p className="fh-hero-reassure">\{CONSULTATION_REASSURANCE\}<\/p>/);
});

/* ---- QW5: dead ends ------------------------------------------------------- */

test("no button or tile promises a page that does not deliver", () => {
  // Homepage header: "Search Homes" opened a page with no listings feed.
  assert.deepEqual(FIGMA_HOME_CTA.talkWithDebra, { label: "Talk with Debra", href: "/consultation" });
  assert.equal("searchHomes" in FIGMA_HOME_CTA, false);
  assert.match(read(`${WEB}/components/home/figma-home-header.tsx`), /FIGMA_HOME_CTA\.talkWithDebra\.href/);

  // City tiles: "each opens the property search" — there is none yet.
  for (const city of FIGMA_CITIES) {
    assert.notEqual(city.href, "/homes", `${city.name} must not open the empty listings page`);
  }
  for (const file of ["app/areas/page.tsx", "app/homes/page.tsx", "components/home/figma-home-page.tsx"]) {
    const source = withoutComments(read(`${WEB}/${file}`));
    assert.doesNotMatch(source, /opens the property search|link into the property search|Start a search in any of these/, file);
    assert.match(source, /<span className="sr-only">Ask Debra about <\/span>/, `${file} tiles say where they go`);
  }

  // /start: the "Rather talk?" button opened a "not connected yet" notice.
  const start = read(`${WEB}/components/landing/next-step-landing.tsx`);
  assert.doesNotMatch(start, /voiceNotice|Live voice guidance is not connected/);
  assert.match(start, /<Link href="\/consultation" className="dah-landing-voice-button"/);
  assert.doesNotMatch(start, /The customer remains the hero/);

  // The seller result linked to a market-reports placeholder.
  const selling = buildResult({ goal: "sell", area: "garland", service: "none" });
  assert.notEqual(selling.resource.href, "/market-reports");
});

test("the FAQ answers 'what happens next' and 'do you help me search' directly", () => {
  const all = Object.fromEntries(FAQ_GROUPS.flatMap((group) => group.items).map((item) => [item.question, item.answer]));
  assert.match(all["Do you help with the home search?"], /^Yes\. /);
  assert.doesNotMatch(all["What happens after I book a consultation?"], /confirmed before you book/);
  assert.match(all["What happens after I book a consultation?"], /phone or video call/);
  assert.match(all["What happens after I book a consultation?"], /No cost, no commitment/);
});

test("the area line invites rather than warns, and still claims no service area", () => {
  assert.match(LOCAL_MARKET.serviceAreaStatus, /Tell her where you're hoping to buy/);
  assert.doesNotMatch(LOCAL_MARKET.serviceAreaStatus, /before representation is promised/);
  assert.deepEqual([...LOCAL_MARKET.verifiedServiceAreas], []);
  assert.doesNotMatch(LOCAL_MARKET.serviceAreaStatus, /serves|service area includes|we cover/i);
});

test("the homepage footer says how to reach Debra today, and still yields to verified details", () => {
  const footer = read(`${WEB}/components/home/figma-home-footer.tsx`);
  assert.doesNotMatch(footer, /published here once they are confirmed/);
  assert.match(footer, /Reach Debra through a consultation request or a message/);
  assert.match(footer, /\{!hasDirectContact\(\) && \(/);
});
