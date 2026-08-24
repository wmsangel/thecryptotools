import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { UnlockData, UnlockRow } from "@/lib/unlocks/types";
import { CATEGORY_LABELS } from "@/lib/unlocks/types";

/**
 * ============================================================================
 * "The biggest token unlocks of the next 12 months" — a citable study. SERVER ONLY.
 * ============================================================================
 * A third link-bait asset, on a dataset the first two don't touch: scheduled
 * token unlocks (build-time snapshot at /data/unlocks.json). Token unlocks are
 * inherently newsworthy — they move prices — so this is the most quotable of the
 * three, and the angle is one no aggregator uses well:
 *
 * RANK BY SHARE OF CIRCULATING SUPPLY, NOT DOLLARS. A $40m unlock against a $6bn
 * float is noise; the same $40m against a $120m float is the whole story. Ranking
 * by dollars just re-sorts by market cap, which is why every "biggest unlocks"
 * list is the same large caps every week. We show both, so the gap is the point.
 *
 * Cliffs only for the headline: a cliff is a dated event, a linear vest is a
 * background drip — summing them buries every cliff. Every figure is dated to the
 * snapshot and bounded by it.
 */

const DATA = join(process.cwd(), "public", "data", "unlocks.json");
const DAY = 86_400_000;

export interface UnlockStudy {
  asOf: string;
  windowEnd: string;
  /** Cliffs in the 12-month window with a known share of float. */
  cliffCount: number;
  over10: number;
  over5: number;
  over1: number;
  /** Sum of cliff USD in the window (at snapshot prices). */
  totalUsd: number;
  /** Distinct projects with a cliff in the window. */
  projectCount: number;
  /** Top cliffs by share of float. */
  biggest: UnlockRow[];
  /** Top 5 by dollar value — deliberately shown against topByPct. */
  topByDollar: UnlockRow[];
  /** Top 5 by share of float. */
  topByPct: UnlockRow[];
  /** Where the big (>=5% of float) supply comes from, by category. */
  categories: { key: string; label: string; count: number; usd: number }[];
}

function load(): UnlockData | null {
  try {
    return JSON.parse(readFileSync(DATA, "utf8")) as UnlockData;
  } catch {
    return null;
  }
}

export function getUnlockStudy(): UnlockStudy | null {
  const data = load();
  if (!data || !Array.isArray(data.rows)) return null;

  const asOf = data.asOf;
  const start = Date.parse(`${asOf}T00:00:00Z`);
  const end = start + 365 * DAY;
  const windowEnd = new Date(end).toISOString().slice(0, 10);

  const inWindow = (r: UnlockRow) => {
    const t = Date.parse(`${r.date}T00:00:00Z`);
    return t >= start && t <= end;
  };
  // Cliffs only, in window, with a sane known share of float.
  const cliffs = data.rows.filter(
    (r) => r.type === "cliff" && inWindow(r) && r.pctOfCirculating != null && r.pctOfCirculating < 1000,
  );
  if (cliffs.length === 0) return null;

  const byPct = [...cliffs].sort((a, b) => (b.pctOfCirculating ?? 0) - (a.pctOfCirculating ?? 0));
  const withUsd = cliffs.filter((r) => r.usd != null && r.usd > 0);
  const byUsd = [...withUsd].sort((a, b) => (b.usd ?? 0) - (a.usd ?? 0));

  // Category tally among the impactful (>=5% of float) cliffs.
  const catMap = new Map<string, { count: number; usd: number }>();
  for (const r of cliffs) {
    if ((r.pctOfCirculating ?? 0) < 5) continue;
    const cur = catMap.get(r.category) ?? { count: 0, usd: 0 };
    cur.count += 1;
    cur.usd += r.usd ?? 0;
    catMap.set(r.category, cur);
  }
  const categories = [...catMap.entries()]
    .map(([key, v]) => ({ key, label: CATEGORY_LABELS[key] ?? key, count: v.count, usd: v.usd }))
    .sort((a, b) => b.count - a.count);

  return {
    asOf,
    windowEnd,
    cliffCount: cliffs.length,
    over10: cliffs.filter((r) => (r.pctOfCirculating ?? 0) >= 10).length,
    over5: cliffs.filter((r) => (r.pctOfCirculating ?? 0) >= 5).length,
    over1: cliffs.filter((r) => (r.pctOfCirculating ?? 0) >= 1).length,
    totalUsd: withUsd.reduce((s, r) => s + (r.usd ?? 0), 0),
    projectCount: new Set(cliffs.map((r) => r.slug)).size,
    biggest: byPct.slice(0, 12),
    topByDollar: byUsd.slice(0, 5),
    topByPct: byPct.slice(0, 5),
    categories,
  };
}
