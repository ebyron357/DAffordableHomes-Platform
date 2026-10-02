import assert from "node:assert/strict"
import { register } from "node:module"
import { test } from "node:test"
import { pathToFileURL } from "node:url"

/**
 * The rate limiter's own resource bounds.
 *
 * These are behavioural: the real module is imported and driven, because the
 * defect this file exists for was invisible to a source-text assertion. The
 * first version swept only expired entries once the map passed 500, then
 * inserted unconditionally — so a flood of distinct addresses inside one window
 * swept nothing, grew the map without limit, and paid an O(n) scan on every
 * later request. The limiter was the cheapest way to exhaust the instance it
 * protected.
 */

register("../../scripts/sanity/ts-resolver.mjs", import.meta.url)

const { rateLimit, clientIdentifier, __resetRateLimitForTests } = await import(
  pathToFileURL("apps/web/lib/rate-limit.ts").href
)

const WINDOW = { limit: 5, windowMs: 60_000 }

test("it allows up to the limit and refuses the next request", () => {
  __resetRateLimitForTests()

  for (let i = 1; i <= WINDOW.limit; i += 1) {
    assert.equal(rateLimit("t", "1.1.1.1", WINDOW).ok, true, `request ${i} should be allowed`)
  }

  const refused = rateLimit("t", "1.1.1.1", WINDOW)
  assert.equal(refused.ok, false)
  assert.ok(refused.retryAfter >= 1, "a refusal must carry a Retry-After of at least one second")
})

test("buckets are independent, so one endpoint cannot exhaust another's allowance", () => {
  __resetRateLimitForTests()

  for (let i = 0; i < WINDOW.limit + 2; i += 1) rateLimit("leads:next-step", "1.1.1.1", WINDOW)

  assert.equal(
    rateLimit("leads:program", "1.1.1.1", WINDOW).ok,
    true,
    "the program bucket should still have its own allowance",
  )
})

test("distinct callers do not consume each other's allowance", () => {
  __resetRateLimitForTests()

  for (let i = 0; i < WINDOW.limit + 2; i += 1) rateLimit("t", "1.1.1.1", WINDOW)

  assert.equal(rateLimit("t", "2.2.2.2", WINDOW).ok, true)
})

test("the tracked-identifier map is bounded under a flood of distinct addresses", () => {
  __resetRateLimitForTests()

  // Far more unique identifiers than the documented capacity, all inside one
  // window so nothing is sweepable. The unbounded version grew one entry per
  // address; this must level off instead.
  let refusals = 0
  for (let i = 0; i < 20_000; i += 1) {
    if (!rateLimit("flood", `10.0.${(i >> 8) & 255}.${i & 255}`, WINDOW).ok) refusals += 1
  }

  assert.ok(
    refusals > 0,
    "once capacity is reached a new identifier must be refused rather than admitted",
  )

  // The refusals must come from capacity, not from the per-caller limit: every
  // address above was unique, so none of them could exceed 5 requests.
  assert.ok(
    refusals >= 20_000 - 5_000,
    `expected roughly the overflow to be refused, got ${refusals}`,
  )
})

test("a refusal at capacity still carries a usable Retry-After", () => {
  __resetRateLimitForTests()

  let refused = null
  for (let i = 0; i < 20_000 && !refused; i += 1) {
    const result = rateLimit("cap", `172.16.${(i >> 8) & 255}.${i & 255}`, WINDOW)
    if (!result.ok) refused = result
  }

  assert.ok(refused, "the flood should have reached capacity")
  assert.ok(refused.retryAfter >= 1, "a capacity refusal must not report Retry-After 0")
})

test("an expired window is replaced without consuming capacity", () => {
  __resetRateLimitForTests()

  const tiny = { limit: 1, windowMs: 1 }
  assert.equal(rateLimit("expiry", "3.3.3.3", tiny).ok, true)
  assert.equal(rateLimit("expiry", "3.3.3.3", tiny).ok, false, "a second request inside the window")

  const start = Date.now()
  while (Date.now() - start < 5) {
    // Wait out the 1ms window without a timer, so the test stays synchronous.
  }

  assert.equal(
    rateLimit("expiry", "3.3.3.3", tiny).ok,
    true,
    "the window should have turned over and the allowance reset",
  )
})

test("a caller with no usable address is bucketed, not waved through", () => {
  const none = clientIdentifier(new Request("https://example.com"))
  assert.equal(none, "unknown")

  const forwarded = clientIdentifier(
    new Request("https://example.com", { headers: { "x-forwarded-for": "9.9.9.9, 10.0.0.1" } }),
  )
  assert.equal(forwarded, "9.9.9.9", "the first hop is the one Vercel sets")

  const realIp = clientIdentifier(
    new Request("https://example.com", { headers: { "x-real-ip": " 8.8.8.8 " } }),
  )
  assert.equal(realIp, "8.8.8.8")

  __resetRateLimitForTests()
  for (let i = 0; i < WINDOW.limit; i += 1) rateLimit("t", "unknown", WINDOW)
  assert.equal(
    rateLimit("t", "unknown", WINDOW).ok,
    false,
    "an absent address must not be a way to opt out of the limit",
  )
})
