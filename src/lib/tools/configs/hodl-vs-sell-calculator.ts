import type { ToolConfig } from "../types";
import { fmtUsd } from "@/lib/format";

const tool: ToolConfig = {
  slug: "hodl-vs-sell-calculator",
  updatedAt: "2026-10-23",
  title: "HODL vs Sell Calculator",
  description:
    "Compare after-tax proceeds if you sell now versus if you hold to a target price — so you can see what “waiting” would need to deliver.",
  category: "portfolio",
  featured: false,
  popular: false,
  source: "builtin",
  seo: {
    keywords: [
      "hodl vs sell calculator",
      "should i sell or hold crypto",
      "hold vs sell crypto",
      "sell now or hold calculator",
    ],
    description:
      "Free HODL vs sell calculator. Compare after-tax proceeds from selling now versus holding to a target price.",
  },
  inputs: [
    { name: "amount", label: "Coins held", type: "number", default: 1, min: 0, step: 0.0001 },
    { name: "costBasis", label: "Your buy price", type: "number", suffix: "USD", default: 20000, min: 0, step: 1 },
    { name: "currentPrice", label: "Current price", type: "number", suffix: "USD", default: 60000, min: 0, step: 1 },
    { name: "targetPrice", label: "Target/future price", type: "number", suffix: "USD", default: 100000, min: 0, step: 1 },
    {
      name: "taxRate",
      label: "Tax on gains",
      type: "number",
      suffix: "%",
      default: 20,
      min: 0,
      max: 100,
      step: 0.1,
      optional: true,
      help: "Your estimated capital-gains rate. Leave 0 if you ignore tax for a rough compare.",
    },
  ],
  resultLabel: "Extra from holding to target, after tax",
  resultUnit: "USD",
  compute: (i) => {
    const amount = Number(i.amount) || 0;
    const costBasis = Number(i.costBasis) || 0;
    const currentPrice = Number(i.currentPrice) || 0;
    const targetPrice = Number(i.targetPrice) || 0;
    const r = (Number(i.taxRate) || 0) / 100;

    const sellProceeds = amount * currentPrice;
    const sellGain = amount * (currentPrice - costBasis);
    const sellTax = sellGain > 0 ? sellGain * r : 0;
    const afterSellNow = sellProceeds - sellTax;

    const holdValue = amount * targetPrice;
    const holdGain = amount * (targetPrice - costBasis);
    const holdTax = holdGain > 0 ? holdGain * r : 0;
    const afterHold = holdValue - holdTax;

    const diff = afterHold - afterSellNow;

    return {
      value: fmtUsd(diff),
      note: "Assumes the target price is actually reached — it is not a prediction, and not financial advice.",
      breakdown: [
        { label: "After-tax if you sell now", value: fmtUsd(afterSellNow), emphasis: true },
        { label: "After-tax if you hold to target", value: fmtUsd(afterHold), emphasis: true },
        { label: "Difference", value: fmtUsd(diff) },
      ],
    };
  },
  relatedSlugs: [
    "crypto-tax-calculator",
    "profit-calculator",
    "target-price-calculator",
    "roi-calculator",
  ],
  article: [
    {
      type: "p",
      text: "“Should I sell or hold?” is really two cash outcomes under a price you choose. This calculator applies your tax rate to gains in both paths and shows the after-tax gap — how much more (or less) you keep if the target is hit versus selling today.",
    },
    {
      type: "p",
      text: "The target price is an assumption you type in, not a forecast. If the market never gets there, the “hold” column is fiction. Use it to stress-test a thesis, not to pick a direction.",
    },
    {
      type: "p",
      text: "Tax rules differ by country, holding period and allowances. The optional rate is a blunt estimate so the comparison stays in the same units; it is not a filing guide.",
    },
  ],
  faq: [
    {
      q: "What does a positive difference mean?",
      a: "After tax, holding to your target would leave you with that much more than selling now — if the target price is actually reached. A negative figure means selling now keeps more under those inputs.",
    },
    {
      q: "Why include tax?",
      a: "Selling locks in a taxable event. Holding delays it but may create a larger gain later. Comparing pre-tax numbers can hide which path leaves more cash.",
    },
    {
      q: "Is this investment advice?",
      a: "No. It only runs arithmetic on the prices and rate you enter. Markets move, tax rules vary, and a target price is not a prediction.",
    },
  ],
};

export default tool;
