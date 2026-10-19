/**
 * Confirmed workshops and events, in date order.
 *
 * Add a session here only once its date, time and place are confirmed by
 * Debra; nothing is ever listed as a placeholder. While the list is empty,
 * /events is `noindex` and left out of the sitemap — an events page with no
 * events is a thin page — and it is indexed again automatically, with Event
 * structured data for each session, once the first one is added.
 */
export type EventSession = {
  /** What the session is, as it will be advertised. */
  title: string
  /** ISO 8601 start, with the Central-time offset, e.g. "2026-11-14T10:00:00-06:00". */
  startDate: string
  /** ISO 8601 end, when known. */
  endDate?: string
  /** A named venue and its street address, or "Online". */
  location: { name: string; address?: string } | "Online"
  /** One or two plain sentences on what it covers and who it is for. */
  description: string
  /** Where to register, when registration is elsewhere. */
  registrationUrl?: string
}

export const CONFIRMED_SESSIONS: readonly EventSession[] = []

export function hasConfirmedSessions(): boolean {
  return CONFIRMED_SESSIONS.length > 0
}
