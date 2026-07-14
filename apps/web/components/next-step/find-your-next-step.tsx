"use client"

import Link from "next/link"
import { useRef, useState } from "react"
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  buildRecommendations,
  NEXT_STEP_QUESTIONS,
  STAGE_RESULTS,
  type Recommendation,
} from "@/lib/content/next-step"

type Phase = { kind: "question"; index: number } | { kind: "result" }

export function FindYourNextStep() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [phase, setPhase] = useState<Phase>({ kind: "question", index: 0 })
  const headingRef = useRef<HTMLHeadingElement>(null)

  const total = NEXT_STEP_QUESTIONS.length

  function focusHeading() {
    // Move focus to the step heading so screen readers announce the new step.
    requestAnimationFrame(() => headingRef.current?.focus())
  }

  function selectAnswer(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  function goNext() {
    if (phase.kind !== "question") return
    if (phase.index < total - 1) {
      setPhase({ kind: "question", index: phase.index + 1 })
    } else {
      setPhase({ kind: "result" })
    }
    focusHeading()
  }

  function goBack() {
    if (phase.kind === "result") {
      setPhase({ kind: "question", index: total - 1 })
    } else if (phase.index > 0) {
      setPhase({ kind: "question", index: phase.index - 1 })
    }
    focusHeading()
  }

  function restart() {
    setAnswers({})
    setPhase({ kind: "question", index: 0 })
    focusHeading()
  }

  if (phase.kind === "result") {
    const stageKey = answers.stage
    const stage = stageKey ? STAGE_RESULTS[stageKey] ?? STAGE_RESULTS.curious : STAGE_RESULTS.curious
    const recs: Recommendation[] = buildRecommendations(answers)
    return (
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Your next step</p>
        <h2 ref={headingRef} tabIndex={-1} className="mt-3 font-serif text-2xl text-foreground focus:outline-none sm:text-3xl">
          You&apos;re in the {stage.stageLabel.toLowerCase()} stage
        </h2>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{stage.summary}</p>

        <div
          role="note"
          className="mt-5 rounded-lg border border-border bg-muted/50 p-4 text-sm leading-relaxed text-muted-foreground"
        >
          This is general education to help you find a starting point. It is not loan approval or legal, tax, lending,
          or individualized financial advice.
        </div>

        <h3 className="mt-8 font-serif text-xl text-foreground">Suggested resources</h3>
        <ul className="mt-4 flex flex-col gap-3">
          {recs.map((rec) => (
            <li key={rec.href}>
              <Link
                href={rec.href}
                className="group flex items-start justify-between gap-4 rounded-xl border border-border bg-background p-5 transition-colors hover:border-primary/40"
              >
                <span>
                  <span className="font-medium text-foreground">{rec.title}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{rec.description}</span>
                </span>
                <ArrowRight
                  className="mt-1 size-5 shrink-0 text-primary transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button onClick={restart} variant="outline">
            <RotateCcw className="size-4" aria-hidden="true" />
            Start over
          </Button>
          <Button href="/book">Book a consultation</Button>
        </div>
      </div>
    )
  }

  const question = NEXT_STEP_QUESTIONS[phase.index]!
  const current = answers[question.id]
  const stepNumber = phase.index + 1

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-muted-foreground">
          Step {stepNumber} of {total}
        </p>
        <div
          className="h-1.5 w-40 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={stepNumber}
          aria-label="Progress through Find Your Next Step"
        >
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${(stepNumber / total) * 100}%` }}
          />
        </div>
      </div>

      <fieldset className="mt-6">
        <legend className="w-full">
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="font-serif text-2xl text-foreground focus:outline-none sm:text-3xl"
          >
            {question.legend}
          </h2>
        </legend>
        {question.help && <p className="mt-2 text-sm text-muted-foreground">{question.help}</p>}

        <div className="mt-6 flex flex-col gap-3">
          {question.choices.map((choice) => {
            const checked = current === choice.value
            return (
              <label
                key={choice.value}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                  checked ? "border-primary bg-primary/5" : "border-border bg-background hover:border-primary/40"
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={choice.value}
                  checked={checked}
                  onChange={() => selectAnswer(question.id, choice.value)}
                  className="mt-1 size-4 accent-[var(--color-primary)]"
                />
                <span className="text-pretty leading-relaxed text-foreground">{choice.label}</span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <div className="mt-8 flex items-center justify-between gap-3">
        <Button onClick={goBack} variant="ghost" disabled={phase.index === 0}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back
        </Button>
        <Button onClick={goNext} disabled={!current}>
          {stepNumber === total ? "See my next step" : "Continue"}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
