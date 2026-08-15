import { sortedCoins } from "@/lib/coins/registry";
import { historyIndex } from "@/lib/backtest/history-index";

export interface PortfolioCoinOption {
  slug: string;
  name: string;
  symbol: string;
  color: string;
  /** First close we hold — the portfolio window can never start before it. */
  start: string;
}

/**
 * The assets that can go in a portfolio.
 *
 * Intersected with the history index rather than taken from the coin registry
 * alone: a coin with a page but no price file would offer itself in the picker
 * and then fail to load. Ordered by the registry (roughly market cap), so the
 * first few options are the ones most people are actually holding.
 *
 * A projection, not the `Coin` objects — the full registry carries prose and
 * fact tables for 62 assets that would otherwise be serialised into the HTML.
 */
export function portfolioCoinOptions(): PortfolioCoinOption[] {
  const starts = new Map(historyIndex.map((h) => [h.slug, h.start]));
  return sortedCoins()
    .filter((c) => starts.has(c.slug))
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      symbol: c.symbol,
      color: c.color,
      start: starts.get(c.slug) as string,
    }));
}

/** A named starting point, so the page is useful before anyone touches a control. */
export interface PortfolioPreset {
  id: string;
  label: string;
  /** What question this mix is here to answer. */
  note: string;
  allocations: { slug: string; weight: number }[];
}

/**
 * Presets chosen to disagree with each other.
 *
 * Each one is a claim someone actually makes — "just buy bitcoin", "the two big
 * ones", "spread it around" — so switching between them answers the question
 * the reader arrived with instead of demonstrating the control panel.
 */
export const PORTFOLIO_PRESETS: PortfolioPreset[] = [
  {
    id: "btc-only",
    label: "Bitcoin only",
    note: "The benchmark everything else has to beat.",
    allocations: [{ slug: "bitcoin", weight: 100 }],
  },
  {
    id: "btc-eth",
    label: "BTC + ETH 50/50",
    note: "The two assets most portfolios are really made of.",
    allocations: [
      { slug: "bitcoin", weight: 50 },
      { slug: "ethereum", weight: 50 },
    ],
  },
  {
    id: "core-satellite",
    label: "60 / 30 / 10",
    note: "A large core with one high-beta satellite.",
    allocations: [
      { slug: "bitcoin", weight: 60 },
      { slug: "ethereum", weight: 30 },
      { slug: "solana", weight: 10 },
    ],
  },
  {
    id: "spread",
    label: "Five, equally weighted",
    note: "The mix that feels diversified. Check whether it was.",
    allocations: [
      { slug: "bitcoin", weight: 20 },
      { slug: "ethereum", weight: 20 },
      { slug: "solana", weight: 20 },
      { slug: "xrp", weight: 20 },
      { slug: "cardano", weight: 20 },
    ],
  },
];
