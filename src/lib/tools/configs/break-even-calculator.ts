import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "break-even-calculator",
  updatedAt: "2026-07-15",
  title: "Break Even Calculator",
  description:
    "Find the price your crypto position must reach to break even after trading fees — for a single buy or an averaged-down position.",
  category: "trading",
  popular: true,
  source: "builtin",
  seo: {
    keywords: [
      "break even calculator",
      "crypto break even calculator",
      "break even price calculator",
      "trading break even",
      "break even point crypto",
    ],
    description:
      "Free break-even calculator for crypto traders. Enter buy price, amount and fees to find your exact break-even price.",
  },
  inputs: [
    { name: "buyPrice", label: "Average buy price", type: "number", suffix: "USD", default: 25000, min: 0, step: 0.01, livePrice: true },
    { name: "amount", label: "Amount (coins)", type: "number", default: 0.5, min: 0, step: 0.0001 },
    { name: "feePct", label: "Fee (each side)", type: "number", suffix: "%", default: 0.1, min: 0, step: 0.01, optional: true },
  ],
  resultLabel: "Break-even price",
  resultUnit: "USD",
  compute: (i) => {
    const buy = Number(i.buyPrice);
    const amount = Number(i.amount);
    const feePct = Number(i.feePct) || 0;
    const f = feePct / 100;

    // Cost incl. buy fee = buy*amount*(1+f). Must equal sell*amount*(1-f).
    const cost = buy * amount * (1 + f);
    const breakEven = amount > 0 && 1 - f !== 0 ? cost / (amount * (1 - f)) : buy;
    const movePct = buy > 0 ? ((breakEven - buy) / buy) * 100 : 0;

    return {
      value: fmtUsd(breakEven),
      breakdown: [
        { label: "Total cost (incl. fees)", value: fmtUsd(cost) },
        { label: "Required move", value: `${fmtNumber(movePct)}%`, emphasis: true },
      ],
    };
  },
  faq: [
    { q: "What is a break-even price?", a: "It's the price at which selling your position returns exactly what you paid, including all trading fees — no profit, no loss." },
    { q: "Why is break-even above my buy price?", a: "Because exchange fees apply on both entry and exit, price must rise slightly above your buy price to cover them." },
    { q: "How do I lower my break-even?", a: "Buy more at lower prices (averaging down) or reduce fees by using a lower-fee exchange or fee tier." },
  ],
};

export default tool;
