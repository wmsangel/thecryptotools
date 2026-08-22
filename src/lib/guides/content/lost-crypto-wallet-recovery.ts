import type { Guide } from "../types";

const guide: Guide = {
  slug: "lost-crypto-wallet-recovery",
  affiliate: "wallet",
  title: "Lost Access to a Crypto Wallet? What Is Actually Recoverable",
  description:
    "Some losses are fixable in ten minutes, some need specialist help, and some are genuinely final. Knowing which is which stops you wasting months — or handing your remaining coins to a fake recovery service.",
  readingMinutes: 8,
  updatedAt: "2026-07-30",
  seo: {
    keywords: [
      "lost crypto wallet recovery",
      "forgot wallet password",
      "lost seed phrase",
      "recover bitcoin wallet",
      "crypto recovery scam",
      "wallet.dat recovery",
    ],
    description:
      "What is genuinely recoverable when you lose access to a crypto wallet: forgotten passwords, missing words, wrong derivation paths, broken hardware, old wallet files — and how to spot the recovery services that are themselves scams.",
  },
  relatedTools: ["crypto-price-converter", "satoshi-converter", "gas-fee-calculator"],
  body: [
    { type: "p", text: "Losing access feels identical whatever the cause, which is why people so often give up on situations that were fixable, or spend two years chasing ones that were not. The useful first move is triage: work out which category you are in before doing anything else, because the categories have almost nothing in common." },
    { type: "p", text: "The dividing line is simple. Does the secret still exist somewhere — in your possession, in your memory, in a file — or is it genuinely gone? Almost everything on the recoverable side is a matter of finding, searching or reconstructing. Nothing on the other side is a matter of effort." },

    { type: "h2", text: "Recoverable: you have the seed phrase" },
    { type: "p", text: "If you hold the words, you hold the wallet, whatever happened to the device. A broken, lost, stolen or bricked hardware wallet is an inconvenience — buy any compatible device, or install a reputable software wallet, and restore. Nothing was stored on the device that is not derivable from the phrase." },
    { type: "ul", items: [
      "If the device was stolen rather than broken, restore onto new hardware and immediately move the funds to a freshly generated wallet. A thief with the device needs only your PIN, and PINs are guessable far more often than seeds.",
      "A manufacturer going out of business changes nothing. BIP-39 phrases are an open standard and restore across vendors.",
      "If the restore shows an empty wallet, do not panic and do not conclude the funds are gone — that is usually a derivation-path problem, covered below.",
    ] },

    { type: "h2", text: "Recoverable with work: the wallet restores empty" },
    { type: "p", text: "This is the most common false alarm. Your words are correct, the wallet opens, and the balance is zero. Almost always the software is deriving a different set of addresses from the same seed than the original wallet did." },
    { type: "ul", items: [
      "Bitcoin wallets can derive legacy, wrapped SegWit, native SegWit and Taproot addresses from one seed, each at its own derivation path. A wallet defaulting to one will show nothing if your coins are on another. Good recovery tools let you scan all common paths — do that before concluding anything.",
      "Check whether the original wallet used a passphrase. A passphrase produces a completely different wallet with no error message, so a forgotten one looks exactly like an empty result. Try your candidates, including with and without capitals and trailing spaces.",
      "On EVM chains, check other networks. Funds sitting on a chain your wallet is not watching are invisible until you add it.",
      "Verify against a block explorer. If you can find your address and see the balance there, the coins exist and the problem is purely on the wallet's side — which is a good position to be in.",
    ] },

    { type: "h2", text: "Recoverable with specialists: a forgotten password" },
    { type: "p", text: "A password is not a seed phrase, and the difference decides everything. Passwords encrypt a wallet file that you still possess; they are guessable, and specialists brute-force them for a fee. Cases in this category include old Bitcoin Core wallet.dat files, encrypted keystore files from early Ethereum wallets, and password-protected exports." },
    { type: "ul", items: [
      "The more you remember, the better the odds — length, character patterns, the family of passwords you used at the time, whether it started with a capital. Serious services build a targeted search from your recollections rather than trying everything.",
      "Never send the file plus your best-guess list to someone unvetted. That is the whole wallet. Established firms work on a no-recovery-no-fee basis with a percentage, and will talk you through their process before you send anything.",
      "Hardware wallet PINs are the opposite: devices wipe after a small number of wrong attempts by design. There is no brute-forcing them. You need the seed phrase.",
    ] },
    { type: "tool", slug: "crypto-price-converter" },

    { type: "h2", text: "Sometimes recoverable: a missing word or a scrambled order" },
    { type: "p", text: "BIP-39 helps here. The words come from a fixed 2,048-word list and the phrase carries a checksum, so the space of valid completions is far smaller than it looks. One missing word from a 12-word phrase is a modest search; knowing its position makes it smaller again. Two or three missing words gets hard but is not always hopeless. A known set of words in unknown order is also searchable, though the difficulty climbs steeply." },
    { type: "p", text: "Open-source tools exist for this and can be run offline on a machine you control, which is strongly preferable to typing your partial phrase into anything online. If you are hiring help, the same rule as passwords applies — reputation, clear terms, and no payment before results. A misspelling, incidentally, is often trivial: only the first four letters of each BIP-39 word are significant, and a word that is not on the list can usually be matched to its intended neighbour." },

    { type: "h2", text: "Not recoverable" },
    { type: "p", text: "Being straight about this is kinder than the alternative, because the alternative is people spending years and further money on hope." },
    { type: "ul", items: [
      "Seed phrase destroyed or lost entirely, with no other copy and no live device holding the key. There is no institution with a backup and no reset mechanism. Guessing a 12-word phrase is not a difficult problem; it is an impossible one.",
      "Coins sent to a wrong address you do not control, including token contracts and burn addresses. Blockchains do not have a reversal function, and no amount of contacting anyone changes that.",
      "A forgotten passphrase where the seed phrase alone is correct. The words are useless without it.",
      "Funds on an exchange that has collapsed. This is not a technical recovery problem — it is an insolvency claim, handled through the administrators, usually slowly and partially.",
    ] },
    { type: "callout", text: "If your seed phrase is genuinely gone and no device still holds the key, the coins are not retrievable by any means. Anyone who tells you otherwise is about to take more of your money." },

    { type: "h2", text: "Recovery scams: the second loss" },
    { type: "p", text: "People who have just lost access are the most reliably targeted group in this industry, because they are motivated, upset and often publicly identifiable from a forum post. The pattern is consistent enough to name." },
    { type: "ul", items: [
      "Unsolicited contact — a reply, a DM, an email — from someone offering to recover your funds. Legitimate firms do not cold-approach victims.",
      "Any upfront fee, 'unlocking' payment, 'gas deposit' or tax that must be paid before the funds are released. This is the entire business model.",
      "Claims of recovering coins from a lost seed phrase, or of 'reversing' a blockchain transaction. Both are technically impossible; the offer identifies the offeror.",
      "Requests for your seed phrase, private key or remote access to your computer. No genuine service needs any of these.",
      "Fake 'wallet validation' or 'asset verification' portals that ask you to import a phrase to check whether the funds are recoverable. This is a drainer wearing a lab coat.",
      "Follow-up scams targeting people who already lost money once, sometimes posing as law enforcement or a regulator running a compensation scheme.",
    ] },
    { type: "p", text: "The legitimate part of this field is narrow and honest about it: password cracking on files you still hold, partial-phrase search, and forensic help with corrupted drives. Those firms describe exactly which cases they can take, decline the impossible ones, and charge on success." },

    { type: "h2", text: "What to do in the next hour" },
    { type: "ul", items: [
      "Stop and write down what you actually have: any words, any files, any devices, any password fragments, any email confirmations naming an exchange or wallet.",
      "Search physically. Old notebooks, drawers, safes, the back of a filing cabinet, a relative's house. A striking share of recoveries are somebody finding the card they wrote three years ago.",
      "Search digitally, on your own machines, offline. Old backups, disk images, defunct phones, that laptop in the cupboard. Wallet files persist in places people forget — an old Time Machine or Windows backup has resolved more than a few cases.",
      "Do not type any partial secret into a website, however helpful it looks.",
      "Confirm the coins are still there before spending money on recovery: look the address up on a block explorer. Discovering they were moved in 2019 changes the problem entirely.",
      "If the wallet may be compromised rather than merely inaccessible, move any remaining funds first and investigate afterwards.",
    ] },
    { type: "p", text: "And once you are through it, whichever way it goes: rebuild with tested backups. Restore the new wallet from your own written phrase before funding it, keep two copies in separate places, and put a note somewhere your family would find explaining what exists and who to ask. Nearly every loss in this article traces back to a backup that was never verified or never findable." },
  ],
  faq: [
    { q: "Can anyone recover crypto from a lost seed phrase?", a: "No. If the phrase is gone and no device or backup still holds the key, the funds are permanently inaccessible. There is no administrator, no reset and no brute-force approach that works. Every service claiming otherwise is a scam." },
    { q: "I forgot my wallet password but I still have the file. Is that different?", a: "Completely different, and far more hopeful. Passwords encrypt a file you still possess and can be attacked, especially if you remember fragments. Established recovery firms handle exactly these cases, typically for a percentage on success." },
    { q: "My hardware wallet is broken. Are my coins lost?", a: "No, assuming you have the seed phrase. The device holds no unique data — restore onto any compatible wallet. If the device was stolen rather than broken, restore and then move everything to a new wallet, since a thief needs only your PIN." },
    { q: "My wallet restored but shows zero balance. What now?", a: "Usually a derivation-path mismatch, a missing passphrase, or the wrong network. Scan all standard paths with recovery software, try your passphrase candidates, and look the address up on a block explorer to confirm where the coins actually are before assuming the worst." },
    { q: "Can a transaction sent to the wrong address be reversed?", a: "No. Blockchain transactions are final by design. The only route is asking the recipient to return the funds, which requires them to exist, be identifiable and be willing." },
    { q: "How do I tell a real recovery service from a scam?", a: "Real ones never contact you first, never ask for your seed phrase, never charge upfront, and are explicit that lost-seed cases are impossible. Scams reverse every one of those. Charging a success fee against a file you supply is legitimate; demanding a payment to 'release' funds is not." },
  ],
};

export default guide;
