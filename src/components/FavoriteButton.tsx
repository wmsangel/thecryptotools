"use client";

import { useFavorites } from "@/lib/tool-prefs";
import { track } from "@/lib/analytics";

/**
 * Star toggle for a tool card.
 *
 * Rendered as a SIBLING of the card's <Link>, never inside it — a <button>
 * nested in an <a> is invalid HTML and browsers handle the click ambiguously.
 * The parent card therefore needs `relative`, and this sits absolutely on top.
 */
export function FavoriteButton({ slug, title }: { slug: string; title: string }) {
  const { isFavorite, toggle, ready } = useFavorites();

  // Before mount we don't know the stored state; rendering a hollow star would
  // flash "not favorited" on a favorited tool, so render nothing at all.
  if (!ready) return null;

  const active = isFavorite(slug);

  return (
    <button
      type="button"
      onClick={() => {
        toggle(slug);
        // `active` is this render's value, so the new state is its opposite.
        track("favorite_toggle", { tool_slug: slug, action: active ? "remove" : "add" });
      }}
      aria-pressed={active}
      aria-label={active ? `Remove ${title} from favorites` : `Add ${title} to favorites`}
      title={active ? "Remove from favorites" : "Save to favorites"}
      className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border text-sm transition ${
        active
          ? "border-amber-400/60 bg-amber-400/15 text-amber-500"
          : "border-transparent text-[var(--muted)] opacity-50 hover:border-[var(--border)] hover:text-amber-500 hover:opacity-100 focus-visible:opacity-100 group-hover/card:opacity-100"
      }`}
    >
      {active ? "★" : "☆"}
    </button>
  );
}
