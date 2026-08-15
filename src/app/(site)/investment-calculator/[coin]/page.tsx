import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { absoluteUrl } from "@/lib/site";
import { ogImage } from "@/lib/seo";
import { getCoin, sortedCoins } from "@/lib/coins/registry";
import { getHistoryMeta } from "@/lib/backtest/history-index";
import { JsonLd } from "@/components/JsonLd";
import { CoinLogo } from "@/components/CoinLogo";
import { AdSlot } from "@/components/ads/AdSlot";
import { BacktestApp } from "../BacktestApp";
import { coinInsights } from "@/lib/backtest/insights";
import { CoinHistoryFacts } from "@/components/backtest/CoinHistoryFacts";
import { coinFaq } from "@/lib/backtest/coin-faq";
import { FaqSection } from "@/components/FaqSection";
import { coinOptions } from "../options";

export const dynamicParams = false;

export function generateStaticParams() {
  // Only coins we actually hold a price series for. A backtest page for a coin
  // with no history renders its own "no data" state, which is an indexable
  // page that cannot answer the question it is titled after — and adding a coin
  // to the registry should not silently create one.
  return sortedCoins()
    .filter((c) => getHistoryMeta(c.slug))
    .map((c) => ({ coin: c.slug }));
}

/**
 * One page per coin, targeting "<coin> investment calculator" — a phrasing
 * Search Console already shows impressions for (chainlink, polkadot, litecoin,
 * shiba inu) without a page existing to answer it.
 */
export function generateMetadata({ params }: { params: { coin: string } }): Metadata {
  const coin = getCoin(params.coin);
  if (!coin) return {};
  // Repeating the asset in the tail pushed 47 of these past 62 characters, so
  // Google cut the interesting half. The coin name is already the first word.
  const title = `${coin.name} Investment Calculator — What If You'd Invested?`;
  const description = `See what buying ${coin.symbol} would be worth today. Backtest a lump sum or a monthly buy against real ${coin.name} daily prices, including the drawdowns along the way.`;
  return {
    title,
    description,
    keywords: [
      `${coin.name.toLowerCase()} investment calculator`,
      `${coin.symbol.toLowerCase()} investment calculator`,
      `what if i invested in ${coin.name.toLowerCase()}`,
      `${coin.name.toLowerCase()} dca calculator`,
      `${coin.symbol.toLowerCase()} historical returns`,
    ],
    alternates: { canonical: absoluteUrl(`/investment-calculator/${coin.slug}`) },
    openGraph: {
      type: "website",
      title,
      description,
      url: absoluteUrl(`/investment-calculator/${coin.slug}`),
      images: [ogImage(`investment-calculator/${coin.slug}`, title)],
    },
  };
}

export default function Page({ params }: { params: { coin: string } }) {
  const coin = getCoin(params.coin);
  if (!coin) notFound();

  // Computed at build time from this coin's own daily closes. Null only if the
  // series is too short to say anything honest about.
  const insights = coinInsights(coin.slug);
  const faq = insights ? coinFaq(insights, coin.name, coin.symbol) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: `${coin.name} Investment Calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            url: absoluteUrl(`/investment-calculator/${coin.slug}`),
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
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
              { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
              { "@type": "ListItem", position: 2, name: "Investment calculator", item: absoluteUrl("/investment-calculator") },
              { "@type": "ListItem", position: 3, name: coin.name, item: absoluteUrl(`/investment-calculator/${coin.slug}`) },
            ],
          },
        ]}
      />

      <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-ink">Home</Link>
        <span>/</span>
        <Link href="/investment-calculator" className="hover:text-brand-ink">Investment calculator</Link>
        <span>/</span>
        <span className="text-[var(--text)]">{coin.name}</span>
      </nav>

      <header className="flex items-start gap-4">
        <span className="mt-1 shrink-0">
          <CoinLogo slug={coin.slug} name={coin.name} symbol={coin.symbol} color={coin.color} size={44} />
        </span>
        <div>
          <div className="eyebrow">
            {coin.name} · {coin.symbol}
          </div>
          <h1 className="mt-2 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            {coin.name} Investment Calculator
          </h1>
          <p className="muted mt-3 max-w-2xl text-lg leading-relaxed">
            What would buying {coin.symbol} have been worth? Pick a plan and a start date and this
            replays it against real daily {coin.name} closes.
          </p>
        </div>
      </header>

      <BacktestApp coins={coinOptions()} lockedCoin={coin.slug} />

      <AdSlot slot="backtest-coin-below" className="my-10" />

      {insights && (
        <CoinHistoryFacts name={coin.name} symbol={coin.symbol} slug={coin.slug} i={insights} />
      )}

      {faq.length > 0 && <FaqSection faq={faq} />}

      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight">
          What to keep in mind for {coin.symbol}
        </h2>
        <p className="muted mt-3 leading-relaxed">{coin.volatilityNote}</p>
        <p className="muted mt-3 leading-relaxed">{coin.feeNote}</p>
        <p className="muted mt-3 leading-relaxed">
          A backtest is one path that already happened. It shows what this plan produced through the
          exact sequence of prices {coin.symbol} went through — not what a similar plan will produce
          through a sequence nobody has seen yet.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/coins/${coin.slug}`} className="btn-ghost">
            All {coin.symbol} calculators →
          </Link>
          <Link href={`/coins/${coin.slug}/dca-calculator`} className="btn-ghost">
            {coin.symbol} DCA calculator →
          </Link>
          <Link href="/guides/dollar-cost-averaging-crypto" className="btn-ghost">
            How DCA behaves →
          </Link>
        </div>
      </section>
    </div>
  );
}
