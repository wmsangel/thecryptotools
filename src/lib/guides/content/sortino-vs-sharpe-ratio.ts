import type { Guide } from "../types";

const guide: Guide = {
  slug: "sortino-vs-sharpe-ratio",
  title: "Sortino vs Sharpe Ratio: Which Measures Crypto Risk Better?",
  description:
    "The Sharpe ratio punishes all volatility; the Sortino ratio punishes only losses. For high-upside, high-volatility crypto strategies that difference changes the verdict.",
  readingMinutes: 6,
  updatedAt: "2026-07-25",
  seo: {
    keywords: [
      "sortino vs sharpe",
      "sortino ratio vs sharpe ratio",
      "risk adjusted return crypto",
      "downside deviation",
      "sortino ratio explained",
      "which is better sortino or sharpe",
    ],
    description:
      "Sortino vs Sharpe ratio explained: how each treats volatility, why Sortino suits asymmetric crypto strategies, and how to read and calculate both.",
  },
  relatedTools: ["sortino-ratio-calculator", "sharpe-ratio-calculator", "portfolio-volatility-calculator"],
  body: [
    { type: "p", text: "Two portfolios can both return 40% a year and be wildly different investments — one grinds up steadily, the other lurches between +30% months and −25% months. Raw return can't tell them apart. Risk-adjusted return ratios can, by dividing the reward by the risk taken to earn it. The Sharpe and Sortino ratios are the two most common, and they disagree in a way that matters a lot for crypto." },

    { type: "h2", text: "The Sharpe ratio: reward per unit of total volatility" },
    { type: "p", text: "Sharpe takes your return above the risk-free rate and divides it by total volatility — the standard deviation of all your returns, up and down alike. Formula: (Return − Risk-free) ÷ Standard deviation. A higher Sharpe means more return for each unit of wobble. The rough scale: above 1 is good, above 2 is very good, above 3 is excellent." },
    { type: "callout", text: "The quiet flaw: Sharpe treats a huge up month as 'risk' exactly like a huge down month. A strategy that occasionally rockets higher is penalised for it — even though nobody complains about upside." },
    { type: "tool", slug: "sharpe-ratio-calculator" },

    { type: "h2", text: "The Sortino ratio: reward per unit of downside" },
    { type: "p", text: "Sortino fixes that asymmetry. It uses the same numerator — return above a target — but divides by downside deviation, the standard deviation of only the negative returns. Upside swings no longer count against you. Because the denominator is smaller, Sortino is almost always higher than Sharpe, and the gap between the two tells you how lopsided your returns are." },
    { type: "tool", slug: "sortino-ratio-calculator" },

    { type: "h2", text: "Why the difference matters in crypto" },
    { type: "p", text: "Crypto returns are famously asymmetric: long stretches of chop punctuated by explosive rallies. A trend-following or long-biased crypto strategy can post a mediocre Sharpe purely because its big winning months inflate total volatility. Judge the same strategy on Sortino and it can look excellent, because those winning months don't get counted as risk. When a strategy has genuine positive skew, Sortino is the fairer scorecard." },
    { type: "ul", items: [
      "Use Sharpe when returns are roughly symmetric and you want the classic, widely-comparable benchmark.",
      "Use Sortino when returns are skewed or the strategy has capped downside and open-ended upside (options buying, trend following, venture-style bets).",
      "Read them together: a large Sortino-minus-Sharpe gap signals that most of your volatility is upside — usually a good thing.",
    ] },

    { type: "h2", text: "What neither ratio tells you" },
    { type: "p", text: "Both assume volatility is a good proxy for risk and lean on a normal-distribution view of returns. Crypto has fat tails — rare, savage crashes that a standard deviation understates. Neither ratio captures the depth or duration of a specific drawdown, or the risk of total loss from a hack, depeg or exchange failure. Treat them as one lens among several, not a verdict." },
  ],
  faq: [
    { q: "Is a higher Sortino ratio always better?", a: "Higher is better for a given strategy, but don't compare Sortino across very different return profiles blindly. And because Sortino ignores upside volatility, it can flatter a strategy whose downside simply hasn't shown up yet." },
    { q: "Why is my Sortino ratio higher than my Sharpe ratio?", a: "Because Sortino divides by downside deviation only, which is smaller than total volatility. The bigger the gap, the more of your volatility comes from gains rather than losses." },
    { q: "What's a good Sortino ratio?", a: "As a rough guide, above 1 is good, above 2 is very good and above 3 is excellent — slightly higher thresholds than Sharpe because it ignores upside noise." },
    { q: "Which should I use for a crypto portfolio?", a: "Look at both. Sortino usually reflects a long-biased or trend-following crypto strategy more fairly, but Sharpe remains the common benchmark others will quote, so knowing both lets you compare like-for-like." },
  ],
};

export default guide;
