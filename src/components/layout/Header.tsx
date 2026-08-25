import Link from "next/link";
import { site } from "@/lib/site";
import { getActiveCategories, getSearchIndex } from "@/lib/tools/registry";
import { SearchBar } from "@/components/SearchBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";

export function Header() {
  const searchIndex = getSearchIndex();
  const activeCategories = getActiveCategories();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg-header)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-content items-center gap-4 px-4 py-3.5">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-lg font-extrabold tracking-tight">
          <Logo className="h-8 w-8" />
          <span className="hidden sm:inline">{site.name}</span>
        </Link>

        <div className="flex-1">
          <SearchBar items={searchIndex} />
        </div>

        <nav className="hidden items-center gap-4 text-sm lg:flex">
          <Link href="/tools" className="muted hover:text-brand-ink">Tools</Link>
          <Link href="/coins" className="muted hover:text-brand-ink">Coins</Link>
          <Link href="/portfolio" className="muted hover:text-brand-ink">Portfolio</Link>
          <Link href="/compare" className="muted hover:text-brand-ink">Compare</Link>
          <Link href="/exchanges" className="muted hover:text-brand-ink">Exchanges</Link>
          <Link href="/guides" className="muted hover:text-brand-ink">Guides</Link>
          <Link href="/calendar" className="muted hover:text-brand-ink">Calendar</Link>
          <Link href="/unlocks" className="muted hover:text-brand-ink">Unlocks</Link>
          <Link href="/investment-calculator" className="muted hover:text-brand-ink">What if?</Link>
          {/* Flagship tool — given its own emphasised slot rather than being
              buried among the 67 calculators. */}
          <Link
            href="/crypto-tax-report"
            className="rounded-full border border-brand-500/50 bg-brand-500/10 px-3 py-1 font-semibold text-brand-ink hover:bg-brand-500/20"
          >
            Tax report
          </Link>
        </nav>
        <ThemeToggle />
      </div>

      {/* Scrollable category strip. tabIndex makes the overflow reachable
          without a mouse — the links inside are focusable, but the scroll
          container itself must be too for the ones off-screen. */}
      <nav className="border-t border-[var(--border)]" aria-label="Tool categories">
        <div
          tabIndex={0}
          className="mx-auto flex max-w-content gap-1 overflow-x-auto px-4 py-2 text-sm"
        >
          {activeCategories.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.id}`}
              className="whitespace-nowrap rounded-full px-3 py-1 muted transition hover:bg-[var(--bg-elevated)] hover:text-brand-ink"
            >
              {c.icon} {c.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
