import type { Guide } from "../types";

const guide: Guide = {
  slug: "position-sizing-and-kelly-criterion",
  title: "Position Sizing & the Kelly Criterion for Crypto Traders",
  description:
    "How much should you risk per trade? Learn fixed-fractional sizing, the Kelly Criterion, and why half-Kelly is the practical sweet spot.",
  readingMinutes: 8,
  updatedAt: "2026-07-16",
  seo: {
    keywords: [
      "position sizing crypto",
      "kelly criterion trading",
      "how much to risk per trade",
      "risk management crypto trading",
      "optimal position size",
    ],
    description:
      "Learn position sizing for crypto trading: fixed-fractional risk, the Kelly Criterion formula, half-Kelly, and how to avoid risk of ruin.",
  },
  relatedTools: ["kelly-criterion-calculator", "position-size-calculator", "risk-of-ruin-calculator", "trade-expectancy-calculator"],
  body: [
    { type: "p", text: "Most traders obsess over entries and exits, but position sizing — how much you put on each trade — has a bigger impact on long-term results. Size too big and a losing streak wipes you out; size too small and even a great strategy barely grows your account." },

    { type: "h2", text: "Fixed-fractional risk" },
    { type: "p", text: "The simplest professional approach is to risk a fixed small percentage of your account on every trade — commonly 1% or 2%. Your position size then follows from your stop-loss distance:" },
    { type: "ul", items: [
      "Position size = (Account × Risk %) ÷ (Entry − Stop distance)",
      "Risking 1% of a $10,000 account with a 5% stop means a $2,000 position.",
    ] },
    { type: "p", text: "This keeps every loss small and survivable, no matter how confident you feel about a setup." },
    { type: "tool", slug: "position-size-calculator" },

    { type: "h2", text: "The Kelly Criterion" },
    { type: "p", text: "The Kelly Criterion answers a deeper question: given your edge, what fraction of your capital maximizes long-term growth? The formula is:" },
    { type: "callout", text: "Kelly fraction f = W − (1 − W) / R  —  where W is your win probability and R is your average win divided by average loss." },
    { type: "p", text: "For example, with a 55% win rate and a 2:1 reward-to-risk ratio: f = 0.55 − 0.45/2 = 0.325, or 32.5% of capital. That's the growth-maximizing bet — but it's also wildly aggressive." },

    { type: "h2", text: "Why half-Kelly?" },
    { type: "p", text: "Full Kelly gives the fastest theoretical growth, but with brutal drawdowns and extreme sensitivity to your inputs. If you overestimate your edge even slightly, full Kelly can bankrupt you. Most practitioners use half-Kelly, which captures roughly three-quarters of the growth with far less volatility." },
    { type: "tool", slug: "kelly-criterion-calculator" },

    { type: "h2", text: "Don't forget risk of ruin" },
    { type: "p", text: "Even a profitable strategy can blow up if you bet too big, because losing streaks are inevitable. Risk of ruin is the probability that a bad run drags your account below a threshold you'd consider game over. Cutting your risk per trade is the most reliable way to bring it down." },
    { type: "ul", items: [
      "Keep per-trade risk small (1–2%) so no streak can ruin you.",
      "Make sure your strategy has positive expectancy before sizing up.",
      "Prefer half-Kelly or less over full Kelly in the real world.",
    ] },
    { type: "tool", slug: "risk-of-ruin-calculator" },
  ],
  faq: [
    { q: "How much should I risk per trade?", a: "A common professional guideline is 1–2% of your account per trade. This keeps individual losses small enough that no realistic losing streak can wipe you out." },
    { q: "Is the Kelly Criterion safe to use directly?", a: "Full Kelly is very aggressive and sensitive to input errors. Most traders use half-Kelly or less, which keeps most of the growth with much smaller drawdowns." },
    { q: "What's the link between position sizing and risk of ruin?", a: "Smaller position sizes lower your risk of ruin. Even a winning strategy can go broke if bets are too large relative to the account, because losing streaks are unavoidable." },
  ],
};

export default guide;
