/**
 * Builds the token unlock calendar into `public/data/unlocks.json`.
 *
 * RUN MANUALLY (`npm run unlocks`). It downloads a few hundred megabytes of
 * emission schedules to keep a few hundred kilobytes of them, which is not
 * something to do on every build.
 *
 * SOURCE: DefiLlama's public dataset host. Note that `api.llama.fi/emissions`
 * is now behind their paid plan and answers "Upgrade to the paid API plan" —
 * do not wire that one up. The free path is:
 *   defillama-datasets.llama.fi/emissionsProtocolsList  → slugs
 *   defillama-datasets.llama.fi/emissions/<slug>        → full schedule
 *
 * WHAT WE KEEP AND WHY:
 *
 *  - Token AMOUNTS and DATES, not dollar values. A vesting contract's schedule
 *    is fixed months or years ahead, so this half of the data stays true
 *    between refreshes. Dollar values move every minute and would be the only
 *    stale thing on the page.
 *  - The unlock as a PERCENTAGE OF CIRCULATING SUPPLY, which is the number that
 *    actually predicts anything. A $40m unlock against a $6bn float is noise;
 *    the same $40m against a $120m float is the whole story. Sites that rank
 *    unlocks by dollar value put the wrong ones at the top.
 *  - The allocation bucket (insiders, private sale, staking rewards…), because
 *    who receives the tokens changes what usually happens next.
 *
 * Prices and circulating supplies come from CoinGecko in one batched pass and
 * are stamped with the date they were read, exactly like the coin registry's
 * `supplyAsOf`. The page says "at prices on <date>" rather than implying live.
 */
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public", "data");
const DATASETS = "https://defillama-datasets.llama.fi";
const DAY = 86_400;

/** Only unlocks inside this window are kept — beyond it nobody is planning. */
const HORIZON_DAYS = 400;
/** Fetches in flight. DefiLlama's dataset host is a CDN, but be polite. */
const CONCURRENCY = 6;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const iso = (sec) => new Date(sec * 1000).toISOString().slice(0, 10);

async function getJson(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "thecryptotools-unlocks/1.0" } });
      if (res.status === 429) { await sleep(4000 * (i + 1)); continue; }
      if (!res.ok) return null;
      return await res.json();
    } catch {
      await sleep(1200);
    }
  }
  return null;
}

/** Run `work` over `items` with a fixed number of workers. */
async function pool(items, worker) {
  const out = [];
  let cursor = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      for (;;) {
        const i = cursor++;
        if (i >= items.length) return;
        out[i] = await worker(items[i], i);
      }
    }),
  );
  return out;
}

/**
 * DefiLlama's emissions dataset also carries TOKENISED EQUITIES — pre-IPO
 * shares wrapped as tokens, whose "unlocks" are ordinary share lock-up
 * expiries. The first run of this script put SpaceX at the top of the calendar
 * with a 157,760%-of-float unlock worth $150bn, because the schedule counts
 * SpaceX SHARES while CoinGecko's circulating supply describes the small
 * tokenised wrapper. The two numbers do not measure the same thing, so their
 * ratio is meaningless.
 *
 * They are excluded on identity rather than on magnitude: a share lock-up is
 * simply not a token unlock, and would be the wrong thing on this page even if
 * the arithmetic worked.
 */
const isTokenisedEquity = (geckoId) =>
  !!geckoId && (/tokenized-stock/.test(geckoId) || /-bstocks-/.test(geckoId));

/**
 * Backstop for data problems we have not seen yet. Set deliberately high:
 * a genuine unlock CAN exceed the current float — Monad, GRVT and other
 * recent low-float launches legitimately release 60–100% of circulating
 * supply in one event, and those are the most important rows on the page.
 * Ten times the float is not a low float, it is a broken denominator.
 */
const IMPOSSIBLE_PCT = 1000;

const slugs = await getJson(`${DATASETS}/emissionsProtocolsList`);
if (!Array.isArray(slugs) || slugs.length === 0) {
  console.error("could not read the protocol list — aborting rather than writing an empty calendar");
  process.exit(1);
}
console.error(`protocols to check: ${slugs.length}`);

const nowSec = Math.floor(Date.now() / 1000);
const horizon = nowSec + HORIZON_DAYS * DAY;

let done = 0;
const projects = (
  await pool(slugs, async (slug) => {
    const data = await getJson(`${DATASETS}/emissions/${slug}`);
    done++;
    if (done % 50 === 0) console.error(`  …${done}/${slugs.length}`);
    if (!data?.metadata?.events?.length) return null;
    if (isTokenisedEquity(data.gecko_id)) {
      console.error(`  skip ${slug}: tokenised equity, not a token unlock`);
      return null;
    }

    // Group same-day events per category. A linear vest emits one event per
    // day per bucket; listing them individually would bury the cliffs that
    // people actually care about under thousands of rows.
    const byDay = new Map();
    for (const event of data.metadata.events) {
      const ts = Number(event.timestamp);
      if (!Number.isFinite(ts) || ts <= nowSec || ts > horizon) continue;
      const tokens = (event.noOfTokens || []).reduce((a, b) => a + (Number(b) || 0), 0);
      if (!(tokens > 0)) continue;
      const key = `${iso(ts)}|${event.category || "other"}`;
      const row = byDay.get(key) || {
        date: iso(ts),
        category: event.category || "other",
        tokens: 0,
        // A cliff is a single scheduled release; linear is a daily drip. They
        // behave completely differently and must not be summed into one label.
        type: event.unlockType === "cliff" ? "cliff" : "linear",
      };
      row.tokens += tokens;
      if (event.unlockType === "cliff") row.type = "cliff";
      byDay.set(key, row);
    }
    if (byDay.size === 0) return null;

    return {
      slug,
      name: data.name || slug,
      geckoId: data.gecko_id || null,
      // Which real-world groups sit in each bucket — "insiders" means more
      // when the page can say it is "Core Contributors".
      categories: data.categories || {},
      maxSupply: data.supplyMetrics?.maxSupply ?? null,
      events: [...byDay.values()].sort((a, b) => a.date.localeCompare(b.date)),
    };
  })
).filter(Boolean);

console.error(`\nprojects with upcoming unlocks: ${projects.length}`);

/* ---- Prices and circulating supply, batched ------------------------------ */

const geckoIds = [...new Set(projects.map((p) => p.geckoId).filter(Boolean))];
const market = new Map();
for (let i = 0; i < geckoIds.length; i += 200) {
  const batch = geckoIds.slice(i, i + 200);
  const rows = await getJson(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${batch.join(",")}&per_page=250&sparkline=false`,
  );
  if (Array.isArray(rows)) {
    for (const r of rows) {
      market.set(r.id, {
        symbol: (r.symbol || "").toUpperCase(),
        price: r.current_price ?? null,
        circulating: r.circulating_supply ?? null,
        marketCap: r.market_cap ?? null,
      });
    }
  }
  console.error(`  prices ${Math.min(i + 200, geckoIds.length)}/${geckoIds.length}`);
  await sleep(3000);
}

const asOf = iso(nowSec);
const rows = [];
for (const project of projects) {
  const m = project.geckoId ? market.get(project.geckoId) : null;
  for (const event of project.events) {
    const usd = m?.price != null ? event.tokens * m.price : null;
    // The headline metric. Null rather than zero when we cannot compute it —
    // an unknown share must not sort as "harmless".
    const pctOfCirculating =
      m?.circulating && m.circulating > 0 ? (event.tokens / m.circulating) * 100 : null;
    // Loudly, not silently: a new source of bad data should show up in the run
    // log rather than quietly vanishing from the calendar.
    if (pctOfCirculating != null && pctOfCirculating > IMPOSSIBLE_PCT) {
      console.error(
        `  DROP ${project.slug} ${event.date}: ${pctOfCirculating.toFixed(0)}% of float — ` +
          `token count and circulating supply disagree, check the mapping`,
      );
      continue;
    }
    rows.push({
      slug: project.slug,
      name: project.name,
      symbol: m?.symbol || null,
      geckoId: project.geckoId,
      date: event.date,
      category: event.category,
      // The human-readable groups behind the bucket, e.g. ["Core Contributors"].
      groups: project.categories?.[event.category] || [],
      type: event.type,
      tokens: Number(event.tokens.toPrecision(8)),
      usd: usd == null ? null : Math.round(usd),
      pctOfCirculating: pctOfCirculating == null ? null : Number(pctOfCirculating.toFixed(4)),
      marketCap: m?.marketCap ?? null,
    });
  }
}
rows.sort((a, b) => a.date.localeCompare(b.date) || (b.usd ?? 0) - (a.usd ?? 0));

await mkdir(OUT, { recursive: true });
await writeFile(
  path.join(OUT, "unlocks.json"),
  JSON.stringify({ asOf, horizonDays: HORIZON_DAYS, source: "DefiLlama", rows }),
);

await writeFile(
  path.join(ROOT, "src", "lib", "unlocks", "meta.ts"),
  `// GENERATED by scripts/generate-unlocks.mjs — do not edit by hand.\n` +
    `// Re-run \`npm run unlocks\` to refresh this and public/data/unlocks.json.\n\n` +
    `/** Date the schedules and prices were read. Shown on the page. */\n` +
    `export const unlocksAsOf = ${JSON.stringify(asOf)};\n` +
    `/** How far ahead the calendar reaches. */\n` +
    `export const unlocksHorizonDays = ${HORIZON_DAYS};\n` +
    `/** Distinct projects with at least one scheduled unlock in the window. */\n` +
    `export const unlocksProjectCount = ${new Set(rows.map((r) => r.slug)).size};\n` +
    `/** Individual dated unlock rows. */\n` +
    `export const unlocksRowCount = ${rows.length};\n`,
);

const withPct = rows.filter((r) => r.pctOfCirculating != null).length;
console.error(
  `\ngenerate-unlocks: ${rows.length} rows across ${new Set(rows.map((r) => r.slug)).size} projects ` +
    `(${withPct} with a % of circulating), as of ${asOf}`,
);
