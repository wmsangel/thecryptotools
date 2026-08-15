import type { Guide } from "../types";

const guide: Guide = {
  slug: "apr-vs-apy-crypto",
  title: "APR vs APY in Crypto: What's the Difference?",
  description:
    "APR and APY look similar but can mean very different returns. Learn how compounding turns APR into APY and why it matters for staking and yield farming.",
  readingMinutes: 5,
  updatedAt: "2026-07-16",
  seo: {
    keywords: ["apr vs apy", "what is apy crypto", "apr to apy", "compound interest crypto", "yield farming apy"],
    description:
      "APR vs APY explained for crypto: how compounding frequency turns APR into a higher APY, with examples for staking and yield farming.",
  },
  relatedTools: ["yield-farming-apy-calculator", "apy-calculator", "compound-interest-calculator", "staking-rewards-calculator"],
  body: [
    { type: "p", text: "You'll see both APR and APY advertised across staking, lending and yield-farming platforms — and they're not the same. Confusing them can make an offer look better or worse than it really is." },
    { type: "h2", text: "APR: the simple rate" },
    { type: "p", text: "APR (Annual Percentage Rate) is the simple annual interest, ignoring compounding. If a pool pays 12% APR and you never reinvest, $1,000 earns $120 over a year." },
    { type: "h2", text: "APY: the compounded rate" },
    { type: "p", text: "APY (Annual Percentage Yield) includes the effect of reinvesting your earnings. The formula is APY = (1 + APR/n)^n − 1, where n is how many times per year you compound. The more often you reinvest, the higher your effective yield." },
    { type: "callout", text: "12% APR compounded daily becomes about 12.75% APY. The gap widens fast at higher rates — 100% APR daily compounds to roughly 171% APY." },
    { type: "tool", slug: "yield-farming-apy-calculator" },
    { type: "h2", text: "Why it matters in DeFi" },
    { type: "ul", items: [
      "Platforms often advertise the bigger APY number — check whether it assumes auto-compounding you'd have to do yourself.",
      "Each manual compound costs gas, so daily compounding isn't always worth it on small positions.",
      "Advertised yields move constantly with pool size and token prices — treat them as a snapshot.",
    ] },
    { type: "p", text: "Use the calculators below to convert between APR and APY and to project how compounding grows a balance over time." },
    { type: "tool", slug: "compound-interest-calculator" },
  ],
  faq: [
    { q: "Is APY always higher than APR?", a: "Yes, whenever you compound more than once a year. If there's no compounding, APR and APY are equal." },
    { q: "Which should I compare between platforms?", a: "Compare like with like — ideally APY, but check the assumed compounding frequency. An APY that assumes daily auto-compounding may not match your actual behavior." },
    { q: "Does more frequent compounding always help?", a: "It raises APY, but gas costs for manual compounding can outweigh the benefit on small positions. Auto-compounding vaults reduce that friction." },
  ],
};

export default guide;
