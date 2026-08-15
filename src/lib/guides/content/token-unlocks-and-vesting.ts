import type { Guide } from "../types";

const guide: Guide = {
  slug: "token-unlocks-and-vesting",
  title: "Token Unlocks and Vesting: How Supply Shocks Move Price",
  description:
    "A big unlock can dump a year's worth of new supply onto the market in a day. Learn how vesting schedules work, how to read them, and how to size the dilution before it hits.",
  readingMinutes: 7,
  updatedAt: "2026-07-25",
  seo: {
    keywords: [
      "token unlocks",
      "token vesting explained",
      "crypto vesting schedule",
      "token unlock price impact",
      "cliff vs linear vesting",
      "circulating vs fully diluted supply",
    ],
    description:
      "Token unlocks and vesting explained: cliff vs linear schedules, how unlocks dilute holders and add sell pressure, and how to estimate the impact before the date.",
  },
  relatedTools: ["token-vesting-dilution-calculator", "market-cap-price-calculator", "target-price-calculator"],
  body: [
    { type: "p", text: "When a project launches, it almost never puts all its tokens into circulation at once. Team members, early investors, advisors and the treasury receive allocations that are locked and released gradually over months or years — a vesting schedule. Each release is an 'unlock', and because it increases the number of tokens that can be sold, unlocks are one of the most predictable supply shocks in crypto. If you hold a token, its unlock calendar is not optional reading." },

    { type: "h2", text: "Cliff vs linear: the two shapes of an unlock" },
    { type: "ul", items: [
      "Cliff unlock — nothing releases for a set period, then a large chunk unlocks all at once. A '1-year cliff' means a big tranche lands on a single day. Cliffs create the sharpest price pressure because supply jumps in a step.",
      "Linear unlock — tokens drip out continuously (daily or monthly) after an initial cliff. The pressure is spread out and usually gentler, though relentless.",
      "Most real schedules combine them: a cliff of, say, 12 months, then linear vesting over the following 24–36 months.",
    ] },

    { type: "h2", text: "Circulating vs fully diluted: the gap that unlocks close" },
    { type: "p", text: "Two supply numbers matter. Circulating supply is what's tradeable now; fully diluted valuation (FDV) prices in every token that will ever exist. A token with a $200M market cap but $2B FDV is telling you that 90% of its eventual supply hasn't hit the market yet. Every unlock nudges circulating supply toward that fully-diluted total — and each step dilutes existing holders." },
    { type: "callout", text: "A low circulating supply with a huge FDV is a warning label, not a bargain. It means years of unlocks are queued up, each one adding sellers who bought far cheaper than you." },
    { type: "tool", slug: "market-cap-price-calculator" },

    { type: "h2", text: "How much does an unlock actually move price?" },
    { type: "p", text: "Start with dilution: an unlock equal to 10% of circulating supply dilutes holders by 10%. If market cap stayed constant, price would fall by roughly that proportion. But price impact isn't the same as dilution — it depends on how much of the unlocked supply is actually sold and how deep the order book is. Insiders vesting for years may hold; a fund that's up 50× may dump immediately. Model both a light and a heavy sell scenario." },
    { type: "tool", slug: "token-vesting-dilution-calculator" },

    { type: "h2", text: "How the market prices in a known date" },
    { type: "p", text: "Because unlock dates are public, they're rarely a total surprise — markets often 'price in' an unlock beforehand, with traders shorting into the date and covering after. This means price can weaken in the run-up and, counter-intuitively, bounce on the unlock day itself as the event passes. It also means the naïve trade (short the unlock) is crowded. Watch on-chain flows: tokens moving from vesting contracts to exchange wallets are the real tell that supply is about to be sold." },
    { type: "ul", items: [
      "Check the size relative to circulating supply — a 2% unlock is noise; a 40% cliff is an event.",
      "Check who's unlocking — team and early VCs are more likely to sell than an ecosystem fund.",
      "Watch for tokens flowing to exchanges in the days around the date.",
      "Remember the market may have already discounted it — 'buy the news' happens on unlocks too.",
    ] },

    { type: "cta", title: "The rest of the supply picture", text: "Unlocks are one input. The FDV gap, who holds the unissued supply, the emission rate and whether burns are funded by anything real are the others — and all of them are published before you buy.", href: "/guides/crypto-tokenomics-explained", label: "Read the tokenomics guide" },

    { type: "h2", text: "The takeaway" },
    { type: "p", text: "Vesting exists to align insiders with the long term, which is healthy. But for a holder, an unlock schedule is a map of future supply pressure. Read it before you buy: know the circulating-to-FDV gap, mark the big cliff dates, and size any position with the next unlock in mind. A great narrative can still be ground down by a relentless vesting drip." },
  ],
  faq: [
    { q: "What is a token unlock?", a: "It's the moment previously locked tokens — held by the team, investors or treasury under a vesting schedule — become transferable and can be sold, increasing circulating supply." },
    { q: "Do token unlocks always cause the price to drop?", a: "Not always. Impact depends on the unlock's size relative to circulating supply, how much is actually sold, and whether the market already priced it in. Small linear unlocks are often absorbed; large cliff unlocks tend to hurt." },
    { q: "What's the difference between cliff and linear vesting?", a: "A cliff releases a large batch all at once after a waiting period; linear vesting drips tokens out continuously. Cliffs create sharper supply shocks; linear schedules spread the pressure over time." },
    { q: "Why does a low circulating supply and high FDV matter?", a: "It means most of the supply is still locked and scheduled to unlock over coming years. Each unlock dilutes current holders, so a big circulating-to-FDV gap signals sustained future sell pressure." },
  ],
};

export default guide;
