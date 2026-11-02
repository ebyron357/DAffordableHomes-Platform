# Client User Manual

**For Debra Allen.** No command line, no code. If a step here needs a developer,
it says so.

This is the complete manual. `docs/12-governance/CLIENT_HANDOFF.md` Part 4 is the
one-page version for when you just need reminding.

> **Before you start:** the content system described in Part 2 needs a Sanity
> project, and one does not exist yet. Until it does, your three guides are
> published and visible on the site, but you cannot edit them yourself. Part 2
> is written so that it is ready the day the project is created — it is not a
> description of something you can do today. `CLIENT_HANDOFF.md` Part 3.4 is how
> that gets unblocked.

---

## Part 1 — What your website does

### The pages

33 public pages, in seven groups.

| Group | Pages | Purpose |
| --- | --- | --- |
| Home | `/` | The entry point: who you are, who the site is for, and the quiz |
| Finding your path | `/start`, `/first-time-buyers`, `/programs`, `/programs/naca`, `/programs/homes-for-heroes` | Helps a visitor work out which route fits them |
| Planning numbers | `/calculators` and five calculators — affordability, closing costs, down payment, mortgage payment, rent vs buy | Lets someone plan before they ever speak to you |
| Learning | `/blog` and three long-form guides, `/resources`, `/faq`, `/market-reports`, `/events` | The educational core. `/events` appears in search results once a confirmed session is added to `apps/web/lib/content/events.ts` |
| Local | `/areas`, `/areas/garland`, `/homes` | Local content focus, carefully worded — see Part 4. `/neighborhoods` now redirects to `/areas`; `/homes` stays out of search results until a live listings feed is connected |
| Getting in touch | `/consultation`, `/contact`, `/testimonials` | Where a ready visitor goes |
| Required notices | `/privacy`, `/terms`, `/accessibility`, `/fair-housing`, `/equal-housing-opportunity` | Legal and compliance pages |

### The quiz

On the homepage. Five questions, sixteen possible routes through it. It ends on a
recommendation and a next step. It works on a phone and from the keyboard alone,
and every one of the sixteen endings has been tested to make sure its button
leads somewhere real.

### The lead forms

Three places collect an enquiry: the "Find My Next Step" form on `/start`, the
forms on the NACA and Homes for Heroes pages, and the message form on `/contact`
and `/consultation`.

**Today, none of them delivers anywhere.** Rather than accept an enquiry and
lose it, each form tells the visitor that it was not sent. All three start
working the moment your CRM webhook addresses are set — `CLIENT_HANDOFF.md`
Part 3.3. One GoHighLevel webhook covers the program pages and the message
form; `/start` has its own.

Until then a visitor has **no working way to reach you from the site**: no
form delivers, and no phone number or email is published yet. Supplying either
one closes that gap — the webhooks, or the phone and office details in
`CLIENT_HANDOFF.md` Part 3.1, which appear on the site as soon as they are set.

### What the site will not do

It is built to refuse to invent facts about your business. It will not claim a
licence, a brokerage, years of experience, families served, a testimonial, a
savings figure, or market statistics unless you supply them. If you ever see a
number on the site you did not provide, treat it as a fault and report it.

---

## Part 2 — Writing and publishing articles

Once your Sanity project exists, this is yours and needs no developer.

### Getting in

Go to `yourdomain.com/studio` and sign in with the Sanity account you were
invited with. If you have no invitation, see
`docs/ADMIN_OPERATIONS_MANUAL.md` — someone with administrator access must send
one.

### Writing a new article

1. Choose **Article**, then **Create new**.
2. Fill in the fields. These are all required before it will let you publish:

   | Field | What it is |
   | --- | --- |
   | Title | The headline |
   | Slug | The web address. Generated from the title; change it before publishing, never after |
   | Eyebrow | The small line above the headline |
   | Excerpt | One or two sentences, used on the blog index and in search results |
   | Author | Who wrote it |
   | Category | Which group it belongs to |
   | Publish date | The date shown to readers |
   | Reading time | Minutes |
   | Publication state | Draft or published |
   | SEO description | What a search engine shows beneath the title |
   | Body | At least one block of text |

   A featured image is **optional**. An article without one still looks right.

3. Write the body. You can add headings, lists, links, quotes, images, a video
   embed, and citations.
4. **Preview before publishing.** The Studio's preview shows the article exactly
   as a reader will see it, including the parts you have not published yet.
5. Publish.

Within a minute or so the article appears on `/blog`, in the sitemap, and at its
own address. You do not need to ask anyone to deploy anything.

### Changing a published article

Open it, edit, publish again. The live page updates the same way.

### Unpublishing

Set the publication state back to draft and publish that change. The article
disappears from `/blog` and its address returns a "not found" page. Nothing is
deleted — you can put it back.

### The one rule about addresses

**Never change the slug of an article that is already published.** Anyone who
bookmarked or linked to it gets a dead page, and the search ranking it has built
up is lost. If the title needs to change, change the title and leave the slug
alone.

Three article addresses are preserved deliberately and must never change:

- `/blog/naca-homebuying-dallas-fort-worth`
- `/blog/homes-for-heroes-north-texas`
- `/blog/how-to-buy-home-garland-tx`

### Videos

Paste a YouTube or Vimeo address into a video block. Only those two are
accepted, and only in a privacy-friendly form — the site rewrites a YouTube link
to the no-cookie player automatically. If a link is rejected, it is not a
supported video address.

### What you cannot change yourself

Page layout, new page types, navigation, colours, the quiz questions, the
calculators, and the business facts in Part 4. Those need a developer.

---

## Part 3 — Reading what the site tells your visitors

### "Temporarily unavailable" on an article

The content system could not be reached. The site is saying so honestly rather
than showing a blank page. If it persists for more than a few minutes, see
`docs/TROUBLESHOOTING_AND_SUPPORT.md`.

### "Online lead delivery is not configured yet"

Expected today — your CRM is not connected, so the enquiry is **not captured
anywhere**. The visitor is sent to the consultation page, whose message form
is also waiting for a webhook. See "The lead forms" above.

The message form on `/contact` and `/consultation` says "Online messages
aren't connected yet" for the same reason.

### "Too many submissions. Please wait a moment"

Somebody, or something, submitted a form five times in a minute from the same
place. This is the spam protection working.

### The property listings area

It shows an honest unavailable state. There is no MLS or IDX feed connected, and
the site will not invent listings. Connecting one is a separate decision with its
own licensing and attribution requirements.

---

## Part 4 — The facts the site is waiting for

These are the things only you can supply, and the site displays nothing in their
place rather than guessing.

| What is missing | What happens on the site today |
| --- | --- |
| Your phone number | No phone number appears anywhere |
| Your brokerage name | No brokerage is named |
| Your licence number and state | No licence is displayed |
| Your confirmed service-area cities | Page copy stays regional and structured data lists no service area |
| CRM webhook addresses | The lead forms do not deliver |

### Why the local wording is careful

The site says its **local content focus** is Garland and the Dallas–Fort Worth
metroplex. It deliberately does not say you work in, serve, or represent clients
in any particular city. Those are claims a regulator can hold you to, and they
need your confirmation and your broker's approval. Once you confirm which cities
you are licensed and willing to serve, a developer can state them plainly.

### How to supply them

`CLIENT_HANDOFF.md` Part 3.1 has the list to fill in and who to send it to. It
is one short document; everything on it is a fact you already know.

---

## Part 5 — Where to go next

| You want to | Read |
| --- | --- |
| Hand the accounts over properly | `docs/12-governance/CLIENT_HANDOFF.md` Parts 2 and 5 |
| Add or remove someone who can write articles | `docs/ADMIN_OPERATIONS_MANUAL.md` |
| Understand what the site collects about visitors | `docs/DATA_LIFECYCLE_AND_OFFBOARDING.md` |
| Fix something that looks broken | `docs/TROUBLESHOOTING_AND_SUPPORT.md` |
| Know exactly what is and is not finished | `docs/PROJECT_CLOSEOUT_STATUS.md` |
