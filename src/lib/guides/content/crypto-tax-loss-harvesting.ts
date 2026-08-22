import type { Guide } from "../types";

const guide: Guide = {
  slug: "crypto-tax-loss-harvesting",
  affiliate: "tax",
  title: "Crypto Tax Loss Harvesting: What It Saves, and What Your Country Allows",
  description:
    "How selling a losing position cuts your tax bill, why the saving is smaller than the loss, and the repurchase rule for each country — from the US wash-sale gap to Canada's 61-day window.",
  readingMinutes: 12,
  updatedAt: "2026-08-11",
  reviewedAt: "2026-08-11",
  seo: {
    title: "Crypto Tax Loss Harvesting — Rules by Country, and What It Actually Saves",
    keywords: [
      "crypto tax loss harvesting",
      "tax loss harvesting crypto",
      "crypto wash sale rule",
      "harvest crypto losses",
      "crypto unrealized losses tax",
      "sell crypto at a loss for taxes",
      "superficial loss rule crypto",
      "bed and breakfasting crypto",
      "which crypto losses should i sell",
    ],
    description:
      "Crypto tax loss harvesting explained: how much tax realising a loss really saves, why harvesting past your gains saves nothing, and the repurchase rules in the US, UK, Canada, Germany, Spain, Australia, Portugal and more.",
  },
  relatedTools: [
    "tax-loss-harvesting-calculator",
    "crypto-tax-calculator",
    "loss-recovery-calculator",
    "average-entry-calculator",
  ],
  partOf: "crypto-tax-by-country",
  sources: [
    {
      label: "Digital assets — treated as property, not securities",
      publisher: "IRS",
      url: "https://www.irs.gov/filing/digital-assets",
    },
    {
      label: "CRYPTO22250 — same-day and 30-day matching rules",
      publisher: "HMRC",
      url: "https://www.gov.uk/hmrc-internal-manuals/cryptoassets-manual/crypto22250",
    },
    {
      label: "Capital losses and deductions — the superficial loss rule",
      publisher: "Canada Revenue Agency",
      url: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/personal-income/line-12700-capital-gains/capital-losses-deductions.html",
    },
    {
      label: "Wash sales: the ATO is cleaning up dirty laundry",
      publisher: "Australian Taxation Office",
      url: "https://www.ato.gov.au/media-centre/wash-sales-the-ato-is-cleaning-up-dirty-laundry",
    },
    {
      label: "Part 02-01-03 — Taxation of Crypto-Asset Transactions (reviewed January 2026)",
      publisher: "Revenue",
      url: "https://www.revenue.ie/en/tax-professionals/tdm/income-tax-capital-gains-tax-corporation-tax/part-02/02-01-03.pdf",
    },
    {
      label: "§ 23 EStG — private Veräußerungsgeschäfte",
      publisher: "Gesetze im Internet",
      url: "https://www.gesetze-im-internet.de/estg/__23.html",
    },
  ],
  body: [
    {
      type: "p",
      text: "Tax loss harvesting is the one piece of tax planning that has a deadline you cannot argue your way past. If a position is underwater and you sell it before your tax year closes, the loss is realised and can be set against gains you have already banked — which lowers the bill. If you sell it a week later, in the new year, the same trade does nothing for the year that just ended. No amount of paperwork in April fixes what you owned in December.",
    },
    {
      type: "p",
      text: "It is also the piece of tax planning most often explained badly. Almost every article you will find says the same thing: add up what you are down, multiply by your tax rate, that is your saving. That number is nearly always wrong, and it is wrong in the direction that makes people sell things they did not need to sell.",
    },

    { type: "h2", text: "Harvesting does not recover the loss. It recovers your tax rate." },
    {
      type: "p",
      text: "Start with the part people get emotionally wrong. Selling a coin that is down 60% does not undo the 60%. You still lost the money. What you get back is the tax you would otherwise have paid on an equivalent amount of gain — so at a 24% rate, a $6,000 loss puts about $1,440 back in your pocket. You recover 24 cents on each dollar lost, not the dollar.",
    },
    {
      type: "callout",
      text: "Harvesting never turns a loss into a profit. It converts a paper loss into a cash tax saving worth your marginal rate — and it costs you the position to do it.",
    },
    {
      type: "p",
      text: "That is still worth doing. The loss was real either way, and the tax saving is cash now rather than a number on a screen. But it reframes the decision: you are not repairing a bad trade, you are choosing to give up a holding today in exchange for roughly a quarter of its decline in tax relief.",
    },

    { type: "h2", text: "The saving is capped by the gains you actually have" },
    {
      type: "p",
      text: "This is the mistake that costs people real money, and it is entirely avoidable. A loss can only offset gains that exist. If you realised $5,000 of gains this year and you are sitting on $30,000 of paper losses, harvesting the whole $30,000 does not save you your rate on $30,000. It saves you your rate on $5,000. The other $25,000 goes into a carry-forward, to be used against gains you have not made yet.",
    },
    {
      type: "p",
      text: "So the honest question is not \"how much am I down?\" but \"how much loss do I need to realise to zero out this year's bill?\" — and past that point, every extra sale is a position given up for a deduction you cannot use yet.",
    },
    {
      type: "table",
      caption: "The same $30,000 of paper losses, against different amounts of realised gain (24% rate)",
      headers: ["Gains realised this year", "Loss worth harvesting now", "Tax saved this year", "Carried forward"],
      rows: [
        { cells: ["$0", "$0", "$0", "$30,000"] },
        { cells: ["$5,000", "$5,000", "$1,200", "$25,000"] },
        { cells: ["$20,000", "$20,000", "$4,800", "$10,000"] },
        { cells: ["$40,000", "$30,000", "$7,200", "$0"] },
      ],
    },
    {
      type: "p",
      text: "Carrying a loss forward is not nothing — in most regimes it lasts indefinitely and will eventually be used. But it is not this year's money, and a tool that presents it as this year's money is flattering you.",
    },
    {
      type: "p",
      text: "There is a second-order effect worth knowing where your country has an annual allowance. The UK's £3,000 annual exempt amount, Ireland's €1,270 exemption and South Africa's R50,000 exclusion all get used before any tax is due — so losses spent bringing your gains down into the allowance are wasted. They would have been covered for free. Germany's €1,000 is stranger still: it is a Freigrenze, all-or-nothing, so if your gains sit just above it a small harvest that drops you under the line is worth more than a large one.",
    },

    { type: "h2", text: "A coin you are up on can still hold a loss worth taking" },
    {
      type: "p",
      text: "Suppose you bought bitcoin twice: a large parcel years ago at a low price, and a smaller one near a recent top. The position as a whole is comfortably in profit. Most portfolio screens will therefore show it as a winner and you will move on — but the second purchase is deeply underwater, and in a country that matches disposals lot by lot you can sell into that later parcel and realise its loss without touching the cheap one.",
    },
    {
      type: "p",
      text: "Whether you can do that depends entirely on your country's matching method, and this is one of the few places where the method genuinely changes what actions are available to you rather than just changing the arithmetic.",
    },
    {
      type: "table",
      caption: "Can you pick which parcel to sell?",
      headers: ["Method", "Countries", "Lot-level harvesting?"],
      rows: [
        { cells: ["FIFO — oldest parcel goes first", "US, Germany, Australia, Ireland, Portugal, Spain, more", "Yes — parcels keep their own cost and date"] },
        { cells: ["ACB — one moving average cost", "Canada", "No — the whole holding has a single averaged cost"] },
        { cells: ["Section 104 pool", "United Kingdom", "No — each token type is one pooled asset"] },
        { cells: ["Annual pooling of costs", "Poland", "Not applicable — see below"] },
      ],
    },
    {
      type: "p",
      text: "Under Canadian ACB or the UK's Section 104 pool there are no individual parcels to choose between: your holding has one averaged cost, and if that average is above the market price you have a loss, and if it is not, you do not. The expensive purchase is already blended in. Any tool that offers you a lot-by-lot menu in those countries is showing you a choice you do not have.",
    },
    { type: "tool", slug: "average-entry-calculator" },

    { type: "h2", text: "The repurchase rule is the part that decides whether any of this works" },
    {
      type: "p",
      text: "Harvesting only makes sense if you can keep your market exposure — you sell, bank the loss, and buy back. Whether you are allowed to differs between countries far more than the headline tax rates do, and getting it wrong does not cost you the saving in advance. It costs you the saving after you have already sold.",
    },
    {
      type: "table",
      caption: "Repurchase restrictions, verified against the tax authorities in August 2026",
      headers: ["Country", "Restriction", "What happens to the loss"],
      rows: [
        { cells: ["United States", "None for crypto", "Claimable even on a same-day rebuy"] },
        { cells: ["United Kingdom", "Same day, then the next 30 days", "The sale is matched to the repurchase instead of the pool"] },
        { cells: ["Canada", "30 days before and 30 days after", "Denied, then added to the cost of what you bought back"] },
        { cells: ["Spain", "Two months either side", "Deferred into the basis of the repurchase"] },
        { cells: ["Australia", "No fixed window — judged on intent", "Cancelled if the purpose was to manufacture a loss"] },
        { cells: ["Germany", "None", "But the one-year rule below overrides everything"] },
        { cells: ["Ireland", "Unsettled — see below", "Unclear; take advice"] },
      ],
    },
    {
      type: "p",
      text: "The United States is the outlier everyone has heard about. The wash-sale rule in IRC §1091 applies to \"stock or securities\", and the IRS treats digital assets as property, so as things stand you can sell a coin at a loss, buy it back the same afternoon, and still claim the loss. Two caveats belong next to that: Congress has repeatedly proposed extending the rule to digital assets, so this is a rule that could change with a single bill — and a crypto ETF or a crypto-exposed stock genuinely is a security, so buying one of those back inside 30 days is caught in the ordinary way.",
    },
    {
      type: "p",
      text: "Canada's rule is the one most often described incorrectly. It is routinely called \"the 30-day rule\", which describes half of it: the superficial-loss window opens 30 calendar days before the sale and closes 30 days after, so a purchase you made a month before selling can spoil the loss all by itself. It also catches affiliated persons — most commonly a spouse or common-law partner — and you must still hold the substituted property at the end of the window. The loss is not destroyed: it is added to the adjusted cost base of what was bought back, so it resurfaces when you eventually sell without repurchasing.",
    },
    {
      type: "p",
      text: "Spain's window is the longest on the list at two months either side, and it applies to crypto because the Dirección General de Tributos has ruled that units of the same cryptocurrency are \"valores homogéneos\", which brings them inside article 33.5 of the IRPF law. Australia takes a completely different approach: there is no day count to work around at all. The ATO treats a sale-and-repurchase entered into to manufacture a loss as a wash sale and cancels it under the general anti-avoidance provisions, and it has said publicly that it finds these through data matching with crypto exchanges. Waiting 31 days is not the safe harbour there that it is elsewhere — and equally, a genuine change of position is not caught even if it happens quickly.",
    },
    {
      type: "callout",
      text: "Ireland is genuinely unsettled, whatever other tax tools tell you. Section 581 TCA 1997 sets aside the normal matching order where shares or securities of the same class are sold and reacquired within four weeks — but it is drafted for shares and securities, and Revenue's own crypto-asset manual, Part 02-01-03, last reviewed in January 2026, neither mentions section 581 nor extends it to crypto-assets. Several commercial tax packages apply a four-week rule to Irish crypto anyway. Take advice before relying on a quick repurchase.",
    },

    { type: "h2", text: "In Germany and Portugal, losses expire" },
    {
      type: "p",
      text: "Both countries exempt gains once you have held long enough: more than a year in Germany under §23 EStG, 365 days or more in Portugal. Everyone knows that half. The half that matters for harvesting is the mirror image — a position outside the tax charge cannot produce a deductible loss either.",
    },
    {
      type: "p",
      text: "So a coin you are down 40% on, bought fourteen months ago, is worth precisely nothing to you as a harvest in Germany. The rule that would have made a profit tax-free also makes the loss unusable. And that gives each losing parcel its own private deadline, running in the opposite direction to every other piece of tax advice a holder has ever been given: if you are going to harvest it, you have to do it before it turns one year old.",
    },
    {
      type: "p",
      text: "The two countries are one day apart, which is the kind of detail that only matters until it costs you. Portugal exempts at 365 days or more; Germany requires more than 365. The same parcel, held for exactly a year, is already outside the charge in Lisbon and still claimable in Berlin.",
    },

    { type: "h2", text: "Two countries where the answer is simply no" },
    {
      type: "p",
      text: "India does not allow losses on virtual digital assets to be set off against anything — not against other income, not even against gains on other crypto — and they cannot be carried forward. Under section 115BBH each gain is taxed at a flat 30% on its own. Selling a losing position in India therefore reduces your tax bill by exactly zero, and triggers 1% TDS on the transfer for good measure. This is the one place where the honest advice is: do not do this for tax reasons.",
    },
    {
      type: "p",
      text: "Poland reaches the same destination by a completely different route. It does not match lots at all: crypto is taxed on PIT-38 as annual revenue less annual costs, and acquisition costs are recognised in the year you incur them whether or not you sold anything, carrying forward indefinitely if unused. That removes the deadline that makes harvesting urgent everywhere else — selling a losing coin in December rather than January does not change your deductible costs, because the cost was already deducted the year you bought it.",
    },

    { type: "h2", text: "The deadline is your tax year end, not your filing date" },
    {
      type: "p",
      text: "The disposal has to happen inside the tax year. The return is filed months later, and by then nothing can be changed. The dates are not the same everywhere, and the ones that catch people out are the ones that are not 31 December.",
    },
    {
      type: "ul",
      items: [
        "31 December — the US, Germany, Canada, France, Spain, Portugal, Poland, Ireland, Italy and most of Europe",
        "5 April — the United Kingdom",
        "30 June — Australia",
        "End of February — South Africa",
        "31 March — New Zealand, and India's assessment year",
        "It is the disposal date that counts, not settlement or withdrawal — exchanges settle at their own pace, so leaving it to the last day is a genuine risk",
      ],
    },
    {
      type: "cta",
      title: "See which of your own losses are worth harvesting",
      text: "Load the transaction history you already export for tax and get the parcels ranked by the tax each one actually saves, the repurchase rule for your country, and the date any loss expires. It runs entirely in your browser — the file is never uploaded.",
      href: "/tax-loss-harvesting",
      label: "Open the harvesting tool",
    },

    { type: "h2", text: "What harvesting costs you, beyond the trade" },
    {
      type: "p",
      text: "Three costs rarely appear in the pitch. The first is obvious once stated: you pay trading fees and cross the spread twice, once out and once back in, and on an illiquid token that spread can be a meaningful fraction of the tax you are trying to save.",
    },
    {
      type: "p",
      text: "The second is market risk in the gap. In a country with a repurchase window you are out of the position for 30 days or two months by law. Crypto can move a very long way in two months, and a rule designed to stop tax games can quite easily cost you more than the tax it saves. Buying a different asset in the meantime is the usual workaround, but \"different\" has to mean genuinely different — and as the correlation figures show, most large crypto assets move together closely enough that you are barely changing your exposure anyway.",
    },
    {
      type: "p",
      text: "The third is deferred rather than avoided. Harvesting lowers your cost basis: if you rebuy at the depressed price, that becomes your new basis, and the gain you eventually pay tax on is correspondingly larger. You have not removed the tax, you have moved it into a later year. That is usually still worth doing — money now beats money later, and your rate may be lower then — but it is a deferral, not a disappearance, and anyone selling it to you as free money is overstating it.",
    },
    { type: "tool", slug: "tax-loss-harvesting-calculator" },
  ],
  faq: [
    {
      q: "How much tax does harvesting a crypto loss actually save?",
      a: "Roughly the loss multiplied by your capital gains rate, but capped by the gains you have available to offset. A $6,000 loss at 24% saves $1,440 — if you have at least $6,000 of realised gains. With only $2,000 of gains it saves $480 this year and the rest carries forward. Harvesting never recovers the loss itself, only the tax on an equivalent gain.",
    },
    {
      q: "Can I sell crypto at a loss and buy it back immediately?",
      a: "In the US, yes as things stand: the wash-sale rule covers stock and securities, and the IRS treats crypto as property. Elsewhere usually not. The UK matches your sale against repurchases on the same day and for 30 days after; Canada's superficial-loss window runs 30 days before as well as after and counts a spouse's purchases; Spain's runs two months either side; Australia has no window but cancels wash sales on intent. Check your own country before selling, not after.",
    },
    {
      q: "Does the wash sale rule apply to crypto in 2026?",
      a: "Not in the United States. IRC §1091 applies to \"stock or securities\" and digital assets are treated as property, so the rule does not currently reach them. Two things to keep in mind: Congress has repeatedly proposed extending it to digital assets, and crypto ETFs and crypto-related stocks are securities, so the rule applies to those in full.",
    },
    {
      q: "Why can't I claim a loss on a coin I have held for years in Germany?",
      a: "Because §23 EStG puts positions held longer than a year outside the tax charge altogether. The gain would have been tax-free, and the same rule makes the loss non-deductible. Portugal works the same way at 365 days. It means a losing position in those countries has a deadline: harvest it before it becomes exempt, or its loss becomes worthless.",
    },
    {
      q: "Should I harvest everything I am down on?",
      a: "Usually not. Losses only offset the gains you actually have, so once this year's gains are reduced to zero the next sale saves nothing now — it just banks a carry-forward. That can be a reasonable choice, but it should be a deliberate one: you are giving up the position today for a deduction you cannot use until you have gains again.",
    },
    {
      q: "Is tax loss harvesting legal?",
      a: "Yes. Realising a loss and claiming it is ordinary tax compliance, not avoidance, and several tax authorities describe the mechanics themselves. What is restricted is the artificial version — selling and immediately rebuying purely to manufacture a deduction while keeping the same position — which is exactly what the repurchase rules on this page exist to catch.",
    },
    {
      q: "Do I need to sell to a different person or exchange?",
      a: "No. A normal market sale is a disposal. What matters is whether your position genuinely changed and whether you reacquired inside your country's window. Be careful with transfers between your own wallets and accounts — those are not disposals and create no loss at all, however far the price has fallen.",
    },
  ],
};

export default guide;
