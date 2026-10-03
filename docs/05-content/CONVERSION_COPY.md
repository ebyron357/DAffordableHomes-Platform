# Conversion copy — what was added, what is confirmed, what still needs facts

**Added:** 2026-10-03, in two passes: QW1–QW5 of the written-content conversion
audit (ACT-021), then the remaining audit items (ACT-022).
**Status:** Live on the branch. The business facts it relies on are confirmed
(§1). Nothing in this document blocks the website build.

This copy helps a visitor who is already on the site decide to get in touch.
The shared wording lives in `apps/web/lib/content/conversion.ts`; changing a
statement there changes it everywhere it appears.
`tests/static/conversion-copy.test.mjs` keeps each piece in place.

## 1. Confirmed business facts

Confirmed by the owner on **2026-10-03** ("The four business-copy items you
flagged are APPROVED. Treat the following as confirmed business facts").
They are not blockers and need no further approval.

| Fact | Where it appears |
| --- | --- |
| **The consultation is free** | Under the main consultation buttons (homepage hero, About, First-time buyers, Programs, both program pages, the relocation section); consultation steps; common worries; FAQ; consultation success message; the `/start` hero link; page title "Book a Free Consultation" |
| **There is no commitment** | Same places |
| **Debra personally replies to each message** | Consultation steps and success message; contact success message and side panel; homepage footer |
| **Consultations may happen by phone or video** | Under the consultation buttons; consultation steps, success message and FAQ; the relocation section |

Two smaller operating statements are already true by how the site and
GoHighLevel are set up, and are recorded so they stay true:

- The NACA and Homes for Heroes success messages say Debra follows up "the way
  you asked to be contacted". The form sends `preferredContactMethod` to
  GoHighLevel, where the workflow can route on it (`GHL_SETUP.md` Step 3).
- The contact form's help text says Debra will say when the next workshop date
  is confirmed, as `/events` already did before this work.

## 2. What was added, by page

| Page | Added |
| --- | --- |
| Every form | A success message that says what happens next, with focus moved to it; a privacy line linking the policy |
| `/consultation` | "How a consultation works" (three steps, what helps, what it is not) before the form; who it is for; "Worried you're not ready?" after it; field help on phone and message |
| `/contact` | Help text for sellers and workshop requests; "What happens next" in the side panel |
| `/first-time-buyers` | The worries with a "Talk with Debra" button after the stages; "What documents should I have ready?" in the FAQ |
| `/faq` | "Common worries" group; direct answers to "What happens after I book?" and "Do you help with the home search?"; the NACA answer from the NACA page's sourced wording |
| Homepage | Reassurance under the hero buttons; who the site is for, under "Whichever side of the move you are on"; a line of checkable proof over the guides; a "what's on the market" line in the listings block; the worries line in Debra's panel; header button "Talk with Debra" |
| `/programs` | "Not sure which applies to you?" sorter; a note for buyers who haven't saved much above the official programs; "Using FHA, VA, USDA or down payment assistance?" with a button |
| `/programs/naca` | "Your next step, by stage"; a plain sentence on what Debra is for |
| `/programs/homes-for-heroes` | "Who may qualify?" answered usefully (both programs named); "I'm on military orders" answer with the VA-lender boundary; the Garland answer rewritten without internal wording |
| Both program pages | Reassurance under the header buttons; the area line as an invitation; form intro, phone help and a reassuring no-guarantee line (consent wording unchanged); disclaimer heading "Where the program's rules come from"; internal wording removed from the Homes for Heroes disclaimer |
| Calculators | "Your numbers aren't saved or sent anywhere…" under every result; "Lower than you hoped?" on affordability; where-to-start hint on the hub; the affordability notice built from the calculator's own limits |
| `/about` | "What Debra won't do" |
| `/areas` | "Moving to Dallas–Fort Worth? Start with the map, not the listings." (`#moving-to-dfw`) |
| Quiz results | "Ready to search" and "Moving to DFW" no longer send anyone to the empty listings page; the seller result no longer links to an empty page |
| `/start` | "Rather talk to a person?" reaches the consultation page; framework language and "Debra's team" removed; credit and Dallas-programs answers rewritten |
| City tiles | Open the consultation page ("Ask Debra about …" for screen readers) instead of the empty listings page |
| Structured data | Homepage `FAQPage` removed (it described questions the page did not show); `/faq` markup escaped like every other block |

### Unverified claims corrected

| Was | Now |
| --- | --- |
| "Debra works the Dallas–Fort Worth market every day" (`/homes`) | Removed |
| "Garland is where Debra's practice is based", "Debra's home market", "Garland is home base", "the communities Debra works in" | "The site's home market", "Garland in depth", "Garland and the North Texas communities around it" — the same distinction ACT-019 applied |
| "Debra hosts workshops…", "What a session usually looks like" (`/events`) | Formats described as what each session is built around; "Dates appear here once they are confirmed" |
| "She is known for translating…" (`/about`) | "Her focus is translating…" |
| "NACA can offer significant homeownership benefits" (`/start`) | "NACA is a nonprofit program with its own workshop, counseling and qualification process" |
| "…unless verified documentation is added to the project" (Homes for Heroes disclaimer) | Removed |

## 3. Copy that waits on verified facts

None of this is on the site, and none of it blocks the build. Each item is
published only once Debra supplies the fact named; nothing here may be
invented.

| Copy | Needs |
| --- | --- |
| License, brokerage and a "verify on TREC" link | License type and number, brokerage name (`lib/site.ts`) |
| "Debra replies within [time]" | A response time she can keep, with GoHighLevel notifications set up |
| Phone and hours | Number and hours (`lib/site.ts`) |
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
| Workshop dates | Debra |

### Existing statements still to confirm

These predate this work, are not blocking, and were left as written because
they are plausible and brand-consistent rather than demonstrably wrong:

- `/about`: "When she teaches line dancing in the community" (the brand voice
  standard allows dance references "only when authentic").
- `/events`: that the formats include credit and budget clinics and
  gatherings with line dancing.
