import type { ToolConfig } from "../types";
import { fmtNumber, fmtUsd } from "@/lib/format";

// z-scores for the one-tailed confidence level.
const Z: Record<string, number> = { "90": 1.2816, "95": 1.6449, "99": 2.3263 };

const tool: ToolConfig = {
  slug: "value-at-risk-calculator",
  title: "Value at Risk (VaR) Calculator",
  description:
    "Estimate the most you should expect to lose on a crypto position over a given horizon, at a chosen confidence level, using the parametric (variance–covariance) method.",
  category: "portfolio",
  source: "builtin",
  updatedAt: "2026-07-25",
  seo: {
    keywords: [
      "value at risk calculator",
      "var calculator crypto",
      "parametric var calculator",
      "portfolio risk calculator",
      "value at risk formula",
      "crypto downside risk",
    ],
    description:
      "Free Value at Risk (VaR) calculator. Enter position value, daily volatility, confidence level and horizon to estimate your worst expected loss.",
  },
  inputs: [
    { name: "value", label: "Position value", type: "number", suffix: "USD", default: 10000, min: 0, step: 100 },
    { name: "vol", label: "Daily volatility (std dev)", type: "number", suffix: "%", default: 4, min: 0.01, step: 0.1, help: "Typical daily move. BTC ≈ 3–4%, alts higher." },
    {
      name: "conf",
      label: "Confidence level",
      type: "select",
      default: "95",
      options: [
        { label: "90%", value: "90" },
        { label: "95%", value: "95" },
        { label: "99%", value: "99" },
      ],
    },
    { name: "days", label: "Horizon", type: "number", suffix: "days", default: 1, min: 1, step: 1 },
  ],
  resultLabel: "Value at Risk",
  precision: 2,
  relatedSlugs: ["max-drawdown-calculator", "portfolio-volatility-calculator", "risk-of-ruin-calculator"],
  compute: (i) => {
    const value = Number(i.value);
    const vol = Number(i.vol) / 100;
    const z = Z[String(i.conf)] ?? 1.6449;
    const days = Math.max(1, Number(i.days));

    const horizonVol = vol * Math.sqrt(days);
    const varPct = z * horizonVol;
    const varUsd = value * varPct;

    return {
      value: fmtUsd(varUsd),
      note: `With ${i.conf}% confidence, a ${days}-day loss should not exceed this — but on the worst ${100 - Number(i.conf)}% of days it can be larger.`,
      breakdown: [
        { label: "VaR (% of position)", value: `${fmtNumber(varPct * 100)}%`, emphasis: true },
        { label: `Remaining value if hit`, value: fmtUsd(value - varUsd) },
        { label: "Horizon volatility", value: `${fmtNumber(horizonVol * 100)}%` },
        { label: "z-score used", value: fmtNumber(z, 4) },
      ],
    };
  },
  faq: [
    { q: "What is Value at Risk?", a: "VaR is a single number that answers: 'over this period, at this confidence level, how much could I lose?' A 1-day 95% VaR of $500 means that on 95% of days your loss should stay under $500." },
    { q: "Which method does this use?", a: "The parametric (variance–covariance) method: it assumes returns are roughly normal and scales daily volatility by the square root of time, then multiplies by the confidence z-score." },
    { q: "What are the limits of VaR?", a: "It says nothing about how bad the other 5% (or 1%) of days get, and crypto returns have fatter tails than a normal distribution — so real extreme losses can exceed VaR. Pair it with max drawdown and stress tests." },
    { q: "How do I find daily volatility?", a: "Use the standard deviation of daily returns over a recent window (30–90 days). Bitcoin often sits near 3–4% daily; smaller altcoins can be double that or more." },
  ],
};

export default tool;
