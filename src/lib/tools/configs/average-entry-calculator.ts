import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "average-entry-calculator",
  updatedAt: "2026-07-13",
  title: "Average Entry Price Calculator",
  description:
    "Calculate your blended average entry price after buying the same coin twice — perfect for averaging down or scaling in.",
  category: "portfolio",
  popular: true,
  source: "builtin",
  seo: {
    keywords: [
      "average entry calculator",
      "average price calculator",
      "average down calculator",
      "crypto cost basis calculator",
      "average cost calculator",
    ],
    description:
      "Free average entry price calculator. Combine two crypto buys to find your blended average price and total position.",
  },
  inputs: [
    { name: "price1", label: "Buy 1 price", type: "number", suffix: "USD", default: 30000, min: 0, step: 0.01 },
    { name: "amount1", label: "Buy 1 amount", type: "number", default: 0.5, min: 0, step: 0.0001 },
    { name: "price2", label: "Buy 2 price", type: "number", suffix: "USD", default: 25000, min: 0, step: 0.01 },
    { name: "amount2", label: "Buy 2 amount", type: "number", default: 0.5, min: 0, step: 0.0001 },
  ],
  resultLabel: "Average entry",
  resultUnit: "USD",
  compute: (i) => {
    const p1 = Number(i.price1);
    const a1 = Number(i.amount1);
    const p2 = Number(i.price2);
    const a2 = Number(i.amount2);

    const totalAmount = a1 + a2;
    const totalCost = p1 * a1 + p2 * a2;
    const avg = totalAmount > 0 ? totalCost / totalAmount : 0;

    return {
      value: fmtUsd(avg),
      breakdown: [
        { label: "Total amount", value: fmtNumber(totalAmount, 6) },
        { label: "Total cost", value: fmtUsd(totalCost) },
        { label: "Average entry", value: fmtUsd(avg), emphasis: true },
      ],
    };
  },
  faq: [
    { q: "How do I calculate average entry price?", a: "Average entry = total cost ÷ total coins. Multiply each buy's price by its amount, sum them, then divide by total coins held." },
    { q: "What is averaging down?", a: "Buying more of an asset at a lower price to reduce your average entry, so a smaller recovery is needed to break even." },
    { q: "Can I add more than two buys?", a: "This tool covers two buys; chain the result as 'Buy 1' with a third purchase to average additional entries." },
  ],
};

export default tool;
