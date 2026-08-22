import type { Guide } from "../types";

const guide: Guide = {
  slug: "how-to-store-a-seed-phrase",
  affiliate: "wallet",
  title: "How to Store a Seed Phrase (Without Losing It or Leaking It)",
  description:
    "Your seed phrase is the wallet. Storing it badly is the single most common way people lose crypto — and the two failure modes, theft and loss, pull in opposite directions. Here is how to balance them.",
  readingMinutes: 8,
  updatedAt: "2026-07-30",
  seo: {
    keywords: [
      "how to store seed phrase",
      "seed phrase backup",
      "metal seed phrase storage",
      "recovery phrase security",
      "bip39 seed phrase",
      "split seed phrase",
    ],
    description:
      "How to store a crypto seed phrase safely: paper vs metal, how many backups and where, why splitting the words is usually a mistake, passphrase trade-offs, and how to test recovery before you fund the wallet.",
  },
  relatedTools: ["crypto-price-converter", "gas-fee-calculator", "satoshi-converter"],
  body: [
    { type: "p", text: "A seed phrase is not a password to your wallet. It is the wallet. Twelve or twenty-four ordinary English words encode the master key from which every address and every private key you will ever use is derived. Anyone who reads those words owns the coins, instantly and irreversibly, from anywhere on earth. Anyone who loses them — including you — loses the coins just as permanently. Every decision about storage is a trade between those two failures, and optimising hard against one usually makes the other worse." },
    { type: "p", text: "That tension is the whole problem. Lock the phrase away so thoroughly that no thief could ever find it, and you have built a very effective way to lock yourself out. Keep it convenient enough to use, and you have kept it convenient enough to steal. What follows is how to land somewhere sensible." },

    { type: "h2", text: "What the words actually are" },
    { type: "p", text: "Almost every wallet uses the BIP-39 standard: words are drawn from a fixed public list of 2,048, and the phrase carries a checksum, so a mistyped or misremembered word is usually rejected rather than silently opening an empty wallet. Order matters — the same words in a different sequence produce a completely different wallet. Handily, the first four letters of each word are unique in the list, so 'abandon' and 'abando' recover identically, and a smudged ending is not fatal." },
    { type: "p", text: "The standard also means you are not locked to one vendor. A phrase generated on one manufacturer's device restores onto a different manufacturer's device, or into a software wallet in an emergency. Your backup is of the phrase, never of the hardware." },
    { type: "callout", text: "The phrase is worth exactly as much as the wallet it controls. Treat a scrap of paper holding your life savings the way you would treat the savings themselves — because to an attacker there is no difference between the two." },

    { type: "h2", text: "Paper is fine. Metal is better." },
    { type: "p", text: "Write the words by hand, in order, numbered, the moment the device generates them. Handwriting is not a quaint detail: it keeps the phrase off every keyboard, clipboard and screen buffer in your house. Then move it to metal." },
    { type: "ul", items: [
      "Paper burns at a few hundred degrees, dissolves in a flood and fades in sunlight. House fires and burst pipes are far more common than targeted crypto burglaries, so the mundane risks deserve most of your attention.",
      "Metal backup plates — stamped, punched or engraved letter tiles — survive house-fire temperatures and water. The specific product matters much less than the fact that it is metal and legible.",
      "Only the first four letters of each word need to fit, which makes stamping far less tedious than it looks.",
      "Verify the metal copy against the paper one word by word, out loud, before destroying the paper. Transcription errors are the most common defect in an otherwise good backup.",
    ] },

    { type: "h2", text: "How many copies, and where" },
    { type: "p", text: "One copy in one building is one fire away from zero. Two is the practical minimum, in genuinely separate locations — not the safe and the desk drawer of the same house. A bank safe deposit box, a trusted relative's home, a second property. Each additional copy improves your odds against loss and worsens them against theft, which is why two or three is the usual answer and seven is not." },
    { type: "ul", items: [
      "Separate the backup from the device. A hardware wallet sitting next to its own seed phrase is a single object that gives a burglar everything.",
      "Think about who has routine access to each location — cleaners, landlords, housemates, family. A safe that everyone knows the code to is a decorative box.",
      "Do not label it. A tin marked 'BITCOIN SEED' is an advertisement. Unlabelled metal in a drawer of boring objects is a better hiding place than an obvious safe.",
      "If you move house, rotate jobs or end a relationship, revisit the list of people who could reach a copy.",
    ] },

    { type: "h2", text: "Where the phrase must never go" },
    { type: "p", text: "The moment those words touch an internet-connected device, assume they are compromised and move the funds. This is not paranoia; it is the observed pattern in nearly every self-custody loss." },
    { type: "ul", items: [
      "No photographs. Your camera roll syncs to a cloud account protected by a password and a phone number, both of which are attackable.",
      "No cloud notes, no email drafts, no chat message to yourself, no spreadsheet.",
      "No password managers, for the phrase itself. They are excellent for passwords and are still an online-reachable vault; a compromise there should not also cost you your coins.",
      "Never type it into a website or app because something told you to 'validate', 'sync' or 'restore' your wallet. No legitimate service ever needs it. This single lie accounts for an enormous share of drained wallets.",
      "Never read it aloud on a call, a stream or in a room with a smart speaker.",
    ] },
    { type: "tool", slug: "crypto-price-converter" },

    { type: "h2", text: "Splitting the phrase: usually a mistake" },
    { type: "p", text: "The intuitive idea — keep twelve words here, twelve there, so no single location is enough — is less clever than it appears. Twelve unknown words still leave an infeasible search space, so it does raise the bar against a thief who finds one half. But it converts your backup into a scheme where both halves must survive: you have doubled the chance of permanent loss to defend against the rarer risk. And nothing warns you if half is destroyed until the day you need it." },
    { type: "p", text: "If you genuinely need distributed storage, use a scheme designed for it. Shamir-style splitting (SLIP-39, supported by some devices) produces shares where any k of n reconstruct the secret — three shares of which any two work, for instance. That survives losing a share and still resists someone finding one. The cost is complexity, and complexity is itself a failure mode. For most people, two full copies in two locations beats any clever split." },

    { type: "h2", text: "The passphrase question" },
    { type: "p", text: "A BIP-39 passphrase — often called the 25th word — mixes an arbitrary string of your choosing into the seed, producing an entirely separate wallet. Its strength is that the words alone are then useless: someone who finds your metal plate gets an empty wallet, not your funds. Some people fund that decoy wallet lightly so a coerced 'show me' produces something plausible." },
    { type: "p", text: "The danger is the flip side. There is no checksum on a passphrase and no error message: a typo silently opens a different, empty, perfectly valid wallet. Forget it and no amount of correct words will bring the funds back. If you use one, store it separately from the phrase, write it down somewhere, and confirm you can reproduce it character for character — including capitals and spaces — before you rely on it." },

    { type: "h2", text: "Test the recovery before you fund it" },
    { type: "p", text: "This is the step almost everyone skips, and it is the one that catches the errors while they are still free to fix. Once the phrase is written and transferred to metal, wipe the device and restore it from your own backup. If the restored wallet shows the same first receiving address, your backup is proven. If it does not, you have just discovered — at zero cost — that you would have lost everything." },
    { type: "p", text: "Then send a small test transaction, confirm it arrives, and only afterwards move the real balance. Re-check the backups once a year: confirm both copies still exist, are still legible, and that you still remember where the second one is. A backup you have not looked at in five years is an assumption, not a plan." },
    { type: "p", text: "Finally, write down what happens if you are not around to do any of this. A phrase nobody can find is indistinguishable from a phrase that was never written — see our guide on crypto inheritance for how to solve that without leaving your keys in a will." },
  ],
  faq: [
    { q: "Can I store my seed phrase in a password manager?", a: "It is better than a plain cloud note but worse than metal. A password manager is reachable from the internet by design, so a compromise of that one account would cost you both your passwords and your coins. Keep the phrase offline and use the manager for everything else." },
    { q: "Is 12 words less secure than 24?", a: "In practice, no. A 12-word phrase carries 128 bits of entropy, which is beyond any brute-force capability that exists or is projected to exist. Twenty-four words gives 256 bits, which is more margin against theoretical future attacks. Neither will be guessed; how you store them matters vastly more than the length." },
    { q: "What if I lose one word?", a: "Recovery is sometimes possible: the BIP-39 checksum plus the known word list narrows the candidates enough that specialist tools can search them, especially if you know the position. It is slow, uncertain, and requires exposing the rest of your phrase to whatever tool you use. Treat it as an emergency measure, not a safety net." },
    { q: "Should I write down which wallet the phrase belongs to?", a: "Note the device type and derivation path separately from the words, not on the same plate. Knowing whether it was a Bitcoin-only or multi-chain wallet saves hours during a recovery, but a label that identifies the phrase as valuable defeats the point of hiding it." },
    { q: "Do I need a new seed phrase for each coin?", a: "No. One phrase derives keys for every chain your wallet supports. That is convenient and also concentrating: one backup failure affects everything, which is an argument for a second wallet with a separate phrase once your balance is large." },
    { q: "Someone may have seen my seed phrase. What now?", a: "Move the funds immediately to a wallet created from a completely new phrase. Do not merely change the PIN or passphrase — the phrase itself is the key, and once it is out it cannot be revoked. Speed matters more than tidiness here." },
  ],
};

export default guide;
