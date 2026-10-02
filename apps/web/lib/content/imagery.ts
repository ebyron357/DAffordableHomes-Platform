/**
 * Approved imagery, with the register's crop rules attached.
 *
 * Provenance, licence and the crop rule for every asset here are recorded in
 * `docs/05-content/IMAGE_ASSET_REGISTER.md`. The values below are that
 * register expressed as code, so a page composes with a named placement rather
 * than a hand-typed `objectPosition` — which is how the same photograph ended
 * up with one safe crop on one route and a clipped one on fourteen others.
 *
 * `scripts/qa/face-safety.mjs` measures the rendered crop of every Debra
 * placement at all five breakpoints and fails if the top of the frame eats
 * into her head.
 */

export type ApprovedImage = {
  src: string
  alt: string
  objectPosition: string
}

/** Licensed Pexels interior used on /homes; not the current homepage hero. */
export const HERO_FAMILY: ApprovedImage = {
  src: "/images/black-family-home-pexels-7114188.webp",
  alt: "A Black family of five holding hands together in a bright living room",
  // The five people sit slightly right of centre in the 3:2 source, so 52%
  // centres *them*; a literal 50% clips the father's shoulder when narrow.
  objectPosition: "52% center",
}

/**
 * Debra's primary portrait. Landscape source (1536x1229), so a 4:3 or wider
 * frame crops horizontally only and a 4:3 frame takes about 6% vertically,
 * centred. Her head is never at risk in this one.
 */
export const DEBRA_PORTRAIT: ApprovedImage = {
  src: "/images/debra-allen-primary-about.webp",
  alt: "Debra Allen smiling in a yellow blazer at a kitchen counter",
  objectPosition: "48% center",
}

/** Debra at her desk, for portrait and 4:3 frames. */
export const DEBRA_DESK: ApprovedImage = {
  src: "/images/debra-allen-advisor-desk.webp",
  alt: "Debra Allen seated at her desk with a tablet",
  objectPosition: "50% 30%",
}

/**
 * The desk photograph in a 4:3 masthead frame.
 *
 * Wider than the source, so `cover` crops vertically. Measured against the
 * rendered page, the top of her head sits about 14.7% down this image, so the
 * upright-frame 30% (a 13.1% top crop) left under two points of margin. 22%
 * takes 9.6% and leaves five.
 */
export const DEBRA_DESK_MASTHEAD: ApprovedImage = {
  ...DEBRA_DESK,
  objectPosition: "50% 22%",
}

/**
 * The same desk photograph in the full-bleed closing band.
 *
 * The band is roughly 1440x515 — far wider than the source — so `cover` throws
 * away about 70% of the image's height. At the 30% used for upright frames
 * that removed 22% off the top, which clipped the top of her head on every
 * page carrying a closing band. 14% keeps her whole.
 */
export const DEBRA_DESK_BAND: ApprovedImage = {
  ...DEBRA_DESK,
  objectPosition: "50% 14%",
}

/** Reserved for wide lifestyle composition; full-body, so crop from the top. */
export const DEBRA_LIFESTYLE: ApprovedImage = {
  src: "/images/debra-allen-lifestyle-full-body.webp",
  alt: "Debra Allen standing at a kitchen island in a yellow blazer",
  objectPosition: "center 30%",
}

/** The image every closing CTA band uses. */
export const CLOSING_BAND_IMAGE = {
  src: DEBRA_DESK_BAND.src,
  objectPosition: DEBRA_DESK_BAND.objectPosition,
} as const
