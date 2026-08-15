"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { fetchMarketList, type MarketCoin } from "@/lib/market/live";
import { Sparkline } from "./Sparkline";

const REFRESH_MS = 60_000;

type SortKey = "rank" | "price" | "change24h" | "change7d" | "marketCap" | "volume";

function fmtPrice(p: number): string {
  const digits = p >= 1000 ? 0 : p >= 1 ? 2 : p >= 0.01 ? 4 : 8;
  return p.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function fmtCompact(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  });
}

function Change({ value }: { value: number }) {
  const up = value >= 0;
  return (
    <span className={`tabular-nums ${up ? "text-gain" : "text-loss"}`}>
      {up ? "▲" : "▼"} {Math.abs(value).toFixed(2)}%
    </span>
  );
}

export function PricesTable() {
  const [coins, setCoins] = useState<MarketCoin[] | null>(null);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [asc, setAsc] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<string>("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const list = await fetchMarketList(100);
        if (active && list.length) {
          setCoins(list);
          setError(false);
          setUpdatedAt(new Date().toLocaleTimeString());
        }
      } catch {
        if (active && coins === null) setError(true);
      }
    }
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      active = false;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rows = useMemo(() => {
    if (!coins) return [];
    const q = query.trim().toLowerCase();
    const filtered = q
      ? coins.filter((c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q))
      : coins;
    const sorted = [...filtered].sort((a, b) => {
      const dir = asc ? 1 : -1;
      return (a[sortKey] - b[sortKey]) * dir;
    });
    return sorted;
  }, [coins, query, sortKey, asc]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setAsc((v) => !v);
    } else {
      setSortKey(key);
      // Rank sorts ascending by default; everything else descending (biggest first).
      setAsc(key === "rank");
    }
  }

  const cols: { key: SortKey; label: string; className?: string }[] = [
    { key: "price", label: "Price", className: "text-right" },
    { key: "change24h", label: "24h", className: "text-right" },
    { key: "change7d", label: "7d", className: "text-right hidden sm:table-cell" },
    { key: "marketCap", label: "Market Cap", className: "text-right hidden md:table-cell" },
    { key: "volume", label: "Volume (24h)", className: "text-right hidden lg:table-cell" },
  ];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search coin or ticker…"
          className="input-field max-w-xs"
          aria-label="Search coins"
        />
        <span className="text-xs muted">
          {updatedAt ? `Updated ${updatedAt} · auto-refreshes` : "Live from CoinGecko"}
        </span>
      </div>

      {error && !coins ? (
        <div className="card p-6 text-sm muted">
          Couldn&apos;t load market data right now. It refreshes automatically — try again shortly.
        </div>
      ) : (
        <div className="card overflow-x-auto p-0" tabIndex={0} role="group" aria-label="Prices table, scrolls horizontally">
          <table className="w-full min-w-[660px] text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-xs muted">
                <th className="cursor-pointer px-3 py-3 text-left font-semibold" onClick={() => toggleSort("rank")}>
                  # {sortKey === "rank" ? (asc ? "▲" : "▼") : ""}
                </th>
                <th className="px-3 py-3 text-left font-semibold">Coin</th>
                {cols.map((c) => (
                  <Fragment key={c.key}>
                    <th
                      className={`cursor-pointer px-3 py-3 font-semibold ${c.className ?? ""}`}
                      onClick={() => toggleSort(c.key)}
                    >
                      {c.label} {sortKey === c.key ? (asc ? "▲" : "▼") : ""}
                    </th>
                    {/* The 7d chart sits beside the 7d number, and is not
                        sortable — there is no single value to sort it by. */}
                    {c.key === "change7d" && (
                      <th className="hidden px-3 py-3 text-center font-semibold sm:table-cell">
                        7d chart
                      </th>
                    )}
                  </Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && coins ? (
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center muted">
                    {coins.length ? "No coins match your search." : "Loading market data…"}
                  </td>
                </tr>
              ) : (
                rows.map((c) => (
                  <tr key={c.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-elevated)]">
                    <td className="px-3 py-3 tabular-nums muted">{c.rank || "—"}</td>
                    <td className="px-3 py-3">
                      <span className="flex items-center gap-2">
                        {c.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={c.image} alt="" width={20} height={20} className="h-5 w-5 rounded-full" loading="lazy" />
                        )}
                        <span className="font-medium">{c.name}</span>
                        <span className="muted">{c.symbol}</span>
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right font-semibold tabular-nums">{fmtPrice(c.price)}</td>
                    <td className="px-3 py-3 text-right"><Change value={c.change24h} /></td>
                    <td className="hidden px-3 py-3 text-right sm:table-cell"><Change value={c.change7d} /></td>
                    <td className="hidden px-3 py-2 sm:table-cell">
                      <span className="flex justify-center">
                        <Sparkline data={c.sparkline} label={`${c.name} 7 day price trend`} />
                      </span>
                    </td>
                    <td className="hidden px-3 py-3 text-right tabular-nums muted md:table-cell">{fmtCompact(c.marketCap)}</td>
                    <td className="hidden px-3 py-3 text-right tabular-nums muted lg:table-cell">{fmtCompact(c.volume)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
