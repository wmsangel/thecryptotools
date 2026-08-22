import type { Guide } from "../types";

const guide: Guide = {
  slug: "crypto-taxes-explained",
  affiliate: "tax",
  title: "Crypto Taxes Explained: How Capital Gains Work",
  description:
    "A beginner-friendly overview of how crypto is taxed — capital gains, taxable events, short vs long term, and how to estimate what you owe.",
  readingMinutes: 7,
  updatedAt: "2026-07-16",
  reviewedAt: "2026-07-16",
  sources: [
    {
      label:
        "Digital assets",
      publisher: "IRS",
      url: "https://www.irs.gov/filing/digital-assets",
    },
    {
      label:
        "Cryptoassets Manual",
      publisher: "HMRC",
      url: "https://www.gov.uk/hmrc-internal-manuals/cryptoassets-manual",
    },
    {
      label:
        "International Standards for Automatic Exchange of Information in Tax Matters (CARF)",
      publisher: "OECD",
      url: "https://www.oecd.org/en/publications/international-standards-for-automatic-exchange-of-information-in-tax-matters_896d79d1-en.html",
    },
  ],
  seo: {
    keywords: ["crypto taxes explained", "how is crypto taxed", "crypto capital gains", "crypto tax calculator", "taxable crypto events"],
    description:
      "How crypto taxes work: taxable events, capital gains vs income, short- vs long-term rates, and how to estimate your crypto tax bill.",
  },
  relatedTools: ["crypto-tax-calculator", "tax-loss-harvesting-calculator", "profit-calculator", "roi-calculator"],
  partOf: "crypto-tax-by-country",
  body: [
    { type: "p", text: "In most countries, crypto is treated as property, not currency — which means selling, swapping or spending it can trigger a taxable event. This guide covers the fundamentals, but tax rules vary by country and change often, so always confirm with a local professional." },
    { type: "callout", text: "This is general education, not tax advice. Rules differ by jurisdiction and your personal situation." },
    { type: "h2", text: "What counts as a taxable event?" },
    { type: "ul", items: [
      "Selling crypto for fiat (e.g. BTC → USD).",
      "Swapping one crypto for another (e.g. ETH → SOL) — yes, this is usually taxable.",
      "Spending crypto on goods or services.",
      "Earning crypto (staking, mining, airdrops, interest) — often taxed as income at receipt.",
    ] },
    { type: "p", text: "Simply buying and holding crypto, or moving it between your own wallets, is generally not taxable." },
    { type: "h2", text: "Capital gains: short vs long term" },
    { type: "p", text: "A capital gain is your sale proceeds minus your cost basis (what you paid, including fees). Many countries tax assets held longer than a year at a lower long-term rate than those sold within a year. Holding period can meaningfully change your bill." },
    { type: "tool", slug: "crypto-tax-calculator" },
    { type: "h2", text: "Reducing your tax legally" },
    { type: "ul", items: [
      "Hold longer to qualify for lower long-term rates where they exist.",
      "Tax-loss harvesting: realizing losses can offset gains in many jurisdictions.",
      "Keep meticulous records of every buy, sell and swap, with dates and prices.",
      "Use tax software to reconcile transactions across exchanges and wallets.",
    ] },
    { type: "p", text: "Estimate your gain and rough tax with the calculator above, then keep clean records so filing season is painless." },
    { type: "tool", slug: "profit-calculator" },
  ],
  faq: [
    { q: "Is swapping one crypto for another taxable?", a: "In many countries, yes — a crypto-to-crypto swap is a disposal of the first asset and is treated as a taxable event, even though no fiat is involved. Check your local rules." },
    { q: "Do I owe tax if I only bought and held?", a: "Generally no. Buying crypto and holding it, or transferring between your own wallets, usually isn't taxable. Tax typically applies when you sell, swap, spend or earn crypto." },
    { q: "How is staking or mining income taxed?", a: "Often as ordinary income at the fair market value when received, and then again as a capital gain or loss when you later sell. Rules vary, so confirm locally." },
  ],
};

export default guide;
