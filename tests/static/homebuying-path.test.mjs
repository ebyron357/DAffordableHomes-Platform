import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { register } from "node:module"
import { test } from "node:test"
import { pathToFileURL } from "node:url"

/**
 * "Find Your Homebuying Path" — the homepage guided quiz.
 *
 * The behavioural checks import the real content module, so the resolver is
 * exercised rather than pattern-matched. Every destination it can send a
 * visitor to must be a route that exists in this repository.
 */

register("../../scripts/sanity/ts-resolver.mjs", import.meta.url)

const read = (file) => readFileSync(file, "utf8")

const content = await import(pathToFileURL("apps/web/lib/content/homebuying-path.ts").href)
const { PATH_QUESTIONS, PATH_RESULTS, PATH_ORDER, resolvePath, timelineNote } = content

/** A site route exists when its App Router page file does, or it is a seeded article slug. */
function routeExists(href) {
  const clean = href.split(/[?#]/)[0]
  if (clean === "/") return existsSync("apps/web/app/page.tsx")
  const article = clean.match(/^\/blog\/([a-z0-9-]+)$/)
  if (article) return existsSync(`apps/web/lib/blog/seed/articles/${article[1]}.ts`)
  return existsSync(`apps/web/app${clean}/page.tsx`)
}

test("the quiz is five short questions with no qualification or protected-class content", () => {
  assert.equal(PATH_QUESTIONS.length, 5)
  const ids = PATH_QUESTIONS.map((question) => question.id)
  assert.deepEqual(ids, ["situation", "goal", "location", "service", "timeline"])
  for (const question of PATH_QUESTIONS) {
    assert.ok(question.choices.length >= 3 && question.choices.length <= 5, `${question.id} has 3–5 choices`)
    const text = [question.legend, question.help ?? "", ...question.choices.map((choice) => choice.label)].join(" ")
    assert.doesNotMatch(text, /income|credit score|approve|qualif|race|religion|disab|marital|children|national origin/i)
  }
})

test("all five required result paths exist and every destination is a real route", () => {
  assert.deepEqual(PATH_ORDER, ["first-time", "hero", "relocating", "sell-buy", "unsure"])
  for (const key of PATH_ORDER) {
    const result = PATH_RESULTS[key]
    assert.ok(result, `${key} result exists`)
    assert.equal(result.key, key)
    assert.ok(result.name && result.summary && result.nextStep, `${key} has copy`)
    for (const link of [result.primary, result.secondary, result.consultation]) {
      assert.ok(routeExists(link.href), `${key}: ${link.href} is not an existing route`)
      assert.ok(link.label.length > 0)
    }
    assert.equal(result.consultation.href, "/consultation")
    // No bracketed placeholder copy, and no fabricated contact facts.
    assert.doesNotMatch(JSON.stringify(result), /\[[^\]]*(Placeholder|TBD|TODO)[^\]]*\]|\(\d{3}\) \d{3}-\d{4}/)
  }
})

test("the resolver reaches every path and never returns an unknown one", () => {
  const reached = new Set()
  const choices = (id) => PATH_QUESTIONS.find((question) => question.id === id).choices.map((choice) => choice.value)
  for (const situation of choices("situation"))
    for (const goal of choices("goal"))
      for (const location of choices("location"))
        for (const service of choices("service"))
          for (const timeline of choices("timeline")) {
            const key = resolvePath({ situation, goal, location, service, timeline })
            assert.ok(key in PATH_RESULTS, `unknown path ${key}`)
            reached.add(key)
          }
  assert.deepEqual([...reached].sort(), [...PATH_ORDER].sort())

  // The documented priority order.
  assert.equal(resolvePath({ service: "military", goal: "first", location: "relocating" }), "hero")
  assert.equal(resolvePath({ service: "none", goal: "first", location: "relocating" }), "relocating")
  assert.equal(resolvePath({ service: "none", goal: "sellbuy", location: "local" }), "sell-buy")
  assert.equal(resolvePath({ service: "none", situation: "own", goal: "next", location: "local" }), "sell-buy")
  assert.equal(resolvePath({ service: "none", situation: "rent", goal: "first", location: "local" }), "first-time")
  assert.equal(resolvePath({ service: "none", situation: "rent", goal: "next", location: "local" }), "first-time")
  assert.equal(resolvePath({ service: "none", situation: "other", goal: "explore", location: "undecided" }), "unsure")
  assert.equal(resolvePath({}), "unsure")

  for (const timeline of ["soon", "year", "later", "unsure", undefined]) {
    assert.ok(timelineNote(timeline).length > 20)
  }
})

test("the homepage mounts the quiz and both quizzes share one state machine", () => {
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

  // Entry CTA, immediate result, no lead capture inside the quiz.
  assert.match(quiz, /Find Your Homebuying Path/)
  assert.doesNotMatch(quiz, /<input[^>]*type="(email|tel|text)"/)
  assert.doesNotMatch(quiz, /fetch\(/)

  // Accessibility hooks: real radios in a fieldset, focus-managed heading, progressbar.
  assert.match(quiz, /<fieldset/)
  assert.match(quiz, /type="radio"/)
  assert.match(quiz, /role="progressbar"/)
  assert.match(quiz, /ref=\{headingRef\} tabIndex=\{-1\}/)

  // Styling stays inside the homepage design system and honours reduced motion.
  assert.match(css, /\.fh-pathquiz-option\[data-checked="true"\]/)
  assert.match(css, /@keyframes fh-pathquiz-in/)
  assert.match(css, /prefers-reduced-motion: reduce/)
  const quizCss = css.slice(css.indexOf(".fh-pathquiz {"), css.indexOf(".fh-final {"))
  assert.ok(quizCss.length > 1000, "the quiz styles sit before the final CTA block")
  assert.doesNotMatch(quizCss, /linear-gradient/)
})
