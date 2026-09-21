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
