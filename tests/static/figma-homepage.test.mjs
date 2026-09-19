import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("Figma homepage frame 11:4 is wired without fabricated listings or contact facts", () => {
  const page = readFileSync("apps/web/app/page.tsx", "utf8");
  const home = readFileSync("apps/web/components/home/figma-home-page.tsx", "utf8");
  const footer = readFileSync("apps/web/components/home/figma-home-footer.tsx", "utf8");
  const map = readFileSync("apps/web/lib/figma-home.ts", "utf8");
  const css = readFileSync("apps/web/app/globals.css", "utf8");

  assert.match(page, /FigmaHomePage/);
  assert.match(page, /searchListings/);
  assert.match(home, /Professional representation\. Trusted guidance for your next move/);
  assert.match(home, /Meet Debra Allen/);
  assert.match(home, /\[Price Placeholder\]/);
  assert.match(home, /\[Premium Dallas–Fort Worth Real Estate Architectural Photography Placeholder\]/);
  assert.match(home, /Live listings aren’t connected yet|Live listings aren't connected yet/);
  assert.match(footer, /Follow Us/);
  assert.match(footer, /\[Phone Placeholder\]/);
  assert.match(footer, /\[Email Placeholder\]/);
  assert.doesNotMatch(home, /Studio Clarity/);
  assert.doesNotMatch(home, /NC &amp; SC|North Carolina|South Carolina/);
  assert.doesNotMatch(home, /family-moving|debra-allen-portrait|next\/image/);
  assert.match(map, /href: "\/homes"/);
  assert.match(map, /href: "\/first-time-buyers"/);
  assert.match(map, /href: "\/consultation"/);
  assert.match(map, /href: "\/areas\/garland"/);
  assert.match(css, /#faf7f2/);
  assert.match(css, /#0b1f33/);
  assert.match(css, /#077783/);
  assert.match(css, /#d6a743/);
  assert.match(css, /width: 1440px/);
  assert.match(css, /height: 680px/);
});
