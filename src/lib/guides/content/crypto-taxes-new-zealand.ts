import type { Guide } from "../types";

const guide: Guide = {
  slug: "crypto-taxes-new-zealand",
  affiliate: "tax",
  title: "Crypto Tax in New Zealand: No CGT, But Almost Everything Is Income",
  description:
    "New Zealand has no capital gains tax — and that is exactly why crypto is taxed so heavily. IRD treats most crypto profit as ordinary income at up to 39%, and it already holds data on 355,000 NZ crypto users.",
  readingMinutes: 8,
  updatedAt: "2026-08-02",
  reviewedAt: "2026-08-02",
  sources: [
    {
      label:
        "Cryptoassets",
      publisher: "Inland Revenue",
      url: "https://www.ird.govt.nz/cryptoassets",
    },
  ],
  seo: {
    keywords: [
      "crypto tax new zealand",
      "nz cryptocurrency tax",
      "ird crypto tax",
      "cryptoassets tax nz",
      "bitcoin tax new zealand",
      "new zealand crypto income tax rate",
    ],
    description:
      "New Zealand crypto tax guide: why no capital gains tax does not mean tax-free, IRD's acquired-for-disposal rule, income tax rates to 39%, mining and staking, CARF from 1 April 2026, and IRD's exchange data.",
  },
  relatedTools: ["crypto-tax-calculator", "tax-loss-harvesting-calculator", "profit-calculator", "staking-rewards-calculator"],
  partOf: "crypto-tax-by-country",
  body: [
    { type: "cta", title: "Do this with your own numbers", text: "Drop an exchange CSV into the free tax report generator and it applies this country's cost-basis method, holding-period rules and allowance automatically. It runs in your browser — nothing is uploaded.", href: "/crypto-tax-report", label: "Open the tax report generator" },
    { type: "callout", text: "General information, not tax advice. Reflects Inland Revenue guidance and rates current for 2026. Check ird.govt.nz or a New Zealand chartered accountant before you file." },

    { type: "p", text: "'New Zealand has no capital gains tax' is true, widely repeated, and one of the most expensive misunderstandings in the country's crypto community. The absence of a CGT regime does not create a gap where crypto profit falls untaxed. It does the opposite: with no capital box to fall into, profit from crypto is generally caught as ordinary income and taxed at your marginal rate — up to 39%. Higher, in many cases, than the CGT rates in countries that do have one." },

    { type: "h2", text: "Cryptoassets are property, and disposals are usually taxable" },
    { type: "p", text: "IRD treats cryptoassets as a form of property, not as currency. Its guidance for individuals is direct: 'In most cases, the amounts you get from selling, trading or exchanging cryptoassets are taxable (this includes when you exchange one type of cryptoasset for another).'" },
    { type: "p", text: "Disposal is broad. Selling for NZD, swapping one token for another, lending, and 'using cryptoassets to pay for goods or services' are all disposal events. There is no minimum threshold, no tax-free allowance and no long-term holding discount." },
    { type: "tool", slug: "crypto-tax-calculator" },

    { type: "h2", text: "The three ways crypto becomes taxable" },
    { type: "p", text: "IRD sets out the situations that create a liability on buying and selling:" },
    { type: "ul", items: [
      "Acquiring cryptoassets for the purpose of disposal — for example to sell or exchange them later.",
      "Trading in cryptoassets, where the activity amounts to a business.",
      "Using cryptoassets as part of a profit-making scheme.",
    ] },
    { type: "p", text: "The first is the one that catches nearly everyone. It is a test of intention at the time you acquired the asset, and for an asset with no dividend, no rent and no practical use for most holders, the honest answer is usually that you bought it to sell it at a higher price. That makes the eventual gain taxable income — regardless of how long you held it. Holding for five years does not convert income into an untaxed capital gain the way it would in Germany or Portugal." },
    { type: "callout", text: "The mirror image is the compensation: because the profit is income, a genuine loss on disposal is generally deductible against your other income. That is more generous than a ring-fenced capital loss regime — but it only works if you were in the taxable category to begin with." },

    { type: "h2", text: "The rates: 10.5% to 39%" },
    { type: "p", text: "There is no special crypto rate. Net crypto income is added to your other income and taxed at the individual rates that apply from 1 April 2025:" },
    { type: "ul", items: [
      "$0 – $15,600: 10.5%",
      "$15,601 – $53,500: 17.5%",
      "$53,501 – $78,100: 30%",
      "$78,101 – $180,000: 33%",
      "$180,001 and above: 39%",
    ] },
    { type: "p", text: "Because the brackets are progressive, a large realised gain in a single year can push a chunk of it into the 39% band even if your salary sits comfortably below it. Timing disposals across tax years — New Zealand's runs 1 April to 31 March — can matter more here than in flat-rate countries." },
    { type: "tool", slug: "profit-calculator" },

    { type: "h2", text: "Mining and staking" },
    { type: "p", text: "IRD's position is that 'in most cases, cryptoassets you get from mining (such as transaction fees and block rewards) are taxable,' covering both proof-of-work mining and proof-of-stake staking. Rewards are income at their New Zealand dollar value when you receive them." },
    { type: "p", text: "Then there is a second event. IRD notes you 'may also need to pay income tax on any profit you make if you later sell or exchange your mined cryptoassets' — measured against the value already brought to tax on receipt. Mined and staked coins are therefore taxed twice over their life: once as income when earned, once on any subsequent movement in value. On GST, the mining service itself is zero-rated because it is supplied to a blockchain outside New Zealand, and there are no GST implications on the later sale." },
    { type: "tool", slug: "staking-rewards-calculator" },

    { type: "h2", text: "IRD already has the data" },
    { type: "p", text: "This is not a theoretical enforcement risk. In a media release on 20 April 2026, Inland Revenue said it had identified 355,000 unique crypto-asset users in New Zealand, across roughly 57 million transactions worth a combined $36 billion. It has begun writing to individuals who are normally auto-assessed but have traded on crypto exchanges." },
    { type: "callout", text: "IRD's phrasing leaves little room: 'people are not invisible on blockchain, and we have the tools and the analytics capabilities to identify and expose crypto-asset activities.'" },

    { type: "h2", text: "CARF starts 1 April 2026" },
    { type: "p", text: "New Zealand has adopted the OECD's Crypto-Asset Reporting Framework. New Zealand-based Reporting Crypto-Asset Service Providers had to be ready to collect the required information from 1 April 2026. The first reporting period runs 1 April 2026 to 31 March 2027, with the first report due by 30 June 2027." },
    { type: "p", text: "The exchange runs both ways. Data on non-resident users of NZ providers goes to their home tax authorities, and IRD receives information from overseas authorities about New Zealand residents earning through foreign platforms. Using an offshore exchange is no longer a practical way to stay out of view." },

    { type: "h2", text: "Filing and records" },
    { type: "ul", items: [
      "The tax year runs 1 April to 31 March. Crypto income goes in an IR3 individual income tax return, generally due 7 July (later if you use a tax agent).",
      "Every transaction must be converted to New Zealand dollars — you cannot report in USD or in crypto.",
      "If you have crypto income, you cannot rely on an automatic income tax assessment; you need to file.",
      "Keep records of dates, amounts, NZD values, the other party where relevant, and wallet addresses.",
    ] },

    { type: "h2", text: "The bottom line" },
    { type: "p", text: "New Zealand's lack of a capital gains tax makes crypto look lightly taxed and is the reason it is not. Buy crypto intending to sell it later — which describes almost every holder — and the profit is ordinary income at up to 39%, on every sale, swap and purchase made with it, with no allowance and no holding-period relief. The upside is that real losses are genuinely deductible. With CARF live from 1 April 2026 and IRD already holding data on 355,000 users, the practical question is no longer whether the department can see the activity." },
  ],
  faq: [
    { q: "Does New Zealand tax cryptocurrency if there is no capital gains tax?", a: "Yes. Because there is no capital gains regime, crypto profit is generally caught as ordinary income instead, taxed at your marginal rate of 10.5% to 39%. The absence of CGT makes crypto more heavily taxed here, not less." },
    { q: "What is the crypto tax rate in New Zealand?", a: "There is no separate crypto rate. Net crypto income is added to your other income and taxed at the individual brackets: 10.5% up to $15,600, 17.5% to $53,500, 30% to $78,100, 33% to $180,000 and 39% above that." },
    { q: "Is swapping one cryptoasset for another taxable in NZ?", a: "Yes. IRD states that amounts from selling, trading or exchanging cryptoassets are taxable, and explicitly includes exchanging one type of cryptoasset for another. Spending crypto on goods or services is also a disposal." },
    { q: "Does holding crypto long term make it tax-free in New Zealand?", a: "No. The test is your purpose when you acquired the asset. If you bought it intending to dispose of it at some point — the usual case for crypto — the eventual profit is taxable income no matter how long you held it." },
    { q: "How are staking rewards taxed in New Zealand?", a: "As income at their NZD value when received. Selling those coins later can produce a further taxable profit measured against that value. Mining is treated the same way, with the mining service itself zero-rated for GST." },
    { q: "Can I deduct crypto losses in New Zealand?", a: "Generally yes, where the activity was taxable in the first place. Because the profit would have been ordinary income, a genuine loss on disposal is normally deductible against your other income — more generous than a ring-fenced capital loss." },
  ],
};

export default guide;
