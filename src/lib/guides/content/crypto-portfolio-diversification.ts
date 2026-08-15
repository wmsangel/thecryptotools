import type { Guide } from "../types";

/**
 * Every correlation figure in this guide comes from OUR OWN daily-close data
 * via `buildCorrelation()` over the same ten assets `/portfolio/correlation/`
 * renders, computed 2026-08-11 against history running to 2026-08-10. If you
 * refresh the price history (`npm run history`) these numbers move — re-run the
 * matrix and update both this guide and the page, or they will disagree.
 */
const guide: Guide = {
  slug: "crypto-portfolio-diversification",
  title: "Crypto Diversification: Why Ten Coins Behave Like One Bet",
  description:
    "The ten largest crypto assets moved at 0.80 average correlation over the past year. Here is what that number does to a portfolio, why holding more coins barely helps, and what actually reduces risk.",
  readingMinutes: 11,
  updatedAt: "2026-08-11",
  reviewedAt: "2026-08-11",
  seo: {
    title: "Crypto Portfolio Diversification — What 0.80 Correlation Really Costs You",
    keywords: [
      "crypto portfolio diversification",
      "crypto correlation",
      "bitcoin altcoin correlation",
      "is my crypto portfolio diversified",
      "crypto portfolio risk",
      "diversify crypto portfolio",
      "crypto asset correlation matrix",
      "how many crypto coins should i hold",
    ],
    description:
      "Measured from real daily closes: the ten biggest crypto assets averaged 0.80 pairwise correlation over the last year. See what that does to portfolio volatility, why adding coins stops helping, and how to tell diversification from duplication.",
  },
  relatedTools: [
    "portfolio-volatility-calculator",
    "portfolio-rebalance-calculator",
    "max-drawdown-calculator",
    "sharpe-ratio-calculator",
  ],
  body: [
    {
      type: "p",
      text: "Most people who own crypto own several coins, and believe that this is diversification. It is the same instinct that works in equities, where owning a utility, a bank and a semiconductor manufacturer genuinely spreads your risk across different businesses facing different conditions. The instinct is sound. It just does not survive contact with the data in this market.",
    },
    {
      type: "p",
      text: "We measure this from our own daily closes rather than quoting someone else's figure. Across the ten largest crypto assets — bitcoin, ether, XRP, BNB, solana, dogecoin, cardano, chainlink, litecoin and polkadot — the average correlation between any two of them over the last year was 0.80.",
    },
    {
      type: "callout",
      text: "0.80 average pairwise correlation over the last year. The most alike pair was ETH/SOL at 0.891, with BTC/ETH just behind at 0.884. The least alike pair in the whole set was BNB/DOT at 0.670 — and 0.67 is still a strong positive relationship.",
    },
    {
      type: "p",
      text: "Read that last sentence again, because it is the finding that matters. The two most different large-cap crypto assets we could find still moved together two-thirds of the time. There is no pair in the top ten that offers you genuine independence.",
    },

    { type: "h2", text: "What 0.80 does to a portfolio" },
    {
      type: "p",
      text: "Correlation is abstract until you convert it into the only unit anyone actually feels: how much calmer the combination is than its parts. For equally weighted assets of similar volatility, portfolio volatility scales as the square root of (1 + (n−1)ρ) ÷ n. Put the measured numbers in and the result is bleak.",
    },
    {
      type: "table",
      caption: "Portfolio volatility relative to holding a single asset (equal weights, similar volatilities)",
      headers: ["Assets held", "At ρ = 0.80 (last year)", "At ρ = 0.66 (3-year average)", "At ρ = 0 (truly independent)"],
      rows: [
        { cells: ["1", "1.00", "1.00", "1.00"] },
        { cells: ["2", "0.95", "0.91", "0.71"] },
        { cells: ["5", "0.92", "0.86", "0.45"] },
        { cells: ["10", "0.91", "0.84", "0.32"] },
        { cells: ["20", "0.90", "0.83", "0.22"] },
        { cells: ["50", "0.90", "0.82", "0.14"] },
      ],
    },
    {
      type: "p",
      text: "Ten coins at last year's correlation gave you a portfolio 9% less volatile than holding one. Ten genuinely independent assets would have given you 68% less. And the column barely moves after the fifth coin: going from ten holdings to fifty buys you less than one percentage point of additional smoothing.",
    },
    {
      type: "p",
      text: "There is a hard floor here, and it is worth naming. As the number of assets grows, portfolio volatility approaches the square root of the correlation — so at ρ = 0.80 the best you can ever do, with infinite coins, is about 10.6% less volatility than a single position. Adding names cannot get you past it. Diversification is not something you can buy more of once the correlation is this high.",
    },
    {
      type: "callout",
      text: "This table assumes the assets have similar volatility, which they do not — dogecoin and bitcoin are not equally wild. It is the right shape but not your exact number. For your actual mix, the portfolio tools below compute volatility from the real covariance rather than an average.",
    },
    { type: "tool", slug: "portfolio-volatility-calculator" },

    { type: "h2", text: "It got worse, not better" },
    {
      type: "p",
      text: "The comforting assumption is that correlations spiked during some past crisis and have since relaxed. The measurement says the opposite. Over three years the same ten assets averaged 0.66, and over five years 0.68. Over the last year: 0.80.",
    },
    {
      type: "p",
      text: "Whatever differentiation existed between these assets has been shrinking, not growing, even as the number of distinct use cases they claim has multiplied. A portfolio assembled in 2023 on the basis that its holdings behaved differently is, on this evidence, less diversified today than it was on the day it was built — without a single trade having been made.",
    },
    {
      type: "table",
      caption: "Average pairwise correlation across the same ten assets, by window",
      headers: ["Window", "Average", "BTC/ETH", "Least alike pair"],
      rows: [
        { cells: ["Last year", "0.80", "0.884", "BNB/DOT — 0.670"] },
        { cells: ["Last 3 years", "0.66", "0.808", "XRP/BNB — 0.481"] },
        { cells: ["Last 5 years", "0.68", "0.839", "XRP/BNB — 0.541"] },
      ],
    },
    {
      type: "p",
      text: "This is also why a single correlation number is a half-truth and why the matrix on this site shows three windows. The five-year figure describes a portfolio nobody currently holds. The one-year figure describes yours.",
    },

    { type: "h2", text: "Correlation has to be measured on returns, not prices" },
    {
      type: "p",
      text: "A technical point that quietly invalidates a lot of published crypto correlation figures. If you correlate price levels, two assets that both rose over the period will show a high correlation almost by definition — they both went up, so their price series both trend upward, and the statistic picks up the shared trend rather than any shared behaviour.",
    },
    {
      type: "p",
      text: "The meaningful question is whether they move together on the same days. That means correlating daily returns — the percentage change from one close to the next — which strips out the trend and leaves the co-movement. Every figure on this page and on our matrix is computed that way. If a correlation table does not say which it used, assume prices, and assume the numbers are inflated.",
    },

    { type: "h2", text: "What this does not mean" },
    {
      type: "p",
      text: "It does not mean holding several coins is pointless. Correlation describes how assets move together, not how far they go. Two assets can be 0.9 correlated while one triples and the other halves — the daily wobbles line up, the destinations do not. Spreading across several holdings still protects you from the specific disasters: a bridge exploit, a delisting, a chain halt, a team walking away. Those are idiosyncratic, and no correlation figure captures them.",
    },
    {
      type: "p",
      text: "What it does mean is that you should stop expecting your coin count to smooth the ride. It will not. If a 70% market-wide drawdown would end you, holding fifteen coins instead of three does not fix that, and believing otherwise is how people end up over-sized in a position they thought was hedged.",
    },
    {
      type: "callout",
      text: "The practical translation: diversification within crypto protects you from a project failing. It does not protect you from crypto falling. Those are different risks and only one of them is addressed by owning more tickers.",
    },

    { type: "h2", text: "Judge diversification at your target weights, not your drifted ones" },
    {
      type: "p",
      text: "A subtlety worth getting right if you measure this yourself. A portfolio that started at eight equal positions and was never rebalanced is not eight equal positions any more — the winner has run, and it may now be 40% of the book. Measuring diversification on those drifted weights credits you for concentration: the number improves precisely because you have become less diversified.",
    },
    {
      type: "p",
      text: "Measure at the target weights you actually chose. That is the mix you are claiming to hold, and it is the one your rebalancing would restore. Our portfolio analyzer scores it this way for that reason.",
    },
    { type: "tool", slug: "portfolio-rebalance-calculator" },

    { type: "h2", text: "What actually reduces the risk" },
    {
      type: "p",
      text: "If more coins do not work, the honest list of things that do is short and mostly unglamorous.",
    },
    {
      type: "ul",
      items: [
        "Position size. The single most effective control, and the only one that works regardless of correlation. What fraction of everything you own is in crypto at all? That number, not your coin count, determines what a 70% drawdown does to your life.",
        "Assets outside crypto. Diversification requires something that is genuinely driven by different forces. Within this market, nothing on the list above qualifies. Between this market and the rest of your net worth, plenty does.",
        "Stablecoins and cash as a deliberate allocation. Boring, and the only holding in the table whose correlation to the rest is genuinely near zero.",
        "Rebalancing, if the assets take turns leading. It is not free — every rebalance is a set of trades, each pays a fee, and in most countries each sale is a taxable disposal — so test whether it actually helped your mix before adopting it as policy.",
        "Time. Drawdown depth is what ends people, and the depth you can tolerate depends mostly on whether you are forced to sell. Money you will not need for years survives a drawdown that money you need next quarter does not.",
      ],
    },
    { type: "tool", slug: "max-drawdown-calculator" },
    {
      type: "cta",
      title: "Check your own mix against the real numbers",
      text: "Build your allocation and replay it against real daily closes — volatility, drawdown, whether rebalancing helped, and a correlation matrix for exactly the assets you hold rather than a generic top ten.",
      href: "/portfolio",
      label: "Open the portfolio analyzer",
    },
    {
      type: "cta",
      title: "See the full correlation matrix",
      text: "Every pair across the major assets over one, three and five years, computed from daily closes and updated with the price data. Includes which assets were dropped from each window for being too young to measure.",
      href: "/portfolio/correlation",
      label: "Open the correlation matrix",
    },
  ],
  faq: [
    {
      q: "What is a good correlation for a crypto portfolio?",
      a: "Below 0.3 would be genuinely useful diversification, and roughly nothing in large-cap crypto achieves it against the rest of the market. The realistic target is not a number to hit within crypto but a recognition that the diversification has to come from somewhere else — position size, and assets outside the sector.",
    },
    {
      q: "How many crypto coins should I hold?",
      a: "For risk reduction, fewer than most people assume: the volatility benefit is largely exhausted after about five holdings and essentially flat after ten, because the correlations are so high. Holding more can still make sense for exposure to different projects succeeding, but it should not be sold to yourself as risk management.",
    },
    {
      q: "Do altcoins still follow bitcoin?",
      a: "Closely, and more closely than they did. Over the last year every pair among the ten largest assets correlated at 0.67 or above, and bitcoin against ether specifically at 0.884. Over three years the same set averaged 0.66, so the relationship has tightened rather than loosened.",
    },
    {
      q: "Does diversifying into stablecoins count?",
      a: "Yes, and it is one of the few things on the list that genuinely does. A stablecoin holding has close to zero correlation with the rest of the portfolio, which is precisely what none of the volatile assets offers. The risks it carries are different in kind — issuer, reserve and regulatory — rather than market risk.",
    },
    {
      q: "Why does your correlation number differ from other sites?",
      a: "Usually one of three reasons: the window (correlations move a lot, and ours is stated for one, three and five years), the asset set, or the method. We correlate daily returns rather than price levels, because correlating price levels mostly measures the shared uptrend and inflates the figure. The underlying daily closes are the same files this site serves for its backtests.",
    },
    {
      q: "If everything moves together, is there any point rebalancing?",
      a: "Sometimes. Rebalancing profits from assets taking turns leading, which can happen even at high correlation — correlation describes the direction of daily moves, not their size. Whether it paid for your specific mix over your specific window is a question with a factual answer, which is what the portfolio analyzer's rebalancing comparison exists to give.",
    },
  ],
};

export default guide;
