import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site, absoluteUrl } from "@/lib/site";
import { ogImage } from "@/lib/seo";
import { allCoinToolPages, getCoinToolPage, pagesForCoin } from "@/lib/coins/pairs";
import { getGuidesForTool } from "@/lib/guides/registry";
import { ToolEngine } from "@/components/ToolEngine";
import { CoinLogo } from "@/components/CoinLogo";
import { CoinFacts } from "@/components/CoinFacts";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot, AffiliateBanner } from "@/components/ads/AdSlot";

export const dynamicParams = false;

export function generateStaticParams() {
  return allCoinToolPages().map(({ coin, spec }) => ({ coin: coin.slug, tool: spec.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { coin: string; tool: string };
}): Metadata {
  const page = getCoinToolPage(params.coin, params.tool);
  if (!page) return {};
  const { coin, spec, tool } = page;
  const url = absoluteUrl(`/coins/${coin.slug}/${spec.slug}`);
  const title = spec.title(coin);
  const description = spec.description(coin);
  return {
    title,
    description,
    keywords: [...spec.keywords(coin), ...tool.seo.keywords],
    alternates: { canonical: url },
    openGraph: { type: "website", url, title: `${title} | ${site.name}`, description, images: [ogImage(`coins/${coin.slug}/${spec.slug}`, title)] },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function CoinToolPage({ params }: { params: { coin: string; tool: string } }) {
  const page = getCoinToolPage(params.coin, params.tool);
  if (!page) notFound();

  const { coin, spec, tool } = page;
  const url = absoluteUrl(`/coins/${coin.slug}/${spec.slug}`);
  const title = spec.title(coin);
  const faq = [...spec.faq(coin), ...tool.faq.slice(0, 2)];
  const siblings = pagesForCoin(coin).filter((p) => p.spec.slug !== spec.slug);
  const guides = getGuidesForTool(tool.slug).slice(0, 3);

  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: title,
      url,
      description: spec.description(coin),
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      isAccessibleForFree: true,
      about: { "@type": "Thing", name: `${coin.name} (${coin.symbol})` },
      publisher: { "@type": "Organization", name: site.organization.name, url: site.url },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Coins", item: absoluteUrl("/coins") },
        { "@type": "ListItem", position: 3, name: coin.name, item: absoluteUrl(`/coins/${coin.slug}`) },
        { "@type": "ListItem", position: 4, name: title, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <article>
      <JsonLd data={jsonLd} />

      <div className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="hero-glow absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-content px-4 pb-10 pt-8">
          <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm muted" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand-ink">Home</Link>
            <span>/</span>
            <Link href="/coins" className="hover:text-brand-ink">Coins</Link>
            <span>/</span>
            <Link href={`/coins/${coin.slug}`} className="hover:text-brand-ink">{coin.name}</Link>
            <span>/</span>
            <span className="text-[var(--text)]">{tool.title}</span>
          </nav>

          <div className="flex items-start gap-4">
            <CoinLogo
              slug={coin.slug}
              name={coin.name}
              symbol={coin.symbol}
              color={coin.color}
              size={64}
            />
            <div>
              <Link href={`/coins/${coin.slug}`} className="eyebrow hover:underline">
                {coin.name} · {coin.symbol}
              </Link>
              <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
            </div>
          </div>
          <p className="muted mt-4 max-w-2xl text-lg">{spec.description(coin)}</p>
        </div>
      </div>

      <div className="mx-auto max-w-content px-4 py-10">
        <ToolEngine
          slug={tool.slug}
          overrides={spec.overrides(coin)}
          prefill={{
            coingeckoId: coin.coingeckoId,
            binance: coin.binance,
            symbol: coin.symbol,
            fields: spec.priceFields,
          }}
        />

        <AdSlot slot="tool-below-result" className="my-10" />

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="max-w-3xl">
            <section>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Using the {title}
              </h2>
              {spec.body(coin).map((paragraph, i) => (
                <p key={i} className="mt-4 leading-relaxed text-[var(--text)]/90">
                  {paragraph}
                </p>
              ))}
            </section>

            <CoinFacts coin={coin} className="mt-10" />

            <section className="mt-10">
              <h2 className="text-2xl font-extrabold tracking-tight">
                Frequently asked questions
              </h2>
              <dl className="mt-5 divide-y divide-[var(--border)]">
                {faq.map((f, i) => (
                  <div key={i} className="py-4">
                    <dt className="font-semibold">{f.q}</dt>
                    <dd className="muted mt-1.5 text-sm leading-relaxed">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {siblings.length > 0 && (
              <section className="mt-10">
                <h2 className="text-xl font-bold">More {coin.symbol} calculators</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {siblings.map(({ spec: s }) => (
                    <Link
                      key={s.slug}
                      href={`/coins/${coin.slug}/${s.slug}`}
                      className="card card-hover p-4"
                    >
                      <div className="font-semibold">{s.title(coin)}</div>
                      <p className="muted mt-1 line-clamp-2 text-sm">{s.description(coin)}</p>
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
                      <span className="shrink-0 text-sm font-semibold text-brand-ink">
                        {g.readingMinutes} min →
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <p className="muted mt-10 text-sm">
              Prefer the generic version without {coin.symbol} presets?{" "}
              <Link href={`/tools/${tool.slug}`} className="text-brand-ink hover:underline">
                Open the {tool.title}
              </Link>
              .
            </p>
          </div>

          {/* div, not <aside>: a complementary landmark nested inside <main> is a
              landmark-structure error, and this is a sidebar of ads/links. */}
          <div className="space-y-4">
            <AffiliateBanner />
            <AdSlot slot="tool-sidebar" />
          </div>
        </div>

        <p className="muted mt-12 text-xs">
          For educational purposes only. Rates, fees and protocol parameters change — verify current
          figures with your exchange or validator before acting. Not financial advice.
        </p>
      </div>
    </article>
  );
}
