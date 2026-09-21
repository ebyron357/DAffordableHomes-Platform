# Image asset register

Canonical register for approved public-site imagery. Debra Allen's photographs may receive crop, proportional resize, compression, and format optimization only. No generative fill, AI retouching, face replacement, beauty enhancement, or physical-appearance alteration is permitted.

| Original filename / source | Final filename and repository path | Source / photographer / license | Page and section | Crop and responsive behavior | Alt text | Editing | Approval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `DA0EB9C5-1800-4B9B-8A09-0D7D8D18C820.jpeg` | `debra-allen-primary-about.webp` — `apps/web/public/images/debra-allen-primary-about.webp` (1536×1229, landscape) | Client-approved original; photographer/license retained by client | Homepage, Meet Debra | `object-position: 48% center`. Desktop frame 440×520 (4:5); at ≤1100px the frame becomes 4:3 with a height cap, because a 4:5 frame at full tablet width grew to ~850px tall. The source is landscape, so the 4:5 frame crops horizontally only and never takes the top of her head; the 4:3 frame crops ~6% vertically, centred. Verified at 1440, 1024, 768, 430 and 375. | Debra Allen smiling in a yellow blazer at a kitchen counter | EXIF orientation, proportional resize, WebP compression | Approved |
| `ED9EC101-01F5-44BD-BBEB-3DB0AD100A9D.jpeg` | `debra-allen-advisor-desk.webp` — `apps/web/public/images/debra-allen-advisor-desk.webp` | Client-approved original; photographer/license retained by client | Consultation, support image | `object-position: 50% 35%`; responsive 4:5 frame preserves face | Debra Allen seated at her desk with a tablet | EXIF orientation, proportional resize, WebP compression | Approved |
| `855540B8-A31A-4564-8775-1D436040F39D.jpeg` | `debra-allen-lifestyle-full-body.webp` — `apps/web/public/images/debra-allen-lifestyle-full-body.webp` | Client-approved original; photographer/license retained by client | Reserved for wide lifestyle composition | Full-body composition; `object-position: center 35%` | Debra Allen standing at a kitchen island in a yellow blazer | EXIF orientation, proportional resize, WebP compression | Approved, controlled placement |
| Pexels photo 7114188 | `black-family-home-pexels-7114188.webp` — `apps/web/public/images/black-family-home-pexels-7114188.webp` (1800×1200) | [Pexels photo 7114188](https://www.pexels.com/photo/black-family-holding-hands-in-room-7114188/), Monstera Production / Gabby K, [Pexels license](https://www.pexels.com/license/) | Homepage hero well in Figma frame 11:4 | `object-position: 52% center` inside the 548×560 rounded well. The five people sit slightly right of centre in the 3:2 source, so 52% is the value that centres *them*; a literal 50% clipped the father's shoulder at narrow widths. All five remain legible at 1440, 1024, 768, 430 and 375. | A Black family of five holding hands together in a bright living room | Proportional resize to 1800px maximum, WebP quality 82; no retouching | Approved for controlled redesign |

The hero was downloaded on 2026-07-20. Pexels permits free website and commercial promotional use; the site does not imply that the pictured family endorses D'Affordable Homes.


## Placement module

`apps/web/lib/content/imagery.ts` is this register expressed as code. Pages
compose with a named placement (`DEBRA_PORTRAIT`, `DEBRA_DESK`,
`DEBRA_DESK_MASTHEAD`, `DEBRA_DESK_BAND`, `DEBRA_LIFESTYLE`, `HERO_FAMILY`)
instead of typing a path and an `objectPosition` by hand. That is what stopped
the same photograph carrying one safe crop on one route and a clipped one on
fourteen others.

The desk photograph has three placements because the frame shape decides how
much `cover` throws away:

| Placement | Frame | `object-position` | Measured top crop |
| --- | --- | --- | --- |
| `DEBRA_DESK` | 3:4 upright | `50% 30%` | 0% |
| `DEBRA_DESK_MASTHEAD` | 4:3 masthead | `50% 22%` | 9.6% |
| `DEBRA_DESK_BAND` | full-bleed closing band (~1440×515) | `50% 14%` | 10.5% |

The top of her head sits about 14.7% down this source, measured against the
rendered page. The band previously used the upright 30%, which removed 22% off
the top and clipped her hair on every route carrying a closing band.
`scripts/qa/face-safety.mjs` now measures this at 1440, 1024, 768, 430 and 375
and fails above a 12% ceiling.

## Unregistered assets still served

Five Manus-era images remain in `apps/web/public/manus-storage/`. Four are
still referenced — `hero-family_b1fab939.jpg`, `couple-consultation_25d3a592.jpg`
and `home-keys-moment_20083d77.jpg` by `/start` and two seed articles, and
`neighborhood-community_101d8dfe.jpg` by `/neighborhoods`. None has a recorded
source, photographer or licence. They are not removed here because removing
imagery the owner may have licensed is not a visual-pass decision; they are
listed so the gap is visible. **Owner action: confirm provenance and licence for
each, or approve replacement.** The retired `dah-logo_ff042b7b.png` glyph
remains barred from every route and the audit fails if it reappears.

## Rendering rules

These apply to every registered asset and are enforced by
`tests/static/figma-homepage.test.mjs` and the browser checks in
`scripts/qa/site-audit.mjs`.

- **The frame defines the ratio; the image covers it.** No asset is ever
  stretched to fit a box.
- **`sizes` must describe the covering width, not the frame width.** Both
  homepage frames are covered by an image wider than the frame, so a `sizes`
  value equal to the frame made `next/image` pick a variant that was then
  upscaled — the hero decoded at 548×365 into a 548×560 box. The hero declares
  `850px` and the portrait `660px`, which is what each actually needs.
- **`naturalWidth > 0` is asserted for every image on every audited route.**
  The audit forces lazy images to load before measuring, so a zero is a real
  decode failure rather than an image that had not scrolled into view.
- **The retired Manus glyph** (`manus-storage/dah-logo_ff042b7b.png`) must not
  be served by any route; the audit fails if it appears.
- **No labelled empty well.** Where no licensed asset exists for a slot, the
  slot is redesigned — see the markets list and the listings empty state in
  `docs/02-brand/VISUAL_SYSTEM.md` — never filled with a bracketed label.
