import type { Guide } from "../types";

/**
 * The network figures below are a DATED SNAPSHOT, read live from mempool.space
 * on 2026-08-11 (tip 961,987 · difficulty 127.48 T · ~900 EH/s) with BTC at
 * $64,025. They are presented as "as of" figures throughout and must never be
 * reworded into present-tense facts — hashrate and difficulty move constantly.
 * The break-even table is derived arithmetically from those figures, so if you
 * refresh one you must refresh the other.
 */
const guide: Guide = {
  slug: "crypto-mining-profitability",
  title: "Bitcoin Mining Profitability: The Only Number That Decides It",
  description:
    "Mining revenue per terahash is set by the network, not by you. Here is how to work out the electricity price at which your hardware breaks even, why difficulty erodes your share, and what the halving does to all of it.",
  readingMinutes: 12,
  updatedAt: "2026-08-11",
  reviewedAt: "2026-08-11",
  seo: {
    title: "Bitcoin Mining Profitability Explained — Break-Even Electricity Price by J/TH",
    keywords: [
      "crypto mining profitability",
      "bitcoin mining profitability",
      "crypto mining calculator",
      "is bitcoin mining profitable",
      "mining break even electricity price",
      "bitcoin mining difficulty",
      "hashprice",
      "asic miner profitability",
      "bitcoin halving mining",
    ],
    description:
      "How bitcoin mining profitability really works: revenue per terahash, the break-even electricity price for each efficiency class, why difficulty adjustment erodes your share, and what the next halving does to the maths.",
  },
  relatedTools: [
    "mining-profitability-calculator",
    "hashrate-converter",
    "bitcoin-halving-countdown",
    "compound-interest-calculator",
  ],
  sources: [
    {
      label: "Network hashrate, difficulty and block height",
      publisher: "mempool.space",
      url: "https://mempool.space/graphs/mining/hashrate-difficulty",
    },
  ],
  body: [
    {
      type: "p",
      text: "Every bitcoin miner on earth earns the same amount per unit of hashing. There is no edge in strategy, no better entry price, no skill in execution. The protocol pays out a fixed quantity of coin per block and divides it among everyone hashing, in proportion to how much hashing they did. That single fact makes mining profitability unusually easy to reason about — and it means the answer to \"is mining profitable?\" almost never depends on the thing people ask about.",
    },
    {
      type: "p",
      text: "It depends on what your electricity costs.",
    },

    { type: "h2", text: "Revenue per terahash, and why it is not yours to influence" },
    {
      type: "p",
      text: "Start from the top. The network issues a fixed block subsidy every ten minutes on average, and that total is shared across all the hashing being done. Divide one by the other and you get revenue per terahash per day — the industry calls it hashprice — and it is the same for a hobbyist with one machine and a listed company with a hundred thousand.",
    },
    {
      type: "callout",
      text: "As of 11 August 2026: block height 961,987, network hashrate around 900 EH/s, difficulty 127.48 trillion, block subsidy 3.125 BTC. That is 450 BTC issued per day, which at $64,025 per coin works out at roughly $0.032 per terahash per day before transaction fees.",
    },
    {
      type: "p",
      text: "Three cents per terahash per day is the entire revenue side of the business. Your machine's specification tells you how many terahashes you contribute; multiply and you have your gross income. Nothing you do changes the rate — you can only change how much electricity you burn producing each terahash, and what that electricity costs.",
    },
    { type: "tool", slug: "hashrate-converter" },

    { type: "h2", text: "The break-even electricity price" },
    {
      type: "p",
      text: "Hardware efficiency is quoted in joules per terahash, and it converts directly into kilowatt-hours: a machine at 13.5 J/TH burns 0.324 kWh producing one terahash for a day. Divide the revenue by that consumption and you get the electricity price at which the machine earns exactly nothing.",
    },
    {
      type: "table",
      caption: "Break-even electricity price by hardware efficiency, at $0.032 per TH/day (11 August 2026)",
      headers: ["Efficiency", "Example hardware", "kWh per TH per day", "Break-even electricity"],
      rows: [
        { cells: ["9.5 J/TH", "Antminer S23 Hydro class", "0.228", "$0.140 / kWh"] },
        { cells: ["12 J/TH", "S21 XP Hydro class", "0.288", "$0.111 / kWh"] },
        { cells: ["13.5 J/TH", "S21 XP, air-cooled", "0.324", "$0.099 / kWh"] },
        { cells: ["17.5 J/TH", "S21 class", "0.420", "$0.076 / kWh"] },
        { cells: ["20 J/TH", "Ageing fleet", "0.480", "$0.067 / kWh"] },
        { cells: ["30 J/TH", "Previous generation", "0.720", "$0.044 / kWh"] },
      ],
    },
    {
      type: "p",
      text: "This table answers the question people actually came to ask, and it answers it uncomfortably. Residential electricity in most of the United States and Europe costs meaningfully more than ten cents per kilowatt-hour. At those tariffs the best air-cooled machine on the market produces less value in bitcoin than it consumes in power — before you have paid for the machine, the cooling, the noise mitigation or the electrician.",
    },
    {
      type: "callout",
      text: "Worked example: an Antminer S21 XP at 270 TH/s earns about $8.65 a day. At $0.05/kWh it costs $4.37 in power, leaving $4.28. At $0.08/kWh it leaves $1.65. At $0.12/kWh it costs $10.50 to run and loses $1.85 a day, every day, forever.",
    },
    {
      type: "p",
      text: "Note what does not appear in that example: the purchase price. Those margins are before recovering any capital. A machine clearing $1.65 a day needs years of uninterrupted operation at an unchanged difficulty and an unchanged bitcoin price to pay for itself, and neither of those things stays unchanged.",
    },
    { type: "tool", slug: "mining-profitability-calculator" },

    { type: "h2", text: "Difficulty is a treadmill, and it only goes one way" },
    {
      type: "p",
      text: "Here is the mechanism that makes mining different from almost any other business. Bitcoin targets one block every ten minutes. If more hashing joins the network, blocks come faster, and every 2,016 blocks the protocol raises the difficulty to slow them back down. The total payout does not increase. It is simply divided more thinly.",
    },
    {
      type: "p",
      text: "So your revenue does not depend on your hashrate. It depends on your share of everyone's hashrate — and that share shrinks by default, every time anyone anywhere plugs in a new machine. You do not have to make a mistake to become less profitable. You only have to stand still.",
    },
    {
      type: "p",
      text: "This also explains the industry's boom-and-bust rhythm. A rising bitcoin price makes mining profitable, which attracts hardware, which raises difficulty, which erodes margins back toward break-even. The equilibrium the network keeps returning to is one where marginal miners earn roughly their electricity cost — which is precisely why cheap power, not clever operations, is the entire competitive moat.",
    },
    {
      type: "callout",
      text: "A profitability calculator that holds difficulty constant is answering a question about a network that does not exist. Treat any projection beyond a few months as a scenario, not a forecast, and re-run it whenever the difficulty adjusts.",
    },

    { type: "h2", text: "The halving cuts your revenue in half, on a schedule" },
    {
      type: "p",
      text: "Every 210,000 blocks — roughly every four years — the block subsidy halves. There have been four halvings, which is why the subsidy is 3.125 BTC rather than the original 50. The next one occurs at block 1,050,000.",
    },
    {
      type: "callout",
      text: "As of 11 August 2026 the chain stands at block 961,987, leaving about 88,013 blocks to the next halving — roughly 611 days at ten minutes a block, placing it around April 2028. On that day, revenue per terahash halves overnight.",
    },
    {
      type: "p",
      text: "Every column in the break-even table halves with it. Hardware that breaks even at ten cents today breaks even at five cents the morning after, unless the bitcoin price has doubled or a large amount of hashing has switched off. Historically some of both happens, but neither is owed to you, and the schedule is not negotiable.",
    },
    {
      type: "p",
      text: "This is the single most important thing to model before buying hardware, and the thing most casually omitted. A machine whose payback period is three years will live through a halving before it has paid for itself, and it has to survive that on the far side of the cut.",
    },
    { type: "tool", slug: "bitcoin-halving-countdown" },

    { type: "h2", text: "Transaction fees, and the part of revenue that is not the subsidy" },
    {
      type: "p",
      text: "The figures above deliberately exclude transaction fees, which miners also collect. For most of recent history fees have added a low single-digit percentage to block revenue, with occasional violent spikes during congestion. Leaving them out keeps the break-even figures conservative — you will do slightly better than the table says on an ordinary day.",
    },
    {
      type: "p",
      text: "They matter more for the long run than for your spreadsheet. The subsidy trends to zero across successive halvings, so fees have to become the dominant component of miner revenue eventually. Whether they will be large enough is a genuinely open question about bitcoin's security budget, and anyone who tells you the answer confidently is guessing.",
    },

    { type: "h2", text: "The costs that are not electricity" },
    {
      type: "p",
      text: "A break-even electricity price is a floor, not a business plan. Between that floor and an actual profit sit several costs that hobbyists routinely discover after purchase.",
    },
    {
      type: "ul",
      items: [
        "The hardware itself, which depreciates fast — an efficiency class stays competitive only until the next one ships",
        "Pool fees, typically 1–2% of revenue, and the reason solo mining is a lottery ticket rather than an income",
        "Cooling and airflow. A machine drawing 3.5 kW puts 3.5 kW of heat into wherever it sits",
        "Noise. Industrial ASICs run at levels no residential room tolerates without serious mitigation",
        "Electrical work — high-draw machines usually need a dedicated circuit and often a professional install",
        "Downtime. Every hour offline is revenue you cannot recover, because the difficulty did not pause for you",
        "Tax. Mined coins are usually income at the moment of receipt, at market value, and then a separate capital gain when sold",
      ],
    },
    {
      type: "p",
      text: "The tax point catches people badly in a falling market. If mined coins are taxed as income on receipt and you hold them, a subsequent price fall does not reduce that income — you can owe tax on a value you no longer have. Our country tax guides cover how each jurisdiction treats mining specifically.",
    },

    { type: "h2", text: "When mining does make sense" },
    {
      type: "p",
      text: "The honest summary is that mining as a way to acquire bitcoin more cheaply than buying it almost never works at retail electricity prices. If the goal is exposure to bitcoin, buying bitcoin is simpler, cheaper and has no depreciating hardware attached. The mining calculator on this site exists partly to demonstrate that quickly.",
    },
    {
      type: "p",
      text: "The cases that survive scrutiny share one feature: the electricity is cheap for a structural reason rather than a temporary one. Stranded or curtailed generation with no better buyer. Flared gas. Surplus hydro in a wet season. Heat that you were going to produce anyway and can now use. Demand-response arrangements where being interruptible is itself the product. In every one of those, the miner is monetising energy that had no other market — which is a genuinely different business from paying a residential tariff and hoping.",
    },
    {
      type: "cta",
      title: "Run the numbers for your own hardware and tariff",
      text: "Enter your hashrate, power draw and electricity price to see daily, monthly and annual profit, with difficulty and price as explicit assumptions rather than hidden ones.",
      href: "/tools/mining-profitability-calculator",
      label: "Open the mining calculator",
    },
  ],
  faq: [
    {
      q: "Is bitcoin mining still profitable in 2026?",
      a: "It depends almost entirely on your electricity price. As of August 2026 the network pays roughly $0.032 per terahash per day, which means a 13.5 J/TH machine breaks even at about $0.099 per kWh and a top-tier 9.5 J/TH machine at about $0.140. Below those, you profit before hardware costs. Above them, you lose money on every day of operation.",
    },
    {
      q: "How much electricity does mining one bitcoin take?",
      a: "That question has no fixed answer, because it depends on the network's total hashrate at the time and on your hardware. The useful version is per terahash: a 13.5 J/TH machine consumes 0.324 kWh per terahash per day, and how much bitcoin that earns changes with every difficulty adjustment.",
    },
    {
      q: "Can I mine bitcoin at home?",
      a: "Technically yes, economically almost never. Residential tariffs in most of the US and Europe sit above the break-even price of even the most efficient air-cooled hardware, so the machine consumes more value in electricity than it produces in bitcoin — before hardware, cooling and noise. Home mining makes more sense when the heat output is genuinely useful to you.",
    },
    {
      q: "What happens to mining after the next halving?",
      a: "Revenue per terahash halves overnight. The next halving is at block 1,050,000 — as of 11 August 2026 that is roughly 88,013 blocks away, around April 2028. Every break-even electricity price on this page halves with it unless the bitcoin price rises or enough hashrate switches off to lower difficulty.",
    },
    {
      q: "Why does my profitability keep falling when the price hasn't changed?",
      a: "Difficulty. Bitcoin adjusts every 2,016 blocks to keep blocks at ten minutes, so when more hashing joins the network the same payout is split more ways. Your revenue depends on your share of total hashrate, and that share declines automatically as others expand. Standing still is a strategy that loses.",
    },
    {
      q: "Is it cheaper to mine bitcoin or to buy it?",
      a: "At retail electricity prices, buying is cheaper and far simpler. Mining competes only where power is unusually cheap for a structural reason — stranded generation, flared gas, seasonal surplus hydro, or interruptible demand-response contracts. If you are paying a normal tariff, the calculator will generally tell you to buy.",
    },
    {
      q: "Do transaction fees change the maths much?",
      a: "Not usually. Fees have typically added a low single-digit percentage to block revenue, with sharp spikes during congestion, so the figures on this page are slightly conservative by excluding them. They matter enormously in the long run, because the subsidy trends to zero and fees must eventually replace it.",
    },
  ],
};

export default guide;
