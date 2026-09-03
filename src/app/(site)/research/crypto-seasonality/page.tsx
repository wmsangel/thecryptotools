import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, site } from "@/lib/site";
import { ogImage } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/ads/AdSlot";
import { FaqSection } from "@/components/FaqSection";
import { getSeasonalityStudy } from "@/lib/research/crypto-seasonality";

const PATH = "/research/crypto-seasonality";
const TITLE = "Crypto Seasonality: The Best and Worst Months, Measured";

const study = getSeasonalityStudy();

const DESCRIPTION = study
  ? `Is September really bad for crypto and Q4 really good? Bitcoin's strongest month over ${study.years} years is ${study.bitcoin.best.name} (avg ${study.bitcoin.best.avgReturn >= 0 ? "+" : ""}${Math.round(study.bitcoin.best.avgReturn)}%) and its weakest is ${study.bitcoin.worst.name}. The monthly numbers for Bitcoin and the 10 largest coins, from real daily closes.`
  : "Average crypto return by calendar month for Bitcoin and the largest coins, from real daily closes.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "crypto seasonality",
    "bitcoin seasonality",
    "best month for bitcoin",
    "worst month for crypto",
    "bitcoin monthly returns",
    "is september bad for crypto",
    "uptober bitcoin",
  ],
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: {
    type: "article",
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl(PATH),
    images: [ogImage("research/crypto-seasonality", "Crypto seasonality: best and worst months")],
  },
};

/** Signed percentage, e.g. "+36.5%" / "−1.4%". */
function signed(n: number, d = 1): string {
  const s = n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  return n >= 0 ? `+${s}%` : `${s.replace("-", "−")}%`;
}
const round = (n: number) => Math.round(n);

export default function Page() {
  if (!study) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-extrabold">Crypto seasonality study</h1>
        <p className="muted mt-4">The dataset is being rebuilt. Please check back shortly.</p>
      </div>
    );
  }

  const updated = study.through;
  const { bitcoin: btc, majors } = study;
  const citation = `TheCryptoTools (${updated.slice(0, 4)}). Crypto Seasonality: The Best and Worst Months. Retrieved from ${absoluteUrl(PATH)}`;
  const sep = btc.months[8]; // September
  const oct = btc.months[9]; // October

  const FAQS = [
    {
      q: "What is the best month for Bitcoin historically?",
      a: `Over ${study.years} years of daily closes, ${btc.best.name} has been Bitcoin's strongest calendar month, averaging ${signed(btc.best.avgReturn)} month-over-month, with ${round(btc.best.positiveRate)}% of those months closing green. Averages are pulled up by crypto's early explosive years, so treat them as a tendency, not a forecast.`,
    },
    {
      q: "Is September really bad for crypto?",
      a: `It has been the softest patch for Bitcoin: ${sep.name} averaged ${signed(sep.avgReturn)} and closed green only ${round(sep.positiveRate)}% of years. Across the ${majors.assetCount} largest coins the weakest month was ${majors.worst.name} (${signed(majors.worst.avgReturn)}). The mid-year lull is real in the data — but it is a tendency across a small number of years, not a rule.`,
    },
    {
      q: "Is 'Uptober' a real thing?",
      a: `In the data, yes-ish: ${oct.name} averaged ${signed(oct.avgReturn)} for Bitcoin with ${round(oct.positiveRate)}% of years green, and the fourth quarter is historically its strongest stretch. As always, a handful of large years drive the average, so it is a pattern worth knowing rather than a trade to bet the farm on.`,
    },
    {
      q: "Can I trade crypto seasonality?",
      a: "Cautiously, if at all. Seasonality is a weak, backward-looking signal built on relatively few years, and one outlier month can move a whole average. It is more useful for setting expectations — knowing the mid-year is often quiet and Q4 often lively — than as a standalone trading strategy. This is general information, not financial advice.",
    },
  ];

  const monthCell = (v: number) =>
    v > 0 ? "text-gain" : v < 0 ? "text-loss" : "";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "Crypto seasonality — average return by calendar month",
          description: `Mean month-over-month return and positive-rate by calendar month for Bitcoin (${study.years} years) and the ${majors.assetCount} largest cryptocurrencies, from daily closes through ${updated}.`,
          url: absoluteUrl(PATH),
          creator: { "@type": "Organization", name: site.organization.name, url: site.url },
          license: "https://creativecommons.org/licenses/by/4.0/",
          isAccessibleForFree: true,
          variableMeasured: "Average monthly return, positive-rate by calendar month",
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: TITLE,
          description: DESCRIPTION,
          datePublished: "2026-09-03",
          dateModified: updated,
          author: { "@type": "Organization", name: site.organization.name, url: site.url },
          publisher: {
            "@type": "Organization",
            name: site.organization.name,
            url: site.url,
            logo: { "@type": "ImageObject", url: absoluteUrl(site.organization.logo) },
          },
          mainEntityOfPage: absoluteUrl(PATH),
          image: ogImage("research/crypto-seasonality", TITLE).url,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />

      <Breadcrumbs
        trail={[
          { name: "Research", path: "/research" },
          { name: "Crypto seasonality", path: PATH },
        ]}
      />

      <header>
        <div className="eyebrow">Data study · updated <time dateTime={updated}>{updated}</time></div>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Crypto seasonality: the best and worst months
        </h1>
        <p className="muted mt-4 text-lg leading-relaxed">
          &quot;September is bad, Q4 is good&quot; is repeated every year. We measured it: the average
          return of each calendar month for Bitcoin over {study.years} years and for the{" "}
          {majors.assetCount} largest cryptocurrencies, from real daily closes.
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-brand-500/30 bg-brand-500/5 p-6">
          <div className="eyebrow">Bitcoin&apos;s strongest month</div>
          <div className="mt-1 text-4xl font-extrabold tracking-tight text-brand-ink">{btc.best.name}</div>
          <p className="mt-1 text-sm font-medium">avg {signed(btc.best.avgReturn)} · green {round(btc.best.positiveRate)}% of years</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6">
          <div className="eyebrow">Bitcoin&apos;s weakest month</div>
          <div className="mt-1 text-4xl font-extrabold tracking-tight">{btc.worst.name}</div>
          <p className="mt-1 text-sm font-medium">avg {signed(btc.worst.avgReturn)} · green {round(btc.worst.positiveRate)}% of years</p>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold tracking-tight">Key findings</h2>
        <ul className="mt-5 space-y-3">
          {[
            `Bitcoin's strongest calendar month over ${study.years} years is ${btc.best.name} (avg ${signed(btc.best.avgReturn)}); its weakest is ${btc.worst.name} (${signed(btc.worst.avgReturn)}).`,
            `The fourth quarter carries the year: ${oct.name} averages ${signed(oct.avgReturn)} for Bitcoin, and ${btc.months[10].name} ${signed(btc.months[10].avgReturn)}.`,
            `The mid-year is the soft patch — ${sep.name} is green only ${round(sep.positiveRate)}% of years for Bitcoin, and across the ${majors.assetCount} majors the weakest month is ${majors.worst.name} (${signed(majors.worst.avgReturn)}, green just ${round(majors.worst.positiveRate)}% of the time).`,
            `It is not only a Bitcoin quirk: pooled across the ${majors.assetCount} largest coins, the strongest month is ${majors.best.name} (${signed(majors.best.avgReturn)}) and the weakest is ${majors.worst.name}.`,
            `Averages are skewed up by crypto's early explosive years, which is why the positive-rate — how often a month was actually green — matters as much as the mean.`,
          ].map((t, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-1 select-none text-brand-ink" aria-hidden>▸</span>
              <span className="leading-relaxed">{t}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold tracking-tight">Every month, measured</h2>
        <p className="muted mt-2 leading-relaxed">
          Average month-over-month return and how often the month closed green, for Bitcoin and for the{" "}
          {majors.assetCount} largest coins pooled together.
        </p>
        <div className="mt-5 overflow-x-auto" tabIndex={0} role="group" aria-label="Crypto seasonality table">
          <table className="w-full min-w-[40rem] text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="py-2 pr-3 font-semibold">Month</th>
                <th className="py-2 pr-3 font-semibold">BTC avg</th>
                <th className="py-2 pr-3 font-semibold">BTC green</th>
                <th className="py-2 pr-3 font-semibold">Majors avg</th>
                <th className="py-2 pr-3 font-semibold">Majors green</th>
              </tr>
            </thead>
            <tbody>
              {btc.months.map((m, i) => {
                const mj = majors.months[i];
                return (
                  <tr key={m.month} className="border-b border-[var(--border)] last:border-0">
                    <td className="py-2 pr-3 font-semibold">{m.name}</td>
                    <td className={`py-2 pr-3 ${monthCell(m.avgReturn)}`}>{signed(m.avgReturn)}</td>
                    <td className="py-2 pr-3">{round(m.positiveRate)}%</td>
                    <td className={`py-2 pr-3 ${monthCell(mj.avgReturn)}`}>{signed(mj.avgReturn)}</td>
                    <td className="py-2 pr-3">{round(mj.positiveRate)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="muted mt-3 text-xs">
          &quot;Green&quot; is the share of years that month closed higher than the previous month-end.
          Bitcoin spans {study.years} years; the majors pool covers a shorter history for the newer coins,
          so their samples differ. Figures are bounded by the window we hold, not all-time claims.
        </p>
      </section>

      <AdSlot slot="research-below" className="my-10" />

      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight">How much to trust it</h2>
        <p className="muted mt-2 leading-relaxed">
          Seasonality is a real pattern in this data and a weak signal to trade on — both at once. Fifteen
          years is only fifteen observations per month, and a single outlier (Bitcoin&apos;s
          November 2013, say) can lift an average for a decade. That is why {btc.best.name} shows a large
          mean but only a {round(btc.best.positiveRate)}% win-rate: a few enormous months, not a reliable
          monthly gift. The honest use is calibration, not prediction — expect the mid-year to be quieter
          and the fourth quarter livelier, and size your expectations accordingly rather than betting on
          the calendar.
        </p>
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight">Methodology</h2>
        <ul className="muted mt-4 space-y-2 leading-relaxed">
          <li>
            <strong className="text-[var(--text)]">Data:</strong> our own daily closing prices, through{" "}
            {updated}. Bitcoin runs the longest ({study.years} years); the majors pool is the ten largest
            coins, each as far back as we reliably hold it.
          </li>
          <li>
            <strong className="text-[var(--text)]">Monthly return:</strong> the change between consecutive
            month-end closes. A partial first or last calendar month is dropped, so no return is measured
            from a mid-month baseline.
          </li>
          <li>
            <strong className="text-[var(--text)]">Average vs positive-rate:</strong> the average is the
            mean of those monthly returns; the positive-rate is the share that were green. The mean is
            skewed by early outsized years — the positive-rate is the more robust read.
          </li>
        </ul>
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight">Cite or share this study</h2>
        <p className="muted mt-2 leading-relaxed">
          The figures update as new data comes in. A link back keeps the citation live and lets your
          readers see the current numbers.
        </p>
        <blockquote className="mt-4 rounded-xl border-l-4 border-brand-500 bg-[var(--bg-elevated)] px-4 py-3 text-sm">
          {citation}
        </blockquote>
        <p className="muted mt-3 text-sm">
          Want to replay a specific run? The{" "}
          <Link href="/investment-calculator" className="font-semibold text-brand-ink hover:underline">
            investment calculator
          </Link>{" "}
          plays any coin back day by day, and the{" "}
          <Link href="/research/crypto-drawdowns" className="font-semibold text-brand-ink hover:underline">
            drawdown study
          </Link>{" "}
          shows how far these same assets fall from their peaks.
        </p>
      </section>

      <FaqSection faq={FAQS} />

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold tracking-tight">Related</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: "/research/crypto-drawdowns", title: "Crypto drawdown study", note: "How deep crypto crashes go, and recovery times" },
            { href: "/research/crypto-correlation", title: "Crypto correlation study", note: "Why 10 coins diversify less than you think" },
            { href: "/investment-calculator", title: "Investment calculator", note: "Replay any coin day by day" },
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
