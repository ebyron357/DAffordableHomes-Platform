import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { register } from "node:module";
import path from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";

/**
 * The rest of the written-content conversion audit (ACT-022): every item that
 * could be closed without a new fact from Debra. Each case pins one fix.
 */

register("../../scripts/sanity/ts-resolver.mjs", import.meta.url);

const read = (file) => readFileSync(file, "utf8");
const WEB = "apps/web";
const load = (file) => import(pathToFileURL(`${WEB}/${file}`).href);

const { PATH_QUESTIONS, buildResult } = await load("lib/content/homebuying-path.ts");
const { PROGRAMS } = await load("lib/programs.ts");
const { COMMON_WORRIES } = await load("lib/content/conversion.ts");

function sources(dir = WEB) {
  return readdirSync(dir).flatMap((name) => {
    if (name === "node_modules" || name === ".next") return [];
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return sources(full);
    return /\.tsx?$/.test(name) ? [full] : [];
  });
}
const withoutComments = (source) => source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

/* ---- quiz results ---------------------------------------------------------- */

const choices = (id) => PATH_QUESTIONS.find((q) => q.id === id)?.choices.map((c) => c.value) ?? [undefined];

test("no quiz result sends anyone to the empty listings page or an empty report page", () => {
  const seen = new Set();
  for (const goal of choices("goal"))
    for (const area of choices("area"))
      for (const service of choices("service"))
        for (const buyerPosition of choices("buyerPosition")) {
          const result = buildResult({ goal, area, service, buyerPosition, timeline: "soon" });
          seen.add(result.key);
          for (const link of [result.primary, result.resource]) {
            assert.notEqual(link.href.split("#")[0], "/homes", `${result.key}: ${link.label} → /homes`);
            assert.notEqual(link.href, "/market-reports", `${result.key}: ${link.label} → /market-reports`);
          }
        }
  // The two paths the audit named were actually exercised.
  assert.ok(seen.has("ready-search") && seen.has("relocating"), [...seen].join(", "));
});

test("people moving to DFW are sent to a relocation section that exists", () => {
  const relocating = buildResult({ goal: "relocate", area: "dallas", service: "none", buyerPosition: "search", timeline: "soon" });
  assert.equal(relocating.key, "relocating");
  assert.equal(relocating.primary.href, "/areas#moving-to-dfw");
  // /neighborhoods redirects to /areas, which the primary link already opens.
  assert.equal(relocating.resource.href, "/calculators/affordability");

  const areas = read(`${WEB}/app/areas/page.tsx`);
  assert.match(areas, /<Band tone="white" id="moving-to-dfw"/);
  assert.match(areas, /<Steps items=\{RELOCATION_STEPS\} \/>/);
  assert.match(areas, /phone or video conversation/);
  // No remote-touring promise until Debra confirms she offers it.
  assert.doesNotMatch(withoutComments(areas), /virtual tour|video tour|remote showing/i);
});

/* ---- program pages ----------------------------------------------------------- */

test("NACA shows the next step for each program stage, and who handles it", () => {
  assert.equal(PROGRAMS.naca.stageGuide.length, 3);
  assert.match(PROGRAMS.naca.stageGuide[0].next, /free Homebuyer Workshop; sign-up is on naca\.com/);
  assert.match(PROGRAMS.naca.stageGuide[1].next, /NACA counselor/);
  assert.ok(PROGRAMS.naca.supportLede.startsWith("NACA guides you through counseling and qualification."));
  const page = read(`${WEB}/components/programs/program-page.tsx`);
  assert.match(page, /program\.stageGuide\.map/);
  assert.match(page, /\{program\.supportLede && <p>\{program\.supportLede\}<\/p>\}/);
  assert.match(page, /title="Where the program&apos;s rules come from"|title="Where the program's rules come from"/);
});

test("Homes for Heroes answers who may qualify, military moves and Garland without brushing anyone off", () => {
  const faqs = Object.fromEntries(PROGRAMS["homes-for-heroes"].faqs.map((f) => [f.question, f.answer]));
  const qualify = faqs["Who may qualify for Homes for Heroes?"];
  assert.match(qualify, /national Homes for Heroes program/);
  assert.match(qualify, /TSAHC's Homes for Texas Heroes/);
  assert.match(qualify, /Debra can help you work out what to ask each one/);

  const orders = faqs["I'm on military orders to Dallas–Fort Worth. Can Debra help?"];
  assert.ok(orders, "the military-orders question is answered");
  assert.match(orders, /a VA-approved lender confirms your entitlement and terms/);

  assert.doesNotMatch(faqs["Can Debra help a veteran or teacher buy in Garland?"], /blanket|unverified/);
  // Internal project language does not reach visitors.
  assert.doesNotMatch(PROGRAMS["homes-for-heroes"].disclaimer, /added to the project/);
  assert.match(PROGRAMS["homes-for-heroes"].disclaimer, /does not claim affiliation/);
});

/* ---- hub, calculators, about, contact, consultation, first-time buyers ---- */

test("the programs hub sorts visitors to the right place and answers the savings worry", () => {
  const hub = read(`${WEB}/app/programs/page.tsx`);
  assert.match(hub, /Not sure which applies to you\?/);
  assert.match(hub, /PROGRAM_SORT\.map/);
  for (const href of ["/programs/naca", "/programs/homes-for-heroes", "#official-programs-heading", "/start"]) {
    assert.ok(hub.includes(`href: "${href}"`), href);
  }
  assert.match(hub, /Haven&apos;t saved much\?/);
  assert.match(hub, /Using FHA, VA, USDA or down payment assistance\?/);
  assert.doesNotMatch(hub, /More paths are being written/);
});

test("calculators say the numbers stay private, and a low result is not a verdict", () => {
  const ui = read(`${WEB}/components/calculators/calculator-ui.tsx`);
  assert.match(ui, /Your numbers aren&apos;t saved or sent anywhere\./);
  const calc = read(`${WEB}/components/calculators/homebuyer-calculators.tsx`);
  assert.match(calc, /Lower than you hoped\?/);
  // The notice is built from the limits the arithmetic uses.
  assert.match(calc, /Math\.round\(HOUSING_RATIO_LIMIT \* 100\)/);
  assert.doesNotMatch(calc, /Uses 28% housing and 36%/);
  assert.match(read(`${WEB}/app/calculators/page.tsx`), /Don't have a price in mind yet\? Start with affordability\./);
});

test("About states Debra's boundaries; contact and consultation say what happens and who it is for", () => {
  const about = read(`${WEB}/app/about/page.tsx`);
  assert.match(about, /title="What Debra won't do"/);
  assert.match(about, /BOUNDARIES\.map/);
  assert.match(about, /because of who lives there/);
  assert.doesNotMatch(about, /She is known for/);

  const contact = read(`${WEB}/app/contact/page.tsx`);
  assert.match(contact, /<strong>What happens next<\/strong>/);

  const consultation = read(`${WEB}/app/consultation/page.tsx`);
  assert.match(consultation, /weighing a new build, or not sure\s+yet — all of these are good reasons to book/);

  const ftb = read(`${WEB}/app/first-time-buyers/page.tsx`);
  assert.match(ftb, /question: "What documents should I have ready\?"/);
  assert.match(ftb, /your lender will tell you exactly what they need/);
});

test("the homepage names who it is for, offers checkable proof, and turns the empty listings block into a next step", () => {
  const home = read(`${WEB}/components/home/figma-home-page.tsx`);
  assert.match(home, /For first-time buyers and renters getting ready, NACA buyers/);
  assert.match(home, /Every guide lists its sources and the date it was reviewed/);
  assert.match(home, /Want to know what&apos;s on the market right now\?/);
});

/* ---- /start ------------------------------------------------------------------ */

test("/start answers credit and Dallas programs directly, from the shared sources", () => {
  const start = read(`${WEB}/components/landing/next-step-landing.tsx`);
  assert.match(start, /COMMON_WORRIES\.find\(\(worry\) => worry\.worry === "My credit isn't perfect\."\)/);
  // The lookup must find something: a renamed worry would otherwise ship an empty answer.
  assert.ok(COMMON_WORRIES.find((worry) => worry.worry === "My credit isn't perfect.")?.answer.length > 50);
  assert.match(start, /The City of Dallas, Dallas County, and the Texas agencies TDHCA and TSAHC/);
  assert.doesNotMatch(start, /significant homeownership benefits/);
});

/* ---- claims ------------------------------------------------------------------- */

test("no unverified frequency, base, reputation or internal claim reaches a visitor", () => {
  const banned = [
    /works the Dallas–Fort Worth market every day/,
    /where Debra's practice is based/,
    /Debra's home market|Debra&apos;s home market/,
    /Garland is home base/,
    /communities Debra works in/,
    /Debra hosts workshops/,
    /She is known for/,
    /added to the project/,
    /unverified blanket service-area promise/,
    // An instruction to the site's editors, shown to visitors in the Homes for Heroes article.
    /should not be represented as officially affiliated/,
    /unless verified documentation is published/,
  ];
  const offenders = [];
  for (const file of sources()) {
    const copy = withoutComments(read(file));
    for (const pattern of banned) if (pattern.test(copy)) offenders.push(`${file}: ${pattern}`);
  }
  assert.deepEqual(offenders, []);
});

test("the FAQ page's structured data is escaped like every other block", () => {
  const faq = read(`${WEB}/app/faq/page.tsx`);
  assert.match(faq, /<JsonLd value=\{jsonLd\} \/>/);
  assert.doesNotMatch(faq, /dangerouslySetInnerHTML/);
});

/* ---- rendering ---------------------------------------------------------------- */

test("text after a closing inline tag keeps its space when it contains an entity", () => {
  // The compiler drops the leading space of `</strong> That&apos;s …` — it
  // shipped as "hoped?That's". Such text must start with an explicit {" "}.
  // The entity can sit on a later line of the same text run, as it did in the
  // contact form's "Selling? Include … you&apos;d like to move."
  const offenders = [];
  for (const file of sources()) {
    if (!file.endsWith(".tsx")) continue;
    for (const match of read(file).matchAll(/<\/(strong|Link|a|em|span|code|b|i)> ([^{<]*)/g)) {
      if (/&[a-z]+;/.test(match[2])) offenders.push(`${file}: ${match[0].slice(0, 60)}`);
    }
  }
  assert.deepEqual(offenders, []);
  assert.match(read(`${WEB}/components/calculators/homebuyer-calculators.tsx`), /Lower than you hoped\?<\/strong>\{" "\}/);
});

test("follow-on link rows keep the arrow with the last word and drop the orphan separator", () => {
  const areas = read(`${WEB}/app/areas/page.tsx`);
  assert.match(areas, /<ul className="dh-band-links">/);
  assert.match(areas, /<ArrowLink href="\/programs\/homes-for-heroes"/);
  assert.doesNotMatch(areas, /dh-band-note-sep/);
  assert.match(read(`${WEB}/components/conversion/worries.tsx`), /<ArrowLink href=\{item\.link\.href\}/);
});

/* ---- PR review (Copilot, 2026-10-03) ------------------------------------------ */

test("copy promises only what the data and the workflow guarantee", async () => {
  const program = read(`${WEB}/components/programs/program-lead-form.tsx`);
  // The contact-method field is optional and nothing routes on it.
  assert.doesNotMatch(program, /the way you asked to be contacted/);
  assert.match(program, /follow up using the contact details you gave/);

  const { FORM_PRIVACY } = await load("lib/content/conversion.ts");
  // The policy lists more uses than replying; the line must not be narrower.
  assert.doesNotMatch(FORM_PRIVACY, /only to reply/);
  assert.match(FORM_PRIVACY, /as the privacy policy describes/);
});

test("the GoHighLevel guide treats the webhook and calendar as independent, and the calendar link as public", () => {
  const guide = read("docs/08-integrations/GHL_SETUP.md");
  assert.doesNotMatch(guide, /Nothing reaches GoHighLevel until\s+both are set/);
  assert.match(guide, /each works on its own/);
  assert.doesNotMatch(guide, /no\s+GoHighLevel key or URL is exposed/);
  assert.match(guide, /public share link/);
});
