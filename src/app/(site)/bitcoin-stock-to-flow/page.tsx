import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, site } from "@/lib/site";
import { ogImage, datasetJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/ads/AdSlot";
import { FaqSection } from "@/components/FaqSection";
import { getStockToFlowStudy, type S2FStudy } from "@/lib/research/btc-stock-to-flow";

const PATH = "/bitcoin-stock-to-flow";
const study = getStockToFlowStudy();

const TITLE = "Bitcoin Stock-to-Flow Model";
const DESCRIPTION = study
  ? `Bitcoin's Stock-to-Flow (S2F) model plots price against scarcity — supply divided by annual issuance, which doubles at every halving. BTC's S2F is ~${Math.round(study.s2f)}; the model price is ${fmt(study.model)} and the actual price is ${Math.round(study.ratioPct)}% of it. From real daily closes. Not financial advice.`
  : "Bitcoin's Stock-to-Flow model — price against scarcity, from real daily closes and the halving schedule.";

function fmt(n: number): string { return n >= 1000 ? `$${Math.round(n).toLocaleString("en-US")}` : `$${n.toFixed(n < 10 ? 2 : 0)}`; }

export const metadata: Metadata = {
  title: study ? `${TITLE} — Price ${Math.round(study.ratioPct)}% of model` : TITLE,
  description: DESCRIPTION,
  keywords: [
    "bitcoin stock to flow",
    "stock to flow model",
    "btc s2f",
    "bitcoin s2f chart",
    "bitcoin scarcity model",
    "stock to flow bitcoin today",
  ],
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: { type: "article", title: TITLE, description: DESCRIPTION, url: absoluteUrl(PATH), images: [ogImage("bitcoin-stock-to-flow", "Bitcoin Stock-to-Flow model")] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const FAQ = [
  { q: "What is the Stock-to-Flow model?", a: "Stock-to-flow (S2F) measures scarcity: the existing supply (stock) divided by how much new supply is created each year (flow). Gold has a high S2F because little new gold is mined relative to what exists. Bitcoin's issuance halves roughly every four years, so its S2F roughly doubles at each halving. The S2F model fits a line between that scarcity ratio and price." },
  { q: "Is the Stock-to-Flow model accurate?", a: "It tracked Bitcoin's price reasonably from 2013 to early 2021, then diverged sharply — price fell far below the model through the 2022 bear market. It is a backward-looking statistical fit, widely criticised for treating a chart correlation as a law. We show the model and the actual price together so the gap is visible. It is not a forecast." },
  { q: "What is Bitcoin's stock-to-flow right now?", a: study ? `As of ${study.end}, Bitcoin's S2F is about ${Math.round(study.s2f)} (post-2024-halving). The fitted model price is ${fmt(study.model)}, and the actual price is ${Math.round(study.ratioPct)}% of that.` : "The current S2F and model price are shown on the chart above when data is available." },
  { q: "How is this chart calculated?", a: `Supply is modelled from Bitcoin's halving schedule (exact at each halving height, interpolated between); flow is the current block reward annualised. We fit ln(price) = a + b·ln(S2F) across our full daily history${study ? ` (${study.start}→${study.end}, r² ${study.r2.toFixed(2)})` : ""} and plot the model against the actual price on a log axis.` },
];

function pageJsonLd() {
  return { "@context": "https://schema.org", "@type": "WebPage", name: TITLE, description: DESCRIPTION, url: absoluteUrl(PATH), isPartOf: { "@type": "WebSite", name: site.name, url: site.url } };
}
function faqJsonLd() {
  return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
}

function Chart({ study }: { study: S2FStudy }) {
  const W = 1000, H = 440, padL = 52, padR = 12, padT = 12, padB = 28;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const s = study.series, N = s.length;
  const lnMin = Math.log(study.priceMin), lnMax = Math.log(study.priceMax);
  const x = (i: number) => padL + (i / (N - 1)) * plotW;
  const y = (v: number) => padT + (1 - (Math.log(Math.max(v, study.priceMin)) - lnMin) / (lnMax - lnMin)) * plotH;
  const line = (key: "price" | "model") => s.map((p, i) => `${i ? "L" : "M"} ${x(i).toFixed(1)} ${y(p[key]).toFixed(1)}`).join(" ");
  const ticks: number[] = [];
  for (let e = 0; e <= 6; e++) { const v = 10 ** e; if (v >= study.priceMin && v <= study.priceMax) ticks.push(v); }
  const years: { i: number; label: string }[] = [];
  let lastYr = "";
  s.forEach((p, i) => { const yr = p.date.slice(0, 4); if (yr !== lastYr && Number(yr) % 2 === 0) { years.push({ i, label: yr }); lastYr = yr; } });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Bitcoin stock-to-flow model vs price, ${study.start} to ${study.end}`}>
      {ticks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={y(v)} x2={W - padR} y2={y(v)} stroke="var(--border)" strokeWidth="1" strokeDasharray="2 4" opacity="0.6" />
          <text x={padL - 6} y={y(v) + 3} textAnchor="end" fontSize="11" fill="var(--muted)">{fmt(v)}</text>
        </g>
      ))}
      {years.map((yr) => <text key={yr.label} x={x(yr.i)} y={H - 8} textAnchor="middle" fontSize="11" fill="var(--muted)">{yr.label}</text>)}
      <path d={line("model")} fill="none" stroke="#e0b400" strokeWidth="2.4" strokeLinejoin="round" />
      <path d={line("price")} fill="none" stroke="var(--text)" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export default function StockToFlowPage() {
  if (!study) {
    return <div className="mx-auto max-w-3xl px-4 py-16"><h1 className="text-3xl font-extrabold">Bitcoin Stock-to-Flow Model</h1><p className="mt-4 muted">Chart data is being prepared.</p></div>;
  }
  const below = study.ratioPct < 100;
  return (
    <>
      <JsonLd data={pageJsonLd()} />
      <JsonLd data={datasetJsonLd({
        name: "Bitcoin Stock-to-Flow model",
        description: "Bitcoin's stock-to-flow ratio (supply ÷ annual issuance) from the halving schedule, with a log-log fitted model price versus the actual price. From daily closes.",
        path: PATH,
        variableMeasured: "Bitcoin stock-to-flow ratio, model price, actual price",
        temporalCoverage: `${study.start}/${study.end}`,
      })} />
      <JsonLd data={faqJsonLd()} />
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Breadcrumbs trail={[{ name: "Bitcoin Stock-to-Flow", path: PATH }]} />
        <header className="mt-4 max-w-3xl">
          <span className="chip">⛏️ Scarcity model</span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Bitcoin Stock-to-Flow Model</h1>
          <p className="mt-4 text-lg muted">
            Scarcity vs price: Bitcoin&apos;s supply divided by its annual issuance, which <strong>doubles at every halving</strong>.
            BTC&apos;s stock-to-flow is now about <strong className="text-brand-ink">{Math.round(study.s2f)}</strong>; the fitted model price is{" "}
            <strong style={{ color: "#e0b400" }}>{fmt(study.model)}</strong>, and the actual price is{" "}
            <strong className="text-brand-ink">{Math.round(study.ratioPct)}%</strong> of it{below ? " — below the model." : " — above the model."}
          </p>
        </header>

        <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]/40 p-4 sm:p-5">
          <Chart study={study} />
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs">
            <span className="inline-flex items-center gap-1.5 muted"><span className="inline-block h-2.5 w-4 rounded-sm" style={{ background: "#e0b400" }} /> S2F model price — {fmt(study.model)}</span>
            <span className="inline-flex items-center gap-1.5 muted"><span className="inline-block h-2.5 w-4 rounded-sm" style={{ background: "var(--text)" }} /> actual price — {fmt(study.price)}</span>
          </div>
          <p className="mt-3 text-xs muted">Daily closes {study.start} → {study.end}. Log-log fit r² = {study.r2.toFixed(2)}. Supply modelled from the halving schedule.</p>
        </div>

        <AdSlot slot="s2f-mid" className="mt-12" />

        <section className="mt-14 max-w-3xl space-y-4">
          <h2 className="text-2xl font-bold">What stock-to-flow means</h2>
          <p className="muted">
            Stock-to-flow is a scarcity ratio borrowed from commodities: the amount that already exists (stock) divided by
            how much is produced each year (flow). A high ratio means new supply is tiny next to the existing pile — the
            classic example is gold. Bitcoin&apos;s issuance is fixed and halves roughly every four years, so with each
            halving the flow drops and the S2F ratio roughly doubles. The model simply asks whether that rising scarcity
            has lined up with price.
          </p>
          <p className="muted">
            From 2013 to early 2021 it lined up strikingly well, which made S2F famous. Then it broke: through the 2022 bear
            market price fell far below the model and has not returned to it. That is the honest story of this chart —
            a correlation that held until it didn&apos;t.
          </p>
          <div className="rounded-xl bg-[var(--bg-subtle)] px-4 py-3 text-sm muted">
            A backward-looking statistical fit, not a law and not a forecast. Scarcity is one input to price, not the only
            one — demand, regulation and liquidity move it too. Not financial advice.
          </div>
        </section>

        <section className="mt-12 max-w-3xl">
          <h2 className="text-2xl font-bold">Related</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Related href="/bitcoin-rainbow-chart" title="Bitcoin Rainbow Chart" desc="Long-term valuation bands, fire-sale to bubble." />
            <Related href="/pi-cycle-top-indicator" title="Pi Cycle Top indicator" desc="The moving-average crossover that marks tops." />
            <Related href="/fear-and-greed-index" title="Fear & Greed Index" desc="Today's crypto market sentiment, 0–100." />
            <Related href="/tools/bitcoin-halving-countdown" title="Bitcoin halving countdown" desc="Time to the next issuance halving." />
          </div>
        </section>

        <div className="mt-12"><FaqSection faq={FAQ} /></div>
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
