import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"

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

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="mt-2 flex min-h-11 items-center rounded-lg border border-input bg-card focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        {prefix && <span className="pl-3 text-sm text-muted-foreground">{prefix}</span>}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-describedby={helpId}
          onChange={(event) => onValueChange(event.target.valueAsNumber || 0)}
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-base text-foreground outline-none"
        />
        {suffix && <span className="pr-3 text-sm text-muted-foreground">{suffix}</span>}
      </div>
      {help && (
        <p id={helpId} className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          {help}
        </p>
      )}
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
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onValueChange(Number(event.target.value))}
        className="mt-2 min-h-11 w-full rounded-lg border border-input bg-card px-3 py-2.5 text-base text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
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
  return (
    <div className="grid overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:grid-cols-[1.05fr_0.95fr]">
      <div className="p-6 sm:p-8">
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{description}</p>
        <div className="mt-7 grid gap-5 sm:grid-cols-2">{fields}</div>
      </div>
      <div className="border-t border-border bg-primary p-6 text-primary-foreground sm:p-8 lg:border-l lg:border-t-0">
        {results}
      </div>
    </div>
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
      className={`flex items-start justify-between gap-4 border-b border-primary-foreground/15 py-3 last:border-b-0 ${
        emphasized ? "text-lg font-semibold" : "text-sm"
      }`}
    >
      <span className="text-primary-foreground/80">{label}</span>
      <span className="text-right tabular-nums text-primary-foreground">{value}</span>
    </div>
  )
}

export function CalculatorActions({ secondaryHref }: { secondaryHref?: string }) {
  return (
    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
      <Button href="/book" variant="secondary" className="w-full sm:w-auto">
        Schedule a consultation
      </Button>
      {secondaryHref && (
        <Button
          href={secondaryHref}
          variant="outline"
          className="w-full border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto"
        >
          Continue planning
        </Button>
      )}
    </div>
  )
}

export function EstimateNotice({ children }: { children?: ReactNode }) {
  return (
    <p className="mt-6 text-xs leading-relaxed text-primary-foreground/70">
      {children ??
        "Planning estimate only. Actual loan terms, taxes, insurance, mortgage insurance, fees, and eligibility vary by property, lender, and borrower."}
    </p>
  )
}
