# GoHighLevel setup — forms and booking calendar

**Status:** Website side complete and verified end to end against a stand-in
webhook on 2026-10-03 (see "How this was verified"). **Live use waits on two
values only the owner can supply,** and each works on its own: the GoHighLevel
workflow webhook URL (`GHL_PROGRAM_LEAD_WEBHOOK_URL`) turns on form delivery,
and the booking calendar link (`GHL_BOOKING_URL`) turns on the calendar on
`/consultation`. Set either in Vercel and redeploy, and that half works without
the other.

## What the website sends to GoHighLevel

Every form on the site posts to the site's own server, which forwards the lead
to GoHighLevel. Visitors never talk to GoHighLevel directly, and the webhook
URL stays on the server; no GoHighLevel key is used at all. The booking
calendar link is different: it is the calendar's own public share link, so it
appears in the page as the calendar frame and the "open in a new tab" link.
That is expected and is not a secret.

| Form | Page | Server route | `lead_type` | `source` |
| --- | --- | --- | --- | --- |
| Consultation request | `/consultation` | `POST /api/leads/contact` | `consultation` | `Consultation request` |
| Contact message | `/contact` | `POST /api/leads/contact` | `contact` | `Contact form` |
| NACA | `/programs/naca` | `POST /api/leads/program` | `program-naca` | `NACA Landing Page` |
| Homes for Heroes | `/programs/homes-for-heroes` | `POST /api/leads/program` | `program-homes-for-heroes` | `Homes for Heroes Landing Page` |
| Find My Next Step | `/start` | `POST /api/leads/next-step` | `next-step` | `Find My Next Step` |

The booking calendar is GoHighLevel's own calendar, framed on `/consultation`.
Bookings are made inside GoHighLevel, so they land in the calendar, the contact
record and any calendar workflow exactly as if the visitor had used the
calendar's own link.

## Step 1 — Create one workflow for every form

1. In the GoHighLevel sub-account: **Automation → Workflows → Create Workflow →
   Start from scratch**.
2. **Add New Trigger → Inbound Webhook.** Copy the webhook URL it shows (it
   starts `https://services.leadconnectorhq.com/hooks/…`).
   GoHighLevel bills Inbound Webhook as a premium trigger on some plans; if it
   is locked, enable premium workflow triggers for the sub-account first.
3. Leave the workflow in draft for now.

## Step 2 — Give the website the webhook URL

1. Vercel → the `daffordablehomes-platform` project → **Settings → Environment
   Variables**.
2. Add `GHL_PROGRAM_LEAD_WEBHOOK_URL` with the URL from Step 1, for
   **Production** and **Preview**.
3. Redeploy (Deployments → the latest → Redeploy).

That one variable delivers **every** form. The other lead variables
(`LEAD_WEBHOOK_URL`, `PROGRAM_LEAD_WEBHOOK_URL`, `NEXT_STEP_LEAD_WEBHOOK_URL`)
exist only to send different forms to different workflows; leave them unset
unless you want that. A value that is empty, not `https://`, or not a URL is
ignored, so a blank variable left in Vercel cannot block delivery.

## Step 3 — Map the fields once

1. Submit one test enquiry from `/consultation` on the Preview deployment.
2. In the workflow's Inbound Webhook trigger, click **Fetch sample requests**
   and pick the one you just sent.
   Fill in **every** field for that test, including a first and last name and
   a phone number, so the sample shows every key.
3. Add **Create Contact** (or **Create/Update Contact**) and map:

   | GoHighLevel field | Webhook key |
   | --- | --- |
   | First Name | `first_name` |
   | Last Name | `last_name` |
   | Email | `email` |
   | Phone | `phone` |
   | Source | `source` |

   `first_name`, `email` and `source` are on every lead from every form.
   `last_name` and `phone` are sent **only when the visitor gave them**: a
   one-word name or a blank phone leaves the key out rather than sending it
   empty, so this one mapping works for every form.

   **Check that a repeat submission cannot erase data.** Submit a second test
   with the same email, a one-word name and no phone, then open the contact:
   the surname and phone from the first test must still be there. If
   GoHighLevel cleared them, take Last Name and Phone out of this step and set
   each with an **Update Contact Field** action behind an **If/Else** that runs
   only when the webhook value is not empty.
4. Add **If/Else** on `lead_type` to route each kind of lead — for example, add
   the tag `naca` and create an opportunity in the NACA pipeline when
   `lead_type` is `program-naca`.
5. Add an **internal notification** to Debra so a new lead is seen the same
   day.
6. Publish the workflow, then submit one test from each form in the table
   above and confirm each arrives with the right `lead_type`.

### Every key a lead can carry

Common to all forms: `first_name`, `full_name`, `email`, `lead_type`,
`source`, `submittedAt`, `pageUrl`; and `last_name` and `phone` whenever the
visitor gave them.

| Form | Additional keys |
| --- | --- |
| Consultation / contact | `name`, `preferredConnection`, `buyerStage`, `message` (the phone, when given, is `phone`) |
| NACA / Homes for Heroes | `firstName`, `lastName`, `program`, `sourcePage`, `campaign`, `referrer`, `utmSource`, `utmMedium`, `utmCampaign`, `utmContent`, `utmTerm`, `currentCity`, `desiredCity`, `desiredZip`, `timeline`, `preferredContactMethod`, `intent`, `programStage`, `serviceCategory`, `questions`, `consent` |
| Find My Next Step | `firstName`, `mobile`, `preferredNextStep`, `selectedPath`, `resultKey`, `landingIntent`, `attribution` (UTM values) |

A one-word name ("Cher") arrives as `first_name` with no `last_name` key. A
message-form name is split at the first space: "Mary Ann Jones" arrives as
first `Mary`, last `Ann Jones`, and `full_name` keeps it exactly as typed.

## Step 4 — Connect the booking calendar

1. In GoHighLevel: **Calendars → Calendar Settings**, open the consultation
   calendar and set availability, duration, buffer, the booking form's fields,
   confirmation and reminder messages, and (under **Integrations**) the Google
   or Outlook calendar it should sync with.
2. Open the calendar's **Share** / **Embed** option and copy the booking link
   (it contains `/widget/booking/`; a group calendar contains `/widget/group/`).
   Pasting the whole embed snippet also works.
3. In Vercel, add `GHL_BOOKING_URL` with that link for Production and Preview,
   and redeploy.
4. Open `/consultation`. The calendar appears above the message form. Book a
   test appointment and confirm it shows in the GoHighLevel calendar, on the
   contact, and in Debra's synced calendar, and that the confirmation arrives.

Until `GHL_BOOKING_URL` is set, `/consultation` shows the message form alone —
no empty box, no broken frame. The site's security policy only allows the
calendar's own address to be framed, and only once it is configured; no
GoHighLevel script is loaded on the public site. Because of that, the frame has
a fixed height (820px, taller on phones) and scrolls inside itself if a
calendar runs long, and a "open the booking calendar in a new tab" link sits
under it for anyone the embedded widget does not suit.

## Before turning on text messages

The program forms ask for consent to be contacted about the request. They do
**not** collect consent to marketing text messages. US carriers (A2P 10DLC
registration in GoHighLevel's LC Phone) require specific SMS consent wording on
any form whose leads receive automated texts. If workflows will text these
leads, the wording and a separate, unticked SMS checkbox need Debra's and her
broker's approval first; then it is a small change to each form and to the
payload. Email and internal notifications need nothing further.

## Not connected, on purpose

- **GoHighLevel chat widget, tracking script and embedded forms.** Each needs a
  third-party script on every page and a wider security policy. The site's own
  forms already deliver to GoHighLevel. Ask before adding any of them.
- **Retry queue.** If GoHighLevel is down or slower than eight seconds, the
  visitor is told the message was not sent and offered the consultation page;
  the lead is not stored and retried later. Nothing is ever shown as sent that
  was not.

## Troubleshooting

| What you see | Cause | Fix |
| --- | --- | --- |
| Form says online messages "are not connected yet" (HTTP 503) | No usable webhook variable | Set `GHL_PROGRAM_LEAD_WEBHOOK_URL` to the `https://` webhook URL and redeploy |
| Form says delivery is "temporarily unavailable" (HTTP 502) | GoHighLevel returned an error or took over 8 seconds | Check the workflow is published and the trigger URL is current; try again |
| Lead arrives but the contact is blank | Fields not mapped | Step 3 — map `first_name`, `last_name`, `email`, `phone` |
| No calendar on `/consultation` | `GHL_BOOKING_URL` unset, not a `/widget/booking/` or `/widget/group/` link, or not redeployed | Copy the link again from Share / Embed and redeploy |
| Calendar box is blank | The calendar was deleted or its link changed | Copy the current link and redeploy |
| "Too many submissions" | More than five posts a minute from one address | Wait a minute; this is the spam limit |

## How this was verified

On 2026-10-03, against a production build with
`GHL_BOOKING_URL=https://api.leadconnectorhq.com/widget/booking/VerifyCal123`
and `GHL_PROGRAM_LEAD_WEBHOOK_URL` pointing at a local HTTPS stand-in for a
GoHighLevel inbound webhook (TLS verification on):

- the served `Content-Security-Policy` allowed that calendar origin in
  `frame-src` and nowhere else; the calendar frame rendered with its title and
  new-tab link, with no policy violation;
- the `/consultation` form and the `/programs/naca` form were filled in and
  submitted in Chromium and showed their success states only after delivery;
- `/api/leads/next-step` delivered;
- the stand-in received exactly three JSON posts with the expected
  `lead_type`, `first_name`, `last_name`, `email`, `phone` and `source`
  (after review on the same day, `last_name` and `phone` are left out when blank).

`tests/static/ghl-integration.test.mjs` keeps these behaviours pinned. What
this cannot verify is GoHighLevel itself. The test environment's network
blocks GoHighLevel's hosts, so the booking widget's own content never loaded
there — the frame, its policy and its fallback were verified, the calendar
inside it was not. The real workflow, field mapping, calendar availability and
notifications are confirmed only by Steps 3 and 4 on a deployed site.
