/**
 * ============================================================================
 * Structured facts used by the /compare pages.
 * ============================================================================
 * Kept OUT of platforms.ts on purpose: that file is the affiliate registry and
 * its job is links and copy. This one is a table of checkable claims about
 * other companies, which is a different thing to maintain and a different
 * thing to be wrong about.
 *
 * WHY THERE ARE NO FEE NUMBERS HERE — this is the central decision of the
 * whole feature, so it is written down rather than left to be rediscovered.
 *
 * A "Binance vs Bybit" page obviously wants a fee table. We do not publish
 * one, because we cannot keep thirteen exchanges' fee schedules current and a
 * stale fee on an affiliate page is worse than no fee at all: it is an
 * inaccurate commercial claim about somebody else's business, sitting next to
 * a link we would earn from. Checking this in August 2026 found Kraken had
 * rebuilt its tier system the month before — exactly the kind of change that
 * would have quietly falsified a hardcoded table.
 *
 * So every platform carries `feesUrl`, a link to its OWN live fee page, and
 * the comparison is built on facts that actually stay put for years: who can
 * open an account, who holds the keys, what the thing does, and what its
 * documented history is. Where a fee matters, the page sends the reader to the
 * source and then to our own fee calculator to work out their real cost.
 *
 * Everything below was checked on the date in `CHECKED_ON`. The US column is
 * the one most likely to age — regulators move — so it is phrased as the
 * platform's own stated position, and every page tells the reader to confirm.
 */

export const CHECKED_ON = "2026-08-05";

export interface PlatformCompare {
  /** Year the platform launched. */
  founded: string;
  /** Where the operating entity is based or registered. */
  base: string;
  /** Who controls the assets or keys. */
  custody: string;
  /** Identity verification position. */
  kyc: string;
  /** Availability to US residents, as the platform itself states it. */
  us: string;
  /** What it actually does — rendered under a category-appropriate heading. */
  products: string[];
  /** The platform's own live pricing page. We link rather than quote. */
  feesUrl: string;
  /** One honest reason to pick this one. */
  standout: string;
  /**
   * One honest reason to hesitate. Required for every entry — a comparison
   * where nothing has a downside is an advertisement, and the reader can tell.
   */
  watchOut: string;
}

export const compareData: Record<string, PlatformCompare> = {
  /* ---- Exchanges --------------------------------------------------------- */

  binance: {
    founded: "2017",
    base: "No single headquarters; regional entities, with a licensed presence in Dubai and France",
    custody: "Custodial — Binance holds the keys",
    kyc: "Required for withdrawals and most features",
    us: "Not available. US residents are redirected to Binance.US, a separate company that does not operate in every state",
    products: ["Spot", "Futures", "Margin", "Options", "Earn", "Launchpad", "Card (region-dependent)"],
    feesUrl: "https://www.binance.com/en/fee/schedule",
    standout: "The deepest order books in the industry — on major pairs the slippage on a large order is smaller here than anywhere else, which for size matters more than the headline fee.",
    watchOut: "Pleaded guilty to US anti-money-laundering charges in November 2023 and paid a multi-billion-dollar settlement, with a compliance monitor imposed. The scale is a double-edged thing: enormous liquidity, and a company regulators watch closely.",
  },
  coinbase: {
    founded: "2012",
    base: "United States — publicly listed on Nasdaq",
    custody: "Custodial, with a separate self-custody wallet app",
    kyc: "Required, always",
    us: "Yes — this is its home market, and it is the most straightforward option for US residents",
    products: ["Spot", "Advanced Trade", "Futures (US)", "Staking", "Custody", "Card"],
    feesUrl: "https://www.coinbase.com/legal/user_agreement/fees",
    standout: "A US public company filing audited accounts every quarter. For anyone whose first question is counterparty risk rather than cost, nothing else on this list answers it as directly.",
    watchOut: "The simple buy/sell interface is materially more expensive than Advanced Trade for the same trade. People pay several times what they need to for years without noticing the two are different products.",
  },
  bybit: {
    founded: "2018",
    base: "Dubai, with a UAE licence",
    custody: "Custodial",
    kyc: "Required for most features",
    us: "No — Bybit lists the United States among excluded jurisdictions",
    products: ["Spot", "Perpetuals", "Futures", "Options", "Copy trading", "Earn", "Card (region-dependent)"],
    feesUrl: "https://www.bybit.com/en/help-center/article/Trading-Fee-Structure",
    standout: "Derivatives are its centre of gravity rather than an add-on, and the trading interface reflects that — it is built for someone managing positions, not someone making a first purchase.",
    watchOut: "Suffered a very large hot-wallet theft in February 2025 and covered customer losses, which is the outcome you want but not an event you want. Treat any exchange balance as a trading float, not storage.",
  },
  okx: {
    founded: "2017",
    base: "Seychelles-registered, operating from Asia and the Middle East",
    custody: "Custodial, plus a separate self-custody Web3 wallet",
    kyc: "Required for most features",
    us: "The global platform blocks US residents; a separate, smaller OKX US entity operates instead",
    products: ["Spot", "Perpetuals", "Futures", "Options", "Earn", "Web3 wallet", "DEX aggregator"],
    feesUrl: "https://www.okx.com/fees",
    standout: "The most complete bridge between a centralised exchange and on-chain activity — the Web3 wallet and DEX aggregator are properly built, not a token gesture.",
    watchOut: "The breadth is the problem for a beginner: the interface assumes you already know the difference between the products it offers, and it is easy to end up in a leveraged one by accident.",
  },
  kraken: {
    founded: "2011",
    base: "United States",
    custody: "Custodial",
    kyc: "Required",
    us: "Yes, with some products limited by state",
    products: ["Spot", "Kraken Pro", "Futures", "Margin", "Staking (region-dependent)", "OTC"],
    feesUrl: "https://www.kraken.com/features/fee-schedule",
    standout: "One of the oldest exchanges still running, with a long record of publishing proof-of-reserves attestations and a security posture it has held through cycles that removed most of its contemporaries.",
    watchOut: "Rebuilt its fee tiers in July 2026 so that spot and futures tiers are no longer calculated separately — if you last checked before that, your assumed rate is wrong. Check the schedule.",
  },
  kucoin: {
    founded: "2017",
    base: "Seychelles-registered",
    custody: "Custodial",
    kyc: "Required",
    us: "No. After a January 2025 guilty plea and roughly $297m in US penalties, a 2026 consent order bars its operator from serving US residents",
    products: ["Spot", "Futures", "Margin", "Earn", "Trading bots", "Launchpad"],
    feesUrl: "https://www.kucoin.com/vip/level",
    standout: "Lists small-cap tokens far earlier than the large exchanges, which is the entire reason most people open an account there.",
    watchOut: "That early-listing catalogue is also its risk: thin books, wide spreads and tokens that can become untradeable. And its US position is the result of enforcement, not a business choice.",
  },
  bitget: {
    founded: "2018",
    base: "Seychelles-registered",
    custody: "Custodial",
    kyc: "Required for most features",
    us: "No — US residents are excluded",
    products: ["Spot", "Perpetuals", "Copy trading", "Earn", "Web3 wallet", "Launchpad"],
    feesUrl: "https://www.bitget.com/fee",
    standout: "Copy trading is its strongest product rather than a bolt-on, with a large enough pool of traders for the leaderboard to mean something.",
    watchOut: "Copy trading flatters itself: leaderboards show survivors, and a trader with a spectacular three months is usually taking risk you would not accept if it were described to you plainly.",
  },
  mexc: {
    founded: "2018",
    base: "Seychelles-registered",
    custody: "Custodial",
    kyc: "Not required for basic use, with limits — required to raise them",
    us: "No — MEXC stopped serving US customers in 2023",
    products: ["Spot", "Futures", "Earn", "Launchpad"],
    feesUrl: "https://www.mexc.com/fee",
    standout: "One of the widest listing catalogues anywhere, and among the last large exchanges where a small account can trade without full verification.",
    watchOut: "The long tail of listings includes tokens with almost no liquidity. A position that looks fine on the chart can be impossible to exit at anything near that price.",
  },
  "gate-io": {
    founded: "2013",
    base: "Registered in the Cayman Islands, operating internationally",
    custody: "Custodial",
    kyc: "Required for most features",
    us: "No — US residents are excluded",
    products: ["Spot", "Futures", "Margin", "Earn", "Startup sales", "Copy trading"],
    feesUrl: "https://www.gate.com/fee",
    standout: "Has published proof-of-reserves attestations for longer than most of its peers, and its listing catalogue rivals MEXC's.",
    watchOut: "The interface carries a decade of accumulated features and is genuinely hard to navigate. Expect to spend time finding things that are one click away elsewhere.",
  },
  gemini: {
    founded: "2014",
    base: "United States — a New York trust company",
    custody: "Custodial",
    kyc: "Required",
    us: "Yes, including New York, which several competitors cannot serve",
    products: ["Spot", "ActiveTrader", "Staking", "Custody", "Card"],
    feesUrl: "https://www.gemini.com/fees",
    standout: "Regulated as a New York trust company, which is a genuinely higher bar than a money-transmitter licence and the reason it can operate where others cannot.",
    watchOut: "Its Earn programme froze customer funds in the 2022 Genesis collapse and took years to resolve. That product is gone, but it is the right thing to know about the company's history.",
  },
  "crypto-com": {
    founded: "2016",
    base: "Singapore",
    custody: "Custodial, plus a separate self-custody wallet",
    kyc: "Required",
    us: "Yes, with product availability varying by state",
    products: ["Spot", "Derivatives (region-dependent)", "Earn", "Card", "NFT", "Web3 wallet"],
    feesUrl: "https://crypto.com/exchange/document/fees-limits",
    standout: "The card and app are the most polished consumer product of anything here — if the goal is spending crypto rather than trading it, this is the one built for that.",
    watchOut: "Card cashback tiers require staking CRO, so the reward is paid for with exposure to a token whose supply history includes a 70-billion burn that governance later reversed. Price that in.",
  },

  /* ---- Wallets ----------------------------------------------------------- */

  ledger: {
    founded: "2014",
    base: "France",
    custody: "Self-custody — you hold the keys",
    kyc: "None",
    us: "Yes — sold worldwide",
    products: ["Bluetooth and USB models", "Ledger Live app", "Thousands of assets", "Staking through the app"],
    feesUrl: "https://shop.ledger.com/",
    standout: "The widest asset and app support of any hardware wallet, and the only one many chains integrate with directly.",
    watchOut: "Its firmware is not open source, and the 2023 Recover announcement — a key-sharding service — showed the device could be updated to do things owners had assumed impossible. A 2020 breach of its marketing database also exposed customer addresses, and those people are still being phished.",
  },
  trezor: {
    founded: "2013",
    base: "Czech Republic",
    custody: "Self-custody — you hold the keys",
    kyc: "None",
    us: "Yes — sold worldwide",
    products: ["USB models", "Trezor Suite app", "Open-source firmware", "Shamir backup on some models"],
    feesUrl: "https://trezor.io/",
    standout: "Fully open-source firmware and hardware design — the only way anyone outside the company can actually verify what the device does.",
    watchOut: "Openness has a cost: some models are vulnerable to physical extraction if an attacker gets the device, which is exactly what a passphrase exists to defend against. Supports fewer assets than Ledger.",
  },
  tangem: {
    founded: "2017",
    base: "Switzerland",
    custody: "Self-custody — you hold the keys",
    kyc: "None",
    us: "Yes — sold worldwide",
    products: ["NFC cards, no battery or cable", "Phone app", "Optional seedless setup across 2–3 cards"],
    feesUrl: "https://tangem.com/en/pricing/",
    standout: "A card you tap against a phone, with nothing to charge and no screen to fail. For someone who would otherwise leave coins on an exchange because a hardware wallet feels like work, this is the one they will actually use.",
    watchOut: "No screen means you verify transactions on your phone, so a compromised phone is a real risk. The seedless mode is elegant but means losing all your cards is unrecoverable — there is no phrase to write down.",
  },
  safepal: {
    founded: "2018",
    base: "Singapore, Binance-backed",
    custody: "Self-custody — you hold the keys",
    kyc: "None for the wallet",
    us: "Yes — sold worldwide",
    products: ["Air-gapped hardware wallet", "Software wallet", "QR-code signing", "In-app swaps"],
    feesUrl: "https://safepal.com/",
    standout: "Air-gapped signing by QR code — the device never connects to anything, which removes an entire class of attack. Also the cheapest credible hardware wallet here.",
    watchOut: "Binance-backed, which matters if your reason for self-custody is independence from exchanges. Smaller security-research community than Ledger or Trezor.",
  },
  metamask: {
    founded: "2016",
    base: "United States (Consensys)",
    custody: "Self-custody — keys stay in your browser or phone",
    kyc: "None for the wallet itself",
    us: "Yes",
    products: ["Ethereum and EVM chains", "Browser extension and mobile", "Hardware wallet pairing", "Built-in swaps and bridge"],
    feesUrl: "https://support.metamask.io/",
    standout: "The default doorway to Ethereum. Practically every EVM application supports it first, so it is the wallet that never turns out to be unsupported.",
    watchOut: "Built-in swaps charge a service fee on top of the DEX's own, so routing through an aggregator directly is usually cheaper. And a browser wallet is only as safe as the browser: approval scams and drainers target MetaMask users more than anyone.",
  },
  "trust-wallet": {
    founded: "2017",
    base: "Owned by Binance since 2018",
    custody: "Self-custody — keys stay on your device",
    kyc: "None for the wallet",
    us: "Yes",
    products: ["Many chains, not just EVM", "Mobile-first, plus extension", "In-app staking", "dApp browser"],
    feesUrl: "https://trustwallet.com/",
    standout: "Covers far more chains than MetaMask, including non-EVM ones, so it is often the only wallet holding an entire mixed portfolio.",
    watchOut: "Binance-owned, and the mobile-first design means the browser extension is the weaker half. Broad chain support also means broad exposure to scam tokens appearing in your balance.",
  },
  phantom: {
    founded: "2021",
    base: "United States",
    custody: "Self-custody — keys stay on your device",
    kyc: "None",
    us: "Yes",
    products: ["Solana, Ethereum, Bitcoin, Polygon", "Extension and mobile", "Built-in swaps and staking", "Scam-token filtering"],
    feesUrl: "https://phantom.com/",
    standout: "The best-designed wallet on this list, and unusually good at hiding the spam tokens that make a Solana wallet unusable otherwise.",
    watchOut: "Still Solana-first despite adding chains — for anything deep in the Ethereum ecosystem, MetaMask remains better supported. Swaps carry a service fee.",
  },
  exodus: {
    founded: "2015",
    base: "United States — publicly traded",
    custody: "Self-custody — keys stay on your device",
    kyc: "None for the wallet",
    us: "Yes",
    products: ["Desktop, mobile and extension", "Many chains", "Built-in exchange", "Trezor pairing"],
    feesUrl: "https://www.exodus.com/",
    standout: "The most approachable desktop wallet, and one of the few self-custody wallets from a company that files public accounts.",
    watchOut: "The built-in exchange is a third-party swap with a spread baked into the quoted rate, so the price you see is not the market price. Closed source.",
  },

  /* ---- Tax software ------------------------------------------------------ */

  koinly: {
    founded: "2018",
    base: "United Kingdom",
    custody: "Not applicable — read-only imports",
    kyc: "None",
    us: "Yes, plus around 20 other countries",
    products: ["Many exchange and wallet integrations", "Country-specific reports", "Free preview before paying", "DeFi and NFT support"],
    feesUrl: "https://koinly.io/pricing/",
    standout: "The widest country coverage, and you can import everything and see your gain before paying — you only pay to export the report.",
    watchOut: "Pricing is per tax year and rises steeply with transaction count. A busy DeFi year can cost more than an accountant would charge to check it.",
  },
  coinledger: {
    founded: "2018",
    base: "United States",
    custody: "Not applicable — read-only imports",
    kyc: "None",
    us: "Yes — strongest in the US",
    products: ["TurboTax and TaxAct export", "US-focused forms", "NFT support", "Accountant sharing"],
    feesUrl: "https://coinledger.io/pricing",
    standout: "The smoothest hand-off into US consumer tax software — if your return ends up in TurboTax, this removes the most friction.",
    watchOut: "Much less useful outside the US than Koinly, and DeFi coverage is thinner. Pricing is also per tax year.",
  },
  cointracker: {
    founded: "2017",
    base: "United States",
    custody: "Not applicable — read-only imports",
    kyc: "None",
    us: "Yes, plus several other countries",
    products: ["Portfolio tracking plus tax", "TurboTax integration", "Coinbase partnership", "Mobile app"],
    feesUrl: "https://www.cointracker.io/pricing",
    standout: "Doubles as a year-round portfolio tracker rather than something you open once in April, and its Coinbase integration is the tightest of any of these.",
    watchOut: "The portfolio side pushes you toward a subscription rather than a one-off tax year. Historically the most expensive of the four at high transaction counts.",
  },
  tokentax: {
    founded: "2017",
    base: "United States",
    custody: "Not applicable — read-only imports",
    kyc: "None",
    us: "Yes, with an in-house accounting service",
    products: ["Software plus full-service filing", "Complex DeFi and margin", "Audit assistance", "Multiple accounting methods"],
    feesUrl: "https://tokentax.co/pricing",
    standout: "The only one here that will do the work for you — an actual accounting firm sits behind the software, which is the right answer for a genuinely messy history.",
    watchOut: "By far the most expensive, and the cheapest plan supports very few exchanges. Overkill for anyone with a handful of trades on one exchange.",
  },

  /* ---- Trading tools ----------------------------------------------------- */

  "3commas": {
    founded: "2017",
    base: "Estonia",
    custody: "Not applicable — connects by API key",
    kyc: "None",
    us: "Yes",
    products: ["DCA and grid bots", "Smart trading terminal", "Copy trading", "Portfolio tracking"],
    feesUrl: "https://3commas.io/pricing",
    standout: "The most mature bot platform, and the DCA bot's safety-order logic is the pattern most competitors copied.",
    watchOut: "Disclosed an API key incident in 2022 in which keys were used to trade on affected accounts. If you connect any bot platform, create keys without withdrawal permission and IP-restrict them.",
  },
  cryptohopper: {
    founded: "2017",
    base: "Netherlands",
    custody: "Not applicable — connects by API key",
    kyc: "None",
    us: "Yes",
    products: ["Cloud-hosted bots", "Strategy marketplace", "Backtesting", "Paper trading"],
    feesUrl: "https://www.cryptohopper.com/pricing",
    standout: "Runs in the cloud, so nothing depends on your machine staying awake, and it has real backtesting and paper trading before you risk anything.",
    watchOut: "The strategy marketplace is where people lose money: a strategy that backtests beautifully is usually fitted to the past. Treat every purchased template as unproven.",
  },
};
