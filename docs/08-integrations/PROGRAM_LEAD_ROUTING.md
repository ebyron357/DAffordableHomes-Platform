# Program lead routing

**Status:** Application-side implementation complete; production delivery requires a server-side webhook URL.

## Routes

- NACA form: `/programs/naca`
- Homes for Heroes form: `/programs/homes-for-heroes`
- Server endpoint: `POST /api/leads/program`

## Normalized values

| Page | Program | Lead source |
| --- | --- | --- |
| NACA | `naca` | `NACA Landing Page` |
| Homes for Heroes | `homes-for-heroes` | `Homes for Heroes Landing Page` |

## Environment variables

Configure one of the following in Vercel. Do not expose either value through `NEXT_PUBLIC_*` variables.

- `PROGRAM_LEAD_WEBHOOK_URL` — preferred provider-neutral server webhook
- `GHL_PROGRAM_LEAD_WEBHOOK_URL` — supported alias for a GoHighLevel workflow webhook

`PROGRAM_LEAD_WEBHOOK_URL` takes precedence when both are set.

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
