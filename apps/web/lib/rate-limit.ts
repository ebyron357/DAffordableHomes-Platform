/**
 * Fixed-window rate limiting for public endpoints.
 *
 * AGENTS.md §6 requires rate limiting and spam protection on public forms and
 * AI endpoints. The honeypot and the elapsed-time check on the lead forms are
 * both client-controlled, so a replayed request bypasses them entirely; this
 * adds a boundary the caller cannot set.
 *
 * Scope, stated plainly: the counter lives in the process that serves the
 * request. On a platform that runs several instances it limits per instance,
 * not per deployment, and a cold start resets it. That is a real reduction in
 * replay volume from one client, not a guarantee across a fleet. A durable
 * store (Vercel KV, Upstash, or the edge middleware's own limiter) is the
 * production-grade version and needs provisioning the repository does not have;
 * until then this is the boundary, and it fails closed on the identifier it can
 * see rather than leaving the endpoint open.
 *
 * ## Why the bucket is bounded
 *
 * The first version swept expired entries whenever the map passed 500 entries
 * and then inserted unconditionally. Expired entries are the only thing a sweep
 * can remove, so a flood from many distinct addresses inside one window swept
 * nothing, grew the map without limit, and paid an O(n) scan on *every*
 * subsequent request. The limiter became the cheapest way to exhaust the
 * instance it was protecting.
 *
 * Two changes close that:
 *
 * 1. A sweep runs at most once per window per bucket, so the scan is amortised
 *    instead of repeating per request.
 * 2. The map has a hard capacity. At capacity a **new** identifier is refused
 *    rather than admitted, so memory cannot grow without bound.
 *
 * The cost of (2) is explicit: under a flood of distinct addresses, a fresh
 * caller can be refused until the window turns over. That is a bounded refusal
 * on one instance, chosen over unbounded growth on it. The alternative —
 * evicting existing entries to make room — would let a caller evict its own
 * counter and escape the limit, which is worse.
 */

type Window = { count: number; resetAt: number }
type Bucket = { windows: Map<string, Window>; nextSweepAt: number }

const BUCKETS = new Map<string, Bucket>()

/**
 * Entries below this count are not worth scanning. Above it, a sweep still runs
 * no more than once per window.
 */
const SWEEP_ABOVE = 500

/**
 * Hard ceiling on tracked identifiers per bucket. Well above any plausible
 * legitimate concurrency for this site, and low enough to bound memory.
 */
const MAX_IDENTIFIERS = 5_000

/** Removes expired windows. Expired entries are the only removable ones. */
function sweep(windows: Map<string, Window>, now: number) {
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key)
  }
}

export type RateLimitResult = {
  ok: boolean
  /** Seconds until the window resets; suitable for a Retry-After header. */
  retryAfter: number
}

export function rateLimit(
  name: string,
  identifier: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now()
  let bucket = BUCKETS.get(name)
  if (!bucket) {
    bucket = { windows: new Map(), nextSweepAt: now + windowMs }
    BUCKETS.set(name, bucket)
  }

  const existing = bucket.windows.get(identifier)

  // A live window is the common path: count against it and touch nothing else.
  if (existing && existing.resetAt > now) {
    existing.count += 1
    if (existing.count > limit) {
      return { ok: false, retryAfter: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)) }
    }
    return { ok: true, retryAfter: 0 }
  }

  // Everything below either inserts or replaces, so this is the only path that
  // can grow the map, and the only one that needs to sweep or check capacity.
  if (bucket.windows.size > SWEEP_ABOVE && now >= bucket.nextSweepAt) {
    sweep(bucket.windows, now)
    bucket.nextSweepAt = now + windowMs
  }

  // Replacing an expired window does not grow the map, so capacity applies only
  // to an identifier that is not already tracked.
  if (!existing && bucket.windows.size >= MAX_IDENTIFIERS) {
    return { ok: false, retryAfter: Math.max(1, Math.ceil(windowMs / 1000)) }
  }

  bucket.windows.set(identifier, { count: 1, resetAt: now + windowMs })
  return { ok: true, retryAfter: 0 }
}

/**
 * The caller's address as the platform reports it.
 *
 * `x-forwarded-for` is set by Vercel's proxy and is the value to trust there.
 * A request that arrives with no usable address is bucketed under one shared
 * key rather than being waved through, so an absent header cannot be used to
 * opt out of the limit.
 */
export function clientIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const first = forwarded?.split(",")[0]?.trim()
  if (first) return first
  return request.headers.get("x-real-ip")?.trim() || "unknown"
}

/** Test-only reset so suites do not leak window state between cases. */
export function __resetRateLimitForTests() {
  BUCKETS.clear()
}
