import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "crypto-tax-calculator",
  updatedAt: "2026-08-03",
  title: "Crypto Capital Gains Tax Calculator",
  description:
    "Estimate the capital gain and tax owed on a crypto sale from your proceeds, cost basis, fees and tax rate.",
  category: "portfolio",
  featured: true,
  popular: true,
  source: "builtin",
  seo: {
    keywords: [
      "crypto tax calculator",
      "crypto capital gains calculator",
      "bitcoin tax calculator",
      "capital gains tax crypto",
      "crypto gains tax estimator",
    ],
    description:
      "Free crypto capital gains tax calculator. Estimate your taxable gain and tax owed from proceeds, cost basis and rate.",
  },
  inputs: [
    { name: "proceeds", label: "Sale proceeds", type: "number", suffix: "USD", default: 15000, min: 0, step: 1 },
    { name: "costBasis", label: "Cost basis (what you paid)", type: "number", suffix: "USD", default: 10000, min: 0, step: 1 },
    { name: "fees", label: "Fees", type: "number", suffix: "USD", default: 50, min: 0, step: 1, optional: true },
    { name: "taxRate", label: "Tax rate", type: "number", suffix: "%", default: 20, min: 0, max: 100, step: 0.1 },
  ],
  resultLabel: "Estimated tax owed",
  resultUnit: "USD",
  compute: (i) => {
    const proceeds = Number(i.proceeds);
    const cost = Number(i.costBasis);
    const fees = Number(i.fees) || 0;
    const rate = Number(i.taxRate) / 100;

    const gain = proceeds - cost - fees;
    const tax = gain > 0 ? gain * rate : 0;
    const netAfterTax = proceeds - fees - tax;

    return {
      value: fmtUsd(tax),
      note: "Rough estimate only — not tax advice. Rules, allowances and short vs long-term rates vary by country.",
      breakdown: [
        { label: gain >= 0 ? "Capital gain" : "Capital loss", value: fmtUsd(gain), emphasis: true },
        { label: "Effective tax rate", value: `${fmtNumber(rate * 100)}%` },
        { label: "Net after tax", value: fmtUsd(netAfterTax) },
      ],
    };
  },
  relatedSlugs: ["tax-loss-harvesting-calculator", "profit-calculator", "average-entry-calculator", "roi-calculator"],
  faq: [
    { q: "How is crypto capital gains tax calculated?", a: "Gain = proceeds − cost basis − fees. Tax = gain × your applicable rate. A loss generally isn't taxed and may offset gains." },
    { q: "What is cost basis?", a: "Cost basis is what you originally paid for the crypto, including any purchase fees. It's subtracted from proceeds to find the gain." },
    { q: "Is this accurate for my country?", a: "It's a general estimate. Short vs long-term rates, tax-free allowances and local rules differ — confirm with a tax professional." },
  ],
};

export default tool;
