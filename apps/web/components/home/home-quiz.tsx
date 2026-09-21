"use client"

import Link from "next/link"
import { useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react"
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react"

import { trackEvent, type AnalyticsEventName } from "@/lib/analytics"
import {
  ATTRIBUTION_KEYS,
  getResult,
  QUESTIONS,
  STORAGE_KEY,
} from "@/lib/content/readiness"

/**
 * Homepage entry point to the readiness assessment.
 *
 * This is deliberately *not* a second quiz. It imports the same questions, the
 * same attribution keys, the same session-storage key and the same `getResult`
 * engine as `/start`, from `lib/content/readiness.ts`. Three consequences that
 * are the point of doing it this way:
 *
 *  1. Editing a question or a routing rule changes both surfaces at once.
 *  2. Answers written here are read by `/start`, so "continue" resumes the
 *     assessment rather than restarting it.
 *  3. The analytics events are the same names the `/start` funnel already
 *     emits, so the homepage entry shows up in the existing funnel instead of
 *     creating a parallel one.
 *
 * The homepage version stops at the result and hands off; lead capture stays on
 * `/start`, which owns the form, the endpoint and the consent copy.
 *
 * Nothing here asserts eligibility. The result routes to an explanatory
 * section and says so.
 */

/** Where each result key hands off into the existing /start experience. */
const RESULT_ANCHORS: Record<string, string> = {
  naca: "/start#naca",
  hero: "/start#heroes",
  traditional: "/start#traditional",
  readiness: "/start#readiness",
}

/**
 * Shape of the shared assessment record.
 *
 * `/start` persists to **sessionStorage** under `STORAGE_KEY` and restores
 * `answers`, `phase`, `questionIndex`, `selectedPath` and `attribution`. This
 * quiz has to use the same store and the same field names or the handoff does
 * not resume — which is exactly what happened on the first pass here, when it
 * wrote the right shape to the wrong storage area and `/start` restarted at
 * question one.
 */
/** First-touch attribution, matching the /start capture. */
function captureAttribution(): Record<string, string> {
  if (typeof window === "undefined") return {}
  const params = new URLSearchParams(window.location.search)
  const found: Record<string, string> = {}
  for (const key of ATTRIBUTION_KEYS) {
    const value = params.get(key)
    if (value) found[key] = value
  }
  return found
}

type Stored = {
  answers?: Record<string, string>
  phase?: "question" | "result"
  questionIndex?: number
  selectedPath?: string | null
  attribution?: Record<string, string>
}

function readRaw(): string | null {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY)
  } catch {
    // Private mode or blocked storage.
    return null
  }
}

function parseStored(raw: string | null): Stored | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as Stored
  } catch {
    // Corrupt JSON — start fresh rather than throwing inside render.
    return null
  }
}

/**
 * Session storage read as an external store.
 *
 * Reading it in an effect and calling `setState` would trip
 * `react-hooks/set-state-in-effect`, and seeding `useState` directly would
 * desync hydration because the server has no storage. `useSyncExternalStore`
 * is the primitive built for exactly this: a null server snapshot, the real
 * value after hydration, no effect and no mismatch.
 */
function subscribeToStorage(onChange: () => void): () => void {
  // sessionStorage is per-tab, so the cross-tab `storage` event will not fire
  // for it. Subscribing anyway costs nothing and keeps the store contract
  // honest; the snapshot is read on every render regardless.
  window.addEventListener("storage", onChange)
  return () => window.removeEventListener("storage", onChange)
}

function readStored(): Stored | null {
  return parseStored(readRaw())
}

function writeStored(
  answers: Record<string, string>,
  questionIndex: number,
  phase: "question" | "result",
): void {
  try {
    const previous = readStored() ?? {}
    const attribution = { ...(previous.attribution ?? {}), ...captureAttribution() }
    window.sessionStorage.setItem(
      STORAGE_KEY,
      // Spread `previous` first so `selectedPath` and anything else /start owns
      // survives a homepage answer.
      JSON.stringify({ ...previous, answers, questionIndex, phase, attribution }),
    )
  } catch {
    // Persistence is a convenience; losing it must not break the quiz.
  }
}

export function HomeQuiz() {
  const headingId = useId()
  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)
  const liveRef = useRef<HTMLParagraphElement>(null)
  const resultRef = useRef<HTMLHeadingElement>(null)
  const startedRef = useRef(false)

  const total = QUESTIONS.length
  const question = QUESTIONS[index]
  const result = useMemo(() => getResult(answers, null), [answers])

  // An assessment begun on /start (or on a previous visit here) is offered as
  // a resume rather than silently replayed.
  const storedRaw = useSyncExternalStore(subscribeToStorage, readRaw, () => null)
  const stored = useMemo(() => parseStored(storedRaw), [storedRaw])
  const resumable = Boolean(stored?.answers && Object.keys(stored.answers).length > 0)
  const restored = resumable && Object.keys(answers).length === 0

  // Move focus to the result heading so keyboard and screen-reader users are
  // taken to the outcome rather than left on a button that vanished.
  useEffect(() => {
    if (done) resultRef.current?.focus()
  }, [done])

  const begin = useCallback(() => {
    // Seeding from storage happens here, in an event handler, so there is no
    // state write from an effect and no hydration mismatch.
    if (resumable && Object.keys(answers).length === 0 && stored?.answers) {
      setAnswers(stored.answers)
      setIndex(Math.min(stored.questionIndex ?? 0, total - 1))
    }
    setStarted(true)
    if (!startedRef.current) {
      startedRef.current = true
      trackEvent("assessment_started", { surface: "homepage", ...captureAttribution() })
    }
  }, [answers, resumable, stored, total])

  const choose = useCallback(
    (value: string) => {
      if (!question) return
      const next = { ...answers, [question.id]: value }
      setAnswers(next)
      trackEvent("assessment_question_completed", {
        surface: "homepage",
        questionId: question.id,
        questionIndex: index + 1,
      })

      if (index === total - 1) {
        writeStored(next, index, "result")
        setDone(true)
        const finalResult = getResult(next, null)
        trackEvent("assessment_completed", { surface: "homepage", resultKey: finalResult.key })
        trackEvent(`result_${finalResult.key}` as AnalyticsEventName, { surface: "homepage" })
        return
      }

      const advanced = index + 1
      writeStored(next, advanced, "question")
      setIndex(advanced)
      if (liveRef.current) {
        liveRef.current.textContent = `Question ${advanced + 1} of ${total}`
      }
    },
    [answers, index, question, total],
  )

  const back = useCallback(() => {
    if (done) {
      setDone(false)
      setIndex(total - 1)
      return
    }
    setIndex((value) => Math.max(0, value - 1))
  }, [done, total])

  const restart = useCallback(() => {
    setAnswers({})
    setIndex(0)
    setDone(false)
    writeStored({}, 0, "question")
  }, [])

  const progress = Math.round(((index + 1) / total) * 100)

  return (
    <section className="fh-quiz" aria-labelledby={headingId}>
      <div className="fh-shell fh-quiz-grid">
        <div className="fh-quiz-intro">
          <p className="fh-eyebrow fh-eyebrow-on-dark">Find your starting point</p>
          <h2 id={headingId}>What&apos;s your best home-buying path?</h2>
          <p>
            Six short questions. No credit check, no application, and nothing to sign — just a clearer view of which
            route is worth your attention first.
          </p>
          <ul className="fh-quiz-assurances">
            <li>Educational only — this is not a preapproval or a program decision</li>
            <li>Your answers stay in this browser until you choose to share them</li>
            <li>Takes about a minute</li>
          </ul>
        </div>

        <div className="fh-quiz-card">
          {/* Politeness region: announces question changes without stealing focus. */}
          <p ref={liveRef} className="sr-only" aria-live="polite" />

          {!started && !done && (
            <div className="fh-quiz-start">
              <p className="fh-quiz-kicker">{total} questions</p>
              <p className="fh-quiz-start-copy">
                {restored
                  ? "You have answers saved from earlier. Pick up where you left off."
                  : "Answer honestly — “I’m not sure” is a real option on every question."}
              </p>
              {/* The real question labels, previewed. An idle card with one line
                  and a button is the empty box this section is meant to replace,
                  and listing what it actually asks is more useful than filler. */}
              <ol className="fh-quiz-preview">
                {QUESTIONS.map((item, i) => (
                  <li key={item.id}>
                    <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                    {item.label}
                  </li>
                ))}
              </ol>
              <button type="button" className="fh-btn fh-btn-gold fh-quiz-begin" onClick={begin}>
                {restored ? "Continue where I left off" : "Start the quiz"}
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          )}

          {started && !done && question && (
            <div className="fh-quiz-question">
              <div className="fh-quiz-progress-label">
                <span>
                  Question {index + 1} of {total}
                </span>
                <span>{progress}%</span>
              </div>
              <div
                className="fh-quiz-progress"
                role="progressbar"
                aria-valuemin={1}
                aria-valuemax={total}
                aria-valuenow={index + 1}
                aria-label="Quiz progress"
              >
                <span style={{ width: `${progress}%` }} />
              </div>

              <fieldset>
                <legend>{question.label}</legend>
                {question.help && <p className="fh-quiz-help">{question.help}</p>}
                <div className="fh-quiz-answers">
                  {question.answers.map((answer) => {
                    const selected = answers[question.id] === answer.value
                    return (
                      <button
                        key={answer.id}
                        type="button"
                        className={`fh-quiz-answer${selected ? " is-selected" : ""}`}
                        aria-pressed={selected}
                        onClick={() => choose(answer.value)}
                      >
                        {answer.label}
                      </button>
                    )
                  })}
                </div>
              </fieldset>

              {index > 0 && (
                <button type="button" className="fh-quiz-back" onClick={back}>
                  <ArrowLeft className="size-4" aria-hidden="true" /> Back
                </button>
              )}
            </div>
          )}

          {done && (
            <div className="fh-quiz-result">
              <p className="fh-quiz-kicker">Where we suggest starting</p>
              <h3 ref={resultRef} tabIndex={-1}>
                {result.heading}
              </h3>
              <p className="fh-quiz-result-body">{result.body}</p>
              {/* The shared `secondary` strings are already complete sentences
                  ("Homes for Heroes may also be worth exploring."), so they are
                  rendered as-is rather than behind a label that repeats them. */}
              {result.secondary && <p className="fh-quiz-also">{result.secondary}</p>}
              <p className="fh-quiz-disclosure">
                This is an educational starting point, not a preapproval, a credit decision, or a guarantee of program
                eligibility. The organization running a program decides who qualifies for it.
              </p>
              <div className="fh-quiz-result-actions">
                <Link
                  href={RESULT_ANCHORS[result.key] ?? "/start"}
                  className="fh-btn fh-btn-gold"
                  onClick={() => trackEvent("secondary_cta_clicked", { surface: "homepage", result: result.key })}
                >
                  {result.primaryLabel}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/consultation"
                  className="fh-btn fh-btn-light-outline"
                  onClick={() => trackEvent("schedule_opened", { surface: "homepage", result: result.key })}
                >
                  Talk it through with Debra
                </Link>
              </div>
              <button type="button" className="fh-quiz-back" onClick={restart}>
                <RotateCcw className="size-4" aria-hidden="true" /> Start over
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
