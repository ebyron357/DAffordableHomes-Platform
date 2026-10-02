import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { register } from "node:module";
import { test } from "node:test";
import { pathToFileURL } from "node:url";

/**
 * Brokerage, licence, phone and office: shown once verified, never before.
 *
 * The facts live in `lib/site.ts` and are all `null` until the owner supplies
 * them. These cases pass explicit facts rather than reading the live values,
 * so they keep holding after the real ones are filled in. The sample values
 * below exist only in this test; 555-01xx numbers are reserved for fiction.
 */

register("../../scripts/sanity/ts-resolver.mjs", import.meta.url);

const { professionalDetails, hasDirectContact, localBusinessJsonLd } = await import(
  pathToFileURL("apps/web/lib/business-facts.ts").href
);

const read = (file) => readFileSync(file, "utf8");

const NONE = {
  brokerageName: null,
  licenseNumber: null,
  licenseState: null,
  businessAddress: null,
  phoneNumber: null,
  serviceAreas: [],
};

const SAMPLE = {
  brokerageName: "Sample Brokerage LLC",
  licenseNumber: "0000000",
  licenseState: "Texas",
  businessAddress: "100 Example St, Garland, TX 75040",
  phoneNumber: "(214) 555-0100",
  serviceAreas: ["Garland", "Dallas–Fort Worth"],
};

test("with nothing verified, nothing is shown or marked up", () => {
  assert.deepEqual(professionalDetails(NONE), []);
  assert.equal(hasDirectContact(NONE), false);
  assert.equal(localBusinessJsonLd(NONE), null);
});

test("each verified fact appears on its own, brokerage first", () => {
  assert.deepEqual(
    professionalDetails(SAMPLE).map(({ key, label, value, href }) => ({ key, label, value, href })),
    [
      { key: "brokerage", label: "Brokerage", value: "Sample Brokerage LLC", href: undefined },
      { key: "license", label: "Texas real estate license", value: "0000000", href: undefined },
      { key: "phone", label: "Phone", value: "(214) 555-0100", href: "tel:+12145550100" },
      { key: "address", label: "Office", value: "100 Example St, Garland, TX 75040", href: undefined },
    ],
  );

  // A partial set shows only what was supplied: no blank labels, no stand-ins.
  assert.deepEqual(
    professionalDetails({ ...NONE, brokerageName: "Sample Brokerage LLC" }).map((d) => d.key),
    ["brokerage"],
  );
  assert.equal(hasDirectContact({ ...NONE, phoneNumber: "214-555-0100" }), true);
});

test("the local listing needs both an address and a phone number", () => {
  assert.equal(localBusinessJsonLd({ ...SAMPLE, businessAddress: null }), null);
  assert.equal(localBusinessJsonLd({ ...SAMPLE, phoneNumber: null }), null);

  const ld = localBusinessJsonLd(SAMPLE);
  assert.equal(ld["@type"], "RealEstateAgent");
  assert.equal(ld["@id"], "https://daffordablehomes.com/#local-business");
  assert.equal(ld.telephone, "+12145550100");
  assert.equal(ld.address, SAMPLE.businessAddress);
  assert.deepEqual(ld.areaServed.map((p) => p.name), SAMPLE.serviceAreas);
  assert.equal(ld.parentOrganization.name, "Sample Brokerage LLC");
  assert.equal(ld.employee["@id"], "https://daffordablehomes.com/#debra-allen");

  // No service area or brokerage is claimed when none was supplied.
  const bare = localBusinessJsonLd({ ...NONE, businessAddress: SAMPLE.businessAddress, phoneNumber: SAMPLE.phoneNumber });
  assert.equal("areaServed" in bare, false);
  assert.equal("parentOrganization" in bare, false);
});

test("every footer, the contact page and the graph read from the one source", () => {
  const component = read("apps/web/components/layout/professional-details.tsx");
  assert.match(component, /if \(details\.length === 0\) return null/);

  for (const file of [
    "apps/web/components/layout/site-footer.tsx",
    "apps/web/components/home/figma-home-footer.tsx",
    "apps/web/app/contact/page.tsx",
    "apps/web/app/about/page.tsx",
  ]) {
    assert.match(read(file), /<ProfessionalDetails\b/, `${file} should render the verified details`);
  }

  // The homepage's "published once confirmed" note goes away once a phone or
  // office exists, rather than sitting beside the real details.
  assert.match(read("apps/web/components/home/figma-home-footer.tsx"), /\{!hasDirectContact\(\) && \(/);

  const layout = read("apps/web/app/layout.tsx");
  assert.match(layout, /\.\.\.\[localBusinessJsonLd\(\)\]\.filter\(Boolean\)/);
});

test("no page hardcodes a phone number or a licence in place of the facts", () => {
  for (const file of [
    "apps/web/components/layout/site-footer.tsx",
    "apps/web/components/home/figma-home-footer.tsx",
    "apps/web/app/contact/page.tsx",
    "apps/web/app/about/page.tsx",
    "apps/web/app/layout.tsx",
  ]) {
    const source = read(file);
    assert.doesNotMatch(source, /href="tel:/, `${file} must take its phone number from lib/site.ts`);
    assert.doesNotMatch(source, /\(\d{3}\)\s?\d{3}-\d{4}|\b\d{3}-\d{3}-\d{4}\b/, `${file} contains a phone number`);
    assert.doesNotMatch(source, /license\s*(?:no\.?|number|#)\s*\d/i, `${file} contains a licence number`);
  }
});
