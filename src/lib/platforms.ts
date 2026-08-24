/**
 * ============================================================================
 * Partner / referral platforms — powers the /exchanges page.
 * ============================================================================
 * Each entry is ONE object. The page renders cards, jump-nav and JSON-LD from
 * this list alone, so growing the directory = add an object here.
 *
 * 💰 HOW TO MONETIZE (do this per platform once you have affiliate accounts):
 *   1. Sign up to each platform's affiliate/referral program.
 *   2. Replace `url` (currently the official homepage) with YOUR referral link.
 *   3. Update `bonus` to match your ACTUAL offer (keep it truthful — Google and
 *      the FTC require accurate affiliate claims).
 * Until then every card links to the official site, so the page is already
 * useful and indexable. Links render with rel="sponsored nofollow" + _blank.
 */

export type PlatformCategoryId = "exchange" | "wallet" | "tax" | "trading" | "earn";

export interface PlatformCategory {
  id: PlatformCategoryId;
  title: string;
  blurb: string;
  icon: string;
  order: number;
}

export interface Platform {
  slug: string;
  name: string;
  category: PlatformCategoryId;
  /** Emoji token (kept as text to avoid an icon/image dependency). */
  icon: string;
  /** One-line positioning. */
  tagline: string;
  /** Short chip: who it's best for. */
  bestFor: string;
  /** Factual 1–2 sentence description. */
  description: string;
  /** 3 concise, truthful selling points. */
  highlights: string[];
  /** Editable perk/bonus line — replace with your real referral offer. */
  bonus: string;
  /** Official homepage now; REPLACE with your referral link to earn. */
  url: string;
}

export const platformCategories: PlatformCategory[] = [
  { id: "exchange", title: "Crypto Exchanges", blurb: "Buy, sell and trade crypto — spot, futures and more.", icon: "🏦", order: 1 },
  { id: "wallet", title: "Wallets", blurb: "Self-custody your coins — hardware and software wallets.", icon: "🔐", order: 2 },
  { id: "tax", title: "Crypto Tax Software", blurb: "Auto-generate tax reports from your trading history.", icon: "🧾", order: 3 },
  { id: "trading", title: "Trading & Charting Tools", blurb: "Charts, analytics and automated trading bots.", icon: "📊", order: 4 },
  { id: "earn", title: "Earn, Borrow & Cards", blurb: "Earn yield, borrow against crypto and spend it.", icon: "💳", order: 5 },
];

export const platforms: Platform[] = [
  // ---- Exchanges -----------------------------------------------------------
  {
    slug: "binance",
    name: "Binance",
    category: "exchange",
    icon: "🟡",
    tagline: "The world's largest crypto exchange by volume",
    bestFor: "All-rounders",
    description:
      "Binance offers one of the deepest markets in crypto, with spot, futures, options, staking and a huge selection of coins under one account.",
    highlights: ["Very low trading fees", "Hundreds of trading pairs", "Spot, futures, earn & launchpad"],
    bonus: "Sign up & trade to earn USDC rewards",
    url: "https://www.binance.com/referral/earn-together/refer2earn-usdc/claim?hl=en&ref=GRO_28502_02FFT&utm_source=referral_entrance",
  },
  {
    slug: "bybit",
    name: "Bybit",
    category: "exchange",
    icon: "🟠",
    tagline: "Derivatives-first exchange loved by active traders",
    bestFor: "Futures traders",
    description:
      "Bybit is known for a fast, reliable derivatives engine and a clean trading interface, alongside spot markets and copy trading.",
    highlights: ["Deep perpetual-futures liquidity", "Copy trading", "Frequent trader promotions"],
    bonus: "Sign-up & deposit rewards via referral",
    url: "https://www.bybit.com/invite?ref=YKGOVN&medium=referral&utm_campaign=evergreen",
  },
  {
    slug: "okx",
    name: "OKX",
    category: "exchange",
    icon: "⚫",
    tagline: "Exchange plus a built-in Web3 wallet",
    bestFor: "DeFi + CeFi",
    description:
      "OKX combines a full-featured exchange with a self-custody Web3 wallet and DEX aggregator, bridging centralized and on-chain trading.",
    highlights: ["Spot, futures & options", "Integrated Web3 wallet", "DEX & DeFi access"],
    bonus: "Welcome rewards via referral",
    url: "https://okx.com/join/40057496",
  },
  {
    slug: "coinbase",
    name: "Coinbase",
    category: "exchange",
    icon: "🔵",
    tagline: "Beginner-friendly, US-listed exchange",
    bestFor: "Beginners",
    description:
      "Coinbase is a publicly-traded, heavily-regulated exchange with a simple interface, making it a common first stop for new investors.",
    highlights: ["Easy fiat on-ramp", "Strong regulatory standing", "Learn-and-earn rewards"],
    bonus: "Sign-up reward — add your referral offer",
    url: "https://www.coinbase.com",
  },
  {
    slug: "kraken",
    name: "Kraken",
    category: "exchange",
    icon: "🐙",
    tagline: "Long-standing exchange with a security focus",
    bestFor: "Security-minded",
    description:
      "Operating since 2011, Kraken is known for strong security, broad fiat support and a reputable spot and futures offering.",
    highlights: ["Excellent security record", "Wide fiat currency support", "Spot, margin & futures"],
    bonus: "Sign up & trade to unlock up to $200 in rewards",
    url: "https://invite.kraken.com/JDNW/t650w99b",
  },
  {
    slug: "kucoin",
    name: "KuCoin",
    category: "exchange",
    icon: "🟢",
    tagline: "Deep altcoin selection",
    bestFor: "Altcoin hunters",
    description:
      "KuCoin lists a very large range of small- and mid-cap tokens, making it popular with traders looking beyond the majors.",
    highlights: ["Huge altcoin listing", "Trading bots built in", "Spot & futures"],
    bonus: "Fee rebate for referrals — add your offer",
    url: "https://www.kucoin.com",
  },
  {
    slug: "bitget",
    name: "Bitget",
    category: "exchange",
    icon: "🔷",
    tagline: "Copy-trading and derivatives specialist",
    bestFor: "Copy trading",
    description:
      "Bitget is best known for its copy-trading marketplace, letting you mirror experienced traders alongside standard spot and futures markets.",
    highlights: ["Large copy-trading network", "Competitive futures fees", "Frequent bonuses"],
    bonus: "Welcome package — add your referral offer",
    url: "https://www.bitget.com",
  },
  {
    slug: "mexc",
    name: "MEXC",
    category: "exchange",
    icon: "🔵",
    tagline: "Early listings and a massive token catalog",
    bestFor: "New listings",
    description:
      "MEXC lists an enormous number of tokens, often earlier than larger exchanges, which appeals to traders chasing new projects.",
    highlights: ["Thousands of tokens", "Frequent early listings", "Low fees"],
    bonus: "Airdrop & bonus events — add your referral offer",
    url: "https://www.mexc.com",
  },
  {
    slug: "gate-io",
    name: "Gate.io",
    category: "exchange",
    icon: "🟣",
    tagline: "One of the widest asset selections in crypto",
    bestFor: "Rare assets",
    description:
      "Operating since 2013, Gate.io offers an extensive catalog of coins plus spot, margin, futures and a startup launchpad.",
    highlights: ["Very large asset list", "Long operating history", "Spot, margin & futures"],
    bonus: "Referral rewards — add your offer",
    url: "https://www.gate.io",
  },
  {
    slug: "crypto-com",
    name: "Crypto.com",
    category: "exchange",
    icon: "🔷",
    tagline: "App-first exchange with a broad ecosystem",
    bestFor: "Mobile users",
    description:
      "Crypto.com pairs an easy mobile app with a wider ecosystem including a Visa card, staking and its own chain.",
    highlights: ["Polished mobile app", "Crypto Visa card", "Earn & staking products"],
    bonus: "App sign-up bonus — add your referral offer",
    url: "https://crypto.com",
  },
  {
    slug: "gemini",
    name: "Gemini",
    category: "exchange",
    icon: "♊",
    tagline: "US-regulated exchange built around compliance",
    bestFor: "US investors",
    description:
      "Founded by the Winklevoss twins, Gemini emphasizes regulation, security and a straightforward interface for US customers.",
    highlights: ["Strong compliance focus", "Insurance on some assets", "Simple & advanced modes"],
    bonus: "New-user reward — add your referral offer",
    url: "https://www.gemini.com",
  },
  {
    slug: "htx",
    name: "HTX",
    category: "exchange",
    icon: "🔴",
    tagline: "Long-running global exchange (formerly Huobi)",
    bestFor: "Global traders",
    description:
      "HTX (formerly Huobi) is a veteran global exchange offering spot, derivatives and a large selection of listed assets.",
    highlights: ["Established since 2013", "Broad asset coverage", "Spot & derivatives"],
    bonus: "Sign-up rewards — add your referral offer",
    url: "https://www.htx.com",
  },
  {
    slug: "bitfinex",
    name: "Bitfinex",
    category: "exchange",
    icon: "🟩",
    tagline: "Advanced trading and deep liquidity",
    bestFor: "Pro traders",
    description:
      "Bitfinex targets advanced traders with sophisticated order types, margin trading and a peer-to-peer funding market.",
    highlights: ["Advanced order types", "Margin & P2P funding", "Deep liquidity on majors"],
    bonus: "Fee discount for referrals — add your offer",
    url: "https://www.bitfinex.com",
  },

  // ---- Wallets -------------------------------------------------------------
  {
    slug: "ledger",
    name: "Ledger",
    category: "wallet",
    icon: "🔒",
    tagline: "Market-leading hardware wallet",
    bestFor: "Cold storage",
    description:
      "Ledger hardware wallets keep your private keys offline on a secure-element chip, managed through the Ledger Live app.",
    highlights: ["Secure-element chip", "Supports thousands of assets", "Ledger Live companion app"],
    bonus: "Occasional device discounts — add your affiliate link",
    url: "https://www.ledger.com",
  },
  {
    slug: "trezor",
    name: "Trezor",
    category: "wallet",
    icon: "🛡️",
    tagline: "Open-source hardware wallet pioneer",
    bestFor: "Open-source fans",
    description:
      "Trezor built the first hardware wallet and remains fully open-source, appealing to users who value transparency and auditability.",
    highlights: ["Fully open-source firmware", "Long security track record", "Simple recovery flow"],
    bonus: "Store discounts — add your affiliate link",
    url: "https://trezor.io",
  },
  {
    slug: "tangem",
    name: "Tangem",
    category: "wallet",
    icon: "💳",
    tagline: "Tap-to-use NFC card wallet",
    bestFor: "Simplicity",
    description:
      "Tangem is a card-shaped hardware wallet you tap to your phone over NFC — no cables, no battery, backed by a secure chip.",
    highlights: ["Card form factor", "No cables or charging", "Backup card sets"],
    bonus: "Referral discount — add your affiliate link",
    url: "https://tangem.com",
  },
  {
    slug: "safepal",
    name: "SafePal",
    category: "wallet",
    icon: "🟦",
    tagline: "Hardware + software wallet combo",
    bestFor: "Budget cold storage",
    description:
      "SafePal offers an affordable hardware wallet that pairs with a mobile app supporting swaps and dApp access across many chains.",
    highlights: ["Affordable hardware", "App with in-wallet swaps", "Multi-chain support"],
    bonus: "Referral rewards — add your affiliate link",
    url: "https://www.safepal.com",
  },
  {
    slug: "metamask",
    name: "MetaMask",
    category: "wallet",
    icon: "🦊",
    tagline: "The default Ethereum & EVM wallet",
    bestFor: "DeFi & dApps",
    description:
      "MetaMask is the most widely-used browser and mobile wallet for Ethereum and EVM chains, connecting you to DeFi, NFTs and dApps.",
    highlights: ["Works across EVM chains", "Browser & mobile", "In-wallet swaps & bridges"],
    bonus: "Free, self-custody wallet",
    url: "https://metamask.io",
  },
  {
    slug: "trust-wallet",
    name: "Trust Wallet",
    category: "wallet",
    icon: "🛡️",
    tagline: "Popular multi-chain mobile wallet",
    bestFor: "Mobile self-custody",
    description:
      "Trust Wallet is a mobile-first, multi-chain wallet supporting a huge range of coins, tokens, NFTs and dApp browsing.",
    highlights: ["Supports many blockchains", "Built-in dApp browser", "NFT support"],
    bonus: "Free, self-custody wallet",
    url: "https://trustwallet.com",
  },
  {
    slug: "exodus",
    name: "Exodus",
    category: "wallet",
    icon: "🪐",
    tagline: "Polished desktop & mobile wallet",
    bestFor: "Desktop users",
    description:
      "Exodus is a design-focused software wallet for desktop and mobile with a built-in exchange and portfolio tracking.",
    highlights: ["Clean desktop app", "Built-in swaps", "Hardware-wallet pairing"],
    bonus: "Free, self-custody wallet",
    url: "https://www.exodus.com",
  },
  {
    slug: "phantom",
    name: "Phantom",
    category: "wallet",
    icon: "👻",
    tagline: "Leading Solana & multi-chain wallet",
    bestFor: "Solana users",
    description:
      "Phantom started as the go-to Solana wallet and now supports multiple chains, with a slick interface for swaps, staking and NFTs.",
    highlights: ["Great Solana experience", "Multi-chain support", "Staking & NFTs built in"],
    bonus: "Free, self-custody wallet",
    url: "https://phantom.app",
  },

  // ---- Tax -----------------------------------------------------------------
  {
    slug: "koinly",
    name: "Koinly",
    category: "tax",
    icon: "🧮",
    tagline: "Crypto tax reports in a few clicks",
    bestFor: "Most people",
    description:
      "Koinly connects to your exchanges and wallets, reconciles your history and generates country-specific tax reports.",
    highlights: ["Syncs 700+ integrations", "Country-specific reports", "Free portfolio tracking tier"],
    bonus: "Save on your first Koinly tax report",
    url: "https://koinly.io/?via=5733C88D&utm_source=friend",
  },
  {
    slug: "coinledger",
    name: "CoinLedger",
    category: "tax",
    icon: "📒",
    tagline: "Simple crypto tax & portfolio tool",
    bestFor: "US filers",
    description:
      "CoinLedger imports your transactions and produces tax forms that plug into popular filing software like TurboTax.",
    highlights: ["TurboTax export", "Portfolio tracking", "DeFi & NFT support"],
    bonus: "Referral discount — add your affiliate link",
    url: "https://coinledger.io",
  },
  {
    slug: "cointracker",
    name: "CoinTracker",
    category: "tax",
    icon: "📈",
    tagline: "Portfolio tracking plus tax",
    bestFor: "Portfolio + tax",
    description:
      "CoinTracker combines real-time portfolio tracking with tax reporting and integrates with a wide range of exchanges and wallets.",
    highlights: ["Live portfolio tracking", "Broad integrations", "Mobile app"],
    bonus: "Referral discount — add your affiliate link",
    url: "https://www.cointracker.io",
  },
  {
    slug: "tokentax",
    name: "TokenTax",
    category: "tax",
    icon: "🧾",
    tagline: "Tax software with full-service option",
    bestFor: "Complex taxes",
    description:
      "TokenTax offers crypto tax software plus optional accountant support, useful for traders with complex DeFi or high-volume histories.",
    highlights: ["Handles complex DeFi", "Optional accountant help", "Every major exchange"],
    bonus: "Referral discount — add your affiliate link",
    url: "https://tokentax.co",
  },

  // ---- Trading & charting --------------------------------------------------
  {
    slug: "tradingview",
    name: "TradingView",
    category: "trading",
    icon: "📊",
    tagline: "The standard for charting & analysis",
    bestFor: "Charting",
    description:
      "TradingView is the most widely-used charting platform, with advanced indicators, drawing tools, alerts and a large community of ideas.",
    highlights: ["Powerful charts & indicators", "Price alerts", "Huge community scripts"],
    bonus: "Plan discount for referrals — add your affiliate link",
    url: "https://www.tradingview.com",
  },
  {
    slug: "3commas",
    name: "3Commas",
    category: "trading",
    icon: "🤖",
    tagline: "Automated trading bots & terminal",
    bestFor: "Automation",
    description:
      "3Commas connects to your exchange accounts to run DCA, grid and signal bots plus a smart trading terminal — without holding your funds.",
    highlights: ["DCA, grid & signal bots", "Multi-exchange terminal", "Paper trading"],
    bonus: "Trial or discount — add your affiliate link",
    url: "https://3commas.io",
  },
  {
    slug: "cryptohopper",
    name: "Cryptohopper",
    category: "trading",
    icon: "🐸",
    tagline: "Cloud-based automated trading bots",
    bestFor: "Set-and-forget bots",
    description:
      "Cryptohopper runs automated strategies in the cloud, including a marketplace of templates and copy-bot strategies.",
    highlights: ["Cloud bots (always on)", "Strategy marketplace", "Backtesting"],
    bonus: "Free trial — add your affiliate link",
    url: "https://www.cryptohopper.com",
  },

  // ---- Earn / borrow / cards ----------------------------------------------
  {
    slug: "nexo",
    name: "Nexo",
    category: "earn",
    icon: "💠",
    tagline: "Earn yield, borrow and spend crypto",
    bestFor: "Earn & borrow",
    description:
      "Nexo lets you earn interest on crypto and stablecoins, borrow against your holdings and spend via a crypto-backed card.",
    highlights: ["Interest on idle crypto", "Instant crypto-backed loans", "Crypto card"],
    bonus: "Sign-up bonus — add your referral offer",
    url: "https://nexo.com",
  },
];

// --- Query helpers ----------------------------------------------------------

export const sortedPlatformCategories = [...platformCategories].sort((a, b) => a.order - b.order);

export function platformsByCategory(id: PlatformCategoryId): Platform[] {
  return platforms.filter((p) => p.category === id);
}
