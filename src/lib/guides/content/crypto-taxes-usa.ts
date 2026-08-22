import type { Guide } from "../types";

const guide: Guide = {
  slug: "crypto-taxes-usa",
  affiliate: "tax",
  title: "Crypto Taxes in the US: IRS Rules, Rates and Forms",
  description:
    "The IRS treats crypto as property, which makes almost every trade a taxable event. Here are the current rates, the forms you file, and the two rule changes that caught people out this year.",
  readingMinutes: 9,
  updatedAt: "2026-07-21",
  reviewedAt: "2026-07-21",
  sources: [
    {
      label:
        "Digital assets",
      publisher: "IRS",
      url: "https://www.irs.gov/filing/digital-assets",
    },
    {
      label:
        "Topic no. 409, Capital gains and losses",
      publisher: "IRS",
      url: "https://www.irs.gov/taxtopics/tc409",
    },
    {
      label:
        "Notice 2014-21: virtual currency guidance",
      publisher: "IRS",
      url: "https://www.irs.gov/pub/irs-drop/n-14-21.pdf",
    },
  ],
  seo: {
    keywords: [
      "crypto taxes usa",
      "irs crypto tax",
      "capital gains tax crypto",
      "form 8949 crypto",
      "1099-DA",
      "crypto staking tax",
    ],
    description:
      "US crypto tax guide: IRS property classification, 2025 and 2026 long-term capital gains thresholds, Form 8949 and Schedule D, the 1099-DA rollout, per-wallet cost basis, and staking and mining income rules.",
  },
  relatedTools: ["crypto-tax-calculator", "tax-loss-harvesting-calculator", "profit-calculator", "roi-calculator"],
  partOf: "crypto-tax-by-country",
  body: [
    { type: "cta", title: "Do this with your own numbers", text: "Drop an exchange CSV into the free tax report generator and it applies this country's cost-basis method, holding-period rules and allowance automatically. It runs in your browser — nothing is uploaded.", href: "/crypto-tax-report", label: "Open the tax report generator" },
    { type: "callout", text: "General information, not tax advice. Rules change, and your situation may involve facts this article does not cover. Verify against IRS.gov or a qualified tax professional before filing." },

    { type: "p", text: "The single decision that shapes US crypto taxation was made back in 2014: the IRS classifies digital assets as property, not currency. Everything else follows from that. Property has a cost basis, disposals produce capital gains or losses, and holding period determines the rate. It also means that swapping one token for another is a disposal — the most expensive misunderstanding in US crypto, because no dollars ever hit your bank account and yet the tax is due anyway." },

    { type: "h2", text: "What triggers tax" },
    { type: "ul", items: [
      "Selling crypto for dollars — capital gain or loss.",
      "Trading one crypto for another — a disposal of the first asset at fair market value. Like-kind exchange under §1031 has been limited to real property since 2017, so it does not shelter this.",
      "Spending crypto on goods or services — a disposal, taxed on the appreciation since you acquired it.",
      "Receiving staking rewards, mining income, airdrops or hard-fork tokens — ordinary income at the moment you control them.",
      "Getting paid in crypto — ordinary income at fair market value on receipt.",
    ] },
    { type: "p", text: "What does not trigger tax: buying crypto with dollars and holding it, moving coins between wallets you own, and gifting within the annual exclusion. Every Form 1040 also carries a digital asset question that every filer must answer, whether or not they transacted." },

    { type: "h2", text: "Short-term vs long-term rates" },
    { type: "p", text: "Held one year or less, the gain is short-term and taxed at ordinary income rates — the 10% to 37% brackets. Held more than a year, it is long-term and taxed at 0%, 15% or 20%. That gap is the largest legal lever most people have: on a large gain, crossing the one-year mark can cut the rate by roughly half." },
    { type: "p", text: "The long-term brackets are set against taxable income (after deductions, and including the gain itself). For tax year 2026, per Rev. Proc. 2025-32, a single filer pays 0% up to $49,450 of taxable income, 15% up to $545,500, and 20% above that. Married filing jointly: 0% up to $98,900, 15% up to $613,700, 20% above. For tax year 2025 the equivalent figures were $48,350 / $533,400 single and $96,700 / $600,050 jointly." },
    { type: "p", text: "On top of those, a 3.8% Net Investment Income Tax applies once modified AGI passes $200,000 single or $250,000 married filing jointly — a statutory threshold that is not inflation-indexed, so it catches more people each year. State tax is separate again and varies enormously." },
    { type: "tool", slug: "crypto-tax-calculator" },

    { type: "h2", text: "Per-wallet cost basis — the 2025 change" },
    { type: "p", text: "This is the rule that quietly broke a lot of spreadsheets. Under Rev. Proc. 2024-28 and Treas. Reg. §1.1012-1(j), taxpayers can no longer track basis as one universal pool across all their holdings. From 1 January 2025, basis must be tracked per wallet and per account." },
    { type: "p", text: "Practically: 1 BTC on Coinbase and 1 BTC in a hardware wallet are now separate lots with separate basis, and you cannot sell the Coinbase coin while claiming the basis of the cold-storage one. There was a transitional safe harbor for allocating unused basis as of 1 Jan 2025, but its deadline was the earlier of your first 2025 disposal or the extended due date of your 2025 return — so for essentially all taxpayers that window has now closed. If you have not made the allocation, this is a conversation to have with a professional rather than a form to file quietly." },

    { type: "h2", text: "Form 1099-DA and the end of invisibility" },
    { type: "p", text: "Brokers now report your crypto activity directly to the IRS, phased in over two years." },
    { type: "ul", items: [
      "Gross proceeds: reportable for transactions on or after 1 January 2025, so the first 1099-DA forms landed in early 2026 for tax year 2025.",
      "Cost basis: reportable for transactions on or after 1 January 2026, appearing on forms issued in early 2027.",
      "The important gap: a broker can only report basis for assets it held from acquisition through to disposal. Anything you transferred in from another platform or a private wallet arrives with no basis attached, and proving what you paid remains entirely your responsibility.",
    ] },
    { type: "callout", text: "A 1099-DA showing gross proceeds with no basis looks, to an automated matching system, like a sale that was pure profit. If your records are thin, this is the year that costs you — reconstruct them before the IRS does it for you." },

    { type: "h2", text: "Staking, mining and airdrops" },
    { type: "p", text: "Rev. Rul. 2023-14 settled the staking question: rewards are ordinary income in the year you gain dominion and control over them, valued at fair market value at that moment. It applies whether you stake directly or through an exchange. There is no deferral until you sell — and when you do sell, that is a separate capital gains event with the income amount as your basis." },
    { type: "p", text: "Mining follows the same receipt-based logic, reported on Schedule 1 as other income for a hobbyist, or on Schedule C with self-employment tax if it rises to a trade or business — where equipment and electricity become deductible. Airdrops and hard forks fall under Rev. Rul. 2019-24, taxed on receipt where you have control of the tokens." },
    { type: "p", text: "The trap all three share is timing. You are taxed at the value on the day rewards arrive. If the token then falls 70%, you still owe tax on the higher figure, payable in dollars you may no longer have. Selling a portion of rewards as they arrive is the standard defence." },

    { type: "h2", text: "Wash sales and loss harvesting" },
    { type: "p", text: "IRC §1091's wash-sale rule applies to stock and securities. Crypto held as property currently sits outside it, which means selling at a loss and repurchasing immediately does not have that loss deferred — a flexibility equity investors do not get. Note the wording: this is the absence of a rule rather than an IRS pronouncement granting one, and Congress has repeatedly proposed closing it." },
    { type: "p", text: "Two real exceptions. Spot crypto ETFs are securities, so the wash-sale rule does apply to them. And tokenized securities are covered by wash-sale reporting under the 1099-DA instructions. Losses offset capital gains without limit; excess losses offset up to $3,000 of ordinary income per year, with the remainder carried forward indefinitely." },
    { type: "tool", slug: "profit-calculator" },

    { type: "h2", text: "The forms" },
    { type: "ul", items: [
      "Form 8949 — every disposal, listed line by line with dates, proceeds and basis.",
      "Schedule D — totals from 8949, split into short-term and long-term.",
      "Schedule 1 — staking, mining, airdrop and fork income where it is not a business.",
      "Schedule C — mining or crypto services as a trade or business, plus Schedule SE for self-employment tax.",
      "Form 1040 — the digital asset question, answered by every filer.",
      "FBAR / Form 8938 may apply to foreign-held accounts depending on balances and how the account is structured.",
    ] },

    { type: "h2", text: "Practical habits" },
    { type: "p", text: "Export transaction history from every exchange at least annually — platforms close, get acquired, and lose old data, and reconstructing a 2021 trade history from nothing is genuinely painful. Record fair market value at the moment each reward arrives, not at year end. Track basis per wallet from the start rather than retrofitting it. And keep enough set aside in dollars to pay the bill, because the tax on a January gain is due whether or not the position survives to April." },
  ],
  faq: [
    { q: "Do I owe tax if I only bought crypto and never sold?", a: "No. Buying with dollars and holding is not a taxable event, and neither is moving coins between wallets you control. You still answer the digital asset question on Form 1040." },
    { q: "Is trading BTC for ETH taxable?", a: "Yes. It is a disposal of the BTC at fair market value, and gain or loss is calculated even though no dollars changed hands. Section 1031 like-kind treatment has not applied to crypto since 2017." },
    { q: "What are the long-term crypto capital gains rates for 2026?", a: "0%, 15% or 20% depending on taxable income. For 2026 the single-filer thresholds are $49,450 and $545,500; married filing jointly, $98,900 and $613,700. A 3.8% net investment income tax may apply above $200k/$250k MAGI." },
    { q: "Does the wash-sale rule apply to crypto?", a: "Not to directly held crypto as things currently stand, because §1091 covers stock and securities. It does apply to spot crypto ETFs, which are securities. Legislation to extend it to crypto has been proposed repeatedly, so treat this as a rule that may change." },
    { q: "When are staking rewards taxed?", a: "As ordinary income when you gain dominion and control over them, valued at that moment, under Rev. Rul. 2023-14 — not when you later sell. The subsequent sale is a separate capital gains event." },
    { q: "What is Form 1099-DA?", a: "The broker reporting form for digital assets. Gross proceeds are reported for transactions from 1 January 2025, and cost basis from 1 January 2026. Brokers cannot report basis for assets transferred in from elsewhere." },
    { q: "What happens if I do not report crypto?", a: "Exchange reporting via 1099-DA means the IRS increasingly receives the data independently, and unreported proceeds generate automated notices. Penalties and interest apply, and deliberate evasion is a criminal matter. Amending a return is far cheaper than being found." },
  ],
};

export default guide;
