import type { Guide } from "../types";

/**
 * The unlock statistics quoted here are computed from OUR OWN dataset —
 * `public/data/unlocks.json`, snapshotted from DefiLlama on 2026-08-06:
 * 3,416 scheduled events across 136 projects, of which 2,689 are cliffs.
 * Re-run `npm run unlocks` and these figures move; recompute before editing.
 *
 * Deliberately does NOT re-explain cliff vs linear vesting or the price impact
 * of an unlock — `token-unlocks-and-vesting` owns that, and this guide links to
 * it rather than competing for the same queries.
 */
const guide: Guide = {
  slug: "crypto-tokenomics-explained",
  title: "Reading Tokenomics: What to Check Before You Buy a Token",
  description:
    "How to judge a token's supply design — the FDV gap, who actually holds the float, why unlocks should be ranked by share of supply rather than dollars, and whether burns do anything at all.",
  readingMinutes: 12,
  updatedAt: "2026-08-11",
  reviewedAt: "2026-08-11",
  seo: {
    title: "Crypto Tokenomics Explained — How to Read a Token's Supply Before You Buy",
    keywords: [
      "tokenomics",
      "crypto tokenomics explained",
      "tokenomics calculator",
      "fully diluted valuation",
      "fdv vs market cap",
      "token supply schedule",
      "low float high fdv",
      "token burn",
      "circulating supply crypto",
    ],
    description:
      "A practical framework for reading crypto tokenomics: the market cap to FDV gap, who holds the unissued supply, ranking unlocks by share of float instead of dollars, and what token burns actually achieve.",
  },
  relatedTools: [
    "tokenomics-calculator",
    "market-cap-calculator",
    "token-burn-calculator",
    "token-vesting-dilution-calculator",
  ],
  sources: [
    {
      label: "Token unlocks and vesting schedules — the dataset behind our unlock calendar",
      publisher: "DefiLlama",
      url: "https://defillama.com/unlocks",
    },
  ],
  body: [
    {
      type: "p",
      text: "Most people evaluate a token by looking at its price and its market capitalisation. Both are outputs. The inputs — how many tokens exist, how many will exist, who holds the ones that have not reached the market yet, and on what schedule they arrive — are published, usually months or years in advance, and are the part that actually determines whether today's price has a chance of holding.",
    },
    {
      type: "p",
      text: "This guide is the checklist. It deliberately does not re-explain how a vesting cliff works or how markets price in a known unlock date — our guide on token unlocks and vesting covers that in depth. This one is about what to look at before you own the thing.",
    },

    { type: "h2", text: "1. The gap between market cap and fully diluted valuation" },
    {
      type: "p",
      text: "Market capitalisation is price multiplied by circulating supply. Fully diluted valuation is price multiplied by every token that will ever exist. The ratio between them tells you how much of the token's eventual supply is currently in the market, and it is the fastest single screen you can run.",
    },
    {
      type: "p",
      text: "A project where market cap is 90% of FDV has essentially finished issuing. Its price has to fight ordinary supply and demand and nothing else. A project where market cap is 15% of FDV has six times its current float still to come, held by people who acquired it at a fraction of the current price, and every one of those tokens will eventually want a buyer.",
    },
    {
      type: "callout",
      text: "A low market-cap-to-FDV ratio is not automatically bad — every project starts there. It tells you the price you see is being set by a small, artificially scarce fraction of the supply, and that the rest is coming on a published schedule.",
    },
    {
      type: "p",
      text: "The pattern this produces has a name: low float, high FDV. A small percentage of supply is released at launch, the thin float makes the price easy to move upward, the headline valuation looks enormous, and the people holding the other 80% have a marked position they cannot yet sell. The design is not a secret and it is not necessarily malicious — but it means the market price was never a market-wide opinion, and it can fail badly when the supply catches up with the story.",
    },
    { type: "tool", slug: "market-cap-calculator" },
    {
      type: "p",
      text: "One practical use of FDV is as a sanity check rather than a valuation. Ask what the project would have to become for the fully diluted number to look reasonable, and compare that to companies or protocols that already exist. The answer is often clarifying in a way that the market cap alone is not.",
    },

    { type: "h2", text: "2. Rank unlocks by share of float, not by dollars" },
    {
      type: "p",
      text: "This is the single most useful correction to how supply events are usually reported, and it comes straight out of our own data. Every \"biggest unlocks this month\" list you will see is sorted by dollar value — which means it is sorted by market capitalisation, which means it shows you the same large caps every week.",
    },
    {
      type: "p",
      text: "A $400 million unlock against a $8 billion float is a five percent event. A $250 million unlock against a $249 million float doubles the supply. The dollar figure ranks them the wrong way round.",
    },
    {
      type: "table",
      caption: "From our unlock dataset — the same events ranked two ways (snapshot 6 August 2026)",
      headers: ["Token", "Unlock date", "Dollar value", "Share of circulating supply"],
      rows: [
        { cells: ["GRAM", "22 Feb 2027", "$1,513m", "39%"] },
        { cells: ["RAIN", "9 Feb 2027", "$482m", "5.5%"] },
        { cells: ["ONDO", "17 Jan 2027", "$298m", "16%"] },
        { cells: ["MON", "24 Nov 2026", "$250m", "100%"] },
      ],
    },
    {
      type: "p",
      text: "By dollars, RAIN outranks MON by nearly double. By what it does to the token, MON is releasing more than its entire existing float in a single event and RAIN is releasing about a twentieth of its own. Anyone screening by dollar size would look straight past the one that matters.",
    },
    {
      type: "callout",
      text: "Across 2,689 scheduled cliff unlocks in our dataset, 1,032 exceed 1% of the token's circulating supply, 194 exceed 5%, and only 37 exceed 10%. The events that genuinely reshape a token's supply are rare — which is exactly why they are worth finding rather than reading a list of the largest dollar amounts.",
    },
    {
      type: "cta",
      title: "See the unlock calendar ranked by share of supply",
      text: "Every scheduled unlock across 136 projects, sorted by what it does to the float rather than by dollar size, with cliffs and linear vesting kept separate so a daily drip cannot bury a genuine supply shock.",
      href: "/unlocks",
      label: "Open the unlock calendar",
    },

    { type: "h2", text: "3. Who is holding the supply that has not arrived yet" },
    {
      type: "p",
      text: "Not all pending supply behaves the same way when it lands, and the allocation category tells you a lot about what to expect. Tokens released to a treasury for ecosystem grants tend to enter the market slowly and for a reason. Tokens vesting to early investors who bought at a cent tend to enter it faster.",
    },
    {
      type: "table",
      caption: "How the scheduled cliff unlocks in our dataset break down by recipient",
      headers: ["Category", "Share of scheduled cliff events"],
      rows: [
        { cells: ["Insiders — team, advisors", "27%"] },
        { cells: ["Ecosystem and treasury", "24%"] },
        { cells: ["Non-circulating / reserves", "16%"] },
        { cells: ["Private sale investors", "15%"] },
        { cells: ["Farming and incentives", "11%"] },
        { cells: ["Staking rewards", "4%"] },
      ],
    },
    {
      type: "p",
      text: "Insiders and private-sale investors together account for well over 40% of scheduled cliff events. That is the supply with the largest gap between its acquisition cost and the market price, and therefore the supply with the least reason to hold through weakness.",
    },
    {
      type: "ul",
      items: [
        "Check the cliff date, not just the vesting length — a twelve-month cliff means nothing arrives for a year and then a great deal arrives at once",
        "Check whether the team's allocation vests on the same schedule as investors' or ahead of it",
        "Check whether \"ecosystem\" tokens have a published spending policy or are simply a discretionary pool",
        "Treat any allocation over about 20% to the team and investors combined as a question to answer rather than a red flag on its own",
      ],
    },
    { type: "tool", slug: "token-vesting-dilution-calculator" },

    { type: "h2", text: "4. Emissions: the supply that never stops" },
    {
      type: "p",
      text: "Unlocks end. Emissions do not. A protocol paying staking rewards, liquidity incentives or validator subsidies is issuing new tokens continuously, and that issuance is a cost borne by every existing holder through dilution — whether or not it is described that way.",
    },
    {
      type: "p",
      text: "The number to find is net inflation: new issuance minus anything permanently removed, as a percentage of circulating supply per year. A staking yield below the inflation rate is not income at all. It is a slower rate of dilution than the holders who did not stake are experiencing, dressed up as a return.",
    },
    {
      type: "callout",
      text: "If a chain issues 8% new supply a year and pays stakers 6%, staking does not earn you 6%. It loses you roughly 2% of your share of the network, while non-stakers lose 8%. The yield is a defence, not a profit.",
    },
    { type: "tool", slug: "tokenomics-calculator" },

    { type: "h2", text: "5. Burns, and whether they do anything" },
    {
      type: "p",
      text: "Token burns are the most enthusiastically marketed and least examined part of tokenomics. Sending tokens to an unspendable address does reduce supply, and if demand is unchanged, a smaller supply supports a higher price per token. The question is always whether the burn is large enough and funded by something real.",
    },
    {
      type: "p",
      text: "Two burns can look identical in a headline and be completely different in substance. A burn funded by protocol revenue — a share of fees the network actually earned — is a genuine transfer of value to holders, structurally similar to a share buyback. A burn of tokens from a treasury that the project minted itself and never sold removes supply that was never in circulation, which changes the total but not the float, and costs the issuer nothing.",
    },
    {
      type: "ul",
      items: [
        "Ask what funded it. Fee revenue is real; burning unissued treasury supply is an accounting gesture",
        "Compare the burn rate to the emission rate. A project burning 1% and issuing 6% is inflating, loudly",
        "Check whether the burn is recurring and rule-based or a one-off announcement timed to sentiment",
        "Work out the effect on supply as a percentage, not in token counts — burning a billion tokens sounds enormous and can be a rounding error",
      ],
    },
    { type: "tool", slug: "token-burn-calculator" },

    { type: "h2", text: "The short version" },
    {
      type: "p",
      text: "Tokenomics is not a mystical discipline. It is four numbers and one question: what fraction of the eventual supply is trading today, how fast is the rest arriving, who is holding it in the meantime, and is anything permanently removing supply at a rate that competes with what is being added.",
    },
    {
      type: "p",
      text: "All four are published. Most of the time the schedule is knowable years ahead, which makes this one of the few areas of crypto research where diligence is genuinely available rather than a euphemism for guessing. For what happens when one of those scheduled events actually arrives — how markets price it in, and why the price often moves before the date rather than on it — read our guide on token unlocks and vesting.",
    },
  ],
  faq: [
    {
      q: "What does FDV mean in crypto?",
      a: "Fully diluted valuation: the token price multiplied by the maximum supply that will ever exist, rather than by the supply circulating today. Comparing it to market cap tells you how much of the eventual supply is already trading — a market cap at 15% of FDV means roughly six times the current float is still to be issued.",
    },
    {
      q: "Is a low float, high FDV token a bad investment?",
      a: "Not automatically, but it means the price you see was set by a small and artificially scarce fraction of the supply, while the rest is held by people who acquired it far cheaper and are waiting on a published schedule. The risk is not that the design is dishonest — it is usually disclosed — but that the market price never reflected the full supply.",
    },
    {
      q: "How should I judge whether an unlock is big?",
      a: "As a share of circulating supply, not in dollars. In our own dataset of 2,689 scheduled cliff unlocks, only 37 exceed 10% of the token's float. A $482m unlock representing 5.5% of supply is far less consequential than a $250m one representing 100% of it, yet every dollar-ranked list puts them the other way round.",
    },
    {
      q: "Do token burns increase the price?",
      a: "Only if the burn is large relative to supply and funded by something real. A burn paid for out of protocol fee revenue transfers value to holders in much the way a share buyback does. Burning tokens from a treasury the project minted itself removes supply that was never circulating, which changes the headline total and nothing else.",
    },
    {
      q: "What is a healthy inflation rate for a token?",
      a: "There is no universal figure, but the comparison that matters is issuance against whatever is permanently removed, expressed as a percentage of circulating supply per year. If a network issues 8% and pays stakers 6%, staking is a defence against dilution rather than a return — you are still losing share of the network, just more slowly than everyone else.",
    },
    {
      q: "Where can I find a token's real supply schedule?",
      a: "The project's own documentation is the primary source, and it is usually more detailed than aggregator summaries. Cross-check against on-chain vesting contracts where they exist, since a schedule enforced by a contract is a commitment and a schedule written in a blog post is an intention. Our unlock calendar tracks the scheduled events for 136 projects.",
    },
  ],
};

export default guide;
