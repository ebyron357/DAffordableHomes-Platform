/**
 * Date formatting for editorial surfaces.
 *
 * Dates are stored as `YYYY-MM-DD`. They are formatted at noon UTC so the
 * rendered day never shifts backwards for viewers west of UTC, which would
 * otherwise make a published article appear to be dated a day early.
 */
export function formatArticleDate(value: string): string {
  const parsed = new Date(`${value}T12:00:00Z`)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
}
