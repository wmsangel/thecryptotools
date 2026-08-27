import type { Guide } from "../types";

/**
 * Hub page for the self-custody / wallet-security cluster. Every guide it links
 * to carries `partOf: "crypto-wallet-security"`, so the linking runs both ways
 * — the return leg that makes the cluster crawlable and concentrates its
 * authority on one landing page. When a new wallet/security guide is added,
 * link it from the relevant section here and set its `partOf`.
 */
const guide: Guide = {
  slug: "crypto-wallet-security",
  affiliate: "wallet",
  hubName: "Wallet Security",
  hubBacklinkEyebrow: "The full self-custody guide",
  title: "Crypto Wallet Security: The Complete Self-Custody Guide",
  description:
    "Self-custody means you are the bank — and the whole job is not losing or leaking your keys. A start-to-finish path through choosing a wallet, protecting the seed phrase, and avoiding the ways people actually lose crypto.",
  readingMinutes: 10,
  updatedAt: "2026-08-27",
  seo: {
    keywords: [
      "crypto wallet security",
      "how to keep crypto safe",
      "self custody crypto",
      "crypto self custody guide",
      "how to secure a crypto wallet",
      "protect crypto wallet",
      "crypto security best practices",
    ],
    description:
      "A complete self-custody guide: how to choose and set up a wallet, move crypto off an exchange, protect your seed phrase, avoid drainers and approval scams, and plan recovery and inheritance. Each step links to a full guide.",
  },
  relatedTools: ["gas-fee-calculator", "satoshi-converter"],
  body: [
    { type: "p", text: "Self-custody is the whole promise of crypto: no bank, no broker, no one who can freeze or seize your money. It is also the whole risk, because the flip side of nobody being able to touch your funds is that **nobody can get them back for you** either. There is no password reset and no fraud department. Every real-world crypto loss comes down to one of two failures — you lost the keys, or someone else got them — and this guide is a path through avoiding both, from the first coin you move off an exchange to the plan for what happens when you are no longer around." },
    { type: "callout", text: "The single sentence that prevents most losses: your keys and your seed phrase are the money itself, not a login to it. Anything that can read them owns your coins; anything that can destroy them destroys your coins. Everything below follows from that." },

    { type: "h2", text: "Start here: what a wallet actually is" },
    { type: "p", text: "Before buying any hardware, get the model right. A crypto wallet does not 'hold' coins — the coins live on the blockchain; the wallet holds the keys that authorise moving them. That is why [what a crypto wallet actually is](/guides/crypto-wallets-explained) is the foundation, and why the first real decision is [hot wallet vs cold wallet](/guides/hot-wallet-vs-cold-wallet): an internet-connected wallet is convenient and exposed, an offline one is safe and deliberate, and most people want both — a small hot wallet for spending, a cold one for savings." },
    { type: "ul", items: [
      "**Hot wallet** — a phone or browser app. Fine for small, active balances; assume anything on it could be drained if your device is compromised.",
      "**Cold wallet** — a hardware device that keeps the keys offline and signs transactions without ever exposing them. This is where savings belong.",
      "**The keys are portable, the hardware is not sacred.** Every wallet is a backup of a seed phrase, and that phrase restores onto any compatible device — so the phrase is what you protect, not the gadget.",
    ] },

    { type: "h2", text: "Choosing and setting up a hardware wallet" },
    { type: "p", text: "Once your balance is worth protecting, a hardware wallet is the standard answer. Start with [how to choose a hardware wallet](/guides/how-to-choose-a-hardware-wallet) for the criteria that matter — secure element, open-source firmware, coin support, how recovery works — then see the specific picks in [the best hardware wallets of 2026](/guides/best-crypto-hardware-wallets). When the device is set up and its recovery tested, [move your crypto off the exchange](/guides/how-to-move-crypto-off-an-exchange): coins left on an exchange are held by the exchange, and 'not your keys, not your coins' is a lesson people usually learn the expensive way." },
    { type: "cta", title: "Buy from the manufacturer, never a marketplace", text: "A hardware wallet bought used or through a third-party marketplace can arrive pre-initialised by a thief who keeps a copy of the seed. Buy sealed, direct from the maker, and generate your own phrase on first boot.", href: "/guides/best-crypto-hardware-wallets", label: "See the 2026 hardware wallet picks" },

    { type: "h2", text: "Protecting the seed phrase — the part that actually matters" },
    { type: "p", text: "The device is replaceable; the seed phrase is not. Getting its storage right is the highest-leverage thing on this page, and it is where [how to store a seed phrase](/guides/how-to-store-a-seed-phrase) goes deep — paper vs metal, how many copies and where, why splitting the words is usually a mistake, the passphrase trade-off, and the one step almost everyone skips: testing recovery before funding the wallet. For larger holdings, [multisig wallets](/guides/multisig-wallets-explained) remove the single point of failure entirely by requiring several keys to move funds, so one lost or stolen key is not a catastrophe." },
    { type: "ul", items: [
      "Write the words by hand the moment the device shows them — never a photo, never a cloud note, never a password manager.",
      "Move the backup to **metal**, and keep **two copies in two separate places**. House fires and floods are far more common than targeted burglaries.",
      "**Test the recovery** before you send real funds: wipe the device, restore from your own backup, confirm the same first address, then move a small test amount before the rest.",
    ] },

    { type: "h2", text: "Avoiding the ways people actually lose crypto" },
    { type: "p", text: "Most losses are not brilliant hacks — they are ordinary mistakes and social engineering. The two biggest are sending to the wrong place and signing the wrong thing. [Wallet addresses and networks](/guides/wallet-addresses-and-networks) explains why sending USDC on the wrong network can make it vanish and how to check an address safely, and [wallet drainers and approval-scams](/guides/wallet-drainers-and-approval-scams) covers the malicious 'approve' signatures that quietly authorise a contract to empty your wallet later — the single fastest-growing way funds are stolen today. If something does go wrong, [lost crypto wallet recovery](/guides/lost-crypto-wallet-recovery) covers what is genuinely recoverable and what is gone for good." },
    { type: "callout", text: "No legitimate service will ever ask you to 'validate', 'sync' or 'restore' your wallet by typing your seed phrase into a website. That single lie accounts for an enormous share of drained wallets. The phrase is entered on your own device, and nowhere else, ever." },

    { type: "h2", text: "Planning for the worst" },
    { type: "p", text: "A seed phrase nobody can find is indistinguishable from one that was never written. The final piece of self-custody is making sure the right person can reach your funds if you cannot — without leaving your keys in a will that becomes public. [A crypto inheritance plan](/guides/crypto-inheritance-plan) walks through how to do that: instructions that are useless to a thief but complete for an heir, tested so they actually work." },

    { type: "h2", text: "The safe path, in order" },
    { type: "ul", items: [
      "Understand the model: [what a wallet is](/guides/crypto-wallets-explained) and [hot vs cold](/guides/hot-wallet-vs-cold-wallet).",
      "[Choose a hardware wallet](/guides/how-to-choose-a-hardware-wallet), buy it sealed from the maker, and see [the 2026 picks](/guides/best-crypto-hardware-wallets).",
      "Generate your own phrase, [store it on metal in two places](/guides/how-to-store-a-seed-phrase), and **test recovery**.",
      "[Move funds off the exchange](/guides/how-to-move-crypto-off-an-exchange) with a small test transaction first.",
      "Learn the traps: [addresses and networks](/guides/wallet-addresses-and-networks) and [drainers and approvals](/guides/wallet-drainers-and-approval-scams).",
      "For large holdings, consider [multisig](/guides/multisig-wallets-explained); for everyone, write [an inheritance plan](/guides/crypto-inheritance-plan).",
    ] },
    { type: "p", text: "Do these in order and you have closed off the ways self-custodied crypto is actually lost. None of it is difficult; it is just deliberate, and deliberate is the entire skill." },
  ],
  faq: [
    { q: "What is the most secure way to store crypto?", a: "A hardware (cold) wallet you set up yourself, with the seed phrase written by hand and stored on metal in two separate locations, and recovery tested before funding. Keep only small, spending amounts in a hot wallet. For large holdings, multisig removes the single point of failure by requiring several keys to move funds." },
    { q: "Is self-custody safer than leaving crypto on an exchange?", a: "It removes the exchange's risks — insolvency, freezes, hacks of their systems — and hands you a different set: losing your own keys or being tricked into leaking them. Done properly (hardware wallet, metal seed backup, tested recovery), self-custody is safer for anything you are not actively trading. Done carelessly it is worse. The difference is entirely in the setup." },
    { q: "What is the biggest cause of losing crypto?", a: "Two things dominate: losing access to your own keys (no backup, or a backup that was never tested), and signing something malicious — a fake 'validate your wallet' seed-phrase prompt, or an approval that authorises a drainer contract. Almost none of it is sophisticated hacking; it is backup failure and social engineering." },
    { q: "Do I need a hardware wallet for a small amount of crypto?", a: "Not necessarily. For pocket-money amounts you are actively using, a reputable hot wallet is reasonable, treated as you would cash in a physical wallet. The moment the balance is more than you would carry in your pocket, move it to cold storage — the cost of a hardware wallet is small next to the amount it protects." },
    { q: "Where should I start?", a: "Understand hot vs cold wallets, choose and set up a hardware wallet bought directly from the manufacturer, back up its seed phrase on metal in two places and test the recovery, then move funds off your exchange with a small test transaction first. Each of those steps has a full guide linked from the path above." },
  ],
};

export default guide;
