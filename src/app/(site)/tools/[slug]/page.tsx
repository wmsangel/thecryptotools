import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTool, getAllSlugs, getRelatedTools } from "@/lib/tools/registry";
import { getGuidesForTool } from "@/lib/guides/registry";
import { coinsForTool } from "@/lib/coins/pairs";
import { CoinLogo } from "@/components/CoinLogo";
import { categories } from "@/lib/categories";
import { buildToolMetadata, toolJsonLd } from "@/lib/seo";
import { ToolEngine } from "@/components/ToolEngine";
import { ToolSeoContent } from "@/components/ToolSeoContent";
import { FaqSection } from "@/components/FaqSection";
import { RelatedTools } from "@/components/RelatedTools";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot, AffiliateBanner } from "@/components/ads/AdSlot";
import { tradeContextForTool } from "@/lib/affiliate";
import { GuideAffiliateCTA } from "@/components/guides/GuideAffiliateCTA";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const tool = getTool(params.slug);
  if (!tool) return {};
  return buildToolMetadata(tool);
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getTool(params.slug);
  if (!tool) notFound();

  const cat = categories[tool.category];
  const related = getRelatedTools(tool, 6);
  const guides = getGuidesForTool(tool.slug);
  const coinVersions = coinsForTool(tool.slug);

  return (
    <article>
      <JsonLd data={toolJsonLd(tool)} />

      {/* Header band with glow */}
      <div className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="hero-glow absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-content px-4 pb-10 pt-8">
          <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm muted" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand-ink">Home</Link>
            <span>/</span>
            <Link href={`/category/${cat.id}`} className="hover:text-brand-ink">{cat.title}</Link>
            <span>/</span>
            <span className="text-[var(--text)]">{tool.title}</span>
          </nav>

          <div className="flex items-start gap-4">
            <span className="icon-badge h-16 w-16 text-3xl">{cat.icon}</span>
            <div>
              <Link href={`/category/${cat.id}`} className="eyebrow hover:underline">
                {cat.title}
              </Link>
              <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
                {tool.title}
              </h1>
            </div>
          </div>
          <p className="muted mt-4 max-w-2xl text-lg">{tool.description}</p>
        </div>
      </div>

      <div className="mx-auto max-w-content px-4 py-10">
        {/* The universal engine */}
        <ToolEngine slug={tool.slug} />

        <AdSlot slot="tool-below-result" className="my-10" />

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            <ToolSeoContent tool={tool} related={related} />

            {tool.article && tool.article.length > 0 && (
              <section className="mt-12 max-w-3xl">
                {tool.article.map((block, i) => {
                  if (block.type === "h2")
                    return <h2 key={i} className="mt-8 text-2xl font-extrabold tracking-tight sm:text-3xl first:mt-0">{block.text}</h2>;
                  if (block.type === "ul")
                    return (
                      <ul key={i} className="mt-4 space-y-2">
                        {block.items.map((it, j) => (
                          <li key={j} className="flex gap-3 leading-relaxed">
                            <span className="mt-1 select-none text-brand-ink" aria-hidden>▸</span>
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  return <p key={i} className="mt-4 leading-relaxed text-[var(--text)]/90">{block.text}</p>;
                })}
              </section>
            )}

            {tool.affiliate && (
              <div className="mt-12">
                <GuideAffiliateCTA kind={tool.affiliate} placement={`tool-${tool.affiliate}-${tool.slug}`} />
              </div>
            )}

            {coinVersions.length > 0 && (
              <section className="mt-10">
                <h2 className="text-xl font-bold">Coin-specific versions</h2>
                <p className="muted mt-2 text-sm">
                  Same calculator, preloaded with that coin&apos;s live price and realistic defaults.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {coinVersions.map(({ coin, spec }) => (
                    <Link
                      key={coin.slug}
                      href={`/coins/${coin.slug}/${spec.slug}`}
                      className="chip inline-flex items-center gap-2 hover:text-brand-ink"
                    >
                      <CoinLogo
                        slug={coin.slug}
                        name={coin.name}
                        symbol={coin.symbol}
                        color={coin.color}
                        size={18}
                      />
                      {coin.name}
                    </Link>
                  ))}
                </div>
              </section>
            )}
            {guides.length > 0 && (
              <section className="mt-10">
                <h2 className="text-xl font-bold">📖 Learn more</h2>
                <div className="mt-4 space-y-3">
                  {guides.map((g) => (
                    <Link
                      key={g.slug}
                      href={`/guides/${g.slug}`}
                      className="card card-hover group flex items-center justify-between gap-4 p-4"
                    >
                      <div>
                        <div className="font-semibold group-hover:text-brand-ink">{g.title}</div>
                        <p className="muted mt-0.5 line-clamp-1 text-sm">{g.description}</p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-brand-ink">{g.readingMinutes} min →</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
            <FaqSection faq={tool.faq} />
            <RelatedTools tools={related} />
          </div>
          {/* div, not <aside>: a complementary landmark nested inside <main> is a
              landmark-structure error, and this is a sidebar of ads/links. */}
          <div className="space-y-4">
            <AffiliateBanner context={tradeContextForTool(tool.slug)} placement={`tool-${tool.slug}`} />
            <AdSlot slot="tool-sidebar" />
          </div>
        </div>

        <p className="muted mt-12 text-xs">
          For educational purposes only. {tool.title} results are estimates, not financial advice.
        </p>
      </div>
    </article>
  );
}
