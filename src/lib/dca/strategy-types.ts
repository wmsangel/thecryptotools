/**
 * Human descriptions of the DCA-grid strategy TYPES we run in the lab.
 *
 * A "type" is the entry filter that decides WHEN a new cycle may start — the
 * conceptual strategy, above the individual TP/SO/coverage variants. The /dca
 * hub renders these server-side (crawlable prose + links into the live tests of
 * each type), so the section doubles as the strategy explainer and as internal
 * linking into every strategy page.
 *
 * `lead` matches the start of a group's name (see strategyName() in labels.ts),
 * e.g. "Dip-buy (−12%) DCA grid" starts with "Dip-buy". Order here is the order
 * shown on the page.
 */
export interface StrategyType {
  /** Matches the beginning of StrategyGroup.name. */
  lead: string;
  /** Short id (anchor / analytics). */
  id: string;
  title: string;
  /** One-line positioning. */
  tagline: string;
  /** What the strategy actually does. */
  description: string;
  /** The market it's built for. */
  whenGood: string;
  /** The honest downside. */
  tradeoff: string;
}

export const strategyTypes: StrategyType[] = [
  {
    lead: "Classic",
    id: "classic",
    title: "Classic DCA grid",
    tagline: "Always-on base order + a safety-order ladder.",
    description:
      "The baseline. A cycle can start at any time: it opens a base order and lays a ladder of safety orders beneath it, averaging the entry down as price falls, then closes the whole cycle at a single take-profit just above the average price. There is no entry filter — it is always willing to start.",
    whenGood: "Choppy, range-bound markets where price keeps oscillating back and forth through the grid.",
    tradeoff:
      "In a deep, sustained downtrend it keeps averaging into a falling position — the drawdown is the real risk, not the win rate.",
  },
  {
    lead: "Trend-filter",
    id: "trend-filter",
    title: "Trend-filter DCA grid",
    tagline: "Only starts a cycle on the right side of the trend.",
    description:
      "Adds a moving-average gate: a new cycle starts only when price sits on the allowed side of its SMA — the point being to avoid opening a fresh grid straight into a falling knife.",
    whenGood: "Trending markets, where starting cycles at any moment is exactly what hurts a classic grid.",
    tradeoff:
      "Fewer entries: it sits out setups a classic grid would take, so it can lag in pure sideways chop.",
  },
  {
    lead: "Dip-buy",
    id: "dip-buy",
    title: "Dip-buy DCA grid",
    tagline: "Waits for a set percentage pullback before entering.",
    description:
      "Starts a cycle only after price drops a chosen percentage from a recent reference — buying weakness on purpose instead of at any moment. The deeper the required dip, the more selective (and rarer) the entries.",
    whenGood: "Volatile coins with frequent sharp pullbacks that tend to snap back.",
    tradeoff:
      "If the dip never comes it simply waits; if the dip keeps going, it is still a grid averaging down into it.",
  },
  {
    lead: "Bounce",
    id: "bounce",
    title: "Bounce DCA grid",
    tagline: "Enters only after price turns back up.",
    description:
      "Waits for evidence of a bounce — price turning up off a low — before starting, rather than catching the falling part of the move. It trades a slightly later entry for confirmation.",
    whenGood: "V-shaped recoveries, where waiting for the turn avoids the worst of the drop.",
    tradeoff: "A later entry captures less of the rebound, and false bounces still happen.",
  },
  {
    lead: "Volume-spike",
    id: "volume-spike",
    title: "Volume-spike DCA grid",
    tagline: "Starts a cycle on an unusual jump in volume.",
    description:
      "Uses a volume filter — a cycle begins when trading volume spikes above its norm, on the idea that big moves and reversals show up in volume first.",
    whenGood: "Event-driven moves, where a volume surge marks the start of a tradeable swing.",
    tradeoff: "Volume spikes fire in both directions — the filter times the entry, it does not pick the direction.",
  },
  {
    lead: "Time-filter",
    id: "time-filter",
    title: "Time-filter DCA grid",
    tagline: "Only active during chosen hours of the day.",
    description:
      "Restricts new cycles to certain times of day (for example, the quieter overnight hours), testing whether entry timing by the clock matters for a given coin.",
    whenGood: "Coins with a recurring intraday pattern worth leaning on.",
    tradeoff: "A blunt filter — the market does not watch the clock, so any edge is small and coin-specific.",
  },
  {
    lead: "Trailing",
    id: "trailing",
    title: "Trailing DCA grid",
    tagline: "A take-profit that follows the price up.",
    description:
      "Instead of a fixed take-profit, the exit trails price as it rises, trying to bank more of an extended move before the cycle closes.",
    whenGood: "Strong up-moves, where a fixed take-profit would cut the winner short.",
    tradeoff: "A trailing exit can give back part of the gain on a sharp pullback before it triggers.",
  },
  {
    lead: "Low-volatility",
    id: "low-volatility",
    title: "Low-volatility DCA grid",
    tagline: "Only starts a cycle when the market is calm.",
    description:
      "A quiet-market filter: a cycle begins only when volatility is low, aiming to start grids in stable conditions instead of opening into violent swings.",
    whenGood: "Range-bound, low-volatility stretches — the grid's home turf.",
    tradeoff: "It stays out of the high-volatility moves where the biggest (and riskiest) grid profits happen.",
  },
];
