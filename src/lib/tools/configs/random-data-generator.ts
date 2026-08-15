import type { ToolConfig } from "../types";

function uuidv4(): string {
  // RFC4122-ish v4 using Math.random (fine for test data, not for security).
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const tool: ToolConfig = {
  slug: "random-data-generator",
  updatedAt: "2026-07-13",
  title: "Random Data Generator",
  description:
    "Generate UUIDs, random hex strings, numbers or passwords for testing and development — as many as you need at once.",
  category: "dev",
  source: "builtin",
  seo: {
    keywords: [
      "random data generator",
      "uuid generator",
      "random hex generator",
      "random password generator",
      "test data generator",
    ],
    description:
      "Free random data generator. Create UUIDs, hex strings, random numbers and passwords instantly in your browser.",
  },
  inputs: [
    {
      name: "type",
      label: "Data type",
      type: "select",
      default: "uuid",
      options: [
        { label: "UUID v4", value: "uuid" },
        { label: "Hex string", value: "hex" },
        { label: "Random number", value: "number" },
        { label: "Password", value: "password" },
      ],
    },
    { name: "count", label: "How many", type: "number", default: 5, min: 1, max: 100, step: 1 },
    { name: "length", label: "Length (hex/password)", type: "number", default: 16, min: 1, max: 128, step: 1, optional: true },
  ],
  resultLabel: "Generated data",
  compute: (i) => {
    const type = String(i.type);
    const count = Math.min(100, Math.max(1, Math.floor(Number(i.count) || 1)));
    const length = Math.min(128, Math.max(1, Math.floor(Number(i.length) || 16)));
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
    const hexchars = "0123456789abcdef";

    const gen = () => {
      if (type === "uuid") return uuidv4();
      if (type === "number") return String(Math.floor(Math.random() * 1e9));
      const chars = type === "hex" ? hexchars : alphabet;
      return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    };

    return Array.from({ length: count }, gen).join("\n");
  },
  faq: [
    { q: "Are these values cryptographically secure?", a: "No. They use Math.random and are meant for test data and mockups, not for production secrets or keys." },
    { q: "What can I generate?", a: "UUID v4 identifiers, random hex strings, random integers and human-typeable passwords." },
    { q: "How many can I make at once?", a: "Up to 100 values per run — set the count field to whatever you need within that limit." },
  ],
};

export default tool;
