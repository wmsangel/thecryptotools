import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "roi-calculator",
  updatedAt: "2026-07-30",
  title: "Crypto ROI Calculator",
  description:
    "Measure the return on investment of any crypto position — total ROI, profit and optional annualized return.",
  category: "trading",
  popular: true,
  source: "builtin",
  seo: {
    keywords: [
      "roi calculator",
      "crypto roi calculator",
      "return on investment calculator",
      "investment return calculator",
      "annualized roi",
    ],
    description:
      "Free ROI calculator for crypto. Enter initial and final value to see ROI %, profit and annualized return.",
  },
  inputs: [
    { name: "initial", label: "Initial investment", type: "number", suffix: "USD", default: 1000, min: 0, step: 1 },
    { name: "final", label: "Final value", type: "number", suffix: "USD", default: 2500, min: 0, step: 1 },
    { name: "days", label: "Holding period", type: "number", suffix: "days", default: 365, min: 1, step: 1, optional: true },
  ],
  resultLabel: "ROI",
  compute: (i) => {
    const initial = Number(i.initial);
    const final = Number(i.final);
    const days = Number(i.days) || 0;

    const profit = final - initial;
    const roi = initial > 0 ? (profit / initial) * 100 : 0;
    const annualized =
      initial > 0 && days > 0
        ? (Math.pow(final / initial, 365 / days) - 1) * 100
        : null;

    const breakdown = [
      { label: "Profit / loss", value: fmtUsd(profit), emphasis: true },
    ];
    if (annualized !== null) {
      breakdown.push({ label: "Annualized ROI", value: `${fmtNumber(annualized)}%`, emphasis: false });
    }

    return { value: `${fmtNumber(roi)}%`, breakdown };
  },
  faq: [
    { q: "How do I calculate ROI?", a: "ROI = (final value − initial investment) ÷ initial investment × 100. It expresses your total return as a percentage." },
    { q: "What is annualized ROI?", a: "Annualized ROI scales your return to a yearly rate, letting you compare investments held for different lengths of time." },
    { q: "Can ROI be negative?", a: "Yes — a negative ROI means the position lost value relative to your initial investment." },
  ],
};

export default tool;
