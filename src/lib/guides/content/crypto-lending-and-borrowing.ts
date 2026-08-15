import type { Guide } from "../types";

const guide: Guide = {
  slug: "crypto-lending-and-borrowing",
  title: "Crypto Lending and Borrowing: The Yield, the Liquidation Price, and the Counterparty",
  description:
    "What a crypto lending yield has to be worth to justify the platform risk, why the liquidation price matters more than the interest rate when borrowing, and what depositors actually recovered when the lenders failed.",
  readingMinutes: 13,
  updatedAt: "2026-08-11",
  reviewedAt: "2026-08-11",
  seo: {
    title: "Crypto Lending & Borrowing Explained — Yields, LTV and Liquidation",
    keywords: [
      "crypto lending",
      "crypto lending rates",
      "borrow against crypto",
      "crypto backed loan",
      "crypto loan ltv",
      "crypto liquidation price loan",
      "is crypto lending safe",
      "crypto interest account risk",
      "crypto mortgage",
    ],
    description:
      "How crypto lending and borrowing actually work: the break-even failure probability that tells you whether a yield is worth taking, how LTV sets your liquidation price, and what Celsius and BlockFi depositors really got back.",
  },
  relatedTools: [
    "crypto-lending-calculator",
    "crypto-loan-ltv-calculator",
    "crypto-mortgage-calculator",
    "liquidation-calculator",
  ],
  sources: [
    {
      label: "In re Celsius Network LLC — official case docket",
      publisher: "Stretto (court-appointed claims agent)",
      url: "https://cases.stretto.com/celsius/",
    },
    {
      label: "FTC reaches settlement with Voyager Digital — $1.65 billion judgment",
      publisher: "Federal Trade Commission",
      url: "https://www.ftc.gov/news-events/news/press-releases/2023/10/ftc-reaches-settlement-crypto-company-voyager-digital-charges-former-executive-falsely-claiming",
    },
  ],
  body: [
    {
      type: "p",
      text: "There are two sides to this market and they fail in completely different ways. If you deposit coins to earn a yield, your risk is that the platform does not give them back. If you post coins as collateral to borrow against them, your risk is that the price falls and the platform sells your collateral out from under you. Both are usually explained with a single headline number — the APY, or the interest rate — and in both cases that number is the least important thing on the page.",
    },

    { type: "h2", text: "Lending: how good does the yield have to be?" },
    {
      type: "p",
      text: "When you lend crypto you are making a bet with a shape you can write down. If the platform survives the year you end up with your coins plus the interest. If it fails you end up with whatever the bankruptcy eventually returns. Holding the coins yourself returns exactly what you started with. Set those equal and you get the probability of failure at which lending stops being worth it.",
    },
    {
      type: "callout",
      text: "Break-even failure probability p = r ÷ (1 + r − R), where r is the yield and R is what you would recover from a failure. With no recovery at all, an 8% APY is only worth taking if the platform is at least 92.6% likely to still be solvent in a year.",
    },
    {
      type: "p",
      text: "That framing is more useful than asking \"is 8% a good rate?\", because it converts an opinion into a question about the counterparty. You are not being paid 8% for nothing. You are being paid 8% to accept a risk, and the arithmetic tells you how small that risk has to be before the payment covers it.",
    },
    {
      type: "table",
      caption: "The annual failure probability at which lending stops paying for itself",
      headers: ["Yield offered", "If failure means total loss", "At a 20% real recovery", "At a 65% dollar recovery"],
      rows: [
        { cells: ["3%", "2.9%", "3.6%", "7.9%"] },
        { cells: ["5%", "4.8%", "5.9%", "12.5%"] },
        { cells: ["8%", "7.4%", "9.1%", "18.6%"] },
        { cells: ["12%", "10.7%", "13.0%", "25.5%"] },
        { cells: ["20%", "16.7%", "20.0%", "36.4%"] },
      ],
    },
    {
      type: "p",
      text: "Read down the first column and the discipline becomes obvious: a 20% yield is telling you, in the platform's own numbers, that it thinks a one-in-six annual failure rate is roughly fair compensation. Nobody advertising 20% describes it that way, but that is what the rate means.",
    },
    { type: "tool", slug: "crypto-lending-calculator" },

    { type: "h2", text: "What recovery actually looked like" },
    {
      type: "p",
      text: "The two right-hand columns exist because \"total loss\" is not what happened in the big failures, and pretending otherwise would overstate the case. The 2022 lending collapse — Celsius, Voyager, BlockFi, Genesis and others — froze more than ten billion dollars of customer assets, and creditors did eventually get a lot of it back. BlockFi's plan administrator ultimately achieved essentially full recovery on allowed claims after selling its FTX bankruptcy claims at a premium. Celsius has distributed billions, reaching roughly 65% cumulative recovery against a stated target range of 67–85%.",
    },
    {
      type: "p",
      text: "So far this sounds reassuring. It stops sounding reassuring the moment you ask what the claim was denominated in.",
    },
    {
      type: "callout",
      text: "Celsius customer claims were dollarised at the petition date — 13 July 2022 — when bitcoin was $19,881 and ether was $1,088. You were not owed your coins. You were owed the dollar value of your coins on the worst day of the cycle.",
    },
    {
      type: "p",
      text: "Work that through for someone who had one bitcoin on the platform. Their claim was $19,881. At around 65% recovery they received roughly $12,900. That bitcoin is worth about $64,000 today — so in the terms that actually mattered to them, a holder, they recovered around 20% of the asset. Even at the optimistic end of the target range, 85%, the figure is about 26%.",
    },
    {
      type: "p",
      text: "This is why the second column of the table, not the third, is the honest one for anyone who intended to hold. A dollar recovery rate published years later, measured against a bottom-of-market valuation, is not the same as getting your coins back — and the delay is its own cost, because Celsius filed in July 2022 and distributions ran for years afterwards.",
    },
    {
      type: "ul",
      items: [
        "Your claim is frozen in dollars at the date the platform stops paying — typically a market low, because that is what caused the failure",
        "You lose all upside from that date, while the recovery process runs for years",
        "You are an unsecured creditor, ranking behind secured lenders — Celsius argued in court that customer deposits belonged to Celsius, not the customers",
        "The recovery itself may be paid partly in equity of a restructured entity rather than in cash or coins",
      ],
    },
    {
      type: "p",
      text: "None of this makes lending irrational. It makes the price of it legible: the yield has to compensate for a risk whose realistic bad outcome is recovering a fifth of the asset, several years later, not for a risk of a modest haircut.",
    },

    { type: "h2", text: "Where the yield comes from" },
    {
      type: "p",
      text: "One question separates a sustainable rate from an unsustainable one: who is paying it, and why. Legitimate answers exist. Borrowers pay interest to take leverage or to avoid selling; market makers pay to fund inventory; a protocol's own utilisation curve sets a rate that borrowers genuinely pay. Those yields move with demand and are usually unexciting.",
    },
    {
      type: "p",
      text: "The unsustainable answers are also recognisable. A fixed, generous, always-available headline rate that does not move with market conditions is not being generated by borrowing demand, because borrowing demand is not fixed. It is being paid out of a token the platform issues, out of new deposits, or out of proprietary trading that you are not being told about. Celsius offered up to 17%.",
    },
    {
      type: "callout",
      text: "A quoted APY already contains its compounding. Asking whether interest is paid daily, weekly or monthly does not change the annual outcome — the only choice that changes anything is whether you compound the interest back in or withdraw it.",
    },

    { type: "h2", text: "Borrowing: the interest rate is not the headline" },
    {
      type: "p",
      text: "The other side of the market is more predictable and, done carefully, more defensible. You post crypto as collateral, borrow cash or stablecoins against it, and keep your exposure — which in most countries also means you have not made a taxable disposal, though that is a question for your own rules rather than a general truth.",
    },
    {
      type: "p",
      text: "Everything here is decided by loan-to-value. Borrow $30,000 against $100,000 of bitcoin and you are at 30% LTV. As the price falls, that ratio rises, because the debt is fixed and the collateral is not. Cross the platform's threshold and the collateral gets sold — at whatever the price is at that moment, which is by definition a bad one.",
    },
    {
      type: "table",
      caption: "Starting LTV against the fall that triggers liquidation at an 80% threshold",
      headers: ["Starting LTV", "Borrowed against $100,000", "Price fall that liquidates you"],
      rows: [
        { cells: ["20%", "$20,000", "−75%"] },
        { cells: ["30%", "$30,000", "−62.5%"] },
        { cells: ["50%", "$50,000", "−37.5%"] },
        { cells: ["65%", "$65,000", "−18.8%"] },
        { cells: ["75%", "$75,000", "−6.3%"] },
      ],
    },
    {
      type: "p",
      text: "That last row is the whole lesson. A 75% LTV loan is not an aggressive version of a 30% LTV loan — it is a different product, one that a routine Tuesday can end. Bitcoin has fallen 6% in a day many times without anything notable happening.",
    },
    {
      type: "callout",
      text: "For any crypto-backed loan, including a crypto-backed mortgage, the number to write down before you sign is the liquidation price — not the monthly payment and not the interest rate. It is the only figure that distinguishes the loan from an ordinary bank loan.",
    },
    { type: "tool", slug: "crypto-loan-ltv-calculator" },
    {
      type: "p",
      text: "Two mechanics catch people out. First, interest usually accrues to the loan balance rather than being billed separately, so your LTV rises over time even if the price does nothing at all — a loan you opened at a comfortable ratio drifts toward the threshold on its own. Second, a margin call and a liquidation are different events with different deadlines, and the window between them can be hours. If your plan for a margin call involves moving funds from a bank, you do not have a plan.",
    },

    { type: "h2", text: "Borrowing to buy the thing you posted" },
    {
      type: "p",
      text: "The most common use of a crypto-backed loan is to buy more crypto with it, and it deserves naming for what it is: leverage, with the same liquidation mechanics as a futures position but usually described in gentler language. If your collateral and your purchase are the same asset — or, given the correlations in this market, almost any two crypto assets — then a fall hits both sides at once. The collateral drops as the position drops, so the LTV deteriorates faster than the price does.",
    },
    {
      type: "p",
      text: "The uses that hold up better are the ones where the borrowed money leaves the market: a tax bill, a property deposit, a business expense, bridging a gap without triggering a disposal in a year when you have gains. There the loan is doing something a sale would also have done, and you are paying interest to avoid the tax and keep the upside — a comparison you can actually run the numbers on.",
    },
    { type: "tool", slug: "crypto-mortgage-calculator" },

    { type: "h2", text: "Custody, and the question that answers most of the others" },
    {
      type: "p",
      text: "Ask one thing of any lending platform: when my coins are with you, whose are they? Centralised lenders take title to your assets — that is how they can lend them on, and it is why depositors ranked as unsecured creditors rather than owners. Some now offer segregated custody or on-chain proof of reserves; a proof of reserves without a matching proof of liabilities tells you very little.",
    },
    {
      type: "p",
      text: "On-chain lending answers the question differently rather than making it disappear. Collateral sits in a contract with public rules, liquidation is automatic and visible, and there is no company to freeze withdrawals. In exchange you take smart-contract risk, oracle risk and the possibility of being liquidated inside a few blocks during congestion, with no support desk. It is a different risk, not a smaller one — but it is one you can inspect.",
    },
    {
      type: "ul",
      items: [
        "Never post collateral you cannot afford to lose entirely — liquidation is designed to protect the lender, not you",
        "Keep a reserve you can add to the collateral quickly, and know how long a transfer to that platform actually takes",
        "Write down the liquidation price and set an alert well above it, not at it",
        "Treat any fixed, market-independent yield as a claim requiring evidence rather than a rate",
        "Split large deposits across platforms — the failures of 2022 were not independent, but they were not simultaneous either",
      ],
    },
  ],
  faq: [
    {
      q: "Is crypto lending safe?",
      a: "It is a credit decision, not a savings account. You are an unsecured creditor of the platform, and the 2022 failures showed what that means: claims frozen in dollars at the petition date, recovery paid over years, and in Celsius's case roughly 65 cents on a dollar that had itself been fixed at a market low. Whether the yield compensates for that depends on the platform, which is what the break-even table on this page is for.",
    },
    {
      q: "What happened to Celsius and BlockFi depositors?",
      a: "Both eventually paid out substantially, but the denomination matters. BlockFi ultimately reached essentially full recovery on allowed claims after monetising its FTX claims. Celsius has reached around 65% cumulative recovery against a 67–85% target — but claims were dollarised at 13 July 2022, when bitcoin was $19,881, so someone who held one bitcoin recovered roughly 20% of what that coin is worth today.",
    },
    {
      q: "What LTV is safe for a crypto-backed loan?",
      a: "Lower than most platforms will let you take. At an 80% liquidation threshold, a 30% starting LTV survives a 62% fall while a 65% LTV is liquidated by a 19% one — and a 19% fall is an ordinary week in this market. Also remember that accrued interest pushes your LTV up over time even if the price never moves.",
    },
    {
      q: "Do I pay tax when I borrow against my crypto?",
      a: "In most jurisdictions taking a loan is not a disposal, so no gain is realised — which is one of the main reasons people borrow instead of sell. A liquidation, however, is a forced sale and is taxable in the ordinary way, usually in a year when you did not choose it and at a price you did not choose. Check the rules for your own country before relying on this.",
    },
    {
      q: "Does daily compounding make a lending rate better?",
      a: "No. A quoted APY already includes whatever compounding the platform applies, so daily, weekly and monthly quotes of the same APY produce the same annual result. The only decision that changes your outcome is whether you compound the interest back in or withdraw it as it is paid.",
    },
    {
      q: "Is DeFi lending safer than a centralised platform?",
      a: "Different, not safer. It removes the counterparty who can freeze withdrawals or take title to your coins, and it makes collateral and liquidation rules publicly inspectable. It adds smart-contract bugs, oracle manipulation, governance risk and liquidation inside a few blocks during congestion — with nobody to appeal to afterwards.",
    },
    {
      q: "Why would I borrow instead of just selling?",
      a: "To keep the exposure and, in most countries, to avoid triggering a taxable disposal. That trade is defensible when the borrowed money leaves the market — a tax bill, a property purchase, a business need. It is much weaker when the borrowed money buys more of the same asset, because then a price fall damages the collateral and the position at the same time.",
    },
  ],
};

export default guide;
