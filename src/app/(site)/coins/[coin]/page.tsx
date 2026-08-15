import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site, absoluteUrl } from "@/lib/site";
import { ogImage } from "@/lib/seo";
import { getAllCoinSlugs, getCoin, sortedCoins } from "@/lib/coins/registry";
import { pagesForCoin } from "@/lib/coins/pairs";
import { CoinLogo } from "@/components/CoinLogo";
import { CoinFacts } from "@/components/CoinFacts";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/ads/AdSlot";
import { FaqSection } from "@/components/FaqSection";
import { coinHubFaq } from "@/lib/coins/hub-faq";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCoinSlugs().map((coin) => ({ coin }));
}

export function generateMetadata({ params }: { params: { coin: string } }): Metadata {
  const coin = getCoin(params.coin);
  if (!coin) return {};
  const url = absoluteUrl(`/coins/${coin.slug}`);
  // XRP's name and ticker are identical — don't print "XRP (XRP)".
  const label = coin.name === coin.symbol ? coin.name : `${coin.name} (${coin.symbol})`;
  const title = `${label} Calculators`;
  const description = `Free ${coin.name} calculators: profit, DCA, average buy price${
    coin.staking ? ", staking rewards" : ""
  } and liquidation price — each prefilled with the live ${coin.symbol} price.`;
  return {
    title,
    description,
    keywords: [
      `${coin.name.toLowerCase()} calculator`,
      `${coin.symbol.toLowerCase()} calculator`,
      `${coin.name.toLowerCase()} profit calculator`,
      `${coin.symbol.toLowerCase()} tools`,
    ],
    alternates: { canonical: url },
    openGraph: { type: "website", url, title: `${title} | ${site.name}`, description, images: [ogImage(`coins/${coin.slug}`, title)] },
  };
}

export default function CoinHubPage({ params }: { params: { coin: string } }) {
  const coin = getCoin(params.coin);
  if (!coin) notFound();

  const pages = pagesForCoin(coin);
  const faq = coinHubFaq(coin, pages.length);
  const url = absoluteUrl(`/coins/${coin.slug}`);
  const others = sortedCoins().filter((c) => c.slug !== coin.slug);

  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${coin.name} (${coin.symbol}) calculators`,
      url,
      description: coin.tagline,
      isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: pages.length,
        itemListElement: pages.map(({ spec }, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: spec.title(coin),
          url: absoluteUrl(`/coins/${coin.slug}/${spec.slug}`),
        })),
      },
    },
    ...(faq.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]
      : []),
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Coins", item: absoluteUrl("/coins") },
        { "@type": "ListItem", position: 3, name: coin.name, item: url },
      ],
    },
  ];

  return (
    <div>
      <JsonLd data={jsonLd} />

      <div className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="hero-glow absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-content px-4 pb-10 pt-8">
          <nav className="mb-5 flex items-center gap-2 text-sm muted" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand-ink">Home</Link>
            <span>/</span>
            <Link href="/coins" className="hover:text-brand-ink">Coins</Link>
            <span>/</span>
            <span className="text-[var(--text)]">{coin.name}</span>
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
              <span className="eyebrow">{coin.symbol}</span>
              <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
                {coin.name} Calculators
              </h1>
            </div>
          </div>
          <p className="muted mt-4 max-w-2xl text-lg">{coin.tagline}</p>
        </div>
      </div>

      <div className="mx-auto max-w-content px-4 py-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <section>
              <h2 className="text-xl font-bold">
                {pages.length} free {coin.symbol} calculators
              </h2>
              <p className="muted mt-2 text-sm">
                Every one opens with the live {coin.symbol} price already filled in. All maths runs
                in your browser — no signup, nothing stored.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {pages.map(({ spec }) => (
                  <Link
                    key={spec.slug}
                    href={`/coins/${coin.slug}/${spec.slug}`}
                    className="card card-hover group p-5"
                  >
                    <div className="font-semibold group-hover:text-brand-ink">
                      {spec.title(coin)}
                    </div>
                    <p className="muted mt-1.5 line-clamp-3 text-sm">{spec.description(coin)}</p>
                  </Link>
                ))}
              </div>
            </section>

            <section className="mt-10 max-w-3xl">
              <h2 className="text-2xl font-extrabold tracking-tight">About {coin.name}</h2>
              <p className="mt-4 leading-relaxed text-[var(--text)]/90">{coin.intro}</p>
              <p className="mt-4 leading-relaxed text-[var(--text)]/90">{coin.feeNote}</p>
              <p className="mt-4 leading-relaxed text-[var(--text)]/90">{coin.volatilityNote}</p>
            </section>

            <CoinFacts coin={coin} className="mt-10" />

            {faq.length > 0 && (
              <div className="max-w-3xl">
                <FaqSection faq={faq} />
              </div>
            )}

            <AdSlot slot="coin-hub" className="my-10" />

            <section className="mt-10">
              <h2 className="text-xl font-bold">Other coins</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {others.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/coins/${c.slug}`}
                    className="chip inline-flex items-center gap-2 hover:text-brand-ink"
                  >
                    <CoinLogo
                      slug={c.slug}
                      name={c.name}
                      symbol={c.symbol}
                      color={c.color}
                      size={18}
                    />
                    {c.name}
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* div, not <aside>: a complementary landmark nested inside <main> is a
              landmark-structure error, and this is a sidebar of ads/links. */}
          <div className="space-y-4">
            {coin.staking && (
              <div className="card p-5">
                <h2 className="text-sm font-bold uppercase tracking-wide muted">
                  Staking {coin.symbol}
                </h2>
                <p className="mt-3 text-sm leading-relaxed">{coin.staking.how}</p>
                <p className="muted mt-3 text-sm leading-relaxed">{coin.staking.lockup}</p>
                <Link
                  href={`/coins/${coin.slug}/staking-calculator`}
                  className="btn-primary mt-4 inline-flex px-4 py-2 text-sm"
                >
                  Estimate {coin.symbol} rewards →
                </Link>
              </div>
            )}
            <AdSlot slot="coin-sidebar" />
          </div>
        </div>
      </div>
    </div>
  );
}
