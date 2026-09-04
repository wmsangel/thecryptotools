import type { Guide } from "../types";

const guide: Guide = {
  slug: "how-to-avoid-crypto-scams",
  affiliate: "wallet",
  partOf: "crypto-wallet-security",
  title: "How to Avoid Crypto Scams: The Playbooks and the Red Flags",
  description:
    "Almost every crypto scam runs one of a handful of playbooks. Learn the patterns — fake support, giveaways, pig-butchering, drainers, recovery scams — the red flags they share, and the habits that stop all of them.",
  readingMinutes: 9,
  updatedAt: "2026-09-04",
  seo: {
    keywords: [
      "how to avoid crypto scams",
      "crypto scams",
      "common crypto scams",
      "crypto scam red flags",
      "crypto giveaway scam",
      "pig butchering scam",
      "crypto recovery scam",
    ],
    description:
      "A plain-English guide to avoiding crypto scams: the main playbooks (fake support, giveaways, pig-butchering, wallet drainers, recovery scams), the red flags they all share, and the simple habits that defend against every one.",
  },
  keyTakeaways: [
    "Almost every crypto scam is one of a few playbooks — fake support, giveaways, pig-butchering, drainers, recovery scams — in a new costume.",
    "Two rules stop most of them: **nobody legitimate needs your seed phrase**, and **no real offer needs you to send crypto first to receive more**.",
    "Shared red flags: urgency, guaranteed returns, unsolicited DMs, 'connect/validate your wallet', and requests for remote access.",
    "The defense is boring habits: hardware wallet, seed phrase offline, reach sites by bookmark, read what you sign, never pay an upfront 'recovery' fee.",
  ],
  relatedTools: [],
  body: [
    { type: "p", text: "Crypto scams work because crypto is irreversible: once you send it or approve it, there is no chargeback and no fraud department to call. The good news is that the variety is an illusion — almost every scam is one of a handful of playbooks wearing a new costume. Learn the patterns and the shared red flags, and you can spot a scam you have never seen before. This guide is the field manual." },
    { type: "callout", text: "The one rule that stops most of them: nobody legitimate ever needs your seed phrase, and no real opportunity requires you to send crypto first to receive more back. If either appears, it is a scam — every time, no exceptions." },

    { type: "h2", text: "The playbooks" },
    { type: "ul", items: [
      "**Fake support & phishing.** A cloned site, app, ad or 'support agent' (often via a DM after you post a problem) asks you to 'validate', 'sync' or 'restore' your wallet — i.e. type your seed phrase, or connect and sign. Real support never asks for the phrase. See [wallet drainers and approval scams](/guides/wallet-drainers-and-approval-scams) for the on-chain version.",
      "**Giveaways & impersonation.** 'Send 1 ETH, get 2 back', fronted by a hacked or spoofed account of a celebrity, exchange or project. Sending crypto to receive more is never real. The video 'proof' is a loop.",
      "**Pig-butchering (romance/investment).** A long con: someone friendly on a dating app or DM slowly steers you to a slick 'trading platform' that shows fake gains. You can deposit and 'profit' — but withdrawals need ever more fees, and the money was never invested.",
      "**Fake exchanges, apps & airdrops.** Lookalike domains, apps side-loaded outside the official store, or a 'claim your airdrop' page that drains the wallet you connect. The claim button is the trap.",
      "**Rug pulls & pump-and-dumps.** A new token's creators hype it, then remove liquidity or dump their pre-mined supply, leaving you unable to sell. Anonymous team, no audit, and a chart that only went vertical are the tells.",
      "**Recovery scams.** After a loss, a 'recovery service' promises to get your crypto back for an upfront fee. They cannot — lost or stolen crypto is not clawed back by a middleman — and they prey on victims twice. See what is genuinely recoverable in [lost crypto wallet recovery](/guides/lost-crypto-wallet-recovery).",
    ] },

    { type: "h2", text: "The red flags they all share" },
    { type: "p", text: "You do not need to memorise every scam. They share a handful of signals, and any one of them should stop you cold:" },
    { type: "ul", items: [
      "**Urgency and pressure** — 'act now', a countdown, 'only today'. Scams need you to skip thinking.",
      "**Guaranteed or outsized returns** — 'risk-free', 'double your coins', fixed high yields. Real markets guarantee nothing.",
      "**Any request for your seed phrase or private key** — the instant end of the conversation.",
      "**'Send first to receive'** — deposits to unlock a withdrawal, taxes/fees on winnings, 'verification' payments.",
      "**Unsolicited contact** — a DM, comment, ad or 'support' that reached out to you, especially after you posted a wallet problem publicly.",
      "**Requests to install remote-access software** (AnyDesk, TeamViewer) so someone can 'help' — that is theft with your permission.",
    ] },

    { type: "h2", text: "The habits that defend against all of them" },
    { type: "ul", items: [
      "**Self-custody, done right.** Keep savings in a hardware wallet and treat the [seed phrase](/guides/how-to-store-a-seed-phrase) as the money itself — offline, never typed into anything. Most theft ends here.",
      "**Verify, don't trust links.** Reach sites by your own bookmark, never an ad, email or DM link. Check the exact domain; scammers use near-identical spellings.",
      "**Read what you sign, and revoke.** Before approving a transaction, understand what it authorises; periodically revoke old token approvals.",
      "**Ignore DMs and giveaways.** No legitimate airdrop, support team or celebrity resolves anything in your DMs or asks you to send crypto first.",
      "**Never pay an upfront 'recovery' fee.** It is a second scam aimed at the first scam's victims.",
      "**Slow down.** Send a small test transaction first, and let any 'urgent' opportunity wait a day — the ones that cannot survive a night's sleep were the scams.",
    ] },
    { type: "p", text: "New to self-custody? Start with the full [crypto wallet security guide](/guides/crypto-wallet-security) — most of these scams are just different doors into the same room, and locking that room shuts all of them." },

    { type: "h2", text: "The honest bottom line" },
    { type: "p", text: "You will never see every scam, and you do not have to. They all lean on the same levers — urgency, greed, trust, and the irreversibility of crypto — and they all fail against the same boring habits: keep the seed phrase offline, distrust anything unsolicited, never send to receive, and never pay to recover. If an opportunity needs you to act fast, pay first, or hand over a key, it has already told you what it is. This is general information, not financial advice." },
  ],
  faq: [
    { q: "What is the most common crypto scam?", a: "Phishing for your seed phrase or a malicious signature — via a fake website, app, ad or 'support' agent that asks you to 'validate', 'restore' or 'connect' your wallet. It is common because it works instantly and irreversibly. No legitimate service ever needs your seed phrase, so any request for it is the scam revealing itself." },
    { q: "How do I know if a crypto giveaway is a scam?", a: "If it asks you to send crypto first to receive more back, it is always a scam — no exceptions. Real giveaways never require a deposit, and the 'send 1 get 2' format fronted by a celebrity or exchange account is the oldest playbook in crypto. The account is hacked or spoofed and the 'proof' video is a loop." },
    { q: "Can a service really recover my stolen or lost crypto?", a: "No middleman can reverse an on-chain transaction, so any service promising to recover stolen or lost crypto for an upfront fee is a second scam targeting victims of the first. Some losses (a forgotten password on an encrypted wallet) are genuinely recoverable by you; a lost seed phrase with no backup, or coins sent to a scammer, generally are not." },
    { q: "What is a pig-butchering scam?", a: "A long-con investment-romance scam: a stranger builds trust over weeks on a dating app or messenger, then introduces a fake 'trading platform' that shows growing profits. You can deposit and watch fake gains, but withdrawing requires ever more 'fees' or 'taxes' — because nothing was ever invested and the platform is controlled by the scammer." },
  ],
};

export default guide;
