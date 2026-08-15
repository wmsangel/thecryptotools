import type { Guide } from "../types";

const guide: Guide = {
  slug: "ethereum-staking-guide",
  title: "Ethereum Staking Guide: Solo, Pooled, Exchange and Liquid Compared",
  description:
    "Four ways to stake ETH, with genuinely different economics and risks. What the yield is made of, what each route costs you, and how long your money is actually locked.",
  readingMinutes: 8,
  updatedAt: "2026-07-21",
  seo: {
    keywords: [
      "ethereum staking",
      "how to stake eth",
      "eth staking rewards",
      "solo staking ethereum",
      "liquid staking eth",
      "32 eth validator",
    ],
    description:
      "How Ethereum staking works: the 32 ETH validator minimum, where staking yield comes from, solo vs pooled vs exchange vs liquid staking, exit queues, slashing and how to calculate your real return.",
  },
  relatedTools: ["staking-rewards-calculator", "apy-calculator", "compound-interest-calculator"],
  body: [
    { type: "p", text: "Ethereum stopped being mined in 2022. Blocks are now proposed and attested by validators who have locked ETH as collateral, and the network pays them for doing it honestly. Staking is how you become one of those validators, directly or through someone else. The mechanics are the same in every case; what changes is who holds the keys and who takes a cut." },

    { type: "h2", text: "Where the yield comes from" },
    { type: "p", text: "An ETH staking return has three components, and only understanding all three explains why quoted rates move around. The consensus layer pays newly issued ETH for attesting and proposing — this is the base rate, and it falls as more total ETH is staked, because the same issuance is split more ways. The execution layer adds priority fees from users' transactions. On top of that, most validators capture MEV — value from how transactions are ordered in a block — which arrives lumpily and inflates averages during volatile weeks." },
    { type: "p", text: "The practical consequence: the base issuance component is predictable and declines as staking participation rises, while the fee and MEV components track network activity. A quiet market means a materially lower real yield than a busy one, regardless of what the dashboard advertised when you deposited." },
    { type: "callout", text: "Always check whether a quoted figure is APR or APY, and whether it includes MEV. The same validator can be advertised at two visibly different numbers depending on which convention flatters it more." },

    { type: "h2", text: "Solo staking" },
    { type: "p", text: "You run your own validator: 32 ETH per validator, your own execution and consensus clients, and uptime. You keep the entire reward, you hold your own keys, and you add a genuinely independent node to the network rather than concentrating stake with a large operator." },
    { type: "ul", items: [
      "Highest net yield — there is no commission because there is no intermediary.",
      "Real operational burden: client updates, disk space that grows continuously, and downtime that costs you small inactivity penalties.",
      "You carry slashing risk yourself. Slashing punishes provably malicious behaviour — double-signing being the classic cause, and running the same validator keys on two machines at once being the classic way honest people do it by accident.",
      "Since the Pectra upgrade, a validator can hold a larger effective balance rather than being capped at 32 ETH, so rewards on top of the minimum can compound in place instead of sitting idle until you have another full 32.",
    ] },

    { type: "h2", text: "Pooled and staking-as-a-service" },
    { type: "p", text: "You supply ETH; a professional operator runs the infrastructure and takes a commission, typically in the 5–15% range of rewards. Some services let you keep withdrawal credentials under your own control while delegating only the operational duties, which meaningfully reduces what you are trusting the operator with. There is usually no 32 ETH minimum. You are trading a slice of yield for not being on call when a client release breaks at 3am." },

    { type: "h2", text: "Exchange staking" },
    { type: "p", text: "The one-click option on Binance, Kraken, Coinbase and others. It is genuinely the simplest route and it has the highest cut — plus the exchange holds your ETH, which converts a technical risk into a counterparty risk. It also concentrates stake in a handful of operators, which is the thing Ethereum's decentralisation depends on not happening. Fine for a modest position you want to stop thinking about; a poor home for a large long-term stack." },
    { type: "tool", slug: "staking-rewards-calculator" },

    { type: "h2", text: "Liquid staking" },
    { type: "p", text: "You deposit ETH and receive a token representing the staked position — stETH, rETH, cbETH and others. The position keeps earning while the receipt token stays tradeable and usable as DeFi collateral, so you are not locked out of your capital. In return you take on smart-contract risk and the possibility that the receipt trades below the underlying ETH when everyone wants out at once, as stETH did during the 2022 stress. Covered in more depth in our liquid staking guide." },

    { type: "h2", text: "Getting your ETH back" },
    { type: "p", text: "Withdrawals have worked since the Shapella upgrade in 2023, so staked ETH is no longer trapped — but it is not instant either. Rewards above the effective balance are swept automatically every few days. A full exit means joining an exit queue whose length depends on how many others are leaving at the same time: usually days, occasionally much longer during a rush. Plan around that. If you might need the ETH inside a week under stress, staked ETH is the wrong place for it — and that is precisely the gap liquid staking tokens exist to fill." },

    { type: "h2", text: "Working out your real return" },
    { type: "p", text: "Start with the gross rate, subtract commission, then account for compounding. A 3.5% gross rate with a 10% operator fee is 3.15% net. Auto-compounding lifts the effective figure slightly; manual claiming on a small position can be eaten by transaction fees entirely." },
    { type: "p", text: "The bigger correction is denomination. ETH staking pays in ETH. A 3.5% yield on an asset that falls 30% is a 30% loss with a rounding error attached. Staking is a way to accumulate more of an asset you already intended to hold for years — it is not a hedge, an income strategy, or a reason to buy ETH you otherwise would not have bought." },
    { type: "tool", slug: "compound-interest-calculator" },

    { type: "h2", text: "Which route fits" },
    { type: "ul", items: [
      "32+ ETH, comfortable with a Linux box and updates: solo stake. Best yield, best for the network, most work.",
      "32+ ETH, no appetite for operations: a staking service, ideally one where you retain withdrawal credentials.",
      "Under 32 ETH, want the capital to stay usable: liquid staking, accepting smart-contract and depeg risk.",
      "Small position, want it simple: exchange staking, understanding you are lending the exchange your ETH.",
    ] },
  ],
  faq: [
    { q: "How much ETH do I need to stake?", a: "Running your own validator requires 32 ETH. Pooled, exchange and liquid staking have effectively no minimum — you can stake a fraction of an ETH, though on tiny amounts transaction fees can outweigh the rewards." },
    { q: "What is the current ETH staking yield?", a: "It moves. The consensus component falls as total staked ETH rises, while fee and MEV income tracks network activity, so rates have generally sat in the low single digits post-Merge. Check a live figure rather than trusting a number in an article, including this one." },
    { q: "Can I lose ETH by staking?", a: "Slashing destroys a portion of the stake for provably malicious actions such as double-signing, and prolonged downtime causes small inactivity penalties. Neither happens to a correctly run validator. The larger real-world risks are custodial failure and smart-contract bugs, depending on the route you choose." },
    { q: "How long does it take to unstake ETH?", a: "Reward sweeps happen automatically every few days. A full exit joins a queue that is typically days but stretches when many validators leave at once. Liquid staking tokens sidestep the wait by letting you sell the receipt token on the open market instead." },
    { q: "Are ETH staking rewards taxed?", a: "In most jurisdictions staking rewards are income at the value on the day you gain control of them, and a later disposal is a separate capital gains event. Treatment varies by country — see our tax guides and confirm with a local professional." },
  ],
};

export default guide;
