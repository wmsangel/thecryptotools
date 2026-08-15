import type { ToolConfig } from "../types";
import { fmtUsd } from "@/lib/format";

const tool: ToolConfig = {
  slug: "mining-profitability-calculator",
  updatedAt: "2026-07-13",
  title: "Crypto Mining Profitability Calculator",
  description:
    "Estimate daily and monthly mining profit from your hashrate, expected revenue, power draw and electricity cost.",
  category: "mining",
  featured: true,
  popular: true,
  source: "builtin",
  seo: {
    keywords: [
      "mining calculator",
      "crypto mining profitability calculator",
      "mining profit calculator",
      "bitcoin mining calculator",
      "hashrate profit calculator",
    ],
    description:
      "Free crypto mining profitability calculator. Enter hashrate, revenue rate, power and electricity cost to see profit.",
  },
  inputs: [
    { name: "hashrate", label: "Hashrate", type: "number", suffix: "TH/s", default: 100, min: 0, step: 0.01 },
    { name: "revenuePerTh", label: "Revenue per TH/s per day", type: "number", suffix: "USD", default: 0.05, min: 0, step: 0.001, help: "Estimate from your mining pool." },
    { name: "power", label: "Power draw", type: "number", suffix: "W", default: 3000, min: 0, step: 1 },
    { name: "elecCost", label: "Electricity cost", type: "number", suffix: "$/kWh", default: 0.1, min: 0, step: 0.01 },
  ],
  resultLabel: "Daily profit",
  resultUnit: "USD",
  compute: (i) => {
    const hashrate = Number(i.hashrate);
    const revPerTh = Number(i.revenuePerTh);
    const power = Number(i.power);
    const elec = Number(i.elecCost);

    const dailyRevenue = hashrate * revPerTh;
    const dailyKwh = (power / 1000) * 24;
    const dailyCost = dailyKwh * elec;
    const dailyProfit = dailyRevenue - dailyCost;

    return {
      value: fmtUsd(dailyProfit),
      note: "Estimate only — revenue per TH varies daily with price and network difficulty.",
      breakdown: [
        { label: "Daily revenue", value: fmtUsd(dailyRevenue) },
        { label: "Daily power cost", value: fmtUsd(dailyCost) },
        { label: "Monthly profit", value: fmtUsd(dailyProfit * 30), emphasis: true },
        { label: "Yearly profit", value: fmtUsd(dailyProfit * 365) },
      ],
    };
  },
  faq: [
    { q: "How is mining profit calculated?", a: "Profit = revenue (hashrate × revenue per TH/day) − electricity cost (power in kW × 24h × price per kWh)." },
    { q: "Where do I get 'revenue per TH'?", a: "Most mining pools and coin dashboards publish a current $/TH/day figure — paste that in for an up-to-date estimate." },
    { q: "Why does profit change so much?", a: "Coin price and network difficulty move constantly, so mining revenue is volatile. Re-run the numbers regularly." },
  ],
};

export default tool;
