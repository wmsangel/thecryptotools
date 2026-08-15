import type { Guide } from "../types";

const guide: Guide = {
  slug: "understanding-crypto-leverage",
  title: "Understanding Leverage in Crypto Trading",
  description:
    "Leverage multiplies your position, your profit, your loss and your chance of being liquidated. Here is exactly what 10x does to your account — and how traders survive it.",
  readingMinutes: 7,
  updatedAt: "2026-07-19",
  seo: {
    keywords: [
      "crypto leverage explained",
      "what is 10x leverage",
      "margin trading crypto",
      "isolated vs cross margin",
      "leverage calculator",
      "how leverage works",
    ],
    description:
      "Leverage in crypto explained: margin, liquidation, isolated vs cross margin, and why the leverage number matters less than your position size.",
  },
  relatedTools: [
    "leverage-calculator",
    "liquidation-calculator",
    "position-size-calculator",
    "futures-pnl-calculator",
  ],
  body: [
    { type: "p", text: "Leverage lets you control a position larger than your account. Put up $1,000 as margin at 10x and you are trading $10,000 of Bitcoin. Every 1% move in BTC now moves your account by 10%. That is the entire mechanism — the rest is consequences." },

    { type: "h2", text: "The three numbers that matter" },
    { type: "ul", items: [
      "Position size (notional) — margin × leverage. This is what actually determines your profit and loss in dollars.",
      "Initial margin — what you post to open. At 10x that is 10% of the notional; at 100x, 1%.",
      "Maintenance margin — the floor. Drop below it and the exchange liquidates you to protect itself. It rises as your position grows, through 'margin tiers' most traders never read.",
    ] },
    { type: "tool", slug: "leverage-calculator" },

    { type: "h2", text: "How far can price move before you are liquidated?" },
    { type: "p", text: "The rough rule: your liquidation is roughly 1/leverage away from entry, minus the maintenance-margin buffer. At 10x, about a 10% adverse move wipes you out. At 25x it is 4%. At 100x it is 1% — and Bitcoin moves 1% while you make coffee." },
    { type: "callout", text: "At 100x, the exchange fee to open and close your position alone eats a meaningful share of the distance to your liquidation price. You are not trading the market at that point; you are paying for a lottery ticket." },
    { type: "p", text: "One critical detail: exchanges liquidate on the mark price (an index of several spot markets), not the last traded price on their own book. This exists to stop a single wick from mass-liquidating traders — but it also means your position can be closed at a price you never saw on the chart." },
    { type: "tool", slug: "liquidation-calculator" },

    { type: "h2", text: "Isolated vs cross margin" },
    { type: "p", text: "Isolated margin ring-fences a fixed amount to one position. If it liquidates, you lose that margin and nothing else. Cross margin uses your whole balance as collateral, so positions are harder to liquidate — but one bad trade can take the entire account with it." },
    { type: "p", text: "Start with isolated. Cross margin is a tool for hedged books and experienced position managers, not for a directional bet you feel strongly about." },

    { type: "h2", text: "The mistake almost everyone makes" },
    { type: "p", text: "Traders pick a leverage number first and then size the position. That is backwards. Decide how many dollars you are willing to lose if your stop is hit — 1% of the account is a common answer — then work back to position size from your stop distance. Leverage is just whatever multiple that arithmetic produces." },
    { type: "p", text: "Framed that way, 10x with a tight 1% stop can risk less real money than 2x with a 15% stop. The leverage number on the screen tells you almost nothing on its own; the distance to your stop and the size of your position tell you everything." },
    { type: "tool", slug: "position-size-calculator" },

    { type: "h2", text: "The recurring costs" },
    { type: "ul", items: [
      "Trading fees are charged on the notional, not your margin — a 0.05% taker fee on a 10x position is 0.5% of your margin per side.",
      "Funding is paid every 8 hours (typically) between longs and shorts on perpetuals. Holding a crowded long through a hot market can quietly bleed several percent a week.",
      "Slippage widens exactly when you need out most — during the volatility that threatens your liquidation.",
    ] },
    { type: "tool", slug: "futures-pnl-calculator" },

    { type: "h2", text: "Practical rules" },
    { type: "ul", items: [
      "Never place a stop-loss beyond your liquidation price — the exchange will close you first and your stop becomes decoration.",
      "Size so that a liquidation would cost you at most a few percent of the account, then a bad day is survivable.",
      "Add margin to defend a position only if the original thesis is still intact. Otherwise you are averaging into a loss with borrowed money.",
      "Beware volatility clusters: leverage that felt fine in a quiet week becomes fatal in a CPI print or an exchange outage.",
    ] },
  ],
  faq: [
    { q: "What does 10x leverage actually mean?", a: "Your position is 10 times your posted margin. A 1% move in the asset changes your margin balance by roughly 10%, and an adverse move of about 10% liquidates you." },
    { q: "Can I lose more than I deposited?", a: "On most major exchanges, no — liquidation and insurance funds close you out first. In extreme gap moves a negative balance can occur, which some venues claw back through auto-deleveraging of profitable traders." },
    { q: "Is lower leverage always safer?", a: "Only if the position size falls with it. Lower leverage on a much bigger position is not safer. Risk lives in position size and stop distance, not the leverage multiplier." },
    { q: "Why was I liquidated when price never hit my liquidation level?", a: "Liquidations trigger on the mark price — an index across exchanges — not the last trade on your venue's chart. Check the mark-price chart, not the candle chart." },
  ],
};

export default guide;
