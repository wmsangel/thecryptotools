import type { ToolConfig, ToolResultRow } from "../types";
import { fmtNumber, fmtUsd } from "@/lib/format";

/**
 * Models a 3Commas-style DCA bot: one base order plus a ladder of safety
 * orders, each triggered a further step down and each (optionally) larger than
 * the last. The numbers traders actually need are the capital the ladder can
 * demand and how far the price can fall before the bot runs out of orders.
 */
const tool: ToolConfig = {
  slug: "dca-bot-calculator",
  title: "DCA Bot Calculator",
  description:
    "Plan a DCA bot's safety-order ladder: total capital required, how far the price can fall before you run out of orders, and the average entry the ladder leaves you with.",
  category: "trading",
  popular: true,
  source: "builtin",
  updatedAt: "2026-07-31",
  seo: {
    keywords: [
      "dca bot calculator",
      "safety order calculator",
      "3commas dca bot calculator",
      "dca bot settings calculator",
      "crypto trading bot calculator",
      "average down bot calculator",
    ],
    description:
      "Free DCA bot calculator. Enter base order, safety order size, step scale and volume scale to see max capital, price deviation covered and average entry price.",
  },
  inputs: [
    { name: "entry", label: "Entry price", type: "number", suffix: "USD", default: 100, min: 0, step: 0.00001, livePrice: true },
    { name: "baseOrder", label: "Base order size", type: "number", suffix: "USD", default: 50, min: 0, step: 1, help: "The first buy, placed immediately." },
    { name: "safetyOrder", label: "Safety order size", type: "number", suffix: "USD", default: 100, min: 0, step: 1, help: "Size of the first safety order." },
    { name: "maxOrders", label: "Max safety orders", type: "number", suffix: "orders", default: 5, min: 0, max: 50, step: 1 },
    { name: "deviation", label: "Price deviation to trigger", type: "number", suffix: "%", default: 2, min: 0.01, step: 0.1, help: "Drop from the last fill that opens the next safety order." },
    { name: "stepScale", label: "Safety order step scale", type: "number", default: 1.5, min: 0.1, step: 0.1, help: "Multiplies each successive deviation. 1 = evenly spaced." },
    { name: "volumeScale", label: "Safety order volume scale", type: "number", default: 1.5, min: 0.1, step: 0.1, help: "Multiplies each successive order size. 1 = all the same." },
    { name: "takeProfit", label: "Take profit", type: "number", suffix: "%", default: 1.5, min: 0, step: 0.1, optional: true, help: "Target above the average entry." },
  ],
  resultLabel: "Max capital required",
  precision: 2,
  relatedSlugs: ["dca-calculator", "average-entry-calculator", "grid-calculator", "position-size-calculator"],
  compute: (i) => {
    const entry = Number(i.entry);
    const baseOrder = Number(i.baseOrder);
    const safetyOrder = Number(i.safetyOrder);
    const maxOrders = Math.max(0, Math.min(50, Math.round(Number(i.maxOrders))));
    const deviation = Number(i.deviation);
    const stepScale = Number(i.stepScale);
    const volumeScale = Number(i.volumeScale);
    const takeProfit = Number(i.takeProfit) || 0;

    if (!(entry > 0) || !(baseOrder > 0)) {
      return { value: "—", note: "Enter an entry price and a base order above zero." };
    }

    let spent = baseOrder;
    let coins = baseOrder / entry;
    let step = deviation;
    let cumulativeDeviation = 0;
    let orderSize = safetyOrder;
    let lastPrice = entry;
    let filled = 0;

    for (let n = 1; n <= maxOrders; n += 1) {
      cumulativeDeviation += step;
      if (cumulativeDeviation >= 100) break; // the ladder has run past a total loss
      const price = entry * (1 - cumulativeDeviation / 100);
      if (!(price > 0)) break;
      spent += orderSize;
      coins += orderSize / price;
      lastPrice = price;
      filled = n;
      step *= stepScale;
      orderSize *= volumeScale;
    }

    const avgEntry = coins > 0 ? spent / coins : 0;
    const coverage = filled > 0 ? ((entry - lastPrice) / entry) * 100 : 0;
    const drawdownAtBottom = avgEntry > 0 ? ((lastPrice - avgEntry) / avgEntry) * 100 : 0;
    const tpPrice = avgEntry * (1 + takeProfit / 100);
    const tpProfit = coins * avgEntry * (takeProfit / 100);
    const bounceNeeded = lastPrice > 0 ? ((tpPrice - lastPrice) / lastPrice) * 100 : 0;

    const breakdown: ToolResultRow[] = [
      { label: "Max capital required", value: fmtUsd(spent), emphasis: true },
      { label: "Safety orders that fit", value: `${filled} of ${maxOrders}` },
      { label: "Price deviation covered", value: `${fmtNumber(coverage)}%` },
      { label: "Lowest order fills at", value: fmtUsd(lastPrice, lastPrice < 1 ? 6 : 2) },
      { label: "Average entry if fully filled", value: fmtUsd(avgEntry, avgEntry < 1 ? 6 : 2) },
      { label: "Position at the bottom", value: `${fmtNumber(drawdownAtBottom)}% underwater` },
      { label: "Total coins", value: fmtNumber(coins, coins < 1 ? 6 : 4) },
    ];

    if (takeProfit > 0) {
      breakdown.push(
        { label: "Take-profit price", value: fmtUsd(tpPrice, tpPrice < 1 ? 6 : 2) },
        { label: "Profit if fully filled then hit", value: fmtUsd(tpProfit) },
        { label: "Bounce needed from the bottom", value: `${fmtNumber(bounceNeeded)}%` },
      );
    }

    let note = `This ladder can demand ${fmtUsd(spent)} — ${fmtNumber(spent / baseOrder)}× the base order — and survives a ${fmtNumber(coverage)}% drop before it runs out of safety orders.`;
    if (filled < maxOrders) {
      note += ` Only ${filled} safety orders fit: the step scale pushes the rest below zero.`;
    }
    if (coverage < 15) {
      note += " Under 15% coverage is thin for crypto — a normal correction exhausts the ladder and leaves the bot holding a bag with no orders left.";
    }

    return { value: fmtUsd(spent), note, breakdown };
  },
  faq: [
    {
      q: "How much capital does a DCA bot actually need?",
      a: "Far more than the base order suggests. With a volume scale above 1 each safety order is larger than the last, so a $50 base order with five scaled safety orders can commit well over $1,000. This calculator shows the worst case — the amount you must have free if every order fills — and that is the number to size your account against, per bot.",
    },
    {
      q: "What is a safety order?",
      a: "An additional buy the bot places when the price falls a set percentage below the previous fill. It averages your entry down so the position needs a smaller bounce to reach the take-profit. The trade-off is that each one increases position size exactly when the trade is going against you.",
    },
    {
      q: "What do step scale and volume scale do?",
      a: "Step scale multiplies the gap between successive safety orders, so the ladder spreads wider the further the price falls — that buys you deviation coverage. Volume scale multiplies each order's size, so later, cheaper fills pull the average entry down harder. Both raise capital requirements; volume scale raises it fastest.",
    },
    {
      q: "What deviation coverage should I aim for?",
      a: "Enough to survive an ordinary correction in the pair you are trading. Crypto majors routinely draw down 20–30%, and altcoins far more. A ladder that only covers 10% will be fully filled on a normal week and then simply holds a losing position with no capital left to respond.",
    },
    {
      q: "Why did my DCA bot get stuck holding a bag?",
      a: "Because the ladder ran out. Once every safety order has filled, the bot has no further action but to wait for the take-profit, which may be far above the market. DCA bots work in ranging and rising markets; a sustained downtrend is the failure case, and no setting removes that risk — it only moves the price at which it happens.",
    },
  ],
};

export default tool;
