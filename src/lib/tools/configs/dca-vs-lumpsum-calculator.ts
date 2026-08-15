import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "dca-vs-lump-sum-calculator",
  updatedAt: "2026-07-13",
  title: "DCA vs Lump Sum Calculator",
  description:
    "Compare investing all at once versus dollar-cost averaging — see which strategy leaves you with more at your exit price.",
  category: "trading",
  popular: true,
  source: "builtin",
  seo: {
    keywords: [
      "dca vs lump sum calculator",
      "lump sum vs dca",
      "dollar cost averaging comparison",
      "dca or lump sum crypto",
      "investment strategy calculator",
    ],
    description:
      "Free DCA vs lump sum calculator. Compare buying all at once versus averaging in, based on your prices and exit.",
  },
  inputs: [
    { name: "total", label: "Total to invest", type: "number", suffix: "USD", default: 10000, min: 0, step: 1 },
    { name: "lumpPrice", label: "Lump-sum buy price", type: "number", suffix: "USD", default: 30000, min: 0, step: 0.01 },
    { name: "dcaAvg", label: "DCA average price", type: "number", suffix: "USD", default: 27000, min: 0, step: 0.01 },
    { name: "exit", label: "Exit price", type: "number", suffix: "USD", default: 35000, min: 0, step: 0.01 },
  ],
  resultLabel: "Better strategy",
  compute: (i) => {
    const total = Number(i.total);
    const lumpPrice = Number(i.lumpPrice);
    const dcaAvg = Number(i.dcaAvg);
    const exit = Number(i.exit);

    const lumpCoins = lumpPrice > 0 ? total / lumpPrice : 0;
    const dcaCoins = dcaAvg > 0 ? total / dcaAvg : 0;
    const lumpFinal = lumpCoins * exit;
    const dcaFinal = dcaCoins * exit;
    const diff = dcaFinal - lumpFinal;
    const winner = diff > 0 ? "DCA wins" : diff < 0 ? "Lump sum wins" : "Tie";

    return {
      value: winner,
      label: `by ${fmtUsd(Math.abs(diff))}`,
      breakdown: [
        { label: "Lump-sum final value", value: fmtUsd(lumpFinal) },
        { label: "DCA final value", value: fmtUsd(dcaFinal) },
        { label: "Difference", value: fmtUsd(Math.abs(diff)), emphasis: true },
        { label: "DCA coins vs lump coins", value: `${fmtNumber(dcaCoins, 4)} vs ${fmtNumber(lumpCoins, 4)}` },
      ],
    };
  },
  faq: [
    { q: "Is DCA better than lump sum?", a: "It depends on price. DCA wins when your average buy price ends up below the lump-sum price; lump sum wins when you buy the dip in one go." },
    { q: "How does this calculator compare them?", a: "It buys the same total at each strategy's price to get coin counts, then values both at your exit price." },
    { q: "Which is less risky?", a: "DCA spreads out timing risk and emotion, which is why many long-term investors prefer it despite sometimes lower returns." },
  ],
};

export default tool;
