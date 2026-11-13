import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"
import { calculatorInputError } from "../../apps/web/lib/calculator-input.ts"

const read = (path) => readFileSync(`apps/web/${path}`, "utf8")

test("numeric fields distinguish empty input from a valid zero", () => {
  assert.equal(calculatorInputError(0), undefined)
  assert.match(calculatorInputError(NaN), /Enter a number/)
  assert.match(calculatorInputError(Infinity), /Enter a number/)
})

test("numeric fields reject out-of-range values without silently clamping them", () => {
  assert.match(calculatorInputError(-1), /0 or more/)
  assert.match(calculatorInputError(26, 0, 25), /25 or less/)
  assert.match(calculatorInputError(20000, 0, 10000), /10,000 or less/)
  assert.equal(calculatorInputError(6.625, 0, 25), undefined)
  assert.equal(calculatorInputError(25, 0, 25), undefined)
  assert.match(calculatorInputError(0, 1, 30), /1 or more/)
  assert.match(calculatorInputError(Number.MAX_VALUE), /or less/)
})

test("calculator outputs are hidden when an input is invalid, including the comparison table", () => {
  const ui = read("components/calculators/calculator-ui.tsx")
  const calculators = read("components/calculators/homebuyer-calculators.tsx")
  assert.match(ui, /aria-invalid=\{Boolean\(error\)\}/)
  assert.match(ui, /group-has-\[\[aria-invalid=true\]\]\/calculator:hidden/)
  assert.match(ui, /Your estimate is paused/)
  assert.doesNotMatch(ui, /valueAsNumber \|\| 0/)
  assert.match(calculators, /<CalculatorResults>/)
  assert.match(ui, /Discuss these estimates with Debra/)
  assert.match(ui, /Starting values are examples/)
})

test("contact collection is gated on the server and only the availability boolean reaches the client", () => {
  for (const route of ["contact", "consultation"]) {
    const page = read(`app/${route}/page.tsx`)
    assert.match(page, /deliveryAvailable=\{Boolean\(leadWebhookUrl\("contact"\)\)\}/)
    assert.match(page, /dynamic = "force-dynamic"/)
  }
  const form = read("components/contact/contact-form.tsx")
  assert.ok(form.indexOf("if (!deliveryAvailable)") < form.indexOf("<form"))
  assert.match(form, /No contact details are being collected/)
  assert.match(form, /not a confirmed appointment/)
  assert.doesNotMatch(form, /process\.env|leadWebhookUrl/)
  assert.doesNotMatch(form, /px-4 py-2\.5 text-sm/)
})
