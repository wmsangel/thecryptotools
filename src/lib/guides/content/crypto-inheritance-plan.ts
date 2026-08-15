import type { Guide } from "../types";

const guide: Guide = {
  slug: "crypto-inheritance-plan",
  title: "Crypto Inheritance: Making Sure Your Coins Outlive You",
  description:
    "Self-custody has no next of kin, no password reset and no probate department. Without a plan your holdings simply stop existing for everyone else. Here is how to fix that without putting your keys in a will.",
  readingMinutes: 9,
  updatedAt: "2026-07-30",
  seo: {
    keywords: [
      "crypto inheritance",
      "crypto estate planning",
      "pass on bitcoin to family",
      "crypto will seed phrase",
      "dead mans switch crypto",
      "crypto beneficiary",
    ],
    description:
      "How to leave crypto to your heirs: why a seed phrase must never go in a will, sealed instructions vs multisig vs timelocks, writing recovery documentation a non-technical person can follow, and the tax paperwork your executor will need.",
  },
  relatedTools: ["crypto-tax-calculator", "portfolio-rebalance-calculator", "crypto-price-converter"],
  body: [
    { type: "p", text: "Every property of self-custody that makes it valuable while you are alive makes it hostile afterwards. There is no institution holding the asset, no account to be transferred, no identity check that a grieving relative can pass. If the keys die with you, so do the coins — they stay visible on the ledger forever, provably yours, permanently unreachable. A meaningful share of all lost crypto is exactly this: not stolen, not spent, just orphaned." },
    { type: "p", text: "The problem is genuinely awkward, because the requirements pull apart. Your heirs need enough information to access everything. You need them not to have it while you are alive. And whatever bridges that gap has to survive years of neglect and work for someone who may not know what a seed phrase is." },

    { type: "h2", text: "Never put the keys in the will" },
    { type: "p", text: "This is the mistake to rule out first. In many jurisdictions a will becomes a public record once it enters probate — searchable by anyone, including people who search it specifically for this. Even where it stays private, a will passes through solicitors, executors and court staff, and it can sit in a drawer for years before it is needed." },
    { type: "p", text: "The will should establish who inherits the crypto and who is authorised to access it. It should never contain the seed phrase, the passphrase, the PIN or anything else that could spend the funds. Keep the legal instrument and the secret strictly separate: the will points to where the access instructions are and who may open them; the instructions themselves live somewhere else entirely." },
    { type: "callout", text: "Test the plan against a blunt question: if this document leaked tomorrow, while I am alive and well, would I lose money? If the answer is yes, the secret is in the wrong place." },

    { type: "h2", text: "Start with an inventory, not with keys" },
    { type: "p", text: "Before any mechanism, write down what exists. Heirs frequently fail not because access was impossible but because nobody knew there was anything to look for — a hardware wallet in a drawer is an anonymous plastic object." },
    { type: "ul", items: [
      "Which assets, roughly how much, and on which chains. Approximate is fine; the point is that someone knows to look.",
      "Where every wallet and backup physically lives — including safe deposit boxes, which require their own legal access arrangements that can take weeks to unlock.",
      "Which exchanges hold accounts, in whose name, with which email. Custodial balances follow a completely different process: exchanges have bereavement procedures requiring a death certificate and probate documents, and heirs need to know the account exists to start it.",
      "Any staked, locked or vesting positions with their unlock schedules, plus anything delegated to a validator.",
      "Who to ask for help — a specific named person who understands crypto and would assist your family honestly.",
    ] },
    { type: "p", text: "This inventory contains no secrets, so it can live with your will and be updated freely. Date it. Review it once a year, in the same session where you check your backups are still legible." },

    { type: "h2", text: "Mechanisms that actually work" },
    { type: "ul", items: [
      "Sealed instructions with a professional. A solicitor or notary holds a sealed envelope, released on death to named people. Cheap, boring, legally familiar, and dependent on the professional's own storage practices — split the secret between two independent holders if the amount justifies it.",
      "Multisig with a designated heir. In a 2-of-3, you hold two keys and your heir or their lawyer holds the third. Alone, that key does nothing. Combined with a second key released after death, it spends. This is the cleanest technical answer for significant balances: nothing exists in one place, and no single leak is fatal.",
      "Collaborative custody. A provider holds one key of a multisig and offers a documented inheritance process. You pay a fee and accept some privacy loss in return for an institution your family can telephone.",
      "Timelocks. Bitcoin can enforce a spending path that becomes valid only after a set date, letting an heir's key activate after a delay you keep pushing forward while alive. Elegant, unforgiving of neglect, and only for people who will genuinely maintain it.",
      "Dead-man's-switch services that email your secrets after a period of silence. Convenient and requiring you to trust a company with everything, permanently, including its future owners. Treat with suspicion.",
    ] },

    { type: "h2", text: "Write the instructions for a non-technical reader" },
    { type: "p", text: "The mechanism is the easy half. The documentation is what usually fails, because it is written by someone fluent for someone who is not, at a moment when they are grieving and unlikely to spend an evening researching derivation paths." },
    { type: "ul", items: [
      "Write it as a numbered procedure, in plain language, assuming zero prior knowledge. 'Connect the black device to a computer using the cable in the same box, open the application named X, and follow the recovery option' — not 'restore the seed'.",
      "Name the hardware, the software and where each is downloaded from. Include a warning that search results and adverts for wallet software are frequently fake.",
      "Explain that nobody legitimate will ever ask for the recovery words, and that anyone who does is stealing. Your heirs will be an obvious target the moment they start asking questions in public forums.",
      "Say explicitly what to do first: move everything to a new wallet the heir controls, or transfer to a reputable exchange to sell. Indecision is where the coins sit for years.",
      "Include the tax paperwork pointer — acquisition dates and prices, because those determine what is owed. Without records the tax authority may treat the cost basis as zero.",
      "Print it. A document stored only on an encrypted drive whose password died with you is not documentation.",
    ] },
    { type: "tool", slug: "crypto-tax-calculator" },

    { type: "h2", text: "The tax side your executor will face" },
    { type: "p", text: "Rules vary sharply by country, and this is where an unprepared estate loses money that had nothing to do with lost keys. Some jurisdictions levy inheritance or estate tax on the value at the date of death — which means a valuation is needed for a volatile asset on a specific day, and the tax may fall due even if the price has since halved. Others levy nothing on inheritance but pass the original cost basis to the heir, so the eventual sale carries the full historical gain. A few reset the cost basis to the date-of-death value, which is far kinder to whoever sells later." },
    { type: "p", text: "What you can do now is make the numbers reconstructable: keep a record of what was bought, when and at what price, stored with the inventory. Our region-by-region crypto tax guides cover the treatment where you live, and an estate holding meaningful crypto is worth an hour of a local professional's time — ideally one who has handled it before, since many have not." },

    { type: "h2", text: "Rehearse it" },
    { type: "p", text: "A plan nobody has tested is a hypothesis. Walk a trusted person through the documentation while you are alive and able to answer questions, using a wallet holding a trivial amount. Watch where they hesitate. Every point of confusion in that dry run is a point where, without you, the process would simply have stopped." },
    { type: "p", text: "Then keep it current. Inheritance plans rot faster than almost any other document: you buy a new device, move funds to a different chain, change the safe deposit box, add an exchange. An annual review — same day each year, alongside checking your metal backups are still legible — is enough. What you are protecting against is the ordinary case where the plan was written once, three years and two wallets ago, and quietly stopped describing reality." },
  ],
  faq: [
    { q: "Can I just put my seed phrase in a sealed envelope with my will?", a: "Not in the will itself — probate can make it public in many jurisdictions. A separately sealed envelope held by a solicitor, referenced but not reproduced in the will, is far safer. For larger amounts, split the secret across two independent holders so no single professional can act alone." },
    { q: "What happens to crypto on an exchange when someone dies?", a: "Exchanges have bereavement procedures: the executor supplies a death certificate and probate documents, and the balance is transferred or liquidated to the estate. It is slow but it works — provided the family knows the account exists, which is the usual sticking point." },
    { q: "Is a dead man's switch a good idea?", a: "It is convenient and it requires trusting a company with your keys indefinitely, including whoever owns it in ten years. If you use one, do not give it a complete secret — pair it with a mechanism where its share alone is insufficient." },
    { q: "How do my heirs pay tax on inherited crypto?", a: "It depends entirely on the country. Some charge inheritance or estate tax on the date-of-death value; others charge nothing on inheritance but pass on your original cost basis, so the heir owes capital gains on the full historical gain when they sell. Keep acquisition records with the estate documents and check the guide for your jurisdiction." },
    { q: "Should I tell my family how much crypto I own?", a: "They need to know it exists and roughly what to expect, or they will not look for it. Precise amounts are optional and can create their own problems. The inventory bridges this: enough for them to act, nothing that lets anyone spend." },
    { q: "What if my heirs are not technical at all?", a: "That is the normal case, and it argues for a mechanism with a human in it — a collaborative custody provider or a named technical helper — rather than an elegant self-hosted setup. Also name a fallback: if the coins are simply sold on arrival, they still inherit the value, which is far better than a perfect plan nobody can execute." },
  ],
};

export default guide;
