"use client";

import Link from "next/link";
import { useMemo, useState, useRef, useEffect } from "react";
import type { SearchItem } from "@/lib/tools/registry";
import { categories } from "@/lib/categories";
import { track } from "@/lib/analytics";

/**
 * Client-side fuzzy-ish search over the pre-built tool index. Zero network,
 * instant results — the whole index ships in the page (it's tiny).
 */
export function SearchBar({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return items
      .map((item) => {
        const haystack = `${item.title} ${item.description} ${item.keywords.join(" ")}`.toLowerCase();
        let score = 0;
        if (item.title.toLowerCase().includes(q)) score += 3;
        if (item.keywords.some((k) => k.toLowerCase().includes(q))) score += 2;
        if (haystack.includes(q)) score += 1;
        return { item, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((r) => r.item);
  }, [query, items]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => setActive(0), [query]);

  /**
   * Report the search term once typing settles, never per keystroke ("b", "bt",
   * "btc" are one search, not three).
   *
   * `has_results: false` is the row worth reading: an on-site search that finds
   * nothing is a visitor telling us, in their own words, which tool is missing.
   * That is how "crypto mortgage calculator" would surface before Search
   * Console ever shows it.
   */
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 3) return;
    const timer = setTimeout(() => {
      track("search", { search_term: q.slice(0, 60), has_results: results.length > 0 });
    }, 900);
    return () => clearTimeout(timer);
  }, [query, results.length]);

  return (
    <div ref={boxRef} className="relative w-full max-w-md">
      <input
        type="search"
        value={query}
        placeholder="Search 100+ tools…"
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") setActive((a) => Math.min(a + 1, results.length - 1));
          if (e.key === "ArrowUp") setActive((a) => Math.max(a - 1, 0));
          if (e.key === "Enter" && results[active]) {
            window.location.href = `/tools/${results[active].slug}`;
          }
        }}
        className="input-field"
        aria-label="Search tools"
      />
      {open && results.length > 0 && (
        <ul className="card absolute z-50 mt-2 w-full overflow-hidden py-1 shadow-xl">
          {results.map((item, idx) => (
            <li key={item.slug}>
              <Link
                href={`/tools/${item.slug}`}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 text-sm ${idx === active ? "bg-brand-500/10" : ""}`}
              >
                <span>{categories[item.category].icon}</span>
                <span className="font-medium">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
