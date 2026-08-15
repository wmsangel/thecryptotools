"use client";

import { useEffect, useState } from "react";
import { fetchLiveQuotes, type LiveQuote } from "@/lib/market/live";

/**
 * Live price strip shown site-wide under the header. Polls every 45s from the
 * visitor's browser (CoinGecko → Binance fallback) — see @/lib/market/live.
 */

const REFRESH_MS = 45_000;

function formatPrice(p: number): string {
  const digits = p >= 1000 ? 0 : p >= 1 ? 2 : 4;
  return p.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function PriceTicker() {
  const [quotes, setQuotes] = useState<LiveQuote[] | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const q = await fetchLiveQuotes();
        if (active && q.length) setQuotes(q);
      } catch {
        /* keep last known quotes on transient failure */
      }
    }
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  // Reserve height even before first load to avoid layout shift.
  return (
    <section
      aria-label="Live cryptocurrency prices"
      className="border-b border-[var(--border)] bg-[var(--bg-elevated)]"
    >
      <div className="mx-auto flex max-w-content items-center gap-2 px-4 py-1.5">
        <span className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-brand-ink">
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
          </span>
          Live
        </span>
        {/* A strip that scrolls sideways has to be reachable by keyboard, or its
            content is unreachable without a mouse (WCAG 2.1.1). */}
        <div
          tabIndex={0}
          role="group"
          aria-label="Price ticker, scrolls horizontally"
          className="flex flex-1 items-center gap-4 overflow-x-auto text-xs [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {quotes === null ? (
            <span className="muted">Loading prices…</span>
          ) : (
            quotes.map((q) => {
              const up = q.change >= 0;
              return (
                <span key={q.symbol} className="flex shrink-0 items-center gap-1.5 whitespace-nowrap">
                  <span className="font-semibold">{q.symbol}</span>
                  <span className="tabular-nums">{formatPrice(q.price)}</span>
                  <span className={`tabular-nums ${up ? "text-gain" : "text-loss"}`}>
                    {up ? "▲" : "▼"} {Math.abs(q.change).toFixed(2)}%
                  </span>
                </span>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
