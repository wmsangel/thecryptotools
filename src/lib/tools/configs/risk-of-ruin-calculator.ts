import type { ToolConfig } from "../types";
import { fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "risk-of-ruin-calculator",
  updatedAt: "2026-07-30",
  title: "Risk of Ruin Calculator",
  description:
    "Estimate the probability that a trading strategy blows up, from your win rate, risk per trade and reward-to-risk ratio via Monte Carlo.",
  category: "trading",
  source: "builtin",
  seo: {
    keywords: [
      "risk of ruin calculator",
      "trading risk of ruin",
      "probability of ruin",
      "risk management calculator",
      "blow up probability trading",
    ],
    description:
      "Free risk of ruin calculator for traders. Enter win rate, risk per trade and reward:risk to estimate the chance of a account-killing drawdown.",
  },
  inputs: [
    { name: "winRate", label: "Win rate", type: "number", suffix: "%", default: 50, min: 0, max: 100, step: 1 },
    { name: "risk", label: "Risk per trade", type: "number", suffix: "%", default: 2, min: 0.01, step: 0.1 },
    { name: "rr", label: "Reward : risk", type: "number", suffix: ": 1", default: 2, min: 0.01, step: 0.1 },
    { name: "ruin", label: "Ruin drawdown", type: "number", suffix: "%", default: 50, min: 1, max: 99, step: 1, optional: true },
    { name: "trades", label: "Trades simulated", type: "number", default: 200, min: 1, step: 10, optional: true },
  ],
  resultLabel: "Risk of ruin",
  compute: (i) => {
    const winRate = Number(i.winRate) / 100;
    const risk = Number(i.risk) / 100;
    const rr = Number(i.rr);
    const ruinDD = (Number(i.ruin) || 50) / 100;
    const trades = Math.max(1, Math.round(Number(i.trades) || 200));

    const sims = 3000;
    const ruinLevel = 1 - ruinDD;
    let ruined = 0;
    for (let s = 0; s < sims; s++) {
      let cap = 1;
      for (let t = 0; t < trades; t++) {
        cap *= Math.random() < winRate ? 1 + risk * rr : 1 - risk;
        if (cap <= ruinLevel) {
          ruined++;
          break;
        }
      }
    }
    const ror = (ruined / sims) * 100;
    const evPerTrade = (winRate * risk * rr - (1 - winRate) * risk) * 100;

    return {
      value: `${fmtNumber(ror, 1)}%`,
      note: `Monte Carlo over 3,000 sequences of ${trades} trades. "Ruin" = a ${fmtNumber(ruinDD * 100, 0)}% drawdown.`,
      breakdown: [
        { label: "Expected value / trade", value: `${fmtNumber(evPerTrade, 3)}% of capital`, emphasis: true },
        { label: "Win rate", value: `${fmtNumber(winRate * 100, 0)}%` },
        { label: "Risk per trade", value: `${fmtNumber(risk * 100)}%` },
        { label: "Reward : risk", value: `${fmtNumber(rr)} : 1` },
      ],
    };
  },
  faq: [
    { q: "What is risk of ruin?", a: "The probability that a string of losses drags your account down to a level you define as 'ruined' (here, a chosen drawdown). Even a profitable edge can have meaningful ruin risk if you bet too big." },
    { q: "How do I lower it?", a: "Risk less per trade, improve your win rate or reward-to-risk, and avoid over-leveraging. Halving your risk per trade usually cuts ruin risk sharply." },
    { q: "Why does the result vary slightly?", a: "It's a Monte Carlo estimate using random trade sequences, so it moves a little between runs while staying in a consistent range." },
  ],
};

export default tool;
