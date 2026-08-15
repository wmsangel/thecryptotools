import type { Guide } from "../types";

const guide: Guide = {
  slug: "crypto-market-cap-explained",
  title: "Crypto Market Cap Explained (And Why Cheap Coins Aren't Cheap)",
  description:
    "Market cap, circulating vs fully diluted supply, and the arithmetic that shows why a $0.001 coin reaching $1 is usually impossible.",
  readingMinutes: 6,
  updatedAt: "2026-07-19",
  seo: {
    keywords: [
      "crypto market cap explained",
      "what is market cap crypto",
      "fully diluted valuation",
      "circulating supply",
      "market cap price calculator",
      "unit bias crypto",
    ],
    description:
      "What crypto market cap really measures, how circulating supply and FDV differ, and how to sanity-check a price target with the market-cap comparison method.",
  },
  relatedTools: ["market-cap-price-calculator", "target-price-calculator", "roi-calculator"],
  body: [
    { type: "p", text: "Market cap = price × circulating supply. It is the single most useful number for judging whether a price target is plausible, and the single most misunderstood one in crypto." },

    { type: "h2", text: "Why the coin price alone tells you nothing" },
    { type: "p", text: "A coin at $0.002 is not 'cheaper' than one at $2,000. Price is just market cap divided by however many tokens the team decided to create. A project with 500 billion tokens at $0.002 is a $1bn company; one with 500,000 tokens at $2,000 is also a $1bn company. Identical valuations, wildly different-looking prices." },
    { type: "callout", text: "This is unit bias, and meme projects exploit it deliberately. 'It only needs to reach $1' sounds achievable — until you multiply $1 by the 589 trillion tokens in supply and get a number larger than the world's entire money supply." },

    { type: "h2", text: "The sanity check that takes ten seconds" },
    { type: "p", text: "To evaluate any price target, convert it into the market cap it implies, then ask whether that valuation makes sense next to projects you already know. Target price = (target market cap) ÷ circulating supply." },
    { type: "p", text: "Example: a token with 2 billion circulating supply trading at $0.50 has a $1bn cap. For it to hit $5 it would need a $10bn cap — putting it in the top 20 of all crypto assets. Possible? Sometimes. But now you are asking the right question instead of staring at a small number." },
    { type: "tool", slug: "market-cap-price-calculator" },

    { type: "h2", text: "Circulating, total and fully diluted supply" },
    { type: "ul", items: [
      "Circulating supply — tokens actually tradeable today. This is what standard market cap uses.",
      "Total supply — everything minted, including locked team and treasury allocations.",
      "Max supply — the hard ceiling, if there is one (Bitcoin: 21 million; Ethereum: none).",
      "Fully diluted valuation (FDV) — price × max supply. What the project would be worth if every future token existed right now.",
    ] },
    { type: "p", text: "The gap between market cap and FDV is where a lot of money is lost. A token with a $200m cap but a $4bn FDV has 95% of its supply still to be released. Every unlock is new sell-side pressure that must be absorbed just to keep the price flat. Check the vesting schedule before you check the chart." },

    { type: "h2", text: "What market cap does not mean" },
    { type: "ul", items: [
      "It is not money invested. A $1bn market cap does not mean $1bn flowed in — a few million in thin order books can mark up a large supply.",
      "It is not money you could take out. Try to exit a large position in an illiquid token and the cap evaporates as you sell.",
      "It is not a measure of quality. Supply can be inflated, locked or held mostly by insiders, all of which distort the number.",
    ] },
    { type: "p", text: "Pair market cap with 24h volume for a liquidity read: a token with a $500m cap and $2m of daily volume is a valuation almost nobody can realise. As a rough guide, volume below 1–2% of market cap should make you cautious about position size." },
    { type: "tool", slug: "target-price-calculator" },

    { type: "h2", text: "Dominance and the market-cycle view" },
    { type: "p", text: "Bitcoin dominance — BTC's share of total crypto market cap — is a useful regime indicator. Rising dominance usually means capital is consolidating into Bitcoin and alts are bleeding relative value; falling dominance during a rising total cap is the classic 'alt season' signature. It is context, not a signal to trade off on its own." },
  ],
  faq: [
    { q: "Can a cheap coin realistically reach $1?", a: "Only if the market cap that implies is realistic. Multiply $1 by the circulating supply — if the answer exceeds the market cap of Ethereum, the answer is effectively no." },
    { q: "Should I use market cap or FDV?", a: "Both. Market cap prices today's reality; FDV prices the future dilution you are buying into. A large gap between them is a warning to inspect the unlock schedule." },
    { q: "Does a higher market cap mean a safer investment?", a: "It usually means deeper liquidity and a longer track record, which reduces some risks. It says nothing about whether the valuation is justified." },
    { q: "Why do different sites show different market caps?", a: "They disagree on what counts as circulating — burned tokens, locked treasury, unclaimed airdrops. Check the methodology before comparing across sites." },
  ],
};

export default guide;
