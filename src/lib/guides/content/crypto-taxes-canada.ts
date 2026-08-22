import type { Guide } from "../types";

const guide: Guide = {
  slug: "crypto-taxes-canada",
  affiliate: "tax",
  title: "Crypto Tax in Canada: CRA Rules, the 50% Inclusion Rate and ACB",
  description:
    "The CRA taxes crypto as a commodity, with only half your capital gain taxable — the feared increase to two-thirds was cancelled. Here is how the ACB method, the superficial loss rule and CARF work.",
  readingMinutes: 9,
  updatedAt: "2026-07-27",
  reviewedAt: "2026-07-27",
  sources: [
    {
      label:
        "Information for crypto-asset users and tax professionals",
      publisher: "Canada Revenue Agency",
      url: "https://www.canada.ca/en/revenue-agency/programs/about-canada-revenue-agency-cra/compliance/cryptocurrency-guide.html",
    },
  ],
  seo: {
    keywords: [
      "crypto tax canada",
      "cra crypto",
      "capital gains inclusion rate canada 2026",
      "adjusted cost base crypto",
      "superficial loss rule crypto canada",
      "crypto capital gains canada",
    ],
    description:
      "Canada crypto tax guide: CRA commodity treatment, the 50% capital gains inclusion rate (the 66.67% increase was cancelled), capital vs business income, the ACB method, the superficial loss rule and CARF reporting from 2026.",
  },
  relatedTools: ["crypto-tax-calculator", "average-entry-calculator", "profit-calculator"],
  partOf: "crypto-tax-by-country",
  body: [
    { type: "cta", title: "Do this with your own numbers", text: "Drop an exchange CSV into the free tax report generator and it applies this country's cost-basis method, holding-period rules and allowance automatically. It runs in your browser — nothing is uploaded.", href: "/crypto-tax-report", label: "Open the tax report generator" },
    { type: "callout", text: "General information, not tax advice. CRA guidance and rates change, and provincial rules and personal circumstances vary. Check canada.ca or speak to a Canadian tax professional before you file." },

    { type: "p", text: "The Canada Revenue Agency treats crypto as a commodity, not as money. That means every disposal is a barter transaction with tax consequences, and the profit is treated either as a capital gain or as business income depending on what you were doing. Getting that capital-versus-business distinction right is the heart of Canadian crypto tax — it changes how much of your profit is taxed." },

    { type: "h2", text: "The 50% inclusion rate (and the increase that was cancelled)" },
    { type: "p", text: "For capital gains, Canada uses an inclusion rate: only a portion of the gain is added to your taxable income. That rate is 50% — half of a capital gain is taxable, the other half is tax-free, and the taxable half is taxed at your marginal rate. The 2024 federal budget proposed raising the inclusion rate to 66.67% on gains above $250,000, but that increase was ultimately cancelled, and the CRA is administering the 50% rate for the 2025 and 2026 tax years. So the simple rule holds: half your capital gain is taxable." },
    { type: "callout", text: "Canada has no separate flat CGT rate and no tax-free capital gains allowance. The taxable half of your gain is stacked onto your income and taxed at your combined federal-plus-provincial marginal rate — which ranges from roughly 44% to 54% at the top end depending on your province." },
    { type: "tool", slug: "crypto-tax-calculator" },

    { type: "h2", text: "Capital gain or business income?" },
    { type: "p", text: "If you hold crypto as an investment, disposals are capital gains and the 50% inclusion applies. If your activity amounts to carrying on a business — frequent, commercial, sophisticated trading, or mining as a business — the profit is business income and 100% of it is taxable, not half. The CRA weighs frequency, intention, expertise, financing and how business-like the activity is. Most ordinary investors are on capital account, but active day-traders can find themselves fully taxed as a business, so the distinction is worth getting advice on if you trade heavily." },

    { type: "h2", text: "What triggers a disposal" },
    { type: "ul", items: [
      "Selling crypto for Canadian dollars.",
      "Trading one crypto for another — a barter transaction taxed at fair market value in CAD.",
      "Spending crypto on goods or services.",
      "Gifting crypto to someone else.",
      "Not a disposal: buying and holding, or transferring between your own wallets.",
    ] },

    { type: "h2", text: "The ACB method: your cost base is an average" },
    { type: "p", text: "Canada requires the adjusted cost base (ACB) method. Every time you buy more of a coin, you recalculate the average cost of your entire holding of that coin; when you sell, your gain is proceeds minus that average cost (and minus any transaction fees). You cannot cherry-pick which specific coins you sold the way US taxpayers sometimes can — the average is mandatory. Each coin has its own ACB, tracked separately." },
    { type: "p", text: "Worked example: buy 1 BTC at $40,000, then 1 BTC at $60,000, and your ACB is $50,000 per coin. Sell 1 BTC for $70,000 and your capital gain is $20,000 — of which only $10,000 (the 50% inclusion) is added to your income." },
    { type: "tool", slug: "average-entry-calculator" },

    { type: "h2", text: "The superficial loss rule (Canada's wash-sale)" },
    { type: "p", text: "You cannot sell a coin at a loss just to bank the deduction and immediately buy it back. Under the superficial loss rule, if you (or someone affiliated with you) buy the same crypto within 30 days before or after the sale and still hold it at the end of that window, the loss is denied. It is not lost forever, though — the denied loss is added to the ACB of the repurchased coins, so you get the benefit when you eventually sell them for good." },
    { type: "tool", slug: "profit-calculator" },

    { type: "h2", text: "Staking, mining and airdrops" },
    { type: "p", text: "The treatment of rewards is less settled in Canada than elsewhere, and depends on whether the activity is a hobby or a business. Mining or staking carried on as a business is business income at fair market value when received. For casual staking, the CRA's position has been evolving; a common conservative approach is to report rewards as income at their CAD value on receipt, which then sets the cost base for a later capital gain on disposal. Given the uncertainty, this is an area to get professional advice on if the amounts are meaningful." },

    { type: "h2", text: "Losses" },
    { type: "p", text: "Capital losses (the allowable half) can only offset taxable capital gains — not employment or other income. Unused net capital losses can be carried back up to three years and forward indefinitely, which makes a loss year genuinely valuable if you had gains in the prior three years. Business losses, by contrast, are more flexible and can offset other income, another reason the capital-versus-business line matters." },

    { type: "h2", text: "Reporting, deadlines and CARF" },
    { type: "ul", items: [
      "The tax year is the calendar year. Capital gains are reported on Schedule 3; business income on the relevant business schedules.",
      "The filing deadline for individuals is 30 April of the following year — so 2026 gains are reported by 30 April 2027.",
      "Keep records: dates, CAD values, ACB calculations, wallet addresses and exchange statements. The rolling ACB average makes continuous record-keeping essential.",
    ] },
    { type: "p", text: "Canada is implementing the OECD's Crypto-Asset Reporting Framework (CARF), effective 1 January 2026, with the first reports to the CRA due in 2027. Canadian crypto service providers will report user identities, balances and transaction data to the CRA annually. Combined with the CRA's existing power to compel data from exchanges, the practical message is the same as everywhere: assume the CRA can see your activity." },

    { type: "h2", text: "The bottom line" },
    { type: "p", text: "Canada's regime is middle-of-the-road: no magic tax-free hold like Germany, but a solid 50% inclusion rate that survived the proposed increase. The mechanics that trip people up are the mandatory ACB averaging and the superficial loss rule — both reward careful, continuous record-keeping. Track your ACB after every buy, respect the 30-day loss window, and know that from 2026 the reporting is automatic." },
  ],
  faq: [
    { q: "What is the crypto capital gains inclusion rate in Canada for 2026?", a: "50%. Only half of a capital gain is taxable, at your marginal rate. The 2024 proposal to raise it to 66.67% on gains above $250,000 was cancelled, and the CRA is administering the 50% rate for 2025 and 2026." },
    { q: "How is crypto taxed in Canada — capital gain or income?", a: "It depends. Investors are taxed on capital account (50% of the gain taxable). If your trading or mining amounts to a business, profits are business income and 100% taxable. The CRA weighs frequency, intention and how business-like the activity is." },
    { q: "What is the adjusted cost base (ACB) method?", a: "The mandatory Canadian method for calculating gains: the average cost of all identical coins you hold, recalculated every time you buy more. Your gain is proceeds minus that average cost. You cannot choose which specific coins you sold." },
    { q: "What is the superficial loss rule for crypto?", a: "If you sell crypto at a loss and buy the same coin within 30 days before or after (and still hold it at the end of that window), the loss is denied. The denied amount is instead added to the cost base of the repurchased coins." },
    { q: "Do I pay tax when I trade one crypto for another in Canada?", a: "Yes. The CRA treats a crypto-to-crypto trade as a barter disposal at fair market value in Canadian dollars, so a capital gain or loss arises even though no dollars were involved." },
    { q: "Does the CRA know about my crypto?", a: "Increasingly yes. The CRA can compel data from exchanges, and under CARF — effective 1 January 2026, with first reports due in 2027 — Canadian crypto service providers report user and transaction data to the CRA automatically." },
  ],
};

export default guide;
