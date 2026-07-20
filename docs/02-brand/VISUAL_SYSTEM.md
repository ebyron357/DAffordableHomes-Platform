# D'Affordable Homes — Visual System (Foundation Navy + Amber)

Status: Controlled implementation (Phase 3). Applied to Homepage, Calculator Hub,
Home Affordability Calculator, and the Consultation page. Full-site rollout is
gated on explicit approval of the controlled preview.

Positioning goal: **the trusted homeownership guide** — trustworthy, warm,
practical, professional, encouraging, community-aware, modern, respectful, clear,
approachable. Explicitly NOT a luxury brokerage, mortgage bank, nonprofit,
government portal, generic Realtor template, discount service, or trendy
lifestyle brand.

---

## 1. Competitive benchmark (summary)

Reviewed a capped set across the required mix (homebuyer education, brokerage/agent,
housing counseling/community, plus context references).

Common patterns observed:
- **Overused colors:** franchise blue + bright red/orange; luxury black + gold;
  eco green/teal (the rejected direction). Blue is near-universal, so a *deep,
  desaturated* navy reads more institutional/trustworthy than the common bright blue.
- **Photography:** heavy reliance on staged stock — keys to camera, corporate
  handshakes, exaggerated celebration, luxury kitchens. Authentic, editorial,
  realistic family moments are rare and therefore differentiating.
- **Typography:** mostly generic geometric sans; a warm serif for headings is
  uncommon in this category and signals care/editorial trust.
- **Trust signals:** licensing/attribution, plain-language education, and honest
  "this is an estimate" framing build more trust than testimonials-first layouts.
- **Accessibility:** many competitors fail contrast on gold/gray body text and
  low-contrast controls.

**Defendable territory D'Affordable Homes can own:** a calm, editorial,
*education-first* system — deep trustworthy navy + a warm human amber on warm
paper, with a serif/sans pairing and honest, plain-language guidance. Warm without
being a lifestyle brand; serious without being a bank.

RE/MAX was used only for context (information architecture, search behavior, trust
presentation). No franchise colors, layouts, wording, or trademarked presentation
were copied.

---

## 2. Visual-direction decision (scored)

Three credible directions scored 1–5 on the same criteria.

| Criterion | A. Foundation Navy + Amber | B. Homecoming Terracotta | C. Heritage Royal Blue + Brass |
|---|---|---|---|
| Trust | 5 | 3 | 4 |
| Warmth | 4 | 5 | 4 |
| Approachability | 4 | 5 | 4 |
| Professionalism | 5 | 3 | 4 |
| Accessibility | 5 | 4 | 4 |
| Distinctiveness | 4 | 5 | 3 |
| First-time-buyer fit | 5 | 4 | 4 |
| Photography compatibility | 5 | 4 | 4 |
| Calculator compatibility | 5 | 3 | 4 |
| Consultation-page compatibility | 5 | 4 | 4 |
| Mobile usability | 5 | 4 | 4 |
| Conversion visibility | 5 | 4 | 4 |
| Maintainability | 5 | 4 | 4 |
| **Total** | **62** | **52** | **51** |

**Selected: A. Foundation Navy + Amber.** Reasoning: it wins on the highest-priority
criteria in the decision hierarchy (trust, conversion, accessibility) while staying
warm and approachable. The deep navy result panels give the calculators the best
white-text legibility (validated live at 12.6:1), and amber provides a warm,
human action/accent color that is still AA-legible as text on paper. Terracotta was
warmer and most distinctive but weaker on financial gravitas and calculator-panel
contrast; royal blue drifted toward the generic real-estate blue we want to avoid.

---

## 3. Color token system

Format in `globals.css` is OKLCH. Hex equivalents below are approximate (sRGB) for
reference. All text/control pairs verified to meet **WCAG AA** (>= 4.5:1 for body
text, >= 3:1 for large text and UI boundaries). Ratios were computed by converting
each OKLCH value to sRGB relative luminance.

| Token | Approx hex | Role | Contrast (verified) | Approved uses | Prohibited uses |
|---|---|---|---|---|---|
| `--background` | `#f8f6f1` | Warm paper page background | base | Page background | Body text color |
| `--foreground` | `#25303f` | Primary ink text | 12.9:1 on bg | Headings, body | Large fills |
| `--card` | `#ffffff` | Card/surface | base | Cards, panels | Page background |
| `--muted` | `#efece4` | Alt background | base | Alt sections, insets | Primary CTAs |
| `--muted-foreground` | `#5c6675` | Secondary text | 5.9:1 on bg | Support copy, captions | Primary headings |
| `--primary` | `#1f3a5f` | Deep navy brand + primary action | fg 12.6:1 | Primary buttons, header wordmark, result panels, nav | Long body text |
| `--primary-foreground` | `#fbfaf6` | Text on navy | 12.6:1 on primary | Text/icons on navy | Text on paper |
| `--accent` | `#9a5a24` | Caramel-amber accent + secondary action | 4.6:1 on bg | Eyebrows, step labels, links, secondary CTA, focus underlines | Large background fills, body text blocks |
| `--accent-foreground` | `#fdfcf8` | Text on amber | 4.9:1 on accent | Text on amber fills | Text on paper |
| `--secondary` | `#eae7df` | Quiet button/surface | fg 8:1 | Secondary buttons, chips | Primary CTAs |
| `--secondary-foreground` | `#333d4a` | Text on secondary | 8:1 | Labels on secondary | On navy |
| `--border` | `#e2ded4` | Borders/dividers | 1.3:1 (decorative) | Card/input borders, dividers | Sole meaning carrier |
| `--ring` | navy | Focus ring | visible 2px | `:focus-visible` outlines | Decorative |
| `--success` | `#1f7a52` | Success state | AA on white text | Confirmations | Decorative green fills |
| `--warning` | `#b5791f` | Warning state | fg AA | Cautions | Body text |
| `--warning-foreground` | `#2a2410` | Text on warning | AA | Text on warning | On paper |
| `--destructive` | `#c23b34` | Error state | white text AA | Errors, required `*` | Franchise-style branding |
| `--info` | `#245b9c` | Informational | white text AA | Info notices | Primary brand color |

Prohibited across the system: the rejected green/sage/teal/emerald; black-and-gold
luxury styling; gold body text; beige-on-beige (only one paper + one alt background
are used); weak gray body text (secondary text is 5.9:1, not faint); arbitrary
purple/aubergine; franchise-style bright red; neon; large decorative gradients;
low-contrast controls; color as the ONLY signal of meaning.

Note on `--border` (1.3:1): borders are decorative and never the sole indicator —
inputs also carry visible labels + a 2px focus ring, and cards use fill + shadow
differences. This satisfies WCAG 1.4.11.

---

## 4. Typography

- **Headings:** Fraunces (serif) — warm, editorial, trustworthy; uncommon in the
  category = differentiating. Weights 400–600.
- **Body / UI:** Inter (sans) — highly legible at small sizes, neutral, modern.
- Body line-height 1.5–1.6; no decorative fonts for body; no body text < 14px.
- Two families only.

## 5. Icon system

- **Lucide** (`lucide-react`) — already the project's library; consistent stroke,
  optical size, and alignment. One library only. No AI-generated, cartoon, glowing,
  pseudo-3D, or gradient icons. Icons aid comprehension; text is used where clearer.

## 6. Spacing & layout

- Tailwind spacing scale (no arbitrary px), `gap-*` for rhythm, flexbox-first with
  grid for 2D sections. Mobile-first; verified no horizontal overflow at 375px.

---

## 7. Photography spec

Required structure: **Homepage hero = authentic Black family; About/Trust = Debra's
real photo.** Debra remains the clearly identified guide/educator/advisor.

Hard rules: no AI-generated people; do not alter anyone's appearance (crop/resize/
optimize only); no keys-to-camera, fake sold signs, corporate handshakes,
paperwork-pointing, mansions, or staged celebration; editorial and realistic, not
luxury.

### Slots and current state

| Slot | Component | Target ratio | Current interim | Final asset needed |
|---|---|---|---|---|
| Homepage hero | `components/home/hero.tsx` | 4:5 (portrait), responsive | `public/images/hero-home-exterior.png` — warm, people-free home exterior | Licensed photo of an authentic Black family in a realistic homeownership moment |
| About / Trust | `components/home/about-debra.tsx` | 1:1 | Monogram placeholder (no fabricated face) | Debra Allen's real, verified portrait |

When final assets arrive: drop the file into `public/images/`, update the `src`
and `alt` in the component (one-line change), keep `sizes`/dimensions to preserve
layout stability. Document each asset's **source, license, original URL/reference,
crop, responsive treatment, optimization, and alt text** in this section.

### Interim asset provenance

- `hero-home-exterior.png` — generated placeholder, **no people**, used only to hold
  the hero layout honestly until a licensed family photo is supplied. Not a person,
  so it does not violate the no-AI-people rule. Replace before production.
- The prior `hero-homeowner.png` was retired: it depicted a single AI-generated
  person, which violates both the no-AI-people rule and the "no single portrait as
  the primary emotional hero" rule.

---

## 8. Open blockers

1. **Licensed family hero photo** — cannot be sourced/licensed by the build agent;
   must not be AI-generated. Owner: client/Debra. Interim people-free placeholder in
   place; layout is final. Other work can continue.
2. **Debra's real portrait** — same constraint. Honest monogram placeholder in place;
   Debra remains clearly identified in copy. Owner: client/Debra.
3. **Professional/geographic facts** (brokerage, license, state, service area, IDX,
   disclosures) — remain `null`/neutral in `lib/site.ts` and surfaced honestly. No
   geographic claims published. Owner: client. Must be verified before any regional
   claim ships.
