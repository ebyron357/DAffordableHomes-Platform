# D’AFFORDABLE HOMES — DESIGN RESET BLUEPRINT

**Prepared by:** Manus AI  
**Investigation mode:** Read-only design and UX investigation  
**Canonical implementation reviewed:** `ebyron357/DAffordableHomes-Platform`, `main` at commit `56b381f`  
**Deployment reviewed:** [daffordablehomes-platform.vercel.app](https://daffordablehomes-platform.vercel.app/)  
**Date:** August 15, 2026

> **Purpose.** This document is the definitive design decision system for the next implementation pass. It settles the visual language, page composition, navigation, imagery, responsive behavior, trust presentation, and conversion hierarchy without implementing code or changing production.

## 1. Executive Diagnosis

The current site is not failing because it lacks useful content or functional ambition. Its implementation already has a credible education-first mission, a broad route system, calculators, programs, local pages, consultation paths, accessibility foundations, and an approved color system. The problem is that the **homepage’s first impression is organized around homeownership education before it is organized around Debra Allen as an independent residential realtor**. The live hero says “Practical guidance for Garland and DFW homebuyers” and “Real guidance for first-time buyers,” while Debra appears in a later “Meet Debra Allen” section.[1] [2] [3] That makes the site intelligible, but it weakens the immediate answer to the visitor’s most important question: “Who is the real person I would hire to help me buy or sell a home?”

The redesign must therefore preserve the site’s calm, educational promise while changing the **composition language** from “digital homeownership resource center” to “Debra Allen, REALTOR®, serving first-time buyers and homeowners in Garland and the DFW area.” Education remains a differentiator, but it becomes the method of Debra’s service rather than the apparent category of the business.

| Priority | Largest cause | Current effect | Decision |
|---|---|---|---|
| 1 | Debra is not the hero subject | The site can read as an information platform before it reads as a realtor brand | Put Debra’s approved portrait and name in the first viewport, with REALTOR® and service geography |
| 2 | “Education-first” is visually stronger than “real estate” | Calculators, programs, and process language can resemble finance, nonprofit, or education products | Add unmistakable residential signals: Debra, buyer/seller paths, homes, neighborhoods, representation, consultation |
| 3 | The homepage is a sequence of abstract paths and tools | The narrative starts with visitor tasks before establishing human trust | Reorder the story: person and promise, who she serves, buyer/seller choices, local proof, process, resources, consultation |
| 4 | The brand system is controlled but slightly institutional | Navy, teal, green, gold, and utility surfaces can feel like a platform or financial service | Keep approved equity but use warmer photography, editorial composition, and fewer boxed UI treatments |
| 5 | Repeated cards and tool grids risk component-library aesthetics | Repetition makes pages feel assembled rather than art-directed | Replace card grids with editorial rows, split layouts, featured stories, simple lists, and occasional grouped cards |
| 6 | Locality is stated more than shown | “Garland and DFW” is present, but the visual experience needs stronger place identity | Use verified local neighborhoods, streetscapes, maps, and market context only where sourced and current |
| 7 | Seller intent is not a clear first-class path | The current experience is visibly buyer-led | Add a verified seller pathway only after confirming the actual offering; otherwise label it as “Ask Debra about selling” rather than inventing a service promise |
| 8 | Photography provenance is uneven across the wider asset set | Generic family or home imagery can look interchangeable with another brand | Use the approved Debra portraits and registered licensed hero image; create a procurement plan for missing local and client-safe images |
| 9 | The route inventory is broad and duplicative | `/book` and `/consultation`, `/calculator` and multiple calculator hubs, `/naca` and `/programs/naca`, and `/neighborhoods`/`/areas` increase cognitive load | Establish canonical paths, redirects, and a simpler visitor-facing IA while preserving functional routes during migration |

The central design thesis is **“A real realtor who makes the path understandable.”** The website should feel like an established independent residential practice with an unusually good educational layer—not like an education portal that happens to mention a realtor.

## 2. Current Design Scorecard

The scorecard uses only the required classifications. “Unverified” means the repository or deployment did not provide sufficient evidence for a confident judgment; it is not a negative rating.

| Dimension | Classification | Evidence-based diagnosis |
|---|---|---|
| Brand perception | ACCEPTABLE | Calm, professional, and approachable, but not yet distinctive enough as a personal realtor brand |
| Realtor identity | WEAK | Debra is present and modeled in structured data, but not the dominant first-viewport person |
| Real-estate category fit | ACCEPTABLE | Homeownership, neighborhoods, programs, consultation, and homes routes exist; the hero is more guidance-led than representation-led |
| Layout | ACCEPTABLE | Strong whitespace and editorial dividers, but the page family still risks repeated tool/card compositions |
| Color | ACCEPTABLE | Approved navy/teal/green/gold system is coherent; it needs warmer application and less institutional density |
| Typography | STRONG | Source Serif 4 plus Inter is a credible editorial/utility pairing with clear role separation |
| Imagery | ACCEPTABLE | Approved Debra portraits and licensed Pexels hero are registered; broader local-image provenance remains incomplete |
| Navigation | WEAK | Current labels are understandable but top-level paths and duplicate route families are too broad for a small independent practice |
| Mobile | UNVERIFIED | Mobile-first rules and reduced motion exist, but a dedicated visual review of every route is still required before acceptance |
| Trust | ACCEPTABLE | Debra, REALTOR®, legal links, accessibility, and anti-fabrication rules exist; brokerage, license, verified reviews, and credentials require explicit inventory confirmation |
| Buyer journey | STRONG | Buyers can reach calculators, programs, neighborhoods, education, and consultation, but the path is content-heavy |
| Seller journey | UNVERIFIED | Seller-specific offering and proof were not verified in the reviewed homepage/repository evidence |
| DFW identity | ACCEPTABLE | Garland and DFW are named consistently; more verified place-based photography and neighborhood content are needed |
| Garland identity | WEAK | Garland is named, but the visual and editorial system does not yet make Garland feel like a lived local market |
| Conversion | ACCEPTABLE | Consultation is consistently available, but the hierarchy needs one calm primary CTA and fewer competing tool invitations |
| Content presentation | ACCEPTABLE | Educational content is substantial and responsibly framed; content needs stronger editorial art direction and clearer page purpose |
| Overall professionalism | ACCEPTABLE | Functional and careful, but the visual composition has not fully crossed from platform foundation to polished independent realtor presence |

## 3. Independent Realtor Competitor Benchmark

The correct benchmark category is the **individual realtor or boutique residential practice**, not Zillow, Redfin, Realtor.com, Trulia, or a large marketplace. The benchmark source’s editorial conclusion is directionally useful: effective real-estate sites keep the agent visible, help buyers and sellers calmly, use education as marketing, and treat photography as a primary trust device.[4]

### 3.1 Benchmark profiles

**Calcagno-Hamilton Real Estate Group — Santa Barbara, Montecito, and Santa Ynez Valley.** This boutique team makes geography, named agents, licenses, market experience, transaction proof, and neighborhood discovery visible early. Its strongest transferable principle is the combination of **people + place + proof**. D’Affordable should adopt the order, not the luxury-market claims or team-scale language.[5]

**Jennifer Ferland — San Francisco and Marin County.** Jennifer’s site explicitly identifies her as a REALTOR®, names her buyer and seller markets, articulates a personal service philosophy, and uses candid editorial copy to make the agent feel human. Buying, selling, services, resources, and trust proof are distinguishable paths. D’Affordable should learn from the direct personal voice and explicit dual-audience structure, while avoiding unsupported awards, production totals, or concierge offerings.[6]

**Keri White Team — Los Angeles.** Keri White uses a strong personal name, direct consultation CTA, geographic neighborhood coverage, media, testimonials, credentials, and team proof. It demonstrates that a local realtor brand can support content and listings without losing a human center. D’Affordable should borrow the concrete neighborhood architecture and ongoing editorial rhythm, not the luxury-market darkness, team scale, or high-production visual style.[7]

**Debra Smalley — Los Angeles.** The source collection describes Debra Smalley as a local Los Angeles realtor with a long personal connection to the market and prior commercial real-estate experience. The lesson is to make the agent’s biography and local credibility a reason to trust the service. D’Affordable should not copy luxury positioning or imply equivalent commercial experience without verification.[4]

**Sherrie Couture — Durham.** The source collection describes a well-rounded buying and selling experience with listings, selling style, and freebies/resources. The transferable principle is a clear bridge between service, education, and practical takeaways. D’Affordable should use a similar bridge through guides and calculators, but avoid generic lead magnets or unverified free-offer claims.[4]

**Ashford Realty Group / All Homes Colorado — Colorado Springs.** The source collection highlights team, blog, testimonials, and discussion of digital marketing in the context of buying and selling. The useful lesson is that trust content and educational content can coexist with service positioning. D’Affordable should keep testimonials only when permission and provenance are verified.[4]

**Marci Homes — Washington.** The source collection describes a mother-daughter team combining experience with a modern, youthful marketing approach. The lesson is that warmth can be expressed through real people and relationship structure rather than decorative color or excessive friendliness. D’Affordable should translate this into Debra’s actual personality and community presence, not create a fictional team narrative.[4]

**Cindy Lin Realty Team — market not reliably verified in the available source evidence.** The source collection includes the site as a realtor-team example, but the current investigation did not establish enough independent content to make detailed claims about its services or proof. It is retained as a visual reference candidate only, not as a factual benchmark.[4]

### 3.2 Repeatable principles and explicit non-copy rules

| Principle to adopt | Why it matters for D’Affordable | Do not copy |
|---|---|---|
| Put the agent’s name, face, role, and market in the first screen | Immediately answers who the visitor is hiring | Luxury-agent hero posturing or unsupported awards |
| Show buyers and sellers as distinct entry points | Prevents the site from feeling buyer-only | A seller service claim before the offering is verified |
| Treat local areas as editorial content, not a generic dropdown | Turns geography into expertise | Invented rankings, prices, school scores, or neighborhood claims |
| Use photography as trust infrastructure | Real people and place make the category legible | AI-generated people or generic stock presented as local |
| Use education to reduce anxiety | Fits the approved brand voice and differentiates Debra | Turning every page into a course or calculator dashboard |
| Use one primary consultation invitation | Makes the next action obvious without pressure | Repeated banners after every section |
| Publish proof carefully | Credentials, licenses, reviews, and affiliations can establish trust | Fabricated testimonials, transaction totals, or performance claims |
| Keep visual systems restrained | Established real-estate practice feels composed, not noisy | Black-and-gold luxury, SaaS gradients, or dense component grids |

## 4. Recommended Creative Direction

### 4.1 Positioning and visual personality

The final direction is **Warm Residential Editorial**: an independent realtor practice with the clarity of a trusted advisor, the visual calm of a well-made local magazine, and the practical usefulness of a thoughtful buyer guide. It is not luxury theater, fintech, nonprofit advocacy, government service design, or SaaS product marketing.

“Premium” here means **considered and trustworthy**: consistent spacing, excellent photography, controlled type, quiet surfaces, precise forms, and confident editing. It does not mean black backgrounds, gold text, oversized gradients, glassmorphism, excessive animation, or a high-end property marketplace.

### 4.2 Global decisions

| System | Definitive decision |
|---|---|
| Composition | Use fewer, larger narrative moments. Alternate full-bleed or split editorial sections with short utility blocks. Do not stack identical three-card sections by default. |
| Layout grid | Keep the 1200px maximum and 12-column desktop grid; use a 4-column mobile grid with deliberate mobile compositions rather than automatic stacking. |
| Surfaces | Near-white background, white content surfaces, and one soft green-gray alternate surface. Dark navy is reserved for navigation, selected high-value sections, footer, and focused CTA bands. |
| Cards | Use cards only when grouping materially improves comprehension, such as calculator tools or program comparisons. Prefer open rows, dividers, and editorial links elsewhere. |
| Radius | Keep restrained 6–12px corners. Primary CTA, form fields, and image frames should not become pill-shaped. |
| Shadows | Exceptional only: one subtle shadow for floating menus or a clearly elevated form. No shadow on every card. |
| Borders | Use 1px warm gray or green-gray dividers to establish rhythm. Avoid borders around every text block. |
| Whitespace | Use generous but purposeful spacing. Every large gap must separate a narrative idea, not compensate for missing content. |
| Density | Moderate on desktop, compact but breathable on mobile. One major idea per viewport segment. |
| CTA treatment | Primary: `Talk with Debra` or `Book a consultation`, depending on verified booking flow. Secondary: `Start with your next step`. Use one primary CTA per page and contextual text links elsewhere. |
| Motion | Restrained reveal, image fade, and accordion transitions only. Respect reduced motion. No floating widgets or animated gradients as brand devices. |
| Iconography | Use neutral functional icons only. Do not use icons to decorate every card. |
| Voice | Use Debra’s approved calm, direct, nonjudgmental language. Name the concern, reassure without promising, teach one idea, give one next step, invite conversation.[8] |

### 4.3 Desktop and mobile behavior

On desktop, the header should remain a compact, confident shell: Debra’s name and REALTOR® role should be legible, the primary CTA should be visible, and the navigation should expose only the principal visitor paths. On mobile, the header should show the D’Affordable Homes mark, a short `Talk with Debra` action, and a simple menu. The first viewport should contain the person, the role, the service geography, and one primary action without requiring a long scroll.

Mobile sections should not simply become a long column of desktop cards. The hero should place Debra’s portrait first or immediately adjacent to the opening message, buyer and seller paths should become a two-choice stacked decision block, local proof should use a horizontal editorial rhythm or a single featured place, and calculator pages should prioritize one input group at a time with clear results and a visible consultation handoff.

## 5. Homepage Wireframe

The homepage is a **trust-to-choice-to-proof-to-conversation** narrative. It should not open with a tool directory.

| Section | Purpose and message | Desktop composition | Mobile composition | Imagery and CTA |
|---|---|---|---|---|
| 1. Compact header | Establish D’Affordable Homes, Debra Allen, REALTOR®, Garland/DFW, and the primary action | Wordmark left; four primary nav labels; `Talk with Debra` right | Wordmark, menu, compact CTA | No hero image in header; CTA remains persistent |
| 2. Hero: Debra + homes | Immediately communicate independent residential realtor | Two-column: approved Debra portrait on one side, `Debra Allen, REALTOR®` and service promise on the other; include a restrained home/local image detail only if composition supports it | Portrait appears first or as a top image; message and CTA follow | Use approved Debra portrait. Primary `Talk with Debra`; secondary `See how I help` |
| 3. Who I help | Clarify first-time buyers, renters preparing to buy, and any verified seller audience | Short editorial introduction with a three-line audience list, not three cards | Stacked text with one highlighted audience at a time | No additional image required; contextual link to buyer/seller path |
| 4. Choose your path | Remove ambiguity for buyer and seller intent | Two wide, asymmetric editorial panels: `Buying a home` and `Selling a home`, each with audience, what Debra helps with, and one link | Two stacked panels with distinct image crops or none; do not use equal card grid if seller offering is unverified | Buyer CTA `Plan your first step`; seller CTA only after offering verification |
| 5. Garland and DFW local knowledge | Make place visible and specific | Featured Garland/local image with short verified description plus a secondary DFW areas list | One featured local story followed by an accordion or concise list | Use verified local photography or licensed image with honest caption; `Explore areas` |
| 6. How Debra works | Explain the method without making the site look like a course | Four-step horizontal editorial line: listen, plan, search/prepare, represent/next step; labels must match verified service | Vertical stepper with short descriptions and no oversized numerals | No card containers; `See the process` text link |
| 7. Programs and affordability guidance | Connect NACA, Homes for Heroes, and affordability education to Debra’s process | One featured program story plus a compact list of other verified paths | Featured program followed by stacked links | Use program-specific imagery only if provenance and relevance are clear; `Explore programs` |
| 8. Meet Debra in context | Deepen trust after the visitor understands the service | Portrait plus a first-person paragraph, credentials/affiliations only if verified, and a local/personal detail | Portrait, short bio, expandable fuller story | Approved yellow-blazer portrait; `Meet Debra` |
| 9. Practical resources | Demonstrate usefulness without taking over the brand | Editorial list of three featured resources: calculator, local guide, article | Three stacked link rows, not three large cards | No generic image required; `Browse resources` |
| 10. Proof | Show verified testimonials, reviews, or affiliations | Use one or two verified quotes with attribution or a quiet proof strip; omit entirely if unverified | One quote or no quote; never use placeholder proof | Only approved, permissioned material |
| 11. Consultation close | Invite a human conversation | Warm near-white or soft green-gray band; copy `You do not need every answer before you talk with Debra.` | Short band with one CTA and phone/email if verified | `Book a consultation` |
| 12. Footer | Provide legal, contact, service area, and secondary navigation | Three columns plus legal line | Accordion or stacked sections, with legal links easy to reach | Preserve TREC and fair-housing links where applicable |

### Hero copy direction

**Eyebrow:** `DEBRA ALLEN, REALTOR® · GARLAND + DALLAS–FORT WORTH`  
**Headline:** `A clear path to the home that fits your life.`  
**Support:** `I help first-time buyers and families prepare, understand their options, and move forward with a plan—not pressure.`  
**Primary CTA:** `Talk with Debra`  
**Secondary CTA:** `Start with your next step`

These are recommended directions, not verified business claims beyond the existing first-time-buyer and Debra positioning. Confirm the exact service audience and brokerage/legal language before publishing.

## 6. Internal Page Architecture

The internal system must use distinct page types. Not every page should be a hero followed by three cards, a four-step strip, and a CTA banner.

| Page | Recommended architecture |
|---|---|
| About | Portrait-led introduction; what Debra believes; verified role/credentials; how she works; local connection; optional personal detail; consultation invitation |
| Programs hub | Plain-language introduction; program eligibility boundaries; NACA and Homes for Heroes as distinct editorial entries; official-source links; what Debra can and cannot advise on; next step |
| Individual program | Who it may serve; what the program is; official requirements/source links; where real-estate guidance fits; FAQ; consultation handoff; no promises of eligibility or benefits |
| Areas hub | DFW/Garland map or verified area list; how to use neighborhood pages; featured local guide; no unsupported rankings or prices |
| Garland/local market | Garland identity, verified neighborhood context, local housing questions, current market data only when sourced and dated, local imagery, contact Debra link |
| Buyer resources | Start with concern or stage; guide groups by readiness; calculators as supporting tools; one next-step invitation |
| Seller resources | Only publish after the seller offering is verified. Use seller questions, preparation, valuation boundaries, representation process, and consultation—not fabricated results |
| Calculators | One clear purpose; inputs with plain-language assumptions; result with caveat; `Discuss this with Debra` handoff; no lending advice or approval implication |
| Blog hub | Editorial index with featured local article, topic filters, and concise article cards/rows; separate evergreen guides from dated market commentary |
| Article | Concern-led title; byline/author context; one idea; local facts with dates and sources; related resource; one consultation invitation; official-source section where relevant |
| Consultation | Human welcome, what happens next, expected duration only if verified, privacy/consent, concise form, alternate contact, success/error states, Debra portrait |
| Contact | Direct contact methods and service area; reason-based contact options; concise form; legal/privacy note; no duplicate booking experience |

## 7. Navigation Specification

### Desktop navigation

The recommended top-level hierarchy is:

| Label | Destination | Rationale |
|---|---|---|
| **Buying** | `/buying` or canonical existing buyer hub | Makes buyer intent unmistakable; can initially resolve to `/first-time-buyers` if that is the approved route |
| **Selling** | Verified seller route only | Do not expose a promise until verified; if unavailable, use `About Debra` or a contextual inquiry link |
| **Areas** | `/areas` | Consolidates `/areas`, `/neighborhoods`, and `/areas/garland` into a clearer local-market family |
| **Resources** | `/resources` | Consolidates calculators, programs, articles, FAQs, and events under an understandable umbrella |
| **About Debra** | `/about` | Keeps the person visible and easy to find |
| **Talk with Debra** | `/consultation` | Persistent primary CTA |

The current `Programs` and `Blogs` labels are not wrong, but they are less useful as primary navigation than `Resources`, `Buying`, and `Areas`. Existing routes should remain functional during migration, with canonical links and redirects chosen by engineering after route analytics and SEO review.

### Mobile navigation

The mobile menu should contain `Buying`, `Selling` only if verified, `Areas`, `Resources`, `About Debra`, `Contact`, and `Legal`. `Talk with Debra` should be a highlighted action above or below the menu list. Programs, calculators, blogs, FAQs, and events should be nested under Resources rather than presented as a long flat list.

### Footer navigation

Use four groups: `Work with Debra`, `Explore`, `Resources`, and `Legal`. The footer must retain verified contact details, service area, brokerage/license disclosures, TREC links where required, privacy, terms, accessibility, Fair Housing, and Equal Housing Opportunity links. Do not add social icons or review badges unless their destinations and provenance are confirmed.

## 8. Color System

The redesign should **keep the existing approved brand colors** and refine their proportion and context rather than replace them.[9]

| Role | HEX | Status | Usage | Rationale |
|---|---|---|---|---|
| Deep navy | `#102B4E` | KEEP EXISTING BRAND COLOR | Headings, header, primary CTA, footer, key trust band | Strong residential-professional anchor |
| Navy foreground | `#10233F` | KEEP EXISTING BRAND COLOR | Body and heading text where the deepest navy is too strong | High legibility and continuity |
| Dark teal | `#077783` | KEEP EXISTING BRAND COLOR | Links, selected states, secondary CTA, local markers | Adds warmth and place-oriented distinction without SaaS brightness |
| Bright teal | `#18A9B4` | KEEP EXISTING BRAND COLOR | Progress indicators, small decorative accents, illustrations | Supporting accent only, never main text or dominant background |
| Progress green | `#66AD45` | KEEP EXISTING BRAND COLOR | Milestones, positive states, program/process accents | Communicates movement and possibility with text/icon pairing |
| Warm gold | `#BF922D` | KEEP EXISTING BRAND COLOR | Small dividers, badges, focus halo, signature accent | Keeps brand equity without luxury overuse |
| Near-white | `#F7F9F8` | KEEP EXISTING BRAND COLOR | Main page background | Softens the interface and avoids clinical white |
| White | `#FFFFFF` | KEEP EXISTING BRAND COLOR | Forms, occasional cards, reading surfaces | Clear content contrast |
| Soft green-gray | `#EDF3F2` | KEEP EXISTING BRAND COLOR | Alternate sections, consultation close, quiet support bands | Makes the system warmer and more residential |
| Border gray | `#CBD7D6` | KEEP EXISTING BRAND COLOR | Form boundaries and restrained dividers | Avoids excessive dark borders |

The visual reset is therefore not a palette reset. It is an **application reset**: navy should dominate fewer, higher-value moments; teal and green should support understanding; gold should be scarce; and the page should rely on photography, typography, and composition for warmth rather than decorative gradients.

## 9. Typography System

| Role | Decision |
|---|---|
| Major headings | Source Serif 4, weight 600 where available; use editorial sentence case and short line lengths |
| Body, nav, controls | Inter, regular to semibold; retain tabular figures for calculators and process numerals |
| Eyebrows | Inter semibold, uppercase sparingly, 0.12–0.16em tracking, 12–13px; use only for role, geography, or section context |
| H1 desktop | 56–68px, line-height 1.02–1.10, maximum 8–10 words where possible |
| H1 mobile | 38–46px, line-height 1.05–1.12; avoid wrapping a key phrase into four or more lines |
| H2 desktop | 36–46px, line-height 1.08–1.15 |
| H2 mobile | 30–36px, line-height 1.10–1.18 |
| H3 | 22–28px, line-height 1.15–1.25 |
| Body | 17–19px desktop and 16–18px mobile; line-height 1.55–1.70 |
| Reading width | 62–75 characters for article body; 45–60 characters for hero support copy |
| Buttons | Inter semibold, 15–16px, sentence case, minimum 44px practical target |
| Numerals | Inter tabular figures for calculators, steps, prices, and dates |

The current Source Serif 4 plus Inter decision is strong and should remain. The important change is not selecting a new font; it is giving typography more authority through fewer words, stronger role hierarchy, and less competition from boxed component patterns.

## 10. Photography / Asset Plan

### 10.1 Existing assets to keep and use deliberately

| Asset | Classification | Recommended use |
|---|---|---|
| `debra-allen-primary-about.webp` | VERIFIED REAL AGENT IMAGE, client-approved | Hero portrait or prominent About/Meet Debra section; preserve face and approved crop |
| `debra-allen-advisor-desk.webp` | VERIFIED REAL AGENT IMAGE, client-approved | Consultation/support section, article author panel, or Contact page |
| `debra-allen-lifestyle-full-body.webp` | VERIFIED REAL AGENT IMAGE, client-approved | Wide editorial composition where full-body framing is useful |
| `black-family-home-pexels-7114188.webp` | LICENSED STOCK, approved Pexels source | Homepage family/home context; do not imply endorsement or client identity |
| `hero-family_b1fab939.jpg` and other `manus-storage` imagery | UNKNOWN PROVENANCE until reconciled against the asset register | Do not use as authentic local or client photography until provenance and approval are recorded |

The asset register explicitly prohibits generative fill, AI retouching, face replacement, beauty enhancement, or physical-appearance alteration of Debra’s photographs.[10]

### 10.2 Procurement brief

| Missing image | Subject and context | People/Debra | Orientation and ratio | Intended use | Licensing and acceptance |
|---|---|---|---|---|---|
| Debra outside a North Texas home | Debra at the front walk or porch of a modest, attractive residential home in Garland/DFW | Debra appears; no identifiable client without release | Landscape 3:2 and portrait 4:5 crops; minimum 2400px long edge | Homepage local-realtor hero variant, About, local pages | Client-owned or commissioned; real location permission; no AI generation |
| Debra consulting with a buyer | Natural table conversation with documents or tablet, not staged handshake | Debra plus consenting model/client; releases required | Landscape 3:2; portrait 4:5 | Buying page, consultation, process | Commissioned brand photography; release and privacy controls |
| Seller consultation | Debra listening beside a home or at a kitchen table | Debra plus consenting model/client; releases required | Landscape 3:2 | Verified seller page only | Commissioned only after seller offering is confirmed |
| Garland residential streetscape | Real, recognizable but non-sensitive residential context; avoid implying a specific client property | No required people | Landscape 16:9 and square crop | Garland/local-market page, Areas hub | Licensed or commissioned; location and date recorded |
| DFW neighborhood detail | Front porches, sidewalks, trees, local community texture; no invented landmark | Optional background people only | Landscape 3:2 | Areas and articles | Licensed/commissioned; alt text must be factual |
| First-time buyer planning moment | Adult buyer reviewing a simple plan with Debra in a home setting | Debra optional; model release required | Portrait 4:5 and square | Buyer resources and program pages | Licensed/commissioned; no implied program eligibility |
| Keys / closing moment | A handoff or doorway moment only if genuinely captured and released | Debra optional; all identifiable people released | Landscape 3:2 | Consultation close or process | Commissioned/documented; never imply a real client outcome if staged |
| Local market editorial still life | Notebook, keys, neighborhood map, or home details with restrained styling | No people required | Landscape 3:2 | Blog and market-report covers | Commissioned or licensed; avoid generic financial imagery |

Every future asset record must state subject, location, people, Debra presence, property type, activity, tone, orientation, aspect ratio, resolution, intended page/section, desktop crop, mobile crop, licensing, attribution, and approval status. AI-generated people or local scenes must never be represented as authentic local photography.

## 11. Components to Keep

The following work is worth preserving because it is functional, accessible, or aligned with the approved system.

| Existing element | Keep because | Guardrail |
|---|---|---|
| Skip link and focus treatment | Strong accessibility foundation | Recheck contrast and focus visibility after visual restyling |
| Source Serif 4 + Inter pairing | Approved, legible, editorial, and useful for realtor/education balance | Improve hierarchy and copy length rather than replacing fonts |
| Approved navy/teal/green/gold tokens | Existing brand equity and documented contrast intent | Refine proportion, do not expand palette casually |
| Calculator logic and assumptions | Useful buyer planning function | Keep caveats, input labels, and consultation handoff |
| Program pages and official-source framing | Supports NACA/Homes for Heroes education responsibly | Make boundaries explicit and avoid eligibility promises |
| Debra approved portraits | Strongest trust assets | Use earlier and more consistently; preserve identity |
| Consultation form validation and fallback behavior | Functional conversion foundation | Shorten visible form and clarify what happens after submission |
| Legal/accessibility/fair-housing links | Required trust and compliance layer | Bring them into a more legible footer hierarchy |
| Reduced-motion behavior | Correct accessibility practice | Maintain for all new motion |
| Anti-fabrication content rules | Essential to trust | Treat as acceptance criteria, not editorial preference |

## 12. Components to Redesign

**Header and navigation** must become more personal, less platform-like, and simpler. The current navigation is serviceable but exposes too many equally weighted destinations for a small independent practice. Add Debra’s role and service area to the brand lockup or an adjacent utility line, simplify labels, and make the consultation action the only visually dominant control.

**Hero** must change from a family-stock image plus education-first headline to a Debra-centered real-estate introduction. The family image can remain as supporting context or a later section; it should not be the only human signal in the opening viewport.

**Homepage pathway sections** should move from three parallel task choices and repeated tool cards to two or three narrative decisions. A visitor should first understand Debra, then choose buying/selling/resources, then see local proof and process.

**Program and calculator presentation** should be editorialized. Keep the tools, but reduce dashboard density, explain assumptions near the result, and always connect the tool to a real conversation without implying lending approval.

**Trust modules** should become a verified proof system. Present Debra identity, brokerage, license, affiliations, reviews, testimonials, and transaction claims only after classifying each item as verified, unverified, missing, or not applicable.

**Footer** should be shorter, more human, and more useful. Keep legal links but separate them visually from the primary practice navigation.

## 13. Components to Remove

Remove or consolidate repeated three-card grids when the items are simply links. Remove card-within-card compositions, decorative icons with no functional meaning, generic “premium” dark bands, repeated `Book Consultation` banners that interrupt every page, duplicated calculator hubs where one canonical path can serve, duplicate `/book` and `/consultation` experiences, and any image whose provenance cannot be established. Do not remove functional calculators, official-source links, accessibility controls, or legal disclosures solely because they are not visually glamorous.

## 14. Page-by-Page Redlines

| Surface | KEEP | CHANGE | REMOVE | ADD |
|---|---|---|---|---|
| Homepage | Mission, calculators, programs, Debra content, process, consultation | Hero, order, buyer/seller clarity, local proof, imagery | Tool-first opening and repeated grid rhythm | Debra-first trust frame and verified real-estate signals |
| About | Debra story and approved portrait | Put role, geography, method, and verified proof earlier | Generic biography blocks | Personal point of view and clear work-with-Debra CTA |
| Programs | NACA/Homes for Heroes educational content | Explain boundaries and Debra’s role | Unsupported eligibility or benefits language | Official-source panel and decision guidance |
| NACA | Official framing and practical education | Make program-vs-realtor boundary unmistakable | Any implied approval path | `What to confirm with NACA` and `Talk with Debra about the real-estate steps` |
| Homes for Heroes | Program explanation if verified | Separate official program facts from Debra’s guidance | Unverified savings/benefit claims | Source links and eligibility caveat |
| Areas | Garland and DFW route family | Consolidate labels and add place-based editorial composition | Unsupported rankings, prices, or school claims | Verified neighborhood photography and dated local context |
| Garland | Garland title and local intent | Make it visually local, not merely text-local | Generic repeated area cards | Local guide, map/context, and source/date labels |
| Buyer resources | Education, guides, calculators | Organize by concern/stage | Resource overload above the fold | Clear next-step chooser |
| Seller resources | None until verified | Confirm actual offering first | Invented seller claims | Seller path only after business confirmation |
| Calculators | Calculation logic and assumptions | Improve result hierarchy and human handoff | Dashboard-like repeated cards | `Discuss this estimate with Debra` |
| Consultation | Form, validation, privacy | Put Debra and expectations around the form; shorten fields | Duplicate booking route and unnecessary questions | Clear success/error states and alternate contact |
| Contact | Contact purpose and legal safety | Use direct human contact hierarchy | Duplicate consultation content | Reasons to contact and service-area clarity |
| Blog | Local/educational articles | Editorial index and stronger author context | Generic thumbnail grid | Featured story, source/date, one CTA per article |
| Article | FAQ/source sections and educational intent | Improve scanability and local author trust | Repeated CTA banners | Debra author panel, related guide, source notes |
| Header | Skip link, core routes, CTA | Simplify IA and center Debra | Flat route overload | Role/geography microcopy |
| Mobile nav | Responsive behavior | Reduce depth and surface primary action | Long ungrouped menu | Intent-first menu groups |
| Footer | Legal and accessibility links | Reorganize into human/practice/explore/legal | Repeated slogans and redundant links | Verified contact and brokerage information |

## 15. Implementation Blueprint

This is a bounded handoff sequence. It is not an instruction to implement within this investigation.

| Sequence | Engineering/design work | Definition of done |
|---|---|---|
| 1 | Lock the global visual system | Tokens, type roles, surface rules, radius, border, shadow, focus, and spacing are documented and used semantically |
| 2 | Apply typography and color | Homepage and one internal page demonstrate the final system without one-off values |
| 3 | Rebuild shared navigation and footer | Desktop/mobile IA, CTA hierarchy, legal links, and keyboard behavior are approved |
| 4 | Build reusable layout primitives | Editorial split, open link row, featured image, stepper, proof strip, form shell, and restrained card primitives exist |
| 5 | Recompose homepage | Homepage follows the approved trust-to-choice-to-proof-to-conversation wireframe |
| 6 | Recompose core realtor pages | About, Buying, Selling if verified, Areas, Garland, Contact, and Consultation establish Debra clearly |
| 7 | Reframe programs and resources | NACA, Homes for Heroes, calculators, FAQs, events, and guides are grouped without false promises |
| 8 | Reframe blog/editorial | Articles have author context, source/date handling, local relevance, and one appropriate CTA |
| 9 | Validate forms and conversion | Form fields, privacy consent, error/success states, routing, and CRM/webhook behavior are tested without exposing secrets |
| 10 | Replace or reconcile imagery | Every public image has provenance, license/approval, alt text, crop rules, and mobile behavior in the asset register |
| 11 | Perform dedicated mobile design | 375px, 390px, 768px, and desktop layouts are visually reviewed route by route; no horizontal overflow or repetitive scroll failure |
| 12 | Run final visual QA | Compare against the acceptance criteria and adversarial review below; do not approve on functional tests alone |

## 16. Acceptance Criteria

The redesign cannot be accepted until a new visitor can identify, within the first viewport, that this is a **residential real-estate website led by Debra Allen, REALTOR®, serving a clearly named local market**. The site must center Debra without making the experience self-promotional, communicate buyer and verified seller paths, retain useful education without looking like an education portal, and provide a single clear consultation route.

The visual system must use a coherent palette and type hierarchy, authentic or clearly licensed photography, restrained radii and shadows, and intentional mobile compositions. It must avoid generic AI-template aesthetics, SaaS-like component repetition, excessive card grids, fabricated reviews, fabricated credentials, unsupported local claims, misleading imagery, unverified transaction claims, or false real-estate promises. Existing calculators, official-source boundaries, accessibility features, legal links, and verified functional work must remain intact.

## 17. Adversarial Final Review

**Does it still look like SaaS?** It should not. The proposed system removes dashboard-first composition, reduces cards, and makes the person and place primary.

**Does it look like a mortgage lender?** It should not. Calculators remain supporting tools, not the hero or dominant navigation category; the site names Debra and representation clearly.

**Does it look like a nonprofit or government housing program?** It should not. Programs are framed as resources within Debra’s real-estate practice, with a personal consultation path and verified role boundaries.

**Does it look like an AI template?** It should not if implementation follows the composition rules: fewer repeated grids, stronger photography, real editorial hierarchy, and no generic decorative icon system.

**Is Debra obviously the person the visitor will work with?** Yes, only after moving her approved portrait, name, role, and geography into the hero and preserving a deeper About section.

**Does it feel genuinely local?** Not yet by naming alone. Acceptance requires verified Garland/DFW imagery, local editorial content, and place-specific page composition.

**Are there too many cards?** The blueprint explicitly removes cards where open editorial rows or split sections communicate better.

**Are dark backgrounds being used as a premium shortcut?** No. Navy is limited to trust and action moments; warmth comes from photography and spacing.

**Are real photographs doing trust work?** They must. Debra’s approved portraits and registered licensed hero image are first-class assets; unknown-provenance imagery is excluded until reconciled.

**Is mobile genuinely designed?** The blueprint specifies mobile-specific sequencing, crops, menu hierarchy, form behavior, and density. Implementation acceptance still requires route-by-route device review.

**Could this exact design be reused for another company by changing the logo?** The composition would become generic if Debra, Garland/DFW, verified local imagery, and her actual voice were removed. Those elements are therefore acceptance-critical, not optional content.

## 18. Stop Condition

The redesign decision is settled when the implementation team can build the site without inventing the visual direction. This blueprint settles layout, visual language, colors, typography, imagery, navigation, page architecture, mobile behavior, conversion hierarchy, and trust presentation. It deliberately does not implement code, publish changes, alter production, create branches, or replace assets.

## References

[1]: https://github.com/ebyron357/DAffordableHomes-Platform — Canonical GitHub repository, main branch and implementation evidence.

[2]: https://github.com/ebyron357/DAffordableHomes-Platform/blob/main/README.md — Repository README, product mission, core experiences, quality targets, and current status.

[3]: https://daffordablehomes-platform.vercel.app/ — Current deployed homepage reviewed on August 15, 2026.

[4]: https://www.sitebuilderreport.com/inspiration/real-estate-websites — SiteBuilderReport, “Real Estate Agent Websites: 30+ Inspiring Examples,” updated January 7, 2026.

[5]: https://www.homesinsantabarbara.com/ — Calcagno-Hamilton Real Estate Group, Santa Barbara/Montecito/Santa Ynez Valley.

[6]: https://www.jenferland.com/ — Jennifer Ferland, San Francisco and Marin County realtor website.

[7]: https://keriwhite.com/ — Keri White Team, Los Angeles realtor website.

[8]: https://github.com/ebyron357/DAffordableHomes-Platform/blob/main/docs/02-brand/BRAND_VOICE.md — Canonical D’Affordable Homes brand voice standard.

[9]: https://github.com/ebyron357/DAffordableHomes-Platform/blob/main/docs/02-brand/VISUAL_SYSTEM.md — Canonical controlled production visual system.

[10]: https://github.com/ebyron357/DAffordableHomes-Platform/blob/main/docs/05-content/IMAGE_ASSET_REGISTER.md — Canonical public image provenance and approval register.
