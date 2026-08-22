import type { Guide } from "../types";

const guide: Guide = {
  slug: "crypto-taxes-australia",
  affiliate: "tax",
  title: "Crypto Tax in Australia: ATO Rules, the 50% CGT Discount and Personal Use",
  description:
    "The ATO taxes crypto as a CGT asset, but a 12-month hold halves your taxable gain. Here is how the 50% discount works, when the personal-use exemption applies, and how staking is taxed.",
  readingMinutes: 9,
  updatedAt: "2026-07-27",
  reviewedAt: "2026-07-27",
  sources: [
    {
      label:
        "Crypto asset investments",
      publisher: "ATO",
      url: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/crypto-asset-investments",
    },
    {
      label:
        "How to work out and report CGT on crypto",
      publisher: "ATO",
      url: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/crypto-asset-investments/how-to-work-out-and-report-cgt-on-crypto",
    },
  ],
  seo: {
    keywords: [
      "crypto tax australia",
      "ato crypto",
      "cgt discount crypto australia",
      "personal use asset crypto",
      "crypto capital gains tax australia",
      "staking tax australia",
    ],
    description:
      "Australia crypto tax guide: ATO capital gains treatment, the 50% CGT discount for 12-month holds, the personal-use asset exemption, marginal tax rates 2025-26, staking as income, losses and data matching.",
  },
  relatedTools: ["crypto-tax-calculator", "average-entry-calculator", "profit-calculator"],
  partOf: "crypto-tax-by-country",
  body: [
    { type: "cta", title: "Do this with your own numbers", text: "Drop an exchange CSV into the free tax report generator and it applies this country's cost-basis method, holding-period rules and allowance automatically. It runs in your browser — nothing is uploaded.", href: "/crypto-tax-report", label: "Open the tax report generator" },
    { type: "callout", text: "General information, not tax advice. ATO guidance changes and personal circumstances vary. Check ato.gov.au or speak to a registered tax agent before you lodge." },

    { type: "p", text: "The Australian Taxation Office treats crypto as property — specifically a CGT (capital gains tax) asset — not as currency. That single classification drives almost everything: nearly every time you dispose of a crypto asset, you trigger a CGT event, and the resulting gain or loss goes on your tax return. There is no separate 'crypto tax'; it rides on the existing capital gains and income tax systems." },

    { type: "h2", text: "What counts as a disposal (a CGT event)" },
    { type: "ul", items: [
      "Selling crypto for Australian dollars.",
      "Trading one crypto for another — a disposal at market value in AUD, even with no fiat involved.",
      "Spending crypto on goods or services.",
      "Gifting crypto to someone else.",
      "Not a disposal: buying and holding, or moving crypto between wallets you own.",
    ] },

    { type: "h2", text: "The 50% CGT discount: the reward for holding" },
    { type: "p", text: "This is the headline benefit for investors. If you hold a crypto asset for at least 12 months before disposing of it, you qualify for the 50% CGT discount — only half of the capital gain is added to your assessable income. Hold for less than 12 months and the full gain is taxable. On a $20,000 gain, that discount is the difference between $10,000 and $20,000 being taxed at your marginal rate." },
    { type: "callout", text: "The discount is only for individuals (and trusts), not companies, and only for assets held more than 12 months. The clock runs from the day after acquisition to the day of the CGT event." },
    { type: "tool", slug: "crypto-tax-calculator" },

    { type: "h2", text: "How the gain is taxed" },
    { type: "p", text: "Australia has no separate CGT rate and no tax-free CGT allowance. Your net capital gain (after the discount and after offsetting losses) is simply added to your other income and taxed at your marginal rate, plus the 2% Medicare levy. For 2025-26 the resident rates are: nil up to $18,200; 16% to $45,000; 30% to $135,000; 37% to $190,000; and 45% above that. (From 1 July 2026 the second bracket drops from 16% to 15%.) So the effective tax on a discounted long-term gain can be as low as 8% for someone in the second bracket, or up to 23.5% at the top." },
    { type: "tool", slug: "average-entry-calculator" },

    { type: "h2", text: "The personal use asset exemption (narrow)" },
    { type: "p", text: "There is a limited exemption for crypto that is a personal use asset — bought and used within a short time to buy personal goods or services, where the cost was less than $10,000. A capital gain on such an asset can be disregarded. But the ATO applies this strictly: crypto held as an investment, or held for any length of time before spending, is not a personal use asset, even for small amounts. In practice almost no one qualifies, so treat it as the exception, not a strategy." },

    { type: "h2", text: "Investor vs trader" },
    { type: "p", text: "The rules above are for investors, which is how the ATO views most people. If your activity amounts to carrying on a business of trading, your crypto is trading stock and profits are ordinary income — taxed in full with no 50% CGT discount, though losses are more freely deductible. The line depends on volume, sophistication, intention and organisation. Most individuals, however frequently they trade, remain investors; getting reclassified as a trader is uncommon and has significant consequences both ways." },

    { type: "h2", text: "Staking, airdrops and mining" },
    { type: "p", text: "Rewards are ordinary income, not capital. Staking rewards, most airdrops, and mined coins are taxed at their AUD market value on the day you receive them, at your marginal rate. That received value then becomes the cost base of those tokens, so when you later sell them a separate CGT event arises on any change in value. As with most countries, rewards are effectively taxed twice: once as income on receipt, then as CGT on disposal." },

    { type: "h2", text: "Losses" },
    { type: "p", text: "Capital losses can only offset capital gains — never your salary or other ordinary income. Unused capital losses carry forward indefinitely until you have gains to absorb them. A subtle trap: you must apply current-year and carried-forward losses before applying the 50% discount, which affects the maths of how much gain remains. Losses on a personal use asset are disregarded entirely, mirroring the exemption on its gains." },
    { type: "tool", slug: "profit-calculator" },

    { type: "h2", text: "Reporting, deadlines and ATO data matching" },
    { type: "ul", items: [
      "The Australian income year runs 1 July to 30 June. Crypto gains and income go in your individual tax return for that year.",
      "If you lodge your own return, the deadline is 31 October; using a registered tax agent generally extends it.",
      "Keep records for every transaction: date, AUD value, what it was for, wallet addresses and receipts. The ATO expects you to substantiate cost bases going back years.",
    ] },
    { type: "p", text: "The ATO runs a long-standing crypto data-matching program, collecting records from Australian exchanges covering millions of accounts, and cross-checks them against lodged returns. It routinely sends prompts to taxpayers whose exchange data does not match their return. With global automatic-exchange frameworks now rolling out, the assumption that crypto activity is invisible to the ATO is simply wrong." },

    { type: "h2", text: "The bottom line" },
    { type: "p", text: "In Australia the single most valuable move is the calendar one: crossing the 12-month mark halves the tax on your gain. Beyond that, remember that swaps and spending are disposals, that rewards are income on receipt, and that the ATO already has your exchange data. Track every acquisition date and AUD value, and the return writes itself." },
  ],
  faq: [
    { q: "How is crypto taxed in Australia?", a: "As a CGT asset. Disposing of crypto — selling, swapping, spending or gifting — triggers a capital gains tax event, and the net gain is added to your income at your marginal rate. Rewards like staking are taxed as ordinary income on receipt." },
    { q: "What is the 50% CGT discount on crypto?", a: "If you hold a crypto asset for at least 12 months before disposing of it, only half the capital gain is taxable. It applies to individuals, not companies, and can roughly halve your effective tax on a long-term gain." },
    { q: "Is there a tax-free crypto threshold in Australia?", a: "There's no separate CGT allowance. Gains are added to your income and taxed once you're above the $18,200 tax-free income threshold. The narrow personal-use asset exemption can apply to crypto bought for under $10,000 and spent quickly on personal items, but investment crypto never qualifies." },
    { q: "Do I pay tax when I swap one crypto for another?", a: "Yes. The ATO treats a crypto-to-crypto trade as a disposal at market value in AUD, so a capital gain or loss arises even though no dollars changed hands." },
    { q: "How are staking rewards taxed in Australia?", a: "As ordinary income at their AUD value on the day you receive them, taxed at your marginal rate. That value becomes the cost base, so selling the rewards later is a separate CGT event." },
    { q: "Does the ATO know about my crypto?", a: "Yes. The ATO runs a crypto data-matching program that collects account and transaction data from Australian exchanges and cross-checks it against tax returns, sending discrepancy notices where they don't match." },
  ],
};

export default guide;
