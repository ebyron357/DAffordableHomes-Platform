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
 * cannot clear a surname or phone number the contact already has. No payload
 * is ever logged.
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

/** How long a route waits for the CRM before telling the visitor it failed. */
export const DELIVERY_TIMEOUT_MS = 8000

/**
 * POSTs one lead as JSON. True only for a 2xx response; a timeout, a network
 * error or any other status is false, and the route shows an honest failure
 * rather than a success the visitor would wait on.
 */
export async function deliverLead(url: string, payload: Record<string, unknown>): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(DELIVERY_TIMEOUT_MS),
      cache: "no-store",
    })
    return response.ok
  } catch {
    return false
  }
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
