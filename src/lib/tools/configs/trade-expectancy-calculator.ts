import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "trade-expectancy-calculator",
  updatedAt: "2026-07-31",
  title: "Trade Expectancy Calculator",
  description:
    "Find out whether a trading system makes money on average — expectancy per trade in dollars and R, plus the break-even win rate.",
  category: "trading",
  source: "builtin",
  seo: {
    keywords: [
      "trade expectancy calculator",
      "trading expectancy",
      "expectancy calculator",
      "break even win rate",
      "trading system expectancy",
    ],
    description:
      "Free trading expectancy calculator. Enter win rate, average win and average loss to see expectancy per trade and your break-even win rate.",
  },
  inputs: [
    { name: "winRate", label: "Win rate", type: "number", suffix: "%", default: 45, min: 0, max: 100, step: 1 },
    { name: "avgWin", label: "Average win", type: "number", suffix: "USD", default: 300, min: 0, step: 1 },
    { name: "avgLoss", label: "Average loss", type: "number", suffix: "USD", default: 150, min: 0, step: 1 },
    { name: "perMonth", label: "Trades per month", type: "number", default: 20, min: 0, step: 1, optional: true },
  ],
  resultLabel: "Expectancy per trade",
  resultUnit: "USD",
  compute: (i) => {
    const winRate = Number(i.winRate) / 100;
    const avgWin = Number(i.avgWin);
    const avgLoss = Number(i.avgLoss);
    const perMonth = Number(i.perMonth) || 0;

    const expectancy = winRate * avgWin - (1 - winRate) * avgLoss;
    const rr = avgLoss > 0 ? avgWin / avgLoss : 0;
    const expR = avgLoss > 0 ? expectancy / avgLoss : 0;
    const breakEvenWr = avgWin + avgLoss > 0 ? (avgLoss / (avgWin + avgLoss)) * 100 : 0;

    return {
      value: fmtUsd(expectancy),
      note:
        expectancy >= 0
          ? "Positive expectancy — the system makes money on average per trade."
          : "Negative expectancy — this system loses money on average. Improve win rate or reward:risk.",
      breakdown: [
        { label: "Expectancy in R", value: `${fmtNumber(expR, 2)}R`, emphasis: true },
        { label: "Reward : risk", value: `${fmtNumber(rr)} : 1` },
        { label: "Break-even win rate", value: `${fmtNumber(breakEvenWr)}%` },
        { label: "Monthly expectancy", value: fmtUsd(expectancy * perMonth) },
      ],
    };
  },
  relatedSlugs: ["win-rate-calculator", "kelly-criterion-calculator", "risk-of-ruin-calculator"],
  faq: [
    { q: "What is trading expectancy?", a: "The average profit or loss you can expect per trade: (win rate × average win) − (loss rate × average loss). Positive means the system is profitable over many trades." },
    { q: "What is 'R'?", a: "R is your risk unit — one average loss. Expressing expectancy in R (e.g. 0.3R) lets you compare systems regardless of position size." },
    { q: "What's the break-even win rate?", a: "The win rate at which expectancy is exactly zero, given your reward:risk. Above it you're profitable; below it you lose money even with winners." },
  ],
};

export default tool;
