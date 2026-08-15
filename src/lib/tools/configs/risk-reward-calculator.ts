import type { ToolConfig } from "../types";
import { fmtNumber, fmtUsd } from "@/lib/format";

const tool: ToolConfig = {
  slug: "risk-reward-calculator",
  updatedAt: "2026-07-31",
  title: "Risk/Reward Ratio Calculator",
  description:
    "Calculate the risk-to-reward ratio of a trade from entry, stop-loss and take-profit — plus the win rate you need to break even.",
  category: "trading",
  popular: true,
  source: "builtin",
  seo: {
    keywords: [
      "risk reward calculator",
      "risk reward ratio calculator",
      "crypto risk reward",
      "rr ratio calculator",
      "trade risk calculator",
    ],
    description:
      "Free risk/reward ratio calculator. Enter entry, stop and target to see your R:R ratio and required win rate.",
  },
  inputs: [
    { name: "entry", label: "Entry price", type: "number", suffix: "USD", default: 30000, min: 0, step: 0.01, livePrice: true },
    { name: "stop", label: "Stop-loss", type: "number", suffix: "USD", default: 29000, min: 0, step: 0.01 },
    { name: "target", label: "Take-profit", type: "number", suffix: "USD", default: 33000, min: 0, step: 0.01 },
  ],
  resultLabel: "Risk / Reward",
  compute: (i) => {
    const entry = Number(i.entry);
    const stop = Number(i.stop);
    const target = Number(i.target);

    const risk = Math.abs(entry - stop);
    const reward = Math.abs(target - entry);
    const ratio = risk > 0 ? reward / risk : 0;
    const breakEvenWin = ratio > 0 ? (1 / (1 + ratio)) * 100 : 0;

    return {
      value: `1 : ${fmtNumber(ratio)}`,
      breakdown: [
        { label: "Risk per unit", value: fmtUsd(risk) },
        { label: "Reward per unit", value: fmtUsd(reward) },
        { label: "R multiple", value: `${fmtNumber(ratio)}R` },
        { label: "Break-even win rate", value: `${fmtNumber(breakEvenWin)}%`, emphasis: true },
      ],
    };
  },
  relatedSlugs: ["win-rate-calculator", "stop-loss-take-profit-calculator", "position-size-calculator"],
  faq: [
    { q: "What is a good risk/reward ratio?", a: "Many traders look for at least 1:2 — risking one unit to make two. Higher ratios let you profit with a lower win rate." },
    { q: "How is break-even win rate found?", a: "Break-even win rate = 1 ÷ (1 + reward/risk). A 1:2 trade only needs a 33% win rate to break even." },
    { q: "Does R:R guarantee profit?", a: "No — it must be combined with a realistic win rate. A great ratio with a very low win rate can still lose money." },
  ],
};

export default tool;
