# Lead Routing

**Status:** Application-side implementation complete; live delivery requires approved server-side webhook URLs and test contacts.

## Public entry points

| Experience | Page | Server endpoint | Normalized source |
| --- | --- | --- | --- |
| General contact | `/contact` | `POST /api/leads/contact` | `Contact Page` |
| Consultation request | `/book` | `POST /api/leads/contact` | `Consultation Page` |
| NACA guidance | `/programs/naca` | `POST /api/leads/program` | `NACA Landing Page` |
| Homes for Heroes guidance | `/programs/homes-for-heroes` | `POST /api/leads/program` | `Homes for Heroes Landing Page` |

## Environment variables

Configure provider-neutral variables when possible. The GHL aliases are supported for direct GoHighLevel workflow webhooks. All values are server-only and must never use a `NEXT_PUBLIC_` prefix.

| Purpose | Preferred variable | Supported GHL alias |
| --- | --- | --- |
| Contact and consultation | `CONTACT_LEAD_WEBHOOK_URL` | `GHL_CONTACT_LEAD_WEBHOOK_URL` |
| Program leads | `PROGRAM_LEAD_WEBHOOK_URL` | `GHL_PROGRAM_LEAD_WEBHOOK_URL` |

The preferred variable takes precedence when both values in a row are configured. `.env.example` documents names only; real URLs belong in Vercel environment settings.

## Contact and consultation payload

- name
- email
- optional phone
- message
- context
- normalized source
- buyer stage where applicable
- preferred connection method where applicable
- page URL
- referrer
- submission timestamp
- contact consent

## Program payload

- normalized program and source
- source page and campaign
- submission timestamp
- page URL and referrer
- UTM source, medium, campaign, content, and term
- first name, last name, email, and phone
- current city, desired city, and desired ZIP code
- timeline and preferred contact method
- buying or selling intent where applicable
- NACA stage where applicable
- hero service category where applicable
- additional questions
- contact consent

## Validation and security behavior

- Browsers and servers validate required identity, contact, and consent fields.
- Email and program values are validated server-side; program slugs are allow-listed.
- Program submissions require a plausible phone number.
- Input lengths are bounded before provider delivery.
- Hidden honeypots absorb basic automated submissions.
- Unrealistically fast submissions are rejected.
- Same-origin browser requests are enforced when an Origin header is present.
- A best-effort in-process rate limit permits five requests per client address per 15 minutes.
- Provider delivery times out after eight seconds.
- Webhook secrets remain server-side and lead payloads are never logged.
- Missing credentials and provider failures return honest non-success responses.
- The interface never displays success unless the configured provider returns success.

The in-process limiter is a first layer, not a durable global limit across serverless instances. Provider-level rate limits, an approved accessible bot-control service, signed webhook requests, durable retry and duplicate prevention, and operator alerts require the final CRM workflow and retention policy.

## Preview verification

1. Configure approved non-production webhook URLs in Vercel Preview.
2. Submit a general contact request and confirm source `Contact Page`.
3. Submit a consultation request and confirm source `Consultation Page`, buyer stage, preferred connection, and consent.
4. Submit a NACA request with UTM parameters and confirm program `naca` and source `NACA Landing Page`.
5. Submit a Homes for Heroes request and confirm program `homes-for-heroes` and source `Homes for Heroes Landing Page`.
6. Confirm page URL, referrer, timestamp, campaign, location, consent, and program-specific fields.
7. Test invalid input, no consent, honeypot, fast submission, rate-limit, provider rejection, and timeout behavior.
8. Verify downstream tags, pipeline stages, notifications, email/SMS consent behavior, deduplication, and operator-visible failure reporting.

## Production verification

Repeat the preview matrix with approved production test contacts only after deployment authorization. Confirm secrets are scoped to the correct environment, no test contact enters a live customer workflow unintentionally, and the rollback path remains available.
