import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

/**
 * Abuse and validation boundaries on the public write endpoints.
 *
 * AGENTS.md §6 requires validated input and rate limiting on public forms. The
 * honeypot and the elapsed-time check that shipped first are both values the
 * client sends, so a replayed request satisfies them; these assertions pin the
 * boundaries a caller cannot set.
 *
 * This file used to describe `/api/leads/next-step` as "the one public write
 * endpoint". It was not: `/api/leads/program` takes the same kind of submission
 * from the NACA and Homes for Heroes landing pages, and had neither a rate limit
 * nor server-side address validation. Both endpoints are asserted here now, and
 * the list below is what keeps a third one from being added without them.
 */

const read = (file) => readFileSync(file, "utf8");

const VALIDATION = "apps/web/lib/lead-validation.ts";
const LIMITER = "apps/web/lib/rate-limit.ts";

/** Every public endpoint that forwards a visitor submission onwards. */
const LEAD_ENDPOINTS = [
  {
    route: "apps/web/app/api/leads/next-step/route.ts",
    bucket: "leads:next-step",
    webhookEnv: "NEXT_STEP_LEAD_WEBHOOK_URL",
  },
  {
    route: "apps/web/app/api/leads/program/route.ts",
    bucket: "leads:program",
    webhookEnv: "PROGRAM_LEAD_WEBHOOK_URL",
  },
  {
    // The /contact and /consultation message form. Until 2026-10-02 it posted
    // nowhere at all.
    route: "apps/web/app/api/leads/contact/route.ts",
    bucket: "leads:contact",
    webhookEnv: "LEAD_WEBHOOK_URL",
  },
];

for (const { route, bucket, webhookEnv } of LEAD_ENDPOINTS) {
  test(`${bucket} rate-limits before it forwards anything`, () => {
    const source = read(route);

    assert.match(source, /import \{ clientIdentifier, rateLimit \} from "@\/lib\/rate-limit"/);
    assert.match(
      source,
      new RegExp(`rateLimit\\("${bucket}", clientIdentifier\\(request\\)`),
      `${route} must rate-limit on the caller's address`,
    );
    assert.match(source, /status: 429, headers: \{ "retry-after"/);

    // The limit has to be reached before the webhook call, not after it.
    assert.ok(
      source.indexOf("rateLimit(") < source.indexOf(`process.env.${webhookEnv}`),
      `${route} must apply the rate limit before the webhook URL is read`,
    );
  });

  test(`${bucket} validates the email address on the server`, () => {
    const source = read(route);

    assert.match(source, /import \{ isValidEmail \} from "@\/lib\/lead-validation"/);
    assert.match(source, /if \(!isValidEmail\(email\)\)/);

    // A non-empty check is not validation. This is the assertion that fails if
    // the program endpoint's original `!email` test ever comes back.
    assert.ok(
      source.indexOf("isValidEmail(email)") < source.indexOf(`process.env.${webhookEnv}`),
      `${route} must reject an unusable address before it reads the webhook URL`,
    );
  });
}

test("the shared address check rejects what type=email alone was catching", () => {
  const validation = read(VALIDATION);

  const literal = validation.match(/export const EMAIL_PATTERN = (\/.*\/)\n/);
  assert.ok(literal, "the pattern should be a literal so it can be checked here");
  const pattern = new RegExp(literal[1].slice(1, -1));

  for (const bad of ["x", "@", "a@b", "a b@example.com", "a@@example.com", "a@example.", ""]) {
    assert.equal(pattern.test(bad), false, `${bad || "(empty)"} should be rejected`);
  }
  for (const good of ["debra@example.com", "first.last+tag@mail.example.co.uk"]) {
    assert.equal(pattern.test(good), true, `${good} should be accepted`);
  }
});

test("a request with no usable address is bucketed, not waved through", () => {
  const limiter = read(LIMITER);

  assert.match(limiter, /x-forwarded-for/);
  assert.match(limiter, /return request\.headers\.get\("x-real-ip"\)\?\.trim\(\) \|\| "unknown"/);
  assert.doesNotMatch(limiter, /return \{ ok: true[^}]*\}\s*\/\/ no identifier/);
});
