/**
 * ============================================================================
 * Custom GA4 events.
 * ============================================================================
 * One tiny wrapper over gtag so call sites never have to think about whether
 * the tag loaded, whether we are server-rendering, or what GA4's naming rules
 * are.
 *
 * NO consent gate here on purpose. Consent Mode already governs what GA is
 * allowed to do with these hits: with `analytics_storage: 'denied'` (the
 * default set in ConsentModeScript) gtag sends a cookieless ping — no client
 * id, no _ga cookie, nothing that identifies the visitor. Gating the call
 * ourselves would throw away the aggregate signal we are actually after, and
 * would silently disagree with the consent state GA is already applying.
 *
 * These are all "did a human get value out of this page" events. They carry no
 * user input — never pass a field value, a CSV row, a wallet address or a
 * search-free-text that could identify someone. Tool slugs, country codes and
 * counts only.
 */

/** GA4 rejects names that aren't [A-Za-z][A-Za-z0-9_]{0,39}. */
const NAME_RE = /^[A-Za-z][A-Za-z0-9_]{0,39}$/;

type ParamValue = string | number | boolean;

/**
 * Network convention: every custom event carries one primary param, `item`, so
 * the central network system can build a "what exactly" breakdown uniformly
 * across events. Rather than touch every call site, `track` mirrors the event's
 * own primary param into `item` when the caller didn't set it explicitly — the
 * first of these that is present wins. Pass `item` directly to override.
 */
const ITEM_SOURCES = [
  "tool_slug", "platform", "target", "coin", "country",
  "channel", "section", "category", "chain", "source",
  "strategy", "method", "choice", "sort", "file", "kind", "action",
] as const;

/**
 * Send one GA4 event. Safe to call anywhere: no-ops during SSR, before gtag
 * loads, when the visitor blocks analytics, and when GA is not configured.
 */
export function track(name: string, params?: Record<string, ParamValue | undefined>): void {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;
  if (!NAME_RE.test(name)) return;
  let payload = params ? clean(params) : undefined;
  if (payload && payload.item === undefined) {
    for (const k of ITEM_SOURCES) {
      if (payload[k] !== undefined) {
        payload = { item: payload[k], ...payload };
        break;
      }
    }
  }
  gtag("event", name, payload);
}

/**
 * Drop undefined params and clamp strings to GA4's 100-character limit — an
 * over-long value makes GA discard the whole parameter, silently.
 */
function clean(params: Record<string, ParamValue | undefined>): Record<string, ParamValue> {
  const out: Record<string, ParamValue> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    if (!NAME_RE.test(key)) continue;
    out[key] = typeof value === "string" ? value.slice(0, 100) : value;
  }
  return out;
}

/**
 * Bucket a count instead of reporting it raw. GA4 charges a cardinality price
 * for high-variety dimensions ("(other)" rows appear once a dimension exceeds
 * its limit), and "how big was the CSV" is a question buckets answer just as
 * well as exact numbers.
 */
export function bucket(n: number): string {
  if (n <= 0) return "0";
  if (n <= 10) return "1-10";
  if (n <= 50) return "11-50";
  if (n <= 200) return "51-200";
  if (n <= 1000) return "201-1000";
  return "1000+";
}