import type { Coin } from "@/lib/coins/types";

/**
 * The durable protocol facts for a coin, rendered as a definition table.
 * Shared by the coin hub and every coin calculator page so the same figures
 * are stated once, in one place.
 */
export function CoinFacts({ coin, className = "" }: { coin: Coin; className?: string }) {
  return (
    <section className={className}>
      <h2 className="text-xl font-bold">{coin.name} at a glance</h2>
      <dl className="mt-4 divide-y divide-[var(--border)] rounded-xl border border-[var(--border)]">
        {coin.facts.map((fact) => (
          <div key={fact.label} className="flex items-start justify-between gap-4 px-4 py-3 text-sm">
            <dt className="muted">{fact.label}</dt>
            <dd className="text-right font-semibold">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
