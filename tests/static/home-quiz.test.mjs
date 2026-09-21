import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

/**
 * Homepage readiness quiz.
 *
 * The requirement it has to keep meeting is "reuse the existing /start logic,
 * do not build a disconnected duplicate". These assertions exist because that
 * is exactly the kind of thing that decays: the easy change is to paste a
 * question array into the homepage component, and nothing would visibly break.
 */

const read = (file) => readFileSync(file, "utf8");

test("the assessment has exactly one source of truth", () => {
  const shared = read("apps/web/lib/content/readiness.ts");
  const quiz = read("apps/web/components/home/home-quiz.tsx");
  const landing = read("apps/web/components/landing/next-step-landing.tsx");

  // Questions and the result engine live in the shared module.
  assert.match(shared, /export const QUESTIONS: Question\[\]/);
  assert.match(shared, /export function getResult\(/);
  assert.match(shared, /export const STORAGE_KEY/);
  assert.match(shared, /export const ATTRIBUTION_KEYS/);

  // Both surfaces import them; neither declares its own copy.
  for (const [file, source] of [["home-quiz", quiz], ["next-step-landing", landing]]) {
    assert.match(source, /from "@\/lib\/content\/readiness"/, file);
    assert.ok(
      !/^const QUESTIONS/m.test(source),
      `${file} must not declare its own QUESTIONS array`,
    );
    assert.ok(
      !/^function getResult/m.test(source),
      `${file} must not declare its own getResult`,
    );
  }
});

test("the homepage quiz hands off to /start rather than forking the flow", () => {
  const quiz = read("apps/web/components/home/home-quiz.tsx");
  const landing = read("apps/web/components/landing/next-step-landing.tsx");

  // Same storage area as /start. Writing the right shape to the wrong area is
  // silent: the quiz still works, and /start just restarts at question one.
  assert.match(quiz, /sessionStorage\.getItem\(STORAGE_KEY\)/);
  assert.match(quiz, /sessionStorage\.setItem\(/);
  assert.ok(!/localStorage/.test(quiz), "the quiz must not use localStorage");
  assert.match(landing, /sessionStorage/);

  // The persisted record carries the fields /start restores.
  for (const field of ["answers", "questionIndex", "phase", "attribution"]) {
    assert.match(quiz, new RegExp(field), `persisted record should carry ${field}`);
  }

  // Results route into the existing /start sections.
  assert.match(quiz, /naca: "\/start#naca"/);
  assert.match(quiz, /hero: "\/start#heroes"/);
  assert.match(quiz, /traditional: "\/start#traditional"/);
  assert.match(quiz, /readiness: "\/start#readiness"/);

  // Existing funnel event names, so the homepage entry joins the /start funnel
  // instead of creating a parallel one.
  for (const event of [
    "assessment_started",
    "assessment_question_completed",
    "assessment_completed",
  ]) {
    assert.match(quiz, new RegExp(`"${event}"`), `should emit ${event}`);
  }
});

test("the quiz never asserts eligibility", () => {
  const quiz = read("apps/web/components/home/home-quiz.tsx");

  // PRODUCT_REQUIREMENTS §6.2: educational only.
  assert.match(quiz, /not a preapproval, a credit decision, or a\s+guarantee of program\s+eligibility/);
  for (const forbidden of [/you qualify/i, /pre-?approved/i, /guaranteed/i, /you will save/i]) {
    assert.doesNotMatch(quiz, forbidden);
  }
});

test("Debra's head is not cropped by a landscape card frame", () => {
  // The blog index card is 16:10 and the article hero is 4:5 / 3:2, while two
  // of the portraits are 3:4 and 5:4 sources. A vertically centred crop of a
  // portrait source in a landscape frame starts below the top of her head —
  // which is what shipped, and what these values correct. Each vertical figure
  // is well above the top of her head in its source.
  const heroes = read("apps/web/lib/blog/seed/articles/homes-for-heroes-north-texas.ts");
  const naca = read("apps/web/lib/blog/seed/articles/naca-homebuying-dallas-fort-worth.ts");
  const garland = read("apps/web/lib/blog/seed/articles/how-to-buy-home-garland-tx.ts");
  const home = read("apps/web/components/home/figma-home-page.tsx");

  assert.match(heroes, /focalPoint: "55% 16%"/);
  assert.match(naca, /focalPoint: "48% 35%"/);
  assert.match(garland, /focalPoint: "center 10%"/);
  // The homepage frame crops horizontally only, so the register's rule stands.
  assert.match(home, /objectPosition: "48% center"/);

  // No portrait asset may fall back to a centred vertical crop in a card.
  for (const [name, source] of [["heroes", heroes], ["naca", naca], ["garland", garland]]) {
    assert.ok(
      !/focalPoint: "(50% )?center"/.test(source),
      `${name} must not use a vertically centred crop`,
    );
  }
});
