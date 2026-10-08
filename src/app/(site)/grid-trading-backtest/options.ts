import { sortedCoins } from "@/lib/coins/registry";
import { getHistoryMeta } from "@/lib/backtest/history-index";
import type { CoinOption } from "./GridBacktestApp";

/**
 * Only coins that actually have a price-history file — a grid backtest with no
 * series to replay is a dead end, so they never reach the picker. Projection,
 * not the full `Coin` objects, for the same payload reason as the investment
 * calculator's options.
 */
export function coinOptions(): CoinOption[] {
  return sortedCoins()
    .filter((c) => getHistoryMeta(c.slug))
    .map((c) => ({ slug: c.slug, name: c.name, symbol: c.symbol, color: c.color }));
}
