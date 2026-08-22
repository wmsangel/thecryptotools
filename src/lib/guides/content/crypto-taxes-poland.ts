import type { Guide } from "../types";

const guide: Guide = {
  slug: "crypto-taxes-poland",
  affiliate: "tax",
  title: "Crypto Tax in Poland: Flat 19%, Crypto-to-Crypto Is Free, and Costs Never Expire",
  description:
    "Poland taxes crypto at a flat 19% on PIT-38, does not tax crypto-to-crypto swaps at all, and lets unused acquisition costs roll forward indefinitely. It is one of Europe's cleanest regimes — with two sharp edges.",
  readingMinutes: 8,
  updatedAt: "2026-08-02",
  reviewedAt: "2026-08-02",
  sources: [
    {
      label:
        "PIT — podatek dochodowy od osób fizycznych",
      publisher: "podatki.gov.pl",
      url: "https://www.podatki.gov.pl/pit/",
    },
  ],
  seo: {
    keywords: [
      "crypto tax poland",
      "poland cryptocurrency tax",
      "pit-38 kryptowaluty",
      "podatek od kryptowalut",
      "poland crypto tax rate 19%",
      "bitcoin tax poland",
    ],
    description:
      "Poland crypto tax guide: the flat 19% rate on PIT-38, why crypto-to-crypto swaps are not taxable, which costs are deductible, indefinite carry-forward of costs, and why crypto losses cannot offset stock gains.",
  },
  relatedTools: ["crypto-tax-calculator", "tax-loss-harvesting-calculator", "profit-calculator", "dca-calculator"],
  partOf: "crypto-tax-by-country",
  body: [
    { type: "cta", title: "Do this with your own numbers", text: "Drop an exchange CSV into the free tax report generator and it applies this country's cost-basis method, holding-period rules and allowance automatically. It runs in your browser — nothing is uploaded.", href: "/crypto-tax-report", label: "Open the tax report generator" },
    { type: "callout", text: "General information, not tax advice. Reflects the Polish PIT Act and rules current for 2026. Check podatki.gov.pl or a Polish doradca podatkowy before you file." },

    { type: "p", text: "Poland built a self-contained box for crypto in its personal income tax act, and the result is unusually clean. One flat rate. No progressive brackets. No holding periods. And — rarely for Europe — swapping one crypto for another is simply not a taxable event. For an active trader that alone can be worth more than any rate difference. The trade-offs are real but narrow, and they are worth understanding before they surprise you." },

    { type: "h2", text: "A flat 19%, in its own category" },
    { type: "p", text: "Income from the disposal of virtual currencies for consideration (odpłatne zbycie waluty wirtualnej) is treated as income from monetary capital and taxed at a flat 19%. Whether your annual profit is 1,000 złoty or 1,000,000 złoty, the rate is the same." },
    { type: "p", text: "Crucially, this income sits in its own silo. Under art. 30b of the PIT Act, income from disposing of virtual currencies is not combined with income taxed on other bases — it does not stack onto your salary and cannot push you into a higher bracket. Nor does salary push up your crypto rate. A high earner and a student pay the same 19% on the same gain." },
    { type: "tool", slug: "crypto-tax-calculator" },

    { type: "h2", text: "Crypto-to-crypto is not a taxable event" },
    { type: "p", text: "This is Poland's headline advantage. Exchanging one virtual currency for another — BTC for ETH, ETH for a stablecoin — does not count as a disposal for consideration and generates no tax obligation. Nor does simply holding." },
    { type: "p", text: "Tax arises when you move value out of the crypto box:" },
    { type: "ul", items: [
      "Selling virtual currency for złoty or another fiat currency.",
      "Exchanging virtual currency for goods, services or property rights.",
      "Using virtual currency to settle a liability.",
    ] },
    { type: "callout", text: "Compare this with Ireland, Germany or the United States, where every swap is a disposal requiring a valuation. A Polish trader who rotates between tokens all year and never converts to złoty has, on the face of it, no taxable income at all — and no per-swap record-keeping burden." },
    { type: "p", text: "The symmetry is that expenses connected with exchanging one virtual currency for another are not deductible either. The whole crypto-to-crypto leg is outside the system, in both directions." },

    { type: "h2", text: "What counts as a deductible cost" },
    { type: "p", text: "Deductible costs are documented expenses incurred directly on acquiring the virtual currency, plus costs connected with its disposal — including documented payments to the exchanges and other entities listed under Poland's anti-money-laundering act. In practice: the purchase price and exchange commissions." },
    { type: "p", text: "What is not deductible: financing costs, hardware, electricity for mining as an individual, and anything only indirectly connected with the acquisition. The category is read narrowly." },
    { type: "tool", slug: "dca-calculator" },

    { type: "h2", text: "The carry-forward that makes DCA painless" },
    { type: "p", text: "Costs are recognised in the tax year they are actually incurred, not in the year of the matching sale. That sounds like a trap and is in fact a considerable benefit: if in a given year your spending on virtual currencies exceeds your revenue from disposing of them, the excess costs increase your costs of disposal in the following tax year — and can keep rolling forward." },
    { type: "p", text: "The practical consequence is that a dollar-cost averager who buys throughout the year and sells nothing should still file. You report the purchases as costs, declare zero revenue, and bank the accumulated cost pool against the year you eventually sell. Skip the filing and you may struggle to prove the cost base years later — this is the single most common Polish crypto mistake." },
    { type: "p", text: "There is no first-in-first-out or specific-identification tracking to do. Poland works on annual totals: sum your revenue, sum your costs, tax 19% of the difference. It is materially simpler than lot-by-lot regimes." },
    { type: "tool", slug: "profit-calculator" },

    { type: "h2", text: "The two sharp edges" },
    { type: "p", text: "First, the silo cuts both ways. Because crypto income is not combined with other income, a crypto loss cannot be set against your salary, your business income or your gains on shares. And a stock market loss on PIT-38 cannot reduce your crypto tax. The two live in the same form but not the same pot." },
    { type: "p", text: "Second, a genuine loss is carried as excess costs, not as a loss in the usual sense. If you never realise revenue from virtual currencies again, the accumulated costs never do anything. They wait, indefinitely, for a disposal that may not come." },

    { type: "h2", text: "Mining, staking and payment in crypto" },
    { type: "p", text: "Mining for yourself does not create revenue at the moment of mining — a mined coin is only taxed when it is later disposed of for consideration, which fits the same framework. But mined coins acquired this way have no purchase cost to deduct, so the eventual sale is taxed on close to the full proceeds." },
    { type: "p", text: "Staking rewards, lending yield and airdrops are less settled and treatment can depend on the specific arrangement; several fall outside the virtual-currency box and into general income rules. Where crypto is received as remuneration for work or services, it is income under the normal rules for that source, valued in złoty on receipt — not under the flat 19% regime. If a meaningful part of your activity is rewards rather than trading, this is worth a specific ruling (interpretacja indywidualna) rather than an assumption." },

    { type: "h2", text: "Filing: PIT-38, by 30 April" },
    { type: "ul", items: [
      "The tax year is the calendar year. Virtual currencies are reported in the dedicated section of the PIT-38 return.",
      "The deadline to file and pay is 30 April of the following year.",
      "File even in years with no sales, to lock in that year's costs and roll them forward.",
      "Report revenue and costs in złoty, converted at the appropriate rate for the transaction date.",
      "Keep exchange statements and transaction histories — costs must be documented to be deductible.",
    ] },
    { type: "p", text: "The EU-wide Crypto-Asset Reporting Framework applies from 1 January 2026, so Polish and other EU service providers now report user transaction data to tax authorities, with automatic cross-border exchange to follow. The old assumption that a foreign exchange keeps activity out of view no longer holds." },

    { type: "h2", text: "The bottom line" },
    { type: "p", text: "Poland's regime is one of the most trader-friendly in the EU without being a tax haven: 19% flat, no progression, no per-swap taxation, annual totals instead of lot tracking, and a cost pool that never expires. The catches are that crypto losses stay locked inside crypto, and that the carry-forward only works if you file every year — including the quiet years when you only bought. File the empty years, and the system does the rest." },
  ],
  faq: [
    { q: "What is the crypto tax rate in Poland?", a: "A flat 19% on income from disposing of virtual currencies for consideration, regardless of amount or holding period. It is taxed separately and does not combine with your salary or other income." },
    { q: "Is crypto-to-crypto trading taxable in Poland?", a: "No. Exchanging one virtual currency for another is not a disposal for consideration and creates no tax liability. The flip side is that costs relating to crypto-to-crypto exchanges are not deductible either." },
    { q: "When does crypto become taxable in Poland?", a: "When you sell virtual currency for fiat, exchange it for goods, services or property rights, or use it to settle a liability. Buying and holding, and swapping between tokens, are not taxable events." },
    { q: "Do I have to file PIT-38 if I only bought crypto and did not sell?", a: "You should. Costs are recognised in the year they are incurred, and reporting them with zero revenue rolls the excess forward to future years. Skipping the filing risks losing the ability to prove your cost base later." },
    { q: "Can I offset crypto losses against other income in Poland?", a: "No. Crypto income is taxed separately from other sources, so excess crypto costs cannot reduce salary, business income or share gains — they only carry forward against future virtual-currency revenue, indefinitely." },
    { q: "When is the Polish crypto tax deadline?", a: "PIT-38 must be filed and the tax paid by 30 April of the year following the tax year, which is the calendar year." },
  ],
};

export default guide;
