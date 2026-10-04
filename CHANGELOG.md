# Changelog

All notable repository changes are documented here.

## 2026-10-04

### Full-site search, answer-engine and AI-discoverability pass

- New `pnpm qa:seo` audit reads every route as a crawler does and checks
  metadata, structured data against visible content, breadcrumbs, the link
  graph, redirects, 404s, robots.txt for eleven search and AI crawlers, and
  `/llms.txt`. Final run: 1,524 checks, 0 failures.
- Shared pages keep their site name and locale (`OPEN_GRAPH_BASE`).
- `/neighborhoods` duplicated `/areas` and now redirects there. `/homes` and
  `/events` stay out of search results until they have listings or a
  confirmed date, then are indexed automatically.
- The footer links the NACA, Homes for Heroes, down payment and rent-vs-buy
  pages; the Garland page and both program pages link their long-form guides;
  `/fair-housing` links onward.
- `/areas` answers relocation and area questions in a visible FAQ; every
  `/start` FAQ answer is now in the page HTML, with matching FAQ markup.
- IndexNow support (`INDEXNOW_KEY`, `/indexnow.txt`, `pnpm seo:indexnow`);
  `/llms.txt` gains a "Key facts" section.

## 2026-10-03

### The rest of the conversion audit, and the business facts confirmed

- The four business facts the conversion copy relies on — free consultation,
  no commitment, Debra replies personally, phone or video — were confirmed by
  the owner and are recorded as confirmed in
  `docs/05-content/CONVERSION_COPY.md`.
- No quiz result opens the empty listings page any more; "Moving to DFW" leads
  to a new relocation section on `/areas`.
- NACA shows the next step for each program stage; Homes for Heroes answers who
  may qualify, military moves and Garland plainly.
- `/programs` sorts visitors to the right guide and answers "haven't saved
  much?"; calculators say the numbers stay private and that a low result is not
  a verdict; About lists what Debra won't do; contact says what happens next;
  first-time buyers answers which documents to have ready.
- Unverified claims removed or qualified ("works the market every day",
  "where Debra's practice is based", "Debra hosts workshops", "known for"), and
  internal wording that had reached visitors is gone.
- Fixed words running together where text containing an apostrophe followed
  bold text or a link ("hoped?That's", "Selling?Include", and two lines on
  `/privacy`); a test now rejects the pattern. Follow-on link rows keep the
  arrow with the last word on narrow screens (`ArrowLink`).
- From PR review: blank `last_name` and `phone` are left out of the CRM
  payload instead of sent empty, so a repeat submission cannot erase what
  GoHighLevel already holds (the setup guide adds a check for it). `/start`
  gains the privacy line; its small print now meets AA contrast (was 3.36:1).
  The program pages no longer claim Debra "focuses on" an area, the success
  messages no longer promise the contact method the visitor chose, the privacy
  line matches the policy, and the GoHighLevel guide treats the webhook and
  calendar as independent and the calendar link as public.

### Conversion copy: next steps, how a consultation works, common worries

- Every form's success message now says what happens next, and keyboard focus
  moves to it. `/start` no longer promises "Debra's team".
- `/consultation` explains how a consultation works — three steps, what helps,
  what it is not — before the form, and answers the common worries after it.
  The worries also appear on `/first-time-buyers` and `/faq`, with a one-line
  version on the homepage.
- "No cost · No commitment · Phone or video call" under the main consultation
  buttons. These promises were already on the site; they now come from one
  file and are listed for Debra's approval in
  `docs/05-content/CONVERSION_COPY.md`.
- Dead ends removed: the homepage header button is "Talk with Debra"; `/start`'s
  "Rather talk?" reaches a person; city tiles no longer promise a property
  search that does not exist; the seller quiz result no longer links to an
  empty page.
- The homepage no longer publishes `FAQPage` markup for questions it does not
  show.

### GoHighLevel: booking calendar, one webhook for every form, one field mapping

- **Booking calendar on `/consultation`.** Set `GHL_BOOKING_URL` to a
  GoHighLevel booking link (or paste the embed snippet) and redeploy; the page
  frames the calendar above the message form, with a new-tab link beneath it.
  The public Content Security Policy allows that one origin in `frame-src` and
  nothing else from GoHighLevel. Unset or invalid, nothing changes.
- **Fixed:** the NACA and Homes for Heroes forms returned 503 when
  `PROGRAM_LEAD_WEBHOOK_URL` existed in Vercel with an empty value, even with a
  GoHighLevel webhook in `GHL_PROGRAM_LEAD_WEBHOOK_URL`.
- **One variable delivers every form**, `/start` included. Plain-http and
  malformed values are skipped.
- **Every lead carries `first_name`, `last_name`, `full_name`, `email`,
  `phone` and `lead_type`**, so one GoHighLevel mapping fits every form. Each
  form's existing fields are unchanged.
- Setup guide: `docs/08-integrations/GHL_SETUP.md`.

### Search: answer-ready calculators, breadcrumbs from one source, entity fixes

- Each calculator now explains how it answers its question, what it counts and
  leaves out, answers the next questions people ask (in `FAQPage` markup), and
  links to related tools; `WebApplication` markup on all five. The copy is built
  from the calculators' own rules.
- `BreadcrumbList` comes from the visible breadcrumbs on every masthead route
  (28 of 31, from 4); calculators and policy pages gained breadcrumbs.
- `/first-time-buyers` answers "What are the steps to buying a house?" and
  three related questions; `/about` is a `ProfilePage`.
- Program pages name the site's Debra Allen entity as provider; the office
  address will publish as a structured postal address; `sameAs` links publish
  from a new `profileUrls` fact once supplied.
- Ordered list of everything left: `docs/REMAINING_STEPS.md`.

## 2026-10-02

### Keyword research applied: titles, program FAQs, official programs, search verification

Research in OpenSEO (47 credits; `DFW_LOCAL_SEARCH_STRATEGY.md` §10) showed
where the demand is: NACA (90,500 and 40,500 monthly searches at low
difficulty), Texas first-time-buyer programs, "steps to buying a house", and
the calculators.

- Titles and headings now use the searcher's wording, with no new claims:
  "Steps to Buying a House, Explained", "How Much House Can I Afford?
  Calculator", "Closing Cost Calculator", "Down Payment Calculator and
  Planner", "NACA Program Help in Garland and DFW".
- New FAQs, which are also in each page's `FAQPage` markup:
  - "How does the NACA program work?"
  - "Where can I find a NACA workshop near Dallas?"
  - "Is Homes for Heroes the same as Homes for Texas Heroes?" Garland searches
    for "homes for heroes texas" mostly return TSAHC's separate state program.
- `/programs` links to the official TDHCA, TSAHC, City of Garland, City of
  Dallas and Dallas County assistance programs. It names who runs each one and
  states no amount or eligibility rule of its own.
- `GOOGLE_SITE_VERIFICATION` / `BING_SITE_VERIFICATION` emit the Search
  Console and Bing ownership tags once set in Vercel.

### Contact form wired, privacy facts corrected, business facts ready to publish

- **The `/contact` and `/consultation` message form now submits.** It used to
  validate, wait 400ms and say it was not connected, on the page every
  "Schedule a Consultation" button opens. It posts to a new
  `POST /api/leads/contact` with the same honeypot, per-caller rate limit,
  timing check and server-side validation as the other two lead endpoints, and
  delivers to `LEAD_WEBHOOK_URL`, falling back to the program webhook. With no
  webhook it says plainly that nothing was sent and offers `/start` and
  `/resources`. `tests/static/contact-endpoint.test.mjs` calls the real handler
  (mutation-checked). The untested root `api/consultation.js`, which no page
  called, is retired.
- **`/privacy` now lists what the forms actually collect** — it said name,
  email and message only. Facts only; the legal wording stays with the
  compliance reviewer.
- **Brokerage, licence, phone and office display is built and hidden.**
  `lib/business-facts.ts` renders each fact in both footers, on `/contact` and
  on `/about` the moment it is set in `lib/site.ts`, and adds a
  `RealEstateAgent` listing to the search markup once the address and phone are
  both verified. Nothing shows today; `tests/static/business-facts.test.mjs`
  pins both states.
- **The favicon is the brand.** It was a 73 KB red "n" from PR #20; it is now the
  DA-and-house monogram from the official logo, 13 KB.
- **Docs:** the duplicate Vercel project does carry a custom domain,
  `urltests.team`, which deletion detaches (earlier wording said none). Client,
  ops and closeout docs updated for the form.

### SEO, AEO and GEO audit: share metadata, titles, structured data, llms.txt

An audit of every sitemap route on the merged `main` found the technical base
sound but the share layer broken. The layout's static Open Graph block gave 23
routes the homepage's share title, description and `og:url`, and 32 of 33
routes had no share image at all. A route that declares its own `openGraph`
replaces the layout's wholesale in Next, so a single default could not reach
them. Now:

- One branded share card (`lib/seo.ts`), named explicitly wherever a route
  declares `openGraph`; share titles, descriptions and `og:url` come from each
  route.
- Titles fit in 60 characters and descriptions in 70–160, rewritten with no new
  claims; CMS article titles drop the brand suffix when it would overflow.
- `/testimonials` and `/market-reports` are `noindex` and out of the sitemap
  until they have real content; `qa:audit` still crawls both.
- The 404 page no longer carries contradictory robots directives.
- Article JSON-LD links the byline to the site's Person entity, carries the
  publisher logo, and spells topics as published ("NACA", not "Naca").
- `/llms.txt`, generated from site sources, including what the site does not do.
- `tests/static/search-metadata.test.mjs` pins each fix.

The full scorecard, including what stays blocked on owner facts, is in
`docs/10-seo-analytics/DFW_LOCAL_SEARCH_STRATEGY.md` §9. None of it counts until
the domain is cut over.

### Release-captain verification: one compliance fix, documentation corrected to match the code

Every gate was re-run on `21662ec` under Node 24 and the hosting state was read
from the Vercel API rather than from earlier notes. All automated gates pass.
The pass found no code defect in the reconciliation, but it found places where
the documentation said something the code does not do, and one compliance gap.

- **Equal Housing Opportunity link added to the homepage footer.** The interior
  footer carried both Fair Housing and Equal Housing Opportunity; the homepage
  renders its own footer and carried only Fair Housing. A test now fails if
  either footer drops either link.
- **The `/contact` and `/consultation` message form has no delivery path.** It
  shows "Message form isn't connected yet", the site publishes no phone or email,
  and both lead endpoints send visitors there when delivery is unavailable. Four
  documents said such enquiries were "not lost"; they now say what happens.
  Recorded as blocker 6 in `docs/PROJECT_CLOSEOUT_STATUS.md`. Setting the CRM
  webhooks does not fix it, so it waits on the owner choosing a destination.
- `CLIENT_HANDOFF.md` claimed display logic for phone, address, brokerage and
  licence already existed. Nothing displays them; corrected.
- `IMAGE_ASSET_REGISTER.md` still described the rejected Gamma hero as the
  "owner-approved" closed item. A dated supersession note now says the current
  hero is **not** approved.
- `qa-evidence/visual/` was refreshed: the committed captures predated the hero
  replacement and showed the rejected image.
- The status register gained §13, which records the evidence, the Vercel facts
  (zero environment variables on the working project; the duplicate has never
  produced a successful deployment in 57 attempts), the live GoHighLevel page
  currently on `daffordablehomes.com`, and copy lines for the compliance reviewer.

### Copilot review: five real defects fixed, one recommendation declined

Copilot reviewed `60c8695` and raised nine findings. Each was checked against the
code rather than taken at face value; five were real, two named a genuine
coverage gap, one was already handled, and one asked for something that must not
be done.

**The rate limiter could be used to exhaust the instance it protected** (high).
It swept expired entries once the map passed 500 and then inserted
unconditionally. Expired entries are the only removable ones, so a flood of
distinct addresses inside a single window swept nothing, grew the map without
bound, and paid an O(n) scan on every later request. A sweep now runs at most
once per window per bucket, and the map has a hard capacity above which a new
identifier is refused rather than admitted. The cost is stated in the module: a
fresh caller can be refused on one instance under an address flood, which is a
bounded refusal chosen over unbounded growth. Evicting existing entries was
rejected — a caller could evict its own counter and escape the limit.

**Author and category edits never invalidated anything.** The article queries
dereference both (`author->`, `category->`), but the webhook accepted only
`_type == "article"`. Renaming an author or retitling a category left every
cached article, metadata block and JSON-LD node stale until the cache life
expired, with no way for an editor to force the update. The route now accepts all
three types and clears the shared cache tag; only an article revalidates its own
path. `docs/13-cms/SANITY_SETUP.md`'s webhook filter is widened to match, and a
test fails if the two sides ever disagree.

**The homepage turned a Sanity outage into an editorial decision.** `page.tsx`
dropped `listArticles().state` and `KnowledgeBase` hid the whole "Latest guides"
block on an empty array, so a failed read looked like a choice not to feature any
guides. The state is passed through and an unavailable read now renders as one,
reusing the muted token already used in that section so no new contrast pair is
introduced.

**The sitemap published outages as deletions.** It discarded the same state and
returned a 200 listing every static route and no article, which tells a crawler
those URLs were removed. An `unavailable` read now fails the route so the last
good sitemap stays authoritative. A `stale` read is deliberately still published:
it serves the last good article set, so the document is complete.

**A hidden quiz answer could select the result.** The hook merges answers by id
and only `restart` clears them, so changing the goal on the way back leaves
earlier answers behind. `resolvePath` read `buyerPosition` ungated, so a stale
`sellfirst` returned the sell-and-buy path to someone whose goal now said they
were only selling — that check precedes the `sell` branch. It is now read through
`BUYING_GOALS`, the same set that decides whether the question is asked, so the
resolver and the question's visibility rule cannot disagree. Copilot's
illustrative example was wrong — it used `explore`, which *is* in `BUYING_GOALS`,
so that question does still apply — but the underlying defect was real on the
selling path. `sellerPosition` is the only other branched question and the
resolver never reads it.

**Escape was asserted only by matching source text.** Copilot was right that no
browser check opened either menu. A source regex cannot tell whether the listener
is attached or the focus actually moves. `qa:audit` now drives both headers at
375px: open, focus into the panel, Escape, then assert the panel closed,
`aria-expanded` is false, focus is back on the toggle, and the homepage released
its body-scroll lock. The first version of this check was vacuous — clicking the
toggle already leaves focus on it, so "focus returned" passed with the focus call
deleted. Moving focus into the panel first is what makes it bite, and is the real
keyboard scenario. This extends an existing gate rather than adding new scanner
logic, per `CI_PLAN.md`.

**Declined: "restore draft status."** Copilot asked for the pull request to be
returned to draft because the description said draft while GitHub exposed it as
ready. The owner marked it ready deliberately; an agent must not revert that. The
stale half of the inconsistency was the description, and it has been corrected.

Validation: 142 tests pass (was 128), typecheck exit 0, lint exit 0, build 46/46.
Browser gates: contrast 36 pairs 0 failures, audit 33 routes 0 failures 0 console
errors 90 responsive checks, quiz 16/16, faces 10.5% against the 12% ceiling.
Every fix was mutation-tested in both directions.

### The program lead endpoint had no rate limit and no server-side address check

`/api/leads/program` is a public write endpoint reachable from the NACA and Homes
for Heroes pages, and it forwarded an anonymous submission to the CRM with a
honeypot field and an elapsed-time check as its only abuse controls. Both are
values the client sends, so a replayed request satisfied both. It also checked
only that an email address was non-empty before forwarding it. AGENTS.md §6
requires rate limiting and validated input on public forms.

- `apps/web/lib/lead-validation.ts` now holds the address check once, imported by both lead endpoints. Only `/api/leads/next-step` had one, and two copies of an email validator drift.
- `/api/leads/program` rate-limits on the caller's address in its own `leads:program` bucket before it reads the webhook URL, and returns 429 with `retry-after`.
- `/api/leads/program` rejects an unusable address with 400 before forwarding.
- `/api/leads/next-step` behaviour is unchanged; it imports the shared check instead of defining its own.
- `tests/static/lead-endpoint.test.mjs` called the next-step route "the one public write endpoint", which is what let this sit unnoticed. It now drives both endpoints from a list, so a third added without these controls fails the suite. Verified by mutation in both directions.

The limiter's scope is unchanged and still per serving instance, as documented at
`apps/web/lib/rate-limit.ts`. No fleet-wide guarantee is claimed.

### Closeout documentation completed against the project completion standard

`docs/PROJECT_COMPLETION_STANDARD.md` arrived in `752b93e` requiring ten handoff
documents. Only itself existed. The nine missing ones are now written, from
current code rather than from the earlier documentation:

- `docs/PROJECT_CLOSEOUT_STATUS.md` — the status register. Every requirement is PASS, FAIL, BLOCKED, NOT APPLICABLE or NON-BLOCKING FOLLOW-UP with evidence; every integration carries one of the standard's seven truth labels. Closure state: **`BLOCKED - OWNER ACTION REQUIRED`**.
- `docs/CLIENT_USER_MANUAL.md`, `docs/ADMIN_OPERATIONS_MANUAL.md` — owner and administrator manuals, the second covering roles, environment variables and the five-route API surface.
- `docs/SECURITY_AND_ACCESS_HANDOFF.md` — secrets by name only, account ownership, the shipped security baseline, and an explicit list of what is not covered.
- `docs/DEPLOYMENT_AND_RECOVERY_RUNBOOK.md` — deploy, rollback, backup, restore, disaster recovery, each marked tested or untested.
- `docs/DATA_LIFECYCLE_AND_OFFBOARDING.md` — what is collected, where it rests, subject requests, offboarding, safe shutdown.
- `docs/TROUBLESHOOTING_AND_SUPPORT.md` — symptom to cause, escalation, and the support arrangements that do not exist.
- `docs/CLIENT_ACCESS_HANDOFF_TEMPLATE.md` — blank, and labelled never to be completed inside this repository.
- `docs/FINAL_CLIENT_ACCEPTANCE.md` — the acceptance record, unsigned.

All ten are registered in `repository-health.yml`, so none can be silently
deleted. `CLIENT_HANDOFF.md` gains an index of the set and remains the
who-does-what-in-what-order document rather than duplicating them.

### Production readiness summary corrected against current code

`docs/12-governance/PRODUCTION_READINESS.md` was last assessed 2026-08-10 and had
gone stale in ways that understated and overstated different gates.

- Gate 6 said browser automation was pending. The four browser gates have run in CI on every pull request since 2026-09-27.
- Gate 7 claimed no automated WCAG evidence. Landmarks, heading order, alt text, labels, focus visibility, touch targets and 36 contrast pairs are asserted across 33 routes and 5 viewports. The manual keyboard and screen-reader review genuinely is still pending, and now says so distinctly.
- Gate 10 described npm audit findings from a toolchain the repository no longer uses, and called rate limiting pending when one endpoint had it.
- Gate 12 did not mention that the duplicate Vercel project fails on every branch from its own configuration.
- The priority list still referenced the Manus visual review and asked for browser coverage that exists. Rewritten and reordered by what actually blocks release, separating owner/external items from engineering ones.

### Service-area qualification finished across the interior routes and the quiz

Follows the owner's `ac7c8ab`, which resolved the two service-area copy threads from PR #28 by replacing claims about where the practice operates with statements about what the site covers. That pass covered the homepage and both footers; five instances of the same class were still live elsewhere and now inconsistent with it.

- `/homes` read "The rest of the metroplex is where Debra works every week" — a specific unverified claim about both service area and frequency, stronger than anything the owner's pass removed. Rewritten to mirror the parallel sentence already on `/neighborhoods`, so the two pages agree.
- The section eyebrow "Where Debra works" survived on `/homes` and `/neighborhoods` — the exact phrase replaced in three other files. Both now read "Local market focus".
- Two quiz result sentences claimed service area on a conversion path: "which is inside the North Texas area Debra works in" and "Debra works across the metroplex, so the same process applies". Now "one of the North Texas areas this site covers" and "The same process applies anywhere in the metroplex".
- `/about`'s StatusStrip is untouched: it already says brokerage, licence, service areas and certifications appear only once verified, which is the honest form.

Substitutions follow the pattern the owner set rather than introducing new wording. No test pinned any of the changed strings; verified against served HTML rather than source.

### The committed QA evidence was stale against the owner's own commit

`qa-evidence/site-audit.json` is tracked and records each route's full visible text. It still carried the pre-change footer — "WHERE DEBRA WORKS" and "Buyer and seller representation across the metroplex" — on every interior route, because `ac7c8ab` changed the shared footer without regenerating it, so the repository's own evidence contradicted what the site served. Regenerated and committed, which is the opposite of the usual call on this file: the delta here is real copy, not capture noise. Brand-area percentages also moved 0.1–0.3% on all 33 routes including untouched ones, which is sub-pixel drift riding along. The 90 JPEGs under `qa-evidence/visual/` are stale for the same reason and are left alone, since regenerating them commits 90 binaries whose real delta is a few words buried in re-encoding noise.

## 2026-09-27

### Client handover runbook

- `docs/12-governance/CLIENT_HANDOFF.md` is new: the single index for transferring the site to its owner. The seven existing governance checklists are all written for the engineering team and none of them covers handover, so nothing said how the owner publishes an article, what she must supply before launch, or which accounts have to end up in her name.
- Split by audience: Parts 1–4 are for the owner and need no command line; Parts 5–6 are for a maintaining developer. It points at `docs/13-cms/SANITY_SETUP.md` and the existing checklists rather than restating them.
- States what is absent today rather than implying completeness: the lead forms do not deliver because no webhook URL is set, and the site shows no phone number, brokerage or licence because every field in `UNVERIFIED_TRUST_FACTS` is still `null`. Both are values only the owner can supply.
- Carries an account-ownership table — domain, Vercel, GitHub, Sanity, CRM — because a live site whose accounts belong to someone else has not been delivered. Part 7 is the sign-off and is deliberately unticked.
- Registered in `.github/workflows/repository-health.yml`'s required-files list so it cannot be silently deleted.

### Three stale governance records corrected

- `TECH_DEBT.md` TD-004 reported the dependency lockfile as pending and recommended switching CI to `npm ci`. That had been overtaken: `packageManager` is pinned to `pnpm@11.9.0`, `pnpm-workspace.yaml` defines the workspace, `pnpm-lock.yaml` is committed, and both CI jobs install with `pnpm install --frozen-lockfile`. Marked resolved on pnpm, with a note that no `package-lock.json` should be added.
- The genuine residue is now **TD-005**, low severity: root scripts still delegate through `npm --workspace` inside a pnpm workspace, so `pnpm build` requires npm to be present too, and the root `package.json` keeps a redundant npm-style `workspaces` array. CI passes because the runner has both. Left open rather than fixed in a documentation pass.
- `PROJECT_ROADMAP.md` gains a **v1.0 handover gate** below the launch gate. Launching and handing over are separate; the launch gate had no ownership-transfer item.
- `docs/13-cms/SANITY_SETUP.md` listed a featured image "with meaningful alt text" among the fields required before an article validates. It has not been required since guide-card imagery was reworked and `featuredImage` was made optional end to end; the schema marks it optional and an article without one renders `ArticlePlate`. The required list now matches `apps/web/cms/schema/documents/article.ts` — title, slug, eyebrow, excerpt, author, category, publish date, reading time, publication state, SEO description, at least one body block — with the image's real conditions stated separately. Caught while fact-checking the handover runbook against the schema rather than copying the older doc.

## 2026-09-25

### Accessibility and link fixes (WCAG 2.2 AA)

- Lighthouse and axe found text below 4.5:1 on four templates that the contrast script did not cover. Fixed at the source, with every new pair added to `scripts/check-contrast.mjs`:
  - Homepage teal field: gold market label and buyer-card eyebrow (2.96:1) and 86–88% white text (4.34–4.47:1) are now white (5.28:1). Gold cannot reach AA anywhere on this teal, which the script already recorded for interior pages.
  - `--fh-green-deep` moves from `#4d8733` (3.87:1 on the soft band) to `#3f7229` (5.12:1).
  - Interior chips on teal used a 10% white wash that lifted the field to `#20858f` (4.36:1); the wash now darkens instead (6.40:1).
  - `/resources` step copy and action text on teal are white.
  - `/start`: the "Check my starting point" button used the white outline style on a light section (1.36:1, effectively invisible) and now has a dark outline variant; grey labels and footnotes move to `#5f6b73`; teal text on the light band moves from `#087c8a` to `#077783`.
  - The down-payment planner's "Continue planning" button was white on near-white (1.04:1). `CalculatorActions` takes a `tone` for the surface it sits on.
- The interior header's logo link no longer overrides its visible text with an `aria-label` (WCAG 2.5.3 label in name).
- Internal links that went through redirects now point at their destinations: calculator links used `/resources/calculators/*` (308), and `/start` linked `/naca` and `/book`.
- Result: Lighthouse Accessibility, Best Practices and SEO are 100 on all 33 sitemap pages; desktop Performance is 100 on every template tested.

### Homepage hero seam

- The navy copy field no longer meets the house photograph in a hard vertical line. The existing `.fh-hero-media::before` wash was a fixed 180px with a fast linear falloff, so the bright sky and tree reappeared within a few dozen pixels of the panel. It is now sized to the frame (`--fh-hero-wash: min(36%, 300px)`): solid navy for its first 6%, then an eleven-stop smoothstep falloff to fully transparent, so neither end of the ramp reads as an edge and the house stays outside it at every split width.
- The existing `.fh-hero-media::after` bottom vignette is darker than the navy field and ran the full width of the photograph, which drew a darker step along the lower third of the seam. It is now masked in from the left over the same span as the wash; everywhere else it is unchanged.
- CSS only. The photograph, the portrait/landscape still selection, layout, typography and CTA placement are unchanged. The stacked layout (below 900px) already disables both pseudo-elements and renders pixel-identical to before.

## 2026-09-24

### Homepage hero image delivery

- The portrait hero still is now art-directed through `getImageProps`, so both
  stills are resized by the image optimizer. Previously every viewport up to
  1600px downloaded the full 1744×2336 portrait (856 KB) and also the
  landscape still preloaded by `next/image`; a 390px phone now fetches one
  60 KB image (189 KB at 3× density). The rendered hero is unchanged.

### Homepage visual reconciliation

- The page-width lock is gone. `.figma-home { width: 1440px }` boxed the whole
  site inside near-white margins on any monitor wider than 1440 and made the
  hero read as a card floating in empty space. Fields now bleed to the
  viewport edge at every width; only content is held to the 1440 shell.
- The hero is one composition: a four-track grid puts the copy on the content
  line and runs the exterior from the middle of the shell to the right edge of
  the viewport, with a navy wash along the seam so the house emerges from the
  field instead of meeting it as a hard line, and a low vignette. Nothing is
  laid over the photograph: a white quiz panel that straddled the seam in the
  first pass was removed the same day at the owner's direction. The copy now
  carries the tagline behind a gold rule, two CTAs instead of three, and
  Debra's byline with her approved portrait, so the first viewport names the
  practice, the person, the market and a next action.
- The hero photograph itself is **not approved**. The owner rejected the
  generated exterior on 2026-09-24 as not fitting the composition. A
  replacement generated specifically for this layout is blocked from this
  environment (Higgsfield hosts are refused by the egress policy and the DFW
  reference images are in no connected source); the rejected still remains in
  place only so the composition can be reviewed, and the register records the
  rejection.
- The split holds at laptop widths. A 1024px viewport used to stack the hero
  and put every word of copy below the fold behind a 640px photograph;
  stacking now starts under 900px.
- Section order tells the story in sequence — hero, trust band, pathways, Meet
  Debra, the quiz, markets, listings, guidance, guides, closing band — and the
  quiz's light field now separates the two navy ones.
- The five planning destinations under the guides are an editorial index under
  a gold rule rather than five identical white cards.
- `tests/static/figma-homepage.test.mjs` pins the composition: no page lock,
  the four-track grid, the seam panel's position, the byline, the laptop
  split, the stacked rules and the section order.

## 2026-09-22

### Homepage hero exterior

- The hero's exterior slot is wired end to end: `lib/media/ambient-motion.ts`
  resolves the still at build time, `components/media/ambient-motion.tsx`
  renders it, and the drawn brand streetscape stays beneath it as the fallback —
  removing the file restores the drawing with no code change.
- The owner's approved generated still (`hero-north-texas-exterior.webp`, from
  `9VO_H8Qh26Hg90ZLIvsSd.jpg` in Gamma) is registered in
  `docs/05-content/IMAGE_ASSET_REGISTER.md`, which states plainly that it is not
  evidence of a real listing, transaction, client property, address or verified
  neighbourhood, and now also carries its measured responsive framing and the
  one region that does not survive magnification.
- `qa:audit` requires the still to render on `/`, so the file going missing is
  reported rather than silently falling back to the drawing.
- Motion for the slot is prepared but unfilled, and never autoplays: with the
  still alone the page mounts no `<video>`, issues no media request and offers
  no control, at every viewport and under `prefers-reduced-motion`.


### Homepage "Local guidance" ambient-motion surface (merged from `main`)

- Added an accessible ambient-motion surface to the homepage "Local guidance" section that kept the
  approved still photograph as its poster and accessible name, with same-origin encodes resolved at
  build time, responsive encode selection, viewport-gated loading, silent playback with no controls,
  and removal of the clip entirely under reduced-motion preferences.
- **Superseded on this branch.** The homepage this section belonged to was replaced by the Figma
  composition, so `ControlledHomeSections` no longer renders. The ambient-motion module it introduced
  now serves the hero exterior above, which keeps the same contract and goes further: nothing is
  mounted or fetched until the visitor presses a control. `tests/static/hero-motion.test.mjs` carries
  the regression coverage that `tests/static/media.test.mjs` held for the removed section.

## 2026-09-21

### Homepage quiz

- "Find Your Homebuying Path": five or six questions branched on the visitor's goal (goal, DFW area, timeline, buyer or seller position, Homes for Heroes group), with a progress indicator, keyboard-operable radio choices and focus-managed steps. The result is one of eight paths (First-Time Buyer, North Texas Hero, Moving to DFW, Selling a Home, Selling and Buying, Ready to Search, Early-Stage Researcher, Not Sure Yet) with a "Your next move" heading, an explanation written from the answers, a next step, an existing resource, a primary CTA and an optional consultation. No contact details are collected. It replaces the interim homepage entry to the `/start` assessment.
- Homepage copy: services, buyer and seller strategy points, knowledge cards and three section headings rewritten as specific Dallas–Fort Worth language; the claim of a "real-time MLS search" that the site does not have is gone.
- The guided-quiz state machine is shared (`useGuidedQuiz`) by the homepage quiz and the interior Find Your Next Step check; funnel events flow through the existing analytics seam.

### Homepage hero

- The hero no longer carries a photograph of a living-room interior. It draws the subject instead: the brand roofline at streetscape scale over a dusk sky with a warm horizon, a set-back range of roofs for depth, and one lit window. Ornament, `aria-hidden`, depicting no particular place. The licensed Pexels interior stays in the repository and in use elsewhere; a photograph can replace the drawing by restoring an `<Image>` in `.fh-hero-media`.

### Homepage visual review

- The "Find your homebuying path" section asked the same question twice, side by side: the section heading "Not sure what your next move in DFW should be?" and, an inch to its right, the panel title "What should your next move in Dallas–Fort Worth be?". The panel now says what the visitor is about to do instead of restating the question, and the question count and duration are stated once, in the list on the left, rather than three times across the section.

### Guide-card imagery and the unregistered-photograph audit

- `featuredImage` is optional end to end (shared type, Sanity schema, blog index, article masthead, related cards, Open Graph and Article JSON-LD). An article without one renders `ArticlePlate` — brand field, architectural linework, the article's own category — and publishes no image property rather than asserting that an unrelated photograph depicts its subject. Setting the field in Sanity restores a photograph everywhere with no code change.
- The Homes for Heroes and Garland guides no longer carry Debra Allen's portrait as their card, masthead or body image.
- Three images are off every route and barred in the audit's retired list: a generated portrait of a woman who is not Debra, published on `/start` as though she were; a generated office scene carrying an invented agency logo and tagline; and a north-eastern US streetscape that `/neighborhoods` captioned "North Texas". The `/start` panel now shows Debra's own registered photograph at the register's upright-frame crop. The files stay in the repository.
- Fixed `.dah-landing-image-frame-portrait` resolving to 0px wide: `margin-inline:auto` cancels a grid item's default stretch, so with no explicit width the frame was sized to content and its only child is an absolutely positioned image. That panel's photograph had never rendered at any desktop width.
- `docs/05-content/IMAGE_ASSET_REGISTER.md` records what each of the seven unregistered images actually shows and its disposition. Three remain unresolved on licence and are owner actions.

### Interior visual system

- Added a `.dh-*` interior composition layer (`app/globals.css`) plus
  `components/page/editorial.tsx` and `components/page/brand-motif.tsx`: painted
  bands, editorial splits on brand plates, icon-supported pathway rows, numbered
  process, designed status strips, image-led closing bands.
- Rebuilt the shared masthead as a two-column field. The right column carries an
  approved photograph or the brand's architectural linework, so no interior
  route opens with half its first viewport empty.
- Rebuilt `/homes`, `/areas`, `/areas/garland`, `/programs`, `/programs/*`,
  `/about`, `/calculators`, `/consultation`, `/contact`, `/faq`,
  `/first-time-buyers`, `/neighborhoods`, `/events`, `/market-reports`,
  `/testimonials` and the `/blog` tail on that system. Content and every honesty
  constraint are unchanged; the presentation is not.
- `/homes` no longer presents the no-MLS state as a warning panel in an empty
  page. The MLS truth is verbatim, inside a composition with the four actions
  that genuinely exist and the DFW market list.
- Homepage Buy/Sell pathways: removed the `01`/`02` numbering, added icon
  badges, benefit highlights, layered brand fields and ornament.
- Homepage closing band is left-aligned with a directional scrim; centred copy
  over a centred subject had required a scrim heavy enough to silhouette Debra.
- Footer brand bands (homepage and interior) moved off white onto the brand's
  soft green-gray, with the logo on a designed plate and a third column of
  verified local facts where the empty middle used to be.
- `/start` moved off its divergent palette (`#0B1F33` navy, `#C9A227` gold,
  `#06B6D4` turquoise, `#F7F2E8` beige) onto the approved brand values. Painted
  brand area on that route went from 8.2% to 46.6%.
- Removed internal product and publishing language from public pages
  ("doorway pages", "local-content focus", "visual direction", "answer engines").

### Imagery

- Added `lib/content/imagery.ts`: the image register expressed as code. Pages
  compose with a named placement rather than a hand-typed `objectPosition`.
- Fixed the closing-band crop. The band used the upright-frame `50% 30%`, which
  removed 22% off the top of the source and clipped the top of Debra's head on
  every route carrying one. The band placement is now `50% 14%`, and the
  masthead placement `50% 22%`. Worst measured top crop across all placements
  and all five breakpoints: 22.4% → 10.5%.
- `/consultation` masthead now carries a registered asset.

### QA

- `scripts/qa/site-audit.mjs` measures painted brand area per route as a share
  of the rendered page, counting each field once, and fails below a floor —
  20% for content routes, 12% for long-form articles. Added `/homes`, `/areas`,
  `/first-time-buyers`, `/faq` and `/programs/naca` to the visual routes, and
  added internal-language strings to the forbidden-copy list.
- Added `scripts/qa/face-safety.mjs` (`npm run qa:faces`): computes the rendered
  crop of every Debra placement at 1440/1024/768/430/375 and fails above a 12%
  top crop.
- `scripts/check-contrast.mjs` (`npm run qa:contrast`) now covers every brand
  pair in the interior system and on `/start`, and exits non-zero on a failure.
  It caught three real defects: gold on teal (4.02:1, unfixable in that pairing
  — teal surfaces now use white), and two icon badges at 3.81:1 and 4.41:1.
- Added `tests/static/interior-visual-system.test.mjs` (9 tests) asserting the
  masthead's second column, painted fields per brand colour, required icons,
  designed status states, absence of internal language, the `/start` palette,
  the register's crop rules and reduced-motion handling.

## 2026-09-20

- Consolidated one preview candidate: the Figma `11:4` homepage (PR #27) as the visual base, with the Sanity CMS / security / SEO closeout (PR #21) and the `/start` conversion landing (PR #26) merged on top and conflicts resolved by hand.
- Replaced the text wordmark in the Figma homepage header with the approved `daffordable-homes-official-logo.png`, rendered at a fixed height with its native aspect ratio on desktop and mobile.
- Carried the site-wide `Made by ClientVerse` attribution into the homepage footer bottom bar and made the footer copyright year dynamic.
- Added `/start` to the browser QA visual routes and documented `NEXT_STEP_LEAD_WEBHOOK_URL`.

## 2026-09-19

- Reconciled the homepage to Figma node `11:4` geometry: 1440 desktop lock, placeholder image wells, 296×337 service cards, 440×520 Meet Debra well, 296×264 market cards, teal listing prices, buyer/seller card colors, 5-column knowledge cards, Follow Us footer.
- Kept Figma placeholder composition instead of substituting unapproved production photographs that change the layout.
- Omitted Figma’s “Studio Clarity” contact line because it is a vendor name, not a published client contact path.
- Implemented Figma homepage frame `11:4` (`daffordable-homes-home-page`) from file `x8TpOO9gK5tsbcjkEsK18A` as the homepage.
- Matched the Figma homepage tokens (page `#faf7f2`, navy `#0b1f33`, body `#203042`, teal `#077783`, gold `#d6a743`, borders `#eae6df`) without changing unrelated interior pages.
- Mapped every homepage CTA to an existing route and kept featured listings as Figma placeholder cards until an approved MLS feed is connected.
- Loaded Inter and Source Serif 4 through `next/font` so the homepage typography can match the Figma file.

## 2026-08-15

- Implemented Sanity CMS: embedded Studio at `/studio`, article/author/category schema, 18 reusable editorial block types, GROQ query layer, draft preview, and a signature-verified publish revalidation webhook.
- Replaced the three hardcoded article routes with one CMS-driven `/blog/[slug]`; the three published URLs are unchanged and unknown slugs now return a real HTTP 404.
- Migrated all three articles into a reproducible seed with an NDJSON exporter for `sanity dataset import`.
- Rebuilt the blog as a premium editorial experience and ran a design pass across the shared system, including real Inter and Source Serif 4 webfonts self-hosted at build time.
- Added the `Made by ClientVerse` attribution to the shared site footer with an explicit vendor-relationship qualifier and a regression test that asserts it.
- Reworked the ClientVerse audit workflow so an unconfigured or uncertified audit fails instead of reporting a green no-op, and uploads its evidence as an artifact.
- Added a Playwright site-audit harness covering route crawl, internal links, canonicals, structured data, accessibility structure, console errors, and responsive behaviour at five viewports.
- Fixed a horizontal-overflow defect on `/consultation` at 375px and an unanchored overlay in the related-articles module that intercepted clicks.
- Removed the `recovered-manus` reference bundle from the production test pipeline; it remains in the repository as reference material only.

## 2026-07-18

- Added a shared calculation engine for mortgage payment, affordability, cash-to-close, and down-payment scenario planning.
- Added four responsive, accessible calculator pages under the Plan & Resources section.
- Added total monthly housing-cost breakdowns covering principal, interest, taxes, insurance, mortgage insurance, and HOA assumptions.
- Added conservative affordability planning with transparent debt-ratio assumptions and lender-decision disclaimers.
- Added adjustable closing-cost, prepaid, escrow, credit, and cash-to-close estimates.
- Added side-by-side down-payment scenarios for 3%, 3.5%, 5%, 10%, and 20%.
- Rebuilt the resources page as the primary entry point for planning tools and buyer education.
- Added automated formula tests and passed repository health, typecheck, lint, tests, production build, and Vercel preview deployment checks.

## 2026-07-14

- Consolidated the approved full website into the governed `apps/web` monorepo structure.
- Restored 22 public application routes, the responsive navigation, next-step guide, homepage sections, compliance pages, honest provider-unavailable states, and approved imagery.
- Upgraded the application to Next.js 16 and React 19.2.4.
- Fixed strict TypeScript, React 19 composition, provider notice, and navigation-state defects.
- Added a full GitHub Actions application quality gate for typecheck, lint, tests, and production build.
- Required the same full quality gate for Vercel preview builds.
- Updated production-readiness and technical-debt records.

## 2026-07-13

- Added production execution logs and risk/debt/decision registers.
- Added production readiness, release, deployment, rollback, and post-release monitoring checklists.
- Added GitHub issue templates for bugs, features, and production gates.
- Added initial repository-health GitHub Actions workflow.
- Updated README and roadmap to reflect Phase 0 governance progress and remaining blockers.
## 2026-07-20

- Replaced the homepage hero portrait with a licensed Black-family moving-day photograph.
- Added three approved Debra Allen photographs to the homepage trust section and About page with responsive image optimization and descriptive alt text.
- Added an image asset register documenting source filenames, final repository paths, processing limits, and hero provenance.
- Added the required ClientVerse.io footer attribution.
- Isolated the pnpm workspace, regenerated the canonical lockfile, and changed CI to use a frozen pnpm install so TypeScript and production builds are reproducible.
