/**
 * ClientVerse vendor attribution.
 *
 * Rendered site-wide in the shared footer only. Promotional ClientVerse links
 * must never be placed inside editorial article bodies — see
 * docs/12-governance/PUBLISHING_STANDARD.md.
 *
 * The qualification line states the commercial relationship plainly so a reader
 * cannot mistake the technology vendor for a party to a real-estate transaction.
 */
export const CLIENTVERSE = {
  prefix: "Made by",
  name: "ClientVerse",
  href: "https://clientverse.io",
  qualification: "Independent technology vendor. Not a party to any real-estate transaction.",
} as const

/** The complete attribution sentence, used by the regression test. */
export const CLIENTVERSE_ATTRIBUTION_TEXT = `${CLIENTVERSE.prefix} ${CLIENTVERSE.name}`
