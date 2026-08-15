import type { Guide } from "../types";

const guide: Guide = {
  slug: "crypto-taxes-uae",
  title: "Crypto Tax in the UAE (Dubai): 0% for Individuals — and the Fine Print",
  description:
    "The UAE charges individuals no personal income tax and no capital gains tax on crypto. But corporate tax, VAT on mining and residency rules matter. Here is where the zero-tax story holds and where it doesn't.",
  readingMinutes: 8,
  updatedAt: "2026-07-27",
  reviewedAt: "2026-07-27",
  sources: [
    {
      label:
        "Corporate Tax",
      publisher: "Federal Tax Authority",
      url: "https://tax.gov.ae/en/taxes/corporate.tax/corporate.tax.topics.aspx",
    },
  ],
  seo: {
    keywords: [
      "crypto tax uae",
      "dubai crypto tax",
      "uae 0% crypto tax",
      "uae corporate tax crypto",
      "crypto tax free dubai",
      "uae crypto vat",
    ],
    description:
      "UAE (Dubai) crypto tax guide: 0% personal income and capital gains tax for individuals, the 9% corporate tax on crypto businesses, VAT treatment and the 2025 mining clarification, and residency caveats.",
  },
  relatedTools: ["crypto-tax-calculator", "profit-calculator", "average-entry-calculator"],
  partOf: "crypto-tax-by-country",
  body: [
    { type: "callout", text: "General information, not tax advice. UAE rules and Federal Tax Authority guidance evolve, and your tax position depends heavily on residency and how activity is structured. Check tax.gov.ae or a UAE tax adviser before relying on this." },

    { type: "p", text: "The United Arab Emirates — and Dubai in particular — is one of the genuinely low-tax jurisdictions for crypto, and unlike most 'crypto-friendly' countries the headline is real: the UAE levies no personal income tax at all. For an individual holding and trading crypto, that means no capital gains tax and no income tax on the profits. But 'no personal tax' is not the same as 'no tax anywhere', and the corporate tax and VAT rules add nuance worth understanding." },

    { type: "h2", text: "Individuals: 0% on personal crypto activity" },
    { type: "p", text: "Because there is no personal income tax, an individual's crypto gains, personal trading, staking rewards and casual NFT sales are not taxed. There is no holding period to satisfy, no allowance to track, and no personal crypto tax return to file. This is the core of the UAE's appeal to crypto holders and why so many relocate their tax residency there." },
    { type: "tool", slug: "profit-calculator" },

    { type: "h2", text: "Businesses: the 9% corporate tax" },
    { type: "p", text: "The picture changes at the business level. Since financial years starting on or after 1 June 2023, the UAE applies a federal corporate tax of 9% on business profits above AED 375,000. Profits below that threshold are taxed at 0%. If your crypto activity is carried on as a business — a trading firm, an exchange, a fund, or professional operations with real substance — the profits can fall within corporate tax." },
    { type: "callout", text: "The line between 'personal investing' and 'carrying on a business' is the key question in the UAE, just as the investor-versus-trader line is elsewhere. Individuals investing their own wealth are outside corporate tax; structured commercial operations may not be. Free-zone regimes add further rules for 'qualifying income'." },
    { type: "tool", slug: "crypto-tax-calculator" },

    { type: "h2", text: "VAT and the 2025 mining clarification" },
    { type: "p", text: "The UAE's standard VAT rate is 5%. Transferring and converting virtual assets has been treated as VAT-exempt (with the exemption clarified to apply retroactively from January 2018), so ordinary crypto transactions do not attract VAT. The notable exception came in early 2025: the Federal Tax Authority clarified that crypto mining does not qualify for the VAT exemption. Mining is treated as a taxable activity — subject to 5% VAT and, where carried on as a business, to the 9% corporate tax on profits above the threshold." },
    { type: "tool", slug: "average-entry-calculator" },

    { type: "h2", text: "Regulation is not the same as tax" },
    { type: "p", text: "The UAE regulates crypto heavily even though it barely taxes individuals. Dubai's Virtual Assets Regulatory Authority (VARA), plus the ADGM and DIFC financial free zones, license and supervise crypto businesses. Meeting those regulatory requirements is a separate obligation from tax, and firms operating in the UAE need to satisfy both. For individuals, regulation mostly shows up as exchange KYC rather than a tax filing." },

    { type: "h2", text: "The residency caveat that catches people out" },
    { type: "p", text: "Zero UAE tax only helps if the UAE is genuinely where you are taxed. If you remain tax resident in another country — because you spend too much time there, keep a home or centre of life there, or your country taxes by citizenship — that country can still tax your worldwide crypto gains regardless of the UAE's 0%. Genuinely relocating tax residency is a demanding, fact-specific exercise. And global transparency frameworks like the OECD's CARF, which the UAE is aligning with, mean information increasingly flows between jurisdictions." },

    { type: "h2", text: "Reporting and deadlines" },
    { type: "ul", items: [
      "Individuals with only personal crypto activity generally have no UAE tax return to file — there is no personal income tax.",
      "Businesses within corporate tax must register with the Federal Tax Authority and file corporate tax returns for their financial year.",
      "Keep records regardless: clean transaction records support your position on residency and on the personal-versus-business line if ever questioned.",
    ] },

    { type: "h2", text: "The bottom line" },
    { type: "p", text: "For an individual who is genuinely UAE tax resident, crypto gains are simply not taxed — one of the cleanest positions available anywhere. The caveats are real, though: run crypto as a business and corporate tax and VAT can apply, mine and you lose the VAT exemption, and keep ties elsewhere and another country may tax you anyway. The zero is genuine, but it rewards getting the structure and residency right." },
    {
      type: "cta",
      title: "Thinking of actually moving?",
      text: "The UAE rate is rarely what decides the bill — the country you leave is. What ceasing residence really takes, and when the 9% corporate tax catches a trader.",
      href: "/guides/moving-to-dubai-for-crypto",
      label: "Read the relocation guide",
    },
  ],
  faq: [
    { q: "Do individuals pay crypto tax in the UAE?", a: "No. The UAE has no personal income tax, so individuals pay no capital gains or income tax on personal crypto gains, trading, staking or casual NFT sales." },
    { q: "Is there corporate tax on crypto in the UAE?", a: "Yes, for businesses. A 9% federal corporate tax applies to business profits above AED 375,000 for financial years starting on or after 1 June 2023. Crypto run as a business can fall within it; personal investing does not." },
    { q: "Is crypto subject to VAT in the UAE?", a: "Transferring and converting virtual assets is VAT-exempt (clarified as retroactive to January 2018). However, from a 2025 FTA clarification, crypto mining does not qualify for the exemption and is subject to 5% VAT." },
    { q: "Is Dubai really tax-free for crypto?", a: "For genuine individual residents, effectively yes — there's no personal income or capital gains tax. But businesses face 9% corporate tax, mining attracts VAT, and if you're tax resident elsewhere that country may still tax your gains." },
    { q: "Does moving to the UAE make my crypto gains tax-free?", a: "Only if you genuinely become UAE tax resident and cease being taxable elsewhere. If another country still considers you resident (or taxes by citizenship), it can tax your worldwide crypto gains despite the UAE's 0%." },
  ],
};

export default guide;
