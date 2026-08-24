import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

/**
 * The point of this tool is the verdict, not the arithmetic.
 *
 * Grid spacing has to exceed twice the trading fee before a completed grid
 * trade earns anything at all — buy and sell are both charged. Someone setting
 * 100 grids on a 5% range at a 0.1% fee is paying 0.2% to earn 0.05%, and the
 * bot will execute that losing trade hundreds of times while looking busy.
 * Every other grid calculator will happily print "0.05%" and let them get on
 * with it. This one says the configuration loses money.
 */
const tool: ToolConfig = {
  slug: "grid-calculator",
  updatedAt: "2026-08-06",
  title: "Grid Trading Calculator",
  description:
    "Plan a grid bot and find out whether the settings can make money at all — spacing, profit per grid after fees, capital per order, and a warning when the grid is too tight to clear its own costs.",
  category: "grid",
  affiliate: "bot",
  featured: true,
  popular: true,
  source: "builtin",
  seo: {
    keywords: [
      "grid trading calculator",
      "grid bot calculator",
      "crypto grid calculator",
      "grid profit calculator",
      "spot grid calculator",
      "grid trading",
      "grid bot profit",
    ],
    description:
      "Free grid trading calculator. Enter your range, grid count and fee to see profit per grid, total profit per full cycle, and whether the spacing clears your trading fee.",
  },
  inputs: [
    { name: "upper", label: "Upper price", type: "number", suffix: "USD", default: 35000, min: 0, step: 0.01 },
    { name: "lower", label: "Lower price", type: "number", suffix: "USD", default: 25000, min: 0, step: 0.01 },
    { name: "grids", label: "Number of grids", type: "number", default: 20, min: 2, step: 1 },
    { name: "investment", label: "Total investment", type: "number", suffix: "USD", default: 1000, min: 0, step: 1 },
    { name: "feePct", label: "Fee per trade", type: "number", suffix: "%", default: 0.1, min: 0, step: 0.01, optional: true },
    {
      name: "spacing",
      label: "Grid spacing",
      type: "select",
      default: "arithmetic",
      options: [
        { value: "arithmetic", label: "Arithmetic — equal $ gap" },
        { value: "geometric", label: "Geometric — equal % gap" },
      ],
      help: "Use geometric when the top of your range is more than ~30% above the bottom.",
    },
  ],
  resultLabel: "Net profit per grid",
  compute: (i) => {
    const upper = Number(i.upper);
    const lower = Number(i.lower);
    const grids = Math.max(2, Math.floor(Number(i.grids)));
    const investment = Number(i.investment);
    const feePct = Number(i.feePct) || 0;
    const geometric = String(i.spacing) === "geometric";

    if (!(upper > lower) || !(lower > 0)) {
      return { value: "—", note: "Upper price must be greater than the lower price, and both above zero." };
    }

    const levels = grids;
    const steps = levels - 1;

    // Arithmetic: every step is the same number of dollars, so the percentage
    // earned shrinks as price rises — the worst step is the one at the top.
    // Geometric: every step is the same percentage by construction.
    const ratio = Math.pow(upper / lower, 1 / steps);
    const arithStep = (upper - lower) / steps;

    const grossPctAtBottom = geometric ? (ratio - 1) * 100 : (arithStep / lower) * 100;
    const grossPctAtTop = geometric ? (ratio - 1) * 100 : (arithStep / (upper - arithStep)) * 100;
    // The honest headline is the WORST step, not the best one: if the top of
    // the grid is unprofitable, the bot still trades it.
    const worstGrossPct = Math.min(grossPctAtBottom, grossPctAtTop);

    const feeCost = feePct * 2;
    const netAtBottom = grossPctAtBottom - feeCost;
    const netWorst = worstGrossPct - feeCost;
    const capitalPerGrid = investment / levels;

    // One "full cycle" = price walks from the bottom of the range to the top,
    // filling every step once. Not a promise — an upper bound on one pass.
    const profitPerCycle = steps * capitalPerGrid * (netAtBottom / 100);

    const unprofitable = netWorst <= 0;
    const thin = !unprofitable && worstGrossPct < feeCost * 3;

    const breakdown = [
      {
        label: geometric ? "Step size (equal %)" : "Step size (equal $)",
        value: geometric ? `${fmtNumber((ratio - 1) * 100)}%` : fmtUsd(arithStep),
      },
      { label: "Gross per grid — bottom of range", value: `${fmtNumber(grossPctAtBottom)}%` },
      { label: "Gross per grid — top of range", value: `${fmtNumber(grossPctAtTop)}%` },
      { label: "Round-trip fee cost", value: `${fmtNumber(feeCost)}%` },
      { label: "Net per grid (worst step)", value: `${fmtNumber(netWorst)}%`, emphasis: true },
      { label: "Capital per order", value: fmtUsd(capitalPerGrid) },
      { label: "Profit if price crosses the whole range once", value: fmtUsd(profitPerCycle) },
    ];

    return {
      value: `${fmtNumber(netWorst)}%`,
      // A loss must not be painted in the brand's success gradient.
      tone: unprofitable ? "negative" : thin ? "neutral" : "positive",
      label: unprofitable ? "This grid loses money on every trade" : "Net profit per completed grid",
      breakdown,
      note: unprofitable
        ? `Your spacing is smaller than the ${fmtNumber(feeCost)}% it costs to buy and sell once, so every completed grid trade loses money — the bot will keep making them regardless. Widen the range, or cut the grid count to about ${Math.max(2, Math.floor(steps * (worstGrossPct / (feeCost * 3))) + 1)}.`
        : thin
          ? `This works, but only just: the worst step clears the fee by a small margin, so a fee-tier change or a slightly wider spread would push it negative. Aim for spacing at least three times the round-trip fee.`
          : `The "full range" figure assumes price walks from the bottom to the top filling every step once, and never comes back. It is an upper bound on one pass, not a forecast — and if price leaves the range downward you hold the whole position instead.`,
    };
  },
  relatedSlugs: ["dca-bot-calculator", "trading-fee-calculator", "liquidation-calculator", "profit-calculator"],
  faq: [
    {
      q: "How does grid trading work?",
      a: "A grid bot places staggered buy orders below the price and sell orders above it across a range you choose. Each time price falls to a level it buys, and each time it rises to the next level up it sells — collecting the gap between them.",
    },
    {
      q: "Why does this calculator show two gross figures?",
      a: "Because an arithmetic grid does not pay the same percentage at every level. Equal dollar steps are a bigger percentage near the bottom of the range than near the top, so the top steps earn least — and those are the ones most likely to fall below your fee. A geometric grid shows the same figure twice, because equal percentage steps are the whole idea.",
    },
    {
      q: "What makes a grid unprofitable?",
      a: "Spacing smaller than twice your trading fee. A completed grid trade is a buy and a sell, so you pay the fee twice; if the gap between levels is narrower than that, every trade is a guaranteed small loss. This is the single most common way grid bots lose money.",
    },
    {
      q: "How many grids should I use?",
      a: "Work back from your fee rather than picking a round number: divide the range percentage by at least six times your fee percentage. Then check the capital per order against your exchange's minimum order size — a hundred levels on a small balance often produces orders too small to place.",
    },
    {
      q: "Is the 'full range' profit what I will actually earn?",
      a: "No. It is what one complete pass from the bottom of the range to the top would produce if every step filled once. Real price paths oscillate, so you may earn it several times over — or leave the range and earn none of it while holding a position bought on the way down.",
    },
  ],
};

export default tool;
