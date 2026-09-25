import type { Guide } from "../types";

const guide: Guide = {
  slug: "crypto-airdrops-explained",
  title: "Crypto Airdrops Explained: How They Work & How to Qualify",
  description:
    "What a crypto airdrop actually is, why projects give tokens away, how to qualify without getting scammed or Sybil-flagged, and how airdrops are taxed — in plain English.",
  readingMinutes: 11,
  updatedAt: "2026-09-25",
  reviewedAt: "2026-09-25",
  seo: {
    title: "Crypto Airdrops Explained — How They Work & How to Qualify",
    keywords: [
      "crypto airdrops",
      "what is a crypto airdrop",
      "how to qualify for airdrops",
      "airdrop farming",
      "are airdrops taxable",
      "how do airdrops work",
      "sybil attack airdrop",
      "crypto airdrop guide",
    ],
    description:
      "A plain-English guide to crypto airdrops — what they are, why projects run them, the types (retroactive, holder, task), how to qualify without getting Sybil-flagged, the scams to avoid, and how airdrops are taxed.",
  },
  keyTakeaways: [
    "An **airdrop** is a project distributing free tokens to wallets — usually to reward early users, decentralise ownership, or market a launch.",
    "The valuable ones are **retroactive**: you qualify by *genuinely using* a protocol before any token is announced, not by chasing a checklist.",
    "**Never sign a transaction or connect a wallet to \"claim\"** an airdrop you didn't earn — that is the #1 way drainers empty wallets.",
    "Running dozens of wallets to farm one airdrop is a **Sybil attack**; projects now cluster and disqualify these en masse.",
    "In most countries a received airdrop is **taxable income at its value on the day you receive it**, and selling it later is a separate capital-gains event.",
  ],
  relatedTools: [
    "crypto-airdrop-calculator",
    "gas-fee-calculator",
    "crypto-tax-calculator",
  ],
  body: [
    { type: "p", text: "A crypto airdrop is when a project sends its token, for free, to a set of wallet addresses. Some of the largest windfalls in crypto have come from airdrops — early users of Uniswap, ENS, Arbitrum and dYdX received allocations that were worth thousands of dollars at launch. That history has turned \"airdrop hunting\" into a whole activity, and with it a wave of scams and a cat-and-mouse game over who actually deserves the tokens. This guide explains what airdrops really are, the honest way to qualify for them, and the traps — technical, financial and tax — that catch people who don't understand the mechanics." },

    { type: "h2", text: "Why would a project give tokens away?" },
    { type: "p", text: "Free tokens sound like charity, but an airdrop is a deliberate growth and governance tool. A project spends part of its token supply to buy something it can't buy any other way, usually one of these:" },
    { type: "ul", items: [
      "Decentralise ownership — a token needs to be spread across many holders to function as governance and to avoid looking like a security controlled by one team.",
      "Reward and retain early users — giving tokens to people who used the product before it was cool builds loyalty and a base of aligned holders.",
      "Bootstrap a network — putting tokens in thousands of hands at once creates instant users, liquidity and attention on day one.",
      "Marketing — an airdrop is a launch event. The promise of a possible future drop is itself what pulls users to a new protocol.",
    ] },
    { type: "p", text: "Understanding the motive tells you how to qualify: projects want to reward real, sticky usage — so the behaviour that gets rewarded is the behaviour that looks like a genuine long-term user, not a bot passing through once." },

    { type: "h2", text: "The main types of airdrop" },
    { type: "table",
      headers: ["Type", "How you qualify", "Notes"],
      rows: [
        { cells: ["Retroactive", "Used the protocol before a token existed", "The big ones. Rewards past activity — you can't apply, only have already qualified."] },
        { cells: ["Holder / snapshot", "Held a specific coin or NFT at a snapshot block", "Common for forks and ecosystem tokens; passive if you already hold."] },
        { cells: ["Task / quest", "Completed on-chain tasks (swaps, bridges, testnet)", "Explicit checklists (e.g. Galxe, Layer3). Higher Sybil scrutiny."] },
        { cells: ["Bounty / social", "Promoted the project, referrals, Discord roles", "Usually low value; often thin cover for data or bot campaigns."] },
      ],
      caption: "Retroactive drops reward what you already did; the others tell you upfront what to do — which also makes them easier to farm and easier to disqualify.",
    },
    { type: "callout", text: "The paradox of airdrops: the most valuable ones can't be gamed with a checklist, because they are announced only after the qualifying period is over. By the time everyone \"knows\" how to farm a drop, that drop has usually already happened." },

    { type: "h2", text: "How to qualify — the honest way" },
    { type: "p", text: "There is no guaranteed method, and anyone selling one is selling you something. But you can put yourself in the eligible set for future retroactive drops by being an early, genuine user of protocols that don't yet have a token. The pattern that tends to get rewarded:" },
    { type: "ul", items: [
      "Use new-but-credible protocols that have raised funding but not yet launched a token — the strongest signal a drop may come later.",
      "Interact genuinely and repeatedly over time — real swaps, providing liquidity, bridging, lending — not a single dust transaction to tick a box.",
      "Keep meaningful (not micro) amounts and let activity span weeks or months. Snapshots often reward sustained use, not one busy afternoon.",
      "Use the protocol's core feature, not just the periphery. A DEX rewards traders and LPs; a bridge rewards people who actually moved value.",
      "Track testnets and quests only for projects you'd use anyway — treat any resulting token as a bonus, never as paid work.",
    ] },
    { type: "p", text: "Every one of these actions costs gas, and on Ethereum mainnet that can quietly add up to more than a small drop is worth. Price the cost of qualifying before you chase a drop — work out what your on-chain activity is actually costing you." },
    { type: "tool", slug: "gas-fee-calculator" },

    { type: "h2", text: "Sybil attacks: why farming with many wallets backfires" },
    { type: "p", text: "A Sybil attack is one person pretending to be many — spinning up dozens or hundreds of wallets to claim an airdrop multiple times. Projects hate this because it defeats the entire point of decentralising ownership, so airdrop teams now spend serious effort detecting it before the snapshot. They cluster wallets by funding source, timing patterns, identical transaction sequences and shared destinations, then disqualify whole clusters at once." },
    { type: "callout", text: "Sybil farming is not a clever edge — it is the behaviour the allocation is explicitly designed to filter out. Hundreds of thousands of addresses have been struck off major airdrops for it. One genuinely-used wallet routinely beats fifty botted ones that all get zero." },
    { type: "p", text: "If you use multiple wallets for legitimate reasons (separating funds, privacy), that's fine — the risk is in making them behave like a coordinated farm: funded from the same place, doing the same actions in the same order at the same time." },

    { type: "h2", text: "The scams — this is where people lose money" },
    { type: "p", text: "Airdrops are the single most common lure in wallet-draining scams, because \"free money\" lowers people's guard. The mechanics are almost always the same: get you to a fake claim site, then get you to sign a transaction that isn't a claim at all." },
    { type: "ul", items: [
      "Fake claim sites — a lookalike domain promising you can \"claim\" a real drop. Connecting and signing grants a token approval that lets the attacker move your assets.",
      "Unsolicited tokens in your wallet — a random token appears; interacting with it (or the site it points to) triggers a malicious approval. Never touch tokens you didn't expect.",
      "\"You must send gas / a small fee to unlock\" — a real airdrop never asks you to send crypto first. Any \"pay to receive\" is a scam.",
      "Seed-phrase phishing — no legitimate claim ever needs your seed phrase or private key. Entering it anywhere hands over the wallet completely.",
    ] },
    { type: "callout", text: "Golden rule: a genuine airdrop either lands in your wallet on its own, or is claimed on the project's own verified site with a transaction you can read. If claiming requires your seed phrase, an upfront payment, or a blind signature, it is theft." },
    { type: "p", text: "Because the danger is a malicious signature rather than a stolen password, the defence is understanding what you're approving. Our guides on [wallet drainers and approval scams](/guides/wallet-drainers-and-approval-scams/) and [how to avoid crypto scams](/guides/how-to-avoid-crypto-scams/) cover exactly how these signatures work and how to revoke ones you've already given." },

    { type: "h2", text: "Are airdrops taxable?" },
    { type: "p", text: "In most jurisdictions, yes — and in two separate ways. This surprises people who think \"free\" means tax-free. The general framework (always confirm your own country's rules):" },
    { type: "ul", items: [
      "On receipt — many tax authorities treat an airdrop as ordinary income at the token's fair market value on the day you receive it (or gain control of it). That value is taxable even if you never sell.",
      "On disposal — when you later sell or swap the tokens, that's a separate capital-gains event, calculated from the value you already declared as income (your cost basis).",
      "Timing and control matter — if a token is claimable but you haven't claimed it, some regimes don't tax it until you take control. Rules differ sharply by country.",
    ] },
    { type: "p", text: "The practical trap: a drop you received at a high launch price creates an income tax bill at that value, even if the token then crashes before you sell. Record the value on the day you receive every airdrop — that figure is both your income and your future cost basis." },
    { type: "tool", slug: "crypto-tax-calculator" },
    { type: "p", text: "For the full picture of how income and capital-gains events fit together, see our guide on [how crypto is taxed](/guides/crypto-taxes-explained/)." },

    { type: "h2", text: "Working out what an airdrop is actually worth" },
    { type: "p", text: "The headline \"$5,000 airdrop\" numbers you see are gross and often mark-to-peak. What you keep is the token amount times the price you can actually sell at, minus the gas you spent qualifying and claiming, minus the tax you'll owe on it. On a small drop those costs can eat most of the value — or all of it." },
    { type: "tool", slug: "crypto-airdrop-calculator" },
    { type: "p", text: "Run your real allocation and a realistic sell price through the numbers before you treat an airdrop as profit. \"Free\" tokens still have a cost, and the net is what matters." },

    { type: "h2", text: "The realistic bottom line" },
    { type: "ul", items: [
      "Airdrops are a real mechanism, but the life-changing ones are rare and mostly reward people who were early for genuine reasons — not full-time farmers.",
      "Chase them only on protocols you'd use anyway; treat any token as a bonus, and price in gas before you spend it.",
      "Never sign, pay or reveal a seed phrase to claim. That single rule prevents the vast majority of airdrop losses.",
      "Assume it's taxable on receipt, and log the value on the day. Your future self doing taxes will thank you.",
    ] },
  ],
  faq: [
    { q: "What is a crypto airdrop?", a: "An airdrop is when a project distributes its token for free to a set of wallet addresses — typically to decentralise ownership, reward early users, bootstrap a network, or market a launch. Tokens either arrive in your wallet automatically or are claimed on the project's official site." },
    { q: "How do I qualify for an airdrop?", a: "For the valuable retroactive drops, you qualify by genuinely using a protocol before it announces a token — real, repeated activity over time (swaps, liquidity, bridging, lending) with meaningful amounts. There's no guaranteed method; the behaviour that gets rewarded is that of a real long-term user, not a bot." },
    { q: "Are crypto airdrops taxable?", a: "In most countries, yes. Many tax authorities treat a received airdrop as ordinary income at its fair market value on the day you receive it, even if you don't sell. Selling later is a separate capital-gains event measured from that value. Rules on timing and control vary by country, so confirm your local treatment." },
    { q: "What is a Sybil attack in airdrops?", a: "A Sybil attack is one person using many wallets to claim an airdrop multiple times. Projects detect it by clustering wallets on shared funding sources, timing and identical transaction patterns, then disqualify whole clusters. It's the exact behaviour airdrops are designed to filter out, so it usually results in zero allocation." },
    { q: "How can I tell if an airdrop is a scam?", a: "A genuine airdrop never asks for your seed phrase, never requires an upfront payment to \"unlock\" tokens, and doesn't rely on a blind signature you can't read. Legit tokens either arrive on their own or are claimed on the project's verified official site. If any of those red flags appear, it's a scam designed to drain your wallet." },
    { q: "Is airdrop farming worth it?", a: "Often less than it looks. The headline values are gross and mark-to-peak, while your actual return is the sellable token value minus gas spent qualifying and claiming, minus tax on receipt. On small drops those costs can consume most or all of the value, so run the net numbers before treating a drop as profit." },
  ],
};

export default guide;
