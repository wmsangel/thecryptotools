import type { Guide } from "../types";

const guide: Guide = {
  slug: "crypto-wallets-explained",
  title: "Crypto Wallets Explained: Hot vs Cold, Custodial vs Self-Custody",
  description:
    "A wallet does not store your coins — it stores the key that moves them. Here is what actually differs between wallet types, and how to pick one without losing everything to the wrong choice.",
  readingMinutes: 7,
  updatedAt: "2026-07-21",
  seo: {
    keywords: [
      "crypto wallet explained",
      "hot wallet vs cold wallet",
      "custodial vs non-custodial wallet",
      "hardware wallet",
      "seed phrase",
      "self custody crypto",
    ],
    description:
      "Crypto wallets explained: how private keys and seed phrases really work, the difference between hot, cold, custodial and self-custody wallets, and how to choose one for your balance.",
  },
  relatedTools: ["gas-fee-calculator", "satoshi-converter", "crypto-price-converter"],
  body: [
    { type: "p", text: "The single most useful thing to understand about crypto is that your coins are never in your wallet. They are entries on a public ledger. A wallet holds the private key that authorises changes to those entries. Lose the key and the coins still exist — they are simply unreachable, forever, by anyone. Almost every wallet decision follows from that one fact." },

    { type: "h2", text: "Keys, seed phrases and addresses" },
    { type: "p", text: "Three things get confused constantly. Your address is public — it is safe to share and is how people send you funds. Your private key signs transactions and must never leave your control. Your seed phrase (12 or 24 words) is a human-readable master secret from which every private key in the wallet is derived. Anyone with the seed phrase has every key, on every chain that wallet supports, forever." },
    { type: "callout", text: "No legitimate wallet, exchange, support agent or airdrop will ever need your seed phrase. There is no exception to this rule. Every single request for it is a theft attempt, without exception, no matter how convincing the context." },

    { type: "h2", text: "Custodial vs self-custody" },
    { type: "p", text: "This is the more important split, and the one beginners get wrong. In a custodial wallet — Binance, Coinbase, Kraken, any exchange account — the platform holds the keys. What you own is a claim on the company, much like a bank balance. In a self-custody wallet you hold the keys yourself." },
    { type: "ul", items: [
      "Custodial: password resets, 2FA recovery and a support line if you make a mistake. In exchange, you carry the platform's insolvency and freeze risk — the lesson of Mt. Gox, Celsius and FTX is that a balance on a screen is not the same as coins you control.",
      "Self-custody: nobody can freeze, seize or lend out your funds, and no company failure touches them. In exchange, there is no reset button. A lost seed phrase or a signed malicious transaction is permanent and uninsured.",
      "The practical answer for most people is both: trading balance on an exchange, long-term holdings in self-custody. Match the split to what you could stand to lose.",
    ] },

    { type: "h2", text: "Hot vs cold" },
    { type: "p", text: "The second split is about whether the key ever touches an internet-connected device. A hot wallet — MetaMask, Phantom, Trust Wallet, a mobile app — keeps keys on a phone or browser. That makes it fast, free and convenient, and it means any malware, malicious extension or phished signature on that device can reach your keys. A cold wallet keeps the key on a device that never goes online; transactions are signed on the device itself and only the signed result crosses over." },
    { type: "p", text: "Cold storage does not make you invulnerable. It removes remote key extraction from the threat model, which is the biggest single category of loss. It does not protect you from approving a draining transaction on the device's own screen, and it does not protect a seed phrase you photographed." },

    { type: "h2", text: "The four types in practice" },
    { type: "ul", items: [
      "Exchange account (custodial, hot) — fine for funds you are actively trading, or amounts you would shrug off. Enable withdrawal allowlists and hardware-key 2FA, not SMS.",
      "Mobile / browser wallet (self-custody, hot) — the everyday wallet for DeFi, NFTs and small balances. Treat it as the cash in your pocket, not your savings.",
      "Hardware wallet (self-custody, cold) — a Ledger, Trezor or Coldcard. The default for meaningful long-term holdings; see our hardware wallet guide for choosing one.",
      "Paper / metal backup — not a wallet, a backup of the seed phrase. Metal survives fire and flood; paper does not.",
    ] },

    { type: "h2", text: "Choosing by balance, not by preference" },
    { type: "p", text: "A useful heuristic: if losing the balance would materially change your year, it belongs in self-custody on cold storage. If it would merely annoy you, a hot wallet is a reasonable trade for the convenience. The cost of a hardware wallet is fixed at roughly the price of a nice dinner; the cost of not having one scales with your balance, which is why people who bought one late almost always say they should have bought it earlier." },
    { type: "tool", slug: "gas-fee-calculator" },

    { type: "h2", text: "The mistakes that actually cause losses" },
    { type: "ul", items: [
      "Storing the seed phrase digitally — a photo, a password manager note, a cloud document. Device compromise then means total loss.",
      "One backup in one place. Fire, flood and moving house all destroy seed phrases. Two or three geographically separate copies.",
      "Not testing recovery. Restore the wallet from the phrase onto a spare device before you fund it seriously. An untested backup is a guess.",
      "Blind-signing. Read what the transaction actually does. Most self-custody losses are not broken cryptography — they are users approving a token allowance to a contract that drains it.",
      "Stale approvals. Old unlimited token allowances stay live for years. Revoke ones you no longer use.",
      "Buying hardware secondhand or from a marketplace listing. Buy direct from the manufacturer; a pre-seeded device is a known scam.",
    ] },

    { type: "h2", text: "A reasonable setup" },
    { type: "p", text: "Long-term holdings on a hardware wallet, its seed phrase stamped in metal and stored in two separate physical locations, never photographed. A separate hot wallet with a small float for day-to-day on-chain activity, so a bad signature there cannot touch the main stack. An exchange account holding only what you are actively trading, secured with a hardware 2FA key. That structure survives essentially every common failure except forgetting where you put the backup — which, by then, is the risk worth having." },
  ],
  faq: [
    { q: "What happens if my hardware wallet breaks or is lost?", a: "Nothing, provided you have the seed phrase. The device is just a secure keypad — the keys are derived from the phrase, so you restore onto a replacement device from any manufacturer that supports the same standard." },
    { q: "Is a hot wallet safe for small amounts?", a: "Reasonably, if the device is clean, the wallet came from the official source and you do not store a seed phrase on it. Treat it like cash in a pocket: a good place for spending money, a bad place for savings." },
    { q: "Can someone steal my crypto if they know my wallet address?", a: "No. The address is public by design — it is visible on the blockchain to everyone. Funds move only with a signature from the private key." },
    { q: "Do I need a different wallet for each blockchain?", a: "Often not. Most modern wallets derive keys for many chains from one seed phrase. You do need a wallet that supports the specific chain, and sending an asset to an address on the wrong network is a common and usually unrecoverable mistake." },
    { q: "Are custodial wallets ever the right choice?", a: "Yes — for active trading balances, for people genuinely unlikely to keep a backup safe, and for small amounts where the convenience outweighs the counterparty risk. The mistake is holding life-changing sums there by default." },
  ],
};

export default guide;
