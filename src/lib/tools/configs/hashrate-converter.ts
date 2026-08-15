import type { ToolConfig } from "../types";
import { fmtNumber } from "@/lib/format";

// Multiplier to convert each unit into base hashes per second.
const UNITS: Record<string, number> = {
  "H": 1,
  "kH": 1e3,
  "MH": 1e6,
  "GH": 1e9,
  "TH": 1e12,
  "PH": 1e15,
  "EH": 1e18,
};

const ORDER = ["H", "kH", "MH", "GH", "TH", "PH", "EH"];
const LABELS: Record<string, string> = {
  H: "H/s", kH: "kH/s", MH: "MH/s", GH: "GH/s", TH: "TH/s", PH: "PH/s", EH: "EH/s",
};

const tool: ToolConfig = {
  slug: "hashrate-converter",
  title: "Hashrate Converter (H/s, MH/s, GH/s, TH/s)",
  description:
    "Convert mining hashrate between H/s, kH/s, MH/s, GH/s, TH/s, PH/s and EH/s. Useful for comparing rigs, pools and whole-network hashrate figures on one scale.",
  category: "converters",
  source: "builtin",
  updatedAt: "2026-07-25",
  seo: {
    keywords: [
      "hashrate converter",
      "hash rate converter",
      "mh/s to gh/s",
      "th/s to h/s converter",
      "hashrate unit converter",
      "convert hashrate",
    ],
    description:
      "Free hashrate converter. Instantly convert between H/s, kH/s, MH/s, GH/s, TH/s, PH/s and EH/s for mining rigs and network hashrate.",
  },
  inputs: [
    { name: "value", label: "Value", type: "number", default: 100, min: 0, step: 0.0001 },
    {
      name: "from",
      label: "From",
      type: "select",
      default: "TH",
      options: ORDER.map((u) => ({ label: LABELS[u], value: u })),
    },
    {
      name: "to",
      label: "To",
      type: "select",
      default: "GH",
      options: ORDER.map((u) => ({ label: LABELS[u], value: u })),
    },
  ],
  resultLabel: "Converted hashrate",
  precision: 6,
  compute: (i) => {
    const value = Number(i.value);
    const from = UNITS[String(i.from)] ?? 1;
    const to = UNITS[String(i.to)] ?? 1;

    const baseHs = value * from;
    const out = baseHs / to;

    return {
      value: `${fmtNumber(out, 6)} ${LABELS[String(i.to)] ?? ""}`,
      breakdown: ORDER.map((u) => ({
        label: LABELS[u],
        value: fmtNumber(baseHs / UNITS[u], 6),
      })),
    };
  },
  faq: [
    { q: "What is hashrate?", a: "Hashrate is how many hash computations a miner performs per second. Higher hashrate means more attempts to find a valid block, and a larger share of a pool's or network's total work." },
    { q: "How do the units scale?", a: "Each step up is ×1000: 1 kH/s = 1,000 H/s, 1 MH/s = 1,000 kH/s, then GH → TH → PH → EH. Modern Bitcoin ASICs are measured in TH/s; the whole Bitcoin network runs in the hundreds of EH/s." },
    { q: "How do I convert TH/s to GH/s?", a: "Multiply by 1,000 — 1 TH/s = 1,000 GH/s. Pick TH/s as 'From' and GH/s as 'To' and the tool does it, plus every other unit at once." },
    { q: "Is hashrate the same as mining profit?", a: "No. Profit depends on hashrate, network difficulty, block reward, coin price and your electricity cost. Use a mining profitability calculator to turn hashrate into earnings." },
  ],
};

export default tool;
