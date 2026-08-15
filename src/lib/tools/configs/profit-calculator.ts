import type { ToolConfig } from "../types";
import { fmtUsd, fmtPct } from "@/lib/format";

const tool: ToolConfig = {
  slug: "profit-calculator",
  updatedAt: "2026-07-31",
  title: "Crypto Profit Calculator",
  description:
    "Calculate profit, loss and ROI from any crypto trade using your buy price, sell price and position size — including trading fees.",
  category: "trading",
  featured: true,
  popular: true,
  source: "builtin",
  seo: {
    keywords: [
      "crypto profit calculator",
      "crypto trade calculator",
      "crypto trading calculator",
      "roi crypto",
      "trading profit calculator",
      "bitcoin profit calculator",
      "crypto gain calculator",
    ],
    description:
      "Free crypto trade calculator. Enter your buy price, sell price and amount to instantly see profit, loss, ROI % and trading fees.",
  },
  inputs: [
    { name: "buyPrice", label: "Buy Price", type: "number", suffix: "USD", default: 20000, min: 0, step: 0.01 },
    { name: "sellPrice", label: "Sell Price", type: "number", suffix: "USD", default: 30000, min: 0, step: 0.01, livePrice: true },
    { name: "amount", label: "Amount (coins)", type: "number", default: 0.5, min: 0, step: 0.0001 },
    { name: "feePct", label: "Fee (each side)", type: "number", suffix: "%", default: 0.1, min: 0, step: 0.01, optional: true },
  ],
  resultLabel: "Net profit",
  resultUnit: "USD",
  compute: (i) => {
    const buy = Number(i.buyPrice);
    const sell = Number(i.sellPrice);
    const amount = Number(i.amount);
    const feePct = Number(i.feePct) || 0;

    const cost = buy * amount;
    const proceeds = sell * amount;
    const fees = (cost + proceeds) * (feePct / 100);
    const grossProfit = proceeds - cost;
    const netProfit = grossProfit - fees;
    const roi = cost > 0 ? (netProfit / cost) * 100 : 0;

    return {
      value: fmtUsd(netProfit),
      label: netProfit >= 0 ? "Net profit" : "Net loss",
      breakdown: [
        { label: "Total cost", value: fmtUsd(cost) },
        { label: "Total proceeds", value: fmtUsd(proceeds) },
        { label: "Gross profit", value: fmtUsd(grossProfit) },
        { label: "Fees paid", value: fmtUsd(fees) },
        { label: "ROI", value: fmtPct(roi), emphasis: true },
      ],
    };
  },
  faq: [
    { q: "How is crypto profit calculated?", a: "Profit = (sell price − buy price) × amount, minus trading fees on both the buy and sell sides." },
    { q: "What is ROI?", a: "Return on investment is your net profit divided by your total cost, expressed as a percentage." },
    { q: "Are fees included?", a: "Yes — enter your exchange fee per side (e.g. 0.1%) and it's applied to both entry and exit." },
  ],
};

export default tool;
