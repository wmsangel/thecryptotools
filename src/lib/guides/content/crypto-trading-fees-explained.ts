import type { Guide } from "../types";

const guide: Guide = {
  slug: "crypto-trading-fees-explained",
  affiliate: "exchange",
  title: "Crypto Trading Fees Explained: The Silent Tax on Every Trade",
  description:
    "Maker, taker, spread, funding, withdrawal — fees come in more flavours than most traders realise, and they compound. Here's what each one is and how to stop them eating your returns.",
  readingMinutes: 6,
  updatedAt: "2026-07-25",
  seo: {
    keywords: [
      "crypto trading fees",
      "maker vs taker fees",
      "crypto exchange fees explained",
      "how to reduce trading fees",
      "trading fees crypto",
      "break even trading fees",
    ],
    description:
      "Crypto trading fees explained: maker vs taker, spread, funding and withdrawal fees, how they compound with active trading, and practical ways to pay less.",
  },
  relatedTools: ["trading-fee-calculator", "break-even-calculator", "crypto-arbitrage-calculator"],
  body: [
    { type: "p", text: "Fees feel trivial trade by trade — 0.1% here, 0.05% there. That's exactly why they're dangerous. They're charged whether you win or lose, they compound with every round trip, and an active trader can hand over a double-digit percentage of their capital in a year without ever noticing a single large charge. Understanding the fee menu is one of the cheapest edges in trading." },

    { type: "h2", text: "The fee types you're actually paying" },
    { type: "ul", items: [
      "Maker fee — charged when you add liquidity with a resting limit order. Usually the lowest; sometimes zero or even a rebate.",
      "Taker fee — charged when you remove liquidity with a market order that fills instantly. Typically higher than the maker fee.",
      "Spread — not a line item, but real: the gap between the best bid and ask. A wide spread on a thin coin is a hidden cost every time you cross it.",
      "Funding fee — on perpetual futures, a periodic payment between longs and shorts that you pay just for holding the position.",
      "Withdrawal / network fee — a flat cost to move coins off the exchange, independent of trade size.",
    ] },

    { type: "h2", text: "Maker vs taker: the difference that adds up" },
    { type: "p", text: "The maker/taker model exists to reward people who provide liquidity. Post a limit order that sits on the book and gets filled later — you're a maker, and you pay less. Hit the market to fill immediately — you're a taker, and you pay more. The gap looks tiny (say 0.02% vs 0.055%) but over hundreds of trades, patiently using limit orders instead of market orders can cut your fee bill by more than half." },
    { type: "callout", text: "A round trip costs you both sides. At 0.1% per side, you're down 0.2% the instant you enter and exit — so price has to move 0.2% in your favour before you've made a single cent." },
    { type: "tool", slug: "trading-fee-calculator" },

    { type: "h2", text: "Why fees punish overtrading so hard" },
    { type: "p", text: "Consider a trader doing 20 round trips a month at 0.1% per side on a $5,000 position. That's 0.2% × 20 = 4% of a position's value paid in fees every month — roughly 48% a year in fee turnover relative to that position size. Even a strategy with a genuine edge can be dragged underwater by that. This is the mathematical core of why scalping and hyperactive trading are so hard to make pay: the break-even bar rises with every extra trade." },
    { type: "tool", slug: "break-even-calculator" },

    { type: "h2", text: "How to pay less" },
    { type: "ul", items: [
      "Prefer limit (maker) orders over market (taker) orders whenever you're not in a hurry.",
      "Hold the exchange's native token if it grants a fee discount, and climb VIP volume tiers if you trade seriously.",
      "Trade less. Fewer, higher-conviction trades beat many marginal ones once fees are counted.",
      "Batch withdrawals instead of moving small amounts repeatedly — the flat network fee hurts most on tiny transfers.",
      "Compare spot vs futures fees; they differ, and futures add funding costs on top.",
    ] },

    { type: "h2", text: "The bottom line" },
    { type: "p", text: "Fees are the one cost you can control precisely. You can't force a trade to win, but you can choose to be a maker instead of a taker, to trade less often, and to know your break-even move before you click. Do the arithmetic once, and the case for patience and lower turnover makes itself." },
  ],
  faq: [
    { q: "What's the difference between maker and taker fees?", a: "You pay a maker fee when your limit order rests on the order book and adds liquidity, and a taker fee when your order fills immediately and removes liquidity. Maker fees are usually lower." },
    { q: "How much do trading fees really cost?", a: "At 0.1% per side, one round trip costs 0.2% of position size. Repeat that dozens of times a month and fees quietly consume a large share of your capital, win or lose." },
    { q: "What is the break-even move for fees?", a: "It's the price change needed just to cover your fees. For a 0.1% round-trip fee, price must move at least 0.2% in your favour before you profit." },
    { q: "How can I reduce my crypto trading fees?", a: "Use limit (maker) orders, hold the exchange's token for a discount, reach higher volume tiers, trade less often, and avoid frequent small withdrawals that trigger flat network fees." },
  ],
};

export default guide;
