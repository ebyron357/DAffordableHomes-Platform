import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

/**
 * Abuse and validation boundaries on the one public write endpoint.
 *
 * AGENTS.md §6 requires validated input and rate limiting on public forms.
 * The honeypot and the elapsed-time check that shipped first are both values
 * the client sends, so a replayed request satisfies them; these assertions pin
 * the two boundaries a caller cannot set.
 */

const read = (file) => readFileSync(file, "utf8");

const ROUTE = "apps/web/app/api/leads/next-step/route.ts";
const LIMITER = "apps/web/lib/rate-limit.ts";

test("the public lead endpoint rate-limits before it forwards anything", () => {
  const route = read(ROUTE);

  assert.match(route, /import \{ clientIdentifier, rateLimit \} from "@\/lib\/rate-limit"/);
  assert.match(route, /rateLimit\("leads:next-step", clientIdentifier\(request\)/);
  assert.match(route, /status: 429, headers: \{ "retry-after"/);

  // The limit has to be reached before the webhook call, not after it.
  assert.ok(
    route.indexOf("rateLimit(") < route.indexOf("NEXT_STEP_LEAD_WEBHOOK_URL"),
    "the rate limit must be applied before the webhook URL is read",
  );
});

test("a request with no usable address is bucketed, not waved through", () => {
  const limiter = read(LIMITER);

  assert.match(limiter, /x-forwarded-for/);
  assert.match(limiter, /return request\.headers\.get\("x-real-ip"\)\?\.trim\(\) \|\| "unknown"/);
  assert.doesNotMatch(limiter, /return \{ ok: true[^}]*\}\s*\/\/ no identifier/);
});

test("the email address is validated on the server, not only in the browser", () => {
  const route = read(ROUTE);

  assert.match(route, /const EMAIL = /);
  assert.match(route, /EMAIL\.test\(email\)/);

  // The shape check must reject what `type="email"` alone was catching.
  const source = route.match(/const EMAIL = (\/.*\/)\n/);
  assert.ok(source, "the email pattern should be a literal so it can be checked here");
  const pattern = new RegExp(source[1].slice(1, -1));
  for (const bad of ["x", "@", "a@b", "a b@example.com", "a@@example.com", "a@example."]) {
    assert.equal(pattern.test(bad), false, `${bad} should be rejected`);
  }
  for (const good of ["debra@example.com", "first.last+tag@mail.example.co.uk"]) {
    assert.equal(pattern.test(good), true, `${good} should be accepted`);
  }
});
