import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "stop-loss-take-profit-calculator",
  updatedAt: "2026-08-03",
  title: "Stop Loss & Take Profit Calculator",
  description:
    "Turn your stop-loss and take-profit percentages into exact prices, and see the risk, reward and R:R for the trade.",
  category: "trading",
  popular: true,
  source: "builtin",
  seo: {
    keywords: [
      "crypto stop loss calculator",
      "stop loss calculator",
      "stop loss calculator crypto",
      "take profit calculator",
      "stop loss take profit calculator",
      "sl tp calculator crypto",
      "risk reward price calculator",
    ],
    description:
      "Free crypto stop loss calculator. Convert your SL and TP percentages into exact prices and see risk, reward and R:R for the trade.",
  },
  inputs: [
    { name: "entry", label: "Entry price", type: "number", suffix: "USD", default: 30000, min: 0, step: 0.01, livePrice: true },
    { name: "position", label: "Position size", type: "number", suffix: "USD", default: 1000, min: 0, step: 1 },
    { name: "slPct", label: "Stop-loss", type: "number", suffix: "%", default: 5, min: 0, step: 0.1 },
    { name: "tpPct", label: "Take-profit", type: "number", suffix: "%", default: 10, min: 0, step: 0.1 },
  ],
  resultLabel: "Stop-loss price",
  resultUnit: "USD",
  compute: (i) => {
    const entry = Number(i.entry);
    const position = Number(i.position);
    const sl = Number(i.slPct);
    const tp = Number(i.tpPct);

    const slPrice = entry * (1 - sl / 100);
    const tpPrice = entry * (1 + tp / 100);
    const risk = position * (sl / 100);
    const reward = position * (tp / 100);
    const rr = sl > 0 ? tp / sl : 0;

    return {
      value: fmtUsd(slPrice),
      breakdown: [
        { label: "Take-profit price", value: fmtUsd(tpPrice), emphasis: true },
        { label: "Risk ($)", value: fmtUsd(risk) },
        { label: "Reward ($)", value: fmtUsd(reward) },
        { label: "Risk / Reward", value: `1 : ${fmtNumber(rr)}` },
      ],
    };
  },
  relatedSlugs: ["take-profit-ladder-calculator", "risk-reward-calculator", "position-size-calculator", "profit-calculator"],
  faq: [
    { q: "How do I set a stop loss?", a: "Pick a percentage you're willing to lose; the stop-loss price = entry × (1 − SL%). This tool also shows the dollar risk." },
    { q: "What's a good take-profit level?", a: "Aim for a reward at least 2× your risk (R:R ≥ 1:2). The calculator shows your R:R so you can size TP vs SL." },
    { q: "Does this work for shorts?", a: "This version assumes a long. For a short, swap the signs — stop above entry, target below." },
  ],
};

export default tool;
