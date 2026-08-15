import { coins } from "@/lib/coins/registry";
import { historyIndex } from "@/lib/backtest/history-index";
import type { AssetMap } from "@/lib/harvest/pricing";

/**
 * Ticker → what is needed to price it.
 *
 * Built on the server and handed to the client as a plain object. Importing
 * the coin registry into the browser bundle instead would ship two thousand
 * lines of page copy for the sake of 60-odd ticker symbols, which is the same
 * reason /exchanges keeps its registry server-side.
 */
export function harvestAssetMap(): AssetMap {
  const historyBySymbol = new Map(historyIndex.map((h) => [h.symbol.toUpperCase(), h.slug]));
  const map: AssetMap = {};

  for (const coin of coins) {
    const symbol = coin.symbol.toUpperCase();
    // First entry wins: the registry is ordered by prominence, so a duplicate
    // ticker resolves to the coin people actually mean.
    if (map[symbol]) continue;
    map[symbol] = {
      coingeckoId: coin.coingeckoId,
      historySlug: historyBySymbol.get(symbol),
    };
  }
  return map;
}

/** How many assets this page can value without being told a price. */
export function pricedAssetCount(): number {
  return Object.keys(harvestAssetMap()).length;
}
