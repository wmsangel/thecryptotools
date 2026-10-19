import { getCoinToolPage } from "./pairs";

/**
 * ============================================================================
 * Curated internal links to the highest-opportunity coin calculators.
 * ============================================================================
 * The on-site lever is internal links from high-authority pages (the homepage,
 * the sibling coin pages) pointing at exactly these targets with descriptive
 * anchors. On-page content is already strong; this concentrates relevance.
 *
 * Refreshed 2026-10-19 from Bing Webmaster data (our real click channel): a
 * cluster of coin calculators sits at positions 5–9 — one push from the top.
 * The list now leads with those: Hedera profit (~9) and staking (~8), Stellar
 * profit ("xlm calculator" ~8), Dogecoin profit (~8), Cardano staking, and
 * Solana ("crypto calculator for solana" ~6). Majors follow for breadth.
 *
 * This is a hand-picked list, not "every pair": a curated set concentrates
 * relevance, where linking all 343 would dilute it and read as boilerplate.
 */

/** [coin slug, tool/URL slug]. Ordered by opportunity, then coin prominence.
 *  The homepage renders the first 12 (featuredCoinCalculators), so order here
 *  decides which get homepage link juice. */
const FEATURED: [string, string][] = [
  // Fresh Bing opportunities (pos 5–9) — the first push target.
  ["solana", "profit-calculator"],
  ["hedera", "profit-calculator"],
  ["hedera", "staking-calculator"],
  ["stellar", "profit-calculator"],
  ["dogecoin", "profit-calculator"],
  ["cardano", "staking-calculator"],
  ["solana", "staking-calculator"],
  ["ethereum", "staking-calculator"],
  // Majors for breadth and sustained impression volume.
  ["bitcoin", "profit-calculator"],
  ["ethereum", "profit-calculator"],
  ["shiba-inu", "profit-calculator"],
  ["cardano", "profit-calculator"],
  ["xrp", "profit-calculator"],
  ["bnb", "profit-calculator"],
];

/** Coins used to cross-link the same tool across popular assets. */
const POPULAR_COINS = ["bitcoin", "ethereum", "solana", "xrp", "dogecoin", "cardano", "bnb", "shiba-inu"];

export interface CoinCalcLink {
  href: string;
  title: string;
  slug: string;
  name: string;
  symbol: string;
  color: string;
  tagline: string;
}

function resolve(coinSlug: string, toolSlug: string): CoinCalcLink | null {
  const page = getCoinToolPage(coinSlug, toolSlug);
  if (!page) return null;
  const { coin, spec } = page;
  return {
    href: `/coins/${coin.slug}/${spec.slug}`,
    title: spec.title(coin),
    slug: coin.slug,
    name: coin.name,
    symbol: coin.symbol,
    color: coin.color,
    tagline: spec.description(coin),
  };
}

/** The curated list for the homepage, filtered to pages that actually exist. */
export function featuredCoinCalculators(limit = 12): CoinCalcLink[] {
  const out: CoinCalcLink[] = [];
  for (const [coinSlug, toolSlug] of FEATURED) {
    const link = resolve(coinSlug, toolSlug);
    if (link) out.push(link);
    if (out.length >= limit) break;
  }
  return out;
}

/**
 * The same tool for other popular coins — used to cross-link the coin×tool
 * cluster. Excludes the current coin.
 */
export function popularCoinsForTool(toolSlug: string, excludeSlug: string, limit = 6): CoinCalcLink[] {
  const out: CoinCalcLink[] = [];
  for (const coinSlug of POPULAR_COINS) {
    if (coinSlug === excludeSlug) continue;
    const link = resolve(coinSlug, toolSlug);
    if (link) out.push(link);
    if (out.length >= limit) break;
  }
  return out;
}
