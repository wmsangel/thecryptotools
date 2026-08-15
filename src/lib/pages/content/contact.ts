import type { StaticPage } from "../types";
import { site } from "@/lib/site";

export const contact: StaticPage = {
  slug: "contact",
  title: "Contact",
  description: "Report a bug, question a formula, request a tool or ask about advertising.",
  eyebrow: "Contact",
  updatedAt: "2026-07-19",
  seo: {
    title: "Contact",
    description: `How to reach ${site.name} — bug reports, formula corrections, tool requests, partnership and privacy enquiries.`,
    keywords: ["contact thecryptotools", "crypto tools contact", "report a bug"],
  },
  body: [
    {
      type: "p",
      text: `The fastest way to reach us is email: ${site.contactEmail}. There is no contact form because this is a static site with no backend — and we would rather not run one that stores your message.`,
    },

    { type: "h2", text: "What to include" },
    {
      type: "ul",
      items: [
        "Formula looks wrong? Send the tool name, the exact inputs you used, the number we showed and the number you expected. That is usually enough to reproduce it in minutes.",
        "Tool request? Describe the decision you are trying to make, not just the formula — it often turns out a different tool solves it better.",
        "Broken page or wrong live price? Tell us the URL, your browser and roughly when it happened.",
        "Partnership or advertising? Include your platform, the program terms and the target region.",
        "Privacy request? Mention \"GDPR\" or \"CCPA\" in the subject line and we will respond within 30 days.",
      ],
    },

    { type: "h2", text: "What we cannot help with" },
    {
      type: "p",
      text: "We are not an exchange and we hold no funds. If you cannot withdraw, lost access to an account, or think you were scammed, contact that platform's support directly — we have no ability to see or influence your account. We also cannot tell you what to buy, when to sell, or how to size your trade for you.",
    },

    { type: "h2", text: "Response time" },
    {
      type: "p",
      text: "This is a small project, so replies usually take a few days. Bug reports that come with reproducible inputs get looked at first.",
    },
  ],
};
