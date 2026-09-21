"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react"
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CircleHelp,
  Home,
  KeyRound,
  Mic,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react"
import { trackEvent, type AnalyticsEventName } from "@/lib/analytics"
/**
 * Questions, attribution keys, storage key and the result engine live in
 * `lib/content/readiness.ts` so the homepage quiz runs the same assessment
 * rather than a second copy of it. Nothing about this page's behaviour changed
 * when they moved.
 */
import {
  ATTRIBUTION_KEYS,
  getResult,
  QUESTIONS,
  STORAGE_KEY,
  type PathDefinition,
  type PathKey,
} from "@/lib/content/readiness"

type Phase = "question" | "result"
type LeadStatus = "idle" | "submitting" | "success" | "error"

type Attribution = Record<string, string>

const PATHS: PathDefinition[] = [
  {
    key: "traditional",
    number: "01",
    title: "I’m ready to start buying",
    body: "You’re preparing to purchase and want help understanding financing, the buying process, neighborhoods, and your next steps.",
    cta: "Explore traditional homebuying",
    icon: Home,
  },
  {
    key: "naca",
    number: "02",
    title: "I’m interested in NACA",
    body: "You’ve heard about NACA and want to understand the program, preparation, documentation, and homebuying process.",
    cta: "Explore NACA with Debra",
    icon: KeyRound,
  },
  {
    key: "heroes",
    number: "03",
    title: "I serve my community",
    body: "You’re military, a veteran, teacher, healthcare professional, firefighter/EMS, or law-enforcement professional and want to understand options that may apply.",
    cta: "Explore Homes for Heroes",
    icon: ShieldCheck,
  },
  {
    key: "unsure",
    number: "04",
    title: "I’m not sure yet",
    body: "You’re renting, working on finances, concerned about credit, or simply don’t know which route fits you.",
    cta: "Find my next step",
    icon: CircleHelp,
  },
]

const FAQS = [
  {
    question: "Can I buy a home if I have credit concerns?",
    answer:
      "Credit is one part of preparation, not a reason to guess or count yourself out. Start by understanding which part of your plan needs attention and what resources may help.",
  },
  {
    question: "What is NACA?",
    answer:
      "NACA is a homeownership program with its own education, counseling, documentation, qualification, home selection, and mortgage process. D’Affordable Homes can help explain the real-estate side of that journey; NACA determines its own requirements.",
  },
  {
    question: "How does the NACA process work?",
    answer:
      "A useful high-level path is learn, prepare, work through the NACA process, search for a home, and purchase. Your timeline and next steps depend on your circumstances and the program’s current guidance.",
  },
  {
    question: "Do I need to be ready to buy before talking to Debra?",
    answer:
      "No. The purpose of this page is to help you get oriented before you feel ready. You can keep learning on your own or ask for guidance when the time feels right.",
  },
  {
    question: "Who can explore Homes for Heroes?",
    answer:
      "Military members and veterans, educators, healthcare professionals, firefighters/EMS, and law-enforcement professionals can explore whether a relevant benefit or resource is worth investigating. Eligibility is determined by the applicable program, not this page.",
  },
  {
    question: "Are there homebuyer assistance programs in Dallas?",
    answer:
      "Depending on your location and circumstances, local or specialized homebuyer-assistance programs may deserve investigation. Program details change, so confirm current requirements with the official source or a qualified professional.",
  },
  {
    question: "What if I’m still renting?",
    answer:
      "Renting does not prevent you from getting prepared. A useful first step may be learning the process, organizing your goals, or understanding affordability before you start searching.",
  },
  {
    question: "Does this readiness assessment prequalify me?",
    answer:
      "No. It is an educational readiness tool, not a mortgage application, credit decision, preapproval, or guarantee of program eligibility.",
  },
]

const CAMPAIGN_VARIANTS: Record<
  string,
  { eyebrow: string; headline: string; promise: string; highlight: PathKey | null }
> = {
  naca: {
    eyebrow: "NACA HOMEOWNERSHIP IN DALLAS–FORT WORTH",
    headline: "Thinking about NACA in Dallas?",
    promise: "Understand the process before you start.",
    highlight: "naca",
  },
  "first-time-buyer": {
    eyebrow: "FIRST-TIME HOMEBUYING IN DFW",
    headline: "Buying your first home starts with knowing your next step.",
    promise: "Let’s turn the big questions into a plan you can follow.",
    highlight: "traditional",
  },
  credit: {
    eyebrow: "DFW HOMEOWNERSHIP PREPARATION",
    headline: "Credit concerns don’t mean you should guess about homeownership.",
    promise: "Start with clarity about what to understand and prepare next.",
    highlight: "unsure",
  },
  hero: {
    eyebrow: "HOMES FOR HEROES IN DALLAS–FORT WORTH",
    headline: "You serve your community. Let’s make your homebuying options easier to understand.",
    promise: "Explore a path that recognizes where you serve without making promises about eligibility.",
    highlight: "heroes",
  },
  "down-payment": {
    eyebrow: "DFW HOMEBUYER EDUCATION",
    headline: "Need help understanding down-payment options?",
    promise: "Start here, with a clear explanation of the questions worth asking.",
    highlight: "unsure",
  },
  renter: {
    eyebrow: "FROM RENTING TO READY IN DFW",
    headline: "You don’t have to be ready to start getting ready.",
    promise: "Build a practical homeownership plan around where you are today.",
    highlight: "unsure",
  },
}

function deviceClass(): string {
  if (typeof window === "undefined") return "unknown"
  return window.matchMedia("(max-width: 767px)").matches ? "mobile" : window.matchMedia("(max-width: 1023px)").matches ? "tablet" : "desktop"
}

function ctaClass(tone: "gold" | "outline" | "turquoise" = "gold"): string {
  return `dah-landing-cta dah-landing-cta-${tone}`
}

type WebsiteActions = {
  navigate: (href: string) => void
  scrollTo: (id: string) => void
  selectPath: (path: PathKey) => void
  startAssessment: () => void
  answerAssessment: (questionId: string, value: string) => void
  goBackAssessment: () => void
  updateAssessment: (questionId: string, value: string) => void
  getAssessmentState: () => { phase: Phase; answers: Record<string, string>; selectedPath: PathKey | null }
  showProgram: (program: "naca" | "traditional" | "heroes") => void
  showListings: () => void
  applyListingFilters: (filters?: Record<string, string>) => { available: false; reason: string }
  openCalculator: () => void
  startLeadCapture: () => void
  updateFormField: (field: string, value: string) => void
  submitLead: () => Promise<void>
  openScheduler: () => void
  scheduleConsultation: () => void
}

declare global {
  interface Window {
    DAffordableHomesActions?: WebsiteActions
  }
}

export function NextStepLanding() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [phase, setPhase] = useState<Phase>("question")
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedPath, setSelectedPath] = useState<PathKey | null>(null)
  const [intent, setIntent] = useState("")
  const [attribution, setAttribution] = useState<Attribution>({})
  const [voiceNotice, setVoiceNotice] = useState(false)
  const [leadOpen, setLeadOpen] = useState(false)
  const [leadStatus, setLeadStatus] = useState<LeadStatus>("idle")
  const [leadError, setLeadError] = useState("")
  const [leadFields, setLeadFields] = useState({
    firstName: "",
    email: "",
    mobile: "",
    preferredNextStep: "I’m just researching",
  })
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const questionHeadingRef = useRef<HTMLLegendElement>(null)
  const resultHeadingRef = useRef<HTMLHeadingElement>(null)
  const shouldFocusAssessment = useRef(false)
  const formStartedAt = useRef(0)

  const variant = CAMPAIGN_VARIANTS[intent]
  const result = useMemo(() => getResult(answers, selectedPath), [answers, selectedPath])
  const question = QUESTIONS[questionIndex]!
  const currentAnswer = answers[question.id]

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const nextIntent = params.get("intent") ?? ""
    const nextAttribution = ATTRIBUTION_KEYS.reduce<Attribution>((all, key) => {
      const value = params.get(key)
      if (value) all[key] = value
      return all
    }, {})
    const saved = window.sessionStorage.getItem(STORAGE_KEY)

    formStartedAt.current = Date.now()
    const restore = window.setTimeout(() => {
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as {
            answers?: Record<string, string>
            phase?: Phase
            questionIndex?: number
            selectedPath?: PathKey | null
            attribution?: Attribution
          }
          if (parsed.answers) setAnswers(parsed.answers)
          if (parsed.phase) setPhase(parsed.phase)
          if (typeof parsed.questionIndex === "number") setQuestionIndex(Math.min(parsed.questionIndex, QUESTIONS.length - 1))
          if (parsed.selectedPath) setSelectedPath(parsed.selectedPath)
          if (parsed.attribution) setAttribution(parsed.attribution)
        } catch {
          window.sessionStorage.removeItem(STORAGE_KEY)
        }
      }

      setIntent(nextIntent)
      setAttribution((existing) => ({ ...existing, ...nextAttribution }))
    }, 0)
    trackEvent("landing_view", { intent: nextIntent || "default", deviceClass: deviceClass() })
    return () => window.clearTimeout(restore)
  }, [])

  useEffect(() => {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ answers, phase, questionIndex, selectedPath, attribution }),
    )
  }, [answers, phase, questionIndex, selectedPath, attribution])

  useEffect(() => {
    if (!shouldFocusAssessment.current) return
    shouldFocusAssessment.current = false
    const focus = window.requestAnimationFrame(() => {
      if (phase === "result") resultHeadingRef.current?.focus()
      else questionHeadingRef.current?.focus()
    })
    return () => window.cancelAnimationFrame(focus)
  }, [phase, questionIndex])

  function scrollToId(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function startAssessment() {
    if (phase === "result") {
      shouldFocusAssessment.current = true
      setPhase("question")
      setQuestionIndex(0)
    }
    trackEvent("assessment_started", { intent: intent || "default" })
    scrollToId("assessment")
  }

  function selectPath(path: PathKey) {
    setSelectedPath(path)
    trackEvent("path_selected", { path })
    startAssessment()
  }

  function answerAssessment(questionId: string, value: string) {
    setAnswers((existing) => ({ ...existing, [questionId]: value }))
  }

  function goNext() {
    if (!currentAnswer) return
    shouldFocusAssessment.current = true
    trackEvent("assessment_question_completed", { question: question.id, questionNumber: questionIndex + 1 })
    if (questionIndex === QUESTIONS.length - 1) {
      setPhase("result")
      trackEvent("assessment_completed", { selectedPath: selectedPath ?? "none" })
      trackEvent(`result_${result.key}` as AnalyticsEventName)
      return
    }
    setQuestionIndex((index) => index + 1)
  }

  function goBackAssessment() {
    shouldFocusAssessment.current = true
    if (phase === "result") {
      setPhase("question")
      setQuestionIndex(QUESTIONS.length - 1)
      return
    }
    if (questionIndex > 0) setQuestionIndex((index) => index - 1)
  }

  function updateAssessment(questionId: string, value: string) {
    shouldFocusAssessment.current = true
    setAnswers((existing) => ({ ...existing, [questionId]: value }))
    const index = QUESTIONS.findIndex((item) => item.id === questionId)
    if (index >= 0) {
      setQuestionIndex(index)
      setPhase("question")
      scrollToId("assessment")
    }
  }

  async function submitLead() {
    setLeadStatus("submitting")
    setLeadError("")
    const response = await fetch("/api/leads/next-step", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...leadFields,
        selectedPath,
        resultKey: result.key,
        landingIntent: intent,
        attribution,
        startedAt: formStartedAt.current,
        pageUrl: window.location.href,
        website: "",
      }),
    }).catch(() => null)

    if (!response?.ok) {
      const payload = await response?.json().catch(() => null)
      setLeadError(payload?.error ?? "We could not send that just now. You can still use the consultation page.")
      setLeadStatus("error")
      return
    }

    setLeadStatus("success")
    trackEvent("lead_submitted", { resultKey: result.key, preferredNextStep: leadFields.preferredNextStep })
  }

  function handleLeadSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void submitLead()
  }

  function updateFormField(field: string, value: string) {
    if (field in leadFields) {
      setLeadFields((existing) => ({ ...existing, [field]: value }))
    }
  }

  const actions: WebsiteActions = {
    navigate: (href) => {
      window.location.assign(href)
    },
    scrollTo: scrollToId,
    selectPath,
    startAssessment,
    answerAssessment,
    goBackAssessment,
    updateAssessment,
    getAssessmentState: () => ({ phase, answers, selectedPath }),
    showProgram: (program) => scrollToId(program),
    showListings: () => scrollToId("explore"),
    applyListingFilters: () => ({ available: false, reason: "Live property search is not configured on this campaign page." }),
    openCalculator: () => {
      window.location.assign("/calculators/affordability")
    },
    startLeadCapture: () => {
      setLeadOpen(true)
      trackEvent("lead_capture_opened", { resultKey: result.key })
      scrollToId("lead-capture")
    },
    updateFormField,
    submitLead,
    openScheduler: () => {
      trackEvent("schedule_opened", { source: "next-step" })
      window.location.assign("/book")
    },
    scheduleConsultation: () => {
      trackEvent("schedule_opened", { source: "next-step" })
      window.location.assign("/book")
    },
  }

  useEffect(() => {
    window.DAffordableHomesActions = actions
    return () => {
      delete window.DAffordableHomesActions
    }
  })

  return (
    <div className="dah-landing">
      <section className="dah-landing-hero" aria-labelledby="landing-heading">
        <Image
          src="/manus-storage/hero-family_b1fab939.jpg"
          alt="A family smiling together outside their home"
          fill
          priority
          sizes="100vw"
          className="dah-landing-hero-image"
        />
        <div className="dah-landing-hero-overlay" aria-hidden="true" />
        <div className="dah-landing-hero-content">
          {/* The hero eyebrow sits on the navy scrim, so it takes the gold variant
              rather than the dark teal the base class uses on light surfaces. */}
          <p className="dah-landing-eyebrow dah-landing-eyebrow-gold">{variant?.eyebrow ?? "DALLAS–FORT WORTH HOMEOWNERSHIP"}</p>
          <h1 id="landing-heading">{variant?.headline ?? "Not sure if homeownership is within reach?"}</h1>
          <p className="dah-landing-hero-promise">{variant?.promise ?? "Let’s replace the guesswork with a clear path."}</p>
          <p className="dah-landing-hero-body">
            Whether you’re renting, exploring NACA, concerned about credit, looking for homebuyer programs, or simply don’t know where to begin, D’Affordable Homes helps you understand your options and your next step.
          </p>
          <div className="dah-landing-hero-actions">
            <button type="button" className={ctaClass("gold")} onClick={() => { trackEvent("hero_cta_clicked", { intent: intent || "default" }); startAssessment() }}>
              Find my next step <ArrowRight size={18} aria-hidden="true" />
            </button>
            <button type="button" className={ctaClass("outline")} onClick={() => { trackEvent("secondary_cta_clicked"); scrollToId("paths") }}>
              Explore my options
            </button>
          </div>
          <div className="dah-landing-voice-entry">
            <button type="button" className="dah-landing-voice-button" onClick={() => setVoiceNotice((open) => !open)} aria-expanded={voiceNotice}>
              <span className="dah-landing-voice-icon"><Mic size={19} aria-hidden="true" /></span>
              <span><strong>Rather talk?</strong> Ask D’Affordable: “Where should I start?”</span>
            </button>
            {voiceNotice && <p className="dah-landing-voice-notice" role="status">Live voice guidance is not connected yet. The guided path below is ready to use, and the same actions are exposed for a future voice adapter.</p>}
          </div>
          <p className="dah-landing-microcopy">No mortgage application. No pressure. Start with a few simple questions.</p>
        </div>
        <button type="button" className="dah-landing-scroll-cue" onClick={() => scrollToId("orientation")} aria-label="Scroll to learn more">
          <ArrowDown size={18} aria-hidden="true" />
        </button>
      </section>

      <section id="orientation" className="dah-landing-section dah-landing-cream" aria-labelledby="orientation-heading">
        <div className="dah-landing-container dah-landing-two-column">
          <div>
            <p className="dah-landing-eyebrow dah-landing-eyebrow-dark">START WHERE YOU ARE</p>
            <h2 id="orientation-heading">You don’t have to be “ready” to start getting ready.</h2>
          </div>
          <div>
            <p className="dah-landing-lead">Is my credit good enough? How much money do I need? Could NACA work for me? Are there programs for veterans or teachers?</p>
            <p className="dah-landing-copy">Those are exactly the questions to answer before you start looking at houses. A clear first step can make the rest feel less overwhelming.</p>
            <button type="button" className={ctaClass("gold")} onClick={startAssessment}>Help me figure it out <ArrowRight size={17} aria-hidden="true" /></button>
          </div>
        </div>
        <div className="dah-landing-container dah-landing-question-strip" aria-label="Questions this page can help you explore">
          {["Is my credit good enough?", "How much money do I need?", "Could NACA work for me?", "Should I keep renting?", "Where do I even start?"].map((questionText) => <span key={questionText}>{questionText}</span>)}
        </div>
      </section>

      <section id="paths" className="dah-landing-section" aria-labelledby="paths-heading">
        <div className="dah-landing-container">
          <div className="dah-landing-section-heading">
            <div>
              <p className="dah-landing-eyebrow">CHOOSE A STARTING POINT</p>
              <h2 id="paths-heading">Which sounds most like you?</h2>
            </div>
            <p className="dah-landing-copy">You don’t need to know which mortgage or program you need. Just start with where you are today.</p>
          </div>
          <div className="dah-landing-path-grid">
            {PATHS.map((path) => {
              const Icon = path.icon
              const highlighted = variant?.highlight === path.key || selectedPath === path.key
              return (
                <article key={path.key} className={`dah-landing-path-card ${highlighted ? "is-highlighted" : ""}`}>
                  <div className="dah-landing-path-topline"><span>{path.number}</span><Icon size={22} aria-hidden="true" /></div>
                  <h3>{path.title}</h3>
                  <p>{path.body}</p>
                  <button type="button" className="dah-landing-text-button" onClick={() => selectPath(path.key)}>{path.cta} <ArrowRight size={16} aria-hidden="true" /></button>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section id="assessment" className="dah-landing-section dah-landing-navy" aria-labelledby="assessment-heading">
        <div className="dah-landing-container dah-landing-assessment-layout">
          <div className="dah-landing-assessment-intro">
            <p className="dah-landing-eyebrow dah-landing-eyebrow-gold">FIND MY NEXT STEP</p>
            <h2 id="assessment-heading">A short readiness check. Useful before you shop.</h2>
            <p>Answer six simple questions and receive an educational starting point. Your answers stay in this browser until you choose to share contact information.</p>
            <div className="dah-landing-trust-note"><ShieldCheck size={18} aria-hidden="true" /><span>No Social Security number, credit score, bank details, or financial documents.</span></div>
          </div>
          <div className="dah-landing-assessment-card">
            {phase === "result" ? (
              <>
                <div className="dah-landing-progress-label"><span>Your suggested path</span><span>Complete</span></div>
                <div className="dah-landing-progress"><span style={{ width: "100%" }} /></div>
                <p className="dah-landing-result-kicker">HERE’S WHERE WE RECOMMEND STARTING</p>
                <h3 ref={resultHeadingRef} tabIndex={-1}>{result.heading}</h3>
                <p className="dah-landing-result-body">{result.body}</p>
                <div className="dah-landing-disclosure">This is an educational readiness tool — not a mortgage application, credit decision, preapproval, or guarantee of program eligibility.</div>
                <div className="dah-landing-result-actions">
                  <a href={result.primaryHref} className={ctaClass("gold")} onClick={() => trackEvent("secondary_cta_clicked", { result: result.key })}>{result.primaryLabel} <ArrowRight size={17} aria-hidden="true" /></a>
                  <button type="button" className="dah-landing-outline-dark" onClick={() => { setLeadOpen(true); trackEvent("lead_capture_opened", { resultKey: result.key }); scrollToId("lead-capture") }}>Want Debra to help?</button>
                </div>
                {result.secondary && <p className="dah-landing-also">Also worth exploring: {result.secondary}</p>}
                <div className="dah-landing-edit-list">
                  <p>Your answers</p>
                  {QUESTIONS.map((item) => {
                    const selected = item.answers.find((answer) => answer.value === answers[item.id])
                    return <button type="button" key={item.id} onClick={() => updateAssessment(item.id, answers[item.id] ?? "")}><span>{item.label}</span><strong>{selected?.label ?? "Not answered"}</strong></button>
                  })}
                </div>
                <button type="button" className="dah-landing-back-button" onClick={goBackAssessment}><ArrowLeft size={16} aria-hidden="true" /> Edit last answer</button>
              </>
            ) : (
              <>
                <div className="dah-landing-progress-label"><span>Question {questionIndex + 1} of {QUESTIONS.length}</span><span>{Math.round(((questionIndex + 1) / QUESTIONS.length) * 100)}%</span></div>
                <div className="dah-landing-progress" role="progressbar" aria-valuemin={1} aria-valuemax={QUESTIONS.length} aria-valuenow={questionIndex + 1} aria-label="Readiness assessment progress"><span style={{ width: `${((questionIndex + 1) / QUESTIONS.length) * 100}%` }} /></div>
                <fieldset>
                  <legend ref={questionHeadingRef} tabIndex={-1}>{question.label}</legend>
                  {question.help && <p className="dah-landing-question-help">{question.help}</p>}
                  <div className="dah-landing-answer-grid">
                    {question.answers.map((answer) => <label key={answer.value} className={`dah-landing-answer ${currentAnswer === answer.value ? "is-selected" : ""}`}><input type="radio" name={question.id} value={answer.value} checked={currentAnswer === answer.value} onChange={() => answerAssessment(question.id, answer.value)} /><span>{answer.label}</span>{currentAnswer === answer.value && <Check size={17} aria-hidden="true" />}</label>)}
                  </div>
                </fieldset>
                <div className="dah-landing-assessment-controls">
                  <button type="button" className="dah-landing-back-button" onClick={goBackAssessment} disabled={questionIndex === 0}><ArrowLeft size={16} aria-hidden="true" /> Back</button>
                  <button type="button" className={ctaClass("gold")} onClick={goNext} disabled={!currentAnswer}>{questionIndex === QUESTIONS.length - 1 ? "Show me my next step" : "Continue"} <ArrowRight size={17} aria-hidden="true" /></button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section id="naca" className="dah-landing-section dah-landing-split" aria-labelledby="naca-heading">
        <div className="dah-landing-container dah-landing-two-column dah-landing-two-column-wide">
          <div className="dah-landing-image-frame"><Image src="/manus-storage/couple-consultation_25d3a592.jpg" alt="A couple discussing their homeownership plan with an advisor" fill sizes="(max-width: 800px) 100vw, 50vw" loading="lazy" /></div>
          <div><p className="dah-landing-eyebrow">NACA EDUCATION</p><h2 id="naca-heading">Considering NACA in Dallas? Start with understanding the process.</h2><p className="dah-landing-copy">NACA can offer significant homeownership benefits, but it isn’t simply a shortcut to buying a house. The process includes education, counseling, documentation, qualification, home selection, and mortgage processing.</p><div className="dah-landing-journey" aria-label="NACA journey"><span>Learn</span><i>→</i><span>Prepare</span><i>→</i><span>NACA process</span><i>→</i><span>Home search</span><i>→</i><span>Purchase</span></div><Link href="/naca" className="dah-landing-text-button">Explore NACA with Debra <ArrowRight size={16} aria-hidden="true" /></Link><p className="dah-landing-footnote">D’Affordable Homes does not determine NACA qualification, mortgage approval, rates, terms, or eligibility.</p></div>
        </div>
      </section>

      <section id="traditional" className="dah-landing-section dah-landing-cream" aria-labelledby="traditional-heading">
        <div className="dah-landing-container dah-landing-two-column">
          <div><p className="dah-landing-eyebrow dah-landing-eyebrow-dark">TRADITIONAL HOMEBUYING</p><h2 id="traditional-heading">You don’t need a special program to need a better plan.</h2><p className="dah-landing-copy">Whether you’re considering FHA, VA, conventional financing, down-payment assistance, or haven’t selected financing yet, the first objective is the same: understand what you’re working toward before you start shopping.</p><button type="button" className={ctaClass("gold")} onClick={() => startAssessment()}>Build my homebuying path <ArrowRight size={17} aria-hidden="true" /></button></div>
          <div className="dah-landing-transition-card"><span>Maybe someday</span><ArrowRight size={26} aria-hidden="true" /><strong>Here’s what I need to do next</strong></div>
        </div>
      </section>

      <section id="heroes" className="dah-landing-section dah-landing-navy" aria-labelledby="heroes-heading">
        <div className="dah-landing-container dah-landing-two-column">
          <div><p className="dah-landing-eyebrow dah-landing-eyebrow-gold">HOMES FOR HEROES</p><h2 id="heroes-heading">You serve your community. Your homebuying plan should recognize that.</h2><p className="dah-landing-copy dah-landing-copy-light">Explore whether a benefit or resource connected to your role deserves attention. Current requirements and eligibility belong with the applicable program.</p><button type="button" className={ctaClass("turquoise")} onClick={() => startAssessment()}>Explore my hero options <ArrowRight size={17} aria-hidden="true" /></button></div>
          <div className="dah-landing-hero-list">{["Military & Veterans", "Teachers & Educators", "Healthcare Professionals", "Firefighters & EMS", "Law Enforcement"].map((item) => <div key={item}><Users size={18} aria-hidden="true" /><span>{item}</span></div>)}</div>
        </div>
      </section>

      <section id="explore" className="dah-landing-section" aria-labelledby="explore-heading">
        <div className="dah-landing-container dah-landing-two-column">
          <div className="dah-landing-image-frame dah-landing-image-frame-short"><Image src="/manus-storage/home-keys-moment_20083d77.jpg" alt="A homeowner holding keys at the doorway of a house" fill sizes="(max-width: 800px) 100vw, 50vw" loading="lazy" /></div>
          <div><p className="dah-landing-eyebrow">LOCAL DFW OPTIONS</p><h2 id="explore-heading">NACA isn’t the only homeownership path in DFW.</h2><p className="dah-landing-copy">Depending on your location and circumstances, local or specialized homebuyer-assistance programs may also deserve investigation. Start with your situation, then confirm current details from the official source.</p><button type="button" className={ctaClass("outline")} onClick={startAssessment}>Check my starting point <ArrowRight size={17} aria-hidden="true" /></button></div>
        </div>
      </section>

      <section className="dah-landing-section dah-landing-cream" aria-labelledby="debra-heading">
        <div className="dah-landing-container dah-landing-two-column">
          <div><p className="dah-landing-eyebrow dah-landing-eyebrow-dark">A HUMAN GUIDE</p><h2 id="debra-heading">You don’t need another sales pitch. You need someone who can help you understand the path.</h2><p className="dah-landing-copy">Debra’s role is to help you slow the process down, understand what comes next, and move with a plan. The customer remains the hero; D’Affordable Homes is the navigator.</p><Link href="/about" className="dah-landing-text-button">Meet Debra <ArrowRight size={16} aria-hidden="true" /></Link></div>
          <div className="dah-landing-image-frame dah-landing-image-frame-portrait"><Image src="/images/hero-homeowner.png" alt="Debra Allen standing outside a home" fill sizes="(max-width: 800px) 100vw, 40vw" loading="lazy" /></div>
        </div>
      </section>

      <section id="readiness" className="dah-landing-section" aria-labelledby="process-heading">
        <div className="dah-landing-container"><div className="dah-landing-section-heading"><div><p className="dah-landing-eyebrow">THE D’Affordable WAY</p><h2 id="process-heading">Three steps. No guessing.</h2></div><p className="dah-landing-copy">You do not have to have every answer today. You do need one clear next step.</p></div><ol className="dah-landing-process-list">{[["01", "Tell us where you are", "Answer a few simple questions."], ["02", "Understand your path", "See which homeownership route deserves your attention."], ["03", "Take your next step", "Learn, prepare, search, or talk with Debra."]].map(([number, title, body]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></li>)}</ol></div>
      </section>

      <section className="dah-landing-section dah-landing-faq" aria-labelledby="faq-heading">
        <div className="dah-landing-container dah-landing-two-column">
          <div><p className="dah-landing-eyebrow">COMMON QUESTIONS</p><h2 id="faq-heading">Clear answers before you make a move.</h2><p className="dah-landing-copy">Good guidance should make the next decision easier, not make you feel behind.</p></div>
          <div className="dah-landing-faq-list">{FAQS.map((faq, index) => <div key={faq.question} className="dah-landing-faq-item"><button type="button" aria-expanded={openFaq === index} onClick={() => { setOpenFaq(openFaq === index ? null : index); trackEvent("faq_opened", { question: faq.question }) }}><span>{faq.question}</span><ChevronDown size={18} aria-hidden="true" /></button>{openFaq === index && <p>{faq.answer}</p>}</div>)}</div>
        </div>
      </section>

      <section className="dah-landing-final" aria-labelledby="final-heading">
        <Image src="/manus-storage/home-keys-moment_20083d77.jpg" alt="" fill sizes="100vw" loading="lazy" className="dah-landing-final-image" />
        <div className="dah-landing-final-overlay" aria-hidden="true" />
        <div className="dah-landing-container dah-landing-final-content"><p className="dah-landing-eyebrow dah-landing-eyebrow-gold">YOUR NEXT STEP IS ENOUGH FOR TODAY</p><h2 id="final-heading">You don’t need to have everything figured out.</h2><p>You just need to know your next step.</p><div><button type="button" className={ctaClass("gold")} onClick={startAssessment}>Find my next step <ArrowRight size={17} aria-hidden="true" /></button><Link href="/book" className={ctaClass("outline")}>Schedule with Debra</Link></div></div>
      </section>

      {phase === "result" && leadOpen && <section id="lead-capture" className="dah-landing-section dah-landing-cream" aria-labelledby="lead-heading"><div className="dah-landing-container dah-landing-lead-card"><div><p className="dah-landing-eyebrow dah-landing-eyebrow-dark">VALUE FIRST. CONTACT SECOND.</p><h2 id="lead-heading">Want Debra to help you take the next step?</h2><p className="dah-landing-copy">Your educational result is already yours. Share a little context only if you want a follow-up.</p></div>{leadStatus === "success" ? <div className="dah-landing-success" role="status"><Check size={22} aria-hidden="true" /><div><strong>Thanks — your request is ready for follow-up.</strong><p>Debra’s team can use the path you selected to keep the conversation focused.</p></div></div> : <form onSubmit={handleLeadSubmit} className="dah-landing-lead-form"><div className="dah-landing-form-grid"><label>First name <input required name="firstName" value={leadFields.firstName} onChange={(event) => updateFormField("firstName", event.target.value)} autoComplete="given-name" /></label><label>Email <input required type="email" name="email" value={leadFields.email} onChange={(event) => updateFormField("email", event.target.value)} autoComplete="email" /></label><label>Mobile <span>(optional)</span><input type="tel" name="mobile" value={leadFields.mobile} onChange={(event) => updateFormField("mobile", event.target.value)} autoComplete="tel" /></label><label>Preferred next step <select name="preferredNextStep" value={leadFields.preferredNextStep} onChange={(event) => updateFormField("preferredNextStep", event.target.value)}><option>Schedule a consultation</option><option>Have Debra contact me</option><option>Email my results</option><option>Send me NACA information</option><option>I’m just researching</option></select></label></div><input className="dah-landing-honeypot" tabIndex={-1} aria-hidden="true" name="website" autoComplete="off" /><div className="dah-landing-form-actions"><button type="submit" className={ctaClass("gold")} disabled={leadStatus === "submitting"}>{leadStatus === "submitting" ? "Sending…" : "Send my next-step request"} <ArrowRight size={17} aria-hidden="true" /></button><p>No preapproval, qualification, or guarantee is provided by this form.</p></div>{leadStatus === "error" && <p className="dah-landing-form-error" role="alert">{leadError} <Link href="/consultation">Open the consultation page.</Link></p>}</form>}</div></section>}

      <div className="dah-landing-bottom-actions" aria-label="Quick actions"><button type="button" onClick={startAssessment}><Sparkles size={16} aria-hidden="true" /> Find my next step</button><Link href="/book" onClick={() => trackEvent("schedule_opened", { source: "sticky-cta" })}><Home size={16} aria-hidden="true" /> Schedule with Debra</Link></div>
    </div>
  )
}