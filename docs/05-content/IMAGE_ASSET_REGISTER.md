# Image asset register

Canonical register for approved public-site imagery. Debra Allen's photographs may receive crop, proportional resize, compression, and format optimization only. No generative fill, AI retouching, face replacement, beauty enhancement, or physical-appearance alteration is permitted.

| Original filename / source | Final filename and repository path | Source / photographer / license | Page and section | Crop and responsive behavior | Alt text | Editing | Approval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `DA0EB9C5-1800-4B9B-8A09-0D7D8D18C820.jpeg` | `debra-allen-primary-about.webp` — `apps/web/public/images/debra-allen-primary-about.webp` (1536×1229, landscape) | Client-approved original; photographer/license retained by client | Homepage, Meet Debra | `object-position: 48% center`. Desktop frame 440×520 (4:5); at ≤1100px the frame becomes 4:3 with a height cap, because a 4:5 frame at full tablet width grew to ~850px tall. The source is landscape, so the 4:5 frame crops horizontally only and never takes the top of her head; the 4:3 frame crops ~6% vertically, centred. Verified at 1440, 1024, 768, 430 and 375. | Debra Allen smiling in a yellow blazer at a kitchen counter | EXIF orientation, proportional resize, WebP compression | Approved |
| `ED9EC101-01F5-44BD-BBEB-3DB0AD100A9D.jpeg` | `debra-allen-advisor-desk.webp` — `apps/web/public/images/debra-allen-advisor-desk.webp` | Client-approved original; photographer/license retained by client | Consultation, support image | `object-position: 50% 35%`; responsive 4:5 frame preserves face | Debra Allen seated at her desk with a tablet | EXIF orientation, proportional resize, WebP compression | Approved |
| `855540B8-A31A-4564-8775-1D436040F39D.jpeg` | `debra-allen-lifestyle-full-body.webp` — `apps/web/public/images/debra-allen-lifestyle-full-body.webp` | Client-approved original; photographer/license retained by client | Reserved for wide lifestyle composition | Full-body composition; `object-position: center 35%` | Debra Allen standing at a kitchen island in a yellow blazer | EXIF orientation, proportional resize, WebP compression | Approved, controlled placement |
| Pexels photo 7114188 | `black-family-home-pexels-7114188.webp` — `apps/web/public/images/black-family-home-pexels-7114188.webp` (1800×1200) | [Pexels photo 7114188](https://www.pexels.com/photo/black-family-holding-hands-in-room-7114188/), Monstera Production / Gabby K, [Pexels license](https://www.pexels.com/license/) | `/homes` empty-state/supporting residential image; not the current homepage hero | `object-position: 52% center` inside the 548×560 rounded well. The five people sit slightly right of centre in the 3:2 source, so 52% is the value that centres *them*; a literal 50% clipped the father's shoulder at narrow widths. All five remain legible at 1440, 1024, 768, 430 and 375. | A Black family of five holding hands together in a bright living room | Proportional resize to 1800px maximum, WebP quality 82; no retouching | Approved for controlled redesign |
| Higgsfield GPT Image 2.5 generation `5136834d-c2cf-4bf9-8120-e509a1abe5ee` (2026-09-24) | `hero-north-texas-exterior.webp` — `apps/web/public/images/hero-north-texas-exterior.webp` (2688×1520) | Original AI generation for this project, via owner's Higgsfield account; no claim that it depicts a real home or listing | Homepage, primary hero exterior | 16:9 source; `object-fit: cover; object-position: 50% 50%` on desktop and mobile. A separate portrait rendition is used at widths ≤1600px; rendered crops require owner review. | A single-story brick suburban home with a front lawn and mature trees | PNG→WebP quality 86, no crop, retouching, or alteration of the generated content | Candidate awaiting owner review; previous Gamma still rejected |
| Higgsfield GPT Image 2.5 reference-based generation `fb990c64-11a4-406b-aa3a-fe2c1b542326` (2026-09-24) | `hero-north-texas-exterior-mobile.webp` — `apps/web/public/images/hero-north-texas-exterior-mobile.webp` (1744×2336) | Generated from the desktop candidate to preserve the same house, not a real listing | Homepage, portrait hero at viewport widths ≤1600px | 3:4 source; center crop in the narrow split and stacked mobile frame, with roof and eaves in view | Same single-story brick home with a front lawn and mature trees | PNG→WebP quality 85; no content edits | Candidate awaiting owner review |

The Pexels family image was downloaded on 2026-07-20. Pexels permits free website and commercial promotional use; the site does not imply that the pictured family endorses D'Affordable Homes.

The homepage exterior is a generated candidate. It is generic residential imagery, not a real listing, transaction, client property, verified address, or specific neighbourhood. The original Gamma asset was removed from the active hero after the owner's rejection.


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

## Unregistered assets: 2026-09-21 audit

Five Manus-era images sat in `apps/web/public/manus-storage/` with no recorded
source, photographer or licence, plus two unregistered files in
`apps/web/public/images/`. Each was opened and examined. Provenance could not be
established for any of them and none has been invented here. Three were found to
be misrepresenting something and are now off every route; the rest are described
honestly and left in place pending the owner's licence answer.

| File | Where it was used | What it actually shows | Disposition |
| --- | --- | --- | --- |
| `images/hero-homeowner.png` | `/start`, "A human guide" panel, alt text *"Debra Allen standing outside a home"* | A generated photograph of a woman who is **not** Debra Allen, on the porch of a small vinyl-sided house | **Off every route.** The slot now carries Debra's own registered photograph at the `DEBRA_DESK` crop. Barred in `RETIRED_ASSETS` |
| `manus-storage/couple-consultation_25d3a592.jpg` | `/start` NACA panel; Homes for Heroes guide body | A generated office scene whose framed poster and mug carry an **invented agency logo** and the tagline "Home is more than a place. / We're here to help." — branding that is not D'Affordable Homes | **Off every route.** The `/start` frame carries the route motif; the article block is removed. Barred in `RETIRED_ASSETS` |
| `manus-storage/neighborhood-community_101d8dfe.jpg` | `/neighborhoods` masthead, captioned *"North Texas — where the search happens"* | A dense north-eastern US block: four-storey brick walk-ups, fire escapes, a storefront row and a Puerto Rican flag mural. Not Dallas–Fort Worth | **Off every route.** The masthead uses the `route` motif. Barred in `RETIRED_ASSETS` |
| `manus-storage/hero-family_b1fab939.jpg` | `/start` hero | A family of four outside a small craftsman bungalow. Plausible licensed stock; nothing in it is false | **Left in place.** Licence unresolved — owner action |
| `manus-storage/home-keys-moment_20083d77.jpg` | `/start`; Garland guide body | Keys held at a doorway. Plausible licensed stock; nothing in it is false | **Left in place.** Licence unresolved — owner action |
| `images/planning-table.png` | `/first-time-buyers`; NACA guide body | A planning table scene. No recorded source | **Left in place.** Licence unresolved — owner action |
| `manus-storage/dah-logo_ff042b7b.png` | nothing | Retired Manus placeholder glyph | Already barred; unchanged |

**Owner action (unchanged for the three left in place):** confirm the source and
licence for each, or approve replacement. They are not deleted from the
repository, because removing imagery the owner may have licensed is not an
agent's decision — but `scripts/qa/site-audit.mjs` now fails if any of the three
retired files is served by any route again.

## Homepage hero — generated candidate pending review

The drawn D'Affordable Homes roofline remains the fallback beneath the still.
The previous Gamma generation (`9VO_H8Qh26Hg90ZLIvsSd.jpg`) was approved on
2026-09-22 and rejected after the new composition was reviewed on 2026-09-24.
That former image is no longer the hero asset.

The active landscape asset is Higgsfield job
`5136834d-c2cf-4bf9-8120-e509a1abe5ee` at 2688×1520, with portrait
rendition `fb990c64-11a4-406b-aa3a-fe2c1b542326` at 1744×2336. Neither
is evidence of a real listing, client property, verified address, or specific
North Texas neighbourhood. The resolver keeps the drawn scene if the main
still is removed; if the portrait is removed, the main still remains.
Optional motion encodes are absent and require separate provenance and approval.

**Crop review, 2026-09-24.** The image fills its frame at center position.
A local crop simulation checked the documented hero frames 1024×833 (1920),
784×833 (1440), 512×679 (1024), 768×480 (768), 430×323 (430), and 375×281
(375). The portrait rendition is selected at viewport widths ≤1600px and
keeps the full roof and both eaves in these simulations. The actual browser
render still needs a preview check before owner acceptance; this environment
could not download Chromium for automated screenshots.

**Hero byline placement, added 2026-09-24.** `debra-allen-primary-about.webp`
also renders at 56px (48px under 760px) in a circular frame beside "Debra
Allen, REALTOR®" in the hero copy, at the register's `48% center` crop rule.
The source is landscape, so a square frame crops horizontally only and the
face-safety gate measures a 0% top crop. It is marked decorative (`alt=""`,
`aria-hidden`) because the name beside it carries the meaning; the same
photograph is the Meet Debra composition further down the page.

**Owner acceptance, 2026-09-22.** The owner explicitly approved keeping the
current asset as-is, including the house-number plaque. No retouching or removal
is authorized.

**Owner rejection, 2026-09-24.** After reviewing the recomposed hero, the owner
rejected this still as not fitting the composition and directed that a
replacement be generated specifically for the hero layout (house mass
right-of-centre, roofline uncut, garage not dominant, no number, signage,
people or text, with a mobile variant of the same property if needed). The
old file was replaced in the hero slot; **the old image is not approved for release.** Its replacement is tracked in
`ACTIONS.md` ACT-017.

**Replacement status, 2026-09-24.** The Higgsfield connector generated a
2688×1520 single-story candidate, retrieved it, and placed it in the hero slot.
The original Dallas/DFW Zillow reference listings were unavailable in this
workspace, so this candidate was made from the written brief and remains
subject to the owner's visual review. The four earlier 1344×752 variants were
not used. The image is an illustration of a plausible home, not listing evidence.

**What the plaque actually does at render size, measured 2026-09-23.** Cropped
from the live hero at 1440 inside the 684×758 frame: at a device pixel ratio of
1 it is an illegible pale smudge, but **at a device pixel ratio of 2 it reads
clearly as `7093`** — a slashed zero, cleanly formed, not a malformed glyph.
Retina laptops and every modern phone render at 2 or higher, so "legible only
under full-resolution inspection" would be wrong: it is legible to a typical
visitor who looks at it. That does not change the owner's decision, and the
number is not a real or verified address — it is part of a generated image. It
is recorded here so nothing downstream relies on the plaque being unreadable:
**no copy, caption, metadata, structured data or alt text may present it as an
address, and the asset must not be used anywhere the plaque is enlarged further
or drawn attention to.**

**Where the generation shows, noted and not blocking.** At 2–3× magnification
the garage bay does not hold up: the soldier course above the opening dissolves
into vertical striations rather than resolving into bricks, the door is a
featureless slab carrying an entry-door lever with no panel seams or tracks,
and the cream jamb has a wavy edge. (The plaque is treated separately above: it
is legible rather than malformed, which is its own consideration.)
The masonry, windows, roofline and landscaping elsewhere in the frame read as
ordinary residential photography. At the sizes the hero actually renders that
bay is small and at the right edge, which is why this is recorded rather than
treated as a defect — but the asset should not be re-used at a larger scale, in
a crop that centres the garage, or anywhere a viewer can magnify it.

## Articles with no photograph of their own subject

Two guides carried Debra's portrait as their card and masthead image:

- *How Debra Allen Helps North Texas Heroes Buy or Sell a Home*
- *How to Buy a Home in Garland, Texas*

A portrait of the author is not a picture of the Homes for Heroes programme or
of Garland, and it made each card read as a profile rather than a guide. Both
now omit `featuredImage` entirely and render `ArticlePlate` — brand field,
architectural linework, the article's own category in type — which is the same
answer the interior mastheads already give when no licensed photograph exists
for a slot.

`featuredImage` is optional in the Sanity schema, the shared type and every
renderer. The moment an editor sets it on either article, the photograph takes
over the card, the masthead, the related-article card, the Open Graph image and
the Article JSON-LD, with no code change. Until then no image property is
published rather than an unrelated one being asserted as the article's subject.

**Owner action to restore photography on these two cards:** supply cleared photographs and set `featuredImage` (and `socialImage`) in Sanity, or place the files where this register can point at them. The homepage hero is no longer part of this owner-action item.

### Every source searched and final asset resolution, 2026-09-21–22

The photographs were looked for before this was written down as an owner
action. What was searched, and what was in it:

| Source | Result |
| --- | --- |
| `apps/web/public/**` | The previously registered photographs plus the audited legacy files and the owner-approved generated hero exterior now registered above |
| Full git history, including deleted files | Recovered `hero-home-exterior.png` and `black-family-moving-home-hero.webp` from PR #5. The first is a generated image of a small craftsman bungalow — the modest/dated tier the owner rejected, and the origin of that rejected direction. The second is an interior packing scene with a wall radiator, not North Texas. Neither is usable |
| `recovered-manus/` reference bundle | Same five Manus files already inventoried, plus a Debra portrait. No exterior |
| Figma, the visual source of truth (`x8TpOO9gK5tsbcjkEsK18A`, frame `11:4`) | `rawImages: []` — the approved frame carries **no** source photographs at all, only vector linework and icons. This confirms `DECISIONS.md` 2026-09-19: the frame's picture wells are placeholders |
| The shared Google Drive (`realtordebra.allen@gmail.com`) | Five `Realtor3-*` photographs from Debra's realtor shoot, plus one small Canva graphic. Portraits of Debra — which is exactly what must not go back on these two cards — not property exteriors |
| Sanity Content Lake asset library | Unreachable: this environment has no `SANITY_PROJECT_ID` / `SANITY_DATASET` and no `.env`. Owner-only |
| Stock libraries (Pexels, Unsplash, Wikimedia Commons, Openverse, Pixabay, and their CDNs) | Every host answers 403 at this environment's egress proxy |
| Image generation (Higgsfield) | Refused without a paid plan; no motion clip was generated or approved |
| Image generation (Gamma) | Produced `9VO_H8Qh26Hg90ZLIvsSd.jpg`; the owner approved the generated still on 2026-09-22, and the approved bytes were converted to WebP and committed as the homepage hero exterior |

The homepage hero item is now closed with the registered owner-approved generated still. Google Drive remains a usable transfer route for future cleared client assets, but it is no longer a blocker for the hero.

Remaining photography needs:

- **Homes for Heroes card** — a cleared image appropriate to the article subject.
- **Garland card** — a cleared Garland street or house.

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
