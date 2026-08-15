"use client";

import Link from "next/link";
import { getTool } from "@/lib/tools/registry";
import { categories } from "@/lib/categories";
import { useFavorites, useRecentTools, clearRecentTools } from "@/lib/tool-prefs";
import { FavoriteButton } from "./FavoriteButton";

/**
 * "Your tools" — favorites and recently-used, read from localStorage.
 *
 * Renders NOTHING for a visitor with neither, which is the common case and the
 * whole point: a first-time visitor sees the page exactly as before, with no
 * empty state and no layout shift.
 */
export function MyTools({
  heading = true,
  className = "",
}: {
  heading?: boolean;
  /** Applied to the section — kept here so spacing collapses with the content. */
  className?: string;
}) {
  const { favorites, ready: favReady } = useFavorites();
  const { recent, ready: recentReady } = useRecentTools();

  if (!favReady || !recentReady) return null;

  const favTools = favorites.map(getTool).filter(isTool);
  // A tool already pinned to favorites doesn't need a second row below it.
  const recentTools = recent
    .filter((slug) => !favorites.includes(slug))
    .map(getTool)
    .filter(isTool);

  if (favTools.length === 0 && recentTools.length === 0) return null;

  return (
    <section className={`mb-10 ${className}`}>
      {heading && (
        <div className="eyebrow mb-4">Your tools · saved on this device</div>
      )}

      {favTools.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--muted)]">
            ★ Favorites
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {favTools.map((t) => (
              <MiniCard key={t.slug} slug={t.slug} title={t.title} category={t.category} />
            ))}
          </div>
        </div>
      )}

      {recentTools.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--muted)]">
              ↻ Recently used
            </h2>
            <button
              type="button"
              onClick={clearRecentTools}
              className="text-xs muted hover:text-brand-ink hover:underline"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentTools.map((t) => (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                className="chip !px-3 !py-1.5 text-sm hover:border-brand-500 hover:text-brand-ink"
              >
                {categories[t.category].icon} {t.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function MiniCard({
  slug,
  title,
  category,
}: {
  slug: string;
  title: string;
  category: keyof typeof categories;
}) {
  return (
    <div className="group/card relative">
      <FavoriteButton slug={slug} title={title} />
      <Link href={`/tools/${slug}`} className="card card-hover group flex h-full items-center gap-3 p-4 pr-10">
        <span className="icon-badge h-9 w-9 text-base">{categories[category].icon}</span>
        <span className="text-sm font-semibold leading-snug group-hover:text-brand-ink">{title}</span>
      </Link>
    </div>
  );
}

function isTool<T>(t: T | undefined): t is T {
  return t !== undefined;
}
