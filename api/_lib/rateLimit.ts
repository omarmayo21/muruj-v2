/**
 * In-memory sliding-window rate limiter: 5 lead submissions per 10 minutes per IP.
 *
 * Shared mobile IPs (carrier-grade NAT is common in Egypt) are protected by:
 *  - counting ONLY valid submissions (validation errors / typos never use the quota)
 *  - the generous window (5 real leads from one IP in 10 minutes is unusual)
 *  - memory being per serverless instance (in practice the limit is looser, never stricter)
 * When the limit is hit, the form shows a friendly Arabic message + Call / WhatsApp buttons,
 * so the lead is not lost.
 */
export const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 5 };
const hits = new Map<string, number[]>();

function recent(ip: string, now: number) {
  return (hits.get(ip) || []).filter((t) => now - t < RATE_LIMIT.windowMs);
}

/** Check without consuming quota */
export function isRateLimited(ip: string): { limited: boolean; retryAfter: number } {
  const now = Date.now();
  const list = recent(ip, now);
  hits.set(ip, list);
  if (list.length >= RATE_LIMIT.max) {
    return { limited: true, retryAfter: Math.ceil((RATE_LIMIT.windowMs - (now - list[0])) / 1000) };
  }
  return { limited: false, retryAfter: 0 };
}

/** Consume one unit of quota (call only for valid submissions) */
export function recordHit(ip: string) {
  const now = Date.now();
  const list = recent(ip, now);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < RATE_LIMIT.windowMs)) hits.delete(k);
  }
}
