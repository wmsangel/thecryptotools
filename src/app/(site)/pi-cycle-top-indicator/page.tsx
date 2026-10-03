import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, site } from "@/lib/site";
import { ogImage, datasetJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/ads/AdSlot";
import { FaqSection } from "@/components/FaqSection";
import { getPiCycleStudy, type PiCycleStudy } from "@/lib/research/btc-pi-cycle";

const PATH = "/pi-cycle-top-indicator";
const study = getPiCycleStudy();

const TITLE = "Pi Cycle Top Indicator";
const DESCRIPTION = study
  ? `The Bitcoin Pi Cycle Top indicator compares the 111-day moving average with twice the 350-day moving average — a crossover has marked every major cycle top. Right now the 111-DMA is at ${Math.round(study.ratioPct)}% of the 2×350-DMA (${study.firing ? "signal FIRING" : "not firing"}). From real daily closes. Not financial advice.`
  : "Bitcoin's Pi Cycle Top indicator — the 111-day moving average against twice the 350-day, from real daily closes.";

export const metadata: Metadata = {
  title: study ? `${TITLE} — ${study.firing ? "Signal firing" : `${Math.round(study.ratioPct)}% to signal`}` : TITLE,
  description: DESCRIPTION,
  keywords: [
    "pi cycle top",
    "pi cycle top indicator",
    "bitcoin pi cycle",
    "bitcoin cycle top indicator",
    "111 dma 350 dma",
    "bitcoin top signal",
  ],
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: { type: "article", title: TITLE, description: DESCRIPTION, url: absoluteUrl(PATH), images: [ogImage("pi-cycle-top-indicator", "Bitcoin Pi Cycle Top indicator")] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const usd = (n: number) => (n >= 1000 ? `$${Math.round(n).toLocaleString("en-US")}` : `$${n.toFixed(n < 10 ? 2 : 0)}`);

const FAQ = [
  { q: "What is the Pi Cycle Top indicator?", a: "It compares two moving averages of Bitcoin's price: the 111-day simple moving average (111-DMA) and twice the 350-day simple moving average (2×350-DMA). When the faster 111-DMA crosses above the 2×350-DMA, it has historically landed within a few days of Bitcoin's major market-cycle tops in 2013, 2017 and 2021." },
  { q: "Is the Pi Cycle Top a prediction?", a: "No. It is a coincident timing signal drawn from moving averages, and it has only fired a handful of times — a very small sample. It can give false or early signals, and there is no guarantee future cycles repeat the pattern. Treat it as one coarse indicator among many, not a forecast or a sell trigger." },
  { q: "Is the Pi Cycle Top signal firing now?", a: study ? `As of ${study.end}, the 111-DMA is ${usd(study.ma111)} and 2×the 350-DMA is ${usd(study.ma350x2)} — the 111-DMA is at ${Math.round(study.ratioPct)}% of the 2×350-DMA, so the signal is ${study.firing ? "currently firing" : "not firing"}.` : "The current reading is shown on the chart above when data is available." },
  { q: "How is this chart calculated?", a: `From our full daily BTC close history (${study ? `${study.start}→${study.end}` : "the window we hold"}): a 111-day and a 350-day simple moving average, with the 350-day doubled, plotted on a log-price axis. Crossovers are marked. It re-computes on every update.` },
];

function pageJsonLd() {
  return { "@context": "https://schema.org", "@type": "WebPage", name: TITLE, description: DESCRIPTION, url: absoluteUrl(PATH), isPartOf: { "@type": "WebSite", name: site.name, url: site.url } };
}
function faqJsonLd() {
  return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
}

function Chart({ study }: { study: PiCycleStudy }) {
  const W = 1000, H = 440, padL = 52, padR = 12, padT = 12, padB = 28;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const s = study.series, N = s.length;
  const lnMin = Math.log(study.priceMin), lnMax = Math.log(study.priceMax);
  const x = (i: number) => padL + (i / (N - 1)) * plotW;
  const y = (v: number) => padT + (1 - (Math.log(Math.max(v, study.priceMin)) - lnMin) / (lnMax - lnMin)) * plotH;
  const line = (key: "price" | "ma111" | "ma350x2") => s.map((p, i) => `${i ? "L" : "M"} ${x(i).toFixed(1)} ${y(p[key]).toFixed(1)}`).join(" ");

  const ticks: number[] = [];
  for (let e = 0; e <= 6; e++) { const v = 10 ** e; if (v >= study.priceMin && v <= study.priceMax) ticks.push(v); }
  const years: { i: number; label: string }[] = [];
  let lastYr = "";
  s.forEach((p, i) => { const yr = p.date.slice(0, 4); if (yr !== lastYr && Number(yr) % 2 === 0) { years.push({ i, label: yr }); lastYr = yr; } });
  // crossover x-positions (nearest series index at/after the crossover date)
  const crossX = study.crossovers.map((d) => {
    const idx = s.findIndex((p) => p.date >= d);
    return idx < 0 ? null : x(idx);
  }).filter((v): v is number => v != null);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Bitcoin Pi Cycle Top indicator, ${study.start} to ${study.end}`}>
      {ticks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={y(v)} x2={W - padR} y2={y(v)} stroke="var(--border)" strokeWidth="1" strokeDasharray="2 4" opacity="0.6" />
          <text x={padL - 6} y={y(v) + 3} textAnchor="end" fontSize="11" fill="var(--muted)">{usd(v)}</text>
        </g>
      ))}
      {years.map((yr) => <text key={yr.label} x={x(yr.i)} y={H - 8} textAnchor="middle" fontSize="11" fill="var(--muted)">{yr.label}</text>)}
      {crossX.map((cx, k) => (
        <g key={k}>
          <line x1={cx} y1={padT} x2={cx} y2={H - padB} stroke="#e5484d" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.8" />
          <circle cx={cx} cy={padT + 4} r="3.5" fill="#e5484d" />
        </g>
      ))}
      <path d={line("price")} fill="none" stroke="var(--muted)" strokeWidth="1.3" opacity="0.65" />
      <path d={line("ma350x2")} fill="none" stroke="#2563eb" strokeWidth="2" strokeLinejoin="round" />
      <path d={line("ma111")} fill="none" stroke="#f08a24" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export default function PiCyclePage() {
  if (!study) {
    return <div className="mx-auto max-w-3xl px-4 py-16"><h1 className="text-3xl font-extrabold">Pi Cycle Top Indicator</h1><p className="mt-4 muted">Chart data is being prepared.</p></div>;
  }
  return (
    <>
      <JsonLd data={pageJsonLd()} />
      <JsonLd data={datasetJsonLd({
        name: "Bitcoin Pi Cycle Top indicator",
        description: "Bitcoin's 111-day moving average and twice its 350-day moving average, with the dates their crossover has historically marked cycle tops. From daily closes.",
        path: PATH,
        variableMeasured: "Bitcoin price, 111-day MA, 2×350-day MA, top-signal crossovers",
        temporalCoverage: `${study.start}/${study.end}`,
      })} />
      <JsonLd data={faqJsonLd()} />
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Breadcrumbs trail={[{ name: "Pi Cycle Top Indicator", path: PATH }]} />
        <header className="mt-4 max-w-3xl">
          <span className="chip">📈 Bitcoin cycle-top signal</span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Pi Cycle Top Indicator</h1>
          <p className="mt-4 text-lg muted">
            When Bitcoin&apos;s <strong style={{ color: "#f08a24" }}>111-day moving average</strong> crosses above{" "}
            <strong style={{ color: "#2563eb" }}>twice its 350-day moving average</strong>, it has marked every major cycle top so far.
            Right now the 111-DMA is at <strong className="text-brand-ink">{Math.round(study.ratioPct)}%</strong> of the 2×350-DMA —{" "}
            {study.firing ? "the signal is firing." : "the signal is not firing."}
          </p>
        </header>

        <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]/40 p-4 sm:p-5">
          <Chart study={study} />
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs">
            <span className="inline-flex items-center gap-1.5 muted"><span className="inline-block h-2.5 w-4 rounded-sm" style={{ background: "#f08a24" }} /> 111-DMA — {usd(study.ma111)}</span>
            <span className="inline-flex items-center gap-1.5 muted"><span className="inline-block h-2.5 w-4 rounded-sm" style={{ background: "#2563eb" }} /> 2×350-DMA — {usd(study.ma350x2)}</span>
            <span className="inline-flex items-center gap-1.5 muted"><span className="inline-block h-2.5 w-4 rounded-sm" style={{ background: "#e5484d" }} /> top signal</span>
          </div>
          <p className="mt-3 text-xs muted">Daily closes {study.start} → {study.end}. Past signals: {study.crossovers.length ? study.crossovers.join(", ") : "none in window"}.</p>
        </div>

        <AdSlot slot="picycle-mid" className="mt-12" />

        <section className="mt-14 max-w-3xl space-y-4">
          <h2 className="text-2xl font-bold">How the Pi Cycle Top works</h2>
          <p className="muted">
            Two moving averages, one fast and one slow. The <strong>111-day</strong> MA reacts quickly to a rally; the{" "}
            <strong>350-day</strong> MA, doubled, is a slow ceiling. In a parabolic blow-off the fast line races up and
            catches the slow one — and historically, the moment it crossed above marked the top of the cycle within days.
            The name comes from the ratio 350/111 ≈ 3.153, close to π.
          </p>
          <p className="muted">
            It has fired only a few times in Bitcoin&apos;s history, which is both why it looks uncanny and why you should be
            careful: a handful of hits is a tiny sample, and an indicator that has &quot;never been wrong&quot; across three
            events can still be wrong on the fourth. It says nothing about bottoms, and nothing at all about altcoins.
          </p>
          <div className="rounded-xl bg-[var(--bg-subtle)] px-4 py-3 text-sm muted">
            A coarse timing signal, not advice. It describes moving-average geometry, not value — use it for perspective, not as a sell button.
          </div>
        </section>

        <section className="mt-12 max-w-3xl">
          <h2 className="text-2xl font-bold">Related</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Related href="/bitcoin-rainbow-chart" title="Bitcoin Rainbow Chart" desc="Long-term valuation bands, fire-sale to bubble." />
            <Related href="/fear-and-greed-index" title="Fear & Greed Index" desc="Today's crypto market sentiment, 0–100." />
            <Related href="/research/crypto-drawdowns" title="Crypto drawdown study" desc="How deep cycle crashes go, from real closes." />
            <Related href="/coins/bitcoin/market-cap-calculator" title="Bitcoin market cap calculator" desc="Price BTC needs for any valuation." />
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
