import type { ToolConfig } from "../types";
import { fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "bitcoin-halving-countdown",
  updatedAt: "2026-07-13",
  title: "Bitcoin Halving Countdown",
  description:
    "Count down the days, weeks and months until the next Bitcoin halving (or any crypto date you set).",
  category: "market",
  featured: true,
  popular: true,
  source: "builtin",
  seo: {
    keywords: [
      "bitcoin halving countdown",
      "next bitcoin halving",
      "halving countdown",
      "btc halving date",
      "crypto countdown calculator",
    ],
    description:
      "Free Bitcoin halving countdown. See how many days until the next halving — updates live in your browser.",
  },
  inputs: [
    {
      name: "date",
      label: "Target date (YYYY-MM-DD)",
      type: "text",
      default: "2028-04-20",
      help: "Next Bitcoin halving is estimated around April 2028.",
    },
  ],
  resultLabel: "Days remaining",
  compute: (i) => {
    const target = new Date(String(i.date));
    if (Number.isNaN(target.getTime())) {
      return { value: "—", note: "Enter a valid date like 2028-04-20." };
    }
    const now = new Date();
    const diffMs = target.getTime() - now.getTime();
    const dayMs = 86400000;
    const days = Math.ceil(diffMs / dayMs);

    if (days < 0) {
      return {
        value: `${fmtNumber(Math.abs(days), 0)} days ago`,
        note: `That date has already passed (${target.toDateString()}).`,
      };
    }

    return {
      value: `${fmtNumber(days, 0)} days`,
      note: `Target: ${target.toDateString()}. Updates live each time you open the page.`,
      breakdown: [
        { label: "Weeks", value: fmtNumber(days / 7, 1) },
        { label: "Months (approx)", value: fmtNumber(days / 30.44, 1) },
        { label: "Years (approx)", value: fmtNumber(days / 365.25, 2) },
      ],
    };
  },
  faq: [
    { q: "When is the next Bitcoin halving?", a: "The next halving is estimated around April 2028 (block 1,050,000). The exact date shifts with block times, so treat it as an estimate." },
    { q: "What is the Bitcoin halving?", a: "Roughly every four years the block reward paid to miners is cut in half, reducing the rate of new BTC supply." },
    { q: "Can I count down to other dates?", a: "Yes — change the target date to count down to any listing, unlock or event you care about." },
  ],
};

export default tool;
