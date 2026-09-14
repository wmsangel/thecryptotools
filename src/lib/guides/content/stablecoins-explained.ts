import type { Guide } from "../types";

const guide: Guide = {
  slug: "stablecoins-explained",
  title: "Stablecoins Explained: How the Peg Holds, and When It Doesn't",
  description:
    "What a stablecoin actually is, the three ways they hold a $1 peg, why USDC broke to $0.87 and UST went to zero, and how to judge whether the one you hold is safe.",
  readingMinutes: 12,
  updatedAt: "2026-09-14",
  reviewedAt: "2026-09-14",
  seo: {
    title: "Stablecoins Explained — Types, the Peg, and Whether They're Safe",
    keywords: [
      "what is a stablecoin",
      "stablecoins explained",
      "usdt vs usdc",
      "are stablecoins safe",
      "how do stablecoins work",
      "stablecoin depeg",
      "algorithmic stablecoin",
      "fiat backed stablecoin",
      "stablecoin yield",
    ],
    description:
      "How stablecoins keep a $1 peg, the difference between fiat-backed, crypto-backed and algorithmic designs, what really happened to UST and USDC, and how to check the reserves behind the one you hold.",
  },
  keyTakeaways: [
    "A stablecoin is a crypto token that **targets a fixed value** — almost always **$1** — so you can hold or move dollars on a blockchain.",
    "The three designs are **fiat-backed** (USDT, USDC), **crypto-backed and overcollateralised** (DAI), and **algorithmic** — and only the first two have survived stress.",
    "The peg is a **promise, not a law of physics**: USDC fell to **$0.87** for a weekend in 2023, and the algorithmic **UST went to zero** in days.",
    "\"Backed\" only matters if you can verify it — look for **reserve attestations**, what the reserves actually hold, and who the **issuer** and custodian are.",
    "**Stablecoin yield** is never free: the interest comes from lending, and the rate is the market pricing the **counterparty risk** you are taking.",
  ],
  relatedTools: [
    "crypto-price-converter",
    "apy-calculator",
    "yield-farming-apy-calculator",
    "crypto-savings-goal-calculator",
  ],
  sources: [
    {
      label: "Regulation (EU) 2023/1114 on Markets in Crypto-Assets (MiCA) — asset-referenced & e-money tokens",
      publisher: "EUR-Lex, European Union",
      url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R1114",
    },
    {
      label: "USDC Transparency & monthly reserve attestations",
      publisher: "Circle",
      url: "https://www.circle.com/en/transparency",
    },
    {
      label: "Transparency — reserves breakdown & attestations",
      publisher: "Tether",
      url: "https://tether.to/en/transparency/",
    },
  ],
  body: [
    { type: "p", text: "A stablecoin is a crypto token designed to hold a fixed value instead of floating like Bitcoin or Ether. Almost all of them target one US dollar. The point is simple: you get a dollar you can send on a blockchain — in seconds, to anyone, without a bank in the loop — while keeping the price stability that makes a dollar useful for saving, paying and pricing things." },
    { type: "p", text: "That combination is why stablecoins quietly became the most-used product in crypto. They are the default trading pair on every exchange, the way most people move money between platforms, the settlement layer for a growing share of cross-border payments, and the place traders park funds when they want out of the market without cashing back to a bank. Understanding how they hold their peg — and how that peg breaks — matters more than understanding almost any single coin." },

    { type: "h2", text: "Why a stablecoin exists at all" },
    { type: "p", text: "Regular crypto is a terrible unit of account for everyday use. If your salary, your rent and your coffee are all priced in a coin that can move 10% in a day, none of those numbers mean anything for long. A stablecoin puts a dollar on-chain so you can use blockchain rails — global, fast, programmable, open on weekends — without taking on price risk you did not want." },
    { type: "ul", items: [
      "Trading — stablecoin pairs (BTC/USDT, ETH/USDC) let you take profit or sit in cash without leaving the exchange or triggering a bank transfer.",
      "Payments and remittances — sending a stablecoin across the world settles in minutes for cents, versus days and percentage fees through correspondent banks.",
      "Saving in dollars — for people whose local currency is inflating, a dollar stablecoin is a way to hold hard currency that a domestic bank may not offer.",
      "DeFi — lending, borrowing and liquidity pools are mostly denominated in stablecoins, because a stable unit is what makes an interest rate or a loan-to-value ratio meaningful.",
    ] },
    { type: "callout", text: "A stablecoin is a dollar with crypto's plumbing and crypto's counterparty risk. You keep the convenience of a blockchain and you take on the question of whether the thing behind the token is really there — a question a bank deposit, for all its faults, mostly answers for you." },

    { type: "h2", text: "The three designs (and only two of them work)" },
    { type: "p", text: "Every stablecoin has to answer one question: what makes a token worth a dollar? There are three answers, and they carry very different risks." },

    { type: "h2", text: "1. Fiat-backed (USDT, USDC)" },
    { type: "p", text: "The issuer holds real dollars and dollar-equivalent assets — cash, bank deposits and short-term US Treasuries — and issues one token per dollar held. This is the dominant model by far: Tether's USDT and Circle's USDC together account for the large majority of all stablecoin value in circulation. The peg holds because the issuer promises to redeem each token for a real dollar, so anyone can arbitrage a gap: if the token trades at $0.99, buy it and redeem for $1." },
    { type: "p", text: "The risk is entirely about the reserves. Are the dollars actually there? Are they in safe, liquid assets or in something that could lose value or freeze up? Can you actually redeem, or only large approved partners? \"Fiat-backed\" is a claim about a bank account you cannot see, which is why attestations and transparency reports are the whole game — more on verifying them below." },

    { type: "h2", text: "2. Crypto-backed and overcollateralised (DAI)" },
    { type: "p", text: "Instead of dollars in a bank, this model locks crypto in a smart contract as collateral. Because crypto is volatile, it has to be overcollateralised — you might lock $150 of ETH to mint $100 of the stablecoin. If the collateral falls toward the value of the debt, the position is liquidated automatically to keep every token backed. MakerDAO's DAI is the archetype." },
    { type: "p", text: "The advantage is transparency and decentralisation: the collateral is on-chain and anyone can verify it in real time, with no bank to trust. The cost is capital inefficiency — you tie up more value than you get out — and a dependence on those liquidations working smoothly during exactly the kind of violent crash when they are hardest to execute." },

    { type: "h2", text: "3. Algorithmic (the graveyard)" },
    { type: "p", text: "Algorithmic stablecoins try to hold the peg with no real backing at all — using a paired token and a mint-and-burn mechanism that is supposed to expand and contract supply to push the price back to $1. It works while confidence holds and fails catastrophically when it doesn't, because there is nothing underneath to redeem against. When the market stops believing, the mechanism accelerates the collapse instead of stopping it." },
    { type: "callout", text: "In May 2022, TerraUSD (UST) — an algorithmic stablecoin with tens of billions of dollars in market value — lost its peg and collapsed to near zero within days, taking its paired token LUNA down with it and erasing roughly $40 billion. It is the clearest lesson in crypto: a stablecoin with nothing real behind it is stable only until the first serious test." },

    { type: "h2", text: "The peg is a promise, not a law" },
    { type: "p", text: "Even a well-run, fully-backed stablecoin can lose its peg temporarily, because the peg is maintained by arbitrage and confidence — not by a magic force that pins the price at $1. When redemption is doubted or the reserves are questioned, holders sell first and ask later." },
    { type: "p", text: "The sharpest example among the reputable coins: in March 2023, Circle disclosed that a portion of USDC's cash reserves was held at Silicon Valley Bank, which had just failed. Over that weekend USDC fell to about $0.87 before recovering to $1 once it became clear the deposits would be made whole. USDC was genuinely backed — but a reserve held at a bank that failed was enough to break the peg for two days. The reserves were fine; the question of whether they were fine was enough." },
    { type: "p", text: "The practical takeaways: a stablecoin trading a cent or two off $1 during stress is not automatically a fraud, and one that is 'backed' is not automatically immune. What matters is what the reserves are and whether redemption actually works when it is tested." },
    { type: "tool", slug: "crypto-price-converter" },

    { type: "h2", text: "Are stablecoins safe? How to actually check" },
    { type: "p", text: "\"Backed\" is a claim, and a claim is only worth what you can verify. Before you trust a stablecoin with meaningful money, work through the same short checklist a cautious institution would." },
    { type: "ul", items: [
      "What is in the reserves? Cash and short-term US Treasuries are the gold standard — liquid and hard to lose. Commercial paper, loans, other crypto or the issuer's own token are progressively weaker backing.",
      "Attestation or audit? Most issuers publish monthly attestations — an accounting firm confirming the reserves existed on a given date. That is weaker than a full financial audit, but regular attestations from a credible firm are a real signal. No transparency at all is a red flag.",
      "Who is the issuer, and where? A regulated issuer in a known jurisdiction has more to lose from lying than an anonymous team offshore. Regulation is not a guarantee, but it changes the incentives.",
      "Can you redeem? A peg is held by arbitrage, which only works if tokens can actually be redeemed for dollars. If only a few approved partners can redeem, the peg depends on those partners staying willing.",
      "How big and how liquid? A large, widely-traded stablecoin has deeper markets to absorb a panic than a small one, where a single large seller can move the price.",
    ] },
    { type: "callout", text: "The single best habit: prefer stablecoins backed by cash and short-term Treasuries, from an issuer that publishes regular reserve attestations you can read. Everything else — yield, convenience, which chain it is on — is secondary to whether the dollar is really there." },

    { type: "h2", text: "USDT vs USDC: the two that matter" },
    { type: "p", text: "In practice most people are choosing between the two dominant fiat-backed coins, and the honest summary is that both are widely used and both publish reserve reports, with different reputations." },
    { type: "table",
      headers: ["", "USDT (Tether)", "USDC (Circle)"],
      rows: [
        { cells: ["Issuer", "Tether", "Circle"] },
        { cells: ["Backing model", "Fiat-backed (cash, Treasuries & other assets)", "Fiat-backed (cash & short-term Treasuries)"] },
        { cells: ["Liquidity", "Largest; deepest pairs everywhere", "Very large; strong in US & DeFi"] },
        { cells: ["Reserve reporting", "Regular attestations", "Regular attestations"] },
        { cells: ["Typical reputation", "Most liquid; historically more scrutiny over reserve detail", "Positioned as the transparency/compliance choice"] },
      ],
      caption: "A general comparison, not an endorsement — verify each issuer's current reserve report yourself before relying on either.",
    },
    { type: "p", text: "For most users the deciding factors are which coin your exchange or protocol supports best, which has the deepest liquidity for what you are doing, and which issuer's transparency you are more comfortable with. Neither is risk-free; both have far more behind them than any algorithmic experiment ever did." },

    { type: "h2", text: "Where stablecoin yield comes from — and why it's never free" },
    { type: "p", text: "You will constantly be offered 'earn 5%, 10%, 20% on your stablecoins'. The stablecoin itself pays nothing — a dollar token sitting in your wallet earns zero. Any yield means someone is paying to borrow your coins, and the rate is the market's price for the risk you are taking on to earn it." },
    { type: "ul", items: [
      "Lending on a DeFi protocol — borrowers pay interest; your risk is a smart-contract bug or a market crash that breaks the protocol's liquidations.",
      "A centralised platform's 'earn' account — the platform lends your coins out; your risk is the platform itself, and several large ones failed in 2022 and returned cents on the dollar.",
      "Liquidity provision and yield farming — fees and token rewards, with the added risk of the pool and of impermanent loss.",
    ] },
    { type: "callout", text: "The rule of thumb: a stablecoin yield well above what short-term Treasuries pay is not a better deal, it is a riskier one. The extra percentage points are compensation for a risk — find out what that risk is before you decide the rate is worth it." },
    { type: "tool", slug: "yield-farming-apy-calculator" },
    { type: "p", text: "If you are comparing offers, convert every rate to the same basis before you judge it — a quoted APR that compounds is not the same as the APY you actually receive, and 'up to' rates rarely apply to normal balances." },
    { type: "tool", slug: "apy-calculator" },

    { type: "h2", text: "Regulation is arriving" },
    { type: "p", text: "Stablecoins spent their first decade in a legal grey zone. That is changing. In the EU, the MiCA regulation now sets explicit rules for stablecoin issuers — reserve, redemption and disclosure requirements for what it calls asset-referenced and e-money tokens. Other major jurisdictions are moving toward similar frameworks: reserve backing, redemption rights and regular reporting, enforced by law rather than left to the issuer's goodwill." },
    { type: "p", text: "For a holder this is mostly good news — clearer rules make the reputable coins safer and push the reckless designs out — but it is evolving fast and differs by country. Treat the regulatory status of any specific coin as something to check at the time, not a settled fact, and be aware that where a stablecoin is legally allowed can change which one your exchange offers you." },

    { type: "h2", text: "Using stablecoins sensibly" },
    { type: "ul", items: [
      "Spread large balances across more than one reputable stablecoin, so a single depeg or issuer problem is not your whole position.",
      "Prefer cash-and-Treasuries backing with published attestations over anything promising an unusual yield.",
      "Remember that holding a stablecoin still carries issuer and smart-contract risk — it is not the same as an insured bank deposit, whatever the marketing implies.",
      "Double-check the network before you send: sending USDC or USDT on the wrong chain, or to an address on a network the recipient doesn't support, can lose the funds.",
      "If you are parking money to buy a dip later, a stablecoin is dry powder that stays on-chain — but size it as money at risk, not as cash in the bank.",
    ] },
    { type: "tool", slug: "crypto-savings-goal-calculator" },
    { type: "p", text: "Stablecoins are the closest thing crypto has to a dollar, and for moving and holding value on-chain they are genuinely useful. Just keep the one fact in view that the peg's smooth $1.00 line is designed to make you forget: a stablecoin is only ever as good as the reserves and the issuer behind it, and the time to check those is before you need them, not during the weekend the peg wobbles." },
  ],
  faq: [
    { q: "What is the safest stablecoin?", a: "There is no risk-free stablecoin, but the safest designs are fiat-backed coins whose reserves are held in cash and short-term US Treasuries, from a regulated issuer that publishes regular reserve attestations you can read. USDC and USDT are the two largest; verify each issuer's current reserve report rather than trusting reputation alone." },
    { q: "Can a stablecoin lose its value?", a: "Yes. An algorithmic stablecoin can collapse entirely — UST went to near zero in 2022. Even a fully-backed one can lose its peg temporarily: USDC fell to about $0.87 for a weekend in 2023 when part of its reserves sat at a failed bank, before recovering to $1. The peg is a promise held by confidence and arbitrage, not a guarantee." },
    { q: "What is the difference between USDT and USDC?", a: "Both are large fiat-backed stablecoins that publish reserve attestations. USDT (Tether) is the most liquid and traded almost everywhere; USDC (Circle) positions itself as the transparency and compliance choice. For most users the deciding factor is which one your exchange or protocol supports best." },
    { q: "How do stablecoins make money for the issuer?", a: "The issuer holds your dollars in interest-bearing reserves — mostly short-term Treasuries — and keeps the interest. On billions of dollars of backing, that is a very large, low-risk income, which is why the fiat-backed model is so profitable and so competitive." },
    { q: "Is stablecoin yield safe?", a: "The yield is never free — it comes from lending your coins out, and the rate reflects the risk. A DeFi protocol carries smart-contract risk; a centralised 'earn' account carries platform risk, and several large platforms failed in 2022. A yield well above short-term Treasury rates is compensation for a risk you should identify before accepting it." },
    { q: "Are stablecoins better than keeping money in a bank?", a: "They are different, not strictly better. Stablecoins move globally in minutes and settle on weekends, and can be a way to hold dollars where local banking is weak. But they lack deposit insurance and carry issuer and smart-contract risk a bank deposit does not. Use them for what they are good at, not as a replacement for insured savings." },
  ],
};

export default guide;
