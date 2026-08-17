import type { ToolConfig } from "../types";

const tool: ToolConfig = {
  slug: "timestamp-converter",
  updatedAt: "2026-07-13",
  title: "Unix Timestamp Converter",
  description:
    "Convert a Unix timestamp to a human-readable UTC date and time, with seconds or milliseconds auto-detected.",
  category: "dev",
  noindex: true,
  popular: true,
  source: "builtin",
  seo: {
    keywords: [
      "unix timestamp converter",
      "epoch converter",
      "timestamp to date",
      "unix time converter",
      "epoch to date converter",
    ],
    description:
      "Free Unix timestamp converter. Turn epoch seconds or milliseconds into a readable UTC and local date.",
  },
  inputs: [
    { name: "timestamp", label: "Unix timestamp", type: "number", default: 1700000000, step: 1 },
  ],
  resultLabel: "UTC date",
  compute: (i) => {
    const raw = Number(i.timestamp);
    if (!Number.isFinite(raw)) return "Enter a valid timestamp";
    // Auto-detect: 13-digit values are milliseconds.
    const ms = Math.abs(raw) >= 1e12 ? raw : raw * 1000;
    const date = new Date(ms);
    if (Number.isNaN(date.getTime())) return "Out of range";

    return {
      value: date.toUTCString(),
      breakdown: [
        { label: "ISO 8601", value: date.toISOString() },
        { label: "Local time", value: date.toString() },
        { label: "Milliseconds", value: String(ms) },
      ],
    };
  },
  faq: [
    { q: "What is a Unix timestamp?", a: "It's the number of seconds elapsed since January 1, 1970 (UTC), a standard way to represent time in software." },
    { q: "Seconds or milliseconds?", a: "This tool auto-detects: 10-digit values are treated as seconds, 13-digit values as milliseconds." },
    { q: "What time zone is shown?", a: "Both UTC (universal) and your browser's local time are displayed for convenience." },
  ],
};

export default tool;
