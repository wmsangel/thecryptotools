/**
 * /go/<id>?s=<placement>&t=<time>&k=<sig> — our own affiliate redirect, with a
 * gate. A person who pressed a link on one of our pages gets a 302 to the
 * partner (with `thecryptotools-<placement>` as the network sub-id where the
 * network has such a parameter); anything that looks like a bot, a prefetch, a
 * request that did not come from our page, or a URL without a fresh click-time
 * token gets 204 and no Location.
 *
 * Why: the audit of 2026-11-27 showed 0 conversions on every affiliate network
 * over 30 days against thousands of "clicks" — almost entirely bots and link
 * prefetch. Not cloaking: for a person the destination is exactly what it always
 * was, we only decline to bill a machine as a visitor.
 *
 * Gates, in order (models: costtrek 5e142b5 / 86c22e0, network notice 2026-11-27):
 *  1. bot UA, prefetch/prerender purpose, Sec-Fetch-Mode other than navigate;
 *  2. a Chromium UA that sends no Sec-Fetch-* at all (spoofed UA);
 *  3. Sec-Fetch-User: ?1 from every browser new enough to send it (Chrome 76+,
 *     Firefox 90+, Safari 16.4+ incl. iOS engines); older ones may take the soft
 *     path — a same-origin Referer or Sec-Fetch-Site;
 *  4. a fresh signed token minted by our script on a trusted press (see
 *     src/lib/go-token.ts) — a stored list of /go URLs is useless.
 *
 * Destinations live in src/lib/go-map.generated.json, written by
 * scripts/build-go-redirects.ts from platforms.ts. This function replaces the
 * old static `/go/*` rules in _redirects (which would shadow it — none remain).
 *
 * Counting (no D1 — decision 2026-11-27): every verdict is sent to the network's
 * cookieless beacon as `go_hit{reason, net, offer}` — reason "click" for a pass
 * or the refusal reason ("bot-ua", "no-user-gesture", "no-token", …), net the
 * network family, offer the /go id. It lands in stats.db with the other beacon
 * events. Never headers, cookies, IPs or the user agent. 302 = click we passed,
 * 204 = refused; both also show per path in Cloudflare's edge analytics.
 */
import MAP from "../../src/lib/go-map.generated.json";
import { goTokenValid } from "../../src/lib/go-token.ts";

const NOINDEX = {
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow",
};

const AMAZON_TAG = "thecryptotools-20";
const SUB_PREFIX = "thecryptotools-";

const BOT_UA = /\b(bot|crawler|spider|scrape|preview|headless|monitor)\b/i;

/** true when this browser version is known to send Sec-Fetch-User on navigations. */
function sendsUserHeader(ua) {
  // iOS: every iOS browser runs Safari's engine, so the iOS version decides
  // (Safari 16.4 = iOS 16.4; CriOS/FxiOS follow the OS, not their own version).
  const ios = /\b(?:iPhone|iPad|iPod)\b.*?\bOS (\d+)_(\d+)/.exec(ua);
  if (ios) return +ios[1] > 16 || (+ios[1] === 16 && +ios[2] >= 4);
  const ff = /\bFirefox\/(\d+)/.exec(ua);
  if (ff) return +ff[1] >= 90;
  const ch = /\bChrome\/(\d+)/.exec(ua); // Chrome, Edge, Opera, Samsung, Brave…
  if (ch) return +ch[1] >= 76;
  const sf = /\bVersion\/(\d+)\.(\d+).*\bSafari\//.exec(ua);
  if (sf) return +sf[1] > 16 || (+sf[1] === 16 && +sf[2] >= 4);
  return false;
}

/**
 * Report one verdict to the beacon, fire-and-forget (waitUntil): counting must
 * never decide or delay the answer. The Origin is ours, so the collector books it
 * under thecryptotools.com; a plain browser-shaped UA because the collector drops
 * anything that looks like a bot, and this is our own function reporting its own
 * decision.
 */
function count(waitUntil, id, net, reason) {
  try {
    const task = fetch("https://b.izntools.com/e", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        Origin: "https://thecryptotools.com",
        "User-Agent": "Mozilla/5.0 (thecryptotools go-gate)",
      },
      body: JSON.stringify({ e: "go_hit", p: "/go", d: { reason, net, offer: id.slice(0, 40) } }),
    }).catch(() => undefined);
    waitUntil(task);
  } catch {
    /* counting must never decide the answer */
  }
}

/** Append the network's sub-id parameter, where the network has one. */
function withSub(url, net, slug) {
  const u = new URL(url);
  const sub = SUB_PREFIX + (slug || "site");
  if (net === "indoleads") u.searchParams.set("p1", sub);
  else if (net === "admitad") u.searchParams.set("subid", sub);
  return u.toString();
}

export async function onRequest({ request, params, waitUntil }) {
  const segs = Array.isArray(params.path) ? params.path : [params.path];
  const id = (segs.find((s) => s) || "").toLowerCase();
  const entry = Object.prototype.hasOwnProperty.call(MAP, id) ? MAP[id] : null;
  if (!entry) return new Response("Not found", { status: 404, headers: NOINDEX });
  const net = entry.n || "direct";
  const refuse = (_id, reason) => {
    count(waitUntil, id, net, reason);
    return new Response(null, { status: 204, headers: NOINDEX });
  };
  if (request.method !== "GET") return refuse(id, "method");

  const h = request.headers;
  const ua = h.get("user-agent") || "";
  const purpose = h.get("sec-purpose") || h.get("purpose") || "";
  const mode = h.get("sec-fetch-mode");
  const site = h.get("sec-fetch-site");
  const user = h.get("sec-fetch-user");

  // 1) bot / prefetch / non-navigation
  if (!/Mozilla/i.test(ua) || BOT_UA.test(ua)) return refuse(id, "bot-ua");
  if (/prefetch|prerender/i.test(purpose)) return refuse(id, "prefetch");
  if (mode && mode !== "navigate") return refuse(id, "mode");

  // 2) a Chromium UA with no Sec-Fetch-* at all is a spoofed UA
  const hasFetchMeta = mode !== null || site !== null || user !== null;
  if (/\bChrome\//.test(ua) && !hasFetchMeta) return refuse(id, "ua-mismatch");

  // Did the request come from one of our own pages?
  let sameHost = false;
  try {
    sameHost = new URL(h.get("referer") || "").host === new URL(request.url).host;
  } catch {
    /* no or garbage Referer */
  }
  const fromUs = site === "same-origin" || site === "same-site" || (site === null && sameHost);

  // 3) human gesture
  if (sendsUserHeader(ua)) {
    if (user !== "?1") return refuse(id, "no-user-gesture");
    if (!fromUs) return refuse(id, "not-from-us");
  } else if (!fromUs) {
    return refuse(id, "legacy-no-origin"); // old browser: soft path needs a same-origin hint
  }

  // 4) click-time token
  const sp = new URL(request.url).searchParams;
  const rawSlug = sp.get("s") || "";
  // The signed value is the raw slug; the sub-id gets a cleaned, truncated copy.
  const slug = rawSlug.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 48);
  const q = sp.get("q") || "";
  if (!goTokenValid(id, rawSlug, q, sp.get("t"), sp.get("k"))) return refuse(id, "no-token");

  let dest;
  if (entry.n === "amazon") {
    if (!q || q.length > 120) return refuse(id, "amazon-q");
    dest =
      "https://www.amazon.com/s?k=" + encodeURIComponent(q) +
      "&tag=" + AMAZON_TAG +
      "&ascsubtag=" + encodeURIComponent(SUB_PREFIX + (slug || "site"));
  } else {
    dest = withSub(entry.u, entry.n, slug);
  }
  count(waitUntil, id, net, "click");
  return new Response(null, { status: 302, headers: { Location: dest, ...NOINDEX } });
}
