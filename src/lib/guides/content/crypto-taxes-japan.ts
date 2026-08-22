import type { Guide } from "../types";

const guide: Guide = {
  slug: "crypto-taxes-japan",
  affiliate: "tax",
  title: "Crypto Tax in Japan: Miscellaneous Income Up to 55% — and the 20% Reform",
  description:
    "Japan taxes crypto gains as miscellaneous income at progressive rates that can reach around 55%. A reform to a flat 20% is advancing but not yet law. Here is the current system and what may change.",
  readingMinutes: 8,
  updatedAt: "2026-07-27",
  reviewedAt: "2026-07-27",
  sources: [
    {
      label:
        "Income tax information for individuals",
      publisher: "National Tax Agency",
      url: "https://www.nta.go.jp/english/taxes/individual/index.htm",
    },
  ],
  seo: {
    keywords: [
      "crypto tax japan",
      "japan crypto miscellaneous income",
      "japan crypto tax 55%",
      "japan 20% crypto tax reform",
      "japan crypto tax rate",
      "kaso tsuka tax",
    ],
    description:
      "Japan crypto tax guide: how gains are taxed as miscellaneous income at up to ~55%, why crypto-to-crypto trades are taxable, the limits on loss relief, and the proposed flat 20% reform.",
  },
  relatedTools: ["crypto-tax-calculator", "average-entry-calculator", "profit-calculator"],
  partOf: "crypto-tax-by-country",
  body: [
    { type: "callout", text: "General information, not tax advice. Japan's crypto tax reform is in progress and not yet enacted; personal circumstances vary. Check nta.go.jp or a Japanese tax accountant (zeirishi) before you file." },

    { type: "p", text: "Japan has one of the heaviest crypto tax regimes in the developed world, and it comes down to how gains are classified. Rather than being a separate, flat-rated capital gain the way stock profits are, crypto gains are lumped into 'miscellaneous income' and stacked on top of your salary — pushing many holders into the highest tax brackets. A long-discussed reform would change this, but as of now the heavy system is still the law." },

    { type: "h2", text: "Crypto gains are miscellaneous income (up to ~55%)" },
    { type: "p", text: "Profits from crypto are treated as miscellaneous income (zatsu-shotoku). They are added to your other income and taxed at Japan's progressive national income tax rates of 5% to 45%, plus a flat 10% local inhabitant tax. At the top, that combination reaches roughly 55% — far above the flat 20% that applies to listed-stock gains. The more you earn overall, the higher the rate your crypto gains face, because they sit on top of everything else." },
    { type: "callout", text: "This is the core unfairness holders complain about: a stock trader pays a flat ~20%, while a crypto trader with the same gain can pay more than double, purely because of how crypto is classified." },
    { type: "tool", slug: "crypto-tax-calculator" },

    { type: "h2", text: "Every crypto-to-crypto trade is taxable" },
    { type: "p", text: "Japan taxes not just cash-outs but crypto-to-crypto trades. Swapping BTC for ETH realises a gain or loss on the BTC at its yen value at the time of the trade. Spending crypto is likewise a taxable disposal. For active traders this means a long list of taxable events across the year, each needing a yen valuation — record-keeping is a real burden here." },
    { type: "tool", slug: "average-entry-calculator" },

    { type: "h2", text: "Limited loss relief" },
    { type: "p", text: "Because crypto gains are miscellaneous income, losses get little relief. A crypto loss can generally only be offset against other miscellaneous income in the same year — not against your salary, and not against separately-taxed categories like stock gains. And miscellaneous-income losses cannot be carried forward to future years. A bad year gives you little to show for it at tax time, which compounds the sting of the high rates." },
    { type: "tool", slug: "profit-calculator" },

    { type: "h2", text: "Staking, mining and rewards" },
    { type: "p", text: "Staking rewards, mining income, lending yield and airdrops are taxed as miscellaneous income at their yen value when received — at the same progressive rates. As everywhere, receiving is one taxable moment and the later disposal of those tokens is another, measured against the value already taxed as income." },

    { type: "h2", text: "The proposed 20% reform" },
    { type: "p", text: "Change is on the table. A bill to reclassify crypto as a financial instrument — aligning it with stocks and applying a flat 20% separate tax — has advanced through Japan's lower house, with a target of taking effect around 2026–2028. But it is not yet law: it still needs upper-house passage, government promulgation and Financial Services Agency rulemaking. And the relief would not be universal." },
    { type: "ul", items: [
      "Only around 105 tokens listed on domestic-licensed exchanges (including BTC and ETH) are expected to qualify for the flat 20% rate.",
      "Staking, lending and DeFi yields, NFTs, and trades on foreign or unregistered exchanges would remain miscellaneous income at rates up to ~55%.",
      "The result would be a two-tier system — so the classification of exactly what you hold and where you trade it would determine your rate.",
    ] },

    { type: "h2", text: "Reporting and deadlines" },
    { type: "ul", items: [
      "The tax year is the calendar year. Crypto is reported in the annual final income tax return (kakutei shinkoku), filed between 16 February and 15 March.",
      "There is a modest threshold below which salaried employees with small side income need not file, but crypto gains above it must be declared.",
      "Keep detailed yen-valued records of every trade, reward and disposal — the miscellaneous-income treatment and per-trade taxation make this essential.",
    ] },

    { type: "h2", text: "The bottom line" },
    { type: "p", text: "Under today's rules, Japan taxes crypto gains as miscellaneous income at up to around 55%, taxes every crypto-to-crypto trade, and gives losses almost no relief — a genuinely tough regime. A flat 20% reform is advancing and could transform the picture, but it is not yet enacted and would likely apply only to a limited set of listed tokens. Until it passes, file on the basis of the current system, and watch the reform closely if you hold meaningful gains." },
  ],
  faq: [
    { q: "What is the crypto tax rate in Japan?", a: "Crypto gains are miscellaneous income, taxed at progressive national rates of 5%–45% plus a flat 10% local inhabitant tax — up to roughly 55% at the top. This is far higher than the flat ~20% on listed-stock gains." },
    { q: "Are crypto-to-crypto trades taxable in Japan?", a: "Yes. Swapping one crypto for another is a taxable disposal at the yen value at the time of the trade, as is spending crypto. Active traders generate many taxable events across the year." },
    { q: "Can I offset or carry forward crypto losses in Japan?", a: "Only narrowly. A crypto loss can generally offset other miscellaneous income in the same year, but not your salary or stock gains, and miscellaneous-income losses cannot be carried forward to future years." },
    { q: "Is Japan cutting its crypto tax to 20%?", a: "A reform to reclassify crypto and apply a flat 20% rate has passed the lower house but is not yet law — it needs further approval and rulemaking. It would likely apply only to around 105 listed tokens, with staking, DeFi and foreign-exchange trades staying at up to ~55%." },
    { q: "How are staking rewards taxed in Japan?", a: "As miscellaneous income at their yen value when received, at the same progressive rates up to ~55%. Selling the reward tokens later is a separate taxable disposal." },
  ],
};

export default guide;
