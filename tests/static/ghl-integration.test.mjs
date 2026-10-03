import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { register } from "node:module";
import { test } from "node:test";
import { pathToFileURL } from "node:url";

/**
 * GoHighLevel: every form delivers to one webhook, and the booking calendar
 * renders only where the Content Security Policy allows it.
 *
 * Found on 2026-10-03:
 *
 * - `/api/leads/program` read `PROGRAM_LEAD_WEBHOOK_URL ?? GHL_…`, so a
 *   variable that existed in Vercel with an empty value counted as configured
 *   and the GoHighLevel alias beside it was never read: a 503 with a working
 *   webhook configured.
 * - `/api/leads/next-step` read only its own variable, so the "one
 *   GoHighLevel webhook covers every form" setup the handoff documents did
 *   not cover /start.
 * - The forms sent different keys for the same person, so one workflow needed
 *   a mapping per form.
 * - There was no booking calendar, and the public policy's `frame-src` would
 *   have blocked one.
 *
 * The route cases call the real handlers with a recording `fetch`, so they
 * prove what reaches the webhook, not what the source contains.
 */

register("../../scripts/sanity/ts-resolver.mjs", import.meta.url);
register(
  'data:text/javascript,export async function resolve(s,c,n){return n(s==="next/server"?"next/server.js":s,c)}',
);

const read = (file) => readFileSync(file, "utf8");
const route = (name) => import(new URL(`../../apps/web/app/api/leads/${name}/route.ts`, import.meta.url).href);

const { LEAD_DESTINATIONS, leadWebhookUrl, crmContactFields } = await import(
  pathToFileURL("apps/web/lib/lead-delivery.ts").href
);
const { parseBookingUrl } = await import(pathToFileURL("apps/web/lib/ghl-booking.mjs").href);

const ALL_ENV = [...new Set(Object.values(LEAD_DESTINATIONS).flat())];
const HOOK = "https://services.leadconnectorhq.com/hooks/EXAMPLE/webhook-trigger/abc";

/* ---- destinations ------------------------------------------------------ */

test("one GoHighLevel webhook, in any of the variables, delivers every form", () => {
  for (const name of ALL_ENV) {
    for (const kind of ["contact", "program", "next-step"]) {
      assert.equal(leadWebhookUrl(kind, { [name]: HOOK }), HOOK, `${kind} via ${name}`);
    }
  }
});

test("each form prefers its own variable, and an empty or insecure value falls through", () => {
  const env = {
    NEXT_STEP_LEAD_WEBHOOK_URL: "https://hooks.example.test/next",
    LEAD_WEBHOOK_URL: "https://hooks.example.test/lead",
    PROGRAM_LEAD_WEBHOOK_URL: "https://hooks.example.test/program",
  };
  assert.equal(leadWebhookUrl("next-step", env), env.NEXT_STEP_LEAD_WEBHOOK_URL);
  assert.equal(leadWebhookUrl("contact", env), env.LEAD_WEBHOOK_URL);
  assert.equal(leadWebhookUrl("program", env), env.PROGRAM_LEAD_WEBHOOK_URL);

  assert.equal(leadWebhookUrl("program", { PROGRAM_LEAD_WEBHOOK_URL: "", GHL_PROGRAM_LEAD_WEBHOOK_URL: HOOK }), HOOK);
  assert.equal(leadWebhookUrl("program", { PROGRAM_LEAD_WEBHOOK_URL: "   ", GHL_PROGRAM_LEAD_WEBHOOK_URL: HOOK }), HOOK);
  // Names, emails and phone numbers never travel over plain http.
  assert.equal(leadWebhookUrl("contact", { LEAD_WEBHOOK_URL: "http://hooks.example.test/lead" }), undefined);
  assert.equal(leadWebhookUrl("contact", { LEAD_WEBHOOK_URL: "not a url", GHL_PROGRAM_LEAD_WEBHOOK_URL: HOOK }), HOOK);
  assert.equal(leadWebhookUrl("contact", {}), undefined);
});

test("a single name field is split for the CRM without losing what was typed", () => {
  assert.deepEqual(
    crmContactFields({ leadType: "contact", fullName: "  Mary   Ann Jones ", email: "m@example.com" }),
    {
      first_name: "Mary",
      last_name: "Ann Jones",
      full_name: "Mary Ann Jones",
      email: "m@example.com",
      phone: "",
      lead_type: "contact",
    },
  );
  assert.equal(crmContactFields({ leadType: "contact", fullName: "Cher", email: "c@example.com" }).last_name, "");
  assert.equal(
    crmContactFields({ leadType: "next-step", firstName: "Ana", lastName: "", email: "a@example.com" }).full_name,
    "Ana",
  );
});

/* ---- the real handlers ------------------------------------------------- */

let caller = 0;
function post(handler, path, body) {
  return handler(
    new Request(`https://daffordablehomes.com/api/leads/${path}`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": `198.51.100.${++caller}` },
      body: JSON.stringify(body),
    }),
  );
}

async function withEnv(env, respond, fn) {
  const saved = Object.fromEntries(ALL_ENV.map((key) => [key, process.env[key]]));
  const realFetch = globalThis.fetch;
  const calls = [];
  for (const key of ALL_ENV) delete process.env[key];
  Object.assign(process.env, env);
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), body: JSON.parse(init.body), init });
    return respond();
  };
  try {
    await fn(calls);
  } finally {
    globalThis.fetch = realFetch;
    for (const key of ALL_ENV) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
  }
}

const ok = () => new Response('{"status":"Success: request sent to trigger execution server"}', { status: 200 });

const PROGRAM_LEAD = {
  program: "naca",
  firstName: "Test",
  lastName: "Buyer",
  email: "buyer@example.com",
  phone: "214-555-0100",
  consent: true,
  utmSource: "google",
  pageUrl: "https://daffordablehomes.com/programs/naca",
};

const NEXT_STEP_LEAD = {
  firstName: "Ana",
  email: "ana@example.com",
  mobile: "214-555-0101",
  preferredNextStep: "Schedule a consultation",
  selectedPath: "naca",
  pageUrl: "https://daffordablehomes.com/start",
};

const CONTACT_LEAD = {
  context: "general",
  name: "Sam Visitor",
  email: "sam@example.com",
  phone: "",
  preferredConnection: "Email",
  buyerStage: "",
  message: "A question about getting started.",
};

test("regression: a blank PROGRAM_LEAD_WEBHOOK_URL no longer hides the GoHighLevel webhook", async () => {
  const { POST } = await route("program");
  await withEnv({ PROGRAM_LEAD_WEBHOOK_URL: "", GHL_PROGRAM_LEAD_WEBHOOK_URL: HOOK }, ok, async (calls) => {
    const response = await post(POST, "program", PROGRAM_LEAD);
    assert.equal(response.status, 200);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, HOOK);
  });
});

test("every form reaches the same GoHighLevel webhook with the same contact keys", async () => {
  const handlers = {
    program: (await route("program")).POST,
    "next-step": (await route("next-step")).POST,
    contact: (await route("contact")).POST,
  };

  await withEnv({ GHL_PROGRAM_LEAD_WEBHOOK_URL: HOOK }, ok, async (calls) => {
    assert.equal((await post(handlers.program, "program", PROGRAM_LEAD)).status, 200);
    assert.equal((await post(handlers["next-step"], "next-step", NEXT_STEP_LEAD)).status, 200);
    assert.equal((await post(handlers.contact, "contact", CONTACT_LEAD)).status, 200);

    assert.equal(calls.length, 3);
    assert.ok(calls.every((call) => call.url === HOOK));
    assert.ok(calls.every((call) => call.init.headers["content-type"] === "application/json"));

    const contactKeys = (body) => ({
      first_name: body.first_name,
      last_name: body.last_name,
      full_name: body.full_name,
      email: body.email,
      phone: body.phone,
      lead_type: body.lead_type,
    });

    const [program, nextStep, contact] = calls.map((call) => call.body);
    assert.deepEqual(contactKeys(program), {
      first_name: "Test",
      last_name: "Buyer",
      full_name: "Test Buyer",
      email: "buyer@example.com",
      phone: "214-555-0100",
      lead_type: "program-naca",
    });
    assert.deepEqual(contactKeys(nextStep), {
      first_name: "Ana",
      last_name: "",
      full_name: "Ana",
      email: "ana@example.com",
      phone: "214-555-0101",
      lead_type: "next-step",
    });
    assert.deepEqual(contactKeys(contact), {
      first_name: "Sam",
      last_name: "Visitor",
      full_name: "Sam Visitor",
      email: "sam@example.com",
      phone: "",
      lead_type: "contact",
    });

    // Each form's own fields still arrive, so existing mappings keep working.
    assert.equal(program.source, "NACA Landing Page");
    assert.equal(program.utmSource, "google");
    assert.equal(program.consent, true);
    assert.equal(nextStep.mobile, "214-555-0101");
    assert.equal(nextStep.source, "Find My Next Step");
    assert.equal(contact.source, "Contact form");
    assert.equal(contact.name, "Sam Visitor");
  });
});

test("a GoHighLevel outage or timeout is reported, never shown as delivered", async () => {
  const { POST } = await route("next-step");
  await withEnv({ GHL_PROGRAM_LEAD_WEBHOOK_URL: HOOK }, () => new Response("", { status: 500 }), async () => {
    const response = await post(POST, "next-step", NEXT_STEP_LEAD);
    assert.equal(response.status, 502);
    assert.equal((await response.json()).ok, false);
  });
  await withEnv(
    { GHL_PROGRAM_LEAD_WEBHOOK_URL: HOOK },
    () => {
      throw new DOMException("The operation timed out.", "TimeoutError");
    },
    async () => {
      const response = await post(POST, "next-step", NEXT_STEP_LEAD);
      assert.equal(response.status, 502);
    },
  );
});

test("with no webhook at all, every form says so honestly and sends nothing", async () => {
  for (const [name, body] of [
    ["program", PROGRAM_LEAD],
    ["next-step", NEXT_STEP_LEAD],
    ["contact", CONTACT_LEAD],
  ]) {
    const { POST } = await route(name);
    await withEnv({}, ok, async (calls) => {
      const response = await post(POST, name, body);
      assert.equal(response.status, 503, name);
      assert.equal(calls.length, 0, name);
    });
  }
});

/* ---- booking calendar -------------------------------------------------- */

test("a GoHighLevel booking link is accepted from the forms GoHighLevel gives it in", () => {
  const cases = [
    ["https://api.leadconnectorhq.com/widget/booking/AbC123xyz", "https://api.leadconnectorhq.com"],
    ["https://link.msgsndr.com/widget/booking/AbC123xyz", "https://link.msgsndr.com"],
    ["https://api.leadconnectorhq.com/widget/group/Grp_9", "https://api.leadconnectorhq.com"],
    // A white-labelled domain the agency points at GoHighLevel.
    ["https://book.example-agency.com/widget/booking/AbC123xyz", "https://book.example-agency.com"],
    // The whole embed snippet, pasted as-is.
    [
      '<iframe src="https://api.leadconnectorhq.com/widget/booking/AbC123xyz" style="width: 100%;border:none;overflow: hidden;" scrolling="no" id="AbC123xyz_1"></iframe><br><script src="https://link.msgsndr.com/js/form_embed.js" type="text/javascript"></script>',
      "https://api.leadconnectorhq.com",
    ],
  ];
  for (const [raw, origin] of cases) {
    const parsed = parseBookingUrl(raw);
    assert.ok(parsed, `accepted: ${raw.slice(0, 60)}`);
    assert.equal(parsed.origin, origin);
    assert.match(parsed.url, /\/widget\/(booking|group)\//);
  }
});

test("anything that is not an https booking widget is refused", () => {
  for (const raw of [
    undefined,
    "",
    "   ",
    "http://api.leadconnectorhq.com/widget/booking/AbC123xyz",
    "https://api.leadconnectorhq.com/widget/form/AbC123xyz",
    "https://api.leadconnectorhq.com/",
    "https://user:pass@api.leadconnectorhq.com/widget/booking/AbC123xyz",
    "javascript:alert(1)",
    "https://api.leadconnectorhq.com/widget/booking/../../evil",
    "not a url",
  ]) {
    assert.equal(parseBookingUrl(raw), null, `refused: ${raw}`);
  }
});

async function servedPolicy(env) {
  const saved = process.env.GHL_BOOKING_URL;
  if (env === undefined) delete process.env.GHL_BOOKING_URL;
  else process.env.GHL_BOOKING_URL = env;
  try {
    // A fresh module instance each time: the policy is computed at import.
    const { default: config } = await import(`../../apps/web/next.config.mjs?case=${Math.random()}`);
    const headers = await config.headers();
    const publicRule = headers.find((rule) => rule.source.startsWith("/((?!studio"));
    return publicRule.headers.find((header) => header.key === "Content-Security-Policy").value;
  } finally {
    if (saved === undefined) delete process.env.GHL_BOOKING_URL;
    else process.env.GHL_BOOKING_URL = saved;
  }
}

test("the public policy frames the configured calendar, and nothing else from GoHighLevel", async () => {
  const without = await servedPolicy(undefined);
  assert.doesNotMatch(without, /leadconnectorhq|msgsndr/);

  const withCalendar = await servedPolicy("https://api.leadconnectorhq.com/widget/booking/AbC123xyz");
  const frameSrc = withCalendar.split("; ").find((directive) => directive.startsWith("frame-src"));
  assert.match(frameSrc, /https:\/\/api\.leadconnectorhq\.com(?: |$)/);
  // The frame is allowed; no GoHighLevel script, style or connection is.
  for (const directive of withCalendar.split("; ").filter((d) => !d.startsWith("frame-src"))) {
    assert.doesNotMatch(directive, /leadconnectorhq|msgsndr/, directive);
  }
  assert.doesNotMatch(withCalendar, /unsafe-eval/);

  // An invalid value adds nothing rather than widening the policy.
  assert.doesNotMatch(await servedPolicy("https://evil.example.com/not-a-calendar"), /evil\.example\.com/);
});

test("the consultation page renders the calendar only when configured, with an accessible fallback", () => {
  const page = read("apps/web/app/consultation/page.tsx");
  assert.match(page, /const booking = bookingEmbed\(\)/);
  assert.match(page, /\{booking && <BookingCalendar booking=\{booking\} \/>\}/);
  // The message form is always there, calendar or not.
  assert.match(page, /<ContactForm context="consultation" \/>/);

  const calendar = read("apps/web/components/contact/booking-calendar.tsx");
  assert.match(calendar, /<iframe[\s\S]*?title="[^"]+"/);
  assert.match(calendar, /target="_blank" rel="noopener noreferrer"/);
  assert.doesNotMatch(calendar, /<script|form_embed/, "no GoHighLevel script on the public site");
});

test("the environment reference documents every GoHighLevel variable", () => {
  const example = read(".env.example");
  for (const name of [...ALL_ENV, "GHL_BOOKING_URL"]) {
    assert.match(example, new RegExp(`^${name}=$`, "m"), `${name} in .env.example`);
  }
});
