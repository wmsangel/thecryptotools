import type { Guide } from "../types";

const guide: Guide = {
  slug: "multisig-wallets-explained",
  title: "Multisig Wallets Explained: When 2-of-3 Beats a Hardware Wallet",
  description:
    "Multisig removes the single point of failure that every seed phrase creates. It also introduces new ways to lock yourself out. Here is how it works, when the trade is worth it, and what a workable setup looks like.",
  readingMinutes: 9,
  updatedAt: "2026-07-30",
  seo: {
    keywords: [
      "multisig wallet",
      "2 of 3 multisig",
      "bitcoin multisig setup",
      "safe multisig ethereum",
      "multisig vs hardware wallet",
      "shared crypto custody",
    ],
    description:
      "How multisig wallets work, why 2-of-3 is the standard choice, the difference between Bitcoin script multisig and Ethereum smart-contract multisig, what you must back up beyond seed phrases, and when the complexity is justified.",
  },
  relatedTools: ["gas-fee-calculator", "satoshi-converter", "crypto-price-converter"],
  body: [
    { type: "p", text: "A normal wallet has one key. That key is a single point of failure in both directions: whoever obtains it takes everything, and if you lose it everything is gone. Every backup strategy for a single-key wallet is an attempt to work around that fact, and each one trades theft risk against loss risk without ever escaping the trade." },
    { type: "p", text: "Multisig escapes it. Funds are locked to several keys with a rule attached: any m of n must sign. In the standard 2-of-3, three keys exist, any two can spend, and no single one can do anything alone. One key stolen is not a loss. One key destroyed is not a loss. That is a genuinely different security model rather than a stricter version of the same one." },

    { type: "h2", text: "What m-of-n actually buys you" },
    { type: "ul", items: [
      "2-of-3 is the default for individuals: it survives the loss of any one key and the theft of any one key. Two things must go wrong simultaneously before you are in trouble.",
      "2-of-2 has no redundancy. It doubles theft resistance and doubles the chance of permanent loss. Rarely the right answer for savings.",
      "3-of-5 suits shared or organisational custody, where keyholders are people and some of them will be unavailable.",
      "Keys can be held on devices from different manufacturers, so a firmware bug or supply-chain problem affecting one vendor does not compromise the wallet.",
      "Keys can live in different physical locations, so a fire, a burglary or a flood reaches at most one of them.",
    ] },
    { type: "p", text: "The last two points matter more than they first appear. A single hardware wallet with two metal backups still concentrates everything into one secret — anyone who reads that secret in either location wins. Multisig means the secret does not exist in one place at all." },

    { type: "h2", text: "Bitcoin multisig and Ethereum multisig are different things" },
    { type: "p", text: "The word covers two distinct mechanisms, and confusing them causes real problems." },
    { type: "ul", items: [
      "On Bitcoin, multisig is native to the protocol. The spending condition is part of the script, enforced by consensus, with no contract that can contain a bug. Unsigned transactions move between devices as PSBTs (partially signed Bitcoin transactions) — you sign on one device, carry the file to the next, and broadcast when the threshold is met.",
      "On Ethereum and other EVM chains, multisig is a smart contract holding the funds — Safe being the dominant implementation. The rules are code, which makes them far more flexible: spending limits, role separation, module extensions, changing the signer set without moving the funds.",
      "That flexibility has a cost. Bitcoin multisig inherits the security of the base protocol; contract multisig inherits the security of the contract, plus whatever governance controls it. Widely used implementations are heavily audited, but it is a different assumption.",
      "Fees also differ. Bitcoin multisig transactions are physically larger and cost proportionally more. Contract multisig executes code and costs more gas than a plain transfer.",
    ] },
    { type: "tool", slug: "gas-fee-calculator" },

    { type: "h2", text: "The backup nobody expects: the wallet configuration" },
    { type: "p", text: "This is the failure mode that catches people who set multisig up correctly. For Bitcoin, seed phrases alone are not enough to recover. Reconstructing the wallet also requires knowing the quorum, the derivation paths and the public keys of every cosigner — bundled together as the wallet descriptor or output descriptor. Lose that and you can hold all three seeds and still be unable to reconstruct the addresses your coins are sitting at." },
    { type: "callout", text: "Back up the descriptor with every key, in every location. It contains no private information — it cannot spend anything — so there is no reason to be precious about storing copies of it. Losing it while holding the seeds is a uniquely infuriating way to lose money." },
    { type: "p", text: "Contract-based multisig sidesteps this: the configuration is on-chain and readable from the contract address. Write that address down anyway, along with which chain it lives on and which signer is where." },

    { type: "h2", text: "A workable 2-of-3 for an individual" },
    { type: "ul", items: [
      "Three hardware devices from at least two manufacturers, each with its own seed phrase on metal.",
      "Key one at home, key two in a bank box or a second property, key three with a trusted person or a lawyer — geographically separated enough that no single event reaches two.",
      "The descriptor or contract address stored with all three, plus a copy at home.",
      "Written instructions, in plain language, that someone who is not you could follow. This is the difference between a security setup and an heirloom nobody can open.",
      "Fund it with a small amount, then perform a full recovery drill on entirely different hardware before committing real money. If you have not rehearsed it, you do not have it.",
    ] },
    { type: "p", text: "A collaborative-custody service, where a provider holds one of the three keys and helps with recovery, is a middle path worth knowing about. You keep two keys and therefore unilateral control; the provider cannot spend alone but can assist if you lose one. You are trading a subscription fee and some privacy for a large reduction in the chance of catastrophe." },

    { type: "h2", text: "When multisig is the wrong tool" },
    { type: "p", text: "It is not a universal upgrade. Multisig adds moving parts, and moving parts fail — usually at the worst moment, usually because the setup was built once and never rehearsed. More self-custodied crypto has been lost to over-engineering than to burglary." },
    { type: "ul", items: [
      "Small balances. If the amount would not change your life, one hardware wallet with two well-stored backups is the right answer and multisig is a hobby.",
      "Funds you move weekly. Signing on two devices for every transaction wears thin fast, and a setup you find annoying is one you will eventually shortcut.",
      "If you cannot explain your recovery procedure out loud, from memory, in under a minute. That is the honest test.",
      "As a substitute for understanding the basics. Multisig protects against key loss and key theft. It does nothing whatsoever against signing a malicious transaction — approve a drainer with two keys and it drains just as thoroughly.",
    ] },
    { type: "p", text: "The reasonable progression is: exchange, then a single hardware wallet with tested backups, then a passphrase if you want deniability, then multisig once the balance genuinely justifies the operational burden. Skipping to the end because it sounds serious is how people build systems they cannot use." },
  ],
  faq: [
    { q: "Is multisig safer than a hardware wallet with a passphrase?", a: "Against different threats. A passphrase protects against someone finding your seed phrase, but the whole wallet still hinges on one secret you must remember. Multisig removes the single point of failure entirely and survives losing a key, at the cost of a more complex recovery. For large balances multisig is the stronger model; for most people the passphrase is easier to operate correctly." },
    { q: "Can I do multisig with keys from different manufacturers?", a: "Yes, and you should. Mixing vendors means a firmware flaw or supply-chain compromise affecting one product does not reach the quorum. Coordinator software supports mixed setups as standard." },
    { q: "What happens if one cosigner refuses to sign?", a: "In 2-of-3, nothing — the other two proceed without them. That is the point of a threshold below n. In 2-of-2 a refusal freezes the funds permanently, which is why it is a poor choice for anything shared." },
    { q: "Do I need the seed phrases of all three keys to recover?", a: "No — you need the quorum, so two of three, plus the wallet descriptor on Bitcoin or the contract address on EVM chains. The descriptor is the part people forget, and without it the seeds alone may not be enough to locate your coins." },
    { q: "Is multisig more expensive to use?", a: "Yes, modestly. Bitcoin multisig transactions are larger and pay proportionally higher fees; contract multisig on EVM chains uses more gas than a plain transfer. Neither is significant relative to the balances that justify multisig in the first place." },
    { q: "Does multisig protect me from phishing?", a: "No. It defends against lost and stolen keys, not against bad approvals. If you are tricked into signing a malicious transaction and you sign it with the required number of keys, it executes. Separating long-term storage from the wallet you use with apps remains essential." },
  ],
};

export default guide;
