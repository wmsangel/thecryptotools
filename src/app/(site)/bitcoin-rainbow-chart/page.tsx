import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, site } from "@/lib/site";
import { ogImage, datasetJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/ads/AdSlot";
import { FaqSection } from "@/components/FaqSection";
import { getRainbowStudy, RAINBOW_BANDS, type RainbowStudy } from "@/lib/research/btc-rainbow";

const PATH = "/bitcoin-rainbow-chart";
const study = getRainbowStudy();

const TITLE = "Bitcoin Rainbow Chart";
const DESCRIPTION = study
  ? `The Bitcoin Rainbow Chart overlays colour-coded valuation bands on a logarithmic regression of Bitcoin's price. BTC is currently in the "${study.bandLabel}" band. Built from real daily closes (${study.start}→${study.end}), updated continuously. Not financial advice.`
  : "A logarithmic-regression band chart of Bitcoin's price — a long-term valuation heuristic from fire-sale to bubble, built from real daily closes.";

export const metadata: Metadata = {
  title: study ? `${TITLE} — BTC in "${study.bandLabel}"` : TITLE,
  description: DESCRIPTION,
  keywords: [
    "bitcoin rainbow chart",
    "btc rainbow chart",
    "bitcoin rainbow price chart",
    "bitcoin logarithmic regression",
    "bitcoin valuation chart",
    "is bitcoin overvalued",
    "bitcoin rainbow chart today",
  ],
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: {
    type: "article",
    title: study ? `${TITLE} — BTC in "${study.bandLabel}"` : TITLE,
    description: DESCRIPTION,
    url: absoluteUrl(PATH),
    images: [ogImage("bitcoin-rainbow-chart", "Bitcoin Rainbow Chart")],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const usd = (n: number) =>
  n >= 1000 ? `$${Math.round(n).toLocaleString("en-US")}` : `$${n.toFixed(n < 10 ? 2 : 0)}`;

const FAQ = [
  {
    q: "What is the Bitcoin Rainbow Chart?",
    a: "It is a long-term valuation chart: a logarithmic regression is fitted through Bitcoin's price history, then colour-coded bands are drawn above and below that centre line, from \"fire sale\" (blue, cheap) to \"maximum bubble\" (red, expensive). Where price sits in the rainbow is a rough gauge of how stretched the market is relative to its own long-term trend.",
  },
  {
    q: "Is the Rainbow Chart a prediction?",
    a: "No. The bands are drawn from past prices, not a forecast, and they shift every time the regression is re-fit with new data. It is a sentiment and valuation heuristic, not a model of where price will go — markets have spent long stretches at the top and bottom of the rainbow.",
  },
  {
    q: "How is this chart calculated?",
    a: `It fits ln(price) against ln(day) by least squares across our full daily BTC history (${study ? `${study.start} to ${study.end}` : "the window we hold"}), then spaces nine bands at fixed multiples around that line on a logarithmic price axis. It is re-fit on every update, so the bands move as new closes arrive.`,
  },
  {
    q: "What band is Bitcoin in now?",
    a: study
      ? `As of ${study.end}, with BTC around ${usd(study.price)}, the price sits in the "${study.bandLabel}" band. That is a description of where price is relative to its long-term log trend, not advice to buy or sell.`
      : "The current band is shown on the chart above when data is available.",
  },
];

function pageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl(PATH),
    isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
  };
}
function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

/** Server-rendered SVG: nine log-spaced colour bands + the price line. */
function RainbowChart({ study }: { study: RainbowStudy }) {
  const W = 1000, H = 440, padL = 52, padR = 12, padT = 12, padB = 28;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const s = study.series;
  const N = s.length;
  const lnMin = Math.log(study.priceMin), lnMax = Math.log(study.priceMax);
  const x = (i: number) => padL + (i / (N - 1)) * plotW;
  const y = (v: number) => padT + (1 - (Math.log(Math.max(v, study.priceMin)) - lnMin) / (lnMax - lnMin)) * plotH;

  // Nine stripes: band k between bounds[k] and (bounds[k+1] | chart top).
  const stripes = RAINBOW_BANDS.map((band, k) => {
    const top = s.map((p, i) => `${x(i).toFixed(1)},${y(p.bounds[k + 1]).toFixed(1)}`);
    const bot = s.map((p, i) => `${x(i).toFixed(1)},${y(p.bounds[k]).toFixed(1)}`).reverse();
    return { color: band.color, points: [...top, ...bot].join(" ") };
  });

  const priceLine = s.map((p, i) => `${i ? "L" : "M"} ${x(i).toFixed(1)} ${y(p.price).toFixed(1)}`).join(" ");

  // y-axis ticks at powers of ten inside the range.
  const ticks: number[] = [];
  for (let e = 0; e <= 6; e++) { const v = 10 ** e; if (v >= study.priceMin && v <= study.priceMax) ticks.push(v); }
  // x-axis year labels.
  const years: { i: number; label: string }[] = [];
  let lastYr = "";
  s.forEach((p, i) => { const yr = p.date.slice(0, 4); if (yr !== lastYr && Number(yr) % 2 === 0) { years.push({ i, label: yr }); lastYr = yr; } });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img"
      aria-label={`Bitcoin rainbow chart, ${study.start} to ${study.end}. BTC currently in the ${study.bandLabel} band.`}>
      {stripes.map((st, k) => <polygon key={k} points={st.points} fill={st.color} opacity="0.82" />)}
      {ticks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={y(v)} x2={W - padR} y2={y(v)} stroke="var(--border)" strokeWidth="1" strokeDasharray="2 4" opacity="0.6" />
          <text x={padL - 6} y={y(v) + 3} textAnchor="end" fontSize="11" fill="var(--muted)">{usd(v)}</text>
        </g>
      ))}
      {years.map((yr) => (
        <text key={yr.label} x={x(yr.i)} y={H - 8} textAnchor="middle" fontSize="11" fill="var(--muted)">{yr.label}</text>
      ))}
      <path d={priceLine} fill="none" stroke="var(--text)" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export default function BitcoinRainbowPage() {
  if (!study) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-extrabold">Bitcoin Rainbow Chart</h1>
        <p className="mt-4 muted">Chart data is being prepared. Please check back shortly.</p>
      </div>
    );
  }
  return (
    <>
      <JsonLd data={pageJsonLd()} />
      <JsonLd data={datasetJsonLd({
        name: "Bitcoin Rainbow Chart bands",
        description: "Bitcoin price with nine logarithmic-regression valuation bands (fire sale to maximum bubble), fitted to daily closes and re-fit on every update.",
        path: PATH,
        variableMeasured: "Bitcoin price and log-regression valuation band",
        temporalCoverage: `${study.start}/${study.end}`,
      })} />
      <JsonLd data={faqJsonLd()} />
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Breadcrumbs trail={[{ name: "Bitcoin Rainbow Chart", path: PATH }]} />

        <header className="mt-4 max-w-3xl">
          <span className="chip">🌈 Long-term valuation band</span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Bitcoin Rainbow Chart</h1>
          <p className="mt-4 text-lg muted">
            Colour-coded valuation bands over a logarithmic regression of Bitcoin&apos;s price — from &quot;fire sale&quot; to
            &quot;maximum bubble.&quot; Right now BTC (~{usd(study.price)}) sits in the{" "}
            <strong style={{ color: study.bandColor }}>{study.bandLabel}</strong> band. Built from real daily closes, re-fit on every update.
          </p>
        </header>

        <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]/40 p-4 sm:p-5">
          <RainbowChart study={study} />
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
            {RAINBOW_BANDS.map((b, k) => (
              <span key={b.label} className={`inline-flex items-center gap-1.5 text-xs ${k === study.bandIndex ? "font-bold text-brand-ink" : "muted"}`}>
                <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: b.color }} />
                {b.label}{k === study.bandIndex ? " ← now" : ""}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs muted">
            Daily closes {study.start} → {study.end}. Log regression fit r² = {study.r2.toFixed(2)}. Source: our own price history.
          </p>
        </div>

        <AdSlot slot="rainbow-mid" className="mt-12" />

        <section className="mt-14 max-w-3xl space-y-4">
          <h2 className="text-2xl font-bold">How to read the rainbow</h2>
          <p className="muted">
            The black line is Bitcoin&apos;s price. The coloured ribbon is a logarithmic regression fitted through the whole
            price history, split into nine bands. When price rides the warm colours near the top, Bitcoin is historically
            expensive relative to its own trend; when it sinks into the cool colours at the bottom, it is historically cheap.
            Each past cycle peaked in the red and bottomed in the blue — which is exactly why the next cycle is never
            guaranteed to.
          </p>
          <p className="muted">
            The important caveat: the bands are not a forecast. They are drawn from past prices and shift every time the
            regression is re-fit, so the rainbow of two years ago is not the rainbow of today. It is a long-term sentiment
            gauge, useful for perspective and position-sizing, not a timing signal.
          </p>
          <div className="rounded-xl bg-[var(--bg-subtle)] px-4 py-3 text-sm muted">
            A heuristic, not advice. The rainbow describes where price sits versus its own history — nothing about a specific
            coin&apos;s future. Do your own research.
          </div>
        </section>

        <section className="mt-12 max-w-3xl">
          <h2 className="text-2xl font-bold">Related</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Related href="/fear-and-greed-index" title="Fear & Greed Index" desc="Today's crypto market sentiment, 0–100." />
            <Related href="/coins/bitcoin/market-cap-calculator" title="Bitcoin market cap calculator" desc="What price BTC needs for any valuation." />
            <Related href="/research/crypto-drawdowns" title="Crypto drawdown study" desc="How deep crashes go, from real closes." />
            <Related href="/tools/dca-calculator" title="DCA calculator" desc="Average in instead of timing the bands." />
          </div>
        </section>

        <div className="mt-12">
          <FaqSection faq={FAQ} />
        </div>
      </div>
    </>
  );
}

function Related({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link href={href} className="block rounded-xl border border-[var(--border)] p-4 transition hover:border-[color:var(--muted)]">
      <div className="font-semibold text-brand-ink">{title} →</div>
      <div className="mt-1 text-sm muted">{desc}</div>
    </Link>
  );
}
