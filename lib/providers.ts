/**
 * Vendor-agnostic provider status.
 *
 * The platform never fabricates listings, market data, or reviews. Each
 * data-dependent surface asks whether its provider is configured; when it is
 * not, the UI renders an honest "not connected yet" state instead of fake data.
 *
 * These checks are intentionally conservative: a provider is only "connected"
 * when the required environment variables are present at build/runtime.
 */

export type ProviderStatus = {
  connected: boolean
  /** Environment variable NAMES only — never values. */
  requiredEnv: string[]
}

function hasAll(keys: string[]): boolean {
  return keys.every((k) => Boolean(process.env[k]))
}

/** MLS / listing search provider (e.g. an IDX or MLS API adapter). */
export function mlsStatus(): ProviderStatus {
  const requiredEnv = ["MLS_PROVIDER_API_KEY", "MLS_PROVIDER_BASE_URL"]
  return { connected: hasAll(requiredEnv), requiredEnv }
}

/** Market analytics provider used for neighborhood and market reports. */
export function marketDataStatus(): ProviderStatus {
  const requiredEnv = ["MARKET_DATA_API_KEY"]
  return { connected: hasAll(requiredEnv), requiredEnv }
}

/** Scheduling provider used for booking consultations. */
export function schedulingStatus(): ProviderStatus {
  const requiredEnv = ["SCHEDULING_PROVIDER_URL"]
  return { connected: hasAll(requiredEnv), requiredEnv }
}

/** CMS / content provider used for blog articles and events. */
export function contentStatus(): ProviderStatus {
  const requiredEnv = ["CONTENT_API_URL"]
  return { connected: hasAll(requiredEnv), requiredEnv }
}
