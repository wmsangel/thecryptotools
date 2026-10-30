import type { Guide } from "../types";

const guide: Guide = {
  slug: "how-to-find-and-claim-airdrops-safely",
  title: "How to Find and Claim Crypto Airdrops Safely",
  description:
    "Where real crypto airdrops actually come from, how to vet a source before you trust it, and a step-by-step checklist for claiming without getting your wallet drained.",
  readingMinutes: 9,
  updatedAt: "2026-10-30",
  reviewedAt: "2026-10-30",
  affiliate: "wallet",
  seo: {
    title: "How to Find and Claim Crypto Airdrops Safely (2026 Checklist)",
    keywords: [
      "how to find crypto airdrops",
      "how to claim airdrops safely",
      "are crypto airdrops safe",
      "how to claim an airdrop",
      "safe airdrop claiming",
      "airdrop aggregator",
      "find legit airdrops",
      "how to avoid airdrop scams",
    ],
    description:
      "A practical, evergreen guide to finding real crypto airdrops and claiming them safely — where to look, how to vet a source, the step-by-step safe-claim checklist, and the red flags that mean walk away. No live list, because those go stale and get hijacked.",
  },
  keyTakeaways: [
    "Find airdrops from **primary and neutral sources** — a project's own verified channels and established data aggregators — never from an ad, a DM or a search result you didn't vet.",
    "The single rule that prevents most losses: **reach a claim page only through the project's own verified link**, and read every transaction before you sign it.",
    "**Claim from a separate wallet** with only what you can afford to lose in it, and move or revoke after — a hardware wallet keeps the keys that matter offline.",
    "No legitimate airdrop ever needs your **seed phrase** or an **upfront payment**. Either of those is theft, every time.",
    "We don't publish a live \"active airdrops\" list — those pages go stale in days and are a favourite disguise for scams. Learn to find and vet them yourself instead.",
  ],
  relatedTools: [
    "crypto-airdrop-calculator",
    "gas-fee-calculator",
  ],
  body: [
    { type: "p", text: "Finding a real airdrop is the easy part; reaching the claim without losing your wallet is where people come unstuck. \"Free money\" lowers everyone's guard, and airdrops are the single most common lure in wallet-draining scams. This guide is the practical companion to [what airdrops are and how to qualify](/guides/crypto-airdrops-explained/): where legitimate drops actually surface, how to check a source before you trust it, and a step-by-step checklist for claiming safely." },

    { type: "callout", text: "Why there's no live list here: a page of \"active airdrops right now\" is stale within days, and a stale airdrop list is exactly what scammers clone and poison with fake claim links. A method that still works next month beats a list that's wrong by Friday." },

    { type: "h2", text: "Where real airdrops actually come from" },
    { type: "p", text: "Almost every genuine drop is announced in one of a small number of places. Learn these and you rarely need a random \"airdrop site\" at all:" },
    { type: "ul", items: [
      "The project's own verified channels — its official site, documentation, blog, and the verified X/Discord accounts linked from that site. This is the primary source; everything else is secondary.",
      "Neutral data aggregators you already trust for prices — the airdrop or 'earn' sections of large, established trackers (for example CoinGecko or CoinMarketCap) and ecosystem dashboards like DeFiLlama. Use them to spot candidates, then confirm on the project's own channels.",
      "Protocols you already use — the most valuable retroactive drops reward past activity on apps you were using before any token existed. Being an early, genuine user is the best 'source' of all.",
      "Snapshot and holder drops — for coins or NFTs you already hold, where eligibility is passive. These usually surface through the issuing project's channels.",
    ] },
    { type: "p", text: "Notice what's missing: ads, unsolicited DMs, YouTube comments, Telegram groups that found you, and tokens that just appeared in your wallet. None of those are sources — they're lures." },

    { type: "h2", text: "Vet the source before you trust it" },
    { type: "p", text: "Before you act on any airdrop you've found, run it through a quick source check. A claim that fails even one of these is not worth the risk:" },
    { type: "ul", items: [
      "Did the announcement come from, or link back to, the project's official domain? Open the site yourself; don't follow the link you were given.",
      "Does the project's verified X account and its own docs confirm the same drop, dates and claim URL? Cross-check at least two of its own channels.",
      "Is the claim domain the real one, character for character? Lookalike domains (a swapped letter, a .app instead of .com) are the core of the scam.",
      "Is anyone rushing you? Real claim windows are days or weeks. 'Expires in 1 hour' exists to stop you checking.",
      "Does it ask for money or a seed phrase to 'unlock'? Stop — that alone is proof it's fake.",
    ] },
    { type: "callout", text: "Find on an aggregator, confirm on the project. An aggregator tells you a drop might exist; only the project's own verified site tells you the real claim URL. Never claim from a link inside the aggregator (or an ad) without that confirmation step." },

    { type: "h2", text: "The safe-claim checklist" },
    { type: "p", text: "Once you've confirmed a drop is real and you're on the genuine site, the danger shifts from fake pages to what you sign. Work through this every time:" },
    { type: "ul", items: [
      "1. Reach the claim page only through the project's own verified link — typed or bookmarked, never from an ad, DM, or search result.",
      "2. Claim from a separate wallet that holds little or nothing, not your main vault. If the claim turns out to be malicious, there's nothing there to take.",
      "3. Read the transaction before signing. A claim should be a claim — be deeply suspicious of a 'set approval for all' or a signature that grants spending rights over tokens you already hold.",
      "4. Prefer a hardware wallet. It shows you what you're signing on its own screen and keeps the private key off the computer entirely, so a malicious site can't exfiltrate it.",
      "5. Check the gas cost first. On a small drop, claiming can cost more than the tokens are worth — price it before you spend.",
      "6. After claiming, review and revoke token approvals you no longer need, and move anything valuable back to your main wallet.",
    ] },
    { type: "tool", slug: "gas-fee-calculator" },
    { type: "p", text: "The reason step 3 matters so much is that modern wallet thefts are a malicious signature, not a stolen password — you authorise the drain yourself by approving something you didn't read. Our guide on [wallet drainers and approval scams](/guides/wallet-drainers-and-approval-scams/) shows exactly how those signatures work and how to revoke ones you've already given, and [how to avoid crypto scams](/guides/how-to-avoid-crypto-scams/) covers the wider pattern." },

    { type: "h2", text: "Red flags that mean walk away" },
    { type: "p", text: "If any of these show up, it's not a borderline call — close the tab:" },
    { type: "ul", items: [
      "It asks for your seed phrase or private key. No legitimate claim ever does. This hands over the entire wallet.",
      "It asks you to send crypto first to 'unlock', 'verify' or 'cover gas for' the airdrop. Real drops never require an upfront payment.",
      "The claim is a blind signature or an 'approve all' you can't read. If you can't tell what you're authorising, assume it's a drain.",
      "A token you never heard of appeared in your wallet and 'needs claiming' on some site. Interacting with it is the trap — leave it alone.",
      "The URL is almost-but-not-quite the official one, or you reached it from an ad or DM rather than the project's own site.",
    ] },
    { type: "callout", text: "The golden rule: a genuine airdrop either lands in your wallet on its own, or is claimed on the project's own verified site with a transaction you can read. Seed phrase, upfront payment, or blind signature — any one of those means it's theft." },

    { type: "h2", text: "After you claim: secure it, then count it" },
    { type: "p", text: "Getting the tokens is not the finish line. Two things decide whether an airdrop was actually worth it:" },
    { type: "ul", items: [
      "Custody — move anything meaningful off the burner wallet and into storage you control. For amounts worth protecting, that means a hardware wallet, with the recovery phrase written down offline and never typed into a web page.",
      "Tax and net value — in most countries a received airdrop is taxable income at its value on the day you receive it, and selling later is a separate capital-gains event. 'Free' tokens can still create a real tax bill.",
    ] },
    { type: "tool", slug: "crypto-airdrop-calculator" },
    { type: "p", text: "Run your real allocation and a realistic sell price through the numbers, net of gas and tax, before treating a drop as profit. For the full tax picture see [how airdrops are taxed](/guides/crypto-airdrops-explained/) and work out your own position with the tax calculator." },

    { type: "h2", text: "The bottom line" },
    { type: "ul", items: [
      "Find candidates on neutral aggregators and the project's own channels — never from ads, DMs or surprise tokens.",
      "Confirm every claim on the project's verified site, and read the transaction before you sign it.",
      "Claim from a throwaway wallet, prefer a hardware wallet for anything you keep, and revoke approvals after.",
      "Never give a seed phrase or pay upfront. Assume the drop is taxable on receipt, and log the value on the day.",
    ] },
  ],
  faq: [
    { q: "How do I find legitimate crypto airdrops?", a: "Start from primary and neutral sources: a project's own verified site, docs and linked social accounts, plus the airdrop sections of established trackers like CoinGecko, CoinMarketCap or DeFiLlama. Use aggregators only to spot candidates, then confirm the drop and the real claim URL on the project's own channels. The most valuable drops reward people who were already genuine early users of a protocol." },
    { q: "Are crypto airdrops safe to claim?", a: "Claiming a real airdrop from a project's own verified site is generally safe if you read the transaction before signing. The danger is fake claim sites and malicious signatures, not airdrops themselves. Claim from a separate low-value wallet, prefer a hardware wallet, never enter a seed phrase, and never pay upfront — that removes almost all of the risk." },
    { q: "Why don't you publish a list of active airdrops?", a: "Because a live 'active airdrops' list is stale within days and is exactly what scammers clone and poison with fake claim links. A method you can apply yourself — find on a neutral source, confirm on the project, claim safely — stays correct far longer than any list, and doesn't send readers to links we can't keep verifying." },
    { q: "How can I tell a fake airdrop from a real one?", a: "Real airdrops never ask for your seed phrase or an upfront payment, and are claimed on the project's own verified domain with a transaction you can read. Walk away from lookalike URLs, 'expires in 1 hour' pressure, surprise tokens that 'need claiming', and any blind 'approve all' signature. If you reached it from an ad or DM rather than the project's own site, treat it as a scam." },
    { q: "Should I use a separate wallet to claim airdrops?", a: "Yes. Claim into a wallet that holds little or nothing, so a malicious claim has nothing to steal, then move any genuine tokens to your main storage afterward. A hardware wallet is best for anything worth keeping because it shows what you're signing and keeps the private key off the computer." },
    { q: "Do I have to pay gas to claim an airdrop?", a: "Often yes — claiming is an on-chain transaction, so it costs gas on most networks. A legitimate airdrop never asks you to send a separate 'fee' or 'unlock payment' to a wallet, though. Check the gas cost before claiming: on a small drop it can exceed what the tokens are worth." },
  ],
};

export default guide;
