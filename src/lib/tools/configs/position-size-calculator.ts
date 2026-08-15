import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "position-size-calculator",
  updatedAt: "2026-07-15",
  title: "Position Size Calculator",
  description:
    "Find the exact position size for a trade based on your account size, risk percentage and stop-loss distance — classic risk management.",
  category: "trading",
  featured: true,
  popular: true,
  source: "builtin",
  seo: {
    keywords: [
      "position size calculator",
      "crypto position size calculator",
      "risk management calculator",
      "trade size calculator",
      "forex position size",
    ],
    description:
      "Free position size calculator. Set account size, risk % and stop distance to get the exact position size and units to trade.",
  },
  inputs: [
    { name: "account", label: "Account size", type: "number", suffix: "USD", default: 10000, min: 0, step: 1 },
    { name: "riskPct", label: "Risk per trade", type: "number", suffix: "%", default: 1, min: 0, max: 100, step: 0.1 },
    { name: "entry", label: "Entry price", type: "number", suffix: "USD", default: 30000, min: 0, step: 0.01, livePrice: true },
    { name: "stop", label: "Stop-loss price", type: "number", suffix: "USD", default: 29000, min: 0, step: 0.01 },
  ],
  resultLabel: "Position size",
  resultUnit: "USD",
  compute: (i) => {
    const account = Number(i.account);
    const riskPct = Number(i.riskPct);
    const entry = Number(i.entry);
    const stop = Number(i.stop);

    const riskAmount = account * (riskPct / 100);
    const stopDistance = Math.abs(entry - stop);
    const stopPct = entry > 0 ? (stopDistance / entry) * 100 : 0;
    const units = stopDistance > 0 ? riskAmount / stopDistance : 0;
    const positionUsd = units * entry;

    return {
      value: fmtUsd(positionUsd),
      note:
        positionUsd > account
          ? "Position exceeds account — you'd need leverage to take this size."
          : undefined,
      breakdown: [
        { label: "Risk amount", value: fmtUsd(riskAmount) },
        { label: "Stop distance", value: fmtUsd(stopDistance) },
        { label: "Stop distance %", value: `${fmtNumber(stopPct)}%` },
        { label: "Units to buy", value: fmtNumber(units, 6), emphasis: true },
      ],
    };
  },
  faq: [
    { q: "How do I calculate position size?", a: "Position size = (account × risk %) ÷ stop-loss distance. This keeps every trade's loss capped at your chosen risk." },
    { q: "What risk % should I use?", a: "Most professionals risk 0.5–2% of their account per trade to survive losing streaks." },
    { q: "Does this work for leverage?", a: "Yes — the units and USD size are notional. If the position exceeds your account, the difference is your required margin/leverage." },
  ],
};

export default tool;
