# D’Affordable Homes controlled production visual system

Canonical editable source: [D’Affordable Homes — Final 3 Screens](https://www.figma.com/design/x8TpOO9gK5tsbcjkEsK18A/D%E2%80%99Affordable-Homes-%E2%80%94-Final-3-Screens?node-id=11-4). Production homepage frame: `daffordable-homes-home-page` (`11:4`).

## Brand mark

The current approved logo is `apps/web/public/images/daffordable-homes-official-logo.png` (640×427, opaque white background). It is the only logo asset that may appear in the UI: the homepage header (Figma frame `11:4`, brand slot at the left of the 94px header), the interior header, the interior footer, and the Organization JSON-LD. Render it at a fixed height with `width: auto`; never stretch, crop, invert, or redraw it as text. `apps/web/public/manus-storage/dah-logo_ff042b7b.png` is a Manus placeholder and is not the brand.

## Positioning

The trusted homeownership advisor: professional, practical, warm, community-aware, financially serious, optimistic, and clear without pressure.

The visual system communicates the brand promise: **Affordable. Accessible. Achievable.** It should feel trustworthy and established while showing progress, possibility, and a clear path toward homeownership.

## Typography

- Source Serif 4, weight 600: hero and major editorial headings only. Libre Baskerville and Georgia are fallbacks.
- Inter: body copy, navigation, forms, controls, calculator UI, labels, steps, and every numeral.
- Calculator and process numerals use tabular Inter figures.
- Fraunces is retired.

## Approved color system

The client-approved D’Affordable Homes logo direction is the source of truth for the website palette.

- Deep navy `#102B4E`: primary navigation, headings, primary buttons, footer, and high-value emphasis.
- Dark teal `#077783`: accessible secondary emphasis, links, selected states, and supporting controls.
- Bright teal `#18A9B4`: decorative brand accents, progress indicators, illustrations, and nonessential highlights.
- Progress green `#66AD45`: positive movement, milestones, supporting brand graphics, and success-oriented accents.
- Warm gold `#BF922D`: restrained signature accents, focus-ring contrast halos, badges, dividers, and premium emphasis.
- Near-white `#F7F9F8`: primary page background.
- White `#FFFFFF`: cards, forms, and content surfaces.
- Soft green-gray `#EDF3F2`: alternate sections and quiet supporting surfaces.
- Navy foreground `#10233F`: primary body and heading text.
- Muted slate `#52616F`: secondary body text.
- Border gray `#CBD7D6`: dividers, form controls, and boundaries.

## Color usage rules

- Navy remains the dominant trust color.
- Teal, green, and gold support the navy rather than compete with it.
- Essential text and controls must use navy, dark teal, or another verified accessible dark color.
- Bright teal, green, and gold are primarily for accents, progress, illustrations, icons, badges, and borders.
- Gold is not used for long-form body text.
- Keyboard focus uses an opaque deep navy inner boundary with a warm gold outer halo. Links, buttons, menus, forms, and calculator controls share this treatment; grouped calculator inputs apply it to the field boundary with `:focus-within` rather than relying on a translucent ring.
- Green is not used as the only signal for success or completion; pair it with text or an icon.
- Avoid large decorative gradients in website interface surfaces. Logo artwork may retain its approved blended color treatment when supplied as a final brand asset.
- Avoid black-and-gold luxury styling, neon colors, unrelated purple or red brand colors, and weak low-contrast text.
- Meaning is never carried by color alone.

## Layout

- 8pt spacing system with 4px micro-adjustments.
- 4-column mobile, 8-column tablet, 12-column desktop.
- Maximum content width: 1200px.
- Editorial grids, dividers, whitespace, and typography establish hierarchy. Cards are used only when grouping materially helps comprehension.
- Corners are restrained at 6–12px. Shadows are exceptional, not routine.

## Components and icons

Controls use visible labels, 44px minimum practical targets, clear focus, and restrained rectangular geometry. Nonessential icons are removed. Lucide remains only for neutral functional controls already present, such as the mobile-menu toggle.

Primary buttons use deep navy with white text. Secondary emphasis may use dark teal with white text. Green and gold should normally remain supporting accents unless contrast has been independently verified for the exact component.

## Photography

The homepage hero carries the owner-approved generated North Texas exterior (`hero-north-texas-exterior.webp`, registered as a generic residential exterior that depicts no real listing, address or client property), with the drawn brand roofline beneath it as the fallback. Debra’s approved yellow-blazer portrait appears twice on the homepage: at 56px in the hero byline, where it is decorative and the name beside it carries the meaning, and at scale as the Meet Debra composition. The approved desk portrait carries the closing band and consultation. The licensed Pexels interior (7114188) is retained for `/homes` only. No appearance alteration of any person is permitted. See `docs/05-content/IMAGE_ASSET_REGISTER.md` for canonical provenance, licensing, crops, alt text, and repository paths.

## Homepage palette

The production homepage (`11:4`) keeps the Figma frame's composition, spacing,
section order and geometry, but is painted with the approved logo-derived
system above rather than the frame's warm-cream screen tokens. Running two
palettes meant the homepage read as a different brand from every interior
route; there is now one system.

The scoped tokens on `.figma-home`:

| Token | Value | Role |
| --- | --- | --- |
| `--fh-page` | `#F7F9F8` | Near-white page background |
| `--fh-alt` | `#EDF3F2` | Soft green-gray alternate sections |
| `--fh-navy` | `#102B4E` | Navigation, headings, primary buttons, footer, CTA band |
| `--fh-body` | `#10233F` | Body and heading text |
| `--fh-muted` | `#52616F` | Secondary body text |
| `--fh-teal` | `#077783` | Links, eyebrows, active nav, secondary buttons |
| `--fh-teal-bright` | `#18A9B4` | Decorative accents and hover rules only |
| `--fh-green` | `#66AD45` | Seller-pathway accent; paired with text, never alone |
| `--fh-gold` | `#BF922D` | Header hairline, section rules, empty-state edge, footer divider |
| `--fh-border` | `#CBD7D6` | Dividers and boundaries |
| `--fh-white` | `#FFFFFF` | Cards, content surfaces, footer brand band |

Desktop content lock: `1440` content width with `1256` inner content and `92px`
side margins, carried by `.fh-shell` as a `max-width`. The page itself is
**not** locked: fields (hero, trust band, Meet Debra, markets, closing band,
footer) bleed to the viewport edge at every width, and only content is held to
the shell. The earlier `.figma-home { width: 1440px }` lock boxed the whole site
inside near-white margins on any wider monitor and made the hero read as a card
floating in empty space. Per-section heights from the frame are `min-height`
rather than `height`, because two sections no longer match the static mock —
see below.

### Hero composition

The frame's hero is copy on the left and a picture well on the right. In
production that is one composition rather than two panels:

- A four-track grid — fluid gutter, copy track (564px), photograph track
  (692px), fluid gutter — with the photograph spanning into the right gutter.
  At 1440 the gutters are the shell's 92px; wider, they grow and the
  photograph grows with them.
- The seam between the navy field and the photograph is a 180px navy wash on
  the picture's left edge, so the house emerges from the brand colour instead
  of meeting it as a hard vertical line. A low vignette weights the bottom of
  the frame. No scrim sits on the subject.
- A white panel with a gold edge straddles the seam and links to the
  homepage quiz. It is a real entry point, not ornament, and it is what ties
  the two halves together.
- The copy carries the mark's tagline behind a short gold rule, the headline,
  the lede, two CTAs (gold primary, light outline), and Debra's byline with
  her approved portrait — so the first viewport names the practice, the
  person, the market and a next action without the logo.
- The split holds from 900px up; under 900px the photograph stacks above the
  copy with a bottom fade into the field, and the seam panel becomes a plain
  block under the CTAs.

Gold at its brand value clears 4.5:1 against white but not against navy, so
the outlined CTA on the navy band uses a lightened `#E6BD55` for its label and
border while the brand value is kept for rules and dividers.

## Sections that intentionally diverge from the frame

The frame reserved image wells the approved asset library cannot fill, and
reserved listing cards no MLS feed backs. Shipping either as a labelled empty
box is a placeholder on a live site, so:

- **Markets** is an editorial two-column list of DFW cities with each city's
  county, replacing eight photo cards. It carries real local context and
  invents no market statistic, price or inventory claim.
- **Featured listings** renders a designed empty state when no MLS/IDX feed is
  connected: the situation stated plainly plus the two actions that exist. It
  never renders a listing-shaped card with bracketed price and address.
- **Footers** (homepage and interior) are composed brand band → local column →
  contact CTA → navigation → vendor credit → small compliance row. The logo is
  an opaque PNG with no alpha, so it will always sit on white. Making the whole
  band white to disguise that produced a mark apparently pasted onto a blank
  card, with an empty middle column beside it. The band is now the brand's soft
  green-gray and the plate is a designed sign with a gold rule under it.

## Interior route visual system (`.dh-*`)

The homepage composition did not extend past `/`. Interior routes were a navy
masthead with type on the left and nothing on the right, then white boxes on
near-white, each holding a heading, a paragraph and a button. Structurally
correct and indistinguishable from a requirements document.

The `.dh-*` layer in `app/globals.css` gives the interior the same vocabulary,
using only the approved palette:

- **Masthead** — two columns, always. The right column takes an approved
  photograph or the brand's architectural linework (`components/page/brand-motif.tsx`),
  so no route opens with half its first viewport empty. Navy field, teal wash,
  gold rule beneath.
- **Bands** — `page`, `white`, `alt`, `navy`, `teal`, `green`. A route
  alternates fields rather than running near-white end to end.
- **Splits** — a photograph and copy at equal weight, the photograph on an
  offset teal or green plate so it reads as composition rather than a card
  floating on white.
- **Features** — icon-supported pathway rows. An icon is required by the type,
  and it has to say what the thing *is*: a map pin for a place, a calculator for
  a tool, a key for a purchase.
- **Status strips** — where the site has to say a provider is not connected or
  a fact is not verified. The words are unchanged; the shape is a brand-coloured
  strip with a next action beside it rather than a warning panel adrift in an
  empty page.
- **Closing bands** — image-led, left-aligned, with a directional scrim. Centred
  copy over a centred subject put the heading across Debra's face and needed a
  scrim heavy enough to reduce her to a silhouette.

### Ornament, not stock photography

The approved register holds four photographs and three of them are Debra.
Repeating one portrait across eighteen routes is the tiny-thumbnail treatment
the brief rules out, and inventing city photography is fabrication. So the
masthead's second column and the homepage pathways carry architectural linework
— a North Texas roofline, the road from the mark, a key across a house. It says
"residential real estate" at a glance and claims nothing. It is always
`aria-hidden` and never stands in for a photograph in a content slot.

### Measured, not asserted

`scripts/qa/site-audit.mjs` measures painted brand area per route as a
percentage of the rendered page, counting each field once, and fails below a
floor (20% for content routes, 12% for long-form articles, which are reading
surfaces). `scripts/qa/face-safety.mjs` computes the rendered crop of every
Debra placement at all five breakpoints and fails if the top of a frame eats
into her head. `scripts/check-contrast.mjs` holds every brand pair, including
decorative icon badges, to 4.5:1.

## Controlled rollout

The Figma homepage frame governs the public homepage header, sections and
footer. Interior routes are composed from the `.dh-*` system above, which shares
the homepage's palette and rhythm without copying its geometry.
