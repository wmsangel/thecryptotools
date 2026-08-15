import type { Guide } from "../types";

const guide: Guide = {
  slug: "crypto-taxes-switzerland",
  title: "Crypto Tax in Switzerland: No Capital Gains Tax — But a Wealth Tax",
  description:
    "Private investors in Switzerland pay no capital gains tax on crypto. Instead there is an annual wealth tax, income tax on staking, and a professional-trader trap that can flip your gains to taxable.",
  readingMinutes: 8,
  updatedAt: "2026-07-27",
  reviewedAt: "2026-07-27",
  sources: [
    {
      label:
        "Cryptocurrencies — taxation",
      publisher: "Eidgenössische Steuerverwaltung",
      url: "https://www.estv.admin.ch/en/cryptocurrencies-taxation",
    },
  ],
  seo: {
    keywords: [
      "crypto tax switzerland",
      "switzerland no capital gains crypto",
      "swiss crypto wealth tax",
      "professional trader crypto switzerland",
      "staking tax switzerland",
      "fta crypto tax values",
    ],
    description:
      "Switzerland crypto tax guide: why private investors pay no capital gains tax, the cantonal wealth tax on holdings, income tax on staking and mining, and the professional-trader safe-haven rules.",
  },
  relatedTools: ["crypto-tax-calculator", "average-entry-calculator", "profit-calculator"],
  partOf: "crypto-tax-by-country",
  body: [
    { type: "callout", text: "General information, not tax advice. Swiss tax is federal plus cantonal, so rules and rates vary by canton, and professional-trader classification is fact-specific. Check estv.admin.ch or a Swiss tax adviser before you file." },

    { type: "p", text: "Switzerland is one of the most attractive places in the world to hold crypto, for a simple reason: private individuals pay no capital gains tax. Sell your crypto at a profit as a private investor and that gain is generally tax-free. But Switzerland is not a no-tax jurisdiction — it swaps capital gains tax for a wealth tax, taxes your crypto income, and reserves the right to reclassify you as a professional trader, which changes everything." },

    { type: "h2", text: "Private investor: capital gains are tax-free" },
    { type: "p", text: "For a private investor, capital gains on movable private wealth — including crypto — are exempt from income tax. There is no holding period to satisfy and no gains return to file. This is the headline benefit and the reason Switzerland ranks so highly for long-term holders. The catch is that this status is not automatic for everyone; it depends on staying on the right side of the professional-trader line." },
    { type: "tool", slug: "profit-calculator" },

    { type: "h2", text: "The wealth tax replaces capital gains tax" },
    { type: "p", text: "Instead of taxing gains, Switzerland taxes wealth. Your crypto is declared at its market value at the end of the tax year and added to your other assets; the total is subject to an annual cantonal (and communal) wealth tax. To make valuation consistent, the Federal Tax Administration (FTA) publishes year-end tax values for the most important cryptocurrencies each year, which you use for the declaration." },
    { type: "callout", text: "Wealth tax rates are set by each canton and are generally low — a fraction of a percent up to around 1% at the top, applied only above a tax-free wealth threshold. Where you live in Switzerland materially affects the bill." },
    { type: "tool", slug: "average-entry-calculator" },

    { type: "h2", text: "Income tax on staking, mining and lending" },
    { type: "p", text: "The tax-free treatment covers capital gains, not income. Passive crypto earnings are taxable as income at their value when received: staking rewards, mining, liquidity mining and lending yield all count. So does being paid in crypto for work. This is the same principle you see elsewhere — appreciation of an asset you hold is capital (tax-free here), but a stream of new tokens paid to you is income (taxable)." },
    { type: "tool", slug: "crypto-tax-calculator" },

    { type: "h2", text: "The professional-trader trap" },
    { type: "p", text: "The biggest risk to the tax-free status is being classified as a professional (self-employed) trader. If a cantonal tax office decides your activity is professional, your gains flip from exempt to taxable self-employment income — often retroactively for the year under review — and social security contributions can apply on top. To give taxpayers certainty, the FTA publishes safe-haven criteria; meet all of them and you are safely a private investor." },
    { type: "ul", items: [
      "You have held the relevant crypto for at least six months.",
      "Your annual transaction volume is below five times your holdings at the start of the period.",
      "Your realised capital gains are less than 50% of your taxable income for the year.",
      "You do not use debt financing to buy crypto.",
      "You use derivatives only to hedge your own positions, not to speculate.",
    ] },
    { type: "p", text: "Fail one of these and you are not automatically a professional — the tax office looks at the whole picture — but you lose the safe harbour and the decision becomes discretionary. High-frequency, leveraged or income-replacing trading is where people get reclassified." },

    { type: "h2", text: "Reporting and deadlines" },
    { type: "ul", items: [
      "The tax year is the calendar year. Crypto is declared in your cantonal tax return, both as wealth (year-end value) and, where relevant, as income (staking, mining, lending).",
      "Use the FTA year-end tax values where published; otherwise the market value on 31 December.",
      "Deadlines are set by each canton (commonly around March, with extensions available). Keep records of holdings, income received and transaction volumes — the last matters for the professional-trader test.",
    ] },

    { type: "h2", text: "The bottom line" },
    { type: "p", text: "For a genuine private, buy-and-hold investor, Switzerland is hard to beat: no capital gains tax, just a modest wealth tax and income tax on any rewards. The two things to watch are the wealth-tax declaration (get the year-end value right) and the professional-trader criteria (stay inside the safe harbour). Trade like an investor, declare your holdings, and the gains stay yours." },
  ],
  faq: [
    { q: "Does Switzerland tax crypto capital gains?", a: "Not for private investors. Capital gains on crypto held as private wealth are exempt from income tax. Switzerland instead levies an annual wealth tax on the value of your holdings." },
    { q: "How does the Swiss crypto wealth tax work?", a: "Your crypto is valued at year-end (using the FTA's published tax values where available) and added to your other assets, with the total taxed at your canton's wealth-tax rate above a tax-free threshold. Rates are generally low, up to around 1%." },
    { q: "Is staking taxable in Switzerland?", a: "Yes. Staking, mining, lending and liquidity-mining rewards are taxable as income at their value when received, as is being paid in crypto. Only capital gains are tax-free for private investors." },
    { q: "What makes someone a professional crypto trader in Switzerland?", a: "The FTA's safe-haven rules: hold at least six months, keep transaction volume under five times your holdings, keep gains below 50% of income, avoid debt financing, and use derivatives only for hedging. Fail these and gains can be reclassified as taxable self-employment income." },
    { q: "Do I have to declare crypto in Switzerland even if I didn't sell?", a: "Yes. You declare your year-end crypto value for the wealth tax regardless of whether you sold, plus any staking, mining or lending income received during the year." },
  ],
};

export default guide;
