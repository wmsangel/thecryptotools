/**
 * ============================================================================
 * Crypto glossary — config-driven. One object per term.
 * ============================================================================
 * Rendered as a single hub page (/glossary) grouped by category, each term with
 * an anchor (#slug) and links into the tools / guides / data pages that term
 * relates to. The glossary exists to (a) rank for "what is X" queries and (b)
 * be a dense internal-linking hub that feeds our calculators and guides — so
 * every definition that has a matching tool or guide links to it.
 *
 * `short` is a one-sentence definition (used for the snippet and the term list).
 * `body` expands it to 2–3 plain sentences. Links in `body` use inline markdown
 * ([label](/path)) rendered by renderInline. `links` are the curated cards shown
 * under the term.
 */

export type GlossaryCategory = "trading" | "defi" | "market" | "wallets" | "metrics";

export interface GlossaryLink {
  label: string;
  href: string;
}

export interface GlossaryTerm {
  slug: string;
  term: string;
  /** Other spellings/abbreviations, for on-page search + keywords. */
  aliases?: string[];
  category: GlossaryCategory;
  short: string;
  body: string;
  links?: GlossaryLink[];
}

export const GLOSSARY_CATEGORIES: { id: GlossaryCategory; title: string; blurb: string }[] = [
  { id: "trading", title: "Trading", blurb: "Orders, leverage and the mechanics of a trade." },
  { id: "metrics", title: "Metrics & analysis", blurb: "The numbers used to size risk and read performance." },
  { id: "market", title: "Market & valuation", blurb: "How a coin is priced and what moves the whole market." },
  { id: "defi", title: "DeFi & earning", blurb: "Staking, yield and the ways crypto pays you." },
  { id: "wallets", title: "Wallets & security", blurb: "Where coins live and how they get lost." },
];

export const glossaryTerms: GlossaryTerm[] = [
  // ---- Trading ----
  {
    slug: "market-order",
    term: "Market order",
    category: "trading",
    short: "An order that fills immediately at the best available price.",
    body: "A market order prioritises speed over price: it takes whatever the order book offers right now, so it always fills but pays the taker fee and can slip on thin pairs. Use it on deep markets where the spread is tiny.",
    links: [{ label: "Order types explained", href: "/guides/crypto-order-types-explained" }, { label: "Trading fee calculator", href: "/tools/trading-fee-calculator" }],
  },
  {
    slug: "limit-order",
    term: "Limit order",
    category: "trading",
    short: "An order that fills only at your chosen price or better.",
    body: "A limit order rests on the book until the market reaches your price, giving you price control and usually the cheaper maker fee — at the cost of maybe never filling. It's the safe choice on thin altcoins where a market order would walk the book.",
    links: [{ label: "Order types explained", href: "/guides/crypto-order-types-explained" }],
  },
  {
    slug: "stop-loss",
    term: "Stop-loss",
    aliases: ["stop loss", "stop order"],
    category: "trading",
    short: "A trigger that sells once price falls to a set level, to cap a loss.",
    body: "A stop-loss is not an order on the book — it's a trigger that fires an order when price hits your stop. A plain stop-loss sends a market order (guaranteed exit, uncertain price); a stop-limit sends a limit order (capped price, but it may not fill in a fast drop).",
    links: [{ label: "Stop-loss / take-profit calculator", href: "/tools/stop-loss-take-profit-calculator" }, { label: "Risk/reward & stop-loss", href: "/guides/risk-reward-and-stop-loss" }],
  },
  {
    slug: "take-profit",
    term: "Take-profit",
    aliases: ["take profit", "tp"],
    category: "trading",
    short: "A trigger that closes a position once price reaches a profit target.",
    body: "The mirror image of a stop-loss: it banks a gain automatically instead of letting a winner round-trip back. Many traders scale out with a ladder of take-profits rather than one, selling portions at rising targets.",
    links: [{ label: "Take-profit ladder calculator", href: "/tools/take-profit-ladder-calculator" }],
  },
  {
    slug: "leverage",
    term: "Leverage",
    category: "trading",
    short: "Borrowed funds that multiply both your gains and your losses.",
    body: "Trading at 10× means a 10% move against you wipes out your margin and triggers liquidation. Leverage doesn't change a trade's expected value — it compresses the distance to being forced out, which is why most accounts that blow up used it.",
    links: [{ label: "Leverage explained", href: "/guides/understanding-crypto-leverage" }, { label: "Liquidation calculator", href: "/tools/liquidation-calculator" }],
  },
  {
    slug: "liquidation",
    term: "Liquidation",
    category: "trading",
    short: "The forced closure of a leveraged position when margin runs out.",
    body: "When a leveraged position moves far enough against you that your collateral can no longer cover the loss, the exchange closes it automatically at the liquidation price — usually with a fee. Knowing that price before you enter is the whole point of position sizing.",
    links: [{ label: "Liquidation price calculator", href: "/tools/liquidation-calculator" }, { label: "How liquidation price works", href: "/guides/how-to-calculate-liquidation-price" }],
  },
  {
    slug: "funding-rate",
    term: "Funding rate",
    category: "trading",
    short: "Periodic payments between longs and shorts that keep perpetual futures near spot.",
    body: "Perpetual futures have no expiry, so a funding rate is paid every few hours from one side to the other to tether the contract price to spot. Positive funding means longs pay shorts (a crowded-long market); it's a real, recurring cost of holding a position.",
    links: [{ label: "Funding rates explained", href: "/guides/perpetual-funding-rates-explained" }],
  },
  {
    slug: "dca",
    term: "Dollar-cost averaging (DCA)",
    aliases: ["dollar cost averaging", "dca"],
    category: "trading",
    short: "Buying a fixed amount on a schedule instead of timing the market.",
    body: "DCA spreads purchases over time so your average entry smooths out volatility and you never bet everything on one price. It trades the chance of a perfect entry for the discipline of never needing one.",
    links: [{ label: "DCA calculator", href: "/tools/dca-calculator" }, { label: "Dollar-cost averaging, explained", href: "/guides/dollar-cost-averaging-crypto" }, { label: "Live DCA strategy lab", href: "/dca" }],
  },
  {
    slug: "grid-trading",
    term: "Grid trading",
    category: "trading",
    short: "An automated strategy that buys dips and sells rallies across a price range.",
    body: "A grid bot places a ladder of buy and sell orders at set intervals, profiting from oscillation within a range. It prints in choppy, sideways markets and bleeds in a sustained trend — the risk lives in the open drawdown, not the win rate.",
    links: [{ label: "Grid trading explained", href: "/guides/grid-trading-explained" }, { label: "Grid calculator", href: "/tools/grid-calculator" }],
  },
  {
    slug: "maker-taker",
    term: "Maker vs taker fee",
    aliases: ["maker fee", "taker fee"],
    category: "trading",
    short: "The lower fee for adding liquidity (maker) vs the higher one for removing it (taker).",
    body: "You pay the maker fee when your limit order rests on the book and adds liquidity, and the taker fee when your order fills immediately and removes it. Over many trades the gap compounds, which is why a post-only flag exists.",
    links: [{ label: "Trading fees explained", href: "/guides/crypto-trading-fees-explained" }, { label: "Trading fee calculator", href: "/tools/trading-fee-calculator" }],
  },

  // ---- Metrics & analysis ----
  {
    slug: "roi",
    term: "ROI (return on investment)",
    aliases: ["return on investment", "roi"],
    category: "metrics",
    short: "Profit as a percentage of what you put in.",
    body: "ROI is profit divided by cost, expressed as a percent — the simplest way to compare outcomes of different sizes. It says nothing about time or risk taken, so a 50% ROI over a day and over five years are very different things.",
    links: [{ label: "Profit calculator", href: "/tools/profit-calculator" }],
  },
  {
    slug: "apr-apy",
    term: "APR vs APY",
    aliases: ["apr", "apy", "annual percentage yield"],
    category: "metrics",
    short: "Simple annual rate (APR) vs the compounded one (APY).",
    body: "APR is the flat yearly rate; APY folds in compounding, so it's higher the more often rewards are reinvested. Yield products quote whichever looks bigger, so always check which one you're being shown.",
    links: [{ label: "APR vs APY, explained", href: "/guides/apr-vs-apy-crypto" }, { label: "Compound interest calculator", href: "/tools/compound-interest-calculator" }],
  },
  {
    slug: "drawdown",
    term: "Drawdown",
    category: "metrics",
    short: "How far an asset or account has fallen from its peak.",
    body: "Maximum drawdown is the deepest peak-to-trough fall over a period — the single best measure of how much pain a strategy puts you through. Crypto's majors have spent much of their history more than 50% below their highs.",
    links: [{ label: "Crypto drawdown study", href: "/research/crypto-drawdowns" }, { label: "Max drawdown calculator", href: "/tools/max-drawdown-calculator" }],
  },
  {
    slug: "volatility",
    term: "Volatility",
    category: "metrics",
    short: "How sharply a price swings around its average.",
    body: "Higher volatility means bigger moves in both directions and a wider range of outcomes. It's the raw material of trading opportunity and of risk — the same number that makes a grid profitable can also deepen a drawdown.",
    links: [{ label: "Portfolio volatility calculator", href: "/tools/portfolio-volatility-calculator" }],
  },
  {
    slug: "sharpe-ratio",
    term: "Sharpe ratio",
    category: "metrics",
    short: "Return earned per unit of risk (volatility) taken.",
    body: "The Sharpe ratio divides excess return by volatility, so a higher number means you were paid more for the risk you carried. The Sortino ratio refines it by counting only downside volatility, which is what most people actually fear.",
    links: [{ label: "Understanding the Sharpe ratio", href: "/guides/understanding-sharpe-ratio" }, { label: "Sortino vs Sharpe", href: "/guides/sortino-vs-sharpe-ratio" }],
  },
  {
    slug: "win-rate",
    term: "Win rate",
    aliases: ["winrate"],
    category: "metrics",
    short: "The share of trades that closed in profit.",
    body: "Win rate alone is misleading: a strategy can win 90% of the time and still lose money if the losers are large. Read it alongside the average win/loss and the break-even win rate your risk/reward actually requires.",
    links: [{ label: "Win rate calculator", href: "/tools/win-rate-calculator" }],
  },
  {
    slug: "correlation",
    term: "Correlation",
    category: "metrics",
    short: "How closely two assets move together, from −1 to +1.",
    body: "A correlation near +1 means two coins rise and fall in lockstep, so holding both adds little diversification. Most large crypto assets are highly correlated to Bitcoin, which is why a portfolio of ten alts can still move as one.",
    links: [{ label: "Crypto correlation study", href: "/research/crypto-correlation" }, { label: "Correlation tool", href: "/portfolio/correlation" }],
  },

  // ---- Market & valuation ----
  {
    slug: "market-cap",
    term: "Market capitalisation",
    aliases: ["market cap", "marketcap"],
    category: "market",
    short: "The live price multiplied by the circulating supply.",
    body: "Market cap is the market's total valuation of a coin, and it's why a low per-coin price doesn't mean \"cheap\" — a $0.01 coin with a trillion in supply is larger than a $100 coin with a million. It's the right lens for comparing sizes, not the sticker price.",
    links: [{ label: "Market cap calculator", href: "/tools/market-cap-calculator" }, { label: "Market cap, explained", href: "/guides/crypto-market-cap-explained" }],
  },
  {
    slug: "fdv",
    term: "Fully diluted valuation (FDV)",
    aliases: ["fdv", "fully diluted valuation"],
    category: "market",
    short: "Market cap if every token that will ever exist were already circulating.",
    body: "FDV prices the entire maximum supply at today's price, including tokens still locked or unissued. A large gap between FDV and market cap is a warning: a lot of future supply is waiting to dilute holders.",
    links: [{ label: "Market cap calculator (incl. FDV)", href: "/tools/market-cap-calculator" }, { label: "Token unlocks & vesting", href: "/guides/token-unlocks-and-vesting" }],
  },
  {
    slug: "circulating-supply",
    term: "Circulating supply",
    category: "market",
    short: "The number of coins currently available and trading.",
    body: "Circulating supply excludes locked, reserved or unissued tokens, and it's the figure used to compute market cap. Watching how it grows — through mining, staking rewards or unlocks — tells you how much dilution is underway.",
    links: [{ label: "Token unlocks tracker", href: "/unlocks" }],
  },
  {
    slug: "halving",
    term: "Halving",
    category: "market",
    short: "The scheduled 50% cut in a coin's block reward, roughly every four years for Bitcoin.",
    body: "A halving cuts new issuance in half, so the flow of fresh supply drops and scarcity rises. It's the engine behind Bitcoin's four-year cycle narrative and the stock-to-flow model.",
    links: [{ label: "Bitcoin halving explained", href: "/guides/bitcoin-halving-explained" }, { label: "Halving countdown", href: "/tools/bitcoin-halving-countdown" }, { label: "Stock-to-flow model", href: "/bitcoin-stock-to-flow" }],
  },
  {
    slug: "stablecoin",
    term: "Stablecoin",
    category: "market",
    short: "A crypto token designed to hold a steady value, usually $1.",
    body: "Stablecoins like USDT and USDC aim to stay pegged to a fiat currency, acting as the cash leg of crypto trading and a refuge from volatility. The peg holds only as well as the reserves or mechanism behind it — not all are equally safe.",
    links: [{ label: "Stablecoins explained", href: "/guides/stablecoins-explained" }],
  },
  {
    slug: "fear-greed-index",
    term: "Fear & Greed Index",
    category: "market",
    short: "A 0–100 gauge of overall crypto market sentiment.",
    body: "Low readings mean Extreme Fear (the crowd is selling and may have oversold); high readings mean Extreme Greed (the market may be overheated). Most use it as a contrarian signal — it measures mood, not value.",
    links: [{ label: "Live Fear & Greed Index", href: "/fear-and-greed-index" }],
  },

  // ---- DeFi & earning ----
  {
    slug: "staking",
    term: "Staking",
    category: "defi",
    short: "Locking coins to help secure a proof-of-stake network in exchange for rewards.",
    body: "Staking earns a yield for committing your coins to validate transactions, but it can carry a lock-up and, for some assets, slashing risk. The headline APR is before the token's own inflation and any fees a provider takes.",
    links: [{ label: "What is staking", href: "/guides/what-is-crypto-staking" }, { label: "Staking rewards calculator", href: "/tools/staking-rewards-calculator" }],
  },
  {
    slug: "liquid-staking",
    term: "Liquid staking",
    category: "defi",
    short: "Staking that gives you a tradable token representing your staked position.",
    body: "Instead of locking coins away, liquid staking issues a derivative (like stETH) you can trade or use in DeFi while still earning staking rewards. It adds flexibility but also a layer of smart-contract and peg risk.",
    links: [{ label: "Liquid staking explained", href: "/guides/liquid-staking-explained" }],
  },
  {
    slug: "impermanent-loss",
    term: "Impermanent loss",
    category: "defi",
    short: "The loss a liquidity provider takes versus simply holding the two assets.",
    body: "When you supply a trading pair to a liquidity pool and the prices diverge, you end up with more of the falling asset and less of the rising one — worth less than if you'd just held. It only becomes permanent when you withdraw.",
    links: [{ label: "Impermanent loss explained", href: "/guides/understanding-impermanent-loss" }, { label: "Impermanent loss calculator", href: "/tools/impermanent-loss-calculator" }],
  },
  {
    slug: "airdrop",
    term: "Airdrop",
    category: "defi",
    short: "A free distribution of tokens to wallets, usually to reward early users.",
    body: "Projects airdrop tokens to decentralise ownership and reward genuine early activity. The valuable ones are retroactive — you qualify by really using a protocol before it has a token — and \"claim\" scams are the most common way people lose funds chasing them.",
    links: [{ label: "Crypto airdrops explained", href: "/guides/crypto-airdrops-explained" }, { label: "Airdrop value calculator", href: "/tools/crypto-airdrop-calculator" }],
  },

  // ---- Wallets & security ----
  {
    slug: "seed-phrase",
    term: "Seed phrase",
    aliases: ["recovery phrase", "mnemonic"],
    category: "wallets",
    short: "The 12–24 words that back up and fully control a wallet.",
    body: "The seed phrase is the wallet — anyone who has it can take the funds, and no one can help you if you lose it. Write it by hand, store it offline (ideally on metal), and never type it into a website or app that asks you to \"validate\" or \"restore\".",
    links: [{ label: "How to store a seed phrase", href: "/guides/how-to-store-a-seed-phrase" }, { label: "Wallet security guide", href: "/guides/crypto-wallet-security" }],
  },
  {
    slug: "cold-hot-wallet",
    term: "Cold vs hot wallet",
    aliases: ["cold wallet", "hot wallet", "hardware wallet"],
    category: "wallets",
    short: "Offline key storage (cold) vs an internet-connected app (hot).",
    body: "A hot wallet — a phone or browser app — is convenient for small, active balances but exposed if your device is compromised. A cold wallet keeps keys offline on a hardware device and is where savings belong.",
    links: [{ label: "Hot vs cold wallet", href: "/guides/hot-wallet-vs-cold-wallet" }, { label: "Best hardware wallets", href: "/guides/best-crypto-hardware-wallets" }],
  },
  {
    slug: "gas-fee",
    term: "Gas fee",
    category: "wallets",
    short: "The network fee paid to process an on-chain transaction.",
    body: "Gas pays the validators who include your transaction in a block, and it rises with network demand — on Ethereum a simple transfer can cost cents or dollars depending on congestion. It's separate from any exchange trading fee.",
    links: [{ label: "Gas fee calculator", href: "/tools/gas-fee-calculator" }],
  },
  {
    slug: "wallet-drainer",
    term: "Wallet drainer / approval scam",
    aliases: ["approval scam", "wallet drainer"],
    category: "wallets",
    short: "A malicious signature that authorises a contract to empty your wallet.",
    body: "Instead of stealing a password, drainers trick you into signing a token approval or transaction that lets an attacker move your assets later. It's the fastest-growing theft method — read what you sign, and revoke old approvals.",
    links: [{ label: "Wallet drainers & approval scams", href: "/guides/wallet-drainers-and-approval-scams" }, { label: "How to avoid crypto scams", href: "/guides/how-to-avoid-crypto-scams" }],
  },
];
