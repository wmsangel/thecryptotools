import type { Coin } from "@/lib/coins/types";
import { toolInsight } from "@/lib/coins/tool-insights";

/**
 * Renders the unique, data-derived insight for one coin on one tool. Server
 * component — `toolInsight` reads price history from disk at build time. Renders
 * nothing when there is no data (e.g. a coin with no price series), so the page
 * simply falls back to its templated body.
 */
export function CoinToolInsight({
  coin,
  toolSlug,
  className = "",
}: {
  coin: Coin;
  toolSlug: string;
  className?: string;
}) {
  const insight = toolInsight(coin, toolSlug);
  if (!insight) return null;

  return (
    <section className={className}>
      <h2 className="text-2xl font-extrabold tracking-tight">{insight.heading}</h2>

      <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {insight.stats.map((s) => (
          <div key={s.label} className="card p-4">
            <dt className="muted text-xs uppercase tracking-wide">{s.label}</dt>
            <dd className="mt-1 text-lg font-bold tracking-tight">{s.value}</dd>
          </div>
        ))}
      </dl>

      {insight.paragraphs.map((p, i) => (
        <p key={i} className="mt-4 leading-relaxed text-[var(--text)]/90">
          {p}
        </p>
      ))}

      <p className="muted mt-4 text-xs">
        Figures are derived from {coin.symbol}&apos;s own daily closes over the window shown and are
        bounded by it — not all-time values. Prices move; treat them as context, not a forecast.
      </p>
    </section>
  );
}
