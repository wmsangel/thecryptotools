/**
 * Writes the next halving for each proof-of-work chain we cover, estimated from
 * its CURRENT block height. Produces TWO files from one set of live reads:
 *
 *   - src/lib/events/halvings.ts      → EstimatedEvent[] for the /calendar page
 *   - src/lib/events/halving-data.ts  → rich HalvingDatum[] for /crypto-halving-countdown
 *
 * RUN MANUALLY (`npm run halvings`) whenever the halving pages are refreshed.
 *
 * WHY COMPUTE RATHER THAN LOOK UP: a halving is not a scheduled date, it is a
 * block number. Every "next halving" date on the internet is an estimate that
 * drifts as hash rate changes, and copying one hardcodes somebody else's stale
 * arithmetic. Deriving it from the live tip and the chain's own target block
 * time is both more accurate and self-correcting on the next run.
 *
 * The estimate is honest about being one: each entry carries a `basis` string
 * naming the height it was computed from and the live source it was read from,
 * and the pages render the date as "around" rather than as a fixed day.
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";

const DAY = 86_400_000;

/**
 * `interval` is the halving period in blocks; `blockMinutes` is the protocol's
 * target block time, which is what the countdown assumes going forward.
 * `reward` is [before, after] the next halving. `source` is the live block-height
 * source, linked on the page so the reader can check the height themselves.
 *
 * `offset` is the block of a KNOWN halving (default 0). Bitcoin/Litecoin halve
 * at multiples of `interval` from genesis, so offset 0 is right. Zcash does NOT:
 * since Blossom its halvings land on 1,046,400 + k·1,680,000 (…2,726,400,
 * 4,406,400…), so it needs an explicit offset or the arithmetic is wrong.
 */
const CHAINS = [
  {
    slug: "bitcoin", symbol: "BTC", name: "Bitcoin", color: "#f7931a",
    interval: 210_000, blockMinutes: 10, reward: [3.125, 1.5625],
    height: async () => Number(await (await fetch("https://mempool.space/api/blocks/tip/height")).text()),
    source: { label: "mempool.space", url: "https://mempool.space/" },
    detail: (r) =>
      `The block subsidy halves from ${r.before} to ${r.after} BTC. Bitcoin's issuance has halved every 210,000 blocks (roughly four years) since 2012, and the schedule is why its supply is capped at 21 million.`,
  },
  {
    slug: "litecoin", symbol: "LTC", name: "Litecoin", color: "#345d9d",
    interval: 840_000, blockMinutes: 2.5, reward: [6.25, 3.125],
    height: async () => (await (await fetch("https://api.blockchair.com/litecoin/stats")).json()).data.blocks,
    source: { label: "Blockchair", url: "https://blockchair.com/litecoin" },
    detail: (r) => `The Litecoin block subsidy halves from ${r.before} to ${r.after} LTC. Litecoin halves every 840,000 blocks — four times as many as Bitcoin, at a quarter of the block time.`,
  },
  {
    slug: "bitcoin-cash", symbol: "BCH", name: "Bitcoin Cash", color: "#0ac18e",
    interval: 210_000, blockMinutes: 10, reward: [3.125, 1.5625],
    height: async () => (await (await fetch("https://api.blockchair.com/bitcoin-cash/stats")).json()).data.blocks,
    source: { label: "Blockchair", url: "https://blockchair.com/bitcoin-cash" },
    detail: (r) => `The Bitcoin Cash subsidy halves from ${r.before} to ${r.after} BCH. It shares Bitcoin's 210,000-block schedule, inherited from the 2017 fork.`,
  },
  {
    slug: "zcash", symbol: "ZEC", name: "Zcash", color: "#ecb244",
    interval: 1_680_000, offset: 1_046_400, blockMinutes: 1.25, reward: [1.5625, 0.78125],
    height: async () => (await (await fetch("https://api.blockchair.com/zcash/stats")).json()).data.blocks,
    source: { label: "Blockchair", url: "https://blockchair.com/zcash" },
    detail: (r) => `The Zcash block subsidy halves from ${r.before} to ${r.after} ZEC. Since the Blossom upgrade Zcash halves every 1,680,000 blocks (~4 years) at a 75-second block target.`,
    note: "Zcash emission is under active governance review (proposal NU7) — a future network upgrade could change this schedule.",
  },
];

const results = [];
for (const chain of CHAINS) {
  let height;
  try {
    height = await chain.height();
  } catch {
    console.error(`  !! could not read ${chain.symbol} height — skipping`);
    continue;
  }
  if (!Number.isFinite(height) || height <= 0) {
    console.error(`  !! bad height for ${chain.symbol}: ${height}`);
    continue;
  }

  const offset = chain.offset ?? 0;
  const nextBlock = offset + Math.ceil((height - offset + 1) / chain.interval) * chain.interval;
  const blocksLeft = nextBlock - height;
  const ms = blocksLeft * chain.blockMinutes * 60_000;
  const when = new Date(Date.now() + ms);

  results.push({
    slug: chain.slug,
    symbol: chain.symbol,
    name: chain.name,
    color: chain.color,
    interval: chain.interval,
    height,
    nextBlock,
    blocksLeft,
    blockMinutes: chain.blockMinutes,
    rewardBefore: chain.reward[0],
    rewardAfter: chain.reward[1],
    date: when.toISOString().slice(0, 10),
    estimatedISO: when.toISOString(),
    detail: chain.detail({ before: chain.reward[0], after: chain.reward[1] }),
    note: chain.note,
    source: chain.source,
    basis: `Estimated from block ${height.toLocaleString("en-US")} — ${blocksLeft.toLocaleString("en-US")} blocks to go at ${chain.blockMinutes}-minute targets. Faster blocks pull it earlier.`,
    days: Math.round(ms / DAY),
  });
  console.error(`ok ${chain.symbol.padEnd(4)} block ${String(height).padStart(9)} → halving at ${String(nextBlock).padStart(9)}  ≈ ${when.toISOString().slice(0, 10)}  (${Math.round(ms / DAY)} days)`);
}

if (results.length === 0) {
  console.error("no halvings computed — leaving the existing files alone");
  process.exit(1);
}

const computedAt = new Date().toISOString().slice(0, 10);
const HALVING_HREF = "/crypto-halving-countdown";

/* ---- 1) halvings.ts: EstimatedEvent[] for the calendar ------------------- */

const eventsBody = results
  .map(
    (r) => `  {
    kind: "estimate",
    id: ${JSON.stringify(`halving-${r.slug}`)},
    date: ${JSON.stringify(r.date)},
    title: ${JSON.stringify(`${r.name} halving (estimated)`)},
    detail: ${JSON.stringify(r.detail)},
    category: "network",
    href: ${JSON.stringify(HALVING_HREF)},
    basis: ${JSON.stringify(r.basis)},
  },`,
  )
  .join("\n");

await writeFile(
  path.join(process.cwd(), "src", "lib", "events", "halvings.ts"),
  `// GENERATED by scripts/generate-halvings.mjs — do not edit by hand.\n` +
    `// Re-run \`npm run halvings\` to recompute from current block heights.\n\n` +
    `import type { EstimatedEvent } from "./types";\n\n` +
    `/** The day the block heights below were read. The sitemap dates /calendar\n` +
    ` *  from this, so a rebuild that did not refresh the data does not claim the\n` +
    ` *  page changed. */\n` +
    `export const halvingsComputedAt = ${JSON.stringify(computedAt)};\n\n` +
    `/** Computed ${computedAt}. Dates drift with hash rate. */\n` +
    `export const halvings: EstimatedEvent[] = [\n${eventsBody}\n];\n`,
);

/* ---- 2) halving-data.ts: rich HalvingDatum[] for the dedicated page ------ */

const dataBody = results
  .map(
    (r) => `  {
    slug: ${JSON.stringify(r.slug)},
    symbol: ${JSON.stringify(r.symbol)},
    name: ${JSON.stringify(r.name)},
    color: ${JSON.stringify(r.color)},
    interval: ${r.interval},
    height: ${r.height},
    nextBlock: ${r.nextBlock},
    blocksLeft: ${r.blocksLeft},
    blockMinutes: ${r.blockMinutes},
    rewardBefore: ${r.rewardBefore},
    rewardAfter: ${r.rewardAfter},
    date: ${JSON.stringify(r.date)},
    estimatedISO: ${JSON.stringify(r.estimatedISO)},
    detail: ${JSON.stringify(r.detail)},${r.note ? `\n    note: ${JSON.stringify(r.note)},` : ""}
    source: { label: ${JSON.stringify(r.source.label)}, url: ${JSON.stringify(r.source.url)} },
    basis: ${JSON.stringify(r.basis)},
  },`,
  )
  .join("\n");

await writeFile(
  path.join(process.cwd(), "src", "lib", "events", "halving-data.ts"),
  `// GENERATED by scripts/generate-halvings.mjs — do not edit by hand.\n` +
    `// Re-run \`npm run halvings\` to recompute from current block heights.\n\n` +
    `export interface HalvingSource { label: string; url: string }\n\n` +
    `export interface HalvingDatum {\n` +
    `  slug: string;\n  symbol: string;\n  name: string;\n  color: string;\n` +
    `  /** Halving period in blocks. */\n  interval: number;\n` +
    `  /** Block height the estimate was computed from. */\n  height: number;\n` +
    `  /** The block at which the next halving occurs. */\n  nextBlock: number;\n` +
    `  blocksLeft: number;\n  /** Protocol target block time, minutes. */\n  blockMinutes: number;\n` +
    `  rewardBefore: number;\n  rewardAfter: number;\n` +
    `  /** Estimated date, YYYY-MM-DD. */\n  date: string;\n` +
    `  /** Estimated moment, full ISO — the live countdown ticks to this. */\n  estimatedISO: string;\n` +
    `  detail: string;\n  /** Optional caveat shown under the card. */\n  note?: string;\n` +
    `  /** Live block-height source, linked for verification. */\n  source: HalvingSource;\n` +
    `  basis: string;\n}\n\n` +
    `/** The day the block heights were read. */\n` +
    `export const halvingComputedAt = ${JSON.stringify(computedAt)};\n\n` +
    `/** Computed ${computedAt} from live block heights. Dates drift with hash rate. */\n` +
    `export const halvingData: HalvingDatum[] = [\n${dataBody}\n];\n`,
);

console.error(`\ngenerate-halvings: wrote ${results.length} halving estimates (halvings.ts + halving-data.ts)`);
