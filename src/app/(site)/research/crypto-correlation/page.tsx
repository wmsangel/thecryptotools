import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, site } from "@/lib/site";
import { breadcrumbJsonLd, ogImage } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/ads/AdSlot";
import { FaqSection } from "@/components/FaqSection";
import { CorrelationHeatmap } from "@/components/portfolio/CorrelationHeatmap";
import { getCorrelationStudy } from "@/lib/research/crypto-correlation";

const PATH = "/research/crypto-correlation";
const TITLE = "How Correlated Is the Crypto Market? A Data Study";

const study = getCorrelationStudy();
const rho = study ? study.rho.toFixed(2) : "0.80";

const DESCRIPTION = study
  ? `The ${study.assetCount} largest cryptocurrencies moved together with an average pairwise correlation of ${rho} over the last year — computed from real daily closes. What that means for whether a crypto portfolio is actually diversified.`
  : "How closely the largest cryptocurrencies actually move together, computed from real daily closes.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "crypto correlation",
    "cryptocurrency correlation",
    "are cryptocurrencies correlated",
    "bitcoin ethereum correlation",
    "crypto diversification",
    "crypto correlation study",
    "crypto market data",
  ],
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: {
    type: "article",
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl(PATH),
    images: [ogImage("research/crypto-correlation", "How correlated is the crypto market?")],
  },
};

const pct = (n: number, d = 1) => n.toLocaleString("en-US", { maximumFractionDigits: d });

export default function Page() {
  if (!study) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-extrabold">Crypto correlation study</h1>
        <p className="muted mt-4">The dataset is being rebuilt. Please check back shortly.</p>
      </div>
    );
  }

  const oneY = study.windows[0];
  const longest = study.windows[study.windows.length - 1];
  const updated = study.through;

  const citation = `TheCryptoTools (${updated.slice(0, 4)}). How Correlated Is the Crypto Market? Retrieved from ${absoluteUrl(PATH)}`;

  const FAQS = [
    {
      q: "Are cryptocurrencies correlated with each other?",
      a: `Strongly. Over the last year the ${study.assetCount} largest crypto assets moved with an average pairwise correlation of ${rho} — where 1.0 is lockstep and 0 is unrelated. In practice the market trades far more like one asset than like ${study.assetCount} independent ones.`,
    },
    {
      q: "Does holding many coins diversify a crypto portfolio?",
      a: `Much less than most people assume. At a correlation of ${rho}, an equal split of ${study.assetCount} of these coins is only about ${pct(study.tenAssetReductionPct)}% less volatile than holding one of them. Even an infinite number of equally correlated coins would cut volatility by at most ${pct(study.ceilingReductionPct)}% — that is the mathematical ceiling, √ρ.`,
    },
    {
      q: "Which crypto pair is most and least correlated?",
      a: oneY.highest && oneY.lowest
        ? `Over the last year the most alike pair was ${oneY.highest.a}/${oneY.highest.b} at ${oneY.highest.value.toFixed(2)}, and the least alike was ${oneY.lowest.a}/${oneY.lowest.b} at ${oneY.lowest.value.toFixed(2)}. Even the least correlated major pair is far above zero.`
        : "See the matrix above for every pair.",
    },
    {
      q: "Do these correlations hold in a crash?",
      a: "No — and that is the most important caveat. Correlations rise sharply in a sell-off: coins that drift apart in calm markets tend to fall together in a bad week, exactly when the diversification was supposed to help. Treat a low correlation as a fair-weather property, not a guarantee.",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <JsonLd data={breadcrumbJsonLd([
        { name: "Research", path: "/research" },
        { name: "Crypto correlation", path: PATH },
      ])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "Crypto market pairwise correlation",
          description: `Pairwise Pearson correlation of daily returns for the ${study.assetCount} largest cryptocurrencies over 1, 3 and 5 year windows, through ${updated}.`,
          url: absoluteUrl(PATH),
          creator: { "@type": "Organization", name: site.organization.name, url: site.url },
          license: "https://creativecommons.org/licenses/by/4.0/",
          isAccessibleForFree: true,
          temporalCoverage: `${longest.from}/${oneY.to}`,
          variableMeasured: "Pearson correlation of daily returns",
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: TITLE,
          description: DESCRIPTION,
          datePublished: "2026-08-17",
          dateModified: updated,
          author: { "@type": "Organization", name: site.organization.name, url: site.url },
          publisher: { "@type": "Organization", name: site.organization.name, url: site.url },
          mainEntityOfPage: absoluteUrl(PATH),
          image: ogImage("research/crypto-correlation", TITLE).url,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />

      <nav className="mb-5 flex items-center gap-2 text-sm muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-ink">Home</Link>
        <span>/</span>
        <Link href="/research" className="hover:text-brand-ink">Research</Link>
        <span>/</span>
        <span className="text-[var(--text)]">Crypto correlation</span>
      </nav>

      <header>
        <div className="eyebrow">Data study · updated {updated}</div>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          How correlated is the crypto market?
        </h1>
        <p className="muted mt-4 text-lg leading-relaxed">
          We measured how closely the {study.assetCount} largest cryptocurrencies actually moved
          together, using real daily closes rather than intuition. The short answer: far more than a
          diversified portfolio would like.
        </p>
      </header>

      {/* headline stat */}
      <div className="mt-8 rounded-2xl border border-brand-500/30 bg-brand-500/5 p-6 sm:p-8">
        <div className="text-5xl font-extrabold tracking-tight text-brand-ink sm:text-6xl">{rho}</div>
        <p className="mt-2 max-w-2xl text-lg font-medium">
          average pairwise correlation of the {study.assetCount} largest cryptocurrencies over the last
          year, on a scale where 1.0 is lockstep and 0 is unrelated.
        </p>
      </div>

      {/* key findings */}
      <section className="mt-12">
        <h2 className="text-2xl font-extrabold tracking-tight">Key findings</h2>
        <ul className="mt-5 space-y-3">
          {[
            `The ${study.assetCount} biggest cryptocurrencies averaged a ${rho} pairwise correlation over the last year (${oneY.days} trading days). The market trades much more like one asset than like ${study.assetCount}.`,
            oneY.highest && oneY.lowest
              ? `The most alike pair was ${oneY.highest.a}/${oneY.highest.b} at ${oneY.highest.value.toFixed(2)}; even the least alike, ${oneY.lowest.a}/${oneY.lowest.b}, sat at ${oneY.lowest.value.toFixed(2)} — far from independent.`
              : "",
            longest.label !== oneY.label
              ? `Over ${longest.label.toLowerCase()} the average was ${longest.average.toFixed(2)}, so this is not a one-year fluke — the assets have moved together for years.`
              : "",
            `Diversification ceiling: at ${rho} correlation, an equal split of all ${study.assetCount} is only ~${pct(study.tenAssetReductionPct)}% less volatile than holding one. The absolute floor, even with infinite coins, is ~${pct(study.ceilingReductionPct)}% (√ρ).`,
            `Were they uncorrelated instead, those same ${study.assetCount} coins would cut volatility by ~${pct(study.uncorrelatedReductionPct)}% — the gap between that and ${pct(study.tenAssetReductionPct)}% is what correlation quietly costs a "diversified" bag.`,
            `Most volatile of the group: ${study.mostVolatile.symbol} at ~${pct(study.mostVolatile.vol, 0)}% annualised; calmest: ${study.leastVolatile.symbol} at ~${pct(study.leastVolatile.vol, 0)}%. Deepest crash in our data: ${study.deepestCrash.symbol}, ${pct(study.deepestCrash.depthPct)}% from peak.`,
          ]
            .filter(Boolean)
            .map((t, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-1 select-none text-brand-ink" aria-hidden>▸</span>
                <span className="leading-relaxed">{t}</span>
              </li>
            ))}
        </ul>
      </section>

      {/* heatmap */}
      <section className="mt-12">
        <h2 className="text-2xl font-extrabold tracking-tight">The matrix</h2>
        <p className="muted mt-2 leading-relaxed">
          Every pair of the {study.assetCount} majors over the last year, from daily returns. Deeper
          colour is a tighter link. There is nowhere in this grid that two of these assets genuinely go
          their own way.
        </p>
        <div className="mt-5">
          <CorrelationHeatmap
            matrix={study.headlineMatrix}
            caption={`Pairwise correlation, ${oneY.from} to ${oneY.to} (${oneY.days} trading days).`}
          />
        </div>
      </section>

      <AdSlot slot="research-below" className="my-10" />

      {/* diversification ceiling */}
      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight">Why more coins barely helps</h2>
        <p className="muted mt-2 leading-relaxed">
          Diversification only removes the risk that assets do <em>not</em> share. For equal-weight
          holdings that all correlate at ρ, a portfolio&apos;s volatility relative to a single asset is
          √(1/N + (1−1/N)·ρ). As you add coins the 1/N term shrinks toward zero, but the (1−1/N)·ρ term
          does not — it converges on ρ. So the most volatility any number of these coins can ever remove
          is 1 − √ρ, and at {rho} that ceiling is about {pct(study.ceilingReductionPct)}%.
        </p>
        <div className="mt-5 overflow-x-auto" tabIndex={0} role="group" aria-label="Diversification by correlation">
          <table className="w-full min-w-[26rem] text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="py-2 pr-3 font-semibold">If the {study.assetCount} coins correlated at…</th>
                <th className="py-2 pr-3 font-semibold">Volatility cut vs one coin</th>
              </tr>
            </thead>
            <tbody>
              {[0, 0.2, 0.4, 0.6, Number(rho), 0.9].sort((a, b) => a - b).map((r) => {
                const cut = (1 - Math.sqrt(1 / study.assetCount + (1 - 1 / study.assetCount) * r)) * 100;
                const isReal = Math.abs(r - study.rho) < 0.005;
                return (
                  <tr key={r} className={`border-b border-[var(--border)] last:border-0 ${isReal ? "bg-brand-500/5" : ""}`}>
                    <td className="py-2 pr-3">
                      {r.toFixed(2)}
                      {isReal && <span className="ml-2 text-xs font-semibold text-brand-ink">← crypto today</span>}
                    </td>
                    <td className="py-2 pr-3 font-semibold">{pct(cut)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="muted mt-3 text-xs">
          Assumes equal weights and equal volatilities — a simplification, but the direction is right and
          the ceiling is real. The interactive tool below uses each asset&apos;s true covariance.
        </p>
      </section>

      {/* methodology */}
      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight">Methodology</h2>
        <ul className="muted mt-4 space-y-2 leading-relaxed">
          <li>
            <strong className="text-[var(--text)]">Data:</strong> our own daily closing prices for the{" "}
            {study.assetCount} assets, through {updated}. Correlations use the {oneY.days}-day window for
            the headline figure; the {longest.label.toLowerCase()} window is shown for context.
          </li>
          <li>
            <strong className="text-[var(--text)]">Method:</strong> Pearson correlation of daily{" "}
            <em>returns</em>, not prices — two assets in a shared uptrend have correlated price levels
            almost by definition, so measuring levels would overstate the link.
          </li>
          <li>
            <strong className="text-[var(--text)]">Windows:</strong> each window uses only assets that
            existed for all of it; a coin younger than the window is dropped, never back-filled.
          </li>
          <li>
            <strong className="text-[var(--text)]">Volatility &amp; drawdown</strong> figures are
            annualised standard deviation of daily returns and peak-to-trough falls, bounded by the data
            we hold — not all-time claims.
          </li>
        </ul>
      </section>

      {/* cite this */}
      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight">Cite or share this study</h2>
        <p className="muted mt-2 leading-relaxed">
          The figures update as new data comes in. If you use them, a link back to this page keeps the
          citation live and lets your readers see the current numbers.
        </p>
        <blockquote className="mt-4 rounded-xl border-l-4 border-brand-500 bg-[var(--bg-elevated)] px-4 py-3 text-sm">
          {citation}
        </blockquote>
        <p className="muted mt-3 text-sm">
          Prefer an interactive version your readers can play with? The{" "}
          <Link href="/portfolio/correlation" className="font-semibold text-brand-ink hover:underline">
            correlation matrix tool
          </Link>{" "}
          lets anyone pick their own coins and windows, and the{" "}
          <Link href="/widgets" className="font-semibold text-brand-ink hover:underline">
            embeddable widgets
          </Link>{" "}
          can drop a live calculator straight into an article.
        </p>
      </section>

      <FaqSection faq={FAQS} />

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold tracking-tight">Related</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: "/portfolio/correlation", title: "Correlation matrix tool", note: "Pick your own coins and windows" },
            { href: "/portfolio", title: "Portfolio analyzer", note: "Backtest a mix with rebalancing" },
            { href: "/guides/crypto-portfolio-diversification", title: "Diversification guide", note: "The maths in plain English" },
          ].map((r) => (
            <Link key={r.href} href={r.href} className="card card-hover p-4">
              <span className="block font-semibold">{r.title}</span>
              <span className="muted mt-0.5 block text-xs">{r.note}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
