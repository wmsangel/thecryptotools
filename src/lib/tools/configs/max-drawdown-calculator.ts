import type { ToolConfig } from "../types";
import { fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "max-drawdown-calculator",
  updatedAt: "2026-07-15",
  title: "Maximum Drawdown Calculator",
  description:
    "Paste a series of prices or portfolio values to find the maximum drawdown — the largest peak-to-trough drop — and the recovery needed.",
  category: "portfolio",
  source: "builtin",
  seo: {
    keywords: [
      "max drawdown calculator",
      "maximum drawdown calculator",
      "drawdown calculator crypto",
      "peak to trough calculator",
      "portfolio drawdown",
    ],
    description:
      "Free maximum drawdown calculator. Paste a price or equity series to get the largest peak-to-trough loss and the gain needed to recover.",
  },
  inputs: [
    {
      name: "series",
      label: "Values (comma or space separated)",
      type: "text",
      default: "100, 120, 150, 90, 110, 70, 130",
      help: "Prices or account values in time order.",
    },
  ],
  resultLabel: "Maximum drawdown",
  compute: (i) => {
    const raw = String(i.series ?? "");
    const vals = raw
      .split(/[\s,;]+/)
      .map((s) => parseFloat(s))
      .filter((v) => Number.isFinite(v));

    if (vals.length < 2) {
      throw new Error("Enter at least two values, e.g. 100, 120, 90");
    }

    let peak = vals[0];
    let peakValue = vals[0];
    let troughValue = vals[0];
    let maxDD = 0;
    for (const v of vals) {
      if (v > peak) peak = v;
      const dd = peak > 0 ? (peak - v) / peak : 0;
      if (dd > maxDD) {
        maxDD = dd;
        peakValue = peak;
        troughValue = v;
      }
    }
    const recovery = troughValue > 0 ? (peakValue / troughValue - 1) * 100 : 0;

    return {
      value: `-${fmtNumber(maxDD * 100)}%`,
      note: "Maximum drawdown is the worst peak-to-trough drop in the series.",
      breakdown: [
        { label: "Peak value", value: fmtNumber(peakValue) },
        { label: "Trough value", value: fmtNumber(troughValue) },
        { label: "Gain needed to recover", value: `+${fmtNumber(recovery)}%`, emphasis: true },
        { label: "Data points", value: fmtNumber(vals.length, 0) },
      ],
    };
  },
  faq: [
    { q: "What is maximum drawdown?", a: "The largest percentage drop from a peak to a following trough before a new peak is reached. It captures the worst loss an investor would have felt holding through the period." },
    { q: "Why does recovery need a bigger gain?", a: "A 50% drawdown needs a 100% gain to get back to even, because the recovery is measured from the smaller trough value. Big drawdowns are punishing." },
    { q: "What should I paste in?", a: "A time-ordered list of prices or portfolio values separated by commas or spaces — for example daily closes or your equity curve." },
  ],
};

export default tool;
