import { getCoinToolPage } from "./pairs";

/**
 * ============================================================================
 * Curated internal links to the highest-opportunity coin calculators.
 * ============================================================================
 * Search Console (2026-08-17) shows a cluster of coin × profit-calculator pages
 * sitting at positions 12–30 with real impression volume — Solana profit at
 * ~12, Shiba Inu ~20, Dogecoin ~26 — i.e. one page of movement from their first
 * clicks. On-page content was already strengthened; the remaining on-site lever
 * is internal links from high-authority pages (the homepage, the sibling coin
 * pages) pointing at exactly these targets with descriptive anchors.
 *
 * This is a hand-picked list, not "every pair": a curated, genuinely useful set
 * of links concentrates relevance, where linking all 343 would dilute it and
 * read as boilerplate.
 */

/** [coin slug, tool/URL slug]. Ordered by opportunity, then coin prominence. */
const FEATURED: [string, string][] = [
  ["solana", "profit-calculator"],
  ["dogecoin", "profit-calculator"],
  ["shiba-inu", "profit-calculator"],
  ["bitcoin", "profit-calculator"],
  ["ethereum", "profit-calculator"],
  ["xrp", "profit-calculator"],
  ["cardano", "profit-calculator"],
  ["bnb", "profit-calculator"],
  ["bitcoin", "dca-calculator"],
  ["ethereum", "dca-calculator"],
  ["solana", "staking-calculator"],
  ["ethereum", "staking-calculator"],
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
