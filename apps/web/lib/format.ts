/** Formats an ISO date for editorial display without depending on the server locale. */
export function formatArticleDate(iso: string): string {
  const value = new Date(iso)
  if (Number.isNaN(value.getTime())) return ""
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(value)
}
