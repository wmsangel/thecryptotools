import type { Guide } from "../types";

const guide: Guide = {
  slug: "liquid-staking-explained",
  title: "Liquid Staking Explained: stETH, rETH and the Risks Behind the Yield",
  description:
    "Liquid staking lets you earn staking rewards without locking your capital. That convenience is real — and so are the depeg, smart-contract and leverage risks it introduces.",
  readingMinutes: 7,
  updatedAt: "2026-07-21",
  seo: {
    keywords: [
      "liquid staking explained",
      "what is steth",
      "liquid staking tokens",
      "lst vs staking",
      "steth depeg",
      "liquid staking risks",
    ],
    description:
      "Liquid staking explained: how LSTs like stETH and rETH work, rebasing vs value-accruing tokens, why they can trade below par, restaking risk, and how to calculate your real net yield.",
  },
  relatedTools: ["staking-rewards-calculator", "yield-farming-apy-calculator", "impermanent-loss-calculator"],
  body: [
    { type: "p", text: "Ordinary staking forces a choice: earn rewards, or keep your capital usable. Liquid staking removes the choice. You deposit your coins with a protocol, it stakes them through professional validators, and you receive a token representing your claim on the staked position. That token keeps earning while remaining tradeable, lendable and usable as collateral. It is one of the genuinely useful ideas in DeFi — and it stacks several distinct risks on top of plain staking." },

    { type: "h2", text: "How a liquid staking token works" },
    { type: "p", text: "The protocol pools deposits, runs or delegates to a set of validators, and mints a receipt token to you. Rewards accrue to the pool and reach you in one of two ways, and knowing which matters for both DeFi integrations and your tax records." },
    { type: "ul", items: [
      "Rebasing tokens (stETH): your balance grows. Hold 10 today, hold slightly more tomorrow, while the token stays roughly one-to-one with the underlying asset. Simple to read, but some DeFi contracts handle a changing balance badly.",
      "Value-accruing tokens (rETH, wstETH, cbETH): your balance stays fixed and the token's redemption value rises. One token is worth progressively more than one ETH over time — so a price above 1 ETH is expected, not a premium.",
    ] },
    { type: "callout", text: "Do not compare a value-accruing LST's price to 1:1 and conclude it is trading rich. rETH and wstETH are designed to drift upward against ETH as rewards accumulate. The number that matters is the price against the protocol's own redemption rate." },

    { type: "h2", text: "Why the price can slip below par" },
    { type: "p", text: "An LST is redeemable for the underlying stake, but redemption is not instant — the protocol must exit validators and clear the exit queue. In calm markets arbitrage keeps the market price near the redemption value. In a rush for the exit, everyone who wants out immediately has to sell into secondary market liquidity instead of waiting for redemption, and the price drops below par until arbitrageurs absorb it." },
    { type: "p", text: "This is what happened to stETH in 2022, when it traded meaningfully below ETH for weeks. No coins were lost and it eventually converged, but leveraged positions collateralised by stETH were liquidated on the way down — which is the real lesson. A discount is survivable if you can wait. It is fatal if you borrowed against the position." },

    { type: "h2", text: "The risk stack" },
    { type: "ul", items: [
      "Smart-contract risk. Your stake sits behind protocol code. Audits reduce this risk; they do not remove it, and the largest protocols are the largest targets.",
      "Validator and slashing risk, socialised. The protocol's operators can be slashed, and the loss is shared across all holders rather than falling on one validator.",
      "Depeg / liquidity risk. Exiting fast means selling on the market at whatever the market offers that day.",
      "Governance and centralisation risk. Large liquid staking pools control a substantial share of total staked ETH, and a token vote can change fees, operator sets or parameters you were relying on.",
      "Leverage risk — the one that actually causes losses. Deposit LST, borrow against it, buy more of the underlying, stake again. It works until a discount and a liquidation cascade arrive together.",
      "Restaking, on top. Routing an LST into a restaking protocol layers additional slashing conditions from services you may never have evaluated. The extra yield is payment for extra ways to lose the principal.",
    ] },

    { type: "h2", text: "Working out the real yield" },
    { type: "p", text: "Start with the underlying network's staking rate, subtract the protocol's fee (commonly around 10% of rewards, split between node operators and the treasury), and you have the honest baseline. Any advertised figure well above that baseline is not coming from staking — it is a token incentive, a lending spread, or leverage, and it should be evaluated as such." },
    { type: "p", text: "Then subtract the frictions people forget: the swap or gas cost to enter and exit, the spread if you buy on the market rather than minting, and the discount you might eat if you exit under stress. On a small position those can exceed a year of yield." },
    { type: "tool", slug: "staking-rewards-calculator" },

    { type: "h2", text: "Using LSTs in DeFi" },
    { type: "p", text: "The whole point of a liquid staking token is the second use. Common ones are supplying it as lending collateral, or pairing it with the underlying asset in a liquidity pool. The pairing looks safe because the two assets track each other closely — and that is exactly why the impermanent loss is small in normal conditions and unpleasant during a depeg, when the correlation you were relying on breaks in the worst direction." },
    { type: "tool", slug: "impermanent-loss-calculator" },

    { type: "h2", text: "Is it worth it over plain staking?" },
    { type: "p", text: "If you have less than a validator minimum, or you want the capital to stay usable, liquid staking is the sensible route and the added risk is a fair price for it. If you were going to lock the coins for years and never touch them, plain delegated or solo staking gives you a similar yield with a shorter list of things that can go wrong — you are paying a protocol fee and taking smart-contract risk to buy liquidity you do not intend to use." },
    { type: "p", text: "Two habits keep people out of trouble: prefer the largest, longest-audited protocol available for the chain rather than whichever one is advertising the highest number, and treat any strategy that involves borrowing against an LST as a leveraged trade — because that is what it is, whatever the interface calls it." },
  ],
  faq: [
    { q: "What is the difference between stETH and wstETH?", a: "Same underlying position, different accounting. stETH rebases — your balance grows daily. wstETH keeps a fixed balance whose value against ETH rises instead, which makes it easier for DeFi contracts to handle. You can convert between them freely." },
    { q: "Can a liquid staking token go to zero?", a: "Not from staking economics alone — it is backed by real staked coins. It could collapse from a critical smart-contract exploit or a catastrophic mass-slashing event. Depeg episodes are far more common and historically temporary." },
    { q: "Is liquid staking safer than exchange staking?", a: "Different risk, not strictly less. Liquid staking swaps counterparty risk for smart-contract and governance risk, and gives you a tradeable asset instead of a locked balance. Neither is safe in the way solo staking with your own keys is." },
    { q: "Do I pay tax when I receive an LST?", a: "It depends on the jurisdiction and on whether the token rebases or accrues value, and guidance is still uneven. Rebasing rewards often look like income as received; value-accruing tokens may defer the event until disposal. Keep detailed records and confirm with a local professional." },
    { q: "Why would an LST trade below the underlying asset?", a: "Because redemption takes time. When many holders want out at once, they must sell into market liquidity rather than wait for the exit queue, pushing the price below the redemption value until arbitrage closes the gap." },
  ],
};

export default guide;
