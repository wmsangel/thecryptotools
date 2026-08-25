import type { Guide } from "../types";

const guide: Guide = {
  slug: "hot-wallet-vs-cold-wallet",
  affiliate: "wallet",
  title: "Hot Wallet vs Cold Wallet: Which Do You Need?",
  description:
    "The real difference between hot and cold wallets, when each is the right tool, and the simple split most people should actually run.",
  readingMinutes: 7,
  updatedAt: "2026-08-24",
  seo: {
    title: "Hot Wallet vs Cold Wallet: Which Do You Need?",
    description:
      "Hot wallet vs cold wallet explained: what each is, the trade-off between convenience and security, and the practical split — hot for spending, cold for savings — most crypto holders should use.",
    keywords: [
      "hot wallet vs cold wallet",
      "cold wallet vs hot wallet",
      "what is a cold wallet",
      "cold storage crypto",
      "hot wallet meaning",
      "best way to store crypto",
    ],
  },
  relatedTools: [],
  body: [
    {
      type: "p",
      text: "The difference between a hot wallet and a cold wallet comes down to one thing: whether the private key ever touches an internet-connected device. That single distinction decides how convenient the wallet is and how hard it is to steal from — and those two pull in opposite directions, which is why the right answer for most people is not one or the other but both, used for different jobs.",
    },

    { type: "h2", text: "What a hot wallet is" },
    {
      type: "p",
      text: "A hot wallet is software on an internet-connected device — a phone app, a browser extension like MetaMask, or the wallet built into an exchange account. The private key lives on that device, which makes it instant to use: you can trade, swap, and interact with DeFi apps in seconds. It also means the key is exposed to everything that device is exposed to — malware, malicious approvals, phishing, a compromised app. Hot wallets are the right tool for small, active balances, exactly the way you'd carry some cash in your pocket.",
    },

    { type: "h2", text: "What a cold wallet is" },
    {
      type: "p",
      text: "A cold wallet keeps the private key on a device that never connects to the internet. In practice that's a hardware wallet: the key is generated on a secure chip, transactions are signed inside it, and only the signed transaction leaves. Malware on your computer can see what you're doing but cannot extract the key. That makes cold storage dramatically harder to steal from — at the cost of a few extra seconds and a physical device you have to plug in. It's the right tool for the balance you're not actively trading: your savings, not your pocket money.",
    },
    {
      type: "callout",
      text: "The rule of thumb: hot wallet for what you'd be annoyed to lose, cold wallet for what would actually hurt. If the amount would ruin your month, it belongs in cold storage.",
    },

    { type: "h2", text: "The trade-off, honestly" },
    {
      type: "table",
      headers: ["", "Hot wallet", "Cold wallet"],
      rows: [
        { cells: ["Key location", "Internet-connected device", "Offline secure chip"] },
        { cells: ["Convenience", "Instant — tap and sign", "Plug in, confirm on device"] },
        { cells: ["Attack surface", "Malware, phishing, bad approvals", "Physical access + your PIN"] },
        { cells: ["Cost", "Free", "Price of the device"] },
        { cells: ["Best for", "Small, active balances", "Long-term savings"] },
      ],
    },

    { type: "h2", text: "The split most people should run" },
    {
      type: "p",
      text: "You don't choose one. You run a hot wallet with a small working balance for trading and DeFi, and a cold wallet for the bulk you intend to hold. A bad signature or a drained hot wallet then costs you your pocket money, not your stack. Keep the two genuinely separate — don't connect your cold-storage addresses to experimental apps — so a mistake in one can never reach the other.",
    },
    {
      type: "cta",
      title: "Set up cold storage with a hardware wallet",
      text: "A hardware wallet keeps your private keys offline on a secure chip, so malware on your computer can't reach them. It's the standard way to hold crypto you're not actively trading.",
      href: "https://shop.ledger.com/?r=c5f06eb56aa8",
      label: "Get a Ledger",
    },

    { type: "h2", text: "Whichever you use, the seed phrase is the real key" },
    {
      type: "p",
      text: "Both wallet types boil down to a seed phrase — the 12 or 24 words that can restore the wallet anywhere. A cold wallet protects the key from online theft, but if someone finds your written seed phrase, the hardware is irrelevant; and if you lose the phrase with no backup, no support desk can recover it. So the wallet choice is only half the job. The other half is storing that phrase properly.",
    },
    {
      type: "cta",
      title: "How to store a seed phrase safely",
      text: "The step-by-step on backing up and storing your recovery phrase — offline, separate from the device, and resistant to fire, loss and prying eyes.",
      href: "/guides/how-to-store-a-seed-phrase",
      label: "Read the seed-phrase guide",
    },
    {
      type: "cta",
      title: "Choosing and setting up a hardware wallet",
      text: "What actually differs between devices, how to buy without getting scammed, and a proper first-time setup.",
      href: "/guides/how-to-choose-a-hardware-wallet",
      label: "Read the hardware-wallet guide",
    },
  ],
  faq: [
    {
      q: "What is the difference between a hot and cold wallet?",
      a: "A hot wallet keeps your private key on an internet-connected device (a phone or browser app), making it instant to use but exposed to online threats. A cold wallet keeps the key on an offline device (a hardware wallet), so it's far harder to steal from but takes a few seconds more to use. Hot is for spending, cold is for savings.",
    },
    {
      q: "Do I need a cold wallet for a small amount of crypto?",
      a: "Not necessarily. For small, active balances a well-managed hot wallet with its seed phrase stored properly is defensible. The maths tips toward a hardware wallet somewhere around a few thousand dollars, where the fixed cost of the device is clearly cheaper than the risk it removes.",
    },
    {
      q: "Is an exchange account a hot or cold wallet?",
      a: "Neither, really — on an exchange the exchange holds the keys, so you don't have a wallet at all, you have an IOU. It behaves like the hottest possible wallet plus counterparty risk. Fine for trading, wrong for storing; move long-term holdings to a wallet whose keys are yours.",
    },
    {
      q: "Can I use both a hot and a cold wallet?",
      a: "Yes — that's the recommended setup. Keep a small working balance in a hot wallet for trading and DeFi, and the bulk in cold storage. Keep them separate so a compromised hot wallet can never reach your savings.",
    },
  ],
};

export default guide;
