import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { register } from "node:module"
import { test } from "node:test"
import { pathToFileURL } from "node:url"

/**
 * "Find Your Homebuying Path" — the homepage guided quiz.
 *
 * The behavioural checks import the real content module, so the branching and
 * the resolver are exercised rather than pattern-matched. Every destination a
 * result can point to must be a route that exists in this repository.
 */

register("../../scripts/sanity/ts-resolver.mjs", import.meta.url)

const read = (file) => readFileSync(file, "utf8")

const content = await import(pathToFileURL("apps/web/lib/content/homebuying-path.ts").href)
const { PATH_QUESTIONS, PATH_ORDER, PATH_NAMES, HEROES_HINT, visibleQuestions, resolvePath, buildResult, timelineNote } =
  content

/** A site route exists when its App Router page file does, or it is a seeded article slug. */
function routeExists(href) {
  const clean = href.split(/[?#]/)[0]
  if (clean === "/") return existsSync("apps/web/app/page.tsx")
  const article = clean.match(/^\/blog\/([a-z0-9-]+)$/)
  if (article) return existsSync(`apps/web/lib/blog/seed/articles/${article[1]}.ts`)
  return existsSync(`apps/web/app${clean}/page.tsx`)
}

const choices = (id) => PATH_QUESTIONS.find((question) => question.id === id).choices.map((choice) => choice.value)

/** Every answer set a visitor can actually produce, following the branching. */
function* answerSets() {
  for (const goal of choices("goal"))
    for (const area of choices("area"))
      for (const timeline of choices("timeline"))
        for (const service of choices("service")) {
          const base = { goal, area, timeline, service }
          const ids = visibleQuestions(base).map((question) => question.id)
          if (ids.includes("buyerPosition")) {
            for (const buyerPosition of choices("buyerPosition")) yield { ...base, buyerPosition }
          } else if (ids.includes("sellerPosition")) {
            for (const sellerPosition of choices("sellerPosition")) yield { ...base, sellerPosition }
          } else {
            yield base
          }
        }
}

test("the quiz asks real-estate intent, branches on goal, and never asks a qualification or protected-class question", () => {
  assert.deepEqual(
    PATH_QUESTIONS.map((question) => question.id),
    ["goal", "area", "timeline", "buyerPosition", "sellerPosition", "service"],
  )
  // Buyers see the buyer-position question; sellers see the seller one; nobody sees both.
  assert.deepEqual(visibleQuestions({ goal: "first" }).map((q) => q.id), ["goal", "area", "timeline", "buyerPosition", "service"])
  assert.deepEqual(visibleQuestions({ goal: "sell" }).map((q) => q.id), ["goal", "area", "timeline", "sellerPosition", "service"])
  assert.deepEqual(visibleQuestions({}).map((q) => q.id), ["goal", "area", "timeline", "service"])
  // Every goal yields exactly five questions, because the buyer- and
  // seller-position questions are mutually exclusive. The homepage states that
  // count in two places, so the copy is checked against the data rather than
  // against someone's memory of it: a seventh question, or a dropped `showIf`,
  // has to change the words too.
  const goals = PATH_QUESTIONS.find((question) => question.id === "goal").choices.map((choice) => choice.value)
  for (const goal of goals) {
    assert.equal(visibleQuestions({ goal }).length, 5, `${goal} should ask five questions`)
  }

  const homepage = read("apps/web/components/home/figma-home-page.tsx")
  assert.match(homepage, /Five questions point you to the right first step/)
  assert.match(homepage, /<span>Five questions, about a minute<\/span>/)
  assert.doesNotMatch(homepage, /Five or six/)

  for (const question of PATH_QUESTIONS) {
    assert.ok(question.choices.length >= 4 && question.choices.length <= 6, `${question.id} has 4–6 choices`)
    const text = [question.legend, question.help ?? "", ...question.choices.map((choice) => choice.label)].join(" ")
    assert.doesNotMatch(text, /income|credit score|approve you|qualif(y|ies) you|race|religion|disab|marital|children|national origin/i)
    assert.match(question.legend, /\?$/)
  }

  // The area choices are cities the homepage already publishes as markets.
  const cities = read("apps/web/lib/figma-home.ts")
  for (const name of ["Garland", "Dallas", "Plano", "Frisco", "McKinney", "Fort Worth", "Arlington", "Irving"]) {
    assert.match(cities, new RegExp(`name: "${name}"`), `${name} is a published market`)
  }
  // The Heroes groups are the ones the program page publishes.
  const programs = read("apps/web/lib/programs.ts")
  for (const group of ["military", "Veterans", "Teachers", "Healthcare", "Firefighters", "law-enforcement"]) {
    assert.match(programs, new RegExp(group), `${group} is a published Homes for Heroes group`)
  }
})

test("all eight result paths exist, every destination is a real route, and results carry the required parts", () => {
  assert.deepEqual(PATH_ORDER, [
    "first-time",
    "hero",
    "relocating",
    "selling",
    "sell-buy",
    "ready-search",
    "researcher",
    "unsure",
  ])
  for (const key of PATH_ORDER) assert.ok(PATH_NAMES[key], `${key} has a name`)
  assert.ok(routeExists(HEROES_HINT.href))

  const seen = new Map()
  for (const answers of answerSets()) {
    const result = buildResult(answers)
    assert.equal(result.key, resolvePath(answers))
    assert.ok(PATH_ORDER.includes(result.key), `unknown path ${result.key}`)
    seen.set(result.key, (seen.get(result.key) ?? 0) + 1)

    assert.match(result.heading, /^Your next move: .+\.$/)
    assert.ok(result.summary.length > 60, `${result.key} summary is substantive`)
    assert.ok(result.nextStep.length > 40, `${result.key} next step is substantive`)
    for (const link of [result.primary, result.resource, result.consultation]) {
      assert.ok(routeExists(link.href), `${result.key}: ${link.href} is not an existing route`)
      assert.ok(link.label.length > 0)
    }
    assert.equal(result.consultation.href, "/consultation")
    assert.notEqual(result.primary.href, result.resource.href, `${result.key}: primary and resource differ`)

    // No bracketed placeholder copy, no fabricated facts, no promises.
    const text = JSON.stringify(result)
    assert.doesNotMatch(text, /\[[^\]]*(Placeholder|TBD|TODO)[^\]]*\]|\(\d{3}\) \d{3}-\d{4}/)
    assert.doesNotMatch(text, /you qualify|guaranteed|you will save|dream home|unlock your|embark/i)
  }
  assert.deepEqual([...seen.keys()].sort(), [...PATH_ORDER].sort(), "every path is reachable")
})

test("the resolver follows the documented priority order", () => {
  assert.equal(resolvePath({ goal: "first", service: "military", buyerPosition: "preapproved" }), "hero")
  assert.equal(resolvePath({ goal: "sell", service: "educator" }), "hero")
  assert.equal(resolvePath({ goal: "relocate", service: "none", buyerPosition: "search" }), "relocating")
  assert.equal(resolvePath({ goal: "sellbuy", service: "none" }), "sell-buy")
  assert.equal(resolvePath({ goal: "next", buyerPosition: "sellfirst", service: "none" }), "sell-buy")
  assert.equal(resolvePath({ goal: "sell", sellerPosition: "value", service: "none" }), "selling")
  assert.equal(resolvePath({ goal: "first", buyerPosition: "preapproved", service: "none" }), "ready-search")
  assert.equal(resolvePath({ goal: "next", buyerPosition: "search", service: "notsure" }), "ready-search")
  assert.equal(resolvePath({ goal: "first", buyerPosition: "financing", service: "none" }), "first-time")
  assert.equal(resolvePath({ goal: "next", buyerPosition: "financing", service: "none" }), "researcher")
  assert.equal(resolvePath({ goal: "explore", buyerPosition: "scratch", timeline: "later", service: "none" }), "researcher")
  assert.equal(resolvePath({ goal: "explore", buyerPosition: "scratch", timeline: "3mo", service: "none" }), "unsure")
  assert.equal(resolvePath({}), "unsure")

  // Answers shape the copy: Garland gets its guide, timelines get their own line.
  assert.equal(buildResult({ goal: "first", area: "garland", service: "none" }).resource.href, "/blog/how-to-buy-home-garland-tx")
  assert.equal(buildResult({ goal: "first", area: "dallas", service: "none" }).resource.href, "/calculators/affordability")
  assert.match(buildResult({ goal: "sell", area: "collin", service: "none" }).summary, /Plano, Frisco and McKinney/)
  for (const timeline of ["asap", "3mo", "6mo", "12mo", "later", "researching", undefined]) {
    assert.ok(timelineNote(timeline).length > 40)
  }
})

test("the homepage mounts the quiz, both quizzes share one state machine, and nothing gates the result", () => {
  const home = read("apps/web/components/home/figma-home-page.tsx")
  const quiz = read("apps/web/components/home/homebuying-path-quiz.tsx")
  const nextStep = read("apps/web/components/next-step/find-your-next-step.tsx")
  const css = read("apps/web/app/globals.css")

  assert.match(home, /import \{ HomebuyingPathQuiz \} from "@\/components\/home\/homebuying-path-quiz"/)
  assert.match(home, /<FindYourPath \/>/)
  assert.match(home, /id="find-your-path"/)
  assert.match(quiz, /useGuidedQuiz/)
  assert.match(nextStep, /useGuidedQuiz/)
  assert.doesNotMatch(nextStep, /useState|useRef/)

  // Entry CTA, immediate result, optional consultation afterwards, no lead capture inside the quiz.
  assert.match(quiz, /Find Your Homebuying Path/)
  assert.match(quiz, /Want Debra to review your plan\?/)
  assert.doesNotMatch(quiz, /<input[^>]*type="(email|tel|text)"/)
  assert.doesNotMatch(quiz, /fetch\(/)
  assert.match(quiz, /not loan approval, a program eligibility\s+decision, a home valuation/)

  // Accessibility hooks: real radios in a fieldset, focus-managed heading, progressbar, live step label.
  assert.match(quiz, /<fieldset/)
  assert.match(quiz, /type="radio"/)
  assert.match(quiz, /role="progressbar"/)
  assert.match(quiz, /aria-live="polite"/)
  assert.match(quiz, /ref=\{headingRef\} tabIndex=\{-1\}/)

  // Styling stays inside the homepage design system and honours reduced motion.
  assert.match(css, /\.fh-pathquiz-option\[data-checked="true"\]/)
  assert.match(css, /@keyframes fh-pathquiz-in/)
  assert.match(css, /prefers-reduced-motion: reduce/)
  const quizCss = css.slice(css.indexOf(".fh-pathquiz {"), css.indexOf(".fh-final {"))
  assert.ok(quizCss.length > 1000, "the quiz styles sit before the final CTA block")
  assert.doesNotMatch(quizCss, /linear-gradient/)
})

test("homepage copy is specific to Dallas–Fort Worth and free of generic marketing filler", () => {
  const home = read("apps/web/components/home/figma-home-page.tsx")
  const map = read("apps/web/lib/figma-home.ts")
  const visible = `${home}\n${map}`

  for (const phrase of [
    /dream home/i,
    /dreams come true/i,
    /unlock your/i,
    /embark on/i,
    /perfect home/i,
    /journey begins/i,
    /real-time regional DFW search tools/,
    /Accurate Valuation Analytics/,
    /Empower your decisions/,
    /Maximize value, minimize stress/,
    /Buying with absolute clarity/,
  ]) {
    assert.doesNotMatch(visible, phrase)
  }
  for (const phrase of [/Dallas–Fort Worth/, /Garland/, /Plano/, /Frisco/, /North Texas/]) {
    assert.match(visible, phrase)
  }
  // The listings band never claims a live MLS feed exists.
  assert.doesNotMatch(map, /MLS listings/)
})
