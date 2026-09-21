"use client"

import Link from "next/link"
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react"
import { useGuidedQuiz, type GuidedQuizPhase } from "@/components/quiz/use-guided-quiz"
import { trackEvent } from "@/lib/analytics"
import {
  buildResult,
  HEROES_HINT,
  PATH_NAMES,
  PATH_ORDER,
  timelineNote,
  visibleQuestions,
  type PathQuestionId,
} from "@/lib/content/homebuying-path"

const INTRO: GuidedQuizPhase = { kind: "intro" }

/**
 * "Find Your Homebuying Path" — the homepage's guided quiz.
 *
 * Five or six questions, one at a time and branched on the visitor's goal,
 * then an immediate result: a heading, an explanation written from the
 * answers, a recommended next step, one existing resource, a primary action
 * and an optional consultation. No contact details are asked for. Built on
 * the same `useGuidedQuiz` state machine as the interior readiness check and
 * styled with the homepage design system.
 *
 * Accessibility: each question is a fieldset of real radio inputs (arrow keys
 * move, Space selects); focus moves to the step heading on every transition;
 * the progress bar exposes its value; the entrance motion is a short fade that
 * the global `prefers-reduced-motion` rule neutralises.
 */
export function HomebuyingPathQuiz() {
  const quiz = useGuidedQuiz<PathQuestionId>(PATH_QUESTIONS_MAX, INTRO)
  const { answers, phase, headingRef } = quiz
  const questions = visibleQuestions(answers)
  const total = questions.length

  function start() {
    trackEvent("path_quiz_started", { surface: "homepage" })
    quiz.start()
  }

  function next(questionId: PathQuestionId, step: number) {
    trackEvent("path_quiz_question_completed", { surface: "homepage", questionId, step })
    if (step === total) {
      trackEvent("path_quiz_completed", { surface: "homepage", path: buildResult(answers).key })
      quiz.finish()
      return
    }
    quiz.goNext()
  }

  if (phase.kind === "intro") {
    return (
      <div className="fh-pathquiz-panel fh-pathquiz-enter" data-phase="intro">
        {/* The section heading beside this panel already asks "Not sure what
            your next move in DFW should be?", so this title does not ask it
            again in other words — it says what the visitor is about to do. The
            question count and the minute live once, in the list on the left. */}
        <p className="fh-eyebrow">Start here</p>
        <h3 ref={headingRef} tabIndex={-1} className="fh-pathquiz-title">
          Tell Debra what you&rsquo;re planning.
        </h3>
        <p className="fh-pathquiz-copy">
          Your goal, the part of Dallas–Fort Worth you have in mind, and your timeline. You get a specific next step,
          the guide or tool that goes with it, and the option to have Debra review the plan. Nothing to sign up for.
        </p>
        <ul className="fh-pathquiz-chips" aria-label="The paths this quiz can identify">
          {PATH_ORDER.map((key) => (
            <li key={key}>{PATH_NAMES[key]}</li>
          ))}
        </ul>
        <div className="fh-pathquiz-nav fh-pathquiz-nav-start">
          <button type="button" className="fh-btn fh-btn-navy" onClick={start}>
            Find Your Homebuying Path <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    )
  }

  if (phase.kind === "result") {
    const result = buildResult(answers)
    return (
      <div className="fh-pathquiz-panel fh-pathquiz-result" data-phase="result" data-path={result.key}>
        <div className="fh-pathquiz-enter">
          <p className="fh-eyebrow">{result.name}</p>
          <h3 ref={headingRef} tabIndex={-1} className="fh-pathquiz-title">
            {result.heading}
          </h3>
        </div>
        <p className="fh-pathquiz-copy fh-pathquiz-enter" style={{ animationDelay: "80ms" }}>
          {result.summary}
        </p>
        <div className="fh-pathquiz-next fh-pathquiz-enter" style={{ animationDelay: "160ms" }}>
          <p className="fh-pathquiz-next-label">Recommended next step</p>
          <p>{result.nextStep}</p>
          <p className="fh-pathquiz-timeline">{timelineNote(answers.timeline)}</p>
        </div>
        <div className="fh-pathquiz-actions fh-pathquiz-enter" style={{ animationDelay: "240ms" }}>
          <Link href={result.primary.href} className="fh-btn fh-btn-navy">
            {result.primary.label}
          </Link>
          <Link href={result.resource.href} className="fh-btn fh-btn-navy-outline">
            {result.resource.label}
          </Link>
        </div>
        {answers.service === "notsure" && result.key !== "hero" && (
          <p className="fh-pathquiz-secondary fh-pathquiz-enter" style={{ animationDelay: "280ms" }}>
            <Link href={HEROES_HINT.href} className="fh-text-link">
              {HEROES_HINT.label} <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </p>
        )}
        <div className="fh-pathquiz-review fh-pathquiz-enter" style={{ animationDelay: "320ms" }}>
          <div>
            <p className="fh-pathquiz-review-title">Want Debra to review your plan?</p>
            <p>
              A consultation is a conversation about your situation, not a sales call. Bring the questions this raised.
            </p>
          </div>
          <Link href={result.consultation.href} className="fh-btn fh-btn-teal">
            {result.consultation.label}
          </Link>
        </div>
        <div className="fh-pathquiz-footer fh-pathquiz-enter" style={{ animationDelay: "360ms" }}>
          <p className="fh-pathquiz-note">
            General education to help you choose a starting point. It is not loan approval, a program eligibility
            decision, a home valuation, or legal, tax, lending, or individualized financial advice.
          </p>
          <button type="button" className="fh-pathquiz-restart" onClick={quiz.restart}>
            <RotateCcw className="size-3.5" aria-hidden="true" /> Start over
          </button>
        </div>
      </div>
    )
  }

  const question = questions[Math.min(phase.index, total - 1)]!
  const current = answers[question.id]
  const step = Math.min(phase.index, total - 1) + 1

  return (
    <div className="fh-pathquiz-panel" data-phase="question">
      <div className="fh-pathquiz-progress-row">
        <p className="fh-pathquiz-step" aria-live="polite">
          Question {step} of {total}
        </p>
        <div
          className="fh-pathquiz-progress"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={step}
          aria-label="Progress through Find Your Homebuying Path"
        >
          {questions.map((item, index) => (
            <span key={item.id} className={index < step ? "is-done" : undefined} />
          ))}
        </div>
      </div>

      <fieldset key={question.id} className="fh-pathquiz-question fh-pathquiz-enter">
        <legend>
          <h3 ref={headingRef} tabIndex={-1} className="fh-pathquiz-title">
            {question.legend}
          </h3>
        </legend>
        {question.help && <p className="fh-pathquiz-help">{question.help}</p>}
        <div className="fh-pathquiz-options">
          {question.choices.map((choice) => {
            const checked = current === choice.value
            return (
              <label key={choice.value} className="fh-pathquiz-option" data-checked={checked ? "true" : "false"}>
                <input
                  type="radio"
                  className="fh-pathquiz-radio"
                  name={`homebuying-path-${question.id}`}
                  value={choice.value}
                  checked={checked}
                  onChange={() => quiz.selectAnswer(question.id, choice.value)}
                />
                <span className="fh-pathquiz-mark" aria-hidden="true">
                  {checked && <Check className="size-3.5" />}
                </span>
                <span className="fh-pathquiz-option-label">{choice.label}</span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <div className="fh-pathquiz-nav">
        <button
          type="button"
          className="fh-btn fh-btn-navy-outline"
          onClick={phase.index === 0 ? quiz.restart : () => quiz.goBack(total - 1)}
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> Back
        </button>
        <button
          type="button"
          className="fh-btn fh-btn-navy"
          onClick={() => next(question.id, step)}
          disabled={!current}
        >
          {step === total ? "Show my next move" : "Continue"} <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

/** Upper bound on steps; the visible count is branched at render time. */
const PATH_QUESTIONS_MAX = 6
