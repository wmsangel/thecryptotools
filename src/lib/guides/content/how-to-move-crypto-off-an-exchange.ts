import type { Guide } from "../types";

const guide: Guide = {
  slug: "how-to-move-crypto-off-an-exchange",
  affiliate: "wallet",
  title: "How to Move Crypto Off an Exchange Safely",
  description:
    "Withdrawing to self-custody is the step where beginners lose money — wrong network, missing memo, fat-fingered address. Here is the order of operations that makes it routine.",
  readingMinutes: 8,
  updatedAt: "2026-07-30",
  seo: {
    keywords: [
      "how to withdraw crypto to wallet",
      "move crypto off exchange",
      "self custody guide",
      "crypto withdrawal fees",
      "test transaction crypto",
      "exchange to wallet transfer",
    ],
    description:
      "A step-by-step guide to withdrawing crypto from an exchange to your own wallet: picking the right network, memos and destination tags, test transactions, withdrawal fees, address whitelists and the tax treatment of self-transfers.",
  },
  relatedTools: ["trading-fee-calculator", "gas-fee-calculator", "crypto-price-converter"],
  body: [
    { type: "p", text: "Coins on an exchange are an entry in that company's database and a claim against it. That claim has failed often enough — through insolvency, fraud, hacks and frozen withdrawals — that 'not your keys, not your coins' stopped being a slogan and became a description of events. Moving to self-custody removes counterparty risk and hands you a new one: from that moment, every mistake is final and there is nobody to call." },
    { type: "p", text: "The good news is that the mistakes are a short, well-known list. Work through them in order and withdrawal becomes boring, which is exactly what you want." },

    { type: "h2", text: "Before you withdraw anything" },
    { type: "ul", items: [
      "Have the receiving wallet fully set up and its backup tested — restored from your own written phrase — before any coins move. Do not create the wallet and fund it in the same session.",
      "Confirm the wallet actually supports the asset and the network you intend to use. Supporting 'Ethereum' does not automatically mean supporting a token on an obscure layer-2.",
      "Turn on withdrawal address whitelisting in the exchange account. This restricts payouts to addresses you pre-approved, usually with a 24-hour delay on new entries — a genuine obstacle to an attacker who gets into your account.",
      "Use an authenticator app or hardware key for 2FA, never SMS. SIM-swap attacks target exactly this moment.",
      "Check whether your account has a withdrawal hold. Many exchanges freeze payouts for 24–48 hours after a password or 2FA change, and discovering that mid-transfer is stressful for no reason.",
    ] },

    { type: "h2", text: "Pick the network before you pick anything else" },
    { type: "p", text: "This is the single most expensive decision on the withdrawal screen. Many assets exist on several chains, and the same ticker on two networks is two different things. USDT alone is issued on Ethereum, Tron, Solana and others; the balances are not interchangeable and there is no undo." },
    { type: "ul", items: [
      "The network you choose on the exchange must match the network your wallet is watching. A token sent over one chain to an address you only monitor on another will not appear.",
      "Withdrawal fees vary enormously by network for the identical asset — often by a factor of ten or more — because the exchange is passing on that chain's cost. If both ends support a cheaper chain, use it.",
      "Sending to an exchange deposit address on the wrong network is the worst case: exchanges control those keys, and recovery is a support ticket, a fee, and frequently a refusal. Sending to your own wallet on the wrong EVM chain is usually recoverable, because you hold the key — add the network in your wallet and the funds are typically there.",
      "You need the network's native coin for gas before you can move a token onwards. Withdrawing USDT to a fresh Ethereum address with no ETH leaves you holding tokens you cannot send. Send a little gas first.",
    ] },
    { type: "tool", slug: "gas-fee-calculator" },

    { type: "h2", text: "Memos and destination tags" },
    { type: "p", text: "Some chains — XRP, Stellar, Cosmos and others — route deposits to shared addresses using an extra field called a memo or destination tag. If you are withdrawing to your own wallet you usually leave it blank. If you are sending to an exchange or a custodial service, omitting it means the funds arrive at an address the recipient controls but cannot attribute to you. Recovery is possible in principle and painful in practice: a support ticket, proof, a wait, sometimes a fee, sometimes nothing. Read the deposit screen and copy both fields." },

    { type: "h2", text: "Getting the address right" },
    { type: "p", text: "Always copy and paste, never type. Then verify — and verify properly, because the attacks in this space are built around the way people skim." },
    { type: "ul", items: [
      "Check the first four characters, the last four, and a chunk from the middle. Address-swapping malware generates lookalikes with matching ends precisely because that is all most people check.",
      "If you use a hardware wallet, confirm the receiving address on the device's own screen. The computer's display is the part an attacker can control; the device screen is not.",
      "Never reuse an address copied from your transaction history. Address poisoning works by sending you a dust or zero-value transaction from an address resembling one you already use, so it appears in your history waiting to be copied.",
      "Generate a fresh receiving address from the wallet each time where the chain supports it. It costs nothing and improves your privacy.",
    ] },

    { type: "h2", text: "Always send a test transaction" },
    { type: "p", text: "Send the minimum first. Wait for it to confirm and actually appear in your wallet — not 'appear as pending on a block explorer', but show up as spendable in the wallet you will be using. Only then send the rest, to that same verified address, in the same session." },
    { type: "p", text: "The test costs one extra withdrawal fee. Weigh that against the alternative and it stops looking like an expense. For large amounts, some people split the remainder into two or three transfers as well; there is no prize for doing it in one." },

    { type: "h2", text: "What the transfer costs" },
    { type: "p", text: "Two separate costs are in play and exchanges are not always clear about which is which. The network fee is what the blockchain charges. The withdrawal fee is what the exchange charges, usually a flat amount per coin, and it is frequently well above the underlying network cost — the difference is revenue. On a small withdrawal that flat fee can be a painful percentage, which is an argument for withdrawing less often in larger amounts, rather than trickling coins out weekly." },
    { type: "callout", text: "Run the numbers before you accumulate a withdrawal habit: a flat $5 fee on a $50 transfer is 10% gone. Batching four of those into one transfer turns it into 2.5%." },

    { type: "h2", text: "After it lands" },
    { type: "ul", items: [
      "Record the date, amount, asset and the price at the time. You will need this for cost-basis tracking later, and reconstructing it a year afterwards from exchange exports is miserable.",
      "In most jurisdictions, moving coins between wallets you own is not a taxable disposal — no sale, no gain. It still needs recording so the eventual sale can be matched to the right acquisition cost. Rules differ by country; see our region tax guides for what applies where you live.",
      "Keep the exchange withdrawal confirmation and the transaction hash together with that record.",
      "Do not leave the coins in the same hot wallet you use for experimenting with DeFi apps. Long-term holdings and day-to-day signing belong in different wallets.",
    ] },
    { type: "p", text: "One last thing worth internalising: the exchange will ask why you are withdrawing, warn you about scams, and occasionally delay the payout while it checks. This is irritating and mostly well-intentioned — those checks catch people being talked through a withdrawal by a fraudster on the phone. If anyone is guiding you through this process in real time, stop. Nobody legitimate needs to watch you move your own money." },
  ],
  faq: [
    { q: "How long does a withdrawal take?", a: "Exchange processing usually takes minutes but can stretch to hours during congestion or manual review, then the chain itself needs a few confirmations — seconds on fast networks, up to an hour for Bitcoin. Plan for it to be slow and be pleasantly surprised." },
    { q: "I sent crypto on the wrong network. Is it gone?", a: "If you sent to your own address on another EVM chain, probably not: you control the key, so adding that network in your wallet usually reveals the funds. If you sent to an exchange deposit address on the wrong network, or to a chain with an incompatible address format, recovery depends entirely on the recipient's goodwill and is often impossible." },
    { q: "Do I pay tax when moving crypto to my own wallet?", a: "In most countries a transfer between wallets you control is not a disposal and triggers no tax, because you have not sold anything. You must still keep records so the original purchase price follows the coins. Check the guide for your jurisdiction — the details differ." },
    { q: "What is a memo or destination tag and do I need one?", a: "It is an identifier some chains use to attribute deposits sent to a shared address. Sending to your own wallet: usually not needed. Sending to an exchange or custodial service: essential, and omitting it can strand the funds." },
    { q: "Is it safer to withdraw everything at once or in pieces?", a: "Send a small test first, always. After it confirms, one larger transfer is usually better than several — you pay the flat withdrawal fee once and you have fewer chances to paste a bad address." },
    { q: "Should I keep anything on the exchange?", a: "Only what you are actively trading, plus whatever you would shrug off losing. Savings you do not intend to touch for months have no reason to sit in someone else's custody." },
  ],
};

export default guide;
