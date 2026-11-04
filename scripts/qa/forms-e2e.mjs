/**
 * Lead forms end-to-end run (audit finding Q-10).
 *
 * Fills in and submits every public lead form in a real Chromium browser on
 * the running production server, with the lead API answered by the browser
 * itself (page.route), so nothing ever reaches the CRM. For each form it
 * checks four outcomes a visitor can meet:
 *
 *   invalid      required fields empty: no request is sent and the form says so
 *   delivered    API 200: the success state appears and the request carried the
 *                visitor's fields as JSON
 *   unavailable  API 503 (no webhook configured): an honest "not sent" state,
 *                never a success
 *   failed       API 502 with an error message: the message is shown, the form
 *                stays usable, and nothing claims the lead was sent
 *
 * Forms: /contact and /consultation (message form), /programs/naca and
 * /programs/homes-for-heroes (program form), /start (next-step lead form,
 * reached by completing the readiness assessment).
 *
 * Usage:
 *   node scripts/qa/forms-e2e.mjs [--base http://127.0.0.1:3111]
 */
import process from "node:process"
import { chromium } from "playwright"

const args = process.argv.slice(2)
const baseIndex = args.indexOf("--base")
const BASE = (baseIndex >= 0 && args[baseIndex + 1] ? args[baseIndex + 1] : "http://127.0.0.1:3111").replace(/\/$/, "")

const VISITOR = { first: "Pat", last: "Visitor", email: "pat.visitor@example.com", phone: "214-555-0101" }

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium" })
let failures = 0
let passes = 0

function check(label, condition, detail = "") {
  if (condition) {
    passes++
    console.log(`PASS ${label}`)
  } else {
    failures++
    console.log(`FAIL ${label}${detail ? `: ${detail}` : ""}`)
  }
}

/**
 * Opens a page with the given lead endpoint answered by `reply`, records every
 * request to it, and fails the run on any console error.
 */
async function open(route, endpoint, reply) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" })
  const page = await context.newPage()
  // A missing element should fail one check quickly, not stall the run.
  page.setDefaultTimeout(8000)
  const requests = []
  const consoleErrors = []
  page.on("console", (message) => {
    // A 5xx we return on purpose is logged by the browser as a failed resource;
    // that is the scenario under test, not a page error.
    if (message.type() === "error" && !/status of 50\d/.test(message.text())) consoleErrors.push(message.text())
  })
  await page.route(`**${endpoint}`, async (request) => {
    requests.push({
      contentType: request.request().headers()["content-type"],
      body: JSON.parse(request.request().postData() || "{}"),
    })
    const { status, body } = reply()
    await request.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) })
  })
  await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" })
  // The server refuses a submission made sooner than 1.5s after the form loaded;
  // keep the run honest about that even though the API is stubbed here.
  await page.waitForTimeout(1600)
  return { context, page, requests, consoleErrors }
}

const OK = () => ({ status: 200, body: { ok: true } })
const UNAVAILABLE = () => ({ status: 503, body: { ok: false, error: "Online messages are not connected yet, so this was not sent." } })
const FAILED = () => ({ status: 502, body: { ok: false, error: "Message delivery is temporarily unavailable. Please try again in a few minutes." } })

/* ------------------------------------------------------------- message form */

async function messageForm(route, successTitle) {
  const endpoint = "/api/leads/contact"
  const submit = (page) => page.locator('form button[type="submit"]').click()
  const fill = async (page) => {
    await page.fill('input[name="name"]', `${VISITOR.first} ${VISITOR.last}`)
    await page.fill('input[name="email"]', VISITOR.email)
    await page.fill('textarea[name="message"]', "We rent in Garland and want to know what to do first.")
  }

  {
    const { context, page, requests, consoleErrors } = await open(route, endpoint, OK)
    await submit(page)
    await page.waitForTimeout(300)
    check(`${route} invalid: no request sent`, requests.length === 0, `${requests.length} sent`)
    check(`${route} invalid: alert shown`, await page.getByRole("alert").first().isVisible())
    const invalid = await page.$$eval('[aria-invalid="true"]', (els) => els.map((el) => el.getAttribute("name")))
    check(`${route} invalid: each empty field marked`, ["name", "email", "message"].every((n) => invalid.includes(n)), invalid.join(","))
    check(`${route} invalid: no console errors`, consoleErrors.length === 0, consoleErrors.join(" | "))
    await context.close()
  }
  {
    const { context, page, requests } = await open(route, endpoint, OK)
    await fill(page)
    await submit(page)
    await page.getByText(successTitle).waitFor({ timeout: 5000 }).catch(() => {})
    check(`${route} delivered: success shown`, await page.getByText(successTitle).isVisible())
    const sent = requests[0]
    check(`${route} delivered: one JSON request`, requests.length === 1 && /^application\/json/.test(sent?.contentType ?? ""))
    check(
      `${route} delivered: fields sent`,
      sent?.body.name === `${VISITOR.first} ${VISITOR.last}` && sent?.body.email === VISITOR.email && sent?.body.website === "",
      JSON.stringify(sent?.body),
    )
    await context.close()
  }
  {
    const { context, page } = await open(route, endpoint, UNAVAILABLE)
    await fill(page)
    await submit(page)
    const notice = page.getByText("Online messages aren't connected yet")
    await notice.waitFor({ timeout: 5000 }).catch(() => {})
    check(`${route} unavailable: honest notice`, await notice.isVisible())
    check(`${route} unavailable: no success`, !(await page.getByText(successTitle).isVisible()))
    await context.close()
  }
  {
    const { context, page, requests } = await open(route, endpoint, FAILED)
    await fill(page)
    await submit(page)
    const error = page.getByText("Message delivery is temporarily unavailable")
    await error.waitFor({ timeout: 5000 }).catch(() => {})
    check(`${route} failed: server message shown`, await error.isVisible())
    check(`${route} failed: no success`, !(await page.getByText(successTitle).isVisible()))
    await submit(page)
    await page.waitForTimeout(400)
    check(`${route} failed: form can be resubmitted`, requests.length === 2, `${requests.length} requests`)
    await context.close()
  }
}

/* ------------------------------------------------------------- program form */

async function programForm(route, successTitle) {
  const endpoint = "/api/leads/program"
  const form = (page) => page.locator("form").filter({ has: page.locator('input[name="firstName"]') })
  const submit = (page) => form(page).locator('button[type="submit"]').click()
  const fill = async (page) => {
    const f = form(page)
    await f.locator('input[name="firstName"]').fill(VISITOR.first)
    await f.locator('input[name="lastName"]').fill(VISITOR.last)
    await f.locator('input[name="email"]').fill(VISITOR.email)
    await f.locator('input[name="phone"]').fill(VISITOR.phone)
    await f.locator('input[name="consent"]').check()
  }

  {
    const { context, page, requests, consoleErrors } = await open(route, endpoint, OK)
    await submit(page)
    await page.waitForTimeout(300)
    check(`${route} invalid: no request sent`, requests.length === 0, `${requests.length} sent`)
    check(`${route} invalid: "not sent" shown`, await page.getByText("The request was not sent").isVisible())
    check(`${route} invalid: no console errors`, consoleErrors.length === 0, consoleErrors.join(" | "))
    await context.close()
  }
  {
    const { context, page, requests } = await open(route, endpoint, OK)
    await fill(page)
    await submit(page)
    await page.getByText(successTitle).waitFor({ timeout: 5000 }).catch(() => {})
    check(`${route} delivered: success shown`, await page.getByText(successTitle).isVisible())
    const sent = requests[0]
    check(`${route} delivered: one JSON request`, requests.length === 1 && /^application\/json/.test(sent?.contentType ?? ""))
    check(
      `${route} delivered: fields and consent sent`,
      sent?.body.firstName === VISITOR.first &&
        sent?.body.lastName === VISITOR.last &&
        sent?.body.email === VISITOR.email &&
        sent?.body.phone === VISITOR.phone &&
        sent?.body.consent === true,
      JSON.stringify(sent?.body),
    )
    await context.close()
  }
  for (const [label, reply, text] of [
    ["unavailable", UNAVAILABLE, "not connected yet"],
    ["failed", FAILED, "temporarily unavailable"],
  ]) {
    const { context, page } = await open(route, endpoint, reply)
    await fill(page)
    await submit(page)
    const shown = page.getByText(text)
    await shown.waitFor({ timeout: 5000 }).catch(() => {})
    check(`${route} ${label}: server message shown`, await shown.isVisible())
    check(`${route} ${label}: marked not sent`, await page.getByText("The request was not sent").isVisible())
    check(`${route} ${label}: no success`, !(await page.getByText(successTitle).isVisible()))
    await context.close()
  }
}

/* ----------------------------------------------------------- /start lead form */

async function startForm() {
  const route = "/start"
  const endpoint = "/api/leads/next-step"
  const successText = "Thanks — Debra has your next-step request."

  /** Answers every assessment question with its first option and opens the lead form. */
  async function reachLeadForm(page) {
    const assessment = page.locator("#assessment")
    await assessment.scrollIntoViewIfNeeded()
    for (let step = 0; step < 12; step++) {
      const continueButton = assessment.getByRole("button", { name: /Continue|Show me my next step/ })
      if (!(await continueButton.count())) break
      await assessment.locator('input[type="radio"]').first().check({ force: true })
      await continueButton.click()
      await page.waitForTimeout(120)
    }
    await page.getByRole("button", { name: "Want Debra to help?" }).click()
    await page.locator("#lead-capture form").waitFor({ timeout: 5000 })
  }
  const form = (page) => page.locator("#lead-capture form")
  const submit = (page) => form(page).locator('button[type="submit"]').click()
  const fill = async (page) => {
    await form(page).locator('input[name="firstName"]').fill(VISITOR.first)
    await form(page).locator('input[name="email"]').fill(VISITOR.email)
    await form(page).locator('input[name="mobile"]').fill(VISITOR.phone)
  }

  {
    const { context, page, requests, consoleErrors } = await open(route, endpoint, OK)
    await reachLeadForm(page)
    await submit(page)
    await page.waitForTimeout(300)
    check(`${route} invalid: browser blocks empty required fields`, requests.length === 0, `${requests.length} sent`)
    const firstInvalid = await form(page).locator('input[name="firstName"]').evaluate((el) => !el.validity.valid)
    check(`${route} invalid: first name reported invalid`, firstInvalid)
    check(`${route} invalid: no console errors`, consoleErrors.length === 0, consoleErrors.join(" | "))
    await context.close()
  }
  {
    const { context, page, requests } = await open(route, endpoint, OK)
    await reachLeadForm(page)
    await fill(page)
    await submit(page)
    await page.getByText(successText).waitFor({ timeout: 5000 }).catch(() => {})
    check(`${route} delivered: success shown`, await page.getByText(successText).isVisible())
    const sent = requests[0]
    check(`${route} delivered: one JSON request`, requests.length === 1 && /^application\/json/.test(sent?.contentType ?? ""))
    check(
      `${route} delivered: fields and result sent`,
      sent?.body.firstName === VISITOR.first &&
        sent?.body.email === VISITOR.email &&
        sent?.body.mobile === VISITOR.phone &&
        typeof sent?.body.resultKey === "string" &&
        sent?.body.resultKey.length > 0,
      JSON.stringify(sent?.body),
    )
    await context.close()
  }
  for (const [label, reply, text] of [
    ["unavailable", UNAVAILABLE, "not connected yet"],
    ["failed", FAILED, "temporarily unavailable"],
  ]) {
    const { context, page } = await open(route, endpoint, reply)
    await reachLeadForm(page)
    await fill(page)
    await submit(page)
    const alert = form(page).getByRole("alert")
    await alert.waitFor({ timeout: 5000 }).catch(() => {})
    check(`${route} ${label}: server message shown`, (await alert.isVisible()) && (await alert.textContent()).includes(text))
    check(`${route} ${label}: no success`, !(await page.getByText(successText).isVisible()))
    await context.close()
  }
}

const RUNS = [
  ["/contact", () => messageForm("/contact", "Thank you — your message is with Debra")],
  ["/consultation", () => messageForm("/consultation", "Thank you — your consultation request is in")],
  ["/programs/naca", () => programForm("/programs/naca", "Thank you — Debra has your NACA details")],
  ["/programs/homes-for-heroes", () => programForm("/programs/homes-for-heroes", "Thank you — Debra has your details")],
  ["/start", () => startForm()],
]
try {
  for (const [route, run] of RUNS) {
    // An exception (an element that never appeared) fails that form and the
    // run carries on, so one broken form cannot hide the state of the others.
    try {
      await run()
    } catch (error) {
      check(`${route} completed without an exception`, false, String(error?.message ?? error).split("\n")[0])
    }
  }
} finally {
  await browser.close()
}

console.log(`\n${passes} passed, ${failures} failed.`)
process.exit(failures === 0 ? 0 : 1)
