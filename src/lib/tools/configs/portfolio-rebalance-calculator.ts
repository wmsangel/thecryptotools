import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "portfolio-rebalance-calculator",
  updatedAt: "2026-07-13",
  title: "Portfolio Rebalancing Calculator",
  description:
    "Find out exactly how much of an asset to buy or sell to bring it back to your target allocation.",
  category: "portfolio",
  popular: true,
  source: "builtin",
  seo: {
    keywords: [
      "portfolio rebalancing calculator",
      "crypto rebalance calculator",
      "asset allocation calculator",
      "rebalance portfolio crypto",
      "target allocation calculator",
    ],
    description:
      "Free portfolio rebalancing calculator. Enter total value, current holding and target % to see how much to buy or sell.",
  },
  inputs: [
    { name: "total", label: "Total portfolio value", type: "number", suffix: "USD", default: 10000, min: 0, step: 1 },
    { name: "current", label: "Current value of this asset", type: "number", suffix: "USD", default: 2000, min: 0, step: 1 },
    { name: "targetPct", label: "Target allocation", type: "number", suffix: "%", default: 30, min: 0, max: 100, step: 0.1 },
  ],
  resultLabel: "Action",
  resultUnit: "USD",
  compute: (i) => {
    const total = Number(i.total);
    const current = Number(i.current);
    const targetPct = Number(i.targetPct);

    const currentPct = total > 0 ? (current / total) * 100 : 0;
    const targetValue = total * (targetPct / 100);
    const delta = targetValue - current;
    const action = delta > 0 ? "Buy" : delta < 0 ? "Sell" : "Hold";

    return {
      value: `${action} ${fmtUsd(Math.abs(delta))}`,
      label: `${action} to reach target`,
      breakdown: [
        { label: "Current allocation", value: `${fmtNumber(currentPct)}%` },
        { label: "Target allocation", value: `${fmtNumber(targetPct)}%` },
        { label: "Target value", value: fmtUsd(targetValue), emphasis: true },
      ],
    };
  },
  faq: [
    { q: "What is portfolio rebalancing?", a: "Rebalancing brings each asset back to its target weight by buying underweight assets and selling overweight ones." },
    { q: "How much should I buy or sell?", a: "Target value = total portfolio × target %. Buy or sell the difference between that and the asset's current value." },
    { q: "How often should I rebalance?", a: "Common approaches are calendar-based (e.g. quarterly) or threshold-based (when an asset drifts more than 5% from target)." },
  ],
};

export default tool;
