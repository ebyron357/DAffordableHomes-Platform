"use client"

import { useId, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { calculatorInputError } from "@/lib/calculator-input"

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0)
}

export function NumberField({
  id,
  label,
  value,
  onValueChange,
  min = 0,
  max,
  step = 1,
  prefix,
  suffix,
  help,
}: {
  id: string
  label: string
  value: number
  onValueChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  prefix?: string
  suffix?: string
  help?: string
}) {
  const helpId = help ? `${id}-help` : undefined
  const error = calculatorInputError(value, min, max)
  const errorId = `${id}-error`
  const describedBy = [helpId, error ? errorId : undefined].filter(Boolean).join(" ") || undefined

  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="focus-within-indicator mt-2 flex min-h-12 items-center rounded-md border border-input bg-card focus-within:border-primary">
        {prefix && <span className="pl-3 text-sm text-muted-foreground">{prefix}</span>}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={Number.isFinite(value) ? value : ""}
          required
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          onChange={(event) => onValueChange(event.target.valueAsNumber)}
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-base text-foreground outline-none"
        />
        {suffix && <span className="pr-3 text-sm text-muted-foreground">{suffix}</span>}
      </div>
      {help && (
        <p id={helpId} className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {help}
        </p>
      )}
      {error && <p id={errorId} className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  )
}

export function SelectField({
  id,
  label,
  value,
  onValueChange,
  options,
}: {
  id: string
  label: string
  value: number
  onValueChange: (value: number) => void
  options: { label: string; value: number }[]
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onValueChange(Number(event.target.value))}
        className="mt-2 min-h-12 w-full rounded-md border border-input bg-card px-3 py-2.5 text-base text-foreground focus:border-primary"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export function CalculatorPanel({
  title,
  description,
  fields,
  results,
}: {
  title: string
  description: string
  fields: ReactNode
  results: ReactNode
}) {
  const resultsId = useId()

  return (
    <div className="group/calculator grid grid-cols-1 overflow-hidden rounded-md border border-border bg-card [overflow-wrap:anywhere] lg:grid-cols-[0.9fr_1.1fr]">
      <div className="min-w-0 p-5 sm:p-8 lg:p-12">
        <h2 className="font-serif text-2xl font-normal text-foreground">{title}</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{description}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Starting values are examples, not current rates or quotes. Change them to explore your own scenario.</p>
        <a href={`#${resultsId}`} className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-primary underline lg:hidden">Jump to your estimate</a>
        <div className="mt-5 grid grid-cols-1 gap-5">{fields}</div>
      </div>
      <section id={resultsId} tabIndex={-1} aria-label="Planning results" className="m-3 min-w-0 scroll-mt-24 border-t border-border bg-primary p-5 text-primary-foreground sm:m-8 sm:p-8 lg:ml-0 lg:border-0 lg:p-10">
        <CalculatorResults>{results}</CalculatorResults>
      </section>
    </div>
  )
}

export function CalculatorResults({ children }: { children: ReactNode }) {
  return (
    <>
      <p role="status" className="hidden text-base leading-relaxed group-has-[[aria-invalid=true]]/calculator:block">Your estimate is paused. Correct the highlighted inputs above to see updated results.</p>
      <div className="group-has-[[aria-invalid=true]]/calculator:hidden">{children}</div>
    </>
  )
}

export function ResultRow({
  label,
  value,
  emphasized = false,
}: {
  label: string
  value: string
  emphasized?: boolean
}) {
  return (
    <div
      className={`flex items-start justify-between gap-4 border-b border-primary-foreground/20 py-4 last:border-b-0 ${
        emphasized ? "text-lg font-semibold" : "text-sm"
      }`}
    >
      <span className="min-w-0 flex-1 text-primary-foreground/75">{label}</span>
      <span className="min-w-0 max-w-[45%] shrink-0 break-words text-right tabular-nums text-primary-foreground">{value}</span>
    </div>
  )
}

/**
 * `tone` is the surface the actions sit on. Most calculators put them on the
 * dark result panel ("dark"); the down-payment planner puts them under a light
 * table ("light"), where the white outline button measured 1.04:1.
 */
export function CalculatorActions({ secondaryHref, tone = "dark" }: { secondaryHref?: string; tone?: "dark" | "light" }) {
  return (
    <>
      <div className="mt-7 flex flex-col gap-3">
        <Button href="/consultation" variant={tone === "dark" ? "secondary" : "primary"} className="min-h-12 w-full whitespace-normal text-center">
          Discuss these estimates with Debra
        </Button>
        {secondaryHref && (
          <Button
            href={secondaryHref}
            variant="outline"
            className={tone === "dark" ? "w-full whitespace-normal text-center border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto" : "w-full whitespace-normal text-center sm:w-auto"}
          >
            Continue planning
          </Button>
        )}
      </div>
      {/* The numbers live only in this tab, so say so, and say what to do with them. */}
      <p
        className={
          tone === "dark"
            ? "mt-3 text-sm leading-relaxed text-primary-foreground/75"
            : "mt-3 text-sm leading-relaxed text-muted-foreground"
        }
      >
        Your numbers aren&apos;t saved or sent anywhere. Want a second opinion? Note your result and bring it to a
        consultation with Debra.
      </p>
    </>
  )
}

export function EstimateNotice({ children }: { children?: ReactNode }) {
  return (
    <p className="mt-6 border-t border-primary-foreground/20 pt-5 text-sm leading-relaxed text-primary-foreground/70">
      {children ??
        "Planning estimate only. Actual loan terms, taxes, insurance, mortgage insurance, fees, and eligibility vary by property, lender, and borrower."}
    </p>
  )
}
