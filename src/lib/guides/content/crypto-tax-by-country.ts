import type { Guide } from "../types";

/**
 * Hub page for the country tax guides. Every guide it links to carries
 * `partOf: "crypto-tax-by-country"`, so the linking runs both ways.
 * When a new region guide is added, add its row here too.
 */
const guide: Guide = {
  slug: "crypto-tax-by-country",
  affiliate: "tax",
  title: "Crypto Tax by Country: Rates and Rules in 22 Countries Compared",
  description:
    "How crypto is taxed in 22 countries, side by side: the headline rate, whether long-term holding helps, and whether a crypto-to-crypto swap is itself a taxable event.",
  readingMinutes: 9,
  updatedAt: "2026-08-06",
  reviewedAt: "2026-08-03",
  sources: [
    {
      label:
        "International Standards for Automatic Exchange of Information in Tax Matters (CARF)",
      publisher: "OECD",
      url: "https://www.oecd.org/en/publications/international-standards-for-automatic-exchange-of-information-in-tax-matters_896d79d1-en.html",
    },
    {
      label:
        "Cryptoassets Manual",
      publisher: "HMRC",
      url: "https://www.gov.uk/hmrc-internal-manuals/cryptoassets-manual",
    },
    {
      label:
        "Digital assets",
      publisher: "IRS",
      url: "https://www.irs.gov/filing/digital-assets",
    },
  ],
  seo: {
    keywords: [
      "crypto tax by country",
      "cryptocurrency tax rates by country",
      "crypto tax comparison",
      "countries with no crypto tax",
      "crypto tax free countries",
      "crypto capital gains tax rates",
      "best country for crypto tax",
    ],
    description:
      "Crypto tax rates and rules in 22 countries compared in one table: headline rate, holding-period relief and allowances, and whether crypto-to-crypto swaps are taxable. Links to a full guide for each country.",
  },
  relatedTools: ["crypto-tax-calculator", "tax-loss-harvesting-calculator", "profit-calculator"],
  body: [
    { type: "callout", text: "General information, not tax advice. Rules change and personal circumstances differ — treat this table as a map, then read the country guide and check the primary source before you file." },

    { type: "p", text: "There is no international standard for taxing crypto. The same disposal that is completely tax-free in Germany after twelve months can cost you 55% in Japan, and countries do not even agree on what a taxable event is — swap BTC for ETH and you have triggered tax in Ireland but not in France or Poland. This page puts 22 regimes side by side so the differences are visible at a glance, with a full guide behind each one." },

    { type: "h2", text: "The comparison table" },
    {
      type: "table",
      headers: ["Country", "Headline rate on gains", "Holding relief / allowance", "Is a crypto-to-crypto swap taxable?"],
      caption: "Rates current for 2026 unless a year is stated. Click a country for the full guide and the primary sources behind each figure.",
      rows: [
        { href: "/guides/crypto-taxes-australia", cells: ["Australia", "Marginal income rates", "50% CGT discount after 12 months; no separate allowance", "Yes"] },
        { href: "/guides/crypto-taxes-brazil", cells: ["Brazil", "Flat 17.5%", "None — the R$35,000 monthly exemption ended", "Yes"] },
        { href: "/guides/crypto-taxes-canada", cells: ["Canada", "Marginal rates on 50% of the gain", "50% inclusion rate; no allowance", "Yes"] },
        { href: "/guides/crypto-taxes-france", cells: ["France", "30% flat tax (PFU)", "€305 annual disposal threshold", "No — swaps are tax-free"] },
        { href: "/guides/crypto-taxes-germany", cells: ["Germany", "Income rates up to ~45%", "Fully tax-free after 12 months; €1,000 limit", "Yes"] },
        { href: "/guides/crypto-taxes-hong-kong", cells: ["Hong Kong", "0% investing; 7.5–15% profits tax if trading", "No capital gains tax at all", "No CGT regime"] },
        { href: "/guides/crypto-taxes-india", cells: ["India", "Flat 30% + 1% TDS", "None; losses cannot offset or carry forward", "Yes"] },
        { href: "/guides/crypto-taxes-ireland", cells: ["Ireland", "33% CGT", "€1,270 annual exemption, use-it-or-lose-it", "Yes"] },
        { href: "/guides/crypto-taxes-italy", cells: ["Italy", "26% in 2025, 33% from 2026", "€2,000 exemption removed; 0.2% wealth tax", "Yes"] },
        { href: "/guides/crypto-taxes-japan", cells: ["Japan", "Miscellaneous income, up to ~55%", "None; a flat 20% reform is pending", "Yes"] },
        { href: "/guides/crypto-taxes-netherlands", cells: ["Netherlands", "~2% of holdings a year (Box 3)", "€59,357 tax-free allowance (2026)", "No — value on 1 Jan is taxed, not gains"] },
        { href: "/guides/crypto-taxes-new-zealand", cells: ["New Zealand", "Income rates 10.5–39%", "No CGT regime, no allowance, no holding relief", "Yes"] },
        { href: "/guides/crypto-taxes-poland", cells: ["Poland", "Flat 19%", "Costs carry forward indefinitely", "No — swaps are tax-free"] },
        { href: "/guides/crypto-taxes-portugal", cells: ["Portugal", "28% short-term", "Exempt after 365 days", "No — and swaps do not reset the 365-day clock"] },
        { href: "/guides/crypto-taxes-singapore", cells: ["Singapore", "0% for investors", "No CGT; income tax if trading as a business", "No CGT regime"] },
        { href: "/guides/crypto-taxes-south-africa", cells: ["South Africa", "18% max effective, or up to 45% as income", "R50,000 annual exclusion (2027 tax year)", "Yes"] },
        { href: "/guides/crypto-taxes-south-korea", cells: ["South Korea", "0% for now; 22% from January 2027", "₩2.5m threshold once it starts", "Yes, once in force"] },
        { href: "/guides/crypto-taxes-spain", cells: ["Spain", "19–28% savings-income scale", "None", "Yes"] },
        { href: "/guides/crypto-taxes-switzerland", cells: ["Switzerland", "0% for private investors", "Annual wealth tax on holdings instead", "No CGT regime"] },
        { href: "/guides/crypto-taxes-uae", cells: ["UAE", "0% for individuals", "9% corporate tax above AED 375,000", "No CGT regime"] },
        { href: "/guides/crypto-taxes-uk", cells: ["United Kingdom", "18% / 24% CGT", "£3,000 annual exempt amount", "Yes"] },
        { href: "/guides/crypto-taxes-usa", cells: ["United States", "Income rates short-term; 0/15/20% long-term", "Long-term rate after 12 months; no allowance", "Yes"] },
      ],
    },
    { type: "cta", title: "Stop reading, start calculating", text: "Found your row? The free tax report generator takes an exchange CSV and applies that country's matching method, holding-period relief and allowance for you — for 12 of the countries in this table. Everything runs in your browser.", href: "/crypto-tax-report", label: "Open the tax report generator" },
    { type: "tool", slug: "crypto-tax-calculator" },

    { type: "h2", text: "Four patterns worth seeing" },
    { type: "p", text: "Read down the table and the 22 regimes collapse into a handful of designs. Knowing which one you are in tells you more than the rate does." },
    { type: "ul", items: [
      "Holding-period regimes reward patience, sometimes enormously. Germany and Portugal drop to zero after twelve months and 365 days; Australia halves the taxable gain; the US cuts the rate from income rates to 0/15/20%. In these countries the single biggest legal lever is the calendar, not the calculator.",
      "Flat-rate regimes ignore how long you held and how much you earn. Poland at 19%, Ireland at 33%, Brazil at 17.5% and India at 30% treat a one-day flip and a five-year hold identically — which makes planning simple and rewards nothing.",
      "No-capital-gains regimes are not the same as no tax. Singapore, the UAE, Switzerland and Hong Kong genuinely charge investors nothing on disposals, but each has a line past which you become a trader or a business and start paying. New Zealand shows the opposite face of the same coin: with no CGT box to fall into, profit is caught as ordinary income at up to 39%.",
      "Wealth-based regimes tax what you hold, not what you make. The Netherlands taxes a deemed return on your 1 January balance, and Switzerland levies an annual wealth tax. You can pay in a year you sold nothing — and a crash after the valuation date does not reduce the bill.",
    ] },

    { type: "h2", text: "The swap question decides your record-keeping" },
    { type: "p", text: "The last column matters more than most people expect. Where a crypto-to-crypto swap is a taxable disposal — which is the majority position, from the US and UK to Ireland, Spain and Japan — every rotation between tokens needs a valuation in your local currency on the day, and an active year produces hundreds of taxable events." },
    { type: "p", text: "France, Poland and Portugal are the notable exceptions: tax is deferred until you leave crypto for fiat, goods or services. That is a genuine simplification, not just a saving. Portugal goes further still — a swap does not reset the 365-day clock, so you can rebalance without losing your path to the exemption. The Netherlands sidesteps the question entirely by taxing a snapshot of value rather than transactions." },
    { type: "tool", slug: "tax-loss-harvesting-calculator" },

    { type: "h2", text: "What the table cannot tell you" },
    { type: "ul", items: [
      "Staking, mining and airdrops are usually taxed as income when received, at their value on the day, and then again as a gain when sold — even in countries whose capital gains rate is zero. Switzerland is the clearest example: gains are tax-free, staking income is not.",
      "Residency is what determines which row applies to you, and it is rarely a matter of choice or preference. Moving for a tax rate involves exit taxes, minimum-stay requirements and, in some countries, a look-back period.",
      "Losses behave very differently. Most regimes let losses offset gains and carry forward; India lets neither. Poland ring-fences crypto losses inside crypto. New Zealand, unusually, lets a genuine loss offset your ordinary income.",
      "Reporting duties are separate from tax. Spain's Modelo 721, France's form 3916-bis and South Africa's disclosure rules apply even in years you owe nothing, with their own penalties.",
    ] },

    { type: "h2", text: "CARF: the reason 2026 is different" },
    { type: "p", text: "The OECD's Crypto-Asset Reporting Framework changes the enforcement picture everywhere in this table. It obliges crypto service providers to report user transaction data to tax authorities, which then exchange it across borders automatically." },
    { type: "p", text: "The timing varies by country — the EU began on 1 January 2026, New Zealand's providers started collecting on 1 April 2026, and Hong Kong's rules commence on 1 January 2027 with the first exchange in 2028 — but the direction is uniform. Inland Revenue in New Zealand put the position bluntly in April 2026, saying it had already identified 355,000 crypto users domestically and that 'people are not invisible on blockchain.' The practical assumption for any 2026 activity onwards should be that your tax authority can see it." },

    { type: "h2", text: "Losses are the other half of the bill" },
    { type: "p", text: "Every rate in the table above applies to a net figure, and losses are what make it net. The rules for realising them differ as much as the rates do — the US wash-sale rule does not reach crypto at all, Canada's superficial-loss window runs 30 days on both sides of the sale, Spain's runs two months, and Germany and Portugal make losses on long-held positions non-deductible because the gain would have been exempt. The deadline is your tax year end, which is the one date on this page that cannot be extended." },
    { type: "cta", title: "Which of your losses are worth realising", text: "Tax loss harvesting explained country by country: how much a realised loss actually saves, why harvesting past your gains saves nothing this year, and whether you are allowed to buy the position straight back.", href: "/guides/crypto-tax-loss-harvesting", label: "Read the harvesting guide" },

    { type: "h2", text: "The dates matter as much as the rates" },
    { type: "p", text: "Two different deadlines apply to every row in this table, and only one of them gets attention. The filing deadline is when the paperwork is due. The tax year end is when your options close — and that is the expensive one. An unused UK annual exempt amount disappears on 5 April rather than carrying forward, and a loss realised on 1 January instead of 31 December moves its relief a full year away. Ireland goes further and wants the tax on January-to-November disposals paid by 15 December, nearly a year before the return itself is due." },
    { type: "cta", title: "Every deadline on one page", text: "The crypto calendar lists filing deadlines and tax year ends for the countries in this table, alongside the regulatory dates already written into law and halvings estimated from live block heights. Each entry links back to the country guide it came from.", href: "/calendar", label: "Open the crypto calendar" },

    { type: "h2", text: "The bottom line" },
    { type: "p", text: "The headline rate is the least useful number on this page. What actually determines your bill is the structure: whether holding longer changes anything, whether swaps are taxed as you go, whether the charge is on gains or on holdings, and where the line sits between investing and trading. Find your row, then read the full guide — the details in it are where the money is." },
  ],
  faq: [
    { q: "Which countries have no crypto tax?", a: "For individual investors, the UAE, Singapore, Hong Kong and Switzerland charge nothing on disposals, and South Korea has not yet started taxing gains. But each has conditions: trading as a business is taxable in all of them, Switzerland levies a wealth tax on holdings instead, and staking income is generally taxable everywhere." },
    { q: "Which country has the highest crypto tax?", a: "Japan, where gains are miscellaneous income taxed at up to roughly 55%. India is harsher in a different way — a flat 30% plus 1% TDS, with losses that can neither offset other income nor be carried forward." },
    { q: "Is swapping one crypto for another taxable?", a: "In most countries, yes — it is a disposal at market value even though no fiat moves. France and Poland are the main exceptions, deferring tax until you convert to fiat, goods or services. The Netherlands does not tax transactions at all, only holdings." },
    { q: "Does holding crypto longer reduce tax?", a: "In some regimes dramatically. Germany and Portugal exempt gains entirely after twelve months and 365 days respectively, Australia halves the taxable gain after twelve months, and the US drops from income rates to 0/15/20%. Flat-rate countries like Poland, Ireland and India give no holding-period relief at all." },
    { q: "Do I pay crypto tax where I live or where the exchange is?", a: "Where you are tax resident, in almost all cases. The exchange's location does not change your liability, and under CARF it increasingly does not hide the activity either — data on non-resident users is routed to their home tax authority." },
    { q: "How often do these rules change?", a: "Frequently enough to check before filing. Italy's rate rises from 26% to 33% in 2026, Brazil replaced its tiered scale with a flat 17.5% in January 2026, South Africa raised its annual exclusion for the first time since 2017, and South Korea has delayed its gains tax three times. Each country guide states when it was last verified." },
  ],
};

export default guide;
