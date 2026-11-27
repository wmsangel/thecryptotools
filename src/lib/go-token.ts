/**
 * Click-time token for /go links (client + Pages Function, no server-only imports).
 *
 * Why: header checks (Sec-Fetch-User, Referer, UA) cannot tell a bot that replays
 * a STORED list of /go URLs through residential proxies from a person — it forges
 * every one of them (costtrek, 2026-11-26: 745 redirects from 742 IPs in 88
 * countries, none had loaded a page). Hiding the URL in markup does not help
 * either, the bot already has the list.
 *
 * So a bare /go URL is no longer enough. Pages render `href="#"` + `data-go`;
 * on a real (trusted) press our script builds `/go/<id>?s=…&t=<time>&k=<sig>`,
 * and the /go function refuses anything without a fresh, matching signature. A
 * stored URL — old format or a captured tokenized one — goes stale within minutes.
 *
 * This is an obstacle, not cryptography: the salt ships in the client bundle, so
 * a bot written specifically against this site could mint tokens by running or
 * reverse-engineering our script. It stops replay of harvested links.
 */
const SALT = "thecryptotools/go/v1/9d3f2a61c7b8";

/** How far the click timestamp may be from the server clock, in seconds. */
export const GO_TOKEN_TTL_S = 900;

function fnv1a(str: string, seed: number): number {
  let h = seed >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/**
 * Signature over (id, slug, query, time). `t` is the base-36 unix-seconds string;
 * `q` is the optional search text for links whose destination takes one (Amazon
 * search) — signed too, so a token can't be reused for another query.
 */
export function goSig(id: string, slug: string, t: string, q: string = ""): string {
  const s = `${SALT}|${id}|${slug}|${q}|${t}`;
  const r = s.split("").reverse().join("");
  return fnv1a(s, 0x811c9dc5).toString(36) + fnv1a(r, 0x9747b28c).toString(36);
}

/** The /go URL for a click happening now. Built in the browser, at click time. */
export function goUrl(
  id: string,
  slug?: string,
  q?: string,
  nowMs: number = Date.now(),
): string {
  const t = Math.floor(nowMs / 1000).toString(36);
  const p = new URLSearchParams();
  if (slug) p.set("s", slug);
  if (q) p.set("q", q);
  p.set("t", t);
  p.set("k", goSig(id, slug ?? "", t, q ?? ""));
  return `/go/${encodeURIComponent(id)}?${p.toString()}`;
}

/** Server side: is this (t, k) pair a fresh signature for this id + slug + query? */
export function goTokenValid(
  id: string,
  slug: string,
  q: string,
  t: string | null,
  k: string | null,
  nowMs: number = Date.now(),
): boolean {
  if (!t || !k || !/^[0-9a-z]{1,12}$/.test(t)) return false;
  const secs = parseInt(t, 36);
  if (!Number.isFinite(secs)) return false;
  if (Math.abs(nowMs / 1000 - secs) > GO_TOKEN_TTL_S) return false;
  return k === goSig(id, slug, t, q);
}
