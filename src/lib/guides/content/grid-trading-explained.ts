import type { Guide } from "../types";

const guide: Guide = {
  slug: "grid-trading-explained",
  affiliate: "derivatives",
  title: "Grid Trading in Crypto: How Grid Bots Actually Make (and Lose) Money",
  description:
    "How a grid bot works, why the spacing has to clear twice your trading fee, what happens when price leaves the range, and how to size a grid you can live with.",
  readingMinutes: 11,
  updatedAt: "2026-08-06",
  reviewedAt: "2026-08-06",
  seo: {
    title: "Grid Trading in Cryptocurrency — How Grid Bots Work, and When They Don't",
    keywords: [
      "grid trading in cryptocurrency",
      "what is grid trading",
      "grid trading",
      "grid bots",
      "grid trade",
      "crypto grid bot",
      "grid trading strategy",
      "grid bot profit",
      "arithmetic vs geometric grid",
    ],
    description:
      "Grid trading explained properly: how grid bots buy low and sell high across a range, the fee maths that decides whether a grid can be profitable at all, arithmetic vs geometric spacing, and what happens on a breakout.",
  },
  relatedTools: ["grid-calculator", "trading-fee-calculator", "position-size-calculator", "liquidation-calculator"],
  sources: [
    {
      label: "Spot Grid Trading — how it works",
      publisher: "Binance",
      url: "https://www.binance.com/en/support/faq/detail/1ca1a52c8fa04a9d9c1a4a3d21a5e0a0",
    },
  ],
  body: [
    {
      type: "p",
      text: "Grid trading is a way of profiting from movement rather than from direction. You pick a price range, chop it into levels, and a bot places a buy order at every level below the current price and a sell order at every level above it. Each time price falls to a line the bot buys; each time it rises to the next line up, it sells what it just bought. The difference is the profit, and in a market that keeps moving up and down inside your range, that difference is collected over and over.",
    },
    {
      type: "p",
      text: "That is the pitch, and it is genuinely appealing: you do not need to be right about where the market is going, only about where it will stay. The catch is that whether a grid can make money at all is decided by arithmetic you can do before you start — and most people never do it.",
    },

    { type: "h2", text: "The one calculation that decides everything" },
    {
      type: "p",
      text: "Every completed grid trade is two transactions: a buy and a sell. You pay a fee on both. So the gap between two grid lines has to be bigger than twice your fee before a single cent of profit exists.",
    },
    {
      type: "callout",
      text: "Grid spacing must exceed 2 × your trading fee. At a 0.1% spot fee, any grid step below 0.2% loses money on every completed trade — perfectly, mechanically, every time.",
    },
    {
      type: "p",
      text: "This is where most grid bots die. Someone sets a range of 5% and asks for 100 grids. That is a 0.05% step. At a 0.1% fee they are paying 0.2% to earn 0.05%, and the bot will diligently execute that losing trade hundreds of times. It will look busy. The trade count will be impressive. The balance will fall.",
    },
    {
      type: "p",
      text: "The same maths explains why grid bots are so much more common on high-fee-tier accounts than they should be, and why exchanges promote them. A bot that trades constantly is extremely profitable for the venue regardless of whether it is profitable for you.",
    },
    { type: "tool", slug: "trading-fee-calculator" },

    { type: "h2", text: "Arithmetic and geometric grids are not the same thing" },
    {
      type: "p",
      text: "Most bots offer two ways of spacing the levels, and the choice matters more than the interface suggests.",
    },
    {
      type: "table",
      headers: ["", "Arithmetic", "Geometric"],
      rows: [
        { cells: ["Spacing", "Equal dollar gap between levels", "Equal percentage gap between levels"] },
        { cells: ["Range 20,000 → 30,000, 11 levels", "Every step is $1,000", "Every step is about 4.1%"] },
        { cells: ["Profit per trade at the bottom", "$1,000 on $20,000 = 5.0%", "4.1%"] },
        { cells: ["Profit per trade at the top", "$1,000 on $29,000 = 3.4%", "4.1%"] },
        { cells: ["Suits", "Narrow ranges, stable assets", "Wide ranges, volatile assets"] },
      ],
      caption:
        "The same range and the same number of levels, spaced two ways. Arithmetic quietly pays you less per trade the higher price goes.",
    },
    {
      type: "p",
      text: "For a range of a few percent the difference is negligible. Across a range where the top is double the bottom it is severe: an arithmetic grid's percentage return per trade halves as price climbs, so the trades you make in the upper half of the range earn far less than the ones at the bottom — and they may drop below your fee threshold entirely while the bot keeps taking them.",
    },
    {
      type: "callout",
      text: "Rule of thumb: if your upper bound is more than about 30% above your lower bound, use geometric spacing. Otherwise the top of your grid is working for the exchange.",
    },

    { type: "h2", text: "Choosing the range" },
    {
      type: "p",
      text: "The range is a prediction, however much grid trading is sold as not needing one. You are asserting that price will stay between two numbers for as long as the bot runs. Three ways people set it, in rough order of how well they work:",
    },
    {
      type: "ul",
      items: [
        "Recent highs and lows — take the range the asset has actually traded in over a period similar to how long you plan to run the bot. Simple, and it at least uses evidence.",
        "Volatility-based — set the bounds a multiple of recent daily volatility away from the current price. This adapts to the asset instead of treating a stablecoin pair and a memecoin the same way.",
        "Support and resistance — defensible if you can identify them honestly, and a good way to fool yourself if you cannot.",
      ],
    },
    {
      type: "p",
      text: "Wider ranges survive longer but earn less per trade and tie up more capital. Narrower ranges earn more per trade and break sooner. There is no setting that avoids the trade-off; there is only the setting you understand.",
    },

    { type: "h2", text: "How many levels?" },
    {
      type: "p",
      text: "More levels mean more frequent, smaller trades. Fewer levels mean rarer, larger ones. Between the fee floor at one end and your patience at the other, the workable band is narrower than the interface implies.",
    },
    {
      type: "ul",
      items: [
        "Start from the fee, not from a round number. Divide your range percentage by (2 × fee × a safety multiple of at least 3) to get the maximum sensible number of levels.",
        "Capital is split across levels, so 100 grids on $1,000 puts $10 in each order — which many exchanges will reject for being below the minimum order size.",
        "Every level is an open order. Some venues cap how many you may have.",
      ],
    },
    { type: "tool", slug: "grid-calculator" },

    { type: "h2", text: "What actually happens on a breakout" },
    {
      type: "p",
      text: "This is the part the marketing skips, so it is worth being concrete. Say you run a grid on an asset between $20,000 and $30,000, and price falls to $15,000.",
    },
    {
      type: "ul",
      items: [
        "Every buy order in the grid has filled. You now hold the full position, bought all the way down.",
        "None of the corresponding sells have triggered, because price never came back up to them.",
        "Your average entry is somewhere in the middle of the range — call it $25,000 — against a market at $15,000. You are down 40% on a strategy sold as market-neutral.",
        "The bot has stopped earning. It has nothing left to buy with and nothing it can sell at a profit.",
      ],
    },
    {
      type: "p",
      text: "The upside breakout is gentler but still costs you: price runs past $30,000, the bot sells everything, and then you sit in cash watching an asset you owned keep going without you. Grid trading caps your upside by construction. That is not a bug — it is the price of the income you collect while the market is going nowhere.",
    },
    {
      type: "callout",
      text: "A grid bot converts an open-ended directional bet into a stream of small income plus a hidden short position in volatility. When volatility resolves into a trend, you pay it all back.",
    },

    { type: "h2", text: "Spot grids and futures grids are different products" },
    {
      type: "p",
      text: "A spot grid can only lose you the difference between what you paid and what the asset is worth. In the worst case you are holding a bag you bought too high — unpleasant, survivable, and you still own the coins.",
    },
    {
      type: "p",
      text: "A futures grid adds leverage, and with it liquidation. The same breakout that leaves a spot grid holding an underwater position closes a leveraged one entirely, at which point the range you chose is irrelevant because you no longer have a position in it. If you run a futures grid, your lower bound and your liquidation price are the two numbers that matter, and the second one should be a long way below the first.",
    },
    { type: "tool", slug: "liquidation-calculator" },

    { type: "h2", text: "Where grid bots run" },
    {
      type: "p",
      text: "Most large exchanges now offer grid bots directly — Binance, Bybit, OKX, KuCoin, Bitget and Pionex all have one, usually free to use because the exchange earns on the trades. Third-party platforms like 3Commas and Cryptohopper connect by API key and run the same strategies across venues, for a subscription.",
    },
    {
      type: "p",
      text: "The bot is rarely the differentiator. The fee tier is, because of the arithmetic at the top of this page — a venue charging half as much per trade roughly doubles the number of grid configurations that can work at all.",
    },
    {
      type: "cta",
      title: "Compare the venues on what does not change",
      text: "Availability, custody, and what each is genuinely good at — with links to both platforms' own live fee schedules, since a fee table printed here would be wrong by next quarter.",
      href: "/compare",
      label: "Compare exchanges",
    },

    { type: "h2", text: "An honest summary" },
    {
      type: "p",
      text: "Grid trading is a real strategy with a narrow, specific edge: it monetises chop. It works when an asset is genuinely range-bound, your spacing clears the fee floor by a comfortable margin, and you are willing to be left holding the asset if you are wrong about the range.",
    },
    {
      type: "p",
      text: "It is not passive income, it is not market-neutral, and it does not remove the need to have a view. It converts one kind of risk into another kind that is easier to ignore right up until it arrives.",
    },
  ],
  faq: [
    {
      q: "What is grid trading in cryptocurrency?",
      a: "A strategy that places buy orders below the current price and sell orders above it across a chosen range, automatically buying each dip and selling each rally. It profits from price moving up and down within the range rather than from price going one way.",
    },
    {
      q: "Is grid trading profitable?",
      a: "It can be, in genuinely range-bound markets, provided the gap between grid levels is larger than twice your trading fee. Below that threshold every completed trade loses money by construction, no matter how the market behaves.",
    },
    {
      q: "How many grids should I use?",
      a: "Work back from your fee rather than picking a round number. Divide your range percentage by at least six times your fee percentage to get a sensible ceiling — and check that the capital per level clears your exchange's minimum order size.",
    },
    {
      q: "Should I use an arithmetic or geometric grid?",
      a: "Geometric once the range is wide — roughly when the upper bound is more than 30% above the lower one. Arithmetic spacing gives equal dollar steps, so the percentage earned per trade shrinks as price rises, and the trades near the top of a wide range can fall below your fee floor.",
    },
    {
      q: "What happens if the price leaves my grid range?",
      a: "On a downside break, all the buys have filled and none of the sells have, so you hold the whole position bought on the way down and the bot stops earning. On an upside break the bot sells out and you sit in cash while the asset keeps rising. Neither is a disaster, but neither is neutral.",
    },
    {
      q: "Are grid bots safe?",
      a: "Spot grid bots risk the value of the asset you end up holding. Futures grid bots add leverage and can be liquidated, which is a different category of risk entirely — there the distance between your lower bound and your liquidation price matters more than any grid setting.",
    },
    {
      q: "Do grid bots work in a bull market?",
      a: "Poorly. A steady uptrend pushes price out of the top of the range, the bot sells everything on the way up, and you underperform simply holding the asset. Grid trading buys you income in exchange for your upside.",
    },
  ],
};

export default guide;
