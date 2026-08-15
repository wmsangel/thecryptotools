import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/site";
import { breadcrumbJsonLd, ogImage } from "@/lib/seo";
import { historyThrough } from "@/lib/backtest/history-index";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/ads/AdSlot";
import { FaqSection } from "@/components/FaqSection";
import { CorrelationHeatmap } from "@/components/portfolio/CorrelationHeatmap";
import { buildCorrelation, CORRELATION_WINDOWS } from "@/lib/portfolio/build-data";
import { portfolioCoinOptions } from "../options";
import { CorrelationExplorer } from "./CorrelationExplorer";

/**
 * The assets in the pre-rendered tables.
 *
 * Ten, not sixty: a 62×62 grid is 3,844 numbers and answers nothing, while ten
 * columns still fit on a phone in landscape and cover what most portfolios are
 * actually made of. Anyone whose holdings are not here has the picker below.
 */
const HEADLINE_ASSETS = [
  "bitcoin",
  "ethereum",
  "xrp",
  "bnb",
  "solana",
  "dogecoin",
  "cardano",
  "chainlink",
  "litecoin",
  "polkadot",
];

const TITLE = "Crypto Correlation Matrix — Which Coins Actually Move Apart";
const DESCRIPTION =
  "Live-updated correlation matrix for the major crypto assets over 1, 3 and 5 years, computed from real daily closes. Find out whether your portfolio is diversified or one bet written six times.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "crypto correlation matrix",
    "bitcoin ethereum correlation",
    "cryptocurrency correlation",
    "crypto correlation chart",
    "altcoin correlation to bitcoin",
    "least correlated cryptocurrencies",
  ],
  alternates: { canonical: absoluteUrl("/portfolio/correlation") },
  openGraph: {
    type: "website",
    title: TITLE,
    description:
      "How closely the major crypto assets moved together over 1, 3 and 5 years, from real daily closes.",
    url: absoluteUrl("/portfolio/correlation"),
    images: [ogImage("portfolio/correlation", "Crypto correlation matrix")],
  },
};

const FAQS = [
  {
    q: "What counts as a high correlation?",
    a: "Above roughly 0.8 the two assets are close to interchangeable for risk purposes — holding both is holding one position in a larger size. Between 0.5 and 0.8 there is some separation but not much. Below 0.3 you have genuinely different exposures. Most large-cap crypto pairs sit in the 0.6 to 0.9 band, which is why crypto portfolios are usually far less diversified than the number of tickers in them suggests.",
  },
  {
    q: "Why is it computed on returns rather than prices?",
    a: "Because two assets in the same multi-year uptrend have correlated price levels almost by definition, which makes a correlation quoted off price charts close to meaningless. What a holder needs to know is whether the two fall on the same days, and that is a question about daily returns.",
  },
  {
    q: "Why do some assets disappear from the longer windows?",
    a: "Because they are younger than the window. Measuring a two-year-old asset over a five-year table would put a different period in the same grid, and the pair that then looked least correlated would just be the one measured over different years. Anything dropped is named under the table.",
  },
  {
    q: "Do these numbers hold in a crash?",
    a: "No, and this is the most important caveat on the page. Correlations rise sharply in a sell-off: assets that drift apart in calm markets tend to fall together in a bad week, which is exactly when the diversification was supposed to help. Treat a low correlation as a fair-weather property, not a guarantee.",
  },
  {
    q: "How often is this updated?",
    a: `It is recomputed from the price snapshot every time the site is rebuilt, and that snapshot currently runs to ${historyThrough}. The date on each table is the real end of the data, not the date you happen to be reading it.`,
  },
];

export default function Page() {
  const coins = portfolioCoinOptions();
  const available = new Set(coins.map((c) => c.slug));
  const assets = HEADLINE_ASSETS.filter((slug) => available.has(slug));

  const tables = CORRELATION_WINDOWS.map((window) =>
    buildCorrelation(assets, historyThrough, window),
  ).filter((t): t is NonNullable<typeof t> => t !== null);

  const headline = tables[0];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Portfolio analyzer", path: "/portfolio" },
          { name: "Correlation matrix", path: "/portfolio/correlation" },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "Crypto asset correlation matrix",
          description:
            "Pairwise Pearson correlation of daily returns for major crypto assets, over 1, 3 and 5 year windows.",
          url: absoluteUrl("/portfolio/correlation"),
          temporalCoverage: headline ? `${headline.matrix.from}/${headline.matrix.to}` : undefined,
          isAccessibleForFree: true,
          creator: { "@type": "Organization", name: "TheCryptoTools" },
        }}
      />

      <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-ink">Home</Link>
        <span>/</span>
        <Link href="/portfolio" className="hover:text-brand-ink">Portfolio analyzer</Link>
        <span>/</span>
        <span className="text-[var(--text)]">Correlation matrix</span>
      </nav>

      <header>
        <div className="eyebrow">Correlation</div>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Crypto correlation matrix
        </h1>
        <p className="muted mt-3 max-w-2xl text-lg leading-relaxed">
          How closely the major crypto assets actually moved together, from real daily closes
          through {historyThrough}. If you hold six coins and they all sit above 0.8, you hold one
          position in six wrappers.
        </p>
      </header>

      {headline && (
        <section className="mt-8">
          <div className="card p-6 sm:p-7">
            <h2 className="text-lg font-bold">The short version</h2>
            <p className="mt-2 text-sm leading-relaxed">
              Over the last year these {headline.matrix.symbols.length} assets correlated at an
              average of <strong>{headline.matrix.average.toFixed(2)}</strong>.
              {headline.matrix.highest && (
                <>
                  {" "}
                  The closest pair was {headline.matrix.highest.a} and {headline.matrix.highest.b} at{" "}
                  {headline.matrix.highest.value.toFixed(2)}
                </>
              )}
              {headline.matrix.lowest && (
                <>
                  , and the least alike were {headline.matrix.lowest.a} and{" "}
                  {headline.matrix.lowest.b} at {headline.matrix.lowest.value.toFixed(2)}
                </>
              )}
              . A pair at 0.90 gives you almost no diversification; a pair at 0.40 gives you real
              separation — though see the crash caveat below before relying on it.
            </p>
          </div>
        </section>
      )}

      {tables.map(({ window, matrix, excluded }) => (
        <section key={window.id} className="mt-10">
          <h2 className="text-2xl font-extrabold tracking-tight">{window.label}</h2>
          <p className="muted mt-1 text-sm leading-relaxed">
            {window.note} Average pairwise correlation{" "}
            <strong className="text-[var(--text)]">{matrix.average.toFixed(2)}</strong> across{" "}
            {matrix.symbols.length} assets.
          </p>
          <CorrelationHeatmap matrix={matrix} />
          {excluded.length > 0 && (
            <p className="muted mt-2 text-xs leading-relaxed">
              Not old enough for this window:{" "}
              {excluded.map((e) => `${e.symbol} (from ${e.start})`).join(", ")}.
            </p>
          )}
        </section>
      ))}

      <CorrelationExplorer coins={coins} initial={assets.slice(0, 5)} through={historyThrough} />

      <AdSlot slot="correlation-below" className="my-10" />

      <section className="mt-14 max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight">How to use this</h2>

        <h3 className="mt-6 text-lg font-bold">Count your real positions, not your tickers</h3>
        <p className="muted mt-2 leading-relaxed">
          A portfolio of eight assets that all correlate above 0.8 behaves roughly like one or two
          independent positions. That is not automatically wrong — plenty of people are deliberately
          long the whole asset class — but it is worth knowing, because the risk is being taken
          whether or not it was chosen. The{" "}
          <Link href="/portfolio" className="font-semibold text-brand-ink hover:underline">
            portfolio analyzer
          </Link>{" "}
          turns this into the number that matters: how much calmer the combination actually was than
          its parts.
        </p>

        <h3 className="mt-6 text-lg font-bold">Low correlation is a fair-weather property</h3>
        <p className="muted mt-2 leading-relaxed">
          Correlations rise in a sell-off. Two assets that spent a quiet year at 0.4 will often
          spend a bad week at 0.9, because in a liquidation everything is sold to raise the same
          dollars. Any diversification you are counting on is weakest exactly when it is needed, so
          size positions for the crash correlation rather than the calm one.
        </p>

        <h3 className="mt-6 text-lg font-bold">Stablecoins and cash are the honest diversifier</h3>
        <p className="muted mt-2 leading-relaxed">
          Nothing in this table is a hedge against crypto — every asset on it is crypto. If the goal
          is to reduce the swing rather than to change which coin drives it, the only lever with a
          reliable effect is holding less of the whole thing. That is unglamorous, and it works
          where a rearranged altcoin mix does not.
        </p>
      </section>

      <FaqSection faq={FAQS} />

      <section className="mt-14">
        <h2 className="text-2xl font-extrabold tracking-tight">Related</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              href: "/portfolio",
              title: "Portfolio analyzer",
              note: "Backtest the whole mix, not just the pairs",
            },
            {
              href: "/guides/crypto-portfolio-diversification",
              title: "What these numbers mean",
              note: "Why ten coins at 0.80 behave like one bet",
            },
            {
              href: "/tools/portfolio-volatility-calculator",
              title: "Portfolio volatility calculator",
              note: "Feed these correlations into a risk number",
            },
            {
              href: "/tools/portfolio-rebalance-calculator",
              title: "Rebalance calculator",
              note: "What to trade to get back to target",
            },
            {
              href: "/guides/understanding-sharpe-ratio",
              title: "Sharpe ratio explained",
              note: "What “return per unit of risk” actually means",
            },
            {
              href: "/investment-calculator",
              title: "What if you had invested?",
              note: "One asset, replayed against real prices",
            },
            {
              href: "/tools/max-drawdown-calculator",
              title: "Max drawdown calculator",
              note: "The fall you would have had to sit through",
            },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="card card-hover p-4">
              <span className="block font-semibold">{item.title}</span>
              <span className="muted mt-0.5 block text-xs">{item.note}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
