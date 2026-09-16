import type { Guide } from "../types";

const guide: Guide = {
  slug: "bitcoin-halving-explained",
  title: "The Bitcoin Halving Explained: What It Is, and What It Really Does to the Price",
  description:
    "Why Bitcoin's block reward halves every four years, the full 2012–2028 schedule, what the halving has and hasn't done to the price, and what it means for miners and holders.",
  readingMinutes: 11,
  updatedAt: "2026-09-16",
  reviewedAt: "2026-09-16",
  seo: {
    title: "Bitcoin Halving Explained — Schedule, Price Effect, and What to Do",
    keywords: [
      "bitcoin halving",
      "what is the bitcoin halving",
      "when is the next bitcoin halving",
      "bitcoin halving 2028",
      "bitcoin halving price effect",
      "bitcoin block reward",
      "bitcoin halving schedule",
      "does the halving pump bitcoin",
    ],
    description:
      "How the Bitcoin halving works, the block-reward schedule from 2012 to 2028, the honest story on its price effect, and what it means for miners and long-term holders.",
  },
  keyTakeaways: [
    "Every **210,000 blocks (~4 years)** the reward paid to Bitcoin miners is **cut in half**, slowing the creation of new BTC.",
    "It exists to enforce a **fixed 21 million cap** — issuance is disinflationary and written into the code, not decided by anyone.",
    "The last halving (**April 2024**) cut the reward to **3.125 BTC**; the next (**~April 2028**) drops it to **1.5625 BTC**.",
    "Big rallies have *followed* past halvings, but the halving is **known in advance and priced in** — treat 'it always pumps' as a story, not a guarantee.",
    "Its biggest immediate effect is on **miners**, whose revenue halves overnight; for holders it changes little you can trade on directly.",
  ],
  relatedTools: [
    "bitcoin-halving-countdown",
    "mining-profitability-calculator",
    "dca-calculator",
    "market-cap-price-calculator",
  ],
  sources: [
    {
      label: "Bitcoin: A Peer-to-Peer Electronic Cash System (the whitepaper) — §6 Incentive",
      publisher: "Satoshi Nakamoto, bitcoin.org",
      url: "https://bitcoin.org/bitcoin.pdf",
    },
    {
      label: "Controlled supply — the full block-reward schedule",
      publisher: "Bitcoin Wiki",
      url: "https://en.bitcoin.it/wiki/Controlled_supply",
    },
  ],
  body: [
    { type: "p", text: "The Bitcoin halving is the event, roughly every four years, when the reward paid to miners for adding a block is cut in half. That reward is also how new bitcoins come into existence — so halving it halves the rate at which new BTC is created. It is the single most important date on Bitcoin's calendar, and also the most over-mythologised, so this guide separates the mechanism (simple and certain) from the price story (loud and uncertain)." },

    { type: "h2", text: "What actually happens at a halving" },
    { type: "p", text: "Miners collect two things for each block they add to the chain: the transaction fees in that block, and a fixed 'block subsidy' of brand-new bitcoin. That subsidy started at 50 BTC per block in 2009 and is programmed to halve every 210,000 blocks — which, at roughly ten minutes per block, works out to about four years. Nothing is decided by a company or a vote; it is a line in the protocol every node enforces. A block paying the wrong subsidy is simply rejected by the network." },
    { type: "callout", text: "The halving is not inflation being 'added' — it is the rate of new supply being cut. After the 2024 halving, Bitcoin's annual issuance dropped to roughly 0.8% of supply, lower than gold's. That falling, predictable issuance is the whole point." },

    { type: "h2", text: "Why it exists: the 21 million cap" },
    { type: "p", text: "Bitcoin's defining property is a fixed maximum supply of 21 million coins. The halving is the mechanism that enforces it. Each halving roughly halves the new supply, so the total issued approaches 21 million as a geometric series that never quite exceeds it — the last fraction of a bitcoin is expected to be mined around the year 2140. This is what people mean by Bitcoin being 'disinflationary' or 'hard money': the issuance schedule is known decades in advance and cannot be changed on a whim to print more." },

    { type: "h2", text: "The full halving schedule" },
    { type: "table",
      headers: ["Halving", "Approx. date", "Block height", "Reward before → after"],
      rows: [
        { cells: ["Genesis", "Jan 2009", "0", "— → 50 BTC"] },
        { cells: ["1st", "Nov 2012", "210,000", "50 → 25 BTC"] },
        { cells: ["2nd", "Jul 2016", "420,000", "25 → 12.5 BTC"] },
        { cells: ["3rd", "May 2020", "630,000", "12.5 → 6.25 BTC"] },
        { cells: ["4th", "Apr 2024", "840,000", "6.25 → 3.125 BTC"] },
        { cells: ["5th (next)", "~Apr 2028", "1,050,000", "3.125 → 1.5625 BTC"] },
      ],
      caption: "Dates are estimates — the halving triggers on a block height, and the exact day drifts with how fast blocks are found.",
    },
    { type: "p", text: "Because the trigger is a block height and not a calendar date, the exact day always shifts a little. The countdown tool below estimates it from the current block height and average block time." },
    { type: "tool", slug: "bitcoin-halving-countdown" },

    { type: "h2", text: "The price question, answered honestly" },
    { type: "p", text: "This is what everyone actually wants to know, so here is the careful version. Historically, each of Bitcoin's largest bull markets began in the twelve to eighteen months after a halving. That is a real pattern, and the logic behind it is intuitive: if demand stays constant while new supply is suddenly cut in half, price should rise. This is the reasoning behind popular models like stock-to-flow." },
    { type: "p", text: "But three things keep it from being the free money it is often sold as:" },
    { type: "ul", items: [
      "It is fully known in advance. Everyone can see the halving coming years out, so efficient-market logic says its effect is already in the price long before the date. Markets price the expected future, not the present.",
      "Correlation is not causation. Past halvings also coincided with new investors arriving, easy monetary policy, and later the spot ETFs. Untangling the halving's effect from everything else happening in those years is guesswork, and four data points is not a law of nature.",
      "The supply shock shrinks each time. Cutting issuance from 12.5 to 6.25 is a smaller change to total supply than 50 to 25 was, and the next cuts matter even less. The mechanism that supposedly drives the rally weakens with every cycle.",
    ] },
    { type: "callout", text: "The honest summary: the halving is bullish in theory and has been followed by rallies in practice, but it is not a guaranteed or tradeable pump. 'Buy before the halving' is a bet that the market has mispriced a date it has known about for four years — possible, but not the sure thing the headlines imply." },
    { type: "p", text: "If you want to reason about price properly, work in market cap, not the halving date: decide what total valuation a scenario implies and back out the price. That keeps you anchored to something real instead of a calendar." },
    { type: "tool", slug: "market-cap-price-calculator" },

    { type: "h2", text: "Who the halving really hits: miners" },
    { type: "p", text: "The halving's one immediate, certain effect is on miners. Overnight, the subsidy portion of their revenue is cut in half while their electricity bills and hardware costs are unchanged. Every halving therefore forces a shakeout: miners running old, inefficient machines or paying high power prices fall below break-even and switch off, and the survivors are the most efficient operations." },
    { type: "p", text: "The network self-corrects for this. Bitcoin's difficulty adjustment lowers the mining difficulty when hash power drops, so blocks keep coming roughly every ten minutes and the remaining miners earn a larger share. Over the long run, miners also depend more and more on transaction fees rather than the shrinking subsidy — which is by design, since the subsidy eventually goes to zero." },
    { type: "p", text: "If you mine, the halving is the moment to re-run your numbers: your revenue per terahash roughly halves, so your break-even electricity price and the viability of each rig change immediately." },
    { type: "tool", slug: "mining-profitability-calculator" },

    { type: "h2", text: "What it means for a regular holder" },
    { type: "p", text: "For someone simply holding or accumulating Bitcoin, the practical guidance is calmer than the hype suggests:" },
    { type: "ul", items: [
      "You cannot trade the date itself with an edge — it is the most anticipated event in the asset, so the obvious trade is the crowded one.",
      "The halving strengthens the long-term scarcity thesis, which is a reason some people hold Bitcoin at all — but that is a multi-year view, not a signal to time an entry.",
      "Volatility often rises around these periods. If you are accumulating, a scheduled approach removes the pressure to pick the exact bottom or top.",
    ] },
    { type: "p", text: "Dollar-cost averaging through a full cycle is the tool most holders actually use to engage with the halving narrative without betting on a single date — you keep buying a fixed amount regardless of where the cycle is." },
    { type: "tool", slug: "dca-calculator" },

    { type: "h2", text: "When does it all end?" },
    { type: "p", text: "The halvings continue until the block subsidy rounds down to zero, which is expected around 2140. By then all 21 million bitcoin (minus coins lost forever) will have been mined, and miners will be paid entirely from transaction fees. We are already most of the way there by supply: well over 90% of all bitcoin that will ever exist has already been issued — the remaining coins simply trickle out ever more slowly, one halving at a time." },
  ],
  faq: [
    { q: "When is the next Bitcoin halving?", a: "The next halving is estimated around April 2028, at block height 1,050,000, when the reward drops from 3.125 to 1.5625 BTC. The exact date drifts because the halving triggers on a block height, not a calendar date — use the halving countdown tool for a live estimate." },
    { q: "Does the Bitcoin halving always make the price go up?", a: "No — that is a story, not a guarantee. Large rallies have followed past halvings, but the halving is known years in advance and largely priced in, correlation is not causation, and the supply shock shrinks each cycle. Treat 'it always pumps' with caution." },
    { q: "Why does Bitcoin have a halving at all?", a: "To enforce the fixed 21 million supply cap. Halving the block reward every 210,000 blocks makes new issuance approach 21 million as a series that never exceeds it, giving Bitcoin a predictable, disinflationary supply schedule set in code." },
    { q: "How does the halving affect miners?", a: "It immediately cuts the subsidy half of their revenue while costs stay the same, forcing inefficient miners offline. The network's difficulty adjustment then eases so blocks keep coming every ~10 minutes, and surviving miners rely increasingly on transaction fees." },
    { q: "How many halvings are left?", a: "Halvings continue until the reward rounds to zero, expected around the year 2140. Over 90% of all bitcoin has already been mined; the rest is released ever more slowly, halving by halving." },
    { q: "What was the reward at each halving?", a: "50 BTC at launch (2009), then 25 (2012), 12.5 (2016), 6.25 (2020), and 3.125 after April 2024. The next halving around 2028 cuts it to 1.5625 BTC." },
  ],
};

export default guide;
