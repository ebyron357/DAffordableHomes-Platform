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

The homepage hero uses licensed Pexels photo 7114188 by Monstera Production / Gabby K. Debra’s approved yellow-blazer portrait anchors the homepage trust section; the approved desk portrait supports consultation. No AI imagery or appearance alteration is permitted. See `docs/05-content/IMAGE_ASSET_REGISTER.md` for canonical provenance, licensing, crops, alt text, and repository paths.

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

Desktop frame lock: `1440` content width with `1256` inner content and `92px`
side margins. Per-section heights from the frame are `min-height` rather than
`height`, because two sections no longer match the static mock — see below.

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
- **Footers** (homepage and interior) are composed brand band → navigation →
  vendor credit → small compliance row. The brand band is white so the opaque
  logo PNG sits flush; on the navy band it could only ever be presented on a
  white card.

## Controlled rollout

The Figma homepage frame now governs the public homepage header, sections, and footer. Other routes retain the previous site chrome. Full-site rollout remains a separate approved implementation phase.
