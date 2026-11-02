import assert from "node:assert/strict";
import { register } from "node:module";
import { test } from "node:test";

/**
 * Cross-site guard on the lead endpoints and the replay window on the Sanity
 * revalidate webhook. Both call the real modules, not their source text.
 */

register("../../scripts/sanity/ts-resolver.mjs", import.meta.url);
register(
  'data:text/javascript,export async function resolve(s,c,n){return n(s==="next/server"?"next/server.js":s,c)}',
);

const { rejectCrossSite } = await import(new URL("../../apps/web/lib/request-guard.ts", import.meta.url).href);
const { isFreshSignature, SIGNATURE_MAX_AGE_MS } = await import(
  new URL("../../apps/web/lib/webhook-freshness.ts", import.meta.url).href
);

const URL_ = "https://daffordablehomes.com/api/leads/contact";
const req = (headers) => new Request(URL_, { method: "POST", headers, body: "{}" });

test("the site's own JSON submissions pass the guard", () => {
  assert.equal(rejectCrossSite(req({ "content-type": "application/json" })), null);
  assert.equal(
    rejectCrossSite(req({ "content-type": "application/json; charset=utf-8", origin: "https://daffordablehomes.com" })),
    null,
  );
  // Behind Vercel the visitor's host arrives as x-forwarded-host.
  assert.equal(
    rejectCrossSite(
      new Request("https://deploy-abc.vercel.app/api/leads/contact", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: "https://www.daffordablehomes.com",
          "x-forwarded-host": "www.daffordablehomes.com",
        },
        body: "{}",
      }),
    ),
    null,
  );
});

test("a body not declared as JSON is refused with 415", () => {
  for (const type of [undefined, "text/plain", "application/x-www-form-urlencoded", "multipart/form-data"]) {
    const response = rejectCrossSite(req(type ? { "content-type": type } : {}));
    assert.equal(response?.status, 415, String(type));
  }
});

test("a request from another site's page is refused with 403", () => {
  for (const origin of ["https://evil.example", "null", "https://daffordablehomes.com.evil.example"]) {
    const response = rejectCrossSite(req({ "content-type": "application/json", origin }));
    assert.equal(response?.status, 403, origin);
  }
});

test("every lead route runs the guard before reading the body", async () => {
  const { readFileSync } = await import("node:fs");
  for (const route of ["contact", "program", "next-step"]) {
    const source = readFileSync(`apps/web/app/api/leads/${route}/route.ts`, "utf8");
    const guard = source.indexOf("rejectCrossSite(request)");
    assert.ok(guard > 0, `${route} calls the guard`);
    assert.ok(guard < source.indexOf("request.json()"), `${route} guards before parsing`);
  }
});

test("revalidate webhooks older than the replay window are stale", () => {
  const now = 1_800_000_000_000;
  assert.equal(isFreshSignature(`t=${now},v1=abc`, now), true);
  assert.equal(isFreshSignature(`t=${now - SIGNATURE_MAX_AGE_MS},v1=abc`, now), true);
  assert.equal(isFreshSignature(`t=${now - SIGNATURE_MAX_AGE_MS - 1},v1=abc`, now), false);
  assert.equal(isFreshSignature(`t=${now + SIGNATURE_MAX_AGE_MS + 1},v1=abc`, now), false);
  assert.equal(isFreshSignature(null, now), false);
  assert.equal(isFreshSignature("v1=abc", now), false);
});
