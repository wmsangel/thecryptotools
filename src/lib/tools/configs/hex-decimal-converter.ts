import type { ToolConfig } from "../types";

const BASES: Record<string, number> = { bin: 2, dec: 10, hex: 16 };

const tool: ToolConfig = {
  slug: "hex-decimal-converter",
  updatedAt: "2026-07-13",
  title: "Hex, Decimal & Binary Converter",
  description:
    "Convert numbers between hexadecimal, decimal and binary — handy for smart contracts, addresses and low-level data.",
  category: "dev",
  popular: true,
  source: "builtin",
  seo: {
    keywords: [
      "hex to decimal converter",
      "decimal to hex converter",
      "hex decimal binary converter",
      "hexadecimal converter",
      "binary to decimal converter",
    ],
    description:
      "Free hex, decimal and binary converter. Convert between number bases instantly for dev and smart-contract work.",
  },
  inputs: [
    { name: "value", label: "Value", type: "text", default: "ff", placeholder: "e.g. ff, 255, 11111111" },
    {
      name: "from",
      label: "From",
      type: "select",
      default: "hex",
      options: [
        { label: "Hexadecimal", value: "hex" },
        { label: "Decimal", value: "dec" },
        { label: "Binary", value: "bin" },
      ],
    },
    {
      name: "to",
      label: "To",
      type: "select",
      default: "dec",
      options: [
        { label: "Decimal", value: "dec" },
        { label: "Hexadecimal", value: "hex" },
        { label: "Binary", value: "bin" },
      ],
    },
  ],
  resultLabel: "Converted value",
  compute: (i) => {
    const raw = String(i.value).trim().replace(/^0x/i, "").replace(/\s+/g, "");
    const from = BASES[String(i.from)] ?? 10;
    const to = BASES[String(i.to)] ?? 10;

    const n = parseInt(raw, from);
    if (Number.isNaN(n)) {
      return { value: "—", note: `"${i.value}" is not a valid ${String(i.from)} number.` };
    }

    const out = n.toString(to);
    return {
      value: to === 16 ? out.toUpperCase() : out,
      breakdown: [
        { label: "Decimal", value: n.toString(10) },
        { label: "Hexadecimal", value: "0x" + n.toString(16).toUpperCase() },
        { label: "Binary", value: n.toString(2) },
      ],
    };
  },
  faq: [
    { q: "How do I convert hex to decimal?", a: "Each hex digit is a power of 16. This tool does it instantly — enter the hex value and pick 'Decimal' as the output." },
    { q: "Does it accept a 0x prefix?", a: "Yes — a leading 0x on hex input is stripped automatically, so both 'ff' and '0xff' work." },
    { q: "Why do developers need this?", a: "Hex is everywhere in crypto: addresses, transaction data, colors and byte values. Fast base conversion saves time." },
  ],
};

export default tool;
