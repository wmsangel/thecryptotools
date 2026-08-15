import { compareData } from "./data";
import { platforms } from "@/lib/platforms";

/**
 * ============================================================================
 * The comparisons we publish.
 * ============================================================================
 * A CURATED list, not every combination. Thirteen exchanges alone would make
 * 78 pairs, and most of them are questions nobody asks — "Gemini vs MEXC" is
 * two sentences of substance stretched over a page. The site's own Search
 * Console history is the argument against generating them: it spent months
 * with 68 pages unindexed, and the cure was not more pages.
 *
 * Every pair here is one where the two things are genuinely substitutes and
 * someone is actually choosing between them.
 *
 * Each carries a verdict split in two — who should pick each side — because a
 * comparison that ends in "it depends on your needs" has wasted the reader's
 * time. Where one option is simply better for most people, the verdict says so
 * even when both are affiliate links.
 */

export interface ComparePair {
  a: string;
  b: string;
  /** Why these two get compared at all. */
  intro: string;
  /** The case for A, stated plainly. */
  pickA: string;
  /** The case for B, stated plainly. */
  pickB: string;
  /**
   * Questions specific to THIS pair.
   *
   * Added 2026-08-11 because the compare pages were the shortest on the site —
   * 412 words of main content against 536 for a guide — and shortness, not
   * duplication, is what made two of them look like copies to Google. There is
   * no computed shortcut here the way there is for the coin pages: every
   * platform field was already being rendered, so the only honest way to add
   * substance was to write it.
   *
   * Ground rules these answers follow: no fee figures (they go stale, which is
   * why this whole feature has no fee table), no availability claim that is not
   * already verified in `data.ts`, and every answer has to add something the
   * side-by-side table does not already say.
   */
  faq?: { q: string; a: string }[];
}

export const comparePairs: ComparePair[] = [
  /* ---- Exchanges --------------------------------------------------------- */
  {
    a: "binance", b: "coinbase",
    intro: "The biggest exchange in the world against the most regulated one. This is really a question about what you are optimising for: cost and depth, or the ability to explain your counterparty to a compliance officer.",
    pickA: "You are outside the US, trade often enough for fees and slippage to matter, and want the full derivatives and earn catalogue in one account.",
    pickB: "You are in the US, or you want a publicly listed counterparty filing audited accounts. Use Advanced Trade rather than the simple buy button and the cost gap narrows sharply.",
    faq: [
      { q: "Can I use Binance if I live in the United States?", a: "Not the global site. Binance.com does not serve US residents; they are directed to Binance.US, which is a separate company with a smaller asset list and no presence in every state. Coinbase is the straightforward answer if you are filing a US tax return, and it will also hand you cleaner records at the end of the year." },
      { q: "Is Coinbase safer than Binance?", a: "They are safe in different senses. Coinbase is publicly listed and files audited accounts, so its finances are inspectable in a way Binance's are not. Binance pleaded guilty to US anti-money-laundering charges in 2023 and operates under a compliance monitor. Neither fact protects your coins from a hack \u2014 only self-custody does that." },
      { q: "Is it worth keeping accounts on both?", a: "For many people, yes. Coinbase for the fiat on-ramp and the paper trail, Binance for depth and product range if you are outside the US. Two accounts cost nothing to hold, and having a second venue matters on the day the first one has an outage or freezes withdrawals." },
    ],
  },
  {
    a: "binance", b: "bybit",
    intro: "Both are large offshore exchanges closed to US residents, and both do spot and derivatives. The difference is what each was built around.",
    pickA: "You want the deepest spot books and the widest product range, and you value liquidity above interface.",
    pickB: "Derivatives are your main activity. The trading interface assumes you are managing positions rather than making a first purchase, and it shows.",
    faq: [
      { q: "Which has better liquidity for large orders?", a: "Binance, and not by a small margin \u2014 on major pairs its order books are the deepest available anywhere, which means less slippage on size. That difference matters more than any headline fee once your order is big enough to move the book, and it is the main structural reason traders stay there." },
      { q: "Can Americans use either of these?", a: "No. Binance's global site excludes US residents and points them to the separate Binance.US entity; Bybit excludes the United States, Canada and Singapore outright. If you are in any of those, neither of these is your answer \u2014 look at the US-available exchanges instead." },
      { q: "Does Bybit's 2025 hot-wallet theft mean it is unsafe?", a: "It means the risk is demonstrated rather than theoretical. Bybit covered customer balances, which is the outcome you want, but the episode is exactly why the amount you leave on any exchange should be the amount you are actively trading \u2014 not your holdings." },
    ],
  },
  {
    a: "binance", b: "kraken",
    intro: "Scale against longevity. Kraken has been running since 2011 and has never lost customer funds; Binance is several times larger and settled US criminal charges in 2023.",
    pickA: "You need depth on pairs beyond the majors, or products Kraken does not offer in your region.",
    pickB: "You are in the US, or counterparty history is the thing you weigh most. Check the fee schedule first — Kraken rebuilt its tiers in July 2026.",
    faq: [
      { q: "Which one should I use if I am in the US?", a: "Kraken. Binance's global platform does not serve US residents at all, and Binance.US is a different company with a narrower offering. Kraken has operated in the US for over a decade and is the more conventional choice for someone who wants a long-established venue with a US footprint." },
      { q: "Is Kraken's smaller asset list a problem?", a: "It depends entirely on what you buy. Kraken lists fewer assets because it screens them, which is a feature if you mostly trade majors and a limitation if you are chasing new listings. Binance will almost always have the token first; whether being first is an advantage is a separate question." },
      { q: "Do I lose anything by choosing the more regulated venue?", a: "Usually product range rather than safety. Heavily regulated exchanges tend to offer fewer derivatives, fewer earn products and fewer exotic listings, because each of those is a separate regulatory problem. If you were never going to use them, you are giving up nothing." },
    ],
  },
  {
    a: "binance", b: "okx",
    intro: "The two most complete exchange platforms, both closed to US residents on their global sites. They overlap almost entirely on paper, so the decision comes down to on-chain ambitions.",
    pickA: "You mostly stay on the exchange, and want the deepest books and the largest earn catalogue.",
    pickB: "You move between centralised and on-chain regularly. The Web3 wallet and DEX aggregator are properly built, and that integration is the reason to be here.",
    faq: [
      { q: "What actually separates these two?", a: "Not much on the exchange itself \u2014 both are deep, both are broad, both exclude US residents from their global sites. The genuine difference is on-chain: OKX built its Web3 wallet and DEX aggregator as first-class products, so if you move between centralised trading and DeFi regularly, that integration is the reason to be there." },
      { q: "Is OKX available in the United States?", a: "The global site is not. OKX operates a separate US entity, in the same pattern as Binance, and what it offers is not the same as the international platform. Check what is actually available in your state before assuming a feature you read about carries over." },
      { q: "Can I use one exchange and a separate on-chain wallet instead?", a: "Yes, and many people should. An integrated Web3 wallet is convenient, not obligatory \u2014 a standalone self-custody wallet keeps your on-chain activity independent of any exchange account, which matters if the account is ever frozen." },
    ],
  },
  {
    a: "binance", b: "kucoin",
    intro: "A major exchange against an early-listing one. People rarely choose between these — they end up with both, using KuCoin for tokens Binance has not listed.",
    pickA: "Anything with real volume. Deeper books mean less slippage, which costs more than the fee difference on any size.",
    pickB: "The token you want is not listed elsewhere yet — the honest reason most KuCoin accounts exist. Note that KuCoin's exclusion of US residents follows enforcement, not a business decision.",
    faq: [
      { q: "Is KuCoin still usable?", a: "Not for US residents. KuCoin pleaded guilty in January 2025, paid penalties of roughly $297 million and is barred from serving the US market, with a consent order following in 2026. Outside the US it continues to operate, but that history belongs in your assessment of it as a counterparty." },
      { q: "Why would anyone pick KuCoin over Binance?", a: "Historically for early listings \u2014 smaller-cap tokens often appeared there first. That is a genuine reason if you specifically want that exposure, and a genuine risk for the same reason: the assets that list earliest are the ones with the least established track record." },
      { q: "Does an exchange's legal history matter if I just buy and withdraw?", a: "Less than if you leave funds there, but it is not irrelevant. Enforcement actions can produce sudden withdrawal restrictions, market exits and account freezes with little warning. If your pattern is buy and withdraw to self-custody, you are exposed for hours rather than years \u2014 which is the point." },
    ],
  },
  {
    a: "binance", b: "bitget",
    intro: "Both offshore, both derivatives-heavy. Bitget's distinguishing product is copy trading, which is the entire reason most of its accounts were opened.",
    pickA: "You are making your own decisions and want the deepest liquidity to make them in.",
    pickB: "You genuinely want to copy other traders — but read the caution below before treating a leaderboard as a track record.",
    faq: [
      { q: "Is Bitget a serious alternative to Binance?", a: "For copy trading specifically, it is the product it is known for, and that is a real reason to choose it. As a general venue it is smaller, which shows up as thinner books on anything outside the majors. The question is whether the feature you want it for outweighs trading on a shallower market." },
      { q: "Is copy trading a good idea for a beginner?", a: "It is not the shortcut it appears to be. You are taking on someone else's risk appetite and position sizing with your own money, the track records shown are self-selected, and past performance in a leveraged strategy is an especially weak guide." },
      { q: "Can US residents use either?", a: "No \u2014 both exclude US residents from their global platforms. This is the normal state of affairs for large offshore exchanges and is the single biggest constraint on this category if you are American." },
    ],
  },
  {
    a: "binance", b: "mexc",
    intro: "Depth against catalogue. MEXC lists more tokens than almost anyone and allows basic use without full verification; Binance has the liquidity.",
    pickA: "Anything you intend to hold in size, or exit quickly.",
    pickB: "You are hunting new listings, or you want to trade a small amount without full verification. Check the order book depth before sizing a position — many MEXC listings cannot be exited near the screen price.",
    faq: [
      { q: "What is MEXC actually for?", a: "Breadth of listings. It carries a very large number of small-cap tokens, many of which appear nowhere else, and that is the entire reason to have an account there. It is not a general-purpose replacement for a major venue and does not try to be." },
      { q: "Is it available in the US?", a: "No. MEXC stopped serving US residents in 2023. As with the rest of this category, the global platform is off-limits and there is no equivalent domestic entity to fall back on." },
      { q: "Are obscure listings a red flag?", a: "The listing itself is not, but the asset usually is. A token that only trades in one place has one order book, one point of failure and no arbitrage keeping its price honest. Exit liquidity is the thing to check before entry, not after." },
    ],
  },
  {
    a: "bybit", b: "okx",
    intro: "The two strongest derivatives venues outside Binance. Both exclude US residents from their global platforms, and both have deep perpetual markets.",
    pickA: "Derivatives are all you do and you want the cleanest interface for managing them.",
    pickB: "You also want on-chain access from the same account, or a wider set of spot pairs alongside the perps.",
    faq: [
      { q: "Which is better for derivatives?", a: "Both are genuinely strong here, and the choice usually comes down to interface and the specific contracts you trade rather than any structural gap. If you also want on-chain access from the same app, OKX's Web3 side is the more developed of the two." },
      { q: "Do either accept US customers?", a: "Not on their global platforms. Bybit excludes the US, Canada and Singapore; OKX blocks the US globally and runs a separate US entity with a different offering. Verify against your own residency before you fund anything." },
      { q: "How much should I keep on a derivatives exchange?", a: "Only your margin and a working buffer. Derivatives venues require balances to be on the platform to function, which is precisely why they are the worst place to store holdings \u2014 and why Bybit's 2025 hot-wallet theft is worth reading about before deciding your number." },
    ],
  },
  {
    a: "bybit", b: "bitget",
    intro: "Two derivatives exchanges of similar size and structure. In practice the choice is made by one feature.",
    pickA: "You are trading your own book — the derivatives interface is the better one.",
    pickB: "Copy trading is why you are here. Bitget's pool of traders is large enough for the leaderboard to have some meaning; Bybit's copy product is the lesser of the two.",
    faq: [
      { q: "Are these two genuinely different?", a: "Less than their marketing suggests. Both are mid-to-large offshore venues with strong derivatives and no US access. Bitget leans on copy trading as its distinguishing product; Bybit is the larger and more liquid of the two." },
      { q: "Which has deeper liquidity?", a: "Bybit, generally. Depth matters most on larger orders and on anything outside the top pairs, where a thinner book turns into visible slippage. Test with a small order on the specific pair you care about rather than trusting a general claim, including this one." },
      { q: "Is copy trading worth choosing a whole exchange for?", a: "Only if you have decided you will actually use it. Picking a venue for a feature you never touch means accepting thinner markets for nothing." },
    ],
  },
  {
    a: "bybit", b: "mexc",
    intro: "A derivatives-first exchange against a listings-first one. They are not really competing for the same trade.",
    pickA: "Perpetuals and futures on liquid pairs.",
    pickB: "Early access to a token nobody else has listed, accepting the liquidity risk that comes with it.",
    faq: [
      { q: "Which should I pick for altcoins?", a: "MEXC lists more, by a wide margin. Bybit is the better venue for actually trading \u2014 deeper books, stronger derivatives. Many people end up using MEXC as the place they buy something unavailable elsewhere, which is a reasonable if narrow use." },
      { q: "Are both closed to US residents?", a: "Yes. Bybit excludes the US, Canada and Singapore; MEXC withdrew from the US in 2023. Neither has a US entity to redirect you to." },
      { q: "What is the risk with very thinly traded tokens?", a: "Getting out. A token with one venue and a shallow book can be easy to buy and effectively impossible to sell at anything near the quoted price. Check the depth on both sides of the book before you size a position, not just the last price." },
    ],
  },
  {
    a: "coinbase", b: "kraken",
    intro: "The two obvious choices for a US resident who wants a regulated exchange. Both are American, both have been through cycles, and the decision is closer than most on this page.",
    pickA: "You want a Nasdaq-listed counterparty and the simplest path from a bank account to crypto, and you will remember to use Advanced Trade instead of the simple buy button.",
    pickB: "You want the longer unbroken security record and regular proof-of-reserves attestations. Kraken generally costs less on comparable trades — but confirm on the current schedule, which changed in July 2026.",
    faq: [
      { q: "Which is cheaper?", a: "Both have a simple interface that costs more and a professional one that costs much less \u2014 Coinbase Advanced Trade and Kraken Pro. Most complaints about either exchange's cost come from people using the beginner screen. Neither fee schedule is reproduced here on purpose, because they change; both are linked above." },
      { q: "Which is better for a first purchase?", a: "Coinbase is the gentler introduction and the more familiar brand in the US, and it is publicly listed, which some people value in a counterparty. Kraken has a longer operating history and a reputation for straightforward account handling. Either is a defensible first account." },
      { q: "Should I leave my coins on whichever I choose?", a: "No longer than you need to. Both are among the more conventional venues available, but an exchange balance is a claim on a company rather than an asset you hold. Once the position is one you intend to keep, moving it to self-custody removes an entire category of risk." },
    ],
  },
  {
    a: "coinbase", b: "gemini",
    intro: "Two US-regulated exchanges with a similar pitch. Gemini holds a New York trust charter, which is a higher regulatory bar than a money-transmitter licence.",
    pickA: "Almost everyone. Deeper liquidity, a larger asset list, and a public company behind it.",
    pickB: "You are in New York and need a venue licensed for it, or the trust-company structure specifically matters to you. Its Earn programme froze funds in the 2022 Genesis collapse — worth knowing even though that product is gone.",
    faq: [
      { q: "What happened with Gemini Earn?", a: "Gemini's Earn programme froze customer withdrawals when its lending partner failed, and customers spent years in an insolvency process to recover assets. It is the clearest illustration available that a yield product offered by a regulated exchange is still a credit exposure to whoever is actually borrowing." },
      { q: "Are both available across the US?", a: "Both operate as US exchanges, but state coverage and available products differ, and they change. Check your own state on each platform before assuming a feature you have read about is offered to you." },
      { q: "Does regulation make an exchange safe?", a: "It makes some failures less likely and some outcomes more predictable \u2014 but Gemini Earn shows it does not make a yield product safe, and no amount of licensing protects a balance you left on a platform that gets hacked. Regulation and custody are separate questions." },
    ],
  },
  {
    a: "kraken", b: "gemini",
    intro: "Both US-regulated and both aimed at people who care more about custody risk than about fees.",
    pickA: "Most people, most of the time — more assets, more products, longer record.",
    pickB: "The New York trust charter is the deciding factor for you, or you need a venue that can serve New York.",
    faq: [
      { q: "Which is the better US exchange?", a: "Kraken has the longer operating history and the broader trading offer; Gemini leans hardest on the regulated, security-first positioning. The Earn episode is the specific thing to weigh against that framing \u2014 not because it makes the exchange unusable, but because it shows where the framing stops." },
      { q: "Do either offer staking in the US?", a: "Staking availability for US customers has been repeatedly reshaped by regulators and differs by asset and by state, so anything written here would date quickly. Check the platform's own current terms rather than a comparison page \u2014 including this one." },
      { q: "Which should I use to hold long term?", a: "Neither, ideally. Both are reasonable places to buy; a long-term holding belongs in a wallet whose keys you control. If you are choosing between them for storage, you are answering the wrong question." },
    ],
  },
  {
    a: "okx", b: "kucoin",
    intro: "Two offshore exchanges with wide catalogues. OKX is much larger and more complete; KuCoin lists earlier.",
    pickA: "Anything with liquidity, and anything involving derivatives or on-chain activity.",
    pickB: "A specific token OKX has not listed. Weigh that against KuCoin's US enforcement history before making it your main account.",
    faq: [
      { q: "Which is the safer counterparty?", a: "OKX is the larger and more established of the two. KuCoin pleaded guilty in the US in January 2025 with penalties of about $297 million and a subsequent consent order, and is barred from the US market. That history is a legitimate input even if you are not American." },
      { q: "Do either serve US customers?", a: "OKX blocks its global site to US residents and runs a separate US entity; KuCoin is barred from the market outright. Neither global platform is available to you if you are in the United States." },
      { q: "Why would I choose KuCoin at all?", a: "Early access to smaller listings, which is its historical strength. That is a real reason for a specific kind of buyer, and it comes bundled with the counterparty history above." },
    ],
  },
  {
    a: "kucoin", b: "gate-io",
    intro: "The two long-tail listing exchanges. If you are comparing these, you are looking for a token the majors have not listed, and the real question is which one has it.",
    pickA: "Slightly better interface, and a larger derivatives book.",
    pickB: "Longer proof-of-reserves history, and a catalogue that rivals or beats KuCoin's. The interface is genuinely worse — budget time for it.",
    faq: [
      { q: "What do these two have in common?", a: "Both are long-running offshore exchanges known for very large listing catalogues, and both are places people go for tokens that major venues have not listed. They occupy nearly the same niche, which is why this comparison is closer than most." },
      { q: "Is either available to US residents?", a: "KuCoin is barred from the US market following its January 2025 guilty plea. Gate.io's availability to US customers has been restricted; check its current terms directly rather than relying on any third-party summary, this one included." },
      { q: "How should I treat an account on a listings-first exchange?", a: "As a transit point rather than a home. Buy what you cannot get elsewhere, withdraw to self-custody, and keep the balance you leave behind small enough that losing it would be annoying rather than serious." },
    ],
  },
  {
    a: "mexc", b: "gate-io",
    intro: "Both compete on breadth of listings. Neither serves US residents. The difference is mostly transparency and verification policy.",
    pickA: "You want to trade a small amount without completing full verification.",
    pickB: "You want a longer public proof-of-reserves record behind the exchange holding your balance.",
    faq: [
      { q: "Which lists more tokens?", a: "Both are at the extreme end of this and the answer changes constantly, so a number here would be wrong within weeks. Search the specific asset on each before opening an account \u2014 that is the only version of this question with a reliable answer." },
      { q: "Are these suitable as a main exchange?", a: "Generally not. Their strength is breadth of listings, not depth of market, and a shallow book is exactly what hurts you on the way out. Most people are better served keeping their core activity on a deeper venue and using these for the specific things unavailable there." },
      { q: "What should I check before buying a token that only trades here?", a: "The depth of the sell side, the withdrawal status for that asset, and whether any other venue quotes it at all. A single-venue token means you have one counterparty for both the trade and the exit." },
    ],
  },
  {
    a: "bitget", b: "mexc",
    intro: "Two mid-sized offshore exchanges that people usually end up comparing because both were suggested as a Binance alternative.",
    pickA: "Copy trading, or a cleaner derivatives experience.",
    pickB: "Early listings and lighter verification for small amounts.",
    faq: [
      { q: "Which one is for what?", a: "Bitget for copy trading and derivatives; MEXC for the sheer number of listings. They are not really competing for the same use \u2014 someone choosing between them usually already knows which of those two things they want." },
      { q: "Is either open to US residents?", a: "No. MEXC withdrew from the US in 2023 and Bitget's global platform excludes US residents, in line with the rest of the offshore category." },
      { q: "Do smaller exchanges carry more risk?", a: "Structurally, yes \u2014 less capital to absorb a loss, less external scrutiny, and thinner markets that make an orderly exit harder in a crisis. That is an argument for limiting what you keep there, not necessarily for avoiding them when they have something you need." },
    ],
  },
  {
    a: "coinbase", b: "crypto-com",
    intro: "Two consumer-facing platforms available to US residents. One is an exchange with an app; the other is an app with an exchange attached.",
    pickA: "Buying and holding, or trading. Deeper books and a public company behind them.",
    pickB: "Spending is the point — the card and the app are the best consumer product here. Just note the cashback tiers require staking CRO, so the reward carries token exposure.",
    faq: [
      { q: "Which is better for a beginner?", a: "Both are built for one. Coinbase is publicly listed and files audited accounts; Crypto.com leans on its card and app ecosystem. The pattern worth avoiding on either is the simple buy screen, which is the expensive way to transact on almost every consumer platform." },
      { q: "Are the card rewards worth choosing a platform for?", a: "Read the conditions before assuming so. Card programmes in this sector have historically been revised \u2014 staking requirements, reward tiers and benefits have all changed with notice. A card is a reasonable tiebreaker and a poor primary reason to pick a custodian." },
      { q: "Does either let me hold my own keys?", a: "Not on the exchange itself. Both are custodial: they hold the keys and you hold a claim. Both also publish separate self-custody wallet apps, which are a different product with a different risk model \u2014 do not assume an account balance and a wallet balance are the same thing." },
    ],
  },

  /* ---- Hardware wallets -------------------------------------------------- */
  {
    a: "ledger", b: "trezor",
    intro: "The two hardware wallets everyone compares, and a genuine philosophical split: broad support and closed firmware against narrower support and fully open firmware.",
    pickA: "You hold assets across many chains, or want the widest app integration. Nothing else supports as much.",
    pickB: "You want to be able to verify what the device does. Trezor's firmware and hardware are open source, and after Ledger's 2023 Recover announcement that is not an abstract preference for everyone.",
    faq: [
      { q: "Is Ledger still trustworthy after the Recover controversy?", a: "The devices work as they always did, and the disagreement is about what the firmware is capable of rather than a demonstrated compromise. If your objection is that a closed-source secure element could in principle be asked to do something you did not authorise, that objection is not resolved by any statement \u2014 which is precisely why Trezor's open firmware appeals to the people it appeals to." },
      { q: "Does the 2020 Ledger data breach affect me?", a: "Not your coins \u2014 it exposed customer contact details, not keys. The lasting consequence is targeted phishing: people on that list still receive convincing fake Ledger emails and physical letters years later. Treat any unexpected message about your hardware wallet as hostile." },
      { q: "Which is better for someone holding a wide range of assets?", a: "Ledger supports more assets through its own app, which is the practical reason most people with a varied portfolio end up there. Trezor covers the majors thoroughly and is the choice when auditability matters more to you than coverage." },
    ],
  },
  {
    a: "ledger", b: "tangem",
    intro: "A conventional hardware wallet against an NFC card you tap on a phone. Very different objects solving the same problem.",
    pickA: "You want a screen on the device to verify transactions independently of your phone, and the broadest asset support.",
    pickB: "You would otherwise leave coins on an exchange because a hardware wallet feels like too much effort. Nothing to charge, nothing to plug in — the wallet you actually use beats the better wallet you do not.",
    faq: [
      { q: "Is a card without a screen actually safe?", a: "It changes what you are trusting. A screened device lets you verify the transaction on the hardware itself, independent of the phone; a card relies on the phone's display for that. If the phone is compromised, that difference is the whole ballgame \u2014 which is the honest trade for the convenience." },
      { q: "What happens if I lose a Tangem card?", a: "That is what the multi-card set is for \u2014 the backup cards restore the same wallet. It also means the cards must be stored apart, because anyone holding one holds access. A hardware wallet with no seed phrase removes one failure mode and adds another." },
      { q: "Which should a first-time buyer get?", a: "If you want the conventional answer with the largest support community and the widest asset coverage, Ledger. If the seed phrase itself is the thing putting you off self-custody, Tangem removes it \u2014 and for someone who would otherwise leave coins on an exchange, that is a real improvement." },
    ],
  },
  {
    a: "trezor", b: "tangem",
    intro: "Open-source verifiability against sheer convenience. These two sit at opposite ends of the same trade-off.",
    pickA: "You want open firmware and an on-device screen, and you accept a slightly awkward setup for it.",
    pickB: "You want self-custody to take two minutes. Understand the seedless option first: losing all your cards means the coins are gone, because there is no phrase written down anywhere.",
    faq: [
      { q: "What is the core difference?", a: "How you back up. Trezor gives you a seed phrase to write down and, on some models, Shamir backup that splits it into shares. Tangem gives you additional cards instead of a phrase. One asks you to protect a piece of paper; the other asks you to protect objects." },
      { q: "Is open-source firmware worth caring about?", a: "It means the code can be inspected by people who do not work for the manufacturer, so a deliberate backdoor is far harder to hide. It does not make bugs impossible or protect you from phishing, which is how most people actually lose funds. Useful, not decisive." },
      { q: "Which is harder to lose access to?", a: "Tangem removes the single most common failure \u2014 the misplaced or destroyed seed phrase \u2014 but replaces it with the need to keep physical cards safe and separate. Trezor's Shamir option addresses the same problem differently, by splitting the secret so no single lost share is fatal." },
    ],
  },
  {
    a: "ledger", b: "safepal",
    intro: "The established hardware wallet against the cheapest credible air-gapped one.",
    pickA: "You want the widest support and the largest security-research community examining the device.",
    pickB: "Budget matters, or air-gapped QR signing is a requirement. Note that SafePal is Binance-backed, which cuts against the reason some people self-custody in the first place.",
    faq: [
      { q: "Is a cheaper hardware wallet a false economy?", a: "Not automatically, but understand what the price reflects. The cost of a hardware wallet is largely the secure element, the firmware work and the support behind it. A budget device that genuinely isolates your keys from an internet-connected machine is still a large improvement on no device at all." },
      { q: "Which has better support if something goes wrong?", a: "Ledger, by a wide margin \u2014 more documentation, a much larger user community and more third-party guidance. That matters more than people expect, because the moment you need help with a hardware wallet is usually a moment when you are already worried." },
      { q: "Does the brand of the device matter for security?", a: "It matters for how quickly firmware issues get found and fixed, and for whether the company is still there in five years. Neither is a guarantee \u2014 but a wallet whose vendor disappears leaves you dependent on the seed phrase and generic recovery tools alone." },
    ],
  },

  /* ---- Software wallets -------------------------------------------------- */
  {
    a: "metamask", b: "trust-wallet",
    intro: "The two most-installed self-custody wallets. MetaMask is the Ethereum default; Trust Wallet covers far more chains.",
    pickA: "You live in the Ethereum and layer-2 ecosystem. Everything supports MetaMask first, so nothing you want to use will turn out to be incompatible.",
    pickB: "Your holdings span chains that are not EVM. One wallet holding everything is worth a lot. It is Binance-owned, which matters to some people.",
    faq: [
      { q: "Which supports more chains?", a: "Trust Wallet covers a broader set out of the box, including non-EVM networks. MetaMask is EVM-first and expects you to add networks yourself, which is straightforward but is a step. If you hold assets across very different ecosystems, that difference is the practical one." },
      { q: "Are browser-extension wallets safe to use?", a: "They are the main target of approval scams and drainer sites, which is a usage risk rather than a flaw in the software. The single most valuable habit with either wallet is reviewing what you are signing, and periodically revoking approvals you no longer use." },
      { q: "Can I use the same seed phrase in both?", a: "Technically often yes, and it is usually a bad idea. Importing one wallet's phrase into another multiplies the number of devices and applications that have seen your secret. If you want two wallets, generate two." },
    ],
  },
  {
    a: "metamask", b: "phantom",
    intro: "The Ethereum default against the Solana one. Both have since added the other's chains, which is why the comparison exists at all.",
    pickA: "Ethereum, layer 2s and anything DeFi-heavy — the integration depth is not close.",
    pickB: "Solana is where you actually spend your time, or you want the better-designed wallet. Its spam-token filtering alone makes a Solana wallet usable.",
    faq: [
      { q: "Which should I use for Solana?", a: "Phantom \u2014 it was built for Solana and the experience shows it, including its scam-token filtering. MetaMask's strength is the Ethereum and EVM world, and using either outside its home ecosystem is possible but rarely the smoother path." },
      { q: "Do I need both?", a: "If you are active on both Solana and EVM chains, most people end up with both rather than forcing one to cover everything. They are free, and keeping ecosystems in separate wallets also limits what a single bad signature can reach." },
      { q: "Does scam-token filtering make a wallet safe?", a: "It reduces the noise, which is genuinely useful \u2014 but the losses that matter come from signing a malicious approval, not from seeing a junk token in your list. No filter substitutes for reading what a transaction actually authorises." },
    ],
  },
  {
    a: "trust-wallet", b: "exodus",
    intro: "Two multi-chain self-custody wallets aimed at people who do not want to think about chains. One is mobile-first, the other desktop-first.",
    pickA: "Your phone is your main device, and you want the widest chain coverage.",
    pickB: "You want a desktop wallet, or you pair with a Trezor. Note its built-in exchange quotes a rate with a spread already inside it — that is not the market price.",
    faq: [
      { q: "Which is easier for a complete beginner?", a: "Exodus is the more polished experience and the one people find friendlier, particularly on desktop. Trust Wallet is mobile-first and covers more chains. Both are self-custody, so the important part \u2014 that you hold the keys and the responsibility \u2014 is identical." },
      { q: "Are the built-in swaps a good deal?", a: "They are convenient and you pay for the convenience, typically through the spread rather than a visible fee. For small amounts that is a fair trade; for larger ones it is worth comparing against doing the same swap elsewhere before pressing the button." },
      { q: "Does a nicer interface mean less secure?", a: "No, but it can mean less visible. The risk with any polished wallet is that it makes signing feel routine. Whatever you use, the transaction detail is the thing to read, and a smooth flow is exactly when people stop reading it." },
    ],
  },

  /* ---- Tax software ------------------------------------------------------ */
  {
    a: "koinly", b: "cointracker",
    intro: "Two of the best-known crypto tax tools. Koinly covers more countries; CoinTracker doubles as a year-round portfolio tracker.",
    pickA: "You are outside the US, or you want to import everything and see your gain before paying anything.",
    pickB: "You want one tool for tracking and tax all year, and you are on Coinbase — the integration is the tightest of any of these.",
    faq: [
      { q: "Which handles more countries?", a: "Koinly, which is its main structural advantage \u2014 it produces country-specific reports for a long list of jurisdictions. CoinTracker is strongest inside the US ecosystem, particularly through its TurboTax integration and Coinbase partnership." },
      { q: "Can I try either before paying?", a: "Koinly lets you import everything and see the computed result before paying, which means you can check whether it handled your history correctly first. That preview is worth using properly rather than skimming \u2014 an import that silently missed a wallet produces a confident and wrong number." },
      { q: "Do I need paid tax software at all?", a: "Not necessarily. If your history is a handful of buys and sells on one exchange, a free calculator will get you there. Paid tools earn their price on volume, on multiple venues, and on DeFi and NFT activity where matching transactions by hand stops being realistic." },
    ],
  },
  {
    a: "koinly", b: "coinledger",
    intro: "The international option against the US-focused one.",
    pickA: "You file anywhere other than the US, or your history includes real DeFi activity.",
    pickB: "Your return ends up in TurboTax or TaxAct. The hand-off is smoother than anything else here.",
    faq: [
      { q: "What is the practical difference?", a: "Coverage and reach. Koinly supports a wider set of countries and integrations; CoinLedger is US-centric and generally simpler to get through. If you file outside the US, that narrows the choice considerably on its own." },
      { q: "Will either import my DeFi activity correctly?", a: "Both attempt it and neither is perfect \u2014 DeFi is where every tax tool struggles, because a single on-chain action can be several taxable events and the software has to infer intent. Expect to review and correct the trickiest transactions manually whichever you pick." },
      { q: "Does the tool decide my cost-basis method?", a: "It applies the method, but your country usually decides which method is allowed \u2014 Canada mandates adjusted cost base, the UK uses share pooling, and so on. A tool that lets you pick freely is not giving you an option so much as a chance to file incorrectly." },
    ],
  },
  {
    a: "cointracker", b: "coinledger",
    intro: "Two US-strong tax tools that both export into consumer filing software. The split is tracking versus filing.",
    pickA: "You want a portfolio tracker you open all year, not a tool for one week in April.",
    pickB: "You only want the tax report, and you want it in TurboTax with the least friction.",
    faq: [
      { q: "Which is better for a US filer?", a: "Both are aimed squarely at US filers and either will do the job. CoinTracker's advantage is its Coinbase partnership and portfolio tracking alongside the tax report; CoinLedger tends to be the more straightforward run-through. Pricing structures differ, so compare on your own transaction count." },
      { q: "Do they support countries outside the US?", a: "Both have some international support, but neither has the breadth Koinly does. If you file outside the US, check that your specific jurisdiction's rules \u2014 not just its currency \u2014 are actually implemented before you pay." },
      { q: "Is portfolio tracking a reason to choose one?", a: "Only if you will use it. A tax tool that also tracks holdings saves you a second subscription, but it also means your full position is sitting in another company's database. That is a privacy trade worth making deliberately rather than by default." },
    ],
  },
  {
    a: "koinly", b: "tokentax",
    intro: "Software you operate against a service that operates it for you. This is a question about how messy your history is.",
    pickA: "A few exchanges and a manageable number of trades. You can do this yourself in an evening.",
    pickB: "Years of DeFi, margin, lost records and cross-chain movement. There is an accounting firm behind the software, and at that level of mess it is cheaper than the alternative.",
    faq: [
      { q: "What is TokenTax's higher price for?", a: "Its higher tiers include accountant involvement and full filing, which is a different product from software that produces a report you file yourself. If your situation is genuinely complicated, paying for a person is not the same purchase as paying for a tool." },
      { q: "Do I need the expensive option?", a: "Most people do not. A straightforward history of buys, sells and a few swaps is what the standard software tiers are built for. The case for the accountant tier is complexity \u2014 business income, unusual structures, multiple jurisdictions, or several years of unfiled history." },
      { q: "Can I switch tax software between years?", a: "Yes, but carry your cost basis across carefully. The closing position of one year is the opening basis of the next, and an import that starts from scratch will produce gains that look far too large. This is the single most common way people misfile after switching." },
    ],
  },

  /* ---- Trading bots ------------------------------------------------------ */
  {
    a: "3commas", b: "cryptohopper",
    intro: "The two established retail bot platforms. Both connect by API key and run strategies on your exchange account.",
    pickA: "You want the most mature DCA and grid bots — the safety-order pattern most competitors copied started here.",
    pickB: "You want backtesting and paper trading before risking anything, and a cloud-hosted bot that does not depend on your machine.",
    faq: [
      { q: "What happened with 3Commas in 2022?", a: "API keys belonging to users were compromised and used to make unauthorised trades on connected exchange accounts. It is the defining risk of every bot platform: you are handing a third party trading access to your exchange account, and that access is only as safe as their systems." },
      { q: "How do I limit the damage a bot can do?", a: "Create API keys with trading permission only and withdrawal permission off \u2014 always, on any platform. Add an IP allowlist if the exchange supports it, and remove keys you no longer use. That single setting is the difference between an incident costing you some bad trades and costing you the account." },
      { q: "Do trading bots actually make money?", a: "They automate a strategy; they do not supply one. A grid or DCA bot executes rules faithfully whether or not those rules are profitable, and fees are charged on every trade regardless. The arithmetic of whether a given configuration can profit at all is worth doing before subscribing to anything." },
    ],
  },
];

/** URL slug for a pair. */
export function pairSlug(pair: ComparePair): string {
  return `${pair.a}-vs-${pair.b}`;
}

const bySlug = new Map(comparePairs.map((p) => [pairSlug(p), p]));

export function getPair(slug: string): ComparePair | undefined {
  return bySlug.get(slug);
}

/**
 * Pairs whose BOTH sides exist in the platform registry and have comparison
 * data. A pair missing either would render a half-empty table, so it is
 * dropped from the build rather than shipped broken.
 */
export function validPairs(): ComparePair[] {
  const known = new Set(platforms.map((p) => p.slug));
  return comparePairs.filter(
    (p) => known.has(p.a) && known.has(p.b) && compareData[p.a] && compareData[p.b],
  );
}
