import type { ToolConfig } from "../types";
import { fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "sharpe-ratio-calculator",
  updatedAt: "2026-07-15",
  title: "Sharpe Ratio Calculator",
  description:
    "Measure the risk-adjusted return of a portfolio or strategy with the Sharpe ratio, from annual return, risk-free rate and volatility.",
  category: "portfolio",
  source: "builtin",
  seo: {
    keywords: [
      "sharpe ratio calculator",
      "risk adjusted return calculator",
      "sharpe ratio crypto",
      "portfolio risk calculator",
      "sharpe ratio formula",
    ],
    description:
      "Free Sharpe ratio calculator. Enter annual return, risk-free rate and volatility to score a portfolio's risk-adjusted performance.",
  },
  inputs: [
    { name: "ret", label: "Annual return", type: "number", suffix: "%", default: 40, step: 0.1 },
    { name: "rf", label: "Risk-free rate", type: "number", suffix: "%", default: 4, step: 0.1, optional: true },
    { name: "vol", label: "Volatility (std dev)", type: "number", suffix: "%", default: 60, min: 0.01, step: 0.1 },
  ],
  resultLabel: "Sharpe ratio",
  precision: 2,
  compute: (i) => {
    const ret = Number(i.ret);
    const rf = Number(i.rf) || 0;
    const vol = Number(i.vol);

    const excess = ret - rf;
    const sharpe = vol > 0 ? excess / vol : 0;

    const rating =
      sharpe >= 3 ? "Excellent" :
      sharpe >= 2 ? "Very good" :
      sharpe >= 1 ? "Good" :
      sharpe >= 0 ? "Sub-par" : "Poor (losing vs risk-free)";

    return {
      value: fmtNumber(sharpe, 2),
      note: "As a rule of thumb: >1 is good, >2 is very good, >3 is excellent.",
      breakdown: [
        { label: "Rating", value: rating, emphasis: true },
        { label: "Excess return", value: `${fmtNumber(excess)}%` },
        { label: "Volatility", value: `${fmtNumber(vol)}%` },
      ],
    };
  },
  faq: [
    { q: "What is the Sharpe ratio?", a: "It's return earned above the risk-free rate, divided by volatility: (Return − Risk-free) / Std dev. Higher means you're getting more reward per unit of risk." },
    { q: "What's a good Sharpe ratio?", a: "Broadly: below 1 is sub-par, above 1 is good, above 2 is very good and above 3 is excellent. Crypto's high volatility often drags Sharpe ratios down." },
    { q: "Where do I get volatility?", a: "Use the annualized standard deviation of your returns. Many portfolio trackers and charting tools report it, or you can compute it from historical returns." },
  ],
};

export default tool;
