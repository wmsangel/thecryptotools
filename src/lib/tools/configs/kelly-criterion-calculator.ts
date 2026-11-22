import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "kelly-criterion-calculator",
  updatedAt: "2026-11-22",
  title: "Kelly Criterion Calculator",
  description:
    "Find the mathematically optimal position size from your win rate and win/loss ratio using the Kelly Criterion — with a safer half-Kelly, and where it breaks down in crypto.",
  category: "trading",
  source: "builtin",
  seo: {
    keywords: [
      "kelly criterion calculator",
      "crypto kelly criterion limitations",
      "kelly criterion limitations",
      "position sizing calculator",
      "optimal bet size",
      "kelly formula",
      "risk management calculator crypto",
    ],
    description:
      "Free Kelly Criterion calculator for traders. Enter win rate and payoff ratio to get the optimal and half-Kelly stake size.",
  },
  inputs: [
    { name: "winRate", label: "Win rate", type: "number", suffix: "%", default: 55, min: 0, max: 100, step: 1 },
    { name: "ratio", label: "Win / loss ratio", type: "number", suffix: ": 1", default: 2, min: 0.01, step: 0.1, help: "Average win divided by average loss." },
    { name: "bankroll", label: "Account size", type: "number", suffix: "USD", default: 10000, min: 0, step: 1, optional: true },
  ],
  resultLabel: "Optimal stake (Kelly)",
  compute: (i) => {
    const w = Number(i.winRate) / 100;
    const r = Number(i.ratio);
    const bankroll = Number(i.bankroll) || 0;

    // Kelly fraction: f = W - (1 - W) / R
    const fRaw = r > 0 ? w - (1 - w) / r : 0;
    const f = Math.max(0, fRaw);
    const half = f / 2;
    const hasEdge = fRaw > 0;

    return {
      value: `${fmtNumber(f * 100)}%`,
      note: hasEdge
        ? "Full Kelly maximizes long-term growth but is volatile — most traders use half-Kelly."
        : "Your edge is zero or negative here — Kelly suggests not taking this trade.",
      breakdown: [
        { label: "Full Kelly", value: `${fmtNumber(f * 100)}%` },
        { label: "Half Kelly (safer)", value: `${fmtNumber(half * 100)}%`, emphasis: true },
        { label: "Suggested stake (full)", value: fmtUsd(bankroll * f) },
        { label: "Suggested stake (half)", value: fmtUsd(bankroll * half) },
      ],
    };
  },
  relatedSlugs: ["win-rate-calculator", "trade-expectancy-calculator", "position-size-calculator"],
  article: [
    { type: "h2", text: "What the Kelly criterion assumes" },
    {
      type: "p",
      text: "Kelly gives the bet fraction that maximizes long-term growth — but only under assumptions that rarely hold cleanly in crypto. It assumes you know your true win rate and payoff ratio, that each trade is independent and drawn from the same distribution, that you can stake an exact fraction every time, and that there are no costs. The formula is only as good as those assumptions, and that is where its limits start.",
    },
    { type: "h2", text: "Limitations of the Kelly criterion in crypto trading" },
    {
      type: "ul",
      items: [
        "Your inputs are estimates, not facts. Win rate and win/loss ratio are measured from a limited, backward-looking sample. Overstate your edge even slightly and Kelly tells you to bet too much — and the overbet compounds against you.",
        "Full Kelly is brutally volatile. It maximizes growth but routinely draws down 50% or more; most practitioners run half-Kelly or less to keep a survivable equity curve.",
        "Crypto trades are not independent. Positions are correlated, markets shift regime, and returns have fat tails — a run of losses is far more likely than the i.i.d. maths assumes, so real drawdowns exceed the model's.",
        "Leverage changes the game. Kelly sizes a fraction of capital; with liquidation, a single adverse move can end the sequence the formula assumes continues forever.",
        "It ignores costs and simultaneous bets. Fees, slippage and funding eat the edge, and holding several correlated positions at once stacks risk the single-bet formula never sees.",
        "It optimizes growth, not comfort or ruin-avoidance. The 'optimal' fraction can be psychologically unholdable and leaves no margin for an input you got wrong.",
      ],
    },
    { type: "h2", text: "How to use it safely" },
    {
      type: "p",
      text: "Treat the Kelly fraction as a ceiling, not a target. Size down to half-Kelly or a quarter-Kelly, re-estimate your win rate and payoff from a large sample rather than your best month, and cap total exposure across correlated positions. The calculator shows both full and half-Kelly for exactly this reason: the half figure is the one most traders should actually use.",
    },
  ],
  faq: [
    { q: "What is the Kelly Criterion?", a: "A formula for the bet size that maximizes long-term capital growth: f = W − (1 − W) / R, where W is your win probability and R is your average win divided by average loss." },
    { q: "What are the limitations of the Kelly criterion?", a: "It assumes you know your true win rate and payoff, that bets are independent and identically distributed, and that there are no costs — none of which hold cleanly in crypto. Inputs are estimates, so overstating your edge makes Kelly overbet; full Kelly is extremely volatile; correlated trades, regime shifts and fat tails make real drawdowns worse than the model; and leverage with liquidation breaks the assumption of an endless sequence. Use fractional (half or quarter) Kelly to compensate." },
    { q: "Why use half-Kelly?", a: "Full Kelly gives the fastest growth but big drawdowns and is very sensitive to wrong inputs. Half-Kelly keeps most of the growth with far less volatility." },
    { q: "What if the result is 0%?", a: "It means your win rate and payoff don't give you a positive edge, so the maths says the optimal bet is nothing. Improve your edge before sizing up." },
  ],
};

export default tool;
