import type { Metadata } from "next";
import Link from "next/link";
import { site, absoluteUrl } from "@/lib/site";
import { ogImage, breadcrumbJsonLd } from "@/lib/seo";
import { sortedCoins } from "@/lib/coins/registry";
import { allCoinToolPages, pagesForCoin } from "@/lib/coins/pairs";
import { CoinLogo } from "@/components/CoinLogo";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/ads/AdSlot";

const description =
  "Coin-specific crypto calculators: profit, DCA, average buy price, staking rewards and liquidation price for Bitcoin, Ethereum, Solana, XRP and more — each prefilled with the live market price.";

export const metadata: Metadata = {
  title: "Crypto Calculators by Coin",
  description,
  keywords: [
    "bitcoin calculator",
    "ethereum calculator",
    "solana staking calculator",
    "crypto calculator by coin",
    "coin profit calculator",
  ],
  alternates: { canonical: absoluteUrl("/coins") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/coins"),
    title: `Crypto Calculators by Coin | ${site.name}`,
    description,
    images: [ogImage("coins", "Crypto calculators by coin")],
  },
};

export default function CoinsIndexPage() {
  const coins = sortedCoins();
  const total = allCoinToolPages().length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Crypto calculators by coin",
    url: absoluteUrl("/coins"),
    description,
    isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: coins.length,
      itemListElement: coins.map((c, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: `${c.name} (${c.symbol}) calculators`,
        url: absoluteUrl(`/coins/${c.slug}`),
      })),
    },
  };

  return (
    <div>

    <JsonLd data={breadcrumbJsonLd([{ name: "Coins", path: "/coins" }])} />
      <JsonLd data={jsonLd} />

      <div className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="hero-glow absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-content px-4 pb-10 pt-10">
          <span className="eyebrow">By coin</span>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Crypto Calculators by Coin
          </h1>
          <p className="muted mt-4 max-w-2xl text-lg">
            {total} calculators across {coins.length} assets. Each one opens with that coin&apos;s
            live price already filled in, plus the protocol facts that change how the numbers should
            be read.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-content px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coins.map((coin) => {
            const pages = pagesForCoin(coin);
            return (
              <Link key={coin.slug} href={`/coins/${coin.slug}`} className="card card-hover group p-5">
                <div className="flex items-center gap-3">
                  <CoinLogo
                    slug={coin.slug}
                    name={coin.name}
                    symbol={coin.symbol}
                    color={coin.color}
                    size={36}
                  />
                  <div>
                    <div className="font-bold group-hover:text-brand-ink">{coin.name}</div>
                    <div className="text-xs muted">{coin.symbol}</div>
                  </div>
                </div>
                <p className="muted mt-3 line-clamp-2 text-sm">{coin.tagline}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {pages.map(({ spec }) => (
                    <span key={spec.slug} className="chip !px-2 !py-0.5 text-[11px]">
                      {spec.slug.replace(/-calculator$/, "").replace(/-/g, " ")}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>

        <AdSlot slot="coins-index" className="my-10" />

        <section className="mt-4 max-w-3xl">
          <h2 className="text-2xl font-extrabold tracking-tight">
            Why a separate calculator per coin?
          </h2>
          <p className="mt-4 leading-relaxed text-[var(--text)]/90">
            The arithmetic behind a profit or staking calculation is the same for every asset — but
            the inputs are not. A realistic position size in BTC is a fraction of a coin and in SHIB
            it is tens of millions. Staking rewards, lockup periods and unbonding rules differ per
            protocol. Fees are negligible on one chain and larger than a small trade on another.
          </p>
          <p className="mt-4 leading-relaxed text-[var(--text)]/90">
            These pages load the coin&apos;s live price, prefill sensible amounts and state the
            protocol facts that change how you should read the result. If you would rather start
            from a blank form, every underlying tool is in the{" "}
            <Link href="/tools" className="text-brand-ink hover:underline">
              full tool list
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
