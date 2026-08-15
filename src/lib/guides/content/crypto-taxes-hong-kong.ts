import type { Guide } from "../types";

const guide: Guide = {
  slug: "crypto-taxes-hong-kong",
  title: "Crypto Tax in Hong Kong: 0% on Investment Gains — Until You Look Like a Trader",
  description:
    "Hong Kong has no capital gains tax, so a genuine long-term crypto investor pays nothing. But profits from a crypto trade are chargeable to profits tax, and the badges of trade decide which you are.",
  readingMinutes: 8,
  updatedAt: "2026-08-02",
  reviewedAt: "2026-08-02",
  sources: [
    {
      label:
        "DIPN 39 — taxation of e-commerce and digital assets",
      publisher: "Inland Revenue Department",
      url: "https://www.ird.gov.hk/eng/pdf/dipn39.pdf",
    },
  ],
  seo: {
    keywords: [
      "crypto tax hong kong",
      "hong kong cryptocurrency tax",
      "hong kong no capital gains tax crypto",
      "dipn 39 digital assets",
      "hong kong profits tax crypto",
      "bitcoin tax hong kong",
    ],
    description:
      "Hong Kong crypto tax guide: why there is no capital gains tax on crypto, the badges of trade that turn gains into profits tax, the two-tiered 7.5%/15% rates, mining and salaries tax, and CARF from 2027.",
  },
  relatedTools: ["crypto-tax-calculator", "profit-calculator", "trading-fee-calculator"],
  partOf: "crypto-tax-by-country",
  body: [
    { type: "callout", text: "General information, not tax advice. Reflects the Inland Revenue Ordinance and DIPN 39 (Revised, March 2020), plus rates and legislation current for 2026. Check ird.gov.hk or a Hong Kong tax adviser before you file." },

    { type: "p", text: "Hong Kong's appeal for crypto holders is genuine and it is simple: there is no capital gains tax. The Inland Revenue Department's guidance on digital assets states directly that 'profits arising from the sale of capital assets are excluded from the charge of profits tax,' and that if digital assets 'are bought for long-term investment purposes, any profits from disposal would not be chargeable to profits tax.'" },
    { type: "p", text: "That is the whole benefit — and also the whole risk. Hong Kong does not tax capital gains, so everything depends on whether your gain is a capital gain at all. The IRD decides that with a fact-and-degree test, not a holding period, and a taxpayer who has assumed the answer is often the one who gets it wrong." },

    { type: "h2", text: "How the IRD classifies digital tokens" },
    { type: "p", text: "DIPN 39 sorts digital tokens into three categories, and says that 'profits tax treatment of digital tokens would depend on their nature and use':" },
    { type: "ul", items: [
      "Payment tokens — used as a means of payment, encompassing cryptocurrencies such as Bitcoin. They give the holder no rights or access to goods or services. Not legal tender in Hong Kong, but 'regarded as virtual commodities.'",
      "Security tokens — providing particular interests and rights in a business: ownership, a debt due, or entitlement to a share of profits.",
      "Utility tokens — giving access to particular goods or services, typically on a blockchain platform, which the issuer commits to accepting the token as payment for.",
    ] },
    { type: "p", text: "The IRD also warns that labelling does not control the outcome: for an ICO, 'the substantive nature of the token itself will determine its classification and not the stated intention of the issuer.'" },
    { type: "tool", slug: "crypto-tax-calculator" },

    { type: "h2", text: "The badges of trade — the test that actually matters" },
    { type: "p", text: "Whether digital assets are capital assets or trading stock 'has to be considered on the basis of the facts and circumstances.' The IRD applies the long-established badges of trade, and says 'the intention at the time of acquisition of the digital assets is always relevant.'" },
    { type: "p", text: "On whether buying, selling, exchanging or mining crypto amounts to carrying on a trade or business, DIPN 39 says it is 'a matter of fact and degree to be determined upon a consideration of all the circumstances,' listing relevant factors:" },
    { type: "ul", items: [
      "The degree and frequency of the activity.",
      "The level of system or organisation — whether it is undertaken in a business-like manner.",
      "Whether the activity is done for the purpose of making a profit.",
    ] },
    { type: "callout", text: "There is no safe-harbour holding period in Hong Kong. Buying and holding for years with few transactions is strong evidence of investment; daily trading through a systematic setup is strong evidence of a trade — and the second is taxable regardless of how you describe it." },

    { type: "h2", text: "If it is a trade: profits tax, and only on Hong Kong-sourced profit" },
    { type: "p", text: "Hong Kong-sourced profits from cryptocurrency business activities — the IRD lists trading, exchange and mining — are chargeable to profits tax. Two-tiered rates apply:" },
    { type: "ul", items: [
      "Unincorporated businesses (including sole traders): 7.5% on the first HK$2,000,000 of assessable profits, 15% above that.",
      "Corporations: 8.25% on the first HK$2,000,000 of assessable profits, 16.5% above that.",
    ] },
    { type: "p", text: "Even then, Hong Kong is territorial. Only profits arising in or derived from Hong Kong are chargeable. The IRD applies the broad guiding principle: identify the nature of the profits, the operations that produced them, and 'the place where those profit-generating operations were carried out.' For a trader physically operating in Hong Kong, that will usually point to Hong Kong regardless of where the exchange is domiciled." },
    { type: "tool", slug: "trading-fee-calculator" },

    { type: "h2", text: "Airdrops, forks, mining and business payments" },
    { type: "p", text: "DIPN 39 addresses events that create new coins: 'if cryptocurrencies are received in the course of a cryptocurrency business, the new cryptocurrencies are to be regarded as receipts of the business and would be assessed accordingly.' The qualifier matters — an airdrop landing in a genuine investor's wallet outside any business is a different case from one received in the course of trading." },
    { type: "p", text: "Where a business transacts in crypto — accepting it from customers or using it to buy goods — 'the market value of the cryptocurrency accrued at the date of transaction should reflect the amount of sales and purchases.' Persons engaging in cryptocurrency businesses must keep proper business records under section 51C of the Inland Revenue Ordinance." },
    { type: "tool", slug: "profit-calculator" },

    { type: "h2", text: "Paid in crypto? That is salaries tax" },
    { type: "p", text: "The exemption for investment gains does not extend to income. DIPN 39 states that where employees receive remuneration in cryptocurrency, 'the same salaries tax treatment would apply to such income from employment even though it is paid in cryptocurrency,' and 'the amount to be reported as the employee's employment income should be the market value of the cryptocurrency at the time of accrual.'" },
    { type: "p", text: "Salaries tax is charged at progressive rates of 2% to 17% on bands of net chargeable income, or at the standard rate on net income, whichever produces less tax. The standard rate is two-tiered: 15% on the first HK$5 million of net income and 16% on the remainder. Any later movement in the coin's value after accrual is a separate question, decided by the capital-versus-trade test above." },

    { type: "h2", text: "CARF: the transparency layer arrives in 2027" },
    { type: "p", text: "No capital gains tax does not mean no reporting. Hong Kong has committed to the OECD's Crypto-Asset Reporting Framework, and the Inland Revenue (Amendment) (Crypto-Asset Reporting Framework and Amended Common Reporting Standard) Bill 2026 was gazetted on 22 May 2026 and received its first reading in the Legislative Council on 3 June 2026." },
    { type: "ul", items: [
      "CARF provisions are set to commence on 1 January 2027, with the amended Common Reporting Standard following on 1 January 2028.",
      "Crypto-asset service providers with a reporting nexus to Hong Kong must register with the IRD and meet due diligence, return filing and record keeping requirements.",
      "The first automatic cross-border exchange of crypto information is planned for 2028.",
    ] },
    { type: "p", text: "The practical implication is for people who are Hong Kong resident but taxable elsewhere, and for people taxable in Hong Kong who use offshore platforms. Hong Kong's own zero rate on investment gains is unaffected — but your other tax authority will start receiving the data." },

    { type: "h2", text: "Records, and what to keep even at 0%" },
    { type: "ul", items: [
      "The year of assessment runs 1 April to 31 March. Individuals file a Tax Return – Individuals (BIR60); businesses file a profits tax return.",
      "There is no capital gains return to file for a pure investor — but keep the evidence anyway.",
      "Evidence of investment intent is your defence if the classification is questioned: acquisition dates, holding periods, transaction frequency, funding source, and any written investment rationale.",
      "Business records must be kept under section 51C where a crypto business exists.",
      "There is no VAT, GST or sales tax in Hong Kong, and no withholding tax on crypto.",
    ] },

    { type: "h2", text: "The bottom line" },
    { type: "p", text: "For a genuine long-term investor, Hong Kong charges nothing on crypto disposals — no capital gains tax, no holding period to satisfy, no annual allowance to manage. For anyone trading frequently and systematically for profit, that same absence of a capital regime means the profits fall into profits tax at 7.5% or 15% for an unincorporated business, subject to the territorial source rule. Nothing in the rules decides which you are; the pattern of your actual behaviour does, and the record you can produce for it." },
  ],
  faq: [
    { q: "Is crypto tax-free in Hong Kong?", a: "Investment gains are. Hong Kong has no capital gains tax, and the IRD confirms that digital assets bought for long-term investment produce disposal profits that are not chargeable to profits tax. Trading profits and crypto received as income are taxable." },
    { q: "When does crypto become taxable in Hong Kong?", a: "When your activity amounts to carrying on a trade or business. The IRD weighs the degree and frequency of activity, how systematic and business-like it is, and whether it is done to make a profit — a matter of fact and degree, not a holding period." },
    { q: "What is the crypto tax rate in Hong Kong if I am trading?", a: "Profits tax applies to Hong Kong-sourced profits at two-tiered rates: 7.5% on the first HK$2 million for unincorporated businesses and 15% above, or 8.25% and 16.5% for corporations." },
    { q: "How is crypto salary taxed in Hong Kong?", a: "As employment income under salaries tax, at the market value of the cryptocurrency at the time of accrual. Rates are 2%–17% progressive, or the two-tiered standard rate of 15% on the first HK$5 million of net income and 16% above, whichever gives less tax." },
    { q: "Are airdrops and forks taxable in Hong Kong?", a: "DIPN 39 says new cryptocurrencies received in the course of a cryptocurrency business are receipts of that business and assessed accordingly. Received outside any business, they sit with the general capital-versus-trade analysis." },
    { q: "Will Hong Kong report my crypto to other countries?", a: "Yes, from 2027. The CARF bill gazetted in May 2026 has crypto provisions commencing 1 January 2027, with the first automatic cross-border exchange planned for 2028. Hong Kong's own zero rate on investment gains is unchanged." },
  ],
};

export default guide;
