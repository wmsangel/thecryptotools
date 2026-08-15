import Link from "next/link";
import type { CoinInsights } from "@/lib/backtest/insights";
import { fmtUsd } from "@/lib/format";

/**
 * ============================================================================
 * The per-coin section that makes these 63 pages different from each other.
 * ============================================================================
 * Everything here is computed from that coin's own daily closes. The point is
 * NOT to inject numbers into a fixed sentence — a template with the ticker
 * swapped is the thing that got these pages flagged as duplicates in the first
 * place. The prose CHANGES SHAPE with the data: a coin that never recovered
 * gets a different paragraph from one that did, a coin that lost money over its
 * whole history gets a different opening from one that multiplied, and a coin
 * with ten months of history gets told it has ten months of history.
 *
 * Every claim is scoped to the window we hold. Our Bitcoin series starts in
 * 2011 and our Curve series in 2020, so "the deepest fall" means "in this
 * data". Do not promote these into all-time claims.
 */

const pct = (n: number, d = 1) =>
  `${n.toLocaleString("en-US", { maximumFractionDigits: d })}%`;

const longDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  });

/** "1 year and 3 months", "2,120 days" for short spans. */
function span(days: number): string {
  if (days < 60) return `${days} days`;
  const months = Math.round(days / 30.44);
  if (months < 24) return `${months} months`;
  let years = Math.floor(days / 365.25);
  let rem = Math.round((days - years * 365.25) / 30.44);
  // Rounding the remainder can reach a full 12 months — 5,472 days came out as
  // "14 years and 12 months" instead of "15 years". Carry it.
  if (rem >= 12) {
    years += 1;
    rem = 0;
  }
  return rem === 0 ? `${years} years` : `${years} years and ${rem} month${rem === 1 ? "" : "s"}`;
}

function multiple(m: number): string {
  if (m >= 100) return `${Math.round(m).toLocaleString("en-US")}×`;
  if (m >= 1) return `${m.toLocaleString("en-US", { maximumFractionDigits: 2 })}×`;
  return `${m.toLocaleString("en-US", { maximumFractionDigits: 3 })}× — a loss of ${pct((1 - m) * 100)}`;
}

export function CoinHistoryFacts({
  name,
  symbol,
  slug,
  i,
}: {
  name: string;
  symbol: string;
  slug: string;
  i: CoinInsights;
}) {
  const madeMoney = i.holdMultiple > 1;
  const recovered = i.worst.daysToRecover !== null;
  const nearHigh = i.belowHighPct < 15;
  const shortHistory = i.years < 2;
  const bestPositive = (i.best?.pct ?? 0) > 0;
  // A drawdown that begins on day one is not an event, it is the whole series.
  const fallingSinceStart = i.worst.peakDate === i.start;

  return (
    <section className="mt-12 max-w-3xl">
      <h2 className="text-2xl font-extrabold tracking-tight">
        What {symbol} actually did, in the data this page replays
      </h2>
      <p className="muted mt-3 leading-relaxed">
        Measured from the {i.days.toLocaleString("en-US")} daily closes this page replays —{" "}
        {longDate(i.start)} to {longDate(i.end)}, from {i.source}. Figures are bounded by that
        window, not by the asset&rsquo;s whole life.
      </p>

      <div className="mt-6 overflow-x-auto" tabIndex={0} role="group" aria-label={`${symbol} history summary`}>
        <table className="w-full min-w-[34rem] text-sm">
          <tbody>
            <Row label="History available" value={`${span(i.days)} (from ${i.source})`} />
            <Row
              label="Bought on the first day, held to the last"
              value={multiple(i.holdMultiple)}
              tone={madeMoney ? "up" : "down"}
            />
            <Row label="Highest close in this window" value={`${fmtUsd(i.high.price)} on ${longDate(i.high.date)}`} />
            <Row
              label="Where it sits against that high"
              value={i.belowHighPct < 0.5 ? "at the high" : `${pct(i.belowHighPct)} below`}
              tone={nearHigh ? "up" : "down"}
            />
            <Row
              label="Deepest fall"
              value={`−${pct(i.worst.depthPct)}, ${longDate(i.worst.peakDate)} → ${longDate(i.worst.troughDate)}`}
              tone="down"
            />
            <Row
              label="Time to get back to that peak"
              value={
                recovered
                  ? `${span(i.worst.daysToRecover!)} after the low — ${longDate(i.worst.recoveredOn!)}`
                  : "still below it"
              }
              tone={recovered ? undefined : "down"}
            />
            {i.crashCount > 0 && (
              <Row label="Separate falls of 50% or more" value={String(i.crashCount)} />
            )}
            <Row label="Days spent more than 20% below a previous peak" value={pct(i.underwaterPct)} />
            {i.best && (
              <Row
                label={`Best calendar year${i.best.partial ? " (partial)" : ""}`}
                value={`${i.best.year}: ${i.best.pct > 0 ? "+" : ""}${pct(i.best.pct)}`}
                tone={i.best.pct > 0 ? "up" : "down"}
              />
            )}
            {i.worstYear && i.worstYear.year !== i.best?.year && (
              <Row
                label={`Worst calendar year${i.worstYear.partial ? " (partial)" : ""}`}
                value={`${i.worstYear.year}: ${pct(i.worstYear.pct)}`}
                tone="down"
              />
            )}
            <Row label="Annualised volatility" value={pct(i.volatilityPct)} />
          </tbody>
        </table>
      </div>

      {i.years_.length >= 2 && (
        <>
          <h3 className="mt-8 text-lg font-bold">{symbol} year by year</h3>
          <p className="muted mt-2 leading-relaxed">
            First close to last close each year. {i.start.slice(0, 4)} and {i.end.slice(0, 4)} are
            partial — the data starts mid-{i.start.slice(0, 4)} and {i.end.slice(0, 4)} is still running.
          </p>
          <div className="mt-4 overflow-x-auto" tabIndex={0} role="group" aria-label={`${symbol} by year`}>
            <table className="w-full min-w-[28rem] text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className="py-2 pr-4 font-semibold">Year</th>
                  <th className="py-2 pr-4 font-semibold">Change</th>
                  <th className="py-2 font-semibold">Note</th>
                </tr>
              </thead>
              <tbody>
                {i.years_.map((y) => (
                  <tr key={y.year} className="border-b border-[var(--border)] last:border-0">
                    <td className="py-2 pr-4 font-semibold">{y.year}</td>
                    <td className={`py-2 pr-4 font-semibold ${y.pct >= 0 ? "text-gain" : "text-loss"}`}>
                      {y.pct > 0 ? "+" : ""}{pct(y.pct)}
                    </td>
                    <td className="py-2 muted text-xs">
                      {y.partial ? "partial year" : y.year === i.best?.year ? "best full year" : y.year === i.worstYear?.year ? "worst full year" : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* --- The paragraph that changes shape, not just numbers --- */}
      <h3 className="mt-8 text-lg font-bold">The part the calculator does not show you</h3>

      {fallingSinceStart ? (
        <p className="muted mt-3 leading-relaxed">
          {name} has a particular shape in this data: its highest close is the very first one we
          hold, on {longDate(i.start)}, and the {pct(i.worst.depthPct)} fall from it is not an event
          inside the series — it is the series. Any start date you pick above sits somewhere on that
          decline, which is why almost every plan you can configure here comes back negative. That is
          not a flaw in the backtest. It is what buying and holding {symbol} over this window did.
        </p>
      ) : madeMoney ? (
        <p className="muted mt-3 leading-relaxed">
          Held from the first day in this data to the last, {symbol} returned {multiple(i.holdMultiple)}.
          That headline is the easy part. The number underneath it is that the position spent{" "}
          {pct(i.underwaterPct)} of all days more than 20% below a previous peak — so for most of the
          time you owned it, you were looking at a figure lower than one you had already seen.
        </p>
      ) : (
        <p className="muted mt-3 leading-relaxed">
          Held from the first day in this data to the last, {symbol} returned {multiple(i.holdMultiple)}.
          Long holding periods are usually presented as the thing that rescues a volatile asset, and
          over this particular window for this particular coin, they did not. It is worth setting the
          calculator above to the full range and seeing that result written out before assuming time
          fixes an entry.
        </p>
      )}

      {!fallingSinceStart && (
        <p className="muted mt-3 leading-relaxed">
          The deepest fall took {symbol} down {pct(i.worst.depthPct)}, from {fmtUsd(i.worst.peakPrice)}{" "}
          on {longDate(i.worst.peakDate)} to {fmtUsd(i.worst.troughPrice)} on{" "}
          {longDate(i.worst.troughDate)} — {span(i.worst.daysToTrough)} of falling.{" "}
          {recovered ? (
            <>
              Getting back to that peak took a further {span(i.worst.daysToRecover!)}, reached on{" "}
              {longDate(i.worst.recoveredOn!)}. Add those together and the round trip was{" "}
              {span(i.worst.daysToTrough + i.worst.daysToRecover!)} — the length of time someone who
              bought at the top had to hold before they were merely even again.
            </>
          ) : (
            <>
              {symbol} has not been back to that peak since. Anyone who bought on{" "}
              {longDate(i.worst.peakDate)} is still waiting, {span(i.days - i.worst.daysToTrough)} later
              — which is the scenario a backtest showing a positive average return quietly averages away.
            </>
          )}
        </p>
      )}

      {shortHistory && (
        <p className="muted mt-3 leading-relaxed">
          One caveat specific to {symbol}: we only hold {span(i.days)} of daily closes for it, which
          is not enough to cover a full cycle. Any result the calculator gives you is a statement
          about one short stretch of an unusually eventful market, and the confidence you can place
          in it is correspondingly low. The coins on this site with six or more years of history give
          far more meaningful answers.
        </p>
      )}

      {!bestPositive && i.best && (
        <p className="muted mt-3 leading-relaxed">
          Note that {symbol}&apos;s best calendar year in this window is still a negative one
          ({i.best.year}, {pct(i.best.pct)}). There is no year in the data where holding it for the
          twelve months made money.
        </p>
      )}

      <p className="muted mt-3 leading-relaxed">
        {i.volatilityPct >= 120
          ? `At ${pct(i.volatilityPct)} annualised volatility, ${symbol} sits in the top band of anything on this site — the drawdown figures above, not the average, are the number to plan around.`
          : i.volatilityPct >= 80
            ? `${pct(i.volatilityPct)} annualised volatility is ordinary for a major crypto asset and still several times a stock index.`
            : `${pct(i.volatilityPct)} annualised volatility is at the calmer end for this market, which says more about ${symbol}'s short record than about its risk.`}{" "}
        <Link href={`/coins/${slug}`} className="font-semibold text-brand-ink hover:underline">
          All {symbol} calculators →
        </Link>
      </p>
    </section>
  );
}

function Row({
  label, value, tone,
}: {
  label: string;
  value: string;
  tone?: "up" | "down";
}) {
  return (
    <tr className="border-b border-[var(--border)] last:border-0">
      <th scope="row" className="py-2 pr-4 text-left font-normal muted align-top">{label}</th>
      <td className={`py-2 font-semibold ${tone === "up" ? "text-gain" : tone === "down" ? "text-loss" : ""}`}>
        {value}
      </td>
    </tr>
  );
}
