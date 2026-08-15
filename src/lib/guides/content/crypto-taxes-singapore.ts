import type { Guide } from "../types";

const guide: Guide = {
  slug: "crypto-taxes-singapore",
  title: "Crypto Tax in Singapore: No Capital Gains Tax — With Fine Print",
  description:
    "Singapore has no capital gains tax, so individual investors pay nothing on crypto profits. But trading as a business, or earning crypto as income, is taxable. Here is exactly where the line falls.",
  readingMinutes: 8,
  updatedAt: "2026-07-27",
  reviewedAt: "2026-07-27",
  sources: [
    {
      label:
        "e-Tax Guide: Income Tax Treatment of Digital Tokens",
      publisher: "IRAS",
      url: "https://www.iras.gov.sg/media/docs/default-source/e-tax/etaxguide_cit_income-tax-treatment-of-digital-tokens_091020.pdf",
    },
  ],
  seo: {
    keywords: [
      "crypto tax singapore",
      "singapore no capital gains tax crypto",
      "iras crypto",
      "crypto trading income tax singapore",
      "singapore crypto investor tax",
      "gst digital payment token",
    ],
    description:
      "Singapore crypto tax guide: why individual investors pay no capital gains tax, when IRAS treats gains as taxable trading income (the badges of trade), how staking and payment income are taxed, and the GST exemption.",
  },
  relatedTools: ["crypto-tax-calculator", "profit-calculator", "average-entry-calculator"],
  partOf: "crypto-tax-by-country",
  body: [
    { type: "callout", text: "General information, not tax advice. IRAS guidance changes and personal circumstances vary. Check iras.gov.sg or speak to a Singapore tax professional before you file." },

    { type: "p", text: "Singapore is one of the most crypto-friendly places in the world for individual investors, and the reason is simple: Singapore has no capital gains tax on any asset. If you buy crypto as a long-term investment and later sell it at a profit, that gain is not taxed. There is no holding period to satisfy, no allowance to track, no capital gains return to file. But 'no capital gains tax' is not the same as 'no tax on crypto', and the difference is where people trip up." },

    { type: "h2", text: "Investor: gains are tax-free" },
    { type: "p", text: "If you hold crypto as an investment — buying, holding and occasionally selling — your profits are capital in nature and fall outside Singapore's tax net entirely. This is the position most individuals are in, and it is the reason Singapore attracts crypto holders. No capital gains tax means the profit on a well-timed sale is yours to keep." },
    { type: "tool", slug: "profit-calculator" },

    { type: "h2", text: "Trader: gains become taxable income" },
    { type: "p", text: "The exemption only covers capital gains. If your activity amounts to carrying on a trade, your profits are revenue, not capital — and revenue is taxable income. IRAS decides which side you are on using the 'badges of trade', the same test applied to any asset:" },
    { type: "ul", items: [
      "Frequency — occasional sales look like investing; high-volume, systematic trading looks like a business.",
      "Holding period — long holds suggest investment; rapid in-and-out suggests trade.",
      "Intention — did you buy to hold for appreciation, or to flip for short-term profit?",
      "Financing and organisation — borrowing to trade, or running it in a structured, business-like way, points to a trade.",
    ] },
    { type: "callout", text: "There is no bright-line number of trades that flips you from investor to trader. IRAS weighs the whole picture. If crypto trading is effectively your job, expect your profits to be treated as taxable income." },
    { type: "tool", slug: "crypto-tax-calculator" },

    { type: "h2", text: "Crypto received as income" },
    { type: "p", text: "Even a pure investor can have taxable crypto. Where you receive crypto as income rather than buy it, it is taxed at its market value in Singapore dollars when received. That includes being paid in crypto for goods or services, business revenue taken in crypto, and mining or staking carried out as a trade or business. Casual staking rewards for a personal holding sit in a greyer area — the treatment depends on whether the activity looks like a business — so it is worth checking your specific facts." },
    { type: "tool", slug: "average-entry-calculator" },

    { type: "h2", text: "Income tax rates" },
    { type: "p", text: "Where crypto is taxable as income, it is added to your other income and taxed at Singapore's progressive resident rates, which rise to a top marginal rate of 24% (from Year of Assessment 2024) for the highest incomes. If the activity is run through a company, profits are taxed at the flat 17% corporate rate. These are among the lower headline rates globally, but they only bite when your crypto is income rather than an investment gain." },

    { type: "h2", text: "GST on digital payment tokens" },
    { type: "p", text: "Singapore removed the double-tax problem on paying with crypto. Since 1 January 2020, supplies of digital payment tokens are exempt from GST, so using crypto as a means of payment is not itself a taxable supply — you are not charged GST simply for spending Bitcoin. Ordinary GST (at the standard rate of 9% since 2024) still applies to the underlying goods or services you buy, exactly as it would if you paid in dollars." },

    { type: "h2", text: "Reporting and what is coming" },
    { type: "ul", items: [
      "The tax year runs on the Year of Assessment basis; individual income tax e-filing is generally due by 18 April.",
      "Pure investors with only capital gains have nothing crypto-specific to file. If you have taxable crypto income, declare it as income.",
      "Keep records regardless — dates, SGD values and the nature of each transaction — so you can support your investor position if IRAS ever asks.",
    ] },
    { type: "p", text: "One caveat on the horizon: global tax-transparency frameworks, including the OECD Crypto-Asset Reporting Framework (CARF), are being adopted by jurisdictions worldwide, and Singapore has signalled it will participate in automatic information exchange. 'No capital gains tax at home' does not shield you from tax obligations in another country where you are resident — a point for anyone who is not solely a Singapore tax resident." },

    { type: "h2", text: "The bottom line" },
    { type: "p", text: "For a genuine long-term investor, Singapore is about as good as it gets: your crypto gains are simply not taxed. The fine print is the investor-versus-trader line and the taxation of crypto received as income — so if trading is your profession or you are earning crypto rather than investing it, the tax-free headline no longer applies. Keep clean records, and know which category you are really in." },
  ],
  faq: [
    { q: "Does Singapore tax crypto gains?", a: "Not for individual investors. Singapore has no capital gains tax, so profits from selling crypto held as a long-term investment are not taxed. There's no holding period or allowance to worry about." },
    { q: "When is crypto taxable in Singapore?", a: "When it's income rather than a capital gain: if your trading amounts to carrying on a business, or you receive crypto as payment, business revenue, or from mining/staking run as a trade. Then it's taxed as income at your marginal rate." },
    { q: "How does IRAS decide if I'm a trader or investor?", a: "Using the 'badges of trade' — frequency of transactions, holding period, your intention, and how financed and organised the activity is. There's no fixed number of trades; IRAS weighs the overall picture." },
    { q: "What tax rate applies to taxable crypto in Singapore?", a: "Progressive resident income tax rates up to a top marginal rate of 24% (from Year of Assessment 2024), or the flat 17% corporate rate if run through a company. These only apply where crypto is income, not an investment gain." },
    { q: "Is there GST on crypto in Singapore?", a: "Supplies of digital payment tokens have been exempt from GST since 1 January 2020, so paying with crypto isn't itself a taxable supply. Standard GST (9% since 2024) still applies to the goods or services you buy." },
    { q: "Do I need to report crypto in Singapore?", a: "Pure investors with only capital gains have nothing crypto-specific to file. If you have taxable crypto income, declare it as income by the filing deadline (generally 18 April), and keep records to support your position." },
  ],
};

export default guide;
