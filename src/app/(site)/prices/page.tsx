import type { Metadata } from "next";
import { site, absoluteUrl } from "@/lib/site";
import { ogImage, breadcrumbJsonLd } from "@/lib/seo";
import { PricesTable } from "@/components/PricesTable";
import { AdSlot } from "@/components/ads/AdSlot";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Live Crypto Prices — Top 100 Coins",
  description:
    "Live prices for the top 100 cryptocurrencies by market cap, with 24h and 7d changes, market cap and volume. Search and sort — updates automatically.",
  keywords: [
    "live crypto prices",
    "cryptocurrency prices",
    "crypto market cap",
    "bitcoin price live",
    "top 100 crypto",
  ],
  alternates: { canonical: absoluteUrl("/prices") },
  openGraph: {
    title: "Live Crypto Prices — Top 100 Coins",
    description:
      "Live top-100 crypto prices with 24h/7d change, market cap and volume. Search and sort in real time.",
    url: absoluteUrl("/prices"),
    images: [ogImage("prices", "Live crypto prices")],
  },
};

export default function PricesPage() {
  return (
    <div className="mx-auto max-w-content px-4 py-10">
    <JsonLd data={breadcrumbJsonLd([{ name: "Live prices", path: "/prices" }])} />
      <header className="mb-6">
        <div className="eyebrow">Live market</div>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Live crypto <span className="text-gradient">prices</span>
        </h1>
        <p className="muted mt-3 max-w-2xl text-lg">
          Top 100 coins by market cap with 24h and 7d change, market cap and volume.
          Search, sort, and watch it update automatically — powered by CoinGecko.
        </p>
      </header>

      <PricesTable />

      <p className="muted mt-4 text-xs">
        Data from CoinGecko, refreshed in your browser. For information only — not
        financial advice. {site.name} doesn&apos;t guarantee accuracy or timeliness.
      </p>

      <AdSlot slot="prices-footer" className="mt-10" />
    </div>
  );
}
