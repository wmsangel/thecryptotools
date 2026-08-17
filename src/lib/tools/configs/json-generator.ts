import type { ToolConfig } from "../types";

const FIRST = ["Alex", "Sam", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Jamie", "Avery", "Quinn"];
const LAST = ["Smith", "Nakamoto", "Buterin", "Lee", "Patel", "Kim", "Garcia", "Novak", "Ivanov", "Chen"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const tool: ToolConfig = {
  slug: "json-generator",
  updatedAt: "2026-07-13",
  title: "Fake JSON Data Generator",
  description:
    "Generate an array of realistic fake user records as JSON — ideal seed data for APIs, tables and frontend prototypes.",
  category: "dev",
  noindex: true,
  popular: true,
  source: "builtin",
  seo: {
    keywords: [
      "json generator",
      "fake json generator",
      "mock json data",
      "test data json",
      "sample json generator",
    ],
    description:
      "Free fake JSON data generator. Produce arrays of realistic mock records for testing APIs and UIs.",
  },
  inputs: [
    { name: "count", label: "Records", type: "number", default: 5, min: 1, max: 100, step: 1 },
  ],
  resultLabel: "JSON output",
  compute: (i) => {
    const count = Math.min(100, Math.max(1, Math.floor(Number(i.count) || 1)));
    const records = Array.from({ length: count }, (_, idx) => {
      const first = pick(FIRST);
      const last = pick(LAST);
      return {
        id: idx + 1,
        name: `${first} ${last}`,
        email: `${first}.${last}`.toLowerCase() + `@example.com`,
        balanceUsd: Number((Math.random() * 100000).toFixed(2)),
        active: Math.random() > 0.3,
      };
    });
    return JSON.stringify(records, null, 2);
  },
  faq: [
    { q: "What kind of data is generated?", a: "An array of user-style objects with id, name, email, a random USD balance and an active flag — great generic seed data." },
    { q: "Can I use this in production?", a: "It's meant for testing and prototypes. The values are randomized and not tied to real people." },
    { q: "How many records can I generate?", a: "From 1 up to 100 records per run. Copy the JSON directly into your fixtures or mock API." },
  ],
};

export default tool;
