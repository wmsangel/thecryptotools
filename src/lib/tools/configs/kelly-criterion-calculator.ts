import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "kelly-criterion-calculator",
  updatedAt: "2026-07-31",
  title: "Kelly Criterion Calculator",
  description:
    "Find the mathematically optimal position size from your win rate and win/loss ratio using the Kelly Criterion — with a safer half-Kelly.",
  category: "trading",
  source: "builtin",
  seo: {
    keywords: [
      "kelly criterion calculator",
      "position sizing calculator",
      "optimal bet size",
      "kelly formula",
      "risk management calculator crypto",
    ],
    description:
      "Free Kelly Criterion calculator for traders. Enter win rate and payoff ratio to get the optimal and half-Kelly stake size.",
  },
  inputs: [
    { name: "winRate", label: "Win rate", type: "number", suffix: "%", default: 55, min: 0, max: 100, step: 1 },
    { name: "ratio", label: "Win / loss ratio", type: "number", suffix: ": 1", default: 2, min: 0.01, step: 0.1, help: "Average win divided by average loss." },
    { name: "bankroll", label: "Account size", type: "number", suffix: "USD", default: 10000, min: 0, step: 1, optional: true },
  ],
  resultLabel: "Optimal stake (Kelly)",
  compute: (i) => {
    const w = Number(i.winRate) / 100;
    const r = Number(i.ratio);
    const bankroll = Number(i.bankroll) || 0;

    // Kelly fraction: f = W - (1 - W) / R
    const fRaw = r > 0 ? w - (1 - w) / r : 0;
    const f = Math.max(0, fRaw);
    const half = f / 2;
    const hasEdge = fRaw > 0;

    return {
      value: `${fmtNumber(f * 100)}%`,
      note: hasEdge
        ? "Full Kelly maximizes long-term growth but is volatile — most traders use half-Kelly."
        : "Your edge is zero or negative here — Kelly suggests not taking this trade.",
      breakdown: [
        { label: "Full Kelly", value: `${fmtNumber(f * 100)}%` },
        { label: "Half Kelly (safer)", value: `${fmtNumber(half * 100)}%`, emphasis: true },
        { label: "Suggested stake (full)", value: fmtUsd(bankroll * f) },
        { label: "Suggested stake (half)", value: fmtUsd(bankroll * half) },
      ],
    };
  },
  relatedSlugs: ["win-rate-calculator", "trade-expectancy-calculator", "position-size-calculator"],
  faq: [
    { q: "What is the Kelly Criterion?", a: "A formula for the bet size that maximizes long-term capital growth: f = W − (1 − W) / R, where W is your win probability and R is your average win divided by average loss." },
    { q: "Why use half-Kelly?", a: "Full Kelly gives the fastest growth but big drawdowns and is very sensitive to wrong inputs. Half-Kelly keeps most of the growth with far less volatility." },
    { q: "What if the result is 0%?", a: "It means your win rate and payoff don't give you a positive edge, so the maths says the optimal bet is nothing. Improve your edge before sizing up." },
  ],
};

export default tool;
