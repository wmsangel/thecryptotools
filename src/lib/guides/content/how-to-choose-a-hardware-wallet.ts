import type { Guide } from "../types";

const guide: Guide = {
  slug: "how-to-choose-a-hardware-wallet",
  affiliate: "wallet",
  title: "How to Choose a Hardware Wallet (And Set It Up Properly)",
  description:
    "Every hardware wallet keeps your keys offline — that part is solved. What differs is the security model, the coins supported, and how easy it is to make an expensive mistake. Here is how to choose and set one up.",
  readingMinutes: 8,
  updatedAt: "2026-07-21",
  seo: {
    keywords: [
      "how to choose a hardware wallet",
      "best hardware wallet",
      "ledger vs trezor",
      "cold storage crypto",
      "hardware wallet setup",
      "secure element wallet",
    ],
    description:
      "How to choose a hardware wallet: secure element vs open source, coin support, passphrase and multisig options, what to avoid when buying, and a step-by-step first-time setup.",
  },
  relatedTools: ["gas-fee-calculator", "crypto-price-converter", "satoshi-converter"],
  body: [
    { type: "p", text: "A hardware wallet solves exactly one problem, and it solves it well: your private key is generated on a device that never connects to the internet, and it never leaves that device. Transactions are sent in, signed inside the chip, and sent back out signed. Malware on your laptop can see what you are doing but cannot extract the key. Everything else — screens, apps, coin lists, price charts — is packaging around that single guarantee." },

    { type: "h2", text: "What actually differs between devices" },
    { type: "ul", items: [
      "Secure element vs open source. A certified secure element resists physical extraction if the device is stolen, but its firmware is usually closed. Fully open-source devices are auditable but often rely on a general-purpose chip. This is a genuine trade-off between two different threat models, not a question with one right answer.",
      "Coin support. Bitcoin-only devices exist and are deliberately simpler — less code, smaller attack surface. Multi-chain devices cover thousands of assets but pull in far more software. Check your specific coins before buying, not the headline number.",
      "Connectivity. USB-only is the most conservative. Bluetooth and NFC are convenient for mobile use and add a wireless surface; the signing still happens on-device, so the risk is smaller than it sounds but not zero. Fully air-gapped devices (QR or microSD) never physically connect at all.",
      "Screen quality. Underrated. The screen is where you verify the address and amount you are actually signing. A tiny display that forces you to scroll through an address is a display you will eventually stop reading — which is precisely how address-swapping malware wins.",
      "Passphrase and multisig support. A passphrase (sometimes called a 25th word) creates a separate hidden wallet from the same seed. Multisig requires several devices to approve a spend. Both are strong; both add ways to lock yourself out.",
    ] },

    { type: "h2", text: "How much wallet do you need?" },
    { type: "p", text: "Scale the setup to the balance, because complexity has a failure rate of its own." },
    { type: "ul", items: [
      "Under a few thousand: any reputable device, single seed phrase, two metal backups. Do not over-engineer.",
      "Meaningful savings: same, plus a passphrase you can genuinely remember or store separately from the seed — and test recovery before funding.",
      "Life-changing sums: 2-of-3 multisig across devices from different manufacturers, keys in different locations. This removes single points of failure but demands a written recovery plan someone else could follow.",
    ] },
    { type: "callout", text: "Complexity you do not fully understand is a loss waiting to happen. More people lose crypto to their own clever setup than to attackers. If you cannot explain your recovery process out loud, simplify it." },

    { type: "h2", text: "Buying without getting scammed" },
    { type: "ul", items: [
      "Buy direct from the manufacturer's own site, or an official reseller listed there. Never a marketplace listing, never secondhand, never an eBay bargain.",
      "A new device must generate a fresh seed phrase in front of you. If it arrives with a printed phrase, a scratch card or a pre-filled card 'for your convenience', it is a scam device. Do not use it, whatever the packaging says.",
      "Firmware-check on first connect using the official app. Genuine devices verify against the manufacturer's key.",
      "Manufacturer databases have leaked customer names and addresses before, and buyers received convincing phishing letters and fake replacement devices by post. Physical mail about your wallet is not automatically legitimate.",
    ] },

    { type: "h2", text: "First-time setup, step by step" },
    { type: "ul", items: [
      "Set it up yourself, offline, with nobody watching and no camera in the room.",
      "Let the device generate the seed. Never accept one supplied by anything or anyone else.",
      "Write the words by hand, in order, on the supplied card — then transfer them to metal. Never photograph, never type into a phone, never store in a password manager or cloud note.",
      "Set a device PIN. This protects against physical theft, not against seed-phrase exposure.",
      "Wipe the device and restore from your written phrase before you fund it. This is the step everyone skips and the one that catches transcription errors while they are still free to fix.",
      "Send a small test transaction, confirm it arrives, then move the rest.",
      "Store two backups in separate physical locations. One backup in one house is one fire away from zero.",
    ] },
    { type: "tool", slug: "gas-fee-calculator" },

    { type: "h2", text: "Using it safely afterwards" },
    { type: "p", text: "The device protects the key; it cannot protect your judgement. Verify the receiving address on the device's own screen, not the computer's — clipboard-swapping malware exists specifically to exploit the gap between the two. Read what you are signing: a request for an unlimited token allowance looks almost identical to a simple transfer in most interfaces. Revoke old approvals periodically. And keep the wallet you use for experimental DeFi separate from the one holding your long-term stack, so a bad signature cannot cost you everything." },
    { type: "p", text: "Firmware updates matter — they patch real vulnerabilities — but do them from the official app, with your seed phrase backed up and verified first, and never in a hurry because a message told you to." },

    { type: "h2", text: "Is it worth it?" },
    { type: "p", text: "A hardware wallet costs a fixed amount, roughly the price of a nice dinner. The risk it removes scales with your balance. That maths tips over quickly: somewhere around a few thousand dollars, the device is unambiguously cheaper than the exposure. Below that, an honest hot-wallet setup with a properly stored seed phrase is defensible. Above it, the question is not whether to buy one but why you have not yet." },
  ],
  faq: [
    { q: "Ledger or Trezor — which is better?", a: "They optimise for different things. Ledger uses a certified secure element with closed firmware; Trezor is fully open source on a general-purpose chip. Choose secure element if physical theft is your main worry, open source if verifiability matters more to you. Both are far safer than leaving coins on an exchange." },
    { q: "Can a hardware wallet be hacked remotely?", a: "Extracting the key remotely is what the design prevents — signing happens inside the device. The realistic remote attack is tricking you into approving a malicious transaction, which is why verifying on the device's own screen matters." },
    { q: "What if the manufacturer goes out of business?", a: "Your funds are unaffected. Seed phrases follow open standards (BIP-39), so you can restore onto a device from any other manufacturer, or into a software wallet in an emergency." },
    { q: "Do I need one hardware wallet per coin?", a: "No. One device holds keys for every chain it supports, all derived from a single seed phrase. Check that your specific coins are supported before buying." },
    { q: "Should I use a passphrase?", a: "Only if you have a reliable way to store or remember it. A passphrase creates a hidden wallet and protects against seed-phrase discovery, but forgetting it loses the funds permanently — the phrase alone will not recover them." },
    { q: "Is it safe to buy a used hardware wallet?", a: "No. A used or pre-seeded device may have a seed the seller already knows, letting them drain it the moment you fund it. Buy new, direct from the manufacturer." },
  ],
};

export default guide;
