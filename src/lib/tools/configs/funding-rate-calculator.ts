import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "funding-rate-calculator",
  updatedAt: "2026-07-13",
  title: "Funding Rate Calculator",
  description:
    "Calculate the funding payment on a perpetual futures position and project the daily and annualized cost of holding it.",
  category: "market",
  popular: true,
  source: "builtin",
  seo: {
    keywords: [
      "funding rate calculator",
      "perpetual funding calculator",
      "crypto funding fee calculator",
      "futures funding rate",
      "funding cost calculator",
    ],
    description:
      "Free funding rate calculator for perpetual futures. Enter position size and funding rate to see the payment and annualized cost.",
  },
  inputs: [
    { name: "position", label: "Position size", type: "number", suffix: "USD", default: 10000, min: 0, step: 1 },
    { name: "rate", label: "Funding rate", type: "number", suffix: "%", default: 0.01, step: 0.001, help: "Per funding interval (usually 8h)" },
    { name: "intervals", label: "Intervals / day", type: "number", default: 3, min: 1, step: 1, optional: true },
  ],
  resultLabel: "Funding payment",
  resultUnit: "USD",
  compute: (i) => {
    const position = Number(i.position);
    const rate = Number(i.rate) / 100;
    const intervals = Number(i.intervals) || 3;

    const perInterval = position * rate;
    const perDay = perInterval * intervals;
    const annualPct = rate * intervals * 365 * 100;

    return {
      value: fmtUsd(perInterval),
      note: perInterval >= 0
        ? "Positive rate: longs pay shorts."
        : "Negative rate: shorts pay longs.",
      breakdown: [
        { label: "Per interval", value: fmtUsd(perInterval) },
        { label: "Per day", value: fmtUsd(perDay) },
        { label: "Annualized cost", value: `${fmtNumber(annualPct)}%`, emphasis: true },
      ],
    };
  },
  faq: [
    { q: "What is a funding rate?", a: "Funding is a periodic payment exchanged between long and short perpetual traders to keep the contract price near the spot price." },
    { q: "Who pays funding?", a: "When the rate is positive, longs pay shorts; when negative, shorts pay longs. It's typically settled every 8 hours." },
    { q: "How much does funding cost per year?", a: "Multiply the per-interval rate by the number of intervals per day and by 365. Small rates compound into large annual costs." },
  ],
};

export default tool;
