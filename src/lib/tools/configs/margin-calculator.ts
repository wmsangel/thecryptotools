import type { ToolConfig, ToolResultRow } from "../types";
import { fmtNumber, fmtUsd } from "@/lib/format";

const tool: ToolConfig = {
  slug: "margin-calculator",
  title: "Crypto Margin Calculator",
  description:
    "Work out the initial margin a leveraged position requires, the maintenance margin that keeps it open, your current margin ratio, and how far price can move before a margin call.",
  category: "trading",
  featured: true,
  source: "builtin",
  updatedAt: "2026-08-03",
  seo: {
    keywords: [
      "margin calculator",
      "crypto margin calculator",
      "initial margin calculator",
      "maintenance margin calculator crypto",
      "margin call calculator",
      "futures margin calculator",
      "margin ratio calculator crypto",
    ],
    description:
      "Free crypto margin calculator. Enter position size, leverage and maintenance margin rate to get initial margin, maintenance margin, margin ratio and the margin call price.",
  },
  inputs: [
    { name: "price", label: "Entry price", type: "number", suffix: "USD", default: 60000, min: 0, step: 0.00000001, livePrice: true },
    { name: "size", label: "Position size", type: "number", suffix: "coins", default: 0.5, min: 0, step: 0.00000001 },
    { name: "leverage", label: "Leverage", type: "number", suffix: "×", default: 10, min: 1, max: 125, step: 1 },
    { name: "mmr", label: "Maintenance margin rate", type: "number", suffix: "%", default: 0.5, min: 0, max: 50, step: 0.1, help: "From your exchange's risk-limit tier — typically 0.4–0.5% on BTC at small size, rising with position size." },
    { name: "side", label: "Direction", type: "select", default: "long", options: [{ label: "Long", value: "long" }, { label: "Short", value: "short" }] },
    { name: "extra", label: "Extra margin added", type: "number", suffix: "USD", default: 0, min: 0, step: 10, optional: true, help: "Isolated-margin top-up beyond the initial requirement." },
  ],
  resultLabel: "Initial margin required",
  precision: 2,
  relatedSlugs: ["liquidation-calculator", "leverage-calculator", "position-size-calculator", "futures-pnl-calculator"],
  compute: (i) => {
    const price = Number(i.price);
    const size = Number(i.size);
    const leverage = Number(i.leverage);
    const mmr = Number(i.mmr) / 100;
    const extra = Number(i.extra) || 0;
    const isLong = String(i.side) !== "short";

    if (!(price > 0) || !(size > 0)) {
      return { value: "—", note: "Enter an entry price and a position size above zero." };
    }
    if (!(leverage >= 1)) {
      return { value: "—", note: "Leverage must be at least 1×." };
    }

    const notional = price * size;
    const initialMargin = notional / leverage;
    const maintenanceMargin = notional * mmr;
    const equity = initialMargin + extra;

    if (maintenanceMargin >= equity) {
      return {
        value: fmtUsd(initialMargin),
        note: `At ${fmtNumber(leverage)}× the maintenance requirement of ${fmtUsd(maintenanceMargin)} already exceeds your ${fmtUsd(equity)} of margin — this position would be liquidatable the moment it opened. Reduce leverage or add margin.`,
      };
    }

    // Price at which equity has decayed to exactly the maintenance requirement.
    const lossBudget = equity - maintenanceMargin;
    const moveInPrice = lossBudget / size;
    const callPrice = isLong ? price - moveInPrice : price + moveInPrice;
    const movePct = (moveInPrice / price) * 100;

    const marginRatio = (maintenanceMargin / equity) * 100;
    const effectiveLeverage = notional / equity;
    const maxLeverage = mmr > 0 ? 1 / mmr : 0;

    const breakdown: ToolResultRow[] = [
      { label: "Position notional value", value: fmtUsd(notional) },
      { label: "Initial margin required", value: fmtUsd(initialMargin), emphasis: true },
      { label: "Maintenance margin", value: `${fmtUsd(maintenanceMargin)} (${fmtNumber(mmr * 100)}% of notional)` },
      { label: "Margin available", value: fmtUsd(equity) },
      { label: "Current margin ratio", value: `${fmtNumber(marginRatio)}% (liquidation at 100%)` },
      { label: "Effective leverage", value: `${fmtNumber(effectiveLeverage)}×` },
      { label: "Margin call / liquidation price", value: fmtUsd(callPrice, callPrice < 1 ? 6 : 2) },
      { label: "Room before that", value: `${fmtNumber(movePct)}% ${isLong ? "down" : "up"} (${fmtUsd(moveInPrice, moveInPrice < 1 ? 6 : 2)} per coin)` },
      { label: "Loss absorbed before the call", value: fmtUsd(lossBudget) },
    ];

    if (maxLeverage > 0) {
      breakdown.push({ label: "Theoretical max leverage at this maintenance rate", value: `${fmtNumber(maxLeverage)}×` });
    }

    let note = `A ${fmtNumber(size)}-coin ${isLong ? "long" : "short"} at ${fmtUsd(price, price < 1 ? 6 : 2)} is ${fmtUsd(notional)} of exposure, funded by ${fmtUsd(initialMargin)} of your own capital at ${fmtNumber(leverage)}×. It survives a ${fmtNumber(movePct)}% move against you before the maintenance requirement is breached.`;
    if (marginRatio > 60) {
      note += " That margin ratio is already high — a routine intraday wick could take it out.";
    }
    note += " Exchanges raise the maintenance rate as position size grows through their risk-limit tiers, so a large position is liquidated earlier than this figure suggests. This also excludes funding payments and fees, which eat margin over time.";

    return { value: fmtUsd(initialMargin), note, breakdown };
  },
  faq: [
    {
      q: "What is initial margin?",
      a: "The capital you must post to open a leveraged position: notional value divided by leverage. A $30,000 position at 10× needs $3,000 of initial margin. It is not a fee — it is your money, held as collateral.",
    },
    {
      q: "What is maintenance margin?",
      a: "The minimum equity the position must retain to stay open, quoted as a percentage of notional value — typically 0.4–0.5% for BTC at modest size. Once your margin falls to this level the exchange issues a margin call or liquidates the position outright.",
    },
    {
      q: "What is the margin ratio?",
      a: "Maintenance margin divided by your available margin, as a percentage. At 100% you are liquidated. Most traders treat anything above 50–60% as a position that needs reducing rather than watching.",
    },
    {
      q: "What is the difference between a margin call and liquidation?",
      a: "A margin call is a request to add collateral or reduce the position before it is closed for you. Crypto perpetuals often skip it entirely — the engine liquidates automatically at the maintenance threshold, because prices move faster than anyone can respond.",
    },
    {
      q: "How is this different from a liquidation price calculator?",
      a: "It works from the collateral side rather than the price side: how much margin the position ties up, how much of it is already committed to the maintenance requirement, and what headroom is left. The margin call price falls out of that, and should agree closely with a liquidation calculator using the same maintenance rate.",
    },
    {
      q: "Why does my exchange liquidate me earlier than this calculator says?",
      a: "Risk-limit tiers. The maintenance margin rate rises with position size, so a large position carries a higher rate than the one you may have entered. Exchanges also add a liquidation fee and deduct accrued funding, both of which pull the real trigger price closer.",
    },
  ],
};

export default tool;
