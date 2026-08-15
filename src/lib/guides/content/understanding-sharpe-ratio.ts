import type { Guide } from "../types";

const guide: Guide = {
  slug: "understanding-sharpe-ratio",
  title: "The Sharpe Ratio Explained: Measuring Risk-Adjusted Returns",
  description:
    "What the Sharpe ratio is, how to calculate it, what a good value looks like, and why volatile crypto portfolios often score lower than you'd expect.",
  readingMinutes: 6,
  updatedAt: "2026-07-16",
  seo: {
    keywords: [
      "sharpe ratio explained",
      "what is a good sharpe ratio",
      "risk adjusted return",
      "sharpe ratio crypto",
      "how to calculate sharpe ratio",
    ],
    description:
      "The Sharpe ratio explained simply: the formula, what counts as a good value, and how to use it to compare crypto portfolios and strategies.",
  },
  relatedTools: ["sharpe-ratio-calculator", "max-drawdown-calculator", "portfolio-volatility-calculator", "monte-carlo-portfolio-calculator"],
  body: [
    { type: "p", text: "A big return means little if you took enormous risk to get it. The Sharpe ratio, developed by Nobel laureate William Sharpe, measures how much return you earned for each unit of risk — letting you compare very different strategies on a level playing field." },

    { type: "h2", text: "The Sharpe ratio formula" },
    { type: "callout", text: "Sharpe ratio = (Portfolio return − Risk-free rate) ÷ Volatility (standard deviation of returns)" },
    { type: "p", text: "The numerator is your excess return — what you earned above a safe asset like Treasury bills. The denominator is volatility, a measure of how much your returns bounce around. A higher Sharpe means more reward per unit of risk." },

    { type: "h2", text: "What's a good Sharpe ratio?" },
    { type: "ul", items: [
      "Below 1: sub-par — you're not being well compensated for the risk.",
      "1 to 2: good.",
      "2 to 3: very good.",
      "Above 3: excellent.",
    ] },
    { type: "p", text: "These are rough industry benchmarks. Context matters — a strategy's Sharpe should be compared to alternatives over the same period." },
    { type: "tool", slug: "sharpe-ratio-calculator" },

    { type: "h2", text: "Why crypto portfolios often score lower" },
    { type: "p", text: "Crypto's returns can be spectacular, but its volatility is enormous — often 60–80% annualized versus ~15% for stocks. Because volatility sits in the denominator, that huge swing drags the Sharpe ratio down even when returns are high. A crypto portfolio and a stock portfolio with the same Sharpe are, in a risk-adjusted sense, comparable." },

    { type: "h2", text: "Limitations to keep in mind" },
    { type: "ul", items: [
      "The Sharpe ratio treats upside and downside volatility the same, even though investors only fear downside. The Sortino ratio addresses this.",
      "It assumes returns are roughly normally distributed, which crypto's fat tails violate.",
      "Pair it with maximum drawdown to understand the worst-case pain, not just the average risk.",
    ] },
    { type: "tool", slug: "max-drawdown-calculator" },
  ],
  faq: [
    { q: "What is a good Sharpe ratio?", a: "As a rough guide: below 1 is sub-par, above 1 is good, above 2 is very good, and above 3 is excellent. Always compare against alternative strategies over the same period." },
    { q: "Why is my crypto Sharpe ratio low despite big gains?", a: "Crypto's very high volatility sits in the denominator of the formula, so even large returns get divided by a big risk number, pulling the ratio down." },
    { q: "What's the difference between Sharpe and Sortino?", a: "The Sharpe ratio uses total volatility, penalizing upside and downside equally. The Sortino ratio only counts downside volatility, which better reflects the risk investors actually care about." },
  ],
};

export default guide;
