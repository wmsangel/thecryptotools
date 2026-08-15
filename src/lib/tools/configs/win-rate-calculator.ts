import type { ToolConfig } from "../types";
import { fmtNumber, fmtUsd } from "@/lib/format";

const tool: ToolConfig = {
  slug: "win-rate-calculator",
  title: "Crypto Win Rate Calculator",
  description:
    "Turn your wins and losses into a win rate, profit factor and net P&L — then compare it against the win rate your risk/reward actually requires to break even.",
  category: "trading",
  popular: true,
  source: "builtin",
  updatedAt: "2026-07-31",
  seo: {
    keywords: [
      "win rate calculator",
      "winrate calculator crypto",
      "crypto win rate calculator",
      "trading win rate calculator",
      "win loss ratio calculator",
      "profit factor calculator",
      "break even win rate calculator",
    ],
    description:
      "Free crypto win rate calculator. Enter winning and losing trades with average win and loss to get win rate, profit factor, net P&L and the break-even win rate you need.",
  },
  inputs: [
    { name: "wins", label: "Winning trades", type: "number", suffix: "trades", default: 42, min: 0, step: 1 },
    { name: "losses", label: "Losing trades", type: "number", suffix: "trades", default: 58, min: 0, step: 1 },
    { name: "avgWin", label: "Average win", type: "number", suffix: "USD", default: 320, min: 0, step: 1, help: "Average profit on a winning trade, after fees." },
    { name: "avgLoss", label: "Average loss", type: "number", suffix: "USD", default: 150, min: 0, step: 1, help: "Average loss on a losing trade, as a positive number." },
  ],
  resultLabel: "Win rate",
  precision: 2,
  relatedSlugs: ["trade-expectancy-calculator", "risk-reward-calculator", "kelly-criterion-calculator", "risk-of-ruin-calculator"],
  compute: (i) => {
    const wins = Math.max(0, Number(i.wins));
    const losses = Math.max(0, Number(i.losses));
    const avgWin = Math.max(0, Number(i.avgWin));
    const avgLoss = Math.max(0, Number(i.avgLoss));
    const total = wins + losses;

    if (total <= 0) {
      return { value: "—", note: "Enter at least one trade to calculate a win rate." };
    }

    const winRate = (wins / total) * 100;
    const grossProfit = wins * avgWin;
    const grossLoss = losses * avgLoss;
    const net = grossProfit - grossLoss;
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : Infinity;
    const rr = avgLoss > 0 ? avgWin / avgLoss : 0;
    const breakEvenWr = avgWin + avgLoss > 0 ? (avgLoss / (avgWin + avgLoss)) * 100 : 0;
    const expectancy = total > 0 ? net / total : 0;
    const edge = winRate - breakEvenWr;

    const note =
      edge >= 0
        ? `Your ${fmtNumber(winRate)}% win rate clears the ${fmtNumber(breakEvenWr)}% you need at ${fmtNumber(rr)}:1 reward-to-risk — the system has a ${fmtNumber(edge)} point edge.`
        : `Your ${fmtNumber(winRate)}% win rate is ${fmtNumber(Math.abs(edge))} points below the ${fmtNumber(breakEvenWr)}% needed at ${fmtNumber(rr)}:1 reward-to-risk. Either win more often or let winners run further.`;

    return {
      value: `${fmtNumber(winRate)}%`,
      note,
      breakdown: [
        { label: "Win rate", value: `${fmtNumber(winRate)}% (${wins} of ${total})`, emphasis: true },
        { label: "Break-even win rate needed", value: `${fmtNumber(breakEvenWr)}%` },
        { label: "Reward-to-risk", value: `${fmtNumber(rr)} : 1` },
        { label: "Win/loss ratio", value: losses > 0 ? `${fmtNumber(wins / losses)} : 1` : "no losses" },
        { label: "Profit factor", value: Number.isFinite(profitFactor) ? fmtNumber(profitFactor) : "∞" },
        { label: "Gross profit", value: fmtUsd(grossProfit) },
        { label: "Gross loss", value: fmtUsd(grossLoss) },
        { label: "Net P&L", value: fmtUsd(net) },
        { label: "Expectancy per trade", value: fmtUsd(expectancy) },
      ],
    };
  },
  faq: [
    {
      q: "How do I calculate my win rate?",
      a: "Win rate = winning trades ÷ total trades × 100. Forty-two wins out of a hundred trades is a 42% win rate. Count every closed trade, including the small scratches — quietly dropping break-even trades is the most common way traders flatter their own numbers.",
    },
    {
      q: "What is a good win rate for crypto trading?",
      a: "There is no single good number, because win rate is meaningless without reward-to-risk. A 35% win rate at 3:1 is highly profitable; a 65% win rate at 0.4:1 loses money. The figure that matters is whether your win rate beats the break-even win rate this calculator shows.",
    },
    {
      q: "What is the break-even win rate?",
      a: "The win rate at which your gains exactly cancel your losses, given your average win and average loss. It is average loss ÷ (average win + average loss). At 1:1 you need 50%, at 2:1 you need 33.3%, at 3:1 you need 25%. Anything above that line is edge.",
    },
    {
      q: "What is profit factor and how does it differ from win rate?",
      a: "Profit factor is gross profit ÷ gross loss, so it weighs how much you won rather than how often. Above 1.0 the system makes money; 1.5 or better is generally considered solid, and anything over 3 on a small sample usually means the sample is too small.",
    },
    {
      q: "How many trades do I need before my win rate means anything?",
      a: "Far more than most traders assume. Under about 30 closed trades the figure is mostly noise, and even 100 trades leaves a wide confidence band. Judge a system on expectancy over a large sample, and use the risk-of-ruin calculator to check whether the drawdowns along the way are survivable.",
    },
  ],
};

export default tool;
