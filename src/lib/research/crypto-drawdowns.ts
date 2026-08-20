import { coinInsights } from "@/lib/backtest/insights";
import { historyThrough } from "@/lib/backtest/history-index";

/**
 * ============================================================================
 * "How deep do crypto crashes go?" — a citable drawdown study. SERVER ONLY.
 * ============================================================================
 * A second link-bait asset, built from the same daily closes the backtester
 * replays. It measures the one thing every "past performance" chart hides: how
 * far these assets have fallen from their peaks, how long the climb back took,
 * and how much of their life they have spent underwater.
 *
 * Reuses `coinInsights` unchanged — the module already resolves the worst
 * peak-to-trough episode, its recovery leg, the count of 50%+ crashes and the
 * share of days spent 20%+ below the running peak. Every figure is bounded by
 * the window we hold and dated; "the deepest fall" means the deepest in OUR
 * data, never all-time.
 */

/** The ten assets the study covers — same set as the correlation study. */
const STUDY_ASSETS = [
  "bitcoin", "ethereum", "xrp", "bnb", "solana",
  "dogecoin", "cardano", "chainlink", "litecoin", "polkadot",
];

export interface CoinDrawdown {
  symbol: string;
  slug: string;
  /** Worst peak-to-trough fall in the window, %. */
  depthPct: number;
  peakDate: string;
  troughDate: string;
  daysToTrough: number;
  /** Days from trough back to the old peak; null = never recovered in-window. */
  recoveryDays: number | null;
  recovered: boolean;
  /** How far below the window high the last close still sits, %. */
  belowHighPct: number;
  /** Share of days spent 20%+ below the running peak. */
  underwaterPct: number;
  /** Number of distinct 50%+ falls. */
  crashCount: number;
  years: number;
}

export interface DrawdownStudy {
  through: string;
  coins: CoinDrawdown[];
  count: number;
  avgWorstDepth: number;
  avgUnderwater: number;
  deepest: CoinDrawdown;
  /** Longest recovery among the assets whose worst crash DID recover. */
  longestRecovery: CoinDrawdown | null;
  /** Assets still below the peak their worst crash fell from. */
  neverRecovered: CoinDrawdown[];
  mostCrashes: CoinDrawdown;
  /** Deepest crash that a holder later saw fully recovered — the hope case. */
  recoveredExample: CoinDrawdown | null;
}

export function getDrawdownStudy(): DrawdownStudy | null {
  const coins: CoinDrawdown[] = [];
  for (const slug of STUDY_ASSETS) {
    const ci = coinInsights(slug);
    if (!ci) continue;
    coins.push({
      symbol: ci.symbol,
      slug,
      depthPct: ci.worst.depthPct,
      peakDate: ci.worst.peakDate,
      troughDate: ci.worst.troughDate,
      daysToTrough: ci.worst.daysToTrough,
      recoveryDays: ci.worst.daysToRecover,
      recovered: ci.worst.daysToRecover !== null,
      belowHighPct: ci.belowHighPct,
      underwaterPct: ci.underwaterPct,
      crashCount: ci.crashCount,
      years: ci.years,
    });
  }
  if (coins.length === 0) return null;

  coins.sort((a, b) => b.depthPct - a.depthPct);

  const avgWorstDepth = coins.reduce((s, c) => s + c.depthPct, 0) / coins.length;
  const avgUnderwater = coins.reduce((s, c) => s + c.underwaterPct, 0) / coins.length;
  const deepest = coins[0];
  const neverRecovered = coins.filter((c) => !c.recovered);
  const recoveredCoins = coins.filter((c) => c.recovered);
  const longestRecovery = recoveredCoins.length
    ? recoveredCoins.reduce((a, b) => ((b.recoveryDays ?? 0) > (a.recoveryDays ?? 0) ? b : a))
    : null;
  const recoveredExample = recoveredCoins.length
    ? recoveredCoins.reduce((a, b) => (b.depthPct > a.depthPct ? b : a))
    : null;
  const mostCrashes = coins.reduce((a, b) => (b.crashCount > a.crashCount ? b : a));

  return {
    through: historyThrough,
    coins,
    count: coins.length,
    avgWorstDepth,
    avgUnderwater,
    deepest,
    longestRecovery,
    neverRecovered,
    mostCrashes,
    recoveredExample,
  };
}
