# Program lead routing

**Status:** Application-side implementation complete; production delivery requires a server-side webhook URL.

## Routes

- NACA form: `/programs/naca`
- Homes for Heroes form: `/programs/homes-for-heroes`
- Server endpoint: `POST /api/leads/program`
- Contact and consultation message form (`/contact`, `/consultation`): `POST /api/leads/contact`

## Normalized values

| Page | Program | Lead source |
| --- | --- | --- |
| NACA | `naca` | `NACA Landing Page` |
| Homes for Heroes | `homes-for-heroes` | `Homes for Heroes Landing Page` |

## Environment variables

Configure one of the following in Vercel. Do not expose either value through `NEXT_PUBLIC_*` variables.

- `PROGRAM_LEAD_WEBHOOK_URL` — preferred provider-neutral server webhook
- `GHL_PROGRAM_LEAD_WEBHOOK_URL` — supported alias for a GoHighLevel workflow webhook
- `LEAD_WEBHOOK_URL` — optional destination for the contact and consultation message form

`POST /api/leads/contact` first uses `LEAD_WEBHOOK_URL`, then falls back to the program webhook variables, so setting only the GoHighLevel program webhook delivers both the program forms and the message form. With none of the three set it returns 503 and the form says plainly that the message was not sent.

The message form sends `name`, `email`, `phone`, `preferredConnection`, `buyerStage`, `message`, `source` (`Consultation request` or `Contact form`), `submittedAt` and `pageUrl`. It follows the same contract as the program endpoint: honeypot, per-caller rate limit, elapsed-time check, bounded and allow-listed fields, eight-second timeout, no logging of the payload.

The root `api/consultation.js` handler from the recovered site was retired on 2026-10-02. No page called it, it had no tests, and its optional Resend email path was never documented in `.env.example`; the message form now posts to `/api/leads/contact` instead.

## Captured fields

The server derives or accepts:

- program
- lead source
- source page
- campaign
- submission timestamp
- page URL
- referrer
- UTM source
- UTM medium
- UTM campaign
- UTM content
- UTM term
- first name
- last name
- email
- phone
- current city
- desired city
- desired ZIP code
- timeline
- preferred contact method
- buying / selling intent where applicable
- NACA stage where applicable
- hero service category where applicable
- additional questions
- contact consent

## Validation and failure behavior

- required identity and consent fields are checked in the browser and on the server
- program values are allow-listed
- input lengths are bounded server-side
- a hidden honeypot field rejects basic automated submissions
- submissions that occur unrealistically quickly are rejected
- upstream delivery has an eight-second timeout
- secrets remain server-side
- no lead payload is logged
- missing credentials return an honest unavailable state
- upstream failure returns an honest retry/consultation path
- the UI does not display a false success state

## Production verification

Before claiming the forms are live:

1. Configure the approved server webhook in Vercel Preview.
2. Submit one NACA test lead with UTM parameters.
3. Confirm normalized program `naca` and source `NACA Landing Page` in the destination.
4. Submit one Homes for Heroes test lead.
5. Confirm normalized program `homes-for-heroes` and source `Homes for Heroes Landing Page`.
6. Confirm page URL, referrer, campaign, timestamp, location fields, consent, and program-specific fields.
7. Confirm duplicate, spam, failure, and timeout behavior.
8. Repeat in Production after deployment approval.

## Future hardening

Provider-level rate limiting, Turnstile or another accessible bot-control service, signed webhook requests, secure retry storage, and operator alerting should be added when the final CRM workflow and data-retention policy are approved.
