import { buildCorrelation, CORRELATION_WINDOWS } from "@/lib/portfolio/build-data";
import { historyThrough } from "@/lib/backtest/history-index";
import { coinInsights } from "@/lib/backtest/insights";
import type { CorrelationMatrix } from "@/lib/portfolio/types";

/**
 * ============================================================================
 * "How correlated is the crypto market?" — a citable data study. SERVER ONLY.
 * ============================================================================
 * A link-bait asset built from data we already compute: the pairwise
 * correlation of the ten largest crypto assets, plus the diversification ceiling
 * that correlation implies, plus supporting volatility and drawdown extremes.
 * Every number is derived here from our own daily closes so the page can be
 * quoted and cited — the whole point is to be worth linking to.
 *
 * This is the REPORT. /portfolio/correlation/ is the interactive TOOL over the
 * same numbers; they cross-link and must not become the same page — this one
 * leads with findings, methodology and a citation, and carries the √ρ ceiling
 * maths the tool does not.
 */

/** The ten assets the study covers, largest first. */
export const STUDY_ASSETS = [
  "bitcoin", "ethereum", "xrp", "bnb", "solana",
  "dogecoin", "cardano", "chainlink", "litecoin", "polkadot",
];

export interface StudyWindow {
  label: string;
  average: number;
  highest: { a: string; b: string; value: number } | null;
  lowest: { a: string; b: string; value: number } | null;
  from: string;
  to: string;
  days: number;
  assetCount: number;
}

export interface CorrelationStudy {
  through: string;
  windows: StudyWindow[];
  /** The 1-year matrix, for the heatmap. */
  headlineMatrix: CorrelationMatrix;
  /** 1-year average pairwise correlation — the headline number. */
  rho: number;
  assetCount: number;
  /** Volatility cut from an equal split of 10 such assets, %. */
  tenAssetReductionPct: number;
  /** The floor: most volatility diversification can ever remove at this rho, %. */
  ceilingReductionPct: number;
  /** What 10 assets would achieve if they were uncorrelated, %. */
  uncorrelatedReductionPct: number;
  mostVolatile: { symbol: string; vol: number };
  leastVolatile: { symbol: string; vol: number };
  deepestCrash: { symbol: string; depthPct: number; from: string; to: string };
}

/** Volatility ratio of N equal-weight assets vs one, given pairwise ρ. */
function volRatio(n: number, rho: number): number {
  return Math.sqrt(1 / n + (1 - 1 / n) * rho);
}

export function getCorrelationStudy(): CorrelationStudy | null {
  const tables = CORRELATION_WINDOWS.map((w) => buildCorrelation(STUDY_ASSETS, historyThrough, w)).filter(
    (t): t is NonNullable<typeof t> => t !== null,
  );
  if (tables.length === 0) return null;

  const windows: StudyWindow[] = tables.map(({ window, matrix }) => ({
    label: window.label,
    average: matrix.average,
    highest: matrix.highest,
    lowest: matrix.lowest,
    from: matrix.from,
    to: matrix.to,
    days: matrix.days,
    assetCount: matrix.symbols.length,
  }));

  const headline = tables[0];
  const rho = headline.matrix.average;
  const n = headline.matrix.symbols.length;

  // Volatility and drawdown extremes across the same assets.
  const insights = STUDY_ASSETS.map((slug) => coinInsights(slug)).filter(
    (x): x is NonNullable<typeof x> => x !== null,
  );
  const byVol = [...insights].sort((a, b) => b.volatilityPct - a.volatilityPct);
  const byCrash = [...insights].sort((a, b) => b.worst.depthPct - a.worst.depthPct);
  const most = byVol[0];
  const least = byVol[byVol.length - 1];
  const crash = byCrash[0];

  return {
    through: historyThrough,
    windows,
    headlineMatrix: headline.matrix,
    rho,
    assetCount: n,
    tenAssetReductionPct: (1 - volRatio(n, rho)) * 100,
    ceilingReductionPct: (1 - Math.sqrt(rho)) * 100,
    uncorrelatedReductionPct: (1 - volRatio(n, 0)) * 100,
    mostVolatile: { symbol: most.symbol, vol: most.volatilityPct },
    leastVolatile: { symbol: least.symbol, vol: least.volatilityPct },
    deepestCrash: {
      symbol: crash.symbol,
      depthPct: crash.worst.depthPct,
      from: crash.worst.peakDate,
      to: crash.worst.troughDate,
    },
  };
}
