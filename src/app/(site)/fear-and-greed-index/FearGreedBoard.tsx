"use client";

import { useEffect, useMemo, useState } from "react";
import { track } from "@/lib/analytics";
import { classify, colorFor, dayOf, type FngData, type FngPoint } from "@/lib/fear-greed/data";

/** Rebuild the derived shape from raw API rows (newest-first), client-side. */
function deriveFromRows(rows: FngPoint[]): FngData {
  const d = [...rows].sort((a, b) => b.timestamp - a.timestamp);
  return {
    current: d[0],
    previous: d[1] ?? null,
    lastWeek: d[7] ?? null,
    lastMonth: d[30] ?? null,
    history: [...d].slice(0, 365).reverse(),
    updated: new Date().toISOString(),
    source: "alternative.me",
  };
}

const BANDS: [number, number, string][] = [
  [0, 25, "#e5484d"],
  [25, 45, "#f2830a"],
  [45, 55, "#e0b400"],
  [55, 75, "#7bbf3a"],
  [75, 100, "#16a34a"],
];

// Gauge geometry.
const CX = 150, CY = 150, R = 120;
function pt(v: number): [number, number] {
  const t = Math.PI * (1 - Math.max(0, Math.min(100, v)) / 100);
  return [CX + R * Math.cos(t), CY - R * Math.sin(t)];
}
function arc(a: number, b: number): string {
  const [x1, y1] = pt(a), [x2, y2] = pt(b);
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

function Gauge({ value }: { value: number }) {
  const [nx, ny] = pt(value);
  const col = colorFor(value);
  return (
    <svg viewBox="0 0 300 172" className="w-full max-w-[340px]" role="img"
      aria-label={`Fear and Greed Index: ${value} out of 100, ${classify(value)}`}>
      {BANDS.map(([a, b, c]) => (
        <path key={a} d={arc(a, b)} fill="none" stroke={c} strokeWidth="20" strokeLinecap="butt" opacity="0.92" />
      ))}
      {/* end labels */}
      <text x="20" y="168" fontSize="11" fill="var(--muted)" fontWeight="600">0 · Fear</text>
      <text x="280" y="168" fontSize="11" fill="var(--muted)" fontWeight="600" textAnchor="end">Greed · 100</text>
      {/* needle */}
      <line x1={CX} y1={CY} x2={nx.toFixed(2)} y2={ny.toFixed(2)} stroke="var(--text)" strokeWidth="3" strokeLinecap="round" />
      <circle cx={CX} cy={CY} r="9" fill="var(--text)" />
      <circle cx={CX} cy={CY} r="4" fill="var(--bg)" />
      {/* value */}
      <text x={CX} y="110" textAnchor="middle" fontSize="46" fontWeight="800" fill={col} style={{ fontVariantNumeric: "tabular-nums" }}>{value}</text>
      <text x={CX} y="132" textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--text)">{classify(value)}</text>
    </svg>
  );
}

function Tile({ label, point }: { label: string; point: FngPoint | null }) {
  if (!point) return null;
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-center">
      <div className="text-xs font-semibold uppercase tracking-wide muted">{label}</div>
      <div className="mt-1 text-2xl font-extrabold" style={{ color: colorFor(point.value), fontVariantNumeric: "tabular-nums" }}>{point.value}</div>
      <div className="text-xs muted">{classify(point.value)}</div>
    </div>
  );
}

function History({ points }: { points: FngPoint[] }) {
  const W = 700, H = 170, pad = 6;
  const pts = points.slice(-180);
  const path = useMemo(() => {
    if (pts.length < 2) return { line: "", area: "" };
    const n = pts.length;
    const x = (i: number) => pad + (i / (n - 1)) * (W - 2 * pad);
    const y = (v: number) => pad + (1 - v / 100) * (H - 2 * pad);
    const line = pts.map((p, i) => `${i ? "L" : "M"} ${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`).join(" ");
    const area = `${line} L ${x(n - 1).toFixed(1)} ${(H - pad).toFixed(1)} L ${x(0).toFixed(1)} ${(H - pad).toFixed(1)} Z`;
    return { line, area };
  }, [pts]);
  const last = pts[pts.length - 1];
  const col = last ? colorFor(last.value) : "#7bbf3a";
  const yFor = (v: number) => pad + (1 - v / 100) * (H - 2 * pad);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Fear & Greed Index over the last 180 days">
      {/* band guides */}
      {[25, 45, 55, 75].map((v) => (
        <line key={v} x1={pad} y1={yFor(v)} x2={W - pad} y2={yFor(v)} stroke="var(--border)" strokeWidth="1" strokeDasharray="3 4" />
      ))}
      <defs>
        <linearGradient id="fngfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={col} stopOpacity="0.28" />
          <stop offset="100%" stopColor={col} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={path.area} fill="url(#fngfill)" />
      <path d={path.line} fill="none" stroke={col} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function FearGreedBoard({ initial }: { initial: FngData }) {
  const [data, setData] = useState<FngData>(initial);

  useEffect(() => {
    track("tool_used", { action: "view", tool_slug: "fear-and-greed-index", tool_category: "market" });
    let cancelled = false;
    fetch("https://api.alternative.me/fng/?limit=365&format=json")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("http"))))
      .then((j) => {
        const rows: FngPoint[] = (j.data || [])
          .map((d: { value: string; value_classification: string; timestamp: string }) => ({
            value: Number(d.value), classification: d.value_classification, timestamp: Number(d.timestamp),
          }))
          .filter((d: FngPoint) => Number.isFinite(d.value) && Number.isFinite(d.timestamp));
        if (!cancelled && rows.length > 1) setData(deriveFromRows(rows));
      })
      .catch(() => { /* keep the build-time snapshot */ });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
      <div className="flex flex-col items-center">
        <Gauge value={data.current.value} />
        <p className="mt-1 text-xs muted">As of {dayOf(data.current)} · source: {data.source}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4">
        <Tile label="Now" point={data.current} />
        <Tile label="Yesterday" point={data.previous} />
        <Tile label="Last week" point={data.lastWeek} />
        <Tile label="Last month" point={data.lastMonth} />
      </div>
      <div className="md:col-span-2">
        <div className="mb-2 text-sm font-semibold muted">Last 180 days</div>
        <History points={data.history} />
      </div>
    </div>
  );
}
