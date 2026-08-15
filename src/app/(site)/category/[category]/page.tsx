import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory } from "@/lib/categories";
import { getActiveCategories, getToolsByCategory } from "@/lib/tools/registry";
import { buildCategoryMetadata, categoryJsonLd } from "@/lib/seo";
import { ToolCard } from "@/components/ToolCard";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/ads/AdSlot";

export const dynamicParams = false;

export function generateStaticParams() {
  // Only build pages for categories that have tools — empty ones are hidden.
  return getActiveCategories().map((c) => ({ category: c.id }));
}

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const cat = getCategory(params.category);
  if (!cat) return {};
  return buildCategoryMetadata(cat);
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const cat = getCategory(params.category);
  if (!cat) notFound();

  const tools = getToolsByCategory(cat.id);

  return (
    <div className="mx-auto max-w-content px-4 py-10">
      <JsonLd data={categoryJsonLd(cat, tools)} />
      <nav className="mb-5 flex items-center gap-2 text-sm muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-ink">Home</Link>
        <span>/</span>
        <span className="text-[var(--text)]">{cat.title}</span>
      </nav>

      <header className="mb-8 flex items-start gap-4">
        <span className="icon-badge h-16 w-16 text-3xl">{cat.icon}</span>
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{cat.title}</h1>
          <p className="muted mt-3 max-w-2xl text-lg">{cat.description}</p>
        </div>
      </header>

      {tools.length ? (
        <>
          {/* Names the tool grid so the outline does not jump h1 → h3. */}
          <h2 className="sr-only">{`${tools.length} ${cat.title.toLowerCase()}`}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </>
      ) : (
        <p className="muted">No tools in this category yet — check back soon.</p>
      )}

      <AdSlot slot="category-footer" className="my-8" />

      {/* Cross-links to other categories for SEO internal linking */}
      <section className="mt-10">
        <h2 className="mb-3 text-lg font-bold">Other categories</h2>
        <div className="flex flex-wrap gap-2 text-sm">
          {getActiveCategories()
            .filter((c) => c.id !== cat.id)
            .map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.id}`}
                className="rounded-full border border-[var(--border)] px-3 py-1 muted hover:border-brand-500 hover:text-brand-ink"
              >
                {c.icon} {c.label}
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
