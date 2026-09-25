"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

type Cat = { id: string; label: string; icon: string };
type Item = { href: string; label: string; icon?: string };
type Group = { label: string; items: Item[]; match: string[] };

/**
 * Primary navigation. Groups 11 flat links + a separate 8-item category strip
 * (which duplicated "Portfolio") into a handful of dropdowns, and adds the
 * mobile menu the old header lacked (nav was `hidden lg:flex`, unreachable on
 * a phone). Dropdowns open on click (hover is unusable on touch and for screen
 * readers), close on Escape / outside click, one at a time.
 */
export function MainNav({ categories }: { categories: Cat[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null); // desktop dropdown
  const [mobile, setMobile] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const groups: Group[] = [
    {
      label: "Tools",
      match: ["/tools", "/category", "/portfolio"],
      items: [
        { href: "/tools", label: "All tools", icon: "🧰" },
        ...categories.map((c) => ({ href: `/category/${c.id}`, label: c.label, icon: c.icon })),
        { href: "/portfolio", label: "Portfolio analysis", icon: "📊" },
      ],
    },
    {
      label: "Coins",
      match: ["/coins", "/compare"],
      items: [
        { href: "/coins", label: "All coins", icon: "🪙" },
        { href: "/compare", label: "Compare coins", icon: "⚖️" },
      ],
    },
    {
      label: "Markets",
      match: ["/calendar", "/unlocks", "/investment-calculator", "/dca"],
      items: [
        { href: "/dca", label: "DCA strategy lab", icon: "🧪" },
        { href: "/investment-calculator", label: "What if? (backtest)", icon: "⏳" },
        { href: "/calendar", label: "Crypto calendar", icon: "🗓️" },
        { href: "/unlocks", label: "Token unlocks", icon: "🔓" },
      ],
    },
  ];
  const links: Item[] = [
    { href: "/guides", label: "Guides" },
    { href: "/exchanges", label: "Exchanges" },
  ];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  // Close everything on navigation.
  useEffect(() => { setOpen(null); setMobile(false); }, [pathname]);

  const active = (m: string[]) => m.some((p) => pathname === p || pathname?.startsWith(p + "/"));
  const menuId = useId();

  return (
    <>
      {/* ---------- Desktop ---------- */}
      <nav ref={ref} className="hidden items-center gap-1 text-sm lg:flex" aria-label="Main">
        {groups.map((g) => (
          <div key={g.label} className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={open === g.label}
              onClick={() => setOpen((o) => (o === g.label ? null : g.label))}
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 transition hover:text-brand-ink ${active(g.match) ? "text-brand-ink" : "muted"}`}
            >
              {g.label}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                className={`transition ${open === g.label ? "rotate-180" : ""}`} aria-hidden><path d="m6 9 6 6 6-6" /></svg>
            </button>
            {open === g.label && (
              <div role="menu" aria-label={g.label}
                className="absolute left-0 top-full z-50 mt-1 w-56 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-1.5 shadow-xl">
                {g.items.map((it) => (
                  <Link key={it.href} href={it.href} role="menuitem"
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 transition hover:bg-white/5 hover:text-brand-ink">
                    {it.icon && <span className="w-5 text-center" aria-hidden>{it.icon}</span>}
                    <span>{it.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        {links.map((l) => (
          <Link key={l.href} href={l.href}
            className={`rounded-lg px-3 py-1.5 transition hover:text-brand-ink ${active([l.href]) ? "text-brand-ink" : "muted"}`}>
            {l.label}
          </Link>
        ))}
        <Link href="/crypto-tax-report"
          className="ml-1 rounded-full border border-brand-500/50 bg-brand-500/10 px-3 py-1.5 font-semibold text-brand-ink hover:bg-brand-500/20">
          Tax report
        </Link>
      </nav>

      {/* ---------- Mobile burger ---------- */}
      <button type="button" aria-label="Menu" aria-expanded={mobile} aria-controls={menuId}
        onClick={() => setMobile((m) => !m)}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] lg:hidden">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          {mobile ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {mobile && (
        <div id={menuId} className="absolute left-0 right-0 top-full z-50 max-h-[80vh] overflow-y-auto border-t border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 shadow-xl backdrop-blur-xl lg:hidden">
          <Link href="/crypto-tax-report"
            className="mb-3 block rounded-xl border border-brand-500/50 bg-brand-500/10 px-4 py-2.5 text-center font-semibold text-brand-ink">
            🧾 Tax report
          </Link>
          {groups.map((g) => (
            <div key={g.label} className="mb-3">
              <div className="px-1 pb-1 text-[11px] font-bold uppercase tracking-wide text-[var(--muted)]">{g.label}</div>
              <div className="grid grid-cols-2 gap-1">
                {g.items.map((it) => (
                  <Link key={it.href} href={it.href}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-white/5 hover:text-brand-ink">
                    {it.icon && <span aria-hidden>{it.icon}</span>}
                    <span className="truncate">{it.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className="grid grid-cols-2 gap-1 border-t border-[var(--border)] pt-2">
            {links.map((l) => (
              <Link key={l.href} href={l.href}
                className="rounded-lg px-3 py-2 text-sm transition hover:bg-white/5 hover:text-brand-ink">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
