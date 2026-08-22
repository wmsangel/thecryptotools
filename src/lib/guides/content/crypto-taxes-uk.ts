import type { Guide } from "../types";

const guide: Guide = {
  slug: "crypto-taxes-uk",
  affiliate: "tax",
  title: "Crypto Tax in the UK: HMRC Rules, CGT Rates and Share Pooling",
  description:
    "HMRC has no separate crypto tax — it uses Capital Gains Tax, an income tax charge on rewards, and share-pooling rules that decide which coins you actually sold. Here is how all three work.",
  readingMinutes: 9,
  updatedAt: "2026-07-21",
  reviewedAt: "2026-07-21",
  sources: [
    {
      label:
        "Cryptoassets Manual",
      publisher: "HMRC",
      url: "https://www.gov.uk/hmrc-internal-manuals/cryptoassets-manual",
    },
    {
      label:
        "Capital Gains Tax: rates",
      publisher: "GOV.UK",
      url: "https://www.gov.uk/capital-gains-tax/rates",
    },
    {
      label:
        "Capital Gains Tax: allowances",
      publisher: "GOV.UK",
      url: "https://www.gov.uk/capital-gains-tax/allowances",
    },
  ],
  seo: {
    keywords: [
      "crypto tax uk",
      "hmrc crypto",
      "capital gains tax crypto uk",
      "section 104 pool crypto",
      "crypto tax allowance uk",
      "bed and breakfasting 30 day rule",
    ],
    description:
      "UK crypto tax guide: HMRC capital gains treatment, the £3,000 annual exempt amount, 18% and 24% CGT rates, Section 104 pooling and the 30-day rule, staking income, and the new CARF reporting regime.",
  },
  relatedTools: ["crypto-tax-calculator", "tax-loss-harvesting-calculator", "average-entry-calculator", "profit-calculator"],
  partOf: "crypto-tax-by-country",
  body: [
    { type: "cta", title: "Do this with your own numbers", text: "Drop an exchange CSV into the free tax report generator and it applies this country's cost-basis method, holding-period rules and allowance automatically. It runs in your browser — nothing is uploaded.", href: "/crypto-tax-report", label: "Open the tax report generator" },
    { type: "callout", text: "General information, not tax advice. HMRC guidance evolves and individual circumstances vary. Check gov.uk or speak to a qualified adviser before you file." },

    { type: "p", text: "There is no UK crypto tax as such. HMRC folds cryptoassets into the existing system: if you hold them as an investment, disposals fall under Capital Gains Tax; if you receive tokens as a reward for something, that is Income Tax. Only in rare cases does activity reach the level of a financial trade. Nearly everyone reading this is an investor for tax purposes, however actively they trade — HMRC sets that bar deliberately high." },

    { type: "h2", text: "What counts as a disposal" },
    { type: "ul", items: [
      "Selling crypto for pounds.",
      "Exchanging one token for another — a disposal at market value in sterling, even though no fiat moved.",
      "Spending crypto on goods or services.",
      "Gifting crypto to anyone other than a spouse or civil partner.",
    ] },
    { type: "p", text: "Not disposals: buying and holding, moving coins between your own wallets, and transfers to a spouse or civil partner, which pass at no gain and no loss and effectively let a couple use two allowances." },

    { type: "h2", text: "Allowance and rates" },
    { type: "p", text: "The Capital Gains Tax annual exempt amount is £3,000 for both 2025/26 and 2026/27. Gains within that are free of CGT. Above it, crypto is taxed at 18% for gains falling within your basic rate band and 24% above it — rates that took effect for disposals on or after 30 October 2024, replacing the previous 10% and 20%." },
    { type: "p", text: "The mechanic that surprises people: the rate depends on your total income plus gains. You stack the gain on top of your income, and the portion that spills over the basic rate threshold is taxed at 24% while the rest stays at 18%. A single gain can therefore straddle both rates." },
    { type: "p", text: "The allowance has fallen sharply from £12,300 a few years ago, which means far more ordinary investors now have a filing obligation than did under the old regime — and the reporting requirement can bite even where little tax is due." },
    { type: "tool", slug: "crypto-tax-calculator" },

    { type: "h2", text: "Share pooling: which coins did you actually sell?" },
    { type: "p", text: "If you bought BTC five times at five prices and sold some, which purchase did you sell? HMRC answers with matching rules, applied in order, exactly as it does for shares. Getting this wrong is the most common source of incorrect UK crypto returns." },
    { type: "ul", items: [
      "Same-day rule — disposals are matched first against acquisitions made the same day.",
      "30-day rule (the bed-and-breakfasting rule) — next, matched against acquisitions in the 30 days after the disposal, earliest first. This is what stops you from selling to crystallise a loss and immediately buying back.",
      "Section 104 pool — anything left is matched against the pool: all your remaining holdings of that token, merged into a single averaged cost. Each token gets its own pool, so BTC, ETH and SOL are tracked separately.",
    ] },
    { type: "p", text: "The pool works on a weighted average. Buy 1 BTC at £20,000 and 1 BTC at £30,000 and the pool is 2 BTC at £50,000, an average of £25,000 each. Sell 1 BTC for £40,000 and the gain is £15,000, regardless of which coin you feel you sold. NFTs are the exception — they are not fungible, so they are not pooled and the matching rules do not apply." },
    { type: "tool", slug: "average-entry-calculator" },

    { type: "h2", text: "Staking, mining and airdrops" },
    { type: "p", text: "Where these do not amount to a trade, HMRC treats the tokens as miscellaneous income, taxed at your marginal Income Tax rate on the sterling value when received. The £1,000 trading and miscellaneous income allowance covers small amounts. Above that you have obligations: notify HMRC where such income is between £1,000 and £2,500, and register for Self Assessment above £2,500." },
    { type: "p", text: "For 2026/27 the marginal rates are the standard ones — a £12,570 personal allowance, 20% to £50,270, 40% to £125,140 and 45% above. National Insurance may also apply depending on the nature of the activity." },
    { type: "p", text: "Then it happens twice. Receiving a reward is income; later selling it is a disposal, with the value already taxed as income becoming your acquisition cost. Airdrops received purely for holding, with nothing given in return, may escape the income charge but still enter the pool at nil or market cost for CGT — a distinction worth checking against the specific facts." },

    { type: "h2", text: "Losses" },
    { type: "p", text: "Capital losses offset gains in the same year, and unused losses carry forward indefinitely — but only if you claim them, and the claim window is four years from the end of the tax year in which the loss arose. Reporting a loss year you would otherwise skip is often worth the paperwork purely to bank the loss." },
    { type: "p", text: "For tokens that have become genuinely worthless rather than merely cheap, a negligible value claim can crystallise the loss without a disposal. Coins lost to a forgotten private key are treated differently again: HMRC's position is that you still own them, so there is no disposal — a negligible value claim is the route, not a straightforward loss." },
    { type: "tool", slug: "profit-calculator" },

    { type: "h2", text: "Reporting and deadlines" },
    { type: "ul", items: [
      "Self Assessment — report gains in the return for the tax year of disposal (6 April to 5 April), filed and paid by 31 January following the tax year end.",
      "Real-time CGT service — for non-property gains you can report by 31 December in the tax year after the gain and pay by 31 January. A 2025/26 gain, for example, is reported by 31 December 2026 and paid by 31 January 2027. It is unavailable if you are already in Self Assessment, in which case the gain goes in the return.",
      "Records to keep: date, token type, quantity, sterling value at the time, running pool cost, wallet addresses and bank statements. HMRC expects you to be able to substantiate every line.",
    ] },

    { type: "h2", text: "CARF: HMRC is now getting the data" },
    { type: "p", text: "The Cryptoasset Reporting Framework took effect on 1 January 2026 under SI 2025/744. UK crypto service providers must now collect identifying information from users — name, address, date of birth, National Insurance number, tax residence — along with transaction detail. The first reports covering calendar 2026 are due to HMRC between January and May 2027, and the framework is being extended to domestic UK users as well as cross-border ones." },
    { type: "callout", text: "Practically, HMRC's crypto nudge letters were already going out based on exchange data requests. From 2027 the reporting is systematic. The window in which non-reporting went unnoticed has closed." },

    { type: "h2", text: "What is still unsettled" },
    { type: "p", text: "DeFi remains the messy corner. Under current rules, depositing tokens into a lending or staking arrangement can itself be a disposal if beneficial ownership passes — which can generate a dry tax charge on assets you never sold. A no-gain-no-loss treatment for certain DeFi arrangements was floated at the Autumn Budget 2025, but it is a proposal under consultation, not enacted law. Do not plan around it, and get advice if you are running meaningful DeFi positions." },
  ],
  faq: [
    { q: "How much crypto can I sell tax-free in the UK?", a: "Gains up to the £3,000 annual exempt amount are free of CGT for 2025/26 and 2026/27. That is gains, not proceeds — selling £20,000 of crypto that cost £18,000 produces a £2,000 gain and no CGT." },
    { q: "What are the UK CGT rates on crypto?", a: "18% for gains within your basic rate band and 24% for gains above it, for disposals on or after 30 October 2024. The gain stacks on top of your income, so one disposal can be split across both rates." },
    { q: "Is swapping one crypto for another taxable in the UK?", a: "Yes. HMRC treats a crypto-to-crypto exchange as a disposal at market value in sterling, so a gain or loss arises even though no pounds were involved." },
    { q: "What is the Section 104 pool?", a: "The weighted-average cost of all your remaining holdings of a token, used to calculate gains after the same-day and 30-day matching rules have been applied. Each token has its own pool; NFTs are not pooled." },
    { q: "Do I pay tax on staking rewards in the UK?", a: "Generally yes — as miscellaneous income at your marginal rate on the sterling value when received, subject to the £1,000 trading and miscellaneous income allowance. Selling those tokens later is a separate CGT event." },
    { q: "Do I need to report crypto if I made no gain?", a: "You may. Reporting is required if disposal proceeds exceed the reporting threshold or you are already in Self Assessment, even where no tax is due — and reporting a loss year is how you bank losses to use later." },
    { q: "Does HMRC know about my crypto?", a: "Increasingly, yes. HMRC has obtained data from exchanges for years, and under CARF, in force since 1 January 2026, UK providers collect user and transaction data with the first reports due to HMRC in 2027." },
  ],
};

export default guide;
