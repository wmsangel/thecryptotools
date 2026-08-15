import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "compound-interest-calculator",
  updatedAt: "2026-08-03",
  title: "Crypto Compound Interest Calculator",
  description:
    "Project the growth of your crypto with compound interest and optional recurring contributions over any number of years.",
  category: "mining",
  popular: true,
  source: "builtin",
  seo: {
    keywords: [
      "crypto compound interest calculator",
      "crypto compounding calculator",
      "compound interest calculator",
      "compound growth calculator",
      "crypto savings calculator",
      "reinvestment calculator",
    ],
    description:
      "Free compound interest calculator for crypto. Add a starting amount, monthly contributions and rate to project growth.",
  },
  inputs: [
    { name: "principal", label: "Starting amount", type: "number", suffix: "USD", default: 1000, min: 0, step: 1 },
    { name: "monthly", label: "Monthly contribution", type: "number", suffix: "USD", default: 100, min: 0, step: 1, optional: true },
    { name: "rate", label: "Annual rate", type: "number", suffix: "%", default: 10, min: 0, step: 0.01 },
    { name: "years", label: "Years", type: "number", default: 5, min: 0, step: 0.5 },
  ],
  resultLabel: "Final balance",
  resultUnit: "USD",
  compute: (i) => {
    const principal = Number(i.principal);
    const monthly = Number(i.monthly) || 0;
    const rate = Number(i.rate) / 100;
    const years = Number(i.years);

    const r = rate / 12;
    const n = years * 12;
    const growth = Math.pow(1 + r, n);
    const fvPrincipal = principal * growth;
    const fvContrib = r > 0 ? monthly * ((growth - 1) / r) : monthly * n;
    const finalBalance = fvPrincipal + fvContrib;
    const contributed = principal + monthly * n;
    const interest = finalBalance - contributed;

    return {
      value: fmtUsd(finalBalance),
      breakdown: [
        { label: "Total contributed", value: fmtUsd(contributed) },
        { label: "Interest earned", value: fmtUsd(interest), emphasis: true },
        { label: "Growth multiple", value: `${fmtNumber(contributed > 0 ? finalBalance / contributed : 0)}x` },
      ],
    };
  },
  relatedSlugs: ["crypto-withdrawal-calculator", "apy-calculator", "staking-rewards-calculator", "crypto-savings-goal-calculator"],
  faq: [
    { q: "How does compound interest work?", a: "Each period's earnings are added to the balance, so future earnings are calculated on a larger amount — growth accelerates over time." },
    { q: "Does it include my monthly deposits?", a: "Yes — each monthly contribution compounds from the month it's added, using monthly compounding." },
    { q: "What rate should I use?", a: "Use a realistic expected annual return. Crypto yields vary widely, so try conservative and optimistic scenarios." },
  ],
};

export default tool;
