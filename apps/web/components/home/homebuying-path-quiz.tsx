"use client"

import Link from "next/link"
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react"
import { useGuidedQuiz, type GuidedQuizPhase } from "@/components/quiz/use-guided-quiz"
import { trackEvent } from "@/lib/analytics"
import {
  PATH_ORDER,
  PATH_QUESTIONS,
  PATH_RESULTS,
  resolvePath,
  timelineNote,
  type PathQuestion,
} from "@/lib/content/homebuying-path"

const INTRO: GuidedQuizPhase = { kind: "intro" }

/**
 * "Find Your Homebuying Path" — the homepage's guided quiz.
 *
 * Five questions, one at a time, then an immediate result that points to
 * destinations that already exist on the site. No contact details are asked
 * for or collected. Built on the same `useGuidedQuiz` state machine as the
 * interior readiness check, styled with the homepage design system.
 *
 * Accessibility: each question is a fieldset of real radio inputs, so arrow
 * keys move between choices and Space selects; focus moves to the step heading
 * on every transition so screen readers announce the new step; the progress
 * bar exposes its value; motion is a short fade that the global
 * `prefers-reduced-motion` rule neutralises.
 */
export function HomebuyingPathQuiz() {
  const total = PATH_QUESTIONS.length
  const quiz = useGuidedQuiz<PathQuestion["id"]>(total, INTRO)
  const { answers, phase, headingRef } = quiz

  function start() {
    trackEvent("path_quiz_started", { surface: "homepage" })
    quiz.start()
  }

  function next(questionId: PathQuestion["id"], step: number) {
    trackEvent("path_quiz_question_completed", { surface: "homepage", questionId, step })
    if (step === total) trackEvent("path_quiz_completed", { surface: "homepage", path: resolvePath(answers) })
    quiz.goNext()
  }

  if (phase.kind === "intro") {
    return (
      <div className="fh-pathquiz-panel fh-pathquiz-enter" data-phase="intro">
        <p className="fh-eyebrow">Five quick questions</p>
        <h3 ref={headingRef} tabIndex={-1} className="fh-pathquiz-title">
          Which path fits you?
        </h3>
        <p className="fh-pathquiz-copy">
          Answer a few questions about where you are and what you&apos;re hoping to do. You&apos;ll get a
          recommended starting point right away, with no email or phone number required.
        </p>
        <ul className="fh-pathquiz-chips" aria-label="The five possible paths">
          {PATH_ORDER.map((key) => (
            <li key={key}>{PATH_RESULTS[key].name}</li>
          ))}
        </ul>
        <div className="fh-pathquiz-nav fh-pathquiz-nav-start">
          <button type="button" className="fh-btn fh-btn-navy" onClick={start}>
            Find Your Homebuying Path <ArrowRight className="size-4" aria-hidden="true" />
          </button>
          <span className="fh-pathquiz-hint">About one minute</span>
        </div>
      </div>
    )
  }

  if (phase.kind === "result") {
    const result = PATH_RESULTS[resolvePath(answers)]
    return (
      <div className="fh-pathquiz-panel fh-pathquiz-result" data-phase="result" data-path={result.key}>
        <div className="fh-pathquiz-enter">
          <p className="fh-eyebrow">Your homebuying path</p>
          <h3 ref={headingRef} tabIndex={-1} className="fh-pathquiz-title">
            {result.name}
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
          <Link href={result.consultation.href} className="fh-btn fh-btn-teal">
            {result.consultation.label}
          </Link>
        </div>
        <p className="fh-pathquiz-secondary fh-pathquiz-enter" style={{ animationDelay: "300ms" }}>
          <Link href={result.secondary.href} className="fh-text-link">
            {result.secondary.label} <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </p>
        <div className="fh-pathquiz-footer fh-pathquiz-enter" style={{ animationDelay: "340ms" }}>
          <p className="fh-pathquiz-note">
            This is general education to help you find a starting point. It is not loan approval or legal, tax,
            lending, or individualized financial advice.
          </p>
          <button type="button" className="fh-pathquiz-restart" onClick={quiz.restart}>
            <RotateCcw className="size-3.5" aria-hidden="true" /> Start over
          </button>
        </div>
      </div>
    )
  }

  const question = PATH_QUESTIONS[phase.index]!
  const current = answers[question.id]
  const step = phase.index + 1

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
          {PATH_QUESTIONS.map((item, index) => (
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
          onClick={phase.index === 0 ? quiz.restart : quiz.goBack}
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> Back
        </button>
        <button
          type="button"
          className="fh-btn fh-btn-navy"
          onClick={() => next(question.id, step)}
          disabled={!current}
        >
          {step === total ? "Show my path" : "Continue"} <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
