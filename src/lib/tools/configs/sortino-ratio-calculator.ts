import type { ToolConfig } from "../types";
import { fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "sortino-ratio-calculator",
  title: "Sortino Ratio Calculator",
  description:
    "Score a portfolio's return against downside risk only. The Sortino ratio is like the Sharpe ratio but ignores upside volatility — a fairer measure for volatile crypto strategies.",
  category: "portfolio",
  source: "builtin",
  updatedAt: "2026-07-25",
  seo: {
    keywords: [
      "sortino ratio calculator",
      "sortino ratio crypto",
      "downside deviation calculator",
      "risk adjusted return calculator",
      "sortino vs sharpe",
      "sortino ratio formula",
    ],
    description:
      "Free Sortino ratio calculator. Enter annual return, risk-free rate and downside deviation to measure return per unit of harmful (downside) risk.",
  },
  inputs: [
    { name: "ret", label: "Annual return", type: "number", suffix: "%", default: 40, step: 0.1 },
    { name: "rf", label: "Risk-free rate", type: "number", suffix: "%", default: 4, step: 0.1, optional: true },
    { name: "dd", label: "Downside deviation", type: "number", suffix: "%", default: 35, min: 0.01, step: 0.1, help: "Std dev of negative returns only." },
  ],
  resultLabel: "Sortino ratio",
  precision: 2,
  relatedSlugs: ["sharpe-ratio-calculator", "max-drawdown-calculator", "portfolio-volatility-calculator"],
  compute: (i) => {
    const ret = Number(i.ret);
    const rf = Number(i.rf) || 0;
    const dd = Number(i.dd);

    const excess = ret - rf;
    const sortino = dd > 0 ? excess / dd : 0;

    const rating =
      sortino >= 3 ? "Excellent" :
      sortino >= 2 ? "Very good" :
      sortino >= 1 ? "Good" :
      sortino >= 0 ? "Sub-par" : "Poor (losing vs risk-free)";

    return {
      value: fmtNumber(sortino, 2),
      note: "Uses downside deviation only, so upside swings don't penalise the score. >2 is generally very good.",
      breakdown: [
        { label: "Rating", value: rating, emphasis: true },
        { label: "Excess return", value: `${fmtNumber(excess)}%` },
        { label: "Downside deviation", value: `${fmtNumber(dd)}%` },
      ],
    };
  },
  faq: [
    { q: "What is the Sortino ratio?", a: "It's (Return − Risk-free rate) divided by downside deviation. Unlike the Sharpe ratio, it only counts volatility from losing periods, so a strategy isn't punished for large gains." },
    { q: "How is it different from the Sharpe ratio?", a: "Sharpe divides by total volatility (up and down); Sortino divides only by downside volatility. Sortino is usually higher and is considered fairer for asymmetric or high-upside strategies." },
    { q: "What's a good Sortino ratio?", a: "Roughly: below 1 is weak, above 1 is good, above 2 is very good and above 3 is excellent. Because it ignores upside noise, thresholds run a little higher than Sharpe in practice." },
    { q: "Where do I get downside deviation?", a: "It's the standard deviation of only the negative (below-target) returns, annualized. Many portfolio trackers report it, or you can compute it from your return history." },
  ],
};

export default tool;
