/**
 * Social content plan — TheCryptoTools (English-only) — as DATA.
 *
 * One source for both the slide generator (scripts/social-slides.mjs → PNG in
 * out/) and the daily Telegram delivery (scripts/telegram-daily.mjs → ready
 * post). Every post ties to a REAL page on the site and keeps the site's honest
 * tone (the tools tell you when a setup LOSES money). Nothing invented.
 *
 * Fields: id (stable slug, used in slide filenames + test arg), day (DOW used
 * for the daily pick), format (carousel|post|story|video), rubric, page (path
 * on the site the post drives to), slides[] (rendered to PNG), caption/hashtags
 * ({ en }), and sticker ({ en }) for stories. lang is "en" throughout.
 *
 * Scale to a month by repeating the five rubrics against other pages.
 */
export const BRAND = "TheCryptoTools";
export const SITE = "thecryptotools.com";
export const HANDLE = "@thecryptotools"; // live — instagram.com/thecryptotools

export const POSTS = [
  // ── Mon · Breakdown (carousel) ──
  {
    id: "grid-loses", day: "Mon", format: "carousel", rubric: "Breakdown",
    page: "/tools/grid-calculator",
    slides: [
      { type: "cover", eyebrow: "Breakdown · Grid bots", title: "5 ways a grid bot quietly loses money" },
      { type: "text", n: 1, title: "Spacing tighter than 2× the fee", body: "A completed grid trade is a buy AND a sell. If the gap is smaller than the round-trip fee, every trade is a guaranteed small loss." },
      { type: "text", n: 2, title: "Price leaves the range", body: "Below the floor you hold a bag bought all the way down. Above the ceiling you sold out and earn nothing while price runs." },
      { type: "text", n: 3, title: "Too many grids on a small balance", body: "A hundred levels on $200 makes orders too small to place — or so small the fee eats the profit." },
      { type: "text", n: 4, title: "Betting on a trend", body: "Grids earn from chop. In a straight rally, simply holding usually beats the bot." },
      { type: "cta", title: "Check your grid before you run it", sub: "Our free calculator flags a config that loses money on every trade.", action: "thecryptotools.com/tools/grid-calculator" },
    ],
    caption: { en: "A grid bot can look busy while losing money on every single trade. The five traps above are the usual culprits — spacing below the fee is the most common.\n\nPlan the exact spacing (and see when a config is a guaranteed loss) with our free grid calculator. Link in bio." },
    hashtags: { en: "#crypto #gridtrading #cryptotrading #tradingbots #bitcoin #cryptotips #defi #altcoins" },
  },

  // ── Tue · Myth vs fact (post) ──
  {
    id: "leverage-myth", day: "Tue", format: "post", rubric: "Myth vs fact",
    page: "/tools/liquidation-calculator",
    slides: [
      { type: "mythfact", tag: "Myth vs fact", claim: "More leverage = more profit.", answer: "It mostly moves your liquidation price closer. 10× doesn't make you right 10× more often — it just means a smaller move wipes the position.", cta: "Find your liquidation price → link in bio" },
    ],
    caption: { en: "Leverage multiplies the OUTCOME, not your edge. At 10× a ~10% move against you is game over, before you're ever proven right.\n\nBefore you size a leveraged trade, know exactly where it gets liquidated. Free liquidation calculator — link in bio." },
    hashtags: { en: "#crypto #leveragetrading #futures #liquidation #riskmanagement #bitcoin #cryptotrading #tradingtips" },
  },

  // ── Wed · Checklist (carousel) ──
  {
    id: "dca-checklist", day: "Wed", format: "carousel", rubric: "Checklist",
    page: "/dca",
    slides: [
      { type: "cover", eyebrow: "Checklist · DCA bots", title: "Before you trust a DCA bot" },
      { type: "checklist", title: "Worth running", items: [
        { ok: true, text: "Fees modelled on both legs of every trade" },
        { ok: true, text: "Backtested on real price history, not a demo" },
        { ok: true, text: "You can see the open position, not just profit" },
        { ok: true, text: "The range matches how the coin actually moves" },
      ] },
      { type: "checklist", title: "Red flags", items: [
        { ok: false, text: "\"Guaranteed\" daily returns" },
        { ok: false, text: "Backtest hides drawdown and bags held" },
        { ok: false, text: "Needs your exchange withdrawal keys" },
        { ok: false, text: "No mention of what happens in a crash" },
      ] },
      { type: "cta", title: "Watch real DCA bots run live", sub: "Paper-trading strategies on real prices — ROI, drawdown and every closed deal.", action: "thecryptotools.com/dca" },
    ],
    caption: { en: "Most \"DCA bot results\" you see online hide the drawdown and the bags held on the way down. Run this 8-point check before trusting one.\n\nWant to see honest numbers? Our DCA lab runs strategies live in paper mode — ROI and drawdown in the open. Link in bio." },
    hashtags: { en: "#dca #dollarcostaveraging #crypto #tradingbots #bitcoin #cryptoinvesting #passiveincome #cryptotips" },
  },

  // ── Thu · Tool promo (post) ──
  {
    id: "grid-backtest", day: "Thu", format: "post", rubric: "Tool promo",
    page: "/grid-trading-backtest",
    slides: [
      { type: "cta", title: "Would a grid bot have worked?", sub: "Backtest a grid strategy on years of real prices — the profit it would have banked, and whether it actually beat just holding. Free, in your browser.", action: "thecryptotools.com/grid-trading-backtest" },
    ],
    caption: { en: "Before you commit real money to a grid bot, replay it on years of real prices — and see the one number that matters: did it beat simply holding?\n\nFree, nothing uploaded, runs in your browser. Link in bio." },
    hashtags: { en: "#crypto #backtesting #gridtrading #tradingbots #bitcoin #cryptotrading #altcoins #cryptotools" },
  },

  // ── Fri · Story (native poll sticker) ──
  {
    id: "fear-greed", day: "Fri", format: "story", rubric: "Story",
    page: "/fear-and-greed-index",
    slides: [
      { type: "story", question: "Fear or Greed?\nWhere's the market today?" },
    ],
    sticker: { en: "Add Instagram's POLL sticker with two options: 😱 Fear / 🤑 Greed. Then add a LINK sticker to thecryptotools.com/fear-and-greed-index. Reveal today's real reading in the next frame." },
    caption: { en: "" },
    hashtags: { en: "" },
  },

  // ── Sat · Breakdown (carousel) ──
  {
    id: "tax-triggers", day: "Sat", format: "carousel", rubric: "Breakdown",
    page: "/crypto-tax-report",
    slides: [
      { type: "cover", eyebrow: "Breakdown · Crypto tax", title: "5 things that trigger a crypto tax bill" },
      { type: "text", n: 1, title: "Selling for fiat", body: "The obvious one: cashing out to USD/EUR realises a capital gain or loss." },
      { type: "text", n: 2, title: "Swapping crypto for crypto", body: "BTC → ETH is a taxable disposal in most countries, even though no money reached your bank." },
      { type: "text", n: 3, title: "Spending crypto", body: "Paying for something with crypto is a disposal too — gain measured to that day's value." },
      { type: "text", n: 4, title: "Earning it", body: "Staking, mining and airdrops are usually income at the value when you receive them." },
      { type: "cta", title: "Turn your CSV into a tax report", sub: "12 countries, right cost-basis method, nothing uploaded — it runs in your browser.", action: "thecryptotools.com/crypto-tax-report" },
    ],
    caption: { en: "\"I only owe tax when I cash out\" is the costliest myth in crypto. Swaps, spending and earned crypto are usually taxable too — in most countries.\n\nDrop in an exchange CSV and get a capital-gains report for 12 countries, computed in your browser. Link in bio. (Not tax advice.)" },
    hashtags: { en: "#cryptotax #crypto #bitcoin #taxes #cryptotips #capitalgains #cryptoinvesting #hodl" },
  },

  // ── Sun · Myth vs fact (post) ──
  {
    id: "swap-tax", day: "Sun", format: "post", rubric: "Myth vs fact",
    page: "/crypto-tax-report",
    slides: [
      { type: "mythfact", tag: "Myth vs fact", claim: "Swapping crypto for crypto is tax-free.", answer: "In most countries a BTC→ETH swap is a taxable disposal — you owe on the gain even though nothing hit your bank. France, Poland and Portugal are notable exceptions.", cta: "Work out your gains → link in bio" },
    ],
    caption: { en: "No fiat left your account, but the taxman may still see a disposal. Crypto-to-crypto swaps are taxable in most countries — a few (France, Poland, Portugal) are the exception.\n\nCheck your country and your numbers with our free tax report. Link in bio. (Not tax advice.)" },
    hashtags: { en: "#cryptotax #crypto #bitcoin #ethereum #taxes #capitalgains #cryptotips #defi" },
  },
];
