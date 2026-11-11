/**
 * Index control for the templated per-coin calculator pages.
 *
 * The /coins/<coin>/<tool> cluster is 378 near-structural-twin pages. On a young,
 * low-authority site Google crawls them all but only indexes the head (popular
 * coins); ~70% never show in search ("crawled, currently not indexed"). Pointing
 * crawl budget at the pages that actually have demand means telling Google not
 * to index the ones that have none.
 *
 * FIRST, CONSERVATIVE PASS (2026-11-11): only the coins with ZERO search demand
 * on BOTH engines — no Google impression on any of their pages in 180 days, and
 * no Bing query — are set noindex. Their /coins/<coin> hub page stays indexable,
 * so a coin re-enters the index the moment it earns demand; just drop it here.
 *
 * The larger, per-page sweep (noindex the demand-less tool combos of coins that
 * DO rank) needs per-page Bing impression data first, so it is NOT done here —
 * doing it blind would risk de-indexing a page that ranks on Bing, our live
 * click channel. `follow: true` is kept so link equity still flows onward.
 */

/** Coins with no Google-shown page (180d) and no Bing query. Reversible. */
export const NOINDEX_COINS = new Set<string>([
  "aerodrome-finance",
  "celestia",
  "eigenlayer",
  "ethena",
  "immutable",
  "injective",
  "ondo",
  "pendle",
  "pudgy-penguins",
  "thorchain",
  "virtuals-protocol",
]);

/** True when a per-coin calculator page should carry robots noindex. */
export function coinToolNoindex(coinSlug: string): boolean {
  return NOINDEX_COINS.has(coinSlug);
}
