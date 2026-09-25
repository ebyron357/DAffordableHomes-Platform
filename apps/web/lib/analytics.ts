export type AnalyticsEventName =
  | "landing_view"
  | "hero_cta_clicked"
  | "secondary_cta_clicked"
  | "path_selected"
  | "assessment_started"
  | "assessment_question_completed"
  | "assessment_completed"
  | "result_naca"
  | "result_traditional"
  | "result_hero"
  | "result_readiness"
  | "lead_capture_opened"
  | "lead_submitted"
  | "schedule_opened"
  | "faq_opened"

export type AnalyticsEvent = {
  name: AnalyticsEventName
  properties?: Record<string, string | number | boolean | undefined>
}

/**
 * Provider-neutral analytics seam. A future GA4/Clarity adapter can listen to
 * this event without coupling the landing page to a vendor.
 */
export function trackEvent(name: AnalyticsEventName, properties?: AnalyticsEvent["properties"]): void {
  if (typeof window === "undefined") return

  window.dispatchEvent(new CustomEvent<AnalyticsEvent>("daffordable:analytics", { detail: { name, properties } }))

  const dataLayer = (window as Window & { dataLayer?: unknown[] }).dataLayer
  if (Array.isArray(dataLayer)) {
    dataLayer.push({ event: name, ...properties })
  }
}