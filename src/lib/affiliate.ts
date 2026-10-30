import { platforms, type Platform, type PlatformCategoryId } from "./platforms";

/**
 * ============================================================================
 * Exchange picker for the on-page "Trade on X" affiliate CTAs.
 * ============================================================================
 * Single source of truth is platforms.ts. We only ever feature an exchange in a
 * call-to-action when its `url` is a REAL referral link — a plain homepage earns
 * nothing and would just send our commercial traffic away for free. The moment
 * you add a referral link for another exchange in platforms.ts, it becomes
 * eligible here automatically; until then it stays on /exchanges only.
 *
 * Order is by product fit (a liquidation calculator should point at a venue with
 * a serious derivatives engine), NOT a paid placement — the site takes no money
 * to rank a platform, and these CTAs are disclosed partner links, nofollow.
 */

/** A homepage URL earns nothing; a referral link has an id/invite/ref in it. */
export function isReferralLink(url: string): boolean {
  // Common affiliate params/paths across networks: ref/r (many), invite/join
  // (exchanges), via (Rewardful/Koinly), aff (generic), fpr (FirstPromoter),
  // partner, atid (Cryptohopper), subid (Impact/Sovrn redirectors). Also whole
  // referral hosts/paths with no tell-tale query param: refr.cc (Trezor's
  // ReferralCandy), promote.mexc.com/b/ (MEXC), and the owner's own click-
  // tracker hosts that cloak an approved offer behind a short code (add new
  // tracker domains/paths here).
  return /(?:[?&/](?:ref|r|invite|join|via|aff|fpr|partner|atid|subid)=?)|invite\.|\/join\/|referral|refr\.cc|promote\.mexc\.com\/b\/|o10o\.xyz|i05o\.xyz|gettracker\.net/i.test(url);
}

export function earningExchanges(): Platform[] {
  return platforms.filter((p) => p.category === "exchange" && isReferralLink(p.url));
}

/**
 * How to link a platform. A platform whose `url` is a real referral link is a
 * disclosed partner: route it through the tracked `/go/<slug>` redirect
 * (rel="sponsored"). A platform with no referral link earns us nothing, so it
 * is NOT a partner — link its site directly (no `/go`, no "sponsored", no perk
 * line), so we never fire an empty redirect or imply a deal we don't have.
 */
export function platformLink(p: Platform): { href: string; sponsored: boolean } {
  return isReferralLink(p.url)
    ? { href: `/go/${p.slug}`, sponsored: true }
    : { href: p.url, sponsored: false };
}

/**
 * Exchanges we earn from AND that actually serve the visitor's country. Most of
 * our venues (Binance.com, Bybit, OKX, KuCoin, MEXC, Gate, HTX, Bitfinex,
 * Bitget) block or restrict US residents, and our Crypto.com offer excludes the
 * US (forbidden GEO in the cabinet) — so a US visitor sent to Binance is a dead
 * click. Kraken serves the US and pays us, so it leads for US; everyone else
 * gets the normal product-fit order.
 */
const US_UNAVAILABLE = new Set([
  "binance", "bybit", "okx", "kucoin", "mexc", "gate-io", "htx", "bitfinex", "bitget", "crypto-com",
]);
export function exchangesForCountry(country: string | null, limit = 3): Platform[] {
  if (country === "US") {
    const usOk = earningExchanges().filter((p) => !US_UNAVAILABLE.has(p.slug));
    if (usOk.length) return usOk.slice(0, limit);
  }
  return exchangesForContext("spot", limit);
}

export type TradeContext = "derivatives" | "spot";

// Preferred order per context, by product strength. Slugs not listed fall to the
// back but are still shown if they earn.
const ORDER: Record<TradeContext, string[]> = {
  derivatives: ["bybit", "okx", "binance", "bitget", "kraken"],
  spot: ["binance", "okx", "kraken", "coinbase", "bybit"],
};

export function exchangesForContext(context: TradeContext = "spot", limit = 3): Platform[] {
  const order = ORDER[context];
  const rank = (p: Platform) => {
    const i = order.indexOf(p.slug);
    return i < 0 ? order.length + 1 : i;
  };
  return [...earningExchanges()].sort((a, b) => rank(a) - rank(b)).slice(0, limit);
}

/** Tools whose users are trading leverage — point them at a derivatives venue. */
const DERIVATIVES_TOOLS = new Set([
  "liquidation-calculator",
  "leverage-calculator",
  "futures-pnl-calculator",
  "funding-rate-calculator",
  "position-size-calculator",
  "risk-reward-calculator",
  "stop-loss-take-profit-calculator",
  "max-drawdown-calculator",
  "risk-of-ruin-calculator",
]);

export function tradeContextForTool(slug: string): TradeContext {
  return DERIVATIVES_TOOLS.has(slug) ? "derivatives" : "spot";
}

/**
 * Affiliate context a GUIDE can declare (seed-phrase guide → hardware wallet,
 * tax guide → tax software, …). Defined in @/lib/guides/types so the isolated
 * guides compile stays self-contained; re-exported here for convenience.
 */
export type { GuideAffiliateKind } from "@/lib/guides/types";
import type { GuideAffiliateKind } from "@/lib/guides/types";

const CATEGORY_FOR: Record<Exclude<GuideAffiliateKind, "exchange" | "derivatives">, PlatformCategoryId> = {
  wallet: "wallet",
  tax: "tax",
  bot: "trading",
  card: "earn",
};

/**
 * Where a grid/DCA calculator user actually runs the strategy: an exchange with
 * a free, built-in grid/DCA bot. No third-party API keys, no subscription — the
 * exchange earns on the trades, and so do we on the referral. Ordered by bot
 * quality + fit for the calculators that declare `affiliate: "bot"`. A dedicated
 * third-party platform (3Commas/Cryptohopper) is a subscription product and a
 * worse fit for this CTA, so it stays on /exchanges rather than here.
 */
const BOT_VENUES = ["bitget", "bybit", "binance", "okx", "kucoin"];

export function botPartners(limit = 3): Platform[] {
  return BOT_VENUES.map((slug) => platforms.find((p) => p.slug === slug))
    .filter((p): p is Platform => !!p && isReferralLink(p.url))
    .slice(0, limit);
}

/** Earning partners to feature for a guide's declared affiliate kind. */
export function partnersForGuide(kind: GuideAffiliateKind, limit = 3): Platform[] {
  if (kind === "exchange") return exchangesForContext("spot", limit);
  if (kind === "derivatives") return exchangesForContext("derivatives", limit);
  if (kind === "bot") return botPartners(limit);
  const cat = CATEGORY_FOR[kind];
  return platforms.filter((p) => p.category === cat && isReferralLink(p.url)).slice(0, limit);
}

/**
 * Heading + CTA verb per kind, for the guide affiliate block. An optional
 * `blurb` overrides the per-partner `bonus` line when the kind needs framing the
 * individual platform text cannot carry (e.g. the bot CTA explaining why these
 * exchanges are the right place to run the strategy).
 */
export const GUIDE_AFFILIATE_COPY: Record<
  GuideAffiliateKind,
  { heading: string; verb: string; blurb?: string }
> = {
  exchange: { heading: "Where to buy or trade", verb: "Trade on" },
  derivatives: { heading: "Where to trade this", verb: "Trade on" },
  wallet: { heading: "Where to store it safely", verb: "Get a" },
  tax: { heading: "Do it without the spreadsheet", verb: "Try" },
  bot: {
    heading: "Run it on a free built-in bot",
    verb: "Start with",
    blurb:
      "These exchanges run a grid or DCA strategy on a free, built-in bot — no third-party API keys and no subscription. You keep custody of your funds; the exchange earns from the trades, not from you.",
  },
  card: { heading: "Where to spend your crypto", verb: "Get the" },
};
