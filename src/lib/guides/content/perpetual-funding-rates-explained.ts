import type { Guide } from "../types";

const guide: Guide = {
  slug: "perpetual-funding-rates-explained",
  affiliate: "derivatives",
  title: "Perpetual Funding Rates Explained",
  description:
    "Funding is the payment that keeps perpetual futures pinned to spot. Learn how it is charged, what it costs a held position, and how traders read it as sentiment.",
  readingMinutes: 6,
  updatedAt: "2026-07-19",
  seo: {
    keywords: [
      "funding rate explained",
      "perpetual futures funding",
      "what is funding rate crypto",
      "funding rate calculator",
      "cash and carry crypto",
      "negative funding rate",
    ],
    description:
      "How perpetual swap funding rates work: who pays whom, how often, what it costs to hold a leveraged position, and how to read funding as a sentiment indicator.",
  },
  relatedTools: ["funding-rate-calculator", "futures-pnl-calculator", "leverage-calculator"],
  body: [
    { type: "p", text: "A perpetual future has no expiry date, so nothing forces its price to converge with spot. Funding is the mechanism that does that job: a periodic payment between longs and shorts that makes the crowded side pay the other." },

    { type: "h2", text: "Who pays whom" },
    { type: "ul", items: [
      "Positive funding — the perp trades above spot, so longs pay shorts. This is the normal state in a bull market.",
      "Negative funding — the perp trades below spot, so shorts pay longs. Typical after a capitulation or during heavy hedging.",
      "The exchange takes nothing: funding is trader-to-trader, settled directly between positions.",
    ] },
    { type: "p", text: "Most venues settle every 8 hours (00:00, 08:00, 16:00 UTC); some use 1-hour or 4-hour intervals. You only pay if you hold a position at the settlement timestamp — being flat through it costs nothing, and closing one minute before avoids the charge entirely." },

    { type: "h2", text: "What it actually costs" },
    { type: "p", text: "Funding is charged on your position's notional value, not on your margin. That distinction is what surprises leveraged traders." },
    { type: "p", text: "Take a 0.01% funding rate — the exchange default and superficially trivial. On a $50,000 position that is $5 per settlement, $15 a day, roughly $450 a month. If your margin is $5,000 at 10x, you are paying about 9% of your capital a month simply to keep the position open." },
    { type: "callout", text: "0.01% per 8 hours is about 10.95% annualised. In heated markets funding hits 0.1% or higher per settlement — over 100% annualised. At that point the trade has to work quickly or not at all." },
    { type: "tool", slug: "funding-rate-calculator" },

    { type: "h2", text: "Reading funding as sentiment" },
    { type: "p", text: "Because funding measures how badly one side wants exposure, it is one of the cleanest positioning indicators in crypto — no on-chain analysis required." },
    { type: "ul", items: [
      "Persistently high positive funding means leveraged longs are crowded. Those positions are fuel for a long squeeze: one sharp drop cascades into liquidations that accelerate the drop.",
      "Deeply negative funding means shorts are crowded and paying to stay short — the setup for a short squeeze.",
      "Funding near zero with rising open interest suggests balanced, healthier participation.",
    ] },
    { type: "p", text: "Treat it as context, not a trigger. Funding can stay extreme for weeks in a strong trend, and 'funding is too high, I'll short' has ended a lot of accounts. Use it to size positions and time entries, not as a standalone signal." },

    { type: "h2", text: "Earning funding instead of paying it" },
    { type: "p", text: "The cash-and-carry trade harvests funding directly: buy the asset on spot, short the same size in perps. You are market-neutral — price moves cancel out — and you collect funding for as long as it stays positive." },
    { type: "p", text: "It is not free money. You carry exchange counterparty risk on both legs, funding can flip negative and start costing you, and the short leg still needs margin management if price rips upward. Institutional desks run this at scale precisely because those risks require real infrastructure." },
    { type: "tool", slug: "futures-pnl-calculator" },

    { type: "h2", text: "Practical rules" },
    { type: "ul", items: [
      "Before opening a multi-day position, annualise the current funding and add it to your cost basis. It often changes whether the trade is worth taking.",
      "For very short-term trades, check when the next settlement falls — you can frequently avoid a payment entirely.",
      "Funding rates differ across exchanges. If you hold size, the venue with the friendlier rate is worth the transfer.",
      "Rising funding plus rising open interest plus a stalling price is a classic pre-squeeze configuration. Reduce size rather than fight it.",
    ] },
  ],
  faq: [
    { q: "Is funding a fee I pay to the exchange?", a: "No. It is paid between traders — longs to shorts or the reverse. The exchange only calculates and settles it." },
    { q: "How do I avoid paying funding?", a: "Do not hold a position through the settlement timestamp, trade on the side receiving funding, or use dated futures instead of perpetuals, which have no funding mechanism." },
    { q: "Can funding alone liquidate me?", a: "Yes, indirectly. Payments are deducted from your margin, so a position that survives on a thin buffer can be pushed to liquidation by accumulated funding even without a price move." },
    { q: "What is a normal funding rate?", a: "Around 0.01% per 8 hours is the common baseline (~11% annualised). Anything sustained above 0.05% signals unusually crowded leverage." },
  ],
};

export default guide;
