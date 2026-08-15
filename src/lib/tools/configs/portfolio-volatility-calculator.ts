import type { ToolConfig } from "../types";
import { fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "portfolio-volatility-calculator",
  updatedAt: "2026-07-30",
  title: "Two-Asset Portfolio Volatility Calculator",
  description:
    "See how combining two assets changes overall risk. Enter weights, volatilities and correlation to get portfolio volatility and the diversification benefit.",
  category: "portfolio",
  source: "builtin",
  seo: {
    keywords: [
      "portfolio volatility calculator",
      "diversification calculator",
      "portfolio risk calculator",
      "two asset portfolio volatility",
      "correlation risk calculator",
    ],
    description:
      "Free portfolio volatility calculator. Combine two assets with weights, volatilities and correlation to measure risk and diversification.",
  },
  inputs: [
    { name: "weightA", label: "Asset A weight", type: "number", suffix: "%", default: 60, min: 0, max: 100, step: 1 },
    { name: "volA", label: "Asset A volatility", type: "number", suffix: "%", default: 80, min: 0, step: 0.1 },
    { name: "volB", label: "Asset B volatility", type: "number", suffix: "%", default: 40, min: 0, step: 0.1 },
    { name: "corr", label: "Correlation (A vs B)", type: "number", default: 0.3, min: -1, max: 1, step: 0.05, help: "-1 = opposite, 0 = unrelated, 1 = identical." },
  ],
  resultLabel: "Portfolio volatility",
  compute: (i) => {
    const wA = Number(i.weightA) / 100;
    const wB = 1 - wA;
    const sA = Number(i.volA) / 100;
    const sB = Number(i.volB) / 100;
    const rho = Math.max(-1, Math.min(1, Number(i.corr)));

    const variance = wA * wA * sA * sA + wB * wB * sB * sB + 2 * wA * wB * sA * sB * rho;
    const volP = Math.sqrt(Math.max(0, variance)) * 100;
    const weightedAvg = (wA * sA + wB * sB) * 100;
    const benefit = Math.max(0, weightedAvg - volP);

    return {
      value: `${fmtNumber(volP)}%`,
      note: "The lower the correlation, the more risk cancels out — that's the diversification benefit.",
      breakdown: [
        { label: "Asset B weight", value: `${fmtNumber(wB * 100, 0)}%` },
        { label: "Weighted-average volatility", value: `${fmtNumber(weightedAvg)}%` },
        { label: "Diversification benefit", value: `-${fmtNumber(benefit)}%`, emphasis: true },
      ],
    };
  },
  faq: [
    { q: "Why isn't portfolio risk just the average of the two?", a: "Because assets don't move in lockstep. Unless they're perfectly correlated, some moves offset, so combined volatility is lower than the weighted average." },
    { q: "What is correlation?", a: "A number from −1 to +1 measuring how two assets move together. +1 is identical movement, 0 is unrelated, −1 is exact opposites — which cancels the most risk." },
    { q: "How does this help me?", a: "It shows the value of diversification: pairing assets with low or negative correlation lowers overall volatility without necessarily lowering expected return." },
  ],
};

export default tool;
