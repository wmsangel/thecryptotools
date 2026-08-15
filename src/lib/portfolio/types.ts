/**
 * ============================================================================
 * Portfolio analytics — several coins at once, replayed against real prices.
 * ============================================================================
 * The single-asset backtest in `src/lib/backtest/` answers "what if I had bought
 * this". This module answers the questions that only appear once you hold more
 * than one thing: did the mix help, did rebalancing pay for itself, and were the
 * assets ever actually different from each other.
 *
 * Those are exactly the numbers competitors put behind a subscription, and they
 * are computable from the price history this site already ships. Everything here
 * runs in the visitor's browser on files served from our own domain.
 *
 * Two honesty rules the whole module is built around:
 *
 * 1. **The window is the intersection, never the union.** Adding a coin that
 *    launched in 2024 to a portfolio starting in 2018 does not give you a 2018
 *    portfolio — it gives you a 2024 one. The window is clamped to the latest
 *    start among the selected assets and the caller is told which asset did the
 *    clamping, so the page can say so instead of quietly answering a different
 *    question.
 *
 * 2. **Contributions are stripped out before any risk figure.** Paying money in
 *    raises the portfolio's value without that being a return. Volatility,
 *    Sharpe and the growth rate are therefore all computed on a time-weighted
 *    index, not on the dollar balance. Drawdown is the deliberate exception —
 *    see `worstDrawdown`.
 */

import type { PriceHistory } from "@/lib/backtest/types";

export type { PriceHistory };

/** How often the mix is dragged back to its target weights. */
export type RebalanceFrequency = "none" | "monthly" | "quarterly" | "yearly";

export interface Allocation {
  slug: string;
  /** Target share of the portfolio, in percent. The set is normalised to 100. */
  weight: number;
}

export interface PortfolioInput {
  allocations: Allocation[];
  /** Invested on day one. */
  initial: number;
  /** Added every month after that. 0 turns contributions off. */
  monthlyContribution: number;
  /** ISO date. Clamped forward to the latest start among the assets. */
  from: string;
  /** ISO date. Clamped back to the earliest end among the assets. */
  to: string;
  rebalance: RebalanceFrequency;
  /**
   * Annual risk-free rate in percent, used only for the Sharpe ratio.
   *
   * An input rather than a constant because the honest answer changes with it:
   * at 0% every long crypto backtest looks like skill, and at 5% a good many of
   * them stop clearing cash. The page states the number it used.
   */
  riskFreeRate: number;
}

/** One day of the portfolio. */
export interface PortfolioPoint {
  day: number;
  date: string;
  /** Fiat paid in up to and including this day. */
  invested: number;
  /** Market value of the holdings. */
  value: number;
  /**
   * Time-weighted index, starting at 100 — the value of one unit of the
   * strategy, with the effect of paying money in removed.
   */
  index: number;
}

/** What one asset did inside the portfolio over the window. */
export interface AssetOutcome {
  slug: string;
  symbol: string;
  /** Target weight after normalisation, in percent. */
  targetWeight: number;
  /** Share of the portfolio it actually ended up being, in percent. */
  finalWeight: number;
  /** Its own price return over the window, in percent. */
  priceReturn: number;
  /** Its own annualised volatility, in percent. */
  volatility: number;
  /** Fiat value of this holding at the end. */
  finalValue: number;
  /**
   * How many dollars of the portfolio's profit came from this asset.
   *
   * Under rebalancing this is not simply "final value minus what you put in":
   * money moves between assets at every rebalance date, so each asset's
   * contribution is accumulated day by day from its own gain.
   */
  profitContribution: number;
}

export interface RiskMetrics {
  /** Annualised standard deviation of daily returns, in percent. */
  volatility: number;
  /** Annualised time-weighted growth rate, in percent. */
  cagr: number;
  /** (cagr − risk-free) ÷ volatility. Null when volatility is zero. */
  sharpe: number | null;
  /** Same, counting only downside deviation. Null when there is no downside. */
  sortino: number | null;
  best: { date: string; pct: number };
  worst: { date: string; pct: number };
}

export interface PortfolioResult {
  input: PortfolioInput;
  /** The dates actually used after clamping to the common window. */
  actualFrom: string;
  actualTo: string;
  /** Set when `from` was earlier than the assets allowed. */
  clamped: boolean;
  /** Which asset forced the later start — the one to drop to go back further. */
  limitedBy: { slug: string; symbol: string; start: string } | null;

  totalInvested: number;
  finalValue: number;
  profit: number;
  /** Simple return on the money paid in, in percent. */
  roi: number;
  /** Money-weighted annualised return, in percent. Null when undefined. */
  moneyWeighted: number | null;

  risk: RiskMetrics;
  /**
   * Deepest peak-to-trough fall in the DOLLAR balance, not in the index.
   *
   * This is the one figure deliberately left on the balance rather than the
   * time-weighted index, because it is the only one the investor experiences
   * directly: what matters is how far the number on the screen fell, and money
   * paid in during a crash genuinely did soften it.
   */
  worstDrawdown: { from: string; to: string; pct: number };

  assets: AssetOutcome[];
  series: PortfolioPoint[];
}

/** One row of the "did rebalancing help?" table. */
export interface RebalanceComparison {
  frequency: RebalanceFrequency;
  finalValue: number;
  cagr: number;
  volatility: number;
  maxDrawdown: number;
  sharpe: number | null;
  /** Number of times the mix was actually reset. */
  events: number;
}

export interface CorrelationMatrix {
  /** Symbols in row/column order. */
  symbols: string[];
  slugs: string[];
  /** `values[i][j]` = Pearson correlation of daily returns. Diagonal is 1. */
  values: number[][];
  /** Window the correlations were measured over. */
  from: string;
  to: string;
  /** Trading days used. */
  days: number;
  /** Mean of the off-diagonal entries. */
  average: number;
  /** Least and most correlated distinct pair. */
  lowest: { a: string; b: string; value: number } | null;
  highest: { a: string; b: string; value: number } | null;
}

/**
 * How much the mix actually damped the ride.
 *
 * The weighted average of the individual volatilities is what you would get if
 * the assets moved in perfect lockstep. The portfolio's real volatility is
 * lower by exactly the amount that they did not — so the gap is the whole of
 * what diversification bought, expressed in the only unit anyone feels.
 */
export interface DiversificationScore {
  /** Portfolio's annualised volatility, in percent. */
  portfolioVolatility: number;
  /** Weighted mean of the assets' own annualised volatilities, in percent. */
  weightedAverageVolatility: number;
  /** Percent reduction of the first against the second. */
  benefit: number;
  /** Mean pairwise correlation of the holdings. */
  averageCorrelation: number;
}