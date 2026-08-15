import type { Guide } from "../types";

const guide: Guide = {
  slug: "drawdown-and-risk-of-ruin",
  title: "Drawdown and Risk of Ruin: The Maths of Staying in the Game",
  description:
    "Why a 50% loss needs a 100% gain to recover, how long losing streaks really get, and how to size trades so a bad run cannot end you.",
  readingMinutes: 7,
  updatedAt: "2026-07-19",
  seo: {
    keywords: [
      "maximum drawdown",
      "risk of ruin",
      "drawdown recovery",
      "losing streak probability",
      "trading risk management",
      "position sizing risk",
    ],
    description:
      "Maximum drawdown and risk of ruin explained: the asymmetry of recovery, how long losing streaks get, and the position sizing that keeps you solvent.",
  },
  relatedTools: [
    "max-drawdown-calculator",
    "risk-of-ruin-calculator",
    "trade-expectancy-calculator",
    "position-size-calculator",
  ],
  body: [
    { type: "p", text: "Most traders track returns. The number that actually decides whether they are still trading in two years is drawdown — how far the account falls from its peak before it recovers." },

    { type: "h2", text: "The recovery asymmetry" },
    { type: "p", text: "Losses and gains are not symmetric. Lose 10% and you need 11.1% to get back. Lose 50% and you need 100%. Lose 80% and you need 400% — a five-fold return simply to break even." },
    { type: "ul", items: [
      "−10% → +11% to recover",
      "−25% → +33% to recover",
      "−50% → +100% to recover",
      "−75% → +300% to recover",
      "−90% → +900% to recover",
    ] },
    { type: "callout", text: "This is why capital preservation beats return chasing. Avoiding one catastrophic drawdown is usually worth more than several good years of extra performance." },
    { type: "tool", slug: "max-drawdown-calculator" },

    { type: "h2", text: "Losing streaks are longer than you think" },
    { type: "p", text: "With a 50% win rate, the chance of eight consecutive losses in any given eight trades is about 1 in 256. That sounds remote — until you take 500 trades a year, at which point a streak of eight or worse is close to certain to appear." },
    { type: "p", text: "Assume it will happen and check your sizing against it. Risk 2% per trade and eight losses cost about 15% of the account: unpleasant, survivable. Risk 10% per trade and the same streak takes 57% — you now need to double the account just to get back to flat, and you will be doing it while shaken." },

    { type: "h2", text: "Risk of ruin" },
    { type: "p", text: "Risk of ruin is the probability that your account falls below the point where you can keep trading, given your win rate, your reward-to-risk ratio and your position size. It combines edge and sizing into one number." },
    { type: "p", text: "The result is often counterintuitive: a strategy with a genuine positive edge can still have a near-100% chance of ruin if it is sized too aggressively. Edge tells you where you end up in the long run; sizing decides whether you survive long enough to get there." },
    { type: "tool", slug: "risk-of-ruin-calculator" },

    { type: "h2", text: "Edge first, then size" },
    { type: "p", text: "Before sizing anything, confirm you have positive expectancy: (win rate × average win) − (loss rate × average loss). If that number is negative, no position size saves you — smaller sizing only slows the bleed." },
    { type: "p", text: "A 40% win rate is perfectly viable with a 3:1 reward-to-risk ratio (expectancy +0.6R per trade). A 70% win rate is a losing system at 0.3:1. Win rate in isolation is a vanity metric." },
    { type: "tool", slug: "trade-expectancy-calculator" },

    { type: "h2", text: "Practical limits" },
    { type: "ul", items: [
      "Risk 1–2% of the account per trade. Professionals live at the bottom of that range; the traders who blow up live above it.",
      "Cap total open risk across correlated positions. Five long alt positions are one leveraged bet on Bitcoin, not five independent trades.",
      "Set a monthly drawdown circuit breaker — for example, stop trading at −10% for the month. It converts an emotional spiral into a hard rule.",
      "Cut size after a drawdown, not after a winning streak. Trading a smaller account with the same dollar risk quietly raises your percentage risk exactly when you can least afford it.",
    ] },
    { type: "tool", slug: "position-size-calculator" },

    { type: "h2", text: "Judging a strategy by its drawdown" },
    { type: "p", text: "When comparing systems or backtests, look past total return to maximum drawdown, how long the recovery took, and whether you could realistically have held through it. A backtest showing 300% a year with a 70% drawdown is unusable by a human being — you would have abandoned it at the bottom, which is when its returns were being generated." },
  ],
  faq: [
    { q: "What is a good maximum drawdown?", a: "For a discretionary retail trader, keeping peak-to-trough below 20% is a reasonable target. Beyond 30% the psychological pressure alone tends to degrade decision quality." },
    { q: "How is risk of ruin different from maximum drawdown?", a: "Drawdown is a measured historical fact about what already happened. Risk of ruin is a forward-looking probability that your edge and sizing lead to an account you cannot trade from." },
    { q: "Does a stop-loss eliminate risk of ruin?", a: "It bounds the loss on each trade, which is essential, but ruin comes from accumulated losses across a streak. Sizing, not the stop itself, determines the outcome." },
    { q: "Should I risk more when I am confident?", a: "Only within a pre-defined range, and only if your confidence has a measurable historical edge behind it. Discretionary size increases are the most common route from a good month to a ruinous one." },
  ],
};

export default guide;
