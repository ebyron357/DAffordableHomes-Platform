"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export type GuidedQuizPhase = { kind: "intro" } | { kind: "question"; index: number } | { kind: "result" }

/**
 * Shared state machine for the site's one-question-at-a-time flows.
 *
 * Extracted from `FindYourNextStep` so the homepage "Find Your Homebuying Path"
 * quiz and the interior readiness check share the same behaviour: answers keyed
 * by question id, forward/back navigation, restart, and moving focus to the
 * step heading whenever the step changes so screen readers announce it.
 */
export function useGuidedQuiz<Id extends string>(total: number, startAt: GuidedQuizPhase = { kind: "question", index: 0 }) {
  const [answers, setAnswers] = useState<Partial<Record<Id, string>>>({})
  const [phase, setPhase] = useState<GuidedQuizPhase>(startAt)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const pendingFocus = useRef(false)

  // Focus is moved in an effect, after React has committed the new step, so it
  // lands on the heading that is actually in the document. A ref flag keeps the
  // initial render from stealing focus from wherever the visitor already was.
  const focusHeading = useCallback(() => {
    pendingFocus.current = true
  }, [])

  useEffect(() => {
    if (!pendingFocus.current) return
    pendingFocus.current = false
    headingRef.current?.focus()
  }, [phase])

  const selectAnswer = useCallback((questionId: Id, value: string) => {
    setAnswers((previous) => ({ ...previous, [questionId]: value }))
  }, [])

  const start = useCallback(() => {
    setPhase({ kind: "question", index: 0 })
    focusHeading()
  }, [focusHeading])

  const goNext = useCallback(() => {
    setPhase((current) => {
      if (current.kind !== "question") return current
      return current.index < total - 1 ? { kind: "question", index: current.index + 1 } : { kind: "result" }
    })
    focusHeading()
  }, [focusHeading, total])

  /** Jump straight to the result; used by flows whose step count is branched. */
  const finish = useCallback(() => {
    setPhase({ kind: "result" })
    focusHeading()
  }, [focusHeading])

  const goBack = useCallback((lastIndex: number = total - 1) => {
    setPhase((current) => {
      if (current.kind === "result") return { kind: "question", index: lastIndex }
      if (current.kind === "question" && current.index > 0) return { kind: "question", index: current.index - 1 }
      return current
    })
    focusHeading()
  }, [focusHeading, total])

  const restart = useCallback(() => {
    setAnswers({})
    setPhase(startAt)
    focusHeading()
  }, [focusHeading, startAt])

  return { answers, phase, headingRef, selectAnswer, start, goNext, finish, goBack, restart }
}
