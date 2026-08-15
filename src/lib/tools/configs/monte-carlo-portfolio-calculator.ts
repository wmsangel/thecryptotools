import type { ToolConfig } from "../types";
import { fmtUsd } from "@/lib/format";

// Box–Muller standard-normal sample.
function randn(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const tool: ToolConfig = {
  slug: "monte-carlo-portfolio-calculator",
  updatedAt: "2026-07-15",
  title: "Monte Carlo Portfolio Simulator",
  description:
    "Project a range of possible portfolio outcomes with a Monte Carlo simulation of 1,000 paths, from expected return, volatility and contributions.",
  category: "portfolio",
  source: "builtin",
  seo: {
    keywords: [
      "monte carlo simulation calculator",
      "portfolio projection calculator",
      "monte carlo portfolio",
      "investment simulation calculator",
      "crypto portfolio forecast",
    ],
    description:
      "Free Monte Carlo portfolio simulator. Model 1,000 possible futures from expected return and volatility to see best, median and worst cases.",
  },
  inputs: [
    { name: "initial", label: "Starting amount", type: "number", suffix: "USD", default: 10000, min: 0, step: 1 },
    { name: "monthly", label: "Monthly contribution", type: "number", suffix: "USD", default: 200, min: 0, step: 1, optional: true },
    { name: "ret", label: "Expected annual return", type: "number", suffix: "%", default: 20, step: 0.1 },
    { name: "vol", label: "Annual volatility", type: "number", suffix: "%", default: 60, min: 0.01, step: 0.1 },
    { name: "years", label: "Years", type: "number", default: 5, min: 0.5, step: 0.5 },
  ],
  resultLabel: "Median projected value",
  resultUnit: "USD",
  compute: (i) => {
    const initial = Number(i.initial);
    const monthly = Number(i.monthly) || 0;
    const mean = Number(i.ret) / 100;
    const vol = Number(i.vol) / 100;
    const years = Number(i.years);

    const months = Math.max(1, Math.round(years * 12));
    const dt = 1 / 12;
    const drift = (mean - (vol * vol) / 2) * dt;
    const shock = vol * Math.sqrt(dt);
    const sims = 1000;

    const finals: number[] = [];
    for (let s = 0; s < sims; s++) {
      let val = initial;
      for (let m = 0; m < months; m++) {
        val = val * Math.exp(drift + shock * randn()) + monthly;
      }
      finals.push(val);
    }
    finals.sort((a, b) => a - b);

    const pct = (p: number) => finals[Math.min(finals.length - 1, Math.floor(p * finals.length))];
    const median = pct(0.5);
    const contributed = initial + monthly * months;

    return {
      value: fmtUsd(median),
      note: "1,000-path Monte Carlo (geometric Brownian motion). Numbers reshuffle slightly on each run — that's the randomness at work.",
      breakdown: [
        { label: "Pessimistic (10th pct)", value: fmtUsd(pct(0.1)) },
        { label: "Median (50th pct)", value: fmtUsd(median), emphasis: true },
        { label: "Optimistic (90th pct)", value: fmtUsd(pct(0.9)) },
        { label: "Total contributed", value: fmtUsd(contributed) },
      ],
    };
  },
  faq: [
    { q: "What is a Monte Carlo simulation?", a: "It runs thousands of randomized future scenarios using your expected return and volatility, then shows the spread of outcomes instead of a single guess." },
    { q: "Why do the numbers change each time?", a: "Each run draws fresh random paths, so results wobble a little. The percentiles stay in a stable range — that range is the point." },
    { q: "What return and volatility should I use?", a: "Use realistic long-run estimates. Crypto historically has very high volatility (60%+ annually), which widens the range of outcomes dramatically." },
  ],
};

export default tool;
