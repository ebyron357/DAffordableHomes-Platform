import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { test } from "node:test";

/**
 * Lead delivery resilience (audit finding Q-05): one retry on fast failures,
 * no retry on an ambiguous timeout, a stable submission ID, and failure logs
 * that never contain visitor data.
 */

const { deliverLead, submissionId, RETRY_DELAY_MS } = await import(pathToFileURL("apps/web/lib/lead-delivery.ts").href);

const URL_ = "https://hooks.example.test/lead";
const PAYLOAD = { first_name: "Pat", email: "pat.visitor@example.com", phone: "214-555-0101", lead_type: "contact" };
const ID = "3f6c1a52-8d4e-4b7a-9c21-5e0f7a9b2c13";

async function run(responses, context = { route: "contact", submissionId: ID }) {
  const realFetch = globalThis.fetch;
  const realError = console.error;
  const realWarn = console.warn;
  const calls = [];
  const logs = [];
  // Only this module's JSON lines; Node may print its own warnings here too.
  const capture = (line) => { if (String(line).startsWith("{")) logs.push(String(line)); };
  console.error = capture;
  console.warn = capture;
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init, body: JSON.parse(init.body) });
    const next = responses[Math.min(calls.length - 1, responses.length - 1)];
    return next();
  };
  try {
    const ok = await deliverLead(URL_, PAYLOAD, context);
    return { ok, calls, logs };
  } finally {
    globalThis.fetch = realFetch;
    console.error = realError;
    console.warn = realWarn;
  }
}

const status = (code) => () => new Response("", { status: code });
const networkError = () => {
  throw new TypeError("fetch failed");
};
const timeout = () => {
  throw new DOMException("The operation timed out.", "TimeoutError");
};

test("a 2xx is delivered on the first attempt and nothing is logged", async () => {
  const { ok, calls, logs } = await run([status(200)]);
  assert.equal(ok, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].body.submission_id, ID);
  assert.equal(calls[0].init.headers["idempotency-key"], ID);
  assert.deepEqual(logs, []);
});

test("a 5xx, 429 or network error is retried once, with the same submission ID", async () => {
  for (const first of [status(503), status(429), status(408), networkError]) {
    const { ok, calls, logs } = await run([first, status(200)]);
    assert.equal(ok, true);
    assert.equal(calls.length, 2);
    assert.equal(calls[0].body.submission_id, calls[1].body.submission_id);
    assert.equal(JSON.parse(logs[0]).event, "lead_delivery_recovered");
  }
});

test("a second failure is reported as failed after exactly two attempts", async () => {
  const { ok, calls, logs } = await run([status(502), status(502)]);
  assert.equal(ok, false);
  assert.equal(calls.length, 2);
  assert.deepEqual(JSON.parse(logs[0]), {
    event: "lead_delivery_failed",
    route: "contact",
    reason: "http_502",
    attempts: 2,
    submissionId: ID,
  });
});

test("a timeout or a 4xx rejection is not retried", async () => {
  for (const [first, reason] of [[timeout, "timeout"], [status(400), "http_400"], [status(404), "http_404"]]) {
    const { ok, calls, logs } = await run([first, status(200)]);
    assert.equal(ok, false, reason);
    assert.equal(calls.length, 1, reason);
    assert.equal(JSON.parse(logs[0]).reason, reason);
  }
});

test("failure logs carry no visitor data", async () => {
  const { logs } = await run([status(500), networkError]);
  assert.equal(logs.length, 1);
  for (const value of [PAYLOAD.first_name, PAYLOAD.email, PAYLOAD.phone]) {
    assert.ok(!logs[0].includes(value), `log leaks ${value}`);
  }
  assert.equal(JSON.parse(logs[0]).reason, "network");
});

test("only a UUID from the form is kept; anything else is replaced", () => {
  assert.equal(submissionId(ID), ID);
  assert.equal(submissionId(` ${ID.toUpperCase()} `), ID);
  for (const junk of [undefined, "", "abc", "1; DROP TABLE", 42, { id: ID }]) {
    const fresh = submissionId(junk);
    assert.notEqual(fresh, junk);
    assert.match(fresh, /^[0-9a-f-]{36}$/);
  }
});

test("the retry pause is short and every route passes the form's ID through", () => {
  assert.ok(RETRY_DELAY_MS > 0 && RETRY_DELAY_MS <= 1000);
  for (const route of ["contact", "program", "next-step"]) {
    const source = readFileSync(`apps/web/app/api/leads/${route}/route.ts`, "utf8");
    assert.match(source, new RegExp(`deliverLead\\(webhookUrl, payload, \\{ route: "${route}", submissionId: body\\.submissionId \\}\\)`));
  }
  for (const form of ["contact/contact-form.tsx", "programs/program-lead-form.tsx", "landing/next-step-landing.tsx"]) {
    const source = readFileSync(`apps/web/components/${form}`, "utf8");
    assert.match(source, /const \[submissionId\] = useState\(newSubmissionId\)/, form);
  }
});
