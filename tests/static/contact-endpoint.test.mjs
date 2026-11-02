import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { register } from "node:module";
import { test } from "node:test";

/**
 * The /contact and /consultation message form, end to end on the server.
 *
 * Until 2026-10-02 this form validated, waited 400ms and told the visitor it
 * was not connected, on the page every "Schedule a Consultation" button opens.
 * These cases call the real route handler, so they prove what a visitor gets
 * back rather than what the source happens to contain.
 */

register("../../scripts/sanity/ts-resolver.mjs", import.meta.url);
// `next` ships no exports map, so Node's ESM resolver needs the file name.
register(
  'data:text/javascript,export async function resolve(s,c,n){return n(s==="next/server"?"next/server.js":s,c)}',
);

const { POST } = await import(new URL("../../apps/web/app/api/leads/contact/route.ts", import.meta.url).href);

const ENV = ["LEAD_WEBHOOK_URL", "PROGRAM_LEAD_WEBHOOK_URL", "GHL_PROGRAM_LEAD_WEBHOOK_URL"];

let caller = 0;
/** A request from a fresh address, so one case cannot spend another's rate limit. */
function submit(body, ip = `203.0.113.${++caller}`) {
  return POST(
    new Request("https://daffordablehomes.com/api/leads/contact", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip },
      body: JSON.stringify(body),
    }),
  );
}

const VALID = {
  context: "consultation",
  name: "Test Visitor",
  email: "visitor@example.com",
  phone: "",
  preferredConnection: "Email",
  buyerStage: "Preparing finances and documents",
  message: "I would like to talk about getting ready to buy.",
  pageUrl: "https://daffordablehomes.com/consultation",
};

/** Runs `fn` with the given webhook variables and a recording fetch. */
async function withDestination(env, respond, fn) {
  const saved = Object.fromEntries(ENV.map((key) => [key, process.env[key]]));
  const realFetch = globalThis.fetch;
  const calls = [];
  for (const key of ENV) delete process.env[key];
  Object.assign(process.env, env);
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init, body: JSON.parse(init.body) });
    return respond();
  };
  try {
    await fn(calls);
  } finally {
    globalThis.fetch = realFetch;
    for (const key of ENV) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
  }
}

const ok = () => new Response("{}", { status: 200 });

test("with no destination configured it says so, and sends nothing", async () => {
  await withDestination({}, ok, async (calls) => {
    const response = await submit(VALID);
    assert.equal(response.status, 503);
    assert.match((await response.json()).error, /not connected yet, so this was not sent/);
    assert.equal(calls.length, 0);
  });
});

test("a set-but-empty variable falls through to the next one", async () => {
  await withDestination(
    { LEAD_WEBHOOK_URL: "", PROGRAM_LEAD_WEBHOOK_URL: "https://hooks.example.test/program" },
    ok,
    async (calls) => {
      assert.equal((await submit(VALID)).status, 200);
      assert.equal(calls[0].url, "https://hooks.example.test/program");
    },
  );
});

test("a valid message is delivered once, with only the fields the form collects and the common CRM keys", async () => {
  await withDestination({ LEAD_WEBHOOK_URL: "https://hooks.example.test/lead" }, ok, async (calls) => {
    const response = await submit({ ...VALID, unexpected: "dropped" });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true });

    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "https://hooks.example.test/lead");
    assert.equal(calls[0].init.method, "POST");
    const { submittedAt, ...payload } = calls[0].body;
    assert.ok(!Number.isNaN(Date.parse(submittedAt)));
    assert.deepEqual(payload, {
      // The keys every lead shares, so one GoHighLevel mapping fits every form.
      first_name: "Test",
      last_name: "Visitor",
      full_name: "Test Visitor",
      lead_type: "consultation",
      name: "Test Visitor",
      email: "visitor@example.com",
      preferredConnection: "Email",
      buyerStage: "Preparing finances and documents",
      message: "I would like to talk about getting ready to buy.",
      source: "Consultation request",
      pageUrl: "https://daffordablehomes.com/consultation",
    });
  });
});

test("the general contact form is labelled as such", async () => {
  await withDestination({ LEAD_WEBHOOK_URL: "https://hooks.example.test/lead" }, ok, async (calls) => {
    const { context, phone, preferredConnection, buyerStage, ...general } = VALID;
    assert.equal((await submit({ ...general, context: "general" })).status, 200);
    assert.equal(calls[0].body.source, "Contact form");
  });
});

test("invalid submissions are refused before anything is sent", async () => {
  await withDestination({ LEAD_WEBHOOK_URL: "https://hooks.example.test/lead" }, ok, async (calls) => {
    for (const [why, body] of [
      ["no message", { ...VALID, message: "  " }],
      ["no name", { ...VALID, name: "" }],
      ["unusable email", { ...VALID, email: "visitor@example" }],
      ["unlisted stage", { ...VALID, buyerStage: "Something else" }],
      ["unlisted connection", { ...VALID, preferredConnection: "Carrier pigeon" }],
    ]) {
      assert.equal((await submit(body)).status, 400, why);
    }
    const notJson = await POST(
      new Request("https://daffordablehomes.com/api/leads/contact", {
        method: "POST",
        headers: { "x-forwarded-for": "198.51.100.1" },
        body: "name=x",
      }),
    );
    assert.equal(notJson.status, 400);
    assert.equal(calls.length, 0);
  });
});

test("bots are absorbed: the honeypot succeeds silently and too-fast posts are refused", async () => {
  await withDestination({ LEAD_WEBHOOK_URL: "https://hooks.example.test/lead" }, ok, async (calls) => {
    assert.equal((await submit({ ...VALID, website: "https://spam.example" })).status, 200);
    assert.equal((await submit({ ...VALID, startedAt: Date.now() })).status, 429);
    assert.equal(calls.length, 0);
  });
});

test("one address is limited to five messages a minute", async () => {
  await withDestination({ LEAD_WEBHOOK_URL: "https://hooks.example.test/lead" }, ok, async (calls) => {
    const ip = "192.0.2.77";
    for (let i = 0; i < 5; i += 1) assert.equal((await submit(VALID, ip)).status, 200);
    const sixth = await submit(VALID, ip);
    assert.equal(sixth.status, 429);
    assert.ok(Number(sixth.headers.get("retry-after")) > 0);
    assert.equal(calls.length, 5);
  });
});

test("an upstream failure is reported, never shown as sent", async () => {
  await withDestination(
    { LEAD_WEBHOOK_URL: "https://hooks.example.test/lead" },
    () => new Response("down", { status: 500 }),
    async () => {
      const response = await submit(VALID);
      assert.equal(response.status, 502);
      assert.equal((await response.json()).ok, false);
    },
  );
  await withDestination(
    { LEAD_WEBHOOK_URL: "https://hooks.example.test/lead" },
    () => {
      throw new TypeError("fetch failed");
    },
    async () => {
      assert.equal((await submit(VALID)).status, 502);
    },
  );
});

test("the form posts to the endpoint and shows success only when it was delivered", () => {
  const form = readFileSync("apps/web/components/contact/contact-form.tsx", "utf8");
  assert.match(form, /fetch\("\/api\/leads\/contact"/);
  assert.doesNotMatch(form, /setTimeout\(/, "the old simulated delay must not come back");
  // Success is reached only through response.ok; a 503 keeps the honest notice.
  assert.match(form, /if \(response\.ok\) \{\s*form\.reset\(\)\s*setStatus\("success"\)/);
  assert.match(form, /response\.status === 503\) \{\s*setStatus\("unavailable"\)/);
  // The form's choices are exactly the ones the server accepts.
  const route = readFileSync("apps/web/app/api/leads/contact/route.ts", "utf8");
  for (const option of form.matchAll(/<option>([^<]+)<\/option>/g)) {
    assert.ok(route.includes(`"${option[1]}"`), `server does not accept "${option[1]}"`);
  }
});

test("the privacy policy describes what the forms actually send", () => {
  // It said "name, email, and message" while the program forms sent phone,
  // city, ZIP, timeline, referrer and campaign tags.
  const policy = readFileSync("apps/web/app/privacy/page.tsx", "utf8").replace(/\s+/g, " ");
  assert.doesNotMatch(policy, /such as your name, email, and message/);
  for (const disclosed of ["phone number", "ZIP code", "timeline", "page that referred you", "utm_source", "mobile number", "IP address"]) {
    assert.ok(policy.includes(disclosed), `privacy policy should mention ${disclosed}`);
  }
  // And it must stay true: no tracker script is loaded anywhere in the app.
  const layout = readFileSync("apps/web/app/layout.tsx", "utf8");
  assert.doesNotMatch(layout, /next\/script|googletagmanager|clarity\.ms/);
});
