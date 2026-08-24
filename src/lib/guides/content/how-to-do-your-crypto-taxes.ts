import type { Guide } from "../types";

const guide: Guide = {
  slug: "how-to-do-your-crypto-taxes",
  affiliate: "tax",
  partOf: "crypto-tax-by-country",
  title: "How to Do Your Crypto Taxes: A Step-by-Step Guide",
  description:
    "The universal process behind every country's crypto tax rules — gather transactions, work out cost basis, calculate gains, apply your local rules, and report — plus the mistakes that cost people the most.",
  readingMinutes: 9,
  updatedAt: "2026-08-24",
  seo: {
    title: "How to Do Your Crypto Taxes: A Step-by-Step Guide",
    description:
      "A step-by-step guide to doing your crypto taxes: gather your transactions, work out cost basis, calculate gains and losses, apply your country's rules, and file — with the common mistakes to avoid.",
    keywords: [
      "how to do crypto taxes",
      "crypto tax guide",
      "crypto tax step by step",
      "calculate crypto taxes",
      "crypto cost basis",
      "crypto capital gains tax",
    ],
  },
  relatedTools: ["average-entry-calculator"],
  body: [
    {
      type: "p",
      text: "Crypto tax rules differ by country, but the process underneath them is the same everywhere. Master the five steps once and the only thing that changes across borders is the rates and a few local quirks. This guide is the process; for the exact rules where you live, follow the country guide linked at the end.",
    },

    { type: "h2", text: "Step 1 — Gather every transaction" },
    {
      type: "p",
      text: "Tax is computed on your whole history, not just this year, because the cost of what you sell was set when you bought it — sometimes years earlier. Export the full transaction history (usually a CSV) from every exchange and wallet you've ever used, not only the active ones. Missing an early buy doesn't just lose that row; it makes every later sale of that asset wrong, because the calculator can't find what the coins cost.",
    },

    { type: "h2", text: "Step 2 — Work out your cost basis" },
    {
      type: "p",
      text: "Cost basis is what you paid for the specific coins you disposed of, including acquisition fees. The wrinkle is that if you bought the same asset several times at different prices, your basis is a weighted average of those buys — not the price of your first one. Getting this number right is most of the job; getting it wrong is the single most common reason a crypto tax return is off.",
    },
    { type: "tool", slug: "average-entry-calculator" },

    { type: "h2", text: "Step 3 — Calculate gains and losses on each disposal" },
    {
      type: "p",
      text: "A 'disposal' is more than cashing out to fiat. In most countries selling for fiat, swapping one crypto for another, and spending crypto on goods are all taxable events — while moving coins between your own wallets is not. For each disposal, the gain is the proceeds minus the cost basis of the amount you disposed of. Income events — staking rewards, mining, airdrops, interest — are usually taxed separately, at their value on the day you received them, and then that value becomes the cost basis if you later sell them.",
    },
    {
      type: "callout",
      text: "The mistake that surprises people most: a crypto-to-crypto swap is a taxable disposal in most countries, even though no fiat touched your bank. You can owe tax on gains you never cashed out.",
    },

    { type: "h2", text: "Step 4 — Which cost-basis method applies (and where you get a choice)" },
    {
      type: "p",
      text: "The order in which coins are considered 'sold' changes the gain. Most countries mandate one method — the UK pools holdings, Canada uses an average cost base, Germany and others use FIFO. A few, notably the US, let you choose (FIFO, LIFO or HIFO) if you can identify the specific units, which can change this year's bill by a lot. Where you have a choice, it is worth comparing.",
    },
    {
      type: "cta",
      title: "Compare FIFO vs LIFO vs HIFO on your own file",
      text: "If your country allows specific identification, this shows your tax under each method side by side — and, honestly, how much of any saving is just deferred to a future year rather than erased.",
      href: "/cost-basis-method-calculator",
      label: "Open the cost-basis comparison",
    },

    { type: "h2", text: "Step 5 — Apply your country's rules and report" },
    {
      type: "p",
      text: "Now the local layer goes on top: your country's tax rate, any annual tax-free allowance, holding-period discounts (some countries tax long-held crypto less, or not at all), and how losses are treated. Then the totals go on the right form by the right deadline. Before you get there, two moves can legitimately lower the bill — realising losses to offset gains before your tax year ends (tax-loss harvesting), and, in some regimes, holding past a long-term threshold.",
    },
    {
      type: "cta",
      title: "Turn your CSV into a country-correct report",
      text: "Drop your transaction history in and it applies your country's cost-basis method, holding-period rules and allowance automatically, and produces the gain, income and loss totals. It runs entirely in your browser — nothing is uploaded.",
      href: "/crypto-tax-report",
      label: "Open the tax report generator",
    },
    {
      type: "cta",
      title: "Check for losses worth realising before year-end",
      text: "The harvesting tool finds the losing lots that would actually reduce this year's bill — and flags the ones that wouldn't, so you don't sell a position for nothing.",
      href: "/tax-loss-harvesting",
      label: "Open tax-loss harvesting",
    },

    { type: "h2", text: "The mistakes that cost the most" },
    {
      type: "ul",
      items: [
        "Ignoring crypto-to-crypto swaps because no fiat moved — in most countries every swap is a taxable disposal.",
        "Missing early transactions, which corrupts the cost basis of everything you later sold.",
        "Forgetting income events — staking, airdrops and interest are usually taxable when received, separately from capital gains.",
        "Assuming another country's rule applies to you — the method, allowance and rates are all local.",
        "Leaving it to the deadline. Reconstructing years of history under time pressure is where errors and missed loss-harvesting opportunities happen.",
      ],
    },

    { type: "h2", text: "Do you need software or an accountant?" },
    {
      type: "p",
      text: "For a handful of trades on one exchange, the free tools here plus your country guide are enough. Once you have hundreds of transactions across several platforms, DeFi, or income events, dedicated crypto tax software pays for itself in time and accuracy — it reconciles wallets automatically and generates the exact forms. For large or complicated situations, or anything involving multiple countries, a crypto-literate accountant is money well spent. This guide is general information, not tax advice.",
    },
  ],
  faq: [
    {
      q: "Do I owe tax if I only swapped one crypto for another?",
      a: "In most countries, yes. A crypto-to-crypto swap is treated as disposing of the first asset and acquiring the second, so any gain on the first is taxable — even though no fiat reached your bank. A few countries defer this; check your country guide.",
    },
    {
      q: "Is moving crypto between my own wallets taxable?",
      a: "No. Transferring coins between wallets you control is not a disposal and triggers no tax. Only a network fee paid in crypto for the transfer might have a tiny taxable component. Keep records so these transfers aren't mistaken for sales.",
    },
    {
      q: "How is cost basis calculated if I bought at different prices?",
      a: "It's the weighted average of your buys (plus acquisition fees), not the price of your first purchase — unless your country mandates a specific ordering like FIFO. The average entry calculator works out the weighted figure from your individual buys.",
    },
    {
      q: "Are staking and airdrop rewards taxed?",
      a: "In most countries they're income at their value on the day you can access them, taxed separately from capital gains. That value then becomes the cost basis, so selling later is a second, capital-gains event on any further change in price.",
    },
  ],
};

export default guide;
