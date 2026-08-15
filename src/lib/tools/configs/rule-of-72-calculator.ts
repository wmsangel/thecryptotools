import type { ToolConfig } from "../types";
import { fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "rule-of-72-calculator",
  updatedAt: "2026-07-15",
  title: "Rule of 72 Calculator",
  description:
    "Find out how long it takes to double your money at a given annual return using the Rule of 72 — plus the exact compounding answer.",
  category: "market",
  source: "builtin",
  seo: {
    keywords: [
      "rule of 72 calculator",
      "doubling time calculator",
      "how long to double my money",
      "rule of 72",
      "investment doubling calculator",
    ],
    description:
      "Free Rule of 72 calculator — enter an annual return to see how many years it takes to double, triple or quadruple your money.",
  },
  inputs: [
    { name: "rate", label: "Annual return", type: "number", suffix: "%", default: 10, min: 0.01, step: 0.1 },
  ],
  resultLabel: "Time to double",
  compute: (i) => {
    const rate = Number(i.rate);
    const r = rate / 100;
    const approx = rate > 0 ? 72 / rate : 0;
    const exact = r > 0 ? Math.log(2) / Math.log(1 + r) : 0;
    const triple = rate > 0 ? 114 / rate : 0;
    const quadruple = rate > 0 ? 144 / rate : 0;

    return {
      value: `${fmtNumber(approx)} years`,
      note: "The Rule of 72 is an approximation; the exact figure uses compound growth.",
      breakdown: [
        { label: "Exact (compound)", value: `${fmtNumber(exact)} years`, emphasis: true },
        { label: "Time to triple (Rule of 114)", value: `${fmtNumber(triple)} years` },
        { label: "Time to quadruple (Rule of 144)", value: `${fmtNumber(quadruple)} years` },
      ],
    };
  },
  faq: [
    { q: "What is the Rule of 72?", a: "Divide 72 by your annual percentage return to estimate the number of years it takes an investment to double. At 10% a year, money doubles in about 7.2 years." },
    { q: "How accurate is it?", a: "It's a close approximation for rates between roughly 5% and 15%. Outside that range the exact compound formula (shown here) is more reliable." },
    { q: "Where do 114 and 144 come from?", a: "The same idea extended: 114 estimates tripling time and 144 estimates quadrupling time." },
  ],
};

export default tool;
