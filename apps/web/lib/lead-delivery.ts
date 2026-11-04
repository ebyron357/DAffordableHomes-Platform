/**
 * Where visitor submissions go, and the shape they arrive in.
 *
 * Every public form posts to its own route under `/api/leads/`, and each route
 * forwards server-side to a CRM webhook — in practice a GoHighLevel workflow
 * with an "Inbound Webhook" trigger. This module is the one place that decides
 * which webhook a route uses and what every payload has in common, so a single
 * GoHighLevel workflow can receive all four forms with one field mapping.
 *
 * ## Destinations
 *
 * Each route tries its own variable first and then the shared ones, so setting
 * any ONE of them delivers every form. The first value that is set, non-empty
 * and an https URL wins. `||` semantics on purpose: Vercel lets a variable
 * exist with an empty value, and `??` treated that as configured — the program
 * route then returned 503 while a perfectly good GoHighLevel webhook sat in the
 * next variable. Plain http is skipped, because these payloads carry names,
 * email addresses and phone numbers.
 *
 * ## Common fields
 *
 * The four forms collect different things (`name` on the message form,
 * `firstName` + `lastName` on the program forms, `mobile` on /start). Each
 * payload keeps its own fields and also carries `first_name`, `full_name`,
 * `email` and `lead_type`, plus `last_name` and `phone` when the visitor gave
 * them, so the GoHighLevel "Create or update contact" step maps the same keys
 * whichever form sent the lead, and an If/Else on `lead_type` routes it. A blank
 * optional field is left out rather than sent empty, so a repeat submission
 * cannot clear a surname or phone number the contact already has. Every
 * payload also carries a `submission_id` the CRM can de-duplicate on. No
 * payload is ever logged; delivery failures are, without visitor data.
 */

export type LeadRoute = "contact" | "program" | "next-step"

/** Variables each route reads, in order. */
export const LEAD_DESTINATIONS: Record<LeadRoute, readonly string[]> = {
  contact: ["LEAD_WEBHOOK_URL", "PROGRAM_LEAD_WEBHOOK_URL", "GHL_PROGRAM_LEAD_WEBHOOK_URL", "NEXT_STEP_LEAD_WEBHOOK_URL"],
  program: ["PROGRAM_LEAD_WEBHOOK_URL", "GHL_PROGRAM_LEAD_WEBHOOK_URL", "LEAD_WEBHOOK_URL", "NEXT_STEP_LEAD_WEBHOOK_URL"],
  "next-step": [
    "NEXT_STEP_LEAD_WEBHOOK_URL",
    "LEAD_WEBHOOK_URL",
    "PROGRAM_LEAD_WEBHOOK_URL",
    "GHL_PROGRAM_LEAD_WEBHOOK_URL",
  ],
}

/** The webhook a route should post to, or `undefined` when none is usable. */
export function leadWebhookUrl(
  route: LeadRoute,
  env: Record<string, string | undefined> = process.env,
): string | undefined {
  for (const name of LEAD_DESTINATIONS[route]) {
    const value = env[name]?.trim()
    if (value && isHttpsUrl(value)) return value
  }
  return undefined
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:"
  } catch {
    return false
  }
}

/** How long one attempt waits for the CRM before it counts as failed. */
export const DELIVERY_TIMEOUT_MS = 8000

/** Pause before the single retry, so a CRM that is briefly overloaded can recover. */
export const RETRY_DELAY_MS = 400

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/**
 * The ID that lets the CRM recognise the same lead twice.
 *
 * Each form generates one when it loads and sends it with every attempt, so a
 * visitor who resubmits after a slow "unavailable" reply sends the same ID
 * again, and a GoHighLevel workflow can skip a `submission_id` it has already
 * seen. Anything that is not a UUID is replaced with a fresh one: the value is
 * client-supplied and only ever used as an opaque key.
 */
export function submissionId(value: unknown): string {
  return typeof value === "string" && UUID.test(value.trim()) ? value.trim().toLowerCase() : crypto.randomUUID()
}

type Outcome = { ok: true } | { ok: false; reason: string; retryable: boolean }

async function attempt(url: string, body: string, id: string): Promise<Outcome> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", "idempotency-key": id },
      body,
      signal: AbortSignal.timeout(DELIVERY_TIMEOUT_MS),
      cache: "no-store",
    })
    if (response.ok) return { ok: true }
    const status = response.status
    // 408, 429 and 5xx are the CRM saying "not now"; any other status is a
    // rejection that would fail the same way again.
    return { ok: false, reason: `http_${status}`, retryable: status === 408 || status === 429 || status >= 500 }
  } catch (error) {
    // A timeout is ambiguous: the CRM may have stored the lead and only been
    // slow to answer, so it is not retried here. The visitor is told it failed
    // and can resubmit; the shared submission_id lets the CRM drop the repeat.
    const timedOut = error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")
    return { ok: false, reason: timedOut ? "timeout" : "network", retryable: !timedOut }
  }
}

/**
 * Records a delivery problem for the owner without recording the visitor.
 *
 * Only the route, the reason, the attempt count and the opaque submission ID
 * are logged, never the payload, so Vercel's function logs show that leads are
 * failing (and which form) while holding no names, emails or phone numbers.
 */
function logDelivery(event: "lead_delivery_failed" | "lead_delivery_recovered", detail: Record<string, unknown>) {
  const line = JSON.stringify({ event, ...detail })
  if (event === "lead_delivery_failed") console.error(line)
  else console.warn(line)
}

/**
 * POSTs one lead as JSON, with `submission_id` added to the payload and sent
 * as an `Idempotency-Key` header.
 *
 * True only for a 2xx response. A network error, 408, 429 or 5xx is retried
 * once after a short pause; a timeout or any other status is not. On failure
 * the route shows an honest "not sent" message rather than a success the
 * visitor would wait on.
 */
export async function deliverLead(
  url: string,
  payload: Record<string, unknown>,
  context: { route: LeadRoute; submissionId?: unknown } = { route: "contact" },
): Promise<boolean> {
  const id = submissionId(context.submissionId ?? payload.submission_id)
  const body = JSON.stringify({ ...payload, submission_id: id })

  let outcome = await attempt(url, body, id)
  let attempts = 1
  if (!outcome.ok && outcome.retryable) {
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS))
    outcome = await attempt(url, body, id)
    attempts = 2
  }

  if (outcome.ok) {
    if (attempts > 1) logDelivery("lead_delivery_recovered", { route: context.route, attempts, submissionId: id })
    return true
  }
  logDelivery("lead_delivery_failed", { route: context.route, reason: outcome.reason, attempts, submissionId: id })
  return false
}

/** What a GoHighLevel workflow can branch on. */
export type LeadType = "contact" | "consultation" | "program-naca" | "program-homes-for-heroes" | "next-step"

/**
 * The keys every payload shares, named the way GoHighLevel names contact
 * fields. A form that collects one name field has it split at the first space:
 * "Mary Ann Jones" becomes first `Mary`, last `Ann Jones`, and `full_name`
 * keeps exactly what was typed. `last_name` and `phone` are present only when
 * they have a value: an empty string mapped into "Create/Update Contact" could
 * erase what an earlier submission stored.
 */
export function crmContactFields(input: {
  leadType: LeadType
  email: string
  phone?: string
  firstName?: string
  lastName?: string
  fullName?: string
}) {
  const typed = (input.fullName ?? "").trim().replace(/\s+/g, " ")
  const space = typed.indexOf(" ")
  const firstName = input.firstName ?? (space === -1 ? typed : typed.slice(0, space))
  const lastName = input.lastName ?? (space === -1 ? "" : typed.slice(space + 1))

  const phone = (input.phone ?? "").trim()

  return {
    first_name: firstName,
    ...(lastName ? { last_name: lastName } : {}),
    full_name: typed || [firstName, lastName].filter(Boolean).join(" "),
    email: input.email,
    ...(phone ? { phone } : {}),
    lead_type: input.leadType,
  }
}
