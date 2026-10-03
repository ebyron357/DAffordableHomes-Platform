# Conversion copy — what was added, and what Debra must confirm

**Added:** 2026-10-03 (QW1–QW5 of the written-content conversion audit)
**Status:** Live on the branch; part of the v1.0 content approval gate
(`PROJECT_ROADMAP.md` → v1.0 launch gate → "Content and factual approval by
Debra").

This copy exists to help a visitor who is already on the site decide to get in
touch. It adds no new fact about Debra or the business. Where it repeats a
promise, the promise was already published before this pass, and is listed
below so it is confirmed rather than assumed.

The shared wording lives in `apps/web/lib/content/conversion.ts`. Changing a
promise there changes it everywhere it appears.
`tests/static/conversion-copy.test.mjs` keeps each piece in place.

## 1. Promises to confirm

Each line was already on the site before 2026-10-03. This pass made some of
them more visible; it did not make them up. If any is not true, change it in
`lib/content/conversion.ts` (or the file named) and every page follows.

| Promise | Already said on | Now also appears |
| --- | --- | --- |
| The first consultation has **no cost** | `/consultation` ("No cost, no commitment"), page title "Book a Free Consultation", `/testimonials` | Under the main consultation buttons on the homepage, About, First-time buyers, Programs and both program pages; the consultation steps; the worries; the FAQ; the consultation success message; the `/start` hero link ("Book a free consultation") |
| The consultation carries **no commitment** | Same as above | Same as above |
| Debra **reads and replies** to each message herself | The message form's success state ("Debra will read it and reply personally") | The consultation steps and success message, the contact success message, the homepage footer |
| A consultation happens by **phone or video call** | The consultation form's "Phone or video call" option | Under the consultation buttons; the consultation steps, success message and FAQ |
| Debra will say when the **next workshop date** is confirmed | `/events` ("Debra will let you know when the next workshop is announced") | The contact form's help text |
| Debra follows up **the way the visitor asked** | — (an operating commitment, not a published fact) | The NACA and Homes for Heroes success messages. GoHighLevel can route on `preferredContactMethod`; confirm it is followed. |

## 2. What was added, by page

| Page | Added |
| --- | --- |
| Every form | A success message that says what happens next, focus moved to it; a privacy line linking the policy |
| `/consultation` | "How a consultation works" (three steps, what helps, what it is not) before the form; "Worried you're not ready?" after it; field help on phone and message |
| `/contact` | Help text for sellers and workshop requests |
| `/first-time-buyers` | The worries, with a "Talk with Debra" button, after the stages |
| `/faq` | A "Common worries" group; direct answers to "What happens after I book?" and "Do you help with the home search?"; the NACA answer from the NACA page's own sourced wording |
| Homepage | Reassurance under the hero buttons; a one-line worries note in Debra's panel; header button "Talk with Debra" in place of "Search Homes" |
| Program pages | Reassurance under the header buttons; the area line rewritten as an invitation; form intro, phone help and a gentler no-guarantee line (consent wording unchanged) |
| `/start` | "Rather talk to a person?" links to the consultation page in place of a "voice guidance is not connected" notice; the framework line "The customer remains the hero" replaced; "Debra's team" removed |
| `/areas`, `/homes`, homepage | City tiles open the consultation page ("Ask Debra about …" for screen readers) instead of the empty listings page |
| Homepage | `FAQPage` markup removed: it described four questions the homepage no longer shows |

## 3. Copy that needs verified facts first

Drafted in the audit; none of it is on the site. Each waits on the fact named.

| Copy | Needs |
| --- | --- |
| License, brokerage and a "verify on TREC" link | License type and number, brokerage name |
| "Debra replies within [time]" | A response time she can keep, with GoHighLevel notifications set up |
| Phone and hours | Number and hours |
| The cities Debra serves | Verified list (`lib/site.ts` → `serviceAreas`) |
| Consultation length, and whether it can be in person | Her practice |
| What it costs to work together; the written buyer representation agreement | **Broker-approved wording** |
| Testimonials and Google reviews | Written permission; a Google Business Profile |
| Her own story | Debra |
| NACA experience; Homes for Heroes affiliation | Only if true, with documentation |
| Remote showings or video tours for people relocating | Whether she offers them |
| Seller services (photography, marketing, open houses) | What she actually does |
| Lender and inspector introductions | Whether she refers, plus any affiliated-business disclosure (broker) |
| Text-message consent on the forms | **Compliance-approved wording** (carrier A2P 10DLC rules) |
| Workshop dates; whether the credit and budget clinics run | Debra |

### Claims already on the site that should be confirmed or removed

These predate this pass and were not changed by it:

- "Debra works the Dallas–Fort Worth market every day" (`/homes`) — an
  unverified frequency claim of the kind ACT-019 removed elsewhere; recommend
  removing.
- "Garland is where Debra's practice is based", "Debra's home market", "the
  communities Debra works in" (`/areas`, `/areas/garland`).
- `/events`: that Debra hosts workshops, credit and budget clinics, and
  gatherings with line dancing; `/about`: "she teaches line dancing" and "She
  is known for…".
- `/start`: "NACA can offer significant homeownership benefits".
