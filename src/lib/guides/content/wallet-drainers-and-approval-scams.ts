import type { Guide } from "../types";

const guide: Guide = {
  slug: "wallet-drainers-and-approval-scams",
  affiliate: "wallet",
  title: "Wallet Drainers, Token Approvals and Signature Scams",
  description:
    "Most wallets are not hacked — they are authorised. Approvals, gasless permit signatures and the newer delegation attacks all rely on you clicking confirm. Here is what each one does and how to revoke it.",
  readingMinutes: 9,
  updatedAt: "2026-07-30",
  seo: {
    keywords: [
      "wallet drainer",
      "token approval scam",
      "revoke token approvals",
      "crypto signature phishing",
      "eip-7702 delegation scam",
      "permit2 phishing",
    ],
    description:
      "How wallet drainers actually work: unlimited token approvals, gasless permit signatures, setApprovalForAll, EIP-7702 delegation attacks and address poisoning — plus how to audit and revoke what you have already granted.",
  },
  relatedTools: ["gas-fee-calculator", "eth-unit-converter", "crypto-price-converter"],
  body: [
    { type: "p", text: "The mental image of a wallet being 'hacked' — someone cracking your key from outside — describes almost none of the losses that actually happen. Private keys are not broken. What happens instead is that the owner is persuaded to approve something, and the approval is valid, signed and irreversible. The industry calls the tooling for this a drainer: a kit that presents a normal-looking transaction or signature request and empties the wallet once you confirm it." },
    { type: "p", text: "That reframing is useful, because it tells you where to defend. Not the key — the confirmation dialog." },

    { type: "h2", text: "Token approvals, and why 'unlimited' is the default" },
    { type: "p", text: "A token contract holds its own ledger of balances. When you use a decentralised exchange, the app cannot simply take your tokens; you first grant its contract an allowance to spend them on your behalf. That is a separate transaction, and it is the one that gets abused." },
    { type: "ul", items: [
      "Most apps request an unlimited allowance so you never have to approve again. Convenient, and it means the contract may move that token from your wallet, in any amount, forever.",
      "The permission is granted to a contract address, not to a website. If the contract is malicious or is later compromised, the allowance you granted months ago is still live.",
      "For NFTs the equivalent is setApprovalForAll, which hands over an entire collection in one click. It is a common component of NFT theft.",
      "An allowance persists until you revoke it. Closing the tab, disconnecting the wallet and clearing site permissions do none of that — 'disconnect' only stops the site seeing your address.",
    ] },
    { type: "callout", text: "Disconnecting a site does not revoke anything. The allowance lives on-chain in the token contract, and only an on-chain revoke transaction removes it." },

    { type: "h2", text: "Signature phishing: the gasless version" },
    { type: "p", text: "The nastier variant costs nothing and leaves no trace until it is used. Modern token standards let you authorise a spender by signing a message rather than sending a transaction — permit, and the widely deployed Permit2. There is no gas fee and no pending confirmation, so none of the usual friction warns you. The signature is captured and submitted by the attacker whenever they choose." },
    { type: "p", text: "Because it is a message and not a transaction, wallets historically displayed it as unreadable structured data. That is improving, but the practical rule stands: a site asking you to sign something you cannot read in plain language deserves suspicion regardless of how legitimate it looks. Free signature requests are not free — they are exactly as powerful as a transaction, minus the fee that would have made you think." },

    { type: "h2", text: "Delegation attacks (EIP-7702)" },
    { type: "p", text: "Ethereum's Pectra upgrade in 2025 introduced EIP-7702, which lets an ordinary wallet address temporarily behave like a smart contract by delegating its execution to one. The legitimate purpose is account abstraction — batched transactions, sponsored gas, session keys. Drainer operators adopted it almost immediately." },
    { type: "p", text: "The attack is presented as a 'wallet security upgrade', a 'smart account migration' or an AI-branded assistant. One signature installs the attacker's contract as your account's delegate, after which the wallet drains itself automatically — including funds that arrive later. One authorisation buys persistent execution rights, which is what makes it worse than a per-token approval. Documented cases include a single victim losing over $1.5 million in staked ETH, wrapped BTC and NFTs in one incident in August 2025." },
    { type: "p", text: "Checking and clearing these is different from clearing approvals. Most wallets do not allow an external site to modify delegations, so the revoke has to happen inside the wallet application itself — in MetaMask, via the account details screen where smart-account or smart-contract-account status can be disabled, per chain. Revoke.cash shows existing delegations in a dedicated tab so you can confirm what is set and verify afterwards that it is gone." },

    { type: "h2", text: "How people arrive at the malicious page" },
    { type: "p", text: "The contract is the weapon; getting you in front of it is the actual work, and it is unglamorous." },
    { type: "ul", items: [
      "Paid search ads impersonating well-known apps, sitting above the real result. Bookmark the sites you use and navigate from the bookmark.",
      "Fake airdrop and claim pages, often promoted from compromised or lookalike social accounts, timed to real news.",
      "Direct messages offering support after you post a problem publicly. Real support does not message first, and never asks you to connect a wallet to 'validate' it.",
      "Malicious tokens deposited in your wallet whose name is a URL. Interacting with them is the payload.",
      "Compromised front-ends of genuine projects — the domain is right and the contract underneath is not. This is why reading the transaction still matters even on a site you trust.",
      "Clipboard malware that swaps a copied address for the attacker's, and address poisoning that plants a lookalike in your history.",
    ] },
    { type: "tool", slug: "gas-fee-calculator" },

    { type: "h2", text: "Auditing what you have already granted" },
    { type: "ul", items: [
      "Run your address through an approval checker — Revoke.cash and the token-approval tools built into major block explorers both list active allowances per chain.",
      "Revoke anything you do not currently use, and everything connected to an app you tried once. Each revoke is an on-chain transaction and costs gas, so batch the cleanup rather than doing it piecemeal.",
      "Check each chain separately. Approvals are per network, and the one you forgot about is on the chain you used twice last year.",
      "Check delegations too, in the wallet itself, and confirm the result afterwards in an external checker.",
      "Make this a scheduled habit — twice a year, or after any period of heavy on-chain activity.",
    ] },

    { type: "h2", text: "The structural defence: separate wallets" },
    { type: "p", text: "No amount of vigilance survives a bad day, so build the setup on the assumption that you will eventually sign something you should not have. Keep long-term holdings in a wallet that never touches a decentralised app: no approvals granted, no signatures beyond plain sends. Do everything experimental from a separate hot wallet funded with only what that activity needs. A drained burner is an annoying afternoon; a drained savings wallet is a different category of event." },
    { type: "p", text: "A hardware wallet raises the bar further, but only if you read its screen. Blind signing — approving data the device cannot decode into a human-readable action — gives away most of the protection you paid for. Where the device offers clear signing for an app, use it; where it does not and the amount matters, treat that as a reason to stop." },
    { type: "p", text: "One habit is worth more than the rest combined: slow down at the confirmation. Every drainer depends on urgency — a claim expiring, a limited allocation, a security alert demanding immediate action. Nothing legitimate in crypto requires you to sign within ninety seconds. If a screen is pressuring you, that pressure is the attack." },
  ],
  faq: [
    { q: "Does disconnecting my wallet from a site revoke its access?", a: "No. Disconnecting only stops the site from seeing your address. Any token allowance you granted lives in the token contract on-chain and stays active until you send a revoke transaction." },
    { q: "Is it dangerous to sign a message if there is no gas fee?", a: "It can be more dangerous than a transaction. Permit-style signatures authorise spending without any on-chain footprint at the time, so there is no pending-transaction warning and nothing to see until it is used. Never sign data you cannot read in plain language." },
    { q: "How do I check for an EIP-7702 delegation on my wallet?", a: "Look inside the wallet app — MetaMask exposes smart-account status in the account details screen and lets you disable it per chain. Revoke.cash also has a delegations tab that shows what is set, which is useful for verifying that a revoke actually took effect." },
    { q: "Someone sent an unknown token to my wallet. Is that a problem?", a: "Receiving it is harmless. Interacting with it is not. Spam tokens are bait: swapping or 'claiming' them routes you to the malicious contract. Hide it and move on." },
    { q: "Can a drainer take funds from a hardware wallet?", a: "Yes, if you approve the transaction on the device. The hardware protects the key from extraction, not from your own confirmation. Reading what the device screen actually says is the protection." },
    { q: "My wallet was drained. What should I do?", a: "Move any remaining assets to a brand-new wallet with a new seed phrase immediately — assume the compromised one is permanently unsafe, especially if the seed may have been exposed. Revoke approvals and delegations on the old address if it still holds anything, record the transaction hashes, and report to the relevant chain analytics and law-enforcement channels. Ignore anyone who contacts you offering recovery services; that is a second scam targeting victims of the first." },
  ],
};

export default guide;
