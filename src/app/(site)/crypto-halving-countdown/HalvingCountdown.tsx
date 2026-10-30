"use client";

import { useEffect, useState } from "react";
import { CoinLogo } from "@/components/CoinLogo";
import type { HalvingDatum } from "@/lib/events/halving-data";

/**
 * Live per-coin halving countdowns. Each card ticks every second toward the
 * estimated moment baked at build time from a live block height (see
 * generate-halvings.mjs). The estimate drifts with hash rate, so the date is
 * always shown as "around" and every card names the block + source it came
 * from. First paint renders a stable placeholder so hydration matches the
 * static export; the real remaining time fills in after mount.
 */

interface Remaining { days: number; hours: number; mins: number; secs: number; past: boolean }

function remainingTo(iso: string, now: number): Remaining {
  const diff = Date.parse(iso) - now;
  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0, past: true };
  const secs = Math.floor(diff / 1000);
  return {
    days: Math.floor(secs / 86400),
    hours: Math.floor((secs % 86400) / 3600),
    mins: Math.floor((secs % 3600) / 60),
    secs: secs % 60,
    past: false,
  };
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="tabular-nums text-2xl font-extrabold leading-none sm:text-3xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider muted">{label}</span>
    </div>
  );
}

function Card({ d, now }: { d: HalvingDatum; now: number | null }) {
  const r = now == null ? null : remainingTo(d.estimatedISO, now);
  return (
    <div className="card flex flex-col p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <CoinLogo slug={d.slug} name={d.name} symbol={d.symbol} color={d.color} size={36} />
        <div className="min-w-0">
          <div className="font-bold leading-tight">{d.name} halving</div>
          <div className="muted text-xs">
            {d.symbol} · every {d.interval.toLocaleString("en-US")} blocks
          </div>
        </div>
        <span
          className="ml-auto rounded-full px-2.5 py-1 text-xs font-bold"
          style={{ background: d.color + "1f", color: d.color }}
        >
          {d.rewardBefore} → {d.rewardAfter}
        </span>
      </div>

      {/* Countdown */}
      <div className="mt-5 grid grid-cols-4 gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] px-3 py-4">
        {r == null ? (
          <div className="col-span-4 text-center text-sm muted">Loading…</div>
        ) : r.past ? (
          <div className="col-span-4 text-center text-sm font-semibold text-brand-ink">
            Halving block reached — awaiting next estimate.
          </div>
        ) : (
          <>
            <Unit value={r.days} label="days" />
            <Unit value={r.hours} label="hrs" />
            <Unit value={r.mins} label="min" />
            <Unit value={r.secs} label="sec" />
          </>
        )}
      </div>

      {/* Facts */}
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="muted">Estimated date</dt>
          <dd className="font-semibold">≈ {fmtDate(d.estimatedISO)}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="muted">Halving block</dt>
          <dd className="font-mono tabular-nums font-semibold">{d.nextBlock.toLocaleString("en-US")}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="muted">Blocks remaining</dt>
          <dd className="font-mono tabular-nums font-semibold">{d.blocksLeft.toLocaleString("en-US")}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="muted">New block reward</dt>
          <dd className="font-semibold">{d.rewardAfter} {d.symbol}</dd>
        </div>
      </dl>

      <p className="muted mt-4 text-xs leading-relaxed">{d.detail}</p>
      {d.note && (
        <p className="mt-2 rounded-lg bg-amber-500/10 px-3 py-2 text-xs leading-relaxed text-amber-700 dark:text-amber-300">
          {d.note}
        </p>
      )}
      <p className="muted mt-3 text-[11px] leading-relaxed">
        {d.basis}{" "}
        <a href={d.source.url} target="_blank" rel="nofollow noopener noreferrer" className="underline hover:text-brand-ink">
          Height from {d.source.label} ↗
        </a>
      </p>
    </div>
  );
}

export function HalvingCountdown({ data, computedAt }: { data: HalvingDatum[]; computedAt: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const sorted = [...data].sort((a, b) => Date.parse(a.estimatedISO) - Date.parse(b.estimatedISO));

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {sorted.map((d) => (
          <Card key={d.slug} d={d} now={now} />
        ))}
      </div>
      <p className="muted mt-4 text-xs">
        Block heights read {computedAt}. Each countdown ticks live in your browser toward the estimate
        above; the estimate itself refreshes when we next read the chains.
      </p>
    </div>
  );
}
