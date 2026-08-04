import assert from "node:assert/strict"
import { test } from "node:test"
import { cleanText, isPlausiblePhone, isTrustedRequestOrigin, isValidEmail } from "../../apps/web/lib/leads/server.ts"

test("lead text is trimmed and bounded", () => {
  assert.equal(cleanText("  hello  "), "hello")
  assert.equal(cleanText("abcdef", 3), "abc")
  assert.equal(cleanText(null), "")
})

test("lead contact values reject malformed input", () => {
  assert.equal(isValidEmail("buyer@example.com"), true)
  assert.equal(isValidEmail("buyer-at-example.com"), false)
  assert.equal(isPlausiblePhone("(972) 555-0142"), true)
  assert.equal(isPlausiblePhone("123"), false)
})

test("lead endpoints accept same-origin requests and reject cross-origin requests", () => {
  assert.equal(
    isTrustedRequestOrigin(new Request("https://daffordablehomes.com/api/leads/contact", {
      headers: { origin: "https://daffordablehomes.com" },
    })),
    true,
  )
  assert.equal(
    isTrustedRequestOrigin(new Request("https://daffordablehomes.com/api/leads/contact", {
      headers: { origin: "https://example.com" },
    })),
    false,
  )
})
