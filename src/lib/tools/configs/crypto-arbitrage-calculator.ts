import type { ToolConfig } from "../types";
import { fmtNumber, fmtUsd } from "@/lib/format";

const tool: ToolConfig = {
  slug: "crypto-arbitrage-calculator",
  title: "Crypto Arbitrage Calculator",
  description:
    "Check whether a price gap between two exchanges is a real profit after trading fees and transfer costs. Most raw spreads vanish once fees are counted — this tool shows the net.",
  category: "trading",
  source: "builtin",
  updatedAt: "2026-07-25",
  seo: {
    keywords: [
      "crypto arbitrage calculator",
      "arbitrage profit calculator",
      "exchange arbitrage calculator",
      "bitcoin arbitrage calculator",
      "crypto price difference profit",
      "arbitrage fees calculator",
    ],
    description:
      "Free crypto arbitrage calculator. Enter buy price, sell price, quantity and fees to see the real net profit after trading and transfer costs.",
  },
  inputs: [
    { name: "buy", label: "Buy price (exchange A)", type: "number", suffix: "USD", default: 60000, min: 0, step: 0.01, livePrice: true },
    { name: "sell", label: "Sell price (exchange B)", type: "number", suffix: "USD", default: 60600, min: 0, step: 0.01 },
    { name: "qty", label: "Quantity", type: "number", suffix: "coins", default: 0.5, min: 0, step: 0.0001 },
    { name: "buyFee", label: "Buy fee", type: "number", suffix: "%", default: 0.1, min: 0, step: 0.01, optional: true },
    { name: "sellFee", label: "Sell fee", type: "number", suffix: "%", default: 0.1, min: 0, step: 0.01, optional: true },
    { name: "transfer", label: "Transfer / withdrawal fee", type: "number", suffix: "USD", default: 15, min: 0, step: 0.01, optional: true, help: "Network + withdrawal cost to move the coin." },
  ],
  resultLabel: "Net profit",
  precision: 2,
  relatedSlugs: ["profit-calculator", "funding-rate-calculator", "trading-fee-calculator"],
  compute: (i) => {
    const buy = Number(i.buy);
    const sell = Number(i.sell);
    const qty = Number(i.qty);
    const buyFee = (Number(i.buyFee) || 0) / 100;
    const sellFee = (Number(i.sellFee) || 0) / 100;
    const transfer = Number(i.transfer) || 0;

    const cost = qty * buy * (1 + buyFee);
    const revenue = qty * sell * (1 - sellFee) - transfer;
    const profit = revenue - cost;
    const roi = cost > 0 ? (profit / cost) * 100 : 0;
    const grossSpread = buy > 0 ? ((sell - buy) / buy) * 100 : 0;

    return {
      value: fmtUsd(profit),
      note: profit <= 0
        ? "This spread doesn't cover the fees — no profitable arbitrage here."
        : "Positive after fees. Remember prices can move while you transfer coins between exchanges.",
      breakdown: [
        { label: "Return on capital", value: `${fmtNumber(roi)}%`, emphasis: true },
        { label: "Gross spread", value: `${fmtNumber(grossSpread)}%` },
        { label: "Total cost (with fee)", value: fmtUsd(cost) },
        { label: "Net proceeds (with fees)", value: fmtUsd(revenue) },
      ],
    };
  },
  faq: [
    { q: "How does crypto arbitrage work?", a: "You buy a coin cheaper on one exchange and sell it dearer on another, pocketing the difference. The catch is that trading fees, withdrawal fees and price movement during the transfer eat most small spreads." },
    { q: "Why is my profit negative even though the sell price is higher?", a: "Two 0.1% trading fees plus a flat withdrawal fee can easily exceed a 0.5% spread. This calculator subtracts all of them so you see the real number before you commit capital." },
    { q: "What risks aren't in this number?", a: "Transfer time (the price can move against you mid-move), withdrawal limits or freezes, slippage on thin order books, and the capital you must pre-fund on both venues. Treat the output as a best case." },
    { q: "What about triangular arbitrage?", a: "This tool models simple two-exchange spot arbitrage. Triangular arbitrage (three pairs on one exchange) uses the same fee logic but chains three trades instead of a buy and a sell." },
  ],
};

export default tool;
