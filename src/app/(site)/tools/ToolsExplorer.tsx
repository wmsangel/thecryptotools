"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { categories, categoryList, type CategoryId } from "@/lib/categories";
import { useFavorites } from "@/lib/tool-prefs";
import { FavoriteButton } from "@/components/FavoriteButton";

interface Item {
  slug: string;
  title: string;
  description: string;
  category: CategoryId;
  source: "builtin" | "ai";
  keywords: string[];
}

export function ToolsExplorer({ items }: { items: Item[] }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<CategoryId | "all" | "favorites">("all");
  const { favorites, ready } = useFavorites();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (cat === "favorites") {
        if (!favorites.includes(item.slug)) return false;
      } else if (cat !== "all" && item.category !== cat) return false;
      if (!q) return true;
      const hay = `${item.title} ${item.description} ${item.keywords.join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, query, cat, favorites]);

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools…"
          className="input-field sm:max-w-xs"
          aria-label="Search tools"
        />
        <div className="flex flex-wrap gap-1">
          <Chip active={cat === "all"} onClick={() => setCat("all")}>All</Chip>
          {/* Only offered once there is something to filter to — an empty
              favorites tab is a dead end for a first-time visitor. */}
          {ready && favorites.length > 0 && (
            <Chip active={cat === "favorites"} onClick={() => setCat("favorites")}>
              ★ Favorites ({favorites.length})
            </Chip>
          )}
          {categoryList.map((c) => (
            <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
              {c.icon} {c.label}
            </Chip>
          ))}
        </div>
      </div>

      <p className="muted mb-3 text-sm">{filtered.length} tools</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <div key={item.slug} className="group/card relative h-full">
            <FavoriteButton slug={item.slug} title={item.title} />
            <Link
              href={`/tools/${item.slug}`}
              className="card card-hover group flex h-full flex-col p-5"
            >
              <div className="flex items-center gap-3 pr-8">
                <span className="icon-badge h-11 w-11 text-xl">{categories[item.category].icon}</span>
                <span className="chip !px-2.5 !py-0.5 text-xs">{categories[item.category].label}</span>
                {item.source === "ai" && (
                  <span className="ml-auto rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] font-semibold text-brand-ink">
                    AI
                  </span>
                )}
              </div>
              <h3 className="mt-4 text-lg font-bold group-hover:text-brand-ink">{item.title}</h3>
              <p className="muted mt-2 line-clamp-2 text-sm leading-relaxed">{item.description}</p>
            </Link>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="muted mt-8 text-center">
          {cat === "favorites"
            ? "No favorites match your search. Star a tool with ☆ to save it here."
            : "No tools match your search."}
        </p>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-full border px-3 py-1 text-sm transition ${
        active
          ? "border-brand-500 bg-brand-500/10 text-brand-ink"
          : "border-[var(--border)] muted hover:border-brand-500"
      }`}
    >
      {children}
    </button>
  );
}
