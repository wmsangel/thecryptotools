import Link from "next/link";
import { CoinLogo } from "@/components/CoinLogo";
import type { CoinCalcLink } from "@/lib/coins/featured-pairs";

/**
 * A compact grid of internal links to coin calculators, used on the homepage
 * and to cross-link the coin×tool cluster. Descriptive anchors (the tool title)
 * carry the relevance; the logo is decorative.
 */
export function CoinCalcGrid({ items, compact = false }: { items: CoinCalcLink[]; compact?: boolean }) {
  if (items.length === 0) return null;
  return (
    <div className={`grid gap-3 ${compact ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
      {items.map((c) => (
        <Link key={c.href} href={c.href} className="card card-hover group flex items-center gap-3 p-4">
          <CoinLogo slug={c.slug} name={c.name} symbol={c.symbol} color={c.color} size={compact ? 32 : 40} />
          <div className="min-w-0">
            <div className="truncate font-semibold group-hover:text-brand-ink">{c.title}</div>
            {!compact && <p className="muted mt-0.5 line-clamp-1 text-xs">{c.tagline}</p>}
          </div>
        </Link>
      ))}
    </div>
  );
}
