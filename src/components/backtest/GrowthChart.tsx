"use client";

import { useMemo, useState } from "react";
import type { ValuePoint } from "@/lib/backtest/types";

/**
 * Portfolio value against money paid in, as inline SVG. No chart library —
 * same reasoning as Sparkline: a dependency for two polylines would be the
 * heaviest thing on the page.
 *
 * The two series share one axis on purpose. The gap between them IS the profit,
 * and drawing "invested" as a staircase makes DCA legible in a way a single
 * value line never does: you can see the contributions still arriving while the
 * value line is underwater.
 */
export function GrowthChart({
  series,
  currency = "$",
}: {
  series: ValuePoint[];
  currency?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);

  const W = 720;
  const H = 260;
  const PAD = { top: 12, right: 12, bottom: 26, left: 56 };

  const view = useMemo(() => {
    if (series.length < 2) return null;

    // Downsample to roughly one point per horizontal pixel. A 15-year daily
    // series is ~5,500 points; drawing them all makes a path string tens of
    // kilobytes wide that renders identically.
    const target = W - PAD.left - PAD.right;
    const step = Math.max(1, Math.floor(series.length / target));
    const points = series.filter((_, i) => i % step === 0);
    if (points[points.length - 1] !== series[series.length - 1]) {
      points.push(series[series.length - 1]);
    }

    const max = Math.max(...points.map((p) => Math.max(p.value, p.invested)), 1);
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;
    const x = (i: number) => PAD.left + (i / (points.length - 1)) * innerW;
    const y = (v: number) => PAD.top + innerH - (v / max) * innerH;

    const path = (pick: (p: ValuePoint) => number) =>
      points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(pick(p)).toFixed(1)}`).join(" ");

    const area =
      `${path((p) => p.value)} L${x(points.length - 1).toFixed(1)} ${y(0).toFixed(1)} L${x(0).toFixed(1)} ${y(0).toFixed(1)} Z`;

    // Four gridlines is enough to read a value off; more turns into hatching.
    const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => ({ v: max * f, y: y(max * f) }));

    return { points, x, y, max, valuePath: path((p) => p.value), investedPath: path((p) => p.invested), area, ticks, innerH };
  }, [series]);

  if (!view) return null;

  const active = hover == null ? null : view.points[Math.min(hover, view.points.length - 1)];
  const ahead = active ? active.value >= active.invested : true;

  return (
    <figure className="mt-6">
      <div className="card overflow-x-auto p-4" tabIndex={0} role="group" aria-label="Growth chart, scrolls horizontally">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full min-w-[560px]"
          role="img"
          aria-label="Portfolio value against total invested over time"
          onMouseLeave={() => setHover(null)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            const px = ratio * W - PAD.left;
            const frac = px / (W - PAD.left - PAD.right);
            setHover(Math.max(0, Math.min(view.points.length - 1, Math.round(frac * (view.points.length - 1)))));
          }}
        >
          <defs>
            <linearGradient id="tct-growth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>

          {view.ticks.map((t, i) => (
            <g key={i}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={t.y}
                y2={t.y}
                stroke="currentColor"
                strokeOpacity={0.12}
                strokeWidth={1}
              />
              <text x={PAD.left - 8} y={t.y + 3.5} textAnchor="end" fontSize="10" fill="currentColor" fillOpacity={0.5}>
                {compact(t.v, currency)}
              </text>
            </g>
          ))}

          <path d={view.area} fill="url(#tct-growth)" />
          <path d={view.investedPath} fill="none" stroke="currentColor" strokeOpacity={0.45} strokeWidth={1.5} strokeDasharray="4 3" />
          <path d={view.valuePath} fill="none" stroke="#10b981" strokeWidth={2} strokeLinejoin="round" />

          {active && hover != null && (
            <g>
              <line
                x1={view.x(hover)}
                x2={view.x(hover)}
                y1={PAD.top}
                y2={H - PAD.bottom}
                stroke="currentColor"
                strokeOpacity={0.3}
                strokeWidth={1}
              />
              <circle cx={view.x(hover)} cy={view.y(active.value)} r={3.5} fill="#10b981" />
            </g>
          )}

          <text x={PAD.left} y={H - 8} fontSize="10" fill="currentColor" fillOpacity={0.5}>
            {view.points[0].date}
          </text>
          <text x={W - PAD.right} y={H - 8} textAnchor="end" fontSize="10" fill="currentColor" fillOpacity={0.5}>
            {view.points[view.points.length - 1].date}
          </text>
        </svg>
      </div>

      <figcaption className="muted mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 bg-emerald-500" /> Portfolio value
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 border-t border-dashed border-current opacity-60" /> Total invested
        </span>
        {active && (
          <span className={ahead ? "font-semibold text-gain" : "font-semibold text-loss"}>
            {active.date}: {compact(active.value, currency)} value vs {compact(active.invested, currency)} in
          </span>
        )}
      </figcaption>
    </figure>
  );
}

/** Axis labels: "$1.2M" beats "$1,200,000" in 10px type. */
function compact(v: number, currency: string): string {
  if (v >= 1_000_000_000) return `${currency}${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000) return `${currency}${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${currency}${(v / 1_000).toFixed(1)}k`;
  return `${currency}${v.toFixed(0)}`;
}
