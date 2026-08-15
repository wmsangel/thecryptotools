import type { ToolConfig, ToolResultRow } from "../types";
import { fmtNumber, fmtUsd } from "@/lib/format";

const tool: ToolConfig = {
  slug: "take-profit-ladder-calculator",
  title: "Take Profit Ladder Calculator",
  description:
    "Plan a scale-out exit: split your position across several take-profit levels and see the proceeds at each rung, your blended exit price, and the point where you have recovered your capital.",
  category: "trading",
  featured: true,
  source: "builtin",
  updatedAt: "2026-08-03",
  seo: {
    keywords: [
      "take profit calculator",
      "take profit ladder calculator",
      "crypto exit strategy calculator",
      "scale out calculator crypto",
      "sell in tranches calculator",
      "profit taking calculator crypto",
      "crypto exit plan calculator",
    ],
    description:
      "Free crypto take profit ladder calculator. Split a position across up to five exit levels and see proceeds per rung, blended exit price and when your capital is back.",
  },
  inputs: [
    { name: "entry", label: "Average entry price", type: "number", suffix: "USD", default: 100, min: 0, step: 0.00000001, livePrice: true },
    { name: "amount", label: "Position size", type: "number", suffix: "coins", default: 100, min: 0, step: 0.00000001 },
    { name: "levels", label: "Exit prices", type: "text", default: "150, 200, 300, 500", help: "Comma-separated, lowest first. Up to 5 rungs." },
    { name: "weights", label: "Percent sold at each level", type: "text", default: "25, 25, 25, 25", help: "Comma-separated, same order. Anything under 100% leaves a moon bag." },
    { name: "fee", label: "Exit fee per sale", type: "number", suffix: "%", default: 0.1, min: 0, max: 5, step: 0.01, optional: true },
  ],
  resultLabel: "Total proceeds",
  precision: 2,
  relatedSlugs: ["stop-loss-take-profit-calculator", "profit-calculator", "target-price-calculator", "average-entry-calculator"],
  compute: (i) => {
    const entry = Number(i.entry);
    const amount = Number(i.amount);
    const feePct = Number(i.fee) || 0;

    const parse = (raw: unknown) =>
      String(raw ?? "")
        .split(/[,\s]+/)
        .map((s) => Number(s))
        .filter((n) => isFinite(n) && n > 0)
        .slice(0, 5);

    const levels = parse(i.levels);
    const weights = parse(i.weights);

    if (!(entry > 0) || !(amount > 0)) {
      return { value: "—", note: "Enter an entry price and a position size above zero." };
    }
    if (levels.length === 0) {
      return { value: "—", note: "Enter at least one exit price, e.g. 150, 200, 300." };
    }
    if (weights.length !== levels.length) {
      return {
        value: "—",
        note: `You listed ${levels.length} exit price${levels.length === 1 ? "" : "s"} but ${weights.length} percentage${weights.length === 1 ? "" : "s"}. They must line up one-to-one.`,
      };
    }

    const totalWeight = weights.reduce((a, b) => a + b, 0);
    if (totalWeight > 100.0001) {
      return { value: "—", note: `Your percentages add up to ${fmtNumber(totalWeight)}% — you cannot sell more than the whole position.` };
    }

    const cost = entry * amount;
    let proceeds = 0;
    let coinsSold = 0;
    let feesPaid = 0;
    let capitalBackRung: number | null = null;

    const breakdown: ToolResultRow[] = [];

    levels.forEach((price, idx) => {
      const pct = weights[idx];
      const coins = amount * (pct / 100);
      const gross = coins * price;
      const fee = gross * (feePct / 100);
      const net = gross - fee;

      proceeds += net;
      coinsSold += coins;
      feesPaid += fee;

      // The rung at which cumulative net proceeds first cover the whole entry cost.
      if (capitalBackRung === null && proceeds >= cost) capitalBackRung = idx;

      const gainPct = ((price - entry) / entry) * 100;
      breakdown.push({
        label: `Rung ${idx + 1} — sell ${fmtNumber(pct)}% at ${fmtUsd(price, price < 1 ? 6 : 2)} (${gainPct >= 0 ? "+" : ""}${fmtNumber(gainPct)}%)`,
        value: `${fmtNumber(coins)} coins → ${fmtUsd(net)}`,
      });
    });

    const remaining = amount - coinsSold;
    const blended = coinsSold > 0 ? proceeds / coinsSold : 0;
    const soldCost = entry * coinsSold;
    const realisedProfit = proceeds - soldCost;
    const roi = soldCost > 0 ? (realisedProfit / soldCost) * 100 : 0;

    breakdown.push(
      { label: "Total realised proceeds", value: fmtUsd(proceeds), emphasis: true },
      { label: "Blended exit price", value: fmtUsd(blended, blended < 1 ? 6 : 2) },
      { label: "Cost of the coins sold", value: fmtUsd(soldCost) },
      { label: "Realised profit", value: fmtUsd(realisedProfit) },
      { label: "Return on the sold portion", value: `${roi >= 0 ? "+" : ""}${fmtNumber(roi)}%` },
    );

    if (feesPaid > 0) breakdown.push({ label: "Fees paid across all rungs", value: fmtUsd(feesPaid) });

    if (remaining > 1e-12) {
      breakdown.push({
        label: `Moon bag left (${fmtNumber((remaining / amount) * 100)}% of the position)`,
        value: `${fmtNumber(remaining)} coins`,
      });
    }

    let note = `Selling this ladder returns ${fmtUsd(proceeds)} at a blended exit of ${fmtUsd(blended, blended < 1 ? 6 : 2)} — ${fmtNumber(((blended - entry) / entry) * 100)}% above your entry.`;
    if (capitalBackRung !== null) {
      const p = levels[capitalBackRung];
      note += ` Your original ${fmtUsd(cost)} is fully recovered by rung ${capitalBackRung + 1} at ${fmtUsd(p, p < 1 ? 6 : 2)} — everything after that is house money.`;
    } else {
      note += ` This ladder does not recover the full ${fmtUsd(cost)} you put in; you would need higher rungs or a larger percentage sold early.`;
    }
    if (remaining > 1e-12) {
      note += ` ${fmtNumber(remaining)} coins are left running with no exit planned.`;
    }

    return { value: fmtUsd(proceeds), note, breakdown };
  },
  faq: [
    {
      q: "What is a take profit ladder?",
      a: "Instead of picking one price to sell everything, you set several targets and sell a slice at each. It guarantees you capture some of a move rather than all or nothing, and removes the need to call the exact top.",
    },
    {
      q: "How should I split the percentages across rungs?",
      a: "There is no optimal split, only a trade-off. Front-loading (selling more at the lower rungs) recovers your capital fastest and cuts risk; back-loading captures more if the move keeps extending. A common compromise is to size the first rung so it returns your original stake.",
    },
    {
      q: "What is the blended exit price?",
      a: "The single price that would have produced the same proceeds if you had sold the whole sold portion at once — total proceeds divided by coins sold. It is the honest number to compare against a one-shot exit.",
    },
    {
      q: "What is a moon bag?",
      a: "The portion you deliberately never sell. Leaving 10–25% unsold keeps upside open indefinitely, at the cost of those coins contributing nothing if the price round-trips. Set the percentages to add up to less than 100 to model one.",
    },
    {
      q: "Should the ladder be spaced evenly or by percentage?",
      a: "Percentage spacing usually makes more sense for crypto, because moves are multiplicative. Rungs at +50%, +100%, +200% and +400% represent comparable steps of conviction; evenly spaced dollar rungs bunch up at the top of a large move.",
    },
    {
      q: "Do exit fees matter on a ladder?",
      a: "More than on a single exit, since you pay them several times. At 0.1% per sale a four-rung ladder costs about 0.1% of the position in total — small, but taker fees of 0.4–0.6% across five rungs start to bite into the edge you are laddering for.",
    },
  ],
};

export default tool;
