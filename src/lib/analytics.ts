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
  // Network beacon FIRST, before the gtag check: visitors with a blocker lose
  // gtag far more often than our first-party beacon, and an early return here
  // would drop exactly the people the beacon exists for. Cookieless, no PII.
  sendBeacon(name, params);
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
 * Map one of our GA4 events onto the network beacon's standard vocabulary (see
 * izn.project.stats/beacon/README.md): tool_opened / tool_used / download /
 * affiliate_click / outbound_click, plus our own cta_view. Only whitelisted
 * events go, with at most the standard keys — never free text, a wallet address,
 * a CSV value or a search term. `iznTrack` is defined by an inline stub in the
 * head, so it exists (and queues) even before b.js has loaded.
 */
function beaconPayload(
  name: string,
  p: Record<string, ParamValue | undefined> = {},
): [string, Record<string, string>] | null {
  const s = (v: ParamValue | undefined) => (v === undefined ? undefined : String(v).slice(0, 80));
  const out = (o: Record<string, string | undefined>) =>
    Object.fromEntries(Object.entries(o).filter(([, v]) => v)) as Record<string, string>;
  switch (name) {
    case "tool_used": {
      const tool = s(p.tool_slug);
      if (!tool) return null;
      if (p.action === "view") return ["tool_opened", out({ tool })];
      if (p.action === "download") return ["download", out({ tool, format: "png" })];
      return ["tool_used", out({ tool, action: s(p.action) === "compute" ? "run" : s(p.action) })];
    }
    case "affiliate_click":
      return ["affiliate_click", out({ network: s(p.platform), placement: s(p.placement) })];
    case "cta_view":
      return ["cta_view", out({ network: s(p.platform), placement: s(p.placement) })];
    case "outbound_click":
      return ["outbound_click", out({ host: s(p.host) })];
    case "portfolio_run":
      return ["tool_used", { tool: "portfolio-analyzer", action: "run" }];
    case "backtest_run":
      return ["tool_used", { tool: "investment-calculator", action: "run" }];
    case "grid_backtest_run":
      return ["tool_used", { tool: "grid-trading-backtest", action: "run" }];
    case "harvest_plan_built":
      return ["tool_used", { tool: "tax-loss-harvesting", action: "run" }];
    case "cost_basis_compared":
      return ["tool_used", { tool: "cost-basis-method-calculator", action: "run" }];
    case "tax_report_built":
      return ["tool_used", { tool: "crypto-tax-report", action: "run" }];
    case "tax_report_export":
      return ["download", { tool: "crypto-tax-report", format: "csv" }];
    default:
      return null;
  }
}

function sendBeacon(name: string, params?: Record<string, ParamValue | undefined>): void {
  try {
    const w = window as unknown as { iznTrack?: (e: string, p: Record<string, string>) => void };
    const m = beaconPayload(name, params);
    if (m && typeof w.iznTrack === "function") w.iznTrack(m[0], m[1]);
  } catch {
    // The beacon must never break the page or the GA4 call after it.
  }
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