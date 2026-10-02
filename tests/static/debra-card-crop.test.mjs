import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (file) => readFileSync(file, "utf8");

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

  // The Heroes and Garland guides no longer carry a portrait at all — the
  // owner asked for Debra to come off those two cards — so there is no crop
  // left to get wrong. `articles.test.mjs` holds them to that.
  assert.doesNotMatch(heroes, /focalPoint:/);
  assert.doesNotMatch(garland, /focalPoint:/);
  assert.match(naca, /focalPoint: "48% 35%"/);
  // The homepage frame crops horizontally only, so the register's rule stands.
  assert.match(home, /objectPosition: "48% center"/);

  // No portrait asset may fall back to a centred vertical crop in a card.
  for (const [name, source] of [["naca", naca]]) {
    assert.ok(
      !/focalPoint: "(50% )?center"/.test(source),
      `${name} must not use a vertically centred crop`,
    );
  }
});

test("the face-safety gate fails a placement that did not render at all", () => {
  // A broken image was once only recorded as a row and skipped, so `worst`
  // never moved and the gate reported PASS for a portrait the browser never
  // drew — the same class of defect as the landing frame that resolved to 0px
  // wide at every desktop width.
  const gate = read("scripts/qa/face-safety.mjs");

  assert.match(gate, /const broken = \[\]/);
  assert.match(gate, /broken\.push\(/);
  assert.match(gate, /broken\.length === 0/);
  assert.doesNotMatch(gate, /if \(f\.skip \|\| f\.broken\)/);
});
