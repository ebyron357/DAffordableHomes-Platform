/**
 * ClientVerse vendor attribution.
 *
 * ClientVerse built and maintains this site. The attribution appears once, in
 * the shared site footer, and states the commercial relationship plainly. It is
 * deliberately not repeated inside article bodies: editorial copy should not
 * carry promotional vendor links.
 *
 * `tests/static/clientverse.test.mjs` asserts the text, the destination, and
 * the single-placement rule.
 */
export const CLIENTVERSE = {
  /** Approved attribution wording. */
  attributionText: "Made by ClientVerse",
  /** Approved destination. */
  href: "https://clientverse.io",
  /** Qualifies the commercial relationship so the credit is not mistaken for an endorsement. */
  relationshipNote: "— website design and build vendor",
} as const
