import type { Guide } from "../types";

/**
 * Hub page for the staking / earning cluster. Children carry
 * `partOf: "crypto-staking-and-earning"` for two-way hub-and-spoke linking.
 * When a new staking/yield guide is added, link it from the right section
 * below and set its partOf.
 */
const guide: Guide = {
  slug: "crypto-staking-and-earning",
  affiliate: "exchange",
  hubName: "Staking & Earning",
  hubBacklinkEyebrow: "The full staking & earning guide",
  title: "Crypto Staking & Earning: How to Earn Yield on Your Crypto",
  description:
    "Staking, lending and liquidity yield explained without the hype: where the return actually comes from, what the headline APY hides, and how to tell a real yield from a subsidised one.",
  readingMinutes: 10,
  updatedAt: "2026-08-31",
  seo: {
    keywords: [
      "crypto staking",
      "how to earn yield on crypto",
      "crypto passive income",
      "crypto staking guide",
      "staking vs lending crypto",
      "how does crypto staking work",
      "best way to earn interest on crypto",
    ],
    description:
      "A complete guide to earning yield on crypto: how staking, lending and liquidity provision actually work, why headline APYs mislead, where the real risks are, and how to start safely. Each path links to a full guide and a free calculator.",
  },
  keyTakeaways: [
    "Every real yield pays you for one thing — **securing a network** (staking), **lending**, or **providing liquidity** — and carries that matching risk.",
    "If you can't explain where a yield comes from, assume it is paid out of **your own principal** or new deposits.",
    "Read the rate honestly: **APR and APY differ**, and 'up to X%' usually applies to a tiny tranche or to decaying token emissions.",
    "Staking and lending rewards are usually **taxed as income** on the day received — keep a record as you go.",
  ],
  relatedTools: ["staking-rewards-calculator", "apy-calculator", "yield-farming-apy-calculator"],
  body: [
    { type: "p", text: "Idle crypto can earn a return, and there are three honest ways it happens: you help **secure a network** (staking), you **lend** it to someone who pays interest, or you **provide liquidity** to a market that pays you fees. Every legitimate yield is a payment for one of those, which means every yield also carries the matching risk — there is no return without one. This guide is a map of the options, what each actually pays you for, and how to read the numbers so a **'up to 20% APY'** banner does not talk you into a loss." },
    { type: "callout", text: "The one rule that filters most bad decisions: if you cannot explain where a yield comes from, assume it comes from your own principal. Sustainable yield is a share of real revenue — staking rewards, borrower interest, trading fees. Yield paid from a token's own emissions or from new deposits is a countdown, not an income." },

    { type: "h2", text: "Staking: earning by securing the network" },
    { type: "p", text: "On a proof-of-stake chain, validators lock up coins as collateral to process transactions, and the network pays them new coins for doing it honestly. Stake your coins and you share in that reward. Start with [what crypto staking is](/guides/what-is-crypto-staking) for the mechanics, then [the Ethereum staking guide](/guides/ethereum-staking-guide) for the biggest market's specifics — solo staking, pooled staking and the 32-ETH threshold. If you want the yield without locking your coins away, [liquid staking](/guides/liquid-staking-explained) gives you a tradable token that represents your staked position, at the cost of an extra layer of smart-contract and depeg risk." },
    { type: "ul", items: [
      "**The reward is real, but so is the lock-up.** Many chains impose an unbonding period — days or weeks where your coins are neither earning nor withdrawable.",
      "**Slashing is the risk that offsets the reward.** Validators that misbehave or go offline lose part of their stake; if you delegate, you inherit that risk through your operator.",
      "**Staking rewards are usually taxable as income** when received, at their value on the day — even in countries where a later capital gain is not.",
    ] },
    { type: "cta", title: "See what a stake would actually pay", text: "Enter an amount, a rate and a compounding assumption and the free staking rewards calculator shows the realistic return after the reward rate is applied — not the marketing number.", href: "/tools/staking-rewards-calculator", label: "Open the staking rewards calculator" },

    { type: "h2", text: "Lending: earning by letting others borrow" },
    { type: "p", text: "Lending pays you interest because a borrower is paying to use your coins — to trade with leverage, to short, or to access liquidity without selling. [Crypto lending and borrowing](/guides/crypto-lending-and-borrowing) covers both sides: how the rate is set by supply and demand, the difference between decentralised protocols and custodial platforms, and the counterparty risk that turned several big lenders into cautionary tales in 2022. The rate is usually lower than a staking or farming headline, and that is often a feature, not a flaw — it tends to reflect a more transparent source." },

    { type: "h2", text: "Reading the yield number — where most people get fooled" },
    { type: "p", text: "The single most useful skill here is reading an advertised rate correctly. [APR vs APY](/guides/apr-vs-apy-crypto) is the starting point: APR is the simple rate, APY folds in compounding, and platforms quote whichever looks bigger. Worse, a headline is often a **blended or peak** figure — 'up to' a rate that applies to a tiny tranche, or a rate inflated by token emissions that will fall as more people deposit. Convert everything to the same basis before you compare, and discount any yield whose source you cannot name." },
    { type: "ul", items: [
      "**APR vs APY** — the same underlying rate looks larger as APY. Compare like with like; use the [APY calculator](/tools/apy-calculator) to convert.",
      "**'Up to' is a marketing word.** The advertised rate usually applies to a capped amount or a promotional window, not your whole balance forever.",
      "**Emissions-funded yield decays.** A high farm APY paid in the platform's own token falls as the token's price and the emission schedule change — model it before, not after. The [yield farming APY calculator](/tools/yield-farming-apy-calculator) helps.",
    ] },
    { type: "tool", slug: "staking-rewards-calculator" },

    { type: "h2", text: "Where the risk actually is" },
    { type: "ul", items: [
      "**Slashing and validator risk** (staking) — your operator's mistake can cost you principal, not just rewards.",
      "**Lock-ups and unbonding** — your coins can be stuck for days or weeks, unable to react to a crash.",
      "**Smart-contract risk** (liquid staking, farming, DeFi lending) — a bug or exploit in the protocol can drain deposits regardless of the yield.",
      "**Depeg risk** — a liquid-staking token or a stablecoin can trade below its supposed value, turning a safe-looking yield into a loss.",
      "**Counterparty risk** (custodial lending/earn) — 'we pay you interest' means someone else has your coins and is doing something with them. If they fail, so does your balance.",
      "**Impermanent loss** (liquidity provision) — providing to a pool can leave you worse off than simply holding when prices move apart.",
    ] },

    { type: "h2", text: "How to start safely" },
    { type: "ul", items: [
      "Start with **staking a major asset** you already intend to hold long-term — the closest thing to a 'boring' yield, and the easiest to understand.",
      "**Understand the lock-up before you commit.** Know exactly how long it takes to get your coins back, and never stake money you might need quickly.",
      "**Name the source of every yield.** Network rewards, borrower interest, trading fees — good. Token emissions or 'guaranteed' returns — treat as risk, not income.",
      "**Size it to the risk.** Custodial 'earn' products and high-APY farms belong to your risk budget, not your savings. Keep the bulk in [cold storage](/guides/crypto-wallet-security).",
      "**Remember the tax.** Rewards are usually income on the day received; keep a record as you go rather than reconstructing it in April.",
    ] },
    { type: "p", text: "Earning on crypto is legitimate and, done conservatively, sensible — staking a long-term holding is a world away from chasing a triple-digit farm. The discipline is the same throughout: know what you are being paid for, read the rate honestly, and never reach for a yield you cannot explain. This is general information, not financial advice." },
  ],
  faq: [
    { q: "What is the safest way to earn yield on crypto?", a: "Staking a major proof-of-stake asset you already plan to hold, ideally directly or through a reputable, non-custodial method, is the most transparent option — the reward comes from the network itself. Custodial 'earn' products and high-APY farms pay more precisely because they carry more risk (counterparty failure, emissions decay, smart-contract bugs). Match the amount you commit to how much risk each option really carries." },
    { q: "What is the difference between staking and lending?", a: "Staking pays you for helping secure a proof-of-stake network; the reward is new coins issued by the protocol, and the main risks are slashing and lock-ups. Lending pays you interest from a borrower who is using your coins; the rate reflects supply and demand, and the main risk is that the borrower or platform fails to pay you back. Staking's yield comes from the network, lending's from another user." },
    { q: "Is a high APY too good to be true?", a: "Often, yes — not always. Ask where the yield comes from. If it is a share of real revenue (network rewards, borrower interest, trading fees) a moderate rate can be sustainable. If it is paid in the platform's own newly-minted token, the rate will fall as emissions and price change, and the headline is a snapshot you will rarely actually earn. A yield with no explainable source is usually being paid out of principal or new deposits." },
    { q: "Do I pay tax on staking rewards?", a: "In most countries, yes — staking and lending rewards are typically taxed as income at their market value on the day you receive them, and then again as a capital gain or loss when you later sell. This is true even in some places where long-held capital gains are tax-free. Keep a dated record of rewards as you receive them." },
    { q: "Can I lose my crypto by staking it?", a: "You can. Direct network staking exposes you to slashing (losing part of your stake if your validator misbehaves) and lock-up periods. Liquid staking and DeFi yield add smart-contract and depeg risk, and custodial earn products add counterparty risk — if the platform fails, your balance can go with it. The reward always exists because a matching risk does." },
  ],
};

export default guide;
