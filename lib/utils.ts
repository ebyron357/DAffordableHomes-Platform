export type ClassValue = string | false | null | undefined

/** Minimal className joiner — no external dependency required. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ")
}
