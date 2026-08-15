import type { ToolConfig } from "../types";
import { fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "percentage-calculator",
  updatedAt: "2026-07-13",
  title: "Percentage Calculator",
  description:
    "Quick percentage math for traders: X% of a value, the % change between two prices, or what % one number is of another.",
  category: "converters",
  popular: true,
  source: "builtin",
  seo: {
    keywords: [
      "percentage calculator",
      "percent change calculator",
      "price change percentage",
      "crypto percentage calculator",
      "percentage increase calculator",
    ],
    description:
      "Free percentage calculator. Find X% of a value, percentage change between two prices, or what percent A is of B.",
  },
  inputs: [
    {
      name: "mode",
      label: "Mode",
      type: "select",
      default: "change",
      options: [
        { label: "% change from A to B", value: "change" },
        { label: "A% of B", value: "percentOf" },
        { label: "A is what % of B", value: "ratio" },
      ],
    },
    { name: "a", label: "Value A", type: "number", default: 30000, step: 0.01 },
    { name: "b", label: "Value B", type: "number", default: 33000, step: 0.01 },
  ],
  resultLabel: "Result",
  compute: (i) => {
    const mode = String(i.mode);
    const a = Number(i.a);
    const b = Number(i.b);

    if (mode === "percentOf") {
      const r = (a / 100) * b;
      return { value: fmtNumber(r, 4), label: `${fmtNumber(a)}% of ${fmtNumber(b)}` };
    }
    if (mode === "ratio") {
      const r = b !== 0 ? (a / b) * 100 : 0;
      return { value: `${fmtNumber(r)}%`, label: `${fmtNumber(a)} is this % of ${fmtNumber(b)}` };
    }
    // change
    const r = a !== 0 ? ((b - a) / a) * 100 : 0;
    return {
      value: `${r >= 0 ? "+" : ""}${fmtNumber(r)}%`,
      label: `change from ${fmtNumber(a)} to ${fmtNumber(b)}`,
      breakdown: [{ label: "Absolute difference", value: fmtNumber(b - a, 4) }],
    };
  },
  faq: [
    { q: "How do I calculate percentage change?", a: "Percentage change = (new − old) ÷ old × 100. A move from 30,000 to 33,000 is a +10% change." },
    { q: "How do I find X% of a number?", a: "Multiply the number by the percentage divided by 100. For example, 5% of 2,000 = 2,000 × 0.05 = 100." },
    { q: "What can I use this for in crypto?", a: "Quickly check price moves, position sizing, fee percentages, or how far a coin is from a target." },
  ],
};

export default tool;
