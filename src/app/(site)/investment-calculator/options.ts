import { sortedCoins } from "@/lib/coins/registry";
import type { CoinOption } from "./BacktestApp";

/**
 * The coin list handed to the client component.
 *
 * Deliberately a projection rather than the `Coin` objects themselves: the full
 * registry carries intro prose, fact tables and staking copy for 62 assets,
 * all of which would be serialised into the HTML of every page that renders the
 * picker. Four fields per coin is a few kilobytes; the whole registry is not.
 */
export function coinOptions(): CoinOption[] {
  return sortedCoins().map((c) => ({
    slug: c.slug,
    name: c.name,
    symbol: c.symbol,
    color: c.color,
  }));
}
