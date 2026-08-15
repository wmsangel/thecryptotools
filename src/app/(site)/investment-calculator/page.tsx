import type { Metadata } from "next";
import Link from "next/link";
import { site, absoluteUrl } from "@/lib/site";
import { ogImage, breadcrumbJsonLd } from "@/lib/seo";
import { sortedCoins } from "@/lib/coins/registry";
import { JsonLd } from "@/components/JsonLd";
import { CoinLogo } from "@/components/CoinLogo";
import { AdSlot } from "@/components/ads/AdSlot";
import { BacktestApp } from "./BacktestApp";
import { coinOptions } from "./options";

export const metadata: Metadata = {
  title: "Crypto Investment Calculator — What If You Had Invested?",
  description:
    "Backtest any crypto investment against real daily prices. See what a lump sum or a monthly buy would be worth today, with the drawdowns you would have sat through.",
  keywords: [
    "crypto investment calculator",
    "what if i invested in bitcoin",
    "bitcoin investment calculator",
    "crypto dca backtest",
    "if i invested in crypto calculator",
    "historical crypto returns calculator",
  ],
  alternates: { canonical: absoluteUrl("/investment-calculator") },
  openGraph: {
    type: "website",
    title: "Crypto Investment Calculator — What If You Had Invested?",
    description:
      "Replay a lump sum or a regular buy against real daily prices, across 62 coins. Runs entirely in your browser.",
    url: absoluteUrl("/investment-calculator"),
    images: [ogImage("investment-calculator", "Crypto investment calculator")],
  },
};

export default function Page() {
  const coins = sortedCoins();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">

    <JsonLd data={breadcrumbJsonLd([{ name: "Investment calculator", path: "/investment-calculator" }])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Crypto Investment Calculator",
          applicationCategory: "FinanceApplication",
          operatingSystem: "Any",
          url: absoluteUrl("/investment-calculator"),
          description:
            "Backtest a lump sum or a recurring crypto purchase against real daily price history.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />

      <nav className="mb-5 flex items-center gap-2 text-sm muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-ink">Home</Link>
        <span>/</span>
        <span className="text-[var(--text)]">Investment calculator</span>
      </nav>

      <header>
        <div className="eyebrow">Backtest</div>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          What if you had invested?
        </h1>
        <p className="muted mt-3 max-w-2xl text-lg leading-relaxed">
          Pick a coin, a plan and a starting date, and this replays it against real daily closes —
          including every drawdown you would have had to sit through to get the number at the end.
        </p>
      </header>

      <BacktestApp coins={coinOptions()} />

      <AdSlot slot="backtest-below" className="my-10" />

      <section className="mt-14">
        <h2 className="text-2xl font-extrabold tracking-tight">Per-coin calculators</h2>
        <p className="muted mt-2 text-sm leading-relaxed">
          Each page opens on that asset with its own history already loaded.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {coins.map((coin) => (
            <Link
              key={coin.slug}
              href={`/investment-calculator/${coin.slug}`}
              className="card card-hover flex items-center gap-3 p-4"
            >
              <CoinLogo slug={coin.slug} name={coin.name} symbol={coin.symbol} color={coin.color} size={30} />
              <span>
                <span className="block font-semibold">{coin.name}</span>
                <span className="muted block text-xs">{coin.symbol} investment calculator</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14 max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight">How to read the result</h2>

        <h3 className="mt-6 text-lg font-bold">The drawdown matters more than the final number</h3>
        <p className="muted mt-2 leading-relaxed">
          Almost every long crypto backtest ends in profit, because almost every one of them starts
          before a bull market. The figure worth looking at is the deepest fall along the way. A plan
          that ended up +400% but was down 80% in the middle is only a good plan if you would
          genuinely have held through the 80% — and most people discover that they would not have,
          after they have already sold.
        </p>

        <h3 className="mt-6 text-lg font-bold">Buying regularly and buying once answer different questions</h3>
        <p className="muted mt-2 leading-relaxed">
          A lump sum tells you what one decision on one date produced. Buying regularly spreads the
          entry across every price in the period, which almost always produces a worse number than
          catching the exact bottom and a much better one than catching the exact top. Switch between
          the two on the same dates to see how much of a result was timing rather than the asset.
        </p>

        <h3 className="mt-6 text-lg font-bold">Why the annualised figure changes between the two</h3>
        <p className="muted mt-2 leading-relaxed">
          For a lump sum we show CAGR, which is honest because every dollar was exposed for the whole
          period. For a regular buy that would flatter the result: the money you added last month has
          not had years to compound. So that case reports a money-weighted return instead, which
          discounts each contribution by how long it was actually invested.
        </p>

        <h3 className="mt-6 text-lg font-bold">What this deliberately leaves out</h3>
        <p className="muted mt-2 leading-relaxed">
          Trading fees, spreads, withdrawal fees and tax. All four reduce a real result, and the last
          one can be the largest — if you want that part,{" "}
          <Link href="/crypto-tax-report" className="font-semibold text-brand-ink hover:underline">
            the tax report
          </Link>{" "}
          works out the actual capital gain for your jurisdiction. This page also assumes you bought
          at the daily close and never sold.
        </p>
      </section>
    </div>
  );
}
