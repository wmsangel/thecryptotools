/**
 * ============================================================================
 * Spotlight — one rotating internal promo, our own pages only.
 * ============================================================================
 * A single banner at the top of the home page that features ONE of our own
 * tools, data pages or new features, rotating once a week. It is deliberately
 * separate from house-ads (which cross-promote the owner's OTHER sites): this is
 * for discovery of what is new here and for reviving strong-but-overlooked tools.
 *
 * The pick is a function of the week number, so every visitor in a given week
 * sees the same item and the internal link in the static HTML rotates weekly —
 * a small, honest freshness signal rather than a random-on-load flicker. The
 * page is a static export, so the week is resolved at BUILD time; the site
 * redeploys daily, so the banner advances to the new week's item on the first
 * build after the week turns over.
 *
 * To add or reorder: edit SPOTLIGHT. Keep the newest/most worth-surfacing items
 * in the list; order does not matter because every item gets an equal share of
 * weeks over a full rotation.
 */

export interface SpotlightItem {
  /** Internal destination. */
  href: string;
  /** Short chip, e.g. "🆕 New" or "🔥 Popular". */
  chip: string;
  /** Headline, split so one phrase can carry the brand gradient. */
  titlePre: string;
  titleGradient: string;
  titlePost?: string;
  /** One or two sentences. */
  blurb: string;
  /** Button label. */
  cta: string;
  /** Stable id for GA attribution (spotlight_click). */
  slug: string;
}

export const SPOTLIGHT: SpotlightItem[] = [
  {
    href: "/grid-trading-backtest",
    chip: "🆕 New",
    titlePre: "Would a ",
    titleGradient: "grid bot",
    titlePost: " have worked?",
    blurb:
      "Backtest a grid strategy against years of real prices — the profit it would have banked, and whether it actually beat just holding.",
    cta: "Run the backtest →",
    slug: "grid-trading-backtest",
  },
  {
    href: "/dca",
    chip: "🧪 Live",
    titlePre: "Live ",
    titleGradient: "DCA strategy lab",
    titlePost: " — real paper-trading results",
    blurb:
      "Watch automated dollar-cost-averaging bots trade live on real prices (paper mode) — ROI, drawdown, safety-order grids and every closed deal, updated continuously.",
    cta: "See it live →",
    slug: "dca-lab",
  },
  {
    href: "/fear-and-greed-index",
    chip: "😱 Market mood",
    titlePre: "The ",
    titleGradient: "Fear & Greed Index",
    titlePost: ", with 180 days of history",
    blurb:
      "Where market sentiment sits today, how it got here, and what the extremes have meant for price before — gauge, tiles and a full methodology.",
    cta: "Check the mood →",
    slug: "fear-greed",
  },
  {
    href: "/investment-calculator",
    chip: "⏳ Backtest",
    titlePre: "What if you had ",
    titleGradient: "invested?",
    blurb:
      "Replay a lump sum or a regular buy against real daily prices across 60+ coins — including every drawdown you would have had to sit through.",
    cta: "Try the backtest →",
    slug: "investment-calculator",
  },
  {
    href: "/bitcoin-rainbow-chart",
    chip: "🌈 Indicator",
    titlePre: "The ",
    titleGradient: "Bitcoin Rainbow Chart",
    titlePost: ", rebuilt from our own data",
    blurb:
      "A log-regression band chart showing where Bitcoin sits in its long-term cycle — built from 14 years of real closes, not a screenshot.",
    cta: "See the bands →",
    slug: "btc-rainbow",
  },
  {
    href: "/glossary",
    chip: "📖 Learn",
    titlePre: "The crypto ",
    titleGradient: "glossary",
    titlePost: " — 31 terms, plainly explained",
    blurb:
      "The words that trip people up — APY, liquidation, MEV, slippage, staking — each defined in a sentence, linked to the tool that uses it.",
    cta: "Open the glossary →",
    slug: "glossary",
  },
  {
    href: "/crypto-tax-report",
    chip: "🧾 Free",
    titlePre: "Turn a CSV into a ",
    titleGradient: "crypto tax report",
    blurb:
      "Drop in an exchange CSV and get a capital-gains report for 12 countries — the right cost-basis method applied, and nothing ever uploaded.",
    cta: "Build the report →",
    slug: "tax-report",
  },
  {
    href: "/pi-cycle-top-indicator",
    chip: "📈 Indicator",
    titlePre: "The ",
    titleGradient: "Pi Cycle Top",
    titlePost: " indicator, with every crossover",
    blurb:
      "The moving-average cross that has marked Bitcoin's cycle tops within days — drawn across the whole price history, not just the famous ones.",
    cta: "See the signal →",
    slug: "pi-cycle",
  },
  {
    href: "/unlocks",
    chip: "🔓 Tracker",
    titlePre: "Upcoming ",
    titleGradient: "token unlocks",
    titlePost: " — supply hitting the market",
    blurb:
      "Which projects are about to release locked tokens, how much, and what it is worth — the cliffs and vesting that move thinly-floated coins.",
    cta: "See the schedule →",
    slug: "unlocks",
  },
  {
    href: "/portfolio",
    chip: "📊 Analysis",
    titlePre: "Analyse your ",
    titleGradient: "crypto portfolio",
    blurb:
      "Paste your holdings and see allocation, correlation and the drawdowns your mix would have lived through — all computed in your browser.",
    cta: "Analyse it →",
    slug: "portfolio",
  },
];

/**
 * Continuous, Monday-aligned week index since a fixed Monday (2024-01-01), in
 * UTC. Continuous rather than ISO week-of-year so the rotation never collides at
 * the week 52/53 → 1 boundary — it just keeps advancing by one every Monday.
 */
export function weekIndex(now: Date = new Date()): number {
  const EPOCH = Date.UTC(2024, 0, 1); // a Monday
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.floor((today - EPOCH) / (7 * 86_400_000));
}

/** This week's spotlight item. Equal share of weeks per item over a rotation. */
export function currentSpotlight(now: Date = new Date()): SpotlightItem {
  const i = ((weekIndex(now) % SPOTLIGHT.length) + SPOTLIGHT.length) % SPOTLIGHT.length;
  return SPOTLIGHT[i];
}
