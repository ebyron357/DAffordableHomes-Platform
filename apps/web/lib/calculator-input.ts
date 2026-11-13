export function calculatorInputError(value: number, min = 0, max = Number.MAX_SAFE_INTEGER): string | undefined {
  if (!Number.isFinite(value)) return "Enter a number to update your estimate."
  if (value < min) return `Enter ${min.toLocaleString("en-US")} or more.`
  if (value > max) return `Enter ${max.toLocaleString("en-US")} or less.`
  return undefined
}
