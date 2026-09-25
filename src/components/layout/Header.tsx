import { site } from "@/lib/site";
import { getActiveCategories, getSearchIndex } from "@/lib/tools/registry";
import { SearchBar } from "@/components/SearchBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { MainNav } from "@/components/layout/MainNav";
import Link from "next/link";

export function Header() {
  const searchIndex = getSearchIndex();
  const activeCategories = getActiveCategories();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg-header)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-content items-center gap-3 px-4 py-3.5">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-lg font-extrabold tracking-tight">
          <Logo className="h-8 w-8" />
          <span className="hidden sm:inline">{site.name}</span>
        </Link>

        <div className="flex-1">
          <SearchBar items={searchIndex} />
        </div>

        {/* Grouped dropdown nav (desktop) + burger drawer (mobile). Replaces the
            old 11-link row and the separate scrollable category strip — the
            categories now live inside the "Tools" dropdown. */}
        <MainNav categories={activeCategories} />
        <ThemeToggle />
      </div>
    </header>
  );
}
