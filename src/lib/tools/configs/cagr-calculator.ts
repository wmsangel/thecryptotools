import type { ToolConfig } from "../types";
import { fmtNumber, fmtUsd } from "@/lib/format";

const tool: ToolConfig = {
  slug: "cagr-calculator",
  title: "CAGR Calculator (Compound Annual Growth Rate)",
  description:
    "Turn a start value, end value and time span into a single annualized growth rate. CAGR smooths out volatility so you can compare an investment's real yearly performance.",
  category: "portfolio",
  source: "builtin",
  updatedAt: "2026-07-25",
  seo: {
    keywords: [
      "cagr calculator",
      "compound annual growth rate calculator",
      "annualized return calculator",
      "cagr crypto",
      "cagr formula",
      "average yearly return calculator",
    ],
    description:
      "Free CAGR calculator. Enter starting value, ending value and number of years to get the compound annual growth rate and total return.",
  },
  inputs: [
    { name: "start", label: "Starting value", type: "number", suffix: "USD", default: 1000, min: 0.01, step: 1 },
    { name: "end", label: "Ending value", type: "number", suffix: "USD", default: 4000, min: 0, step: 1 },
    { name: "years", label: "Time span", type: "number", suffix: "years", default: 3, min: 0.01, step: 0.1 },
  ],
  resultLabel: "CAGR",
  precision: 2,
  relatedSlugs: ["roi-calculator", "apy-calculator", "compound-interest-calculator"],
  compute: (i) => {
    const start = Number(i.start);
    const end = Number(i.end);
    const years = Number(i.years);

    if (start <= 0 || years <= 0) {
      return { value: "—", note: "Starting value and years must be greater than zero." };
    }

    const totalReturn = (end / start - 1) * 100;
    const cagr = (Math.pow(end / start, 1 / years) - 1) * 100;
    const multiple = end / start;

    return {
      value: `${fmtNumber(cagr)}%`,
      note: cagr < 0 ? "A negative CAGR means the position lost value on an annualized basis." : "CAGR is the constant yearly rate that would grow your start value into your end value over the period.",
      breakdown: [
        { label: "Total return", value: `${fmtNumber(totalReturn)}%`, emphasis: true },
        { label: "Growth multiple", value: `${fmtNumber(multiple)}×` },
        { label: "Absolute gain", value: fmtUsd(end - start) },
      ],
    };
  },
  faq: [
    { q: "What is CAGR?", a: "Compound Annual Growth Rate is the single yearly rate that would take your starting value to your ending value over the period, assuming steady compounding. It's the standard way to compare investments over different time spans." },
    { q: "How is CAGR different from total return?", a: "Total return is the overall gain (end ÷ start − 1). CAGR spreads that gain evenly across the years so a 300% total return over 3 years becomes a ~59% CAGR." },
    { q: "Does CAGR account for volatility?", a: "No — it only uses the first and last values. A coin that soared and crashed can show the same CAGR as one that rose steadily. Use it alongside drawdown and volatility measures." },
    { q: "Can I use CAGR to project the future?", a: "You can extrapolate, but past CAGR is not a promise. Crypto rarely compounds smoothly, so treat any projection as a rough scenario, not a forecast." },
  ],
};

export default tool;
