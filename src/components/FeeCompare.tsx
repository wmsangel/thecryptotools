"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { EXCHANGE_FEES, FEES_AS_OF, feeBand, type ExchangeFee } from "@/lib/fee-compare";

type SortKey = "taker" | "maker" | "name";
type Feature = "futures" | "card" | "bots";

const FEATURE_LABEL: Record<Feature, string> = {
  futures: "Futures",
  card: "Crypto card",
  bots: "Trading bots",
};

function pct(n: number | null): string | null {
  if (n == null) return null;
  return n === 0 ? "0%" : `${n.toFixed(2)}%`;
}

/** null (deferred) always sorts to the bottom. */
function num(n: number | null): number {
  return n == null ? Number.POSITIVE_INFINITY : n;
}

export function FeeCompare() {
  const [sort, setSort] = useState<SortKey>("taker");
  const [filters, setFilters] = useState<Set<Feature>>(new Set());
  const [hideDeferred, setHideDeferred] = useState(false);

  const rows = useMemo(() => {
    let list = EXCHANGE_FEES.filter((f) => [...filters].every((feat) => f.features[feat]));
    if (hideDeferred) list = list.filter((f) => f.takerPct != null);
    return [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "maker") return num(a.makerPct) - num(b.makerPct);
      return num(a.takerPct) - num(b.takerPct);
    });
  }, [sort, filters, hideDeferred]);

  const toggle = (feat: Feature) =>
    setFilters((prev) => {
      const next = new Set(prev);
      next.has(feat) ? next.delete(feat) : next.add(feat);
      return next;
    });

  return (
    <div>
      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium muted">Has:</span>
        {(Object.keys(FEATURE_LABEL) as Feature[]).map((feat) => (
          <button
            key={feat}
            type="button"
            onClick={() => toggle(feat)}
            aria-pressed={filters.has(feat)}
            className={`chip !px-3 !py-1 text-xs transition ${
              filters.has(feat) ? "border-brand-500 bg-brand-500/10 text-brand-ink" : "hover:border-brand-500/50"
            }`}
          >
            {FEATURE_LABEL[feat]}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setHideDeferred((v) => !v)}
          aria-pressed={hideDeferred}
          className={`chip !px-3 !py-1 text-xs transition ${
            hideDeferred ? "border-brand-500 bg-brand-500/10 text-brand-ink" : "hover:border-brand-500/50"
          }`}
        >
          Priced only
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--bg-subtle)] text-left">
              <Th onClick={() => setSort("name")} active={sort === "name"}>Exchange</Th>
              <Th onClick={() => setSort("maker")} active={sort === "maker"} right>Spot maker</Th>
              <Th onClick={() => setSort("taker")} active={sort === "taker"} right>Spot taker</Th>
              <th className="px-4 py-3 font-semibold">Perks</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((f) => (
              <Row key={f.slug} f={f} />
            ))}
          </tbody>
        </table>
      </div>

      <p className="muted mt-3 text-xs leading-relaxed">
        Spot, standard (VIP-0) tier as of {FEES_AS_OF}, before native-token discounts — the one tier
        that compares across venues. Fees change and higher volume lowers them, so confirm the current
        number on each exchange&apos;s live schedule. Where published rates disagree or a venue just
        rebuilt its tiers, we link to the schedule rather than print a figure we cannot stand behind.{" "}
        <Link href="/tools/trading-fee-calculator" className="font-semibold text-brand-ink hover:underline">
          Work out your real cost →
        </Link>
      </p>
    </div>
  );
}

function Th({
  children,
  onClick,
  active,
  right,
}: {
  children: ReactNode;
  onClick: () => void;
  active: boolean;
  right?: boolean;
}) {
  return (
    <th className={`px-4 py-3 ${right ? "text-right" : "text-left"}`}>
      <button
        type="button"
        onClick={onClick}
        className={`font-semibold transition hover:text-brand-ink ${active ? "text-brand-ink" : ""}`}
      >
        {children} {active ? "↓" : ""}
      </button>
    </th>
  );
}

function Row({ f }: { f: ExchangeFee }) {
  const maker = pct(f.makerPct);
  const taker = pct(f.takerPct);
  const deferred = f.takerPct == null;
  const perks: string[] = [];
  if (f.features.futures) perks.push("Futures");
  if (f.features.card) perks.push("Card");
  if (f.features.bots) perks.push("Bots");

  return (
    <tr className={`border-b border-[var(--border)] last:border-0 ${feeBand(f) === "low" ? "bg-emerald-500/[0.03]" : ""}`}>
      <td className="px-4 py-3">
        <div className="font-semibold">{f.name}</div>
        <a
          href={f.liveUrl}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="text-xs muted underline hover:text-brand-ink"
        >
          Live fees ↗
        </a>
      </td>
      <td className="px-4 py-3 text-right font-mono tabular-nums">{maker ?? "—"}</td>
      <td className="px-4 py-3 text-right font-mono tabular-nums">
        {deferred ? (
          <a href={f.liveUrl} target="_blank" rel="nofollow noopener noreferrer" className="text-xs text-brand-ink underline">
            see schedule
          </a>
        ) : (
          <span className="font-semibold">{taker}</span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {perks.map((p) => (
            <span key={p} className="chip !px-2 !py-0.5 text-[11px]">{p}</span>
          ))}
        </div>
        {f.tokenDiscount && <div className="mt-1 text-[11px] muted">{f.tokenDiscount}</div>}
        {deferred && f.note && <div className="mt-1 text-[11px] muted">{f.note}</div>}
      </td>
      <td className="px-4 py-3 text-right">
        <a
          href={`/go/${f.slug}`}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          data-affiliate={f.slug}
          data-affiliate-placement="fee-compare"
          className="btn-primary !px-3 !py-1.5 text-xs"
        >
          Trade →
        </a>
      </td>
    </tr>
  );
}
