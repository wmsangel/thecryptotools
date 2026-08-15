import type { ToolConfig } from "../types";
import { fmtNumber, fmtUsd } from "@/lib/format";

const tool: ToolConfig = {
  slug: "crypto-savings-goal-calculator",
  title: "Crypto Savings Goal Calculator",
  description:
    "Find out how long it takes to reach a target amount by stacking a fixed contribution each month at an expected return. Great for DCA planning toward a concrete number.",
  category: "market",
  source: "builtin",
  updatedAt: "2026-07-25",
  seo: {
    keywords: [
      "crypto savings goal calculator",
      "investment goal calculator",
      "how long to reach savings goal",
      "dca goal calculator",
      "monthly investment calculator crypto",
      "savings target calculator",
    ],
    description:
      "Free crypto savings goal calculator. Enter a target, starting amount, monthly contribution and expected return to see how long it takes to get there.",
  },
  inputs: [
    { name: "goal", label: "Target amount", type: "number", suffix: "USD", default: 100000, min: 1, step: 100 },
    { name: "initial", label: "Starting amount", type: "number", suffix: "USD", default: 5000, min: 0, step: 100, optional: true },
    { name: "monthly", label: "Monthly contribution", type: "number", suffix: "USD", default: 500, min: 0, step: 10 },
    { name: "apr", label: "Expected annual return", type: "number", suffix: "%", default: 12, step: 0.1, help: "Optional growth on top of contributions." },
  ],
  resultLabel: "Time to reach goal",
  precision: 1,
  relatedSlugs: ["dca-calculator", "compound-interest-calculator", "cagr-calculator"],
  compute: (i) => {
    const goal = Number(i.goal);
    const monthly = Number(i.monthly) || 0;
    const monthlyRate = (Number(i.apr) || 0) / 100 / 12;
    let balance = Number(i.initial) || 0;

    if (balance >= goal) {
      return { value: "Already reached", note: "Your starting amount already meets or exceeds the goal." };
    }
    if (monthly <= 0 && monthlyRate <= 0) {
      return { value: "Never", note: "With no monthly contribution and no return, the balance can't grow toward the goal." };
    }

    const MAX_MONTHS = 1200; // 100-year safety cap
    let months = 0;
    let contributed = 0;
    while (balance < goal && months < MAX_MONTHS) {
      balance = balance * (1 + monthlyRate) + monthly;
      contributed += monthly;
      months += 1;
    }

    if (months >= MAX_MONTHS && balance < goal) {
      return { value: "100+ years", note: "At this contribution and return it takes over a century — raise the monthly amount or return." };
    }

    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    const totalContributed = (Number(i.initial) || 0) + contributed;
    const growth = balance - totalContributed;

    return {
      value: `${years} yr ${remMonths} mo`,
      note: `That's ${months} monthly contributions. Growth beyond your deposits: ${fmtUsd(growth)}.`,
      breakdown: [
        { label: "Months to goal", value: months, emphasis: true },
        { label: "Total contributed", value: fmtUsd(totalContributed) },
        { label: "Investment growth", value: fmtUsd(growth) },
        { label: "Final balance", value: fmtUsd(balance) },
      ],
    };
  },
  faq: [
    { q: "How does this calculator work?", a: "It compounds your balance month by month: each month it applies your expected return, then adds your contribution, counting how many months until you cross the target." },
    { q: "Should I trust the expected return?", a: "Treat it as a scenario, not a promise — crypto returns are wildly variable. Try a conservative rate (or 0%) and an optimistic one to see the realistic range of outcomes." },
    { q: "Is this the same as DCA?", a: "It's DCA with a finish line. Dollar-cost averaging is the strategy of buying a fixed amount regularly; this tool tells you when that strategy reaches a specific dollar goal." },
    { q: "Why is my final balance above the goal?", a: "The loop stops the first month you cross the target, so the final balance lands at or just above the goal rather than exactly on it." },
  ],
};

export default tool;
