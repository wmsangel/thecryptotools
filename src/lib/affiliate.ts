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
  // partner. A bare utm_source is NOT enough — that is not a referral by itself.
  return /(?:[?&/](?:ref|r|invite|join|via|aff|fpr|partner)=?)|invite\.|\/join\/|referral/i.test(url);
}

export function earningExchanges(): Platform[] {
  return platforms.filter((p) => p.category === "exchange" && isReferralLink(p.url));
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
};

/** Earning partners to feature for a guide's declared affiliate kind. */
export function partnersForGuide(kind: GuideAffiliateKind, limit = 3): Platform[] {
  if (kind === "exchange") return exchangesForContext("spot", limit);
  if (kind === "derivatives") return exchangesForContext("derivatives", limit);
  const cat = CATEGORY_FOR[kind];
  return platforms.filter((p) => p.category === cat && isReferralLink(p.url)).slice(0, limit);
}

/** Heading + CTA verb per kind, for the guide affiliate block. */
export const GUIDE_AFFILIATE_COPY: Record<GuideAffiliateKind, { heading: string; verb: string }> = {
  exchange: { heading: "Where to buy or trade", verb: "Trade on" },
  derivatives: { heading: "Where to trade this", verb: "Trade on" },
  wallet: { heading: "Where to store it safely", verb: "Get a" },
  tax: { heading: "Do it without the spreadsheet", verb: "Try" },
  bot: { heading: "Automate the strategy", verb: "Start with" },
};
