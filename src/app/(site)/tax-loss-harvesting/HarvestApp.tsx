"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { jurisdictions, getJurisdiction, taxYearFor } from "@/lib/taxreport/jurisdictions";
import { buildReport } from "@/lib/taxreport/engine";
import { buildHarvestPlan } from "@/lib/harvest/engine";
import { priceHoldings, type AssetMap } from "@/lib/harvest/pricing";
import { windowLabel } from "@/lib/harvest/rules";
import type { HarvestCandidate, HarvestPlan } from "@/lib/harvest/types";
import { useCsvIntake, CsvDropZone, CsvColumnMapper } from "@/components/taxreport/CsvIntake";
import { track, bucket } from "@/lib/analytics";

const DAY_MS = 86_400_000;

function money(n: number, code: string): string {
  if (!isFinite(n)) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: code, maximumFractionDigits: 2 });
}
const qty = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 8 });
const day = (d: Date) => d.toISOString().slice(0, 10);

function price(n: number, code: string): string {
  // Sub-cent tokens are common and "$0.00" is useless for checking a valuation.
  const digits = n >= 1 ? 2 : n >= 0.01 ? 4 : 8;
  return n.toLocaleString("en-US", { style: "currency", currency: code, maximumFractionDigits: digits });
}

/**
 * A demonstration history, dated relative to the day it is generated so it
 * always lands inside the open tax year — a hardcoded sample would drift out
 * of the current year and quietly show "nothing to harvest".
 *
 * The lots are chosen to make the two things this page exists to show
 * unavoidable: a losing parcel sitting INSIDE a winning position (the second
 * bitcoin buy), and far more paper loss than the year's gains can absorb.
 */
function buildSample(today: Date): string {
  const back = (days: number) => day(new Date(today.getTime() - days * DAY_MS));
  return [
    "Date,Type,Sent Amount,Sent Currency,Received Amount,Received Currency,Fee Amount,Fee Currency,Net Value",
    `${back(1500)},Buy,30000,USD,1.2,BTC,40,USD,30000`,
    `${back(700)},Buy,13600,USD,4,ETH,20,USD,13600`,
    `${back(400)},Buy,11000,USD,20000,ADA,15,USD,11000`,
    `${back(300)},Buy,8400,USD,300,SOL,12,USD,8400`,
    `${back(200)},Buy,9600,USD,6000,DOT,10,USD,9600`,
    `${back(100)},Buy,38000,USD,0.4,BTC,45,USD,38000`,
    `${back(25)},Sell,120,SOL,,,14,USD,9000`,
  ].join("\n");
}

export function HarvestApp({ assets, buildDate }: { assets: AssetMap; buildDate: string }) {
  /**
   * Two-pass date, the same pattern the calendar uses. Computing `new Date()`
   * during the first client render would not match HTML exported on an earlier
   * day, and React throws the whole subtree away when it mismatches. The
   * server's build date renders first, then a mount effect swaps in the
   * visitor's real today.
   */
  const [today, setToday] = useState(() => new Date(`${buildDate}T00:00:00Z`));
  useEffect(() => {
    const now = new Date();
    setToday(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())));
  }, []);

  const [jurisdictionId, setJurisdictionId] = useState("us");
  const [countryChosenByUser, setCountryChosenByUser] = useState(false);
  const [rate, setRate] = useState<number | null>(null);
  const [ltRate, setLtRate] = useState<number | null>(null);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [priceNote, setPriceNote] = useState("");
  const [pricing, setPricing] = useState(false);
  const [showWinners, setShowWinners] = useState(false);

  const jurisdiction = getJurisdiction(jurisdictionId)!;

  const intake = useCsvIntake((fiat) => {
    if (countryChosenByUser) return;
    const match = jurisdictions.find((j) => j.currencyCode === fiat);
    if (match) setJurisdictionId(match.id);
  });

  const normalised = useMemo(
    () => intake.normalisedFor(jurisdiction.currencyCode),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [intake.parsed, intake.mapping, intake.dateOrder, jurisdiction.currencyCode],
  );

  /**
   * Always the OPEN tax year. There is no year picker here on purpose: you
   * cannot go back and sell something last December, so offering a closed year
   * would only produce advice nobody can act on.
   */
  const openYear = useMemo(() => taxYearFor(jurisdiction, today), [jurisdiction, today]);

  const report = useMemo(() => {
    if (!normalised?.txs.length) return null;
    return buildReport(normalised.txs, normalised.issues, {
      jurisdiction,
      taxYearLabel: openYear.label,
      rate: rate ?? jurisdiction.defaultRate,
      longTermRate: ltRate ?? jurisdiction.defaultLongTermRate,
    });
  }, [normalised, jurisdiction, openYear.label, rate, ltRate]);

  // --- pricing -------------------------------------------------------------
  const heldSymbols = useMemo(
    () => (report ? [...new Set(report.holdings.map((h) => h.asset.toUpperCase()))].sort() : []),
    [report],
  );
  const priceKey = `${heldSymbols.join(",")}|${jurisdiction.currencyCode}`;
  const lastPriced = useRef("");

  const loadPrices = useCallback(
    async (force = false) => {
      if (heldSymbols.length === 0) return;
      if (!force && lastPriced.current === priceKey) return;
      lastPriced.current = priceKey;
      setPricing(true);
      try {
        const result = await priceHoldings(heldSymbols, assets, jurisdiction.currencyCode);
        setPrices(result.prices);
        setPriceNote(result.note);
      } finally {
        setPricing(false);
      }
    },
    [heldSymbols, priceKey, assets, jurisdiction.currencyCode],
  );

  useEffect(() => {
    void loadPrices();
  }, [loadPrices]);

  const plan: HarvestPlan | null = useMemo(() => {
    if (!report || Object.keys(prices).length === 0) return null;
    try {
      return buildHarvestPlan({
        jurisdiction,
        report,
        prices,
        priceNote,
        rate: rate ?? jurisdiction.defaultRate,
        longTermRate: ltRate ?? jurisdiction.defaultLongTermRate,
        today,
      });
    } catch {
      // The only throw is the open-year guard, which cannot fire while the
      // report is built from `openYear.label` — but a blank panel beats a
      // white screen if that ever changes.
      return null;
    }
  }, [report, prices, priceNote, jurisdiction, rate, ltRate, today]);

  /**
   * One event per country × holdings shape, not per recompute: the plan object
   * is rebuilt by every rate tweak, and a visitor comparing three countries
   * should read as three, not thirty. Nothing describing the holdings is sent —
   * counts are bucketed and no asset name, amount or price leaves the browser.
   */
  const lastTracked = useRef("");
  useEffect(() => {
    if (!plan) return;
    const key = `${jurisdiction.id}|${plan.candidates.length}`;
    if (lastTracked.current === key) return;
    lastTracked.current = key;
    track("harvest_plan_built", {
      country: jurisdiction.id,
      method: jurisdiction.method,
      candidates: bucket(plan.candidates.length),
      blocked: plan.blockedLoss > 0,
      saves_nothing: plan.totalSaved <= 0,
      unpriced: plan.unpriced.length,
    });
  }, [plan, jurisdiction]);

  const cur = jurisdiction.currencyCode;

  return (
    <div className="mt-8 space-y-8">
      <CsvDropZone
        intake={intake}
        heading="1 · Load your transaction history"
        onSample={() => intake.ingest(buildSample(today), "sample.csv", "sample")}
        sampleLabel="Try a sample portfolio"
      />

      <CsvColumnMapper intake={intake} heading="2 · Check the columns" />

      {normalised && normalised.txs.length > 0 && (
        <section className="card p-6">
          <h2 className="text-xl font-bold">3 · Your country and rate</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-sm font-semibold" htmlFor="h-jur">Country</label>
              <select
                id="h-jur"
                value={jurisdictionId}
                onChange={(e) => {
                  setJurisdictionId(e.target.value);
                  setCountryChosenByUser(true);
                  setRate(null);
                  setLtRate(null);
                }}
                className="input-field mt-1.5 w-full text-sm"
              >
                {jurisdictions.map((j) => (
                  <option key={j.id} value={j.id}>{j.flag} {j.name}</option>
                ))}
              </select>
            </div>
            <div>
              <span className="block text-sm font-semibold">Tax year</span>
              <p className="input-field mt-1.5 w-full text-sm !bg-transparent">
                {openYear.label}
              </p>
              <p className="muted mt-1 text-xs">Closes {day(openYear.end)} — the deadline to act.</p>
            </div>
            <div>
              <label className="block text-sm font-semibold" htmlFor="h-rate">
                {jurisdiction.relief.kind === "rate" ? "Short-term rate" : "Your tax rate"}
              </label>
              <input
                id="h-rate"
                type="number"
                min={0}
                max={60}
                step={0.5}
                value={rate ?? jurisdiction.defaultRate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="input-field mt-1.5 w-full text-sm"
              />
            </div>
            {jurisdiction.relief.kind === "rate" && (
              <div>
                <label className="block text-sm font-semibold" htmlFor="h-ltrate">Long-term rate</label>
                <input
                  id="h-ltrate"
                  type="number"
                  min={0}
                  max={60}
                  step={0.5}
                  value={ltRate ?? jurisdiction.defaultLongTermRate ?? 15}
                  onChange={(e) => setLtRate(Number(e.target.value))}
                  className="input-field mt-1.5 w-full text-sm"
                />
              </div>
            )}
          </div>

          {intake.fileCurrency && intake.fileCurrency !== jurisdiction.currencyCode && (
            <p className="mt-4 rounded-xl border-l-4 border-amber-500 bg-[var(--bg-elevated)] px-4 py-3 text-sm">
              <strong>Currency mismatch.</strong> Your file looks like it is in {intake.fileCurrency},
              but {jurisdiction.name} reports in {jurisdiction.currencyCode}. Nothing here converts
              currencies, so the figures would be read as {jurisdiction.currencyCode}. Pick a country
              using {intake.fileCurrency}, or convert the file first.
            </p>
          )}

          <p className="muted mt-4 text-xs">
            <strong className="text-[var(--text)]">Matching method:</strong> {jurisdiction.methodLabel}
            {(jurisdiction.method === "acb" || jurisdiction.method === "pool104") && (
              <> — your holdings are pooled, so parcels below are whole positions at the pooled average cost.</>
            )}
          </p>
        </section>
      )}

      {report && heldSymbols.length > 0 && !plan && (
        <section className="card p-6">
          <p className="muted text-sm">
            {pricing ? "Fetching current prices…" : priceNote || "No prices could be fetched, so nothing can be valued."}
          </p>
          {!pricing && (
            <button type="button" className="btn-ghost mt-3" onClick={() => void loadPrices(true)}>
              Try again
            </button>
          )}
        </section>
      )}

      {plan && <PlanView plan={plan} cur={cur} pricing={pricing} onRefresh={() => void loadPrices(true)} showWinners={showWinners} setShowWinners={setShowWinners} />}
    </div>
  );
}

// --- results ----------------------------------------------------------------

function PlanView({
  plan, cur, pricing, onRefresh, showWinners, setShowWinners,
}: {
  plan: HarvestPlan;
  cur: string;
  pricing: boolean;
  onRefresh: () => void;
  showWinners: boolean;
  setShowWinners: (v: boolean) => void;
}) {
  const claimable = plan.candidates.filter((c) => !c.reliefBlocked);
  const blocked = plan.candidates.filter((c) => c.reliefBlocked);
  const worthwhile = claimable.filter((c) => c.taxSaved > 0);
  const rule = plan.rule;
  const win = windowLabel(rule);

  return (
    <section className="space-y-6" aria-live="polite">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="eyebrow">Harvest plan</div>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight">
            {plan.jurisdictionName} · {plan.taxYearLabel}
          </h2>
        </div>
        <button type="button" className="btn-ghost" onClick={onRefresh} disabled={pricing}>
          {pricing ? "Refreshing…" : "↻ Refresh prices"}
        </button>
      </div>

      {/* --- headline --- */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Tax you could save" value={money(plan.totalSaved, cur)} emphasis tone={plan.totalSaved > 0 ? "up" : "flat"} />
        <Stat label="Gains realised so far" value={money(plan.realisedGain, cur)} />
        <Stat label="Claimable paper loss" value={money(plan.harvestableLoss, cur)} tone="down" />
        <Stat
          label="Days left in the tax year"
          value={plan.daysToYearEnd >= 0 ? String(plan.daysToYearEnd) : "closed"}
        />
      </div>

      {plan.totalSaved <= 0 && (
        <p className="rounded-xl border-l-4 border-amber-500 bg-[var(--bg-elevated)] px-4 py-3 text-sm">
          <strong>Harvesting saves you nothing this year.</strong>{" "}
          {plan.realisedGain <= 0
            ? "You have no realised gains for a loss to offset. Selling now would still bank the loss to carry forward in most regimes, but it does not reduce a bill you do not have."
            : "Every loss that could reduce this year's bill has already been used, or your country does not allow the deduction. The notes below say which."}
        </p>
      )}

      {plan.surplusLoss > 0 && plan.totalSaved > 0 && (
        <p className="rounded-xl border-l-4 border-brand-500 bg-[var(--bg-elevated)] px-4 py-3 text-sm">
          <strong>
            You only need to realise {money(plan.lossNeeded, cur)} of loss to capture the whole{" "}
            {money(plan.totalSaved, cur)}.
          </strong>{" "}
          You are down {money(plan.harvestableLoss, cur)} in total, but the extra{" "}
          {money(plan.surplusLoss, cur)} does nothing this year — there are no gains left for it to
          offset. Selling it anyway banks the loss to carry forward, which is worth something, but it
          is not this year&apos;s money and you give up the position to get it.
        </p>
      )}

      {/* --- the repurchase rule: the part that decides whether any of this works --- */}
      <div className="card p-6">
        <h3 className="font-bold">Can you buy it straight back?</h3>
        <p className="mt-1 text-sm font-semibold text-brand-ink">{rule.summary}</p>
        {win && (
          <p className="muted mt-2 text-sm">
            Window: <strong className="text-[var(--text)]">{win}</strong>
            {rule.kind === "window" && (
              <> — a loss caught by it is {rule.outcome === "deferred" ? "deferred into the cost of what you bought back, not destroyed" : "denied"}.</>
            )}
          </p>
        )}
        <p className="muted mt-3 text-sm leading-relaxed">{rule.detail}</p>
        <p className="muted mt-3 text-xs">
          Sources:{" "}
          {rule.sources.map((s, i) => (
            <span key={s.url}>
              {i > 0 && " · "}
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-ink hover:underline">
                {s.label}
              </a>{" "}
              ({s.publisher})
            </span>
          ))}
        </p>
      </div>

      {/* --- candidates --- */}
      {claimable.length > 0 && (
        <div className="card p-6">
          <h3 className="font-bold">
            {plan.pooled ? "Positions showing a loss" : "Parcels showing a loss"}
          </h3>
          <p className="muted mt-1 text-sm">
            Ranked by the tax each one actually saves, on top of the ones above it. The savings add
            up to the headline figure — they are not each a separate {money(plan.totalSaved, cur)}.
          </p>
          <div className="mt-4 overflow-x-auto" tabIndex={0} role="group" aria-label="Losing parcels">
            <table className="w-full min-w-[52rem] text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className="py-2 pr-3 font-semibold">Asset</th>
                  <th className="py-2 pr-3 font-semibold">Quantity</th>
                  {!plan.pooled && <th className="py-2 pr-3 font-semibold">Bought</th>}
                  <th className="py-2 pr-3 font-semibold">Cost</th>
                  <th className="py-2 pr-3 font-semibold">Value now</th>
                  <th className="py-2 pr-3 font-semibold">Unrealised</th>
                  <th className="py-2 pr-3 font-semibold">Tax saved</th>
                </tr>
              </thead>
              <tbody>
                {claimable.map((c) => (
                  <CandidateRow key={c.id} c={c} cur={cur} pooled={plan.pooled} />
                ))}
              </tbody>
            </table>
          </div>
          <p className="muted mt-3 text-xs">{plan.priceNote}</p>
        </div>
      )}

      {/* --- blocked by a holding-period exemption --- */}
      {blocked.length > 0 && (
        <div className="card p-6">
          <h3 className="font-bold">Losses you cannot claim — {money(plan.blockedLoss, cur)}</h3>
          <p className="muted mt-1 text-sm">
            These parcels are past {plan.jurisdictionName}&apos;s holding-period exemption. The gain
            would have been tax-free, and the same rule makes the loss non-deductible. Selling them
            for tax reasons achieves nothing.
          </p>
          <div className="mt-4 overflow-x-auto" tabIndex={0} role="group" aria-label="Blocked losses">
            <table className="w-full min-w-[44rem] text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className="py-2 pr-3 font-semibold">Asset</th>
                  <th className="py-2 pr-3 font-semibold">Quantity</th>
                  <th className="py-2 pr-3 font-semibold">Bought</th>
                  <th className="py-2 pr-3 font-semibold">Held</th>
                  <th className="py-2 pr-3 font-semibold">Unrealised</th>
                </tr>
              </thead>
              <tbody>
                {blocked.map((c) => (
                  <tr key={c.id} className="border-b border-[var(--border)] last:border-0">
                    <td className="py-2 pr-3 font-semibold">{c.asset}</td>
                    <td className="py-2 pr-3">{qty(c.quantity)}</td>
                    <td className="py-2 pr-3">{c.acquired ? day(c.acquired) : "pooled"}</td>
                    <td className="py-2 pr-3">{c.holdingDays !== null ? `${c.holdingDays} days` : "—"}</td>
                    <td className="py-2 pr-3 text-loss">{money(c.unrealised, cur)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- expiring losses: the deadline nobody tells you about --- */}
      {claimable.some((c) => c.lossExpiresOn) && (
        <div className="card p-6">
          <h3 className="font-bold">These losses expire</h3>
          <p className="muted mt-1 text-sm">
            In {plan.jurisdictionName} a position becomes exempt once it is old enough — and an
            exempt position cannot produce a deductible loss. Each of these stops being worth
            harvesting on the date shown, which runs the opposite way to the usual advice to hold
            longer.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {claimable
              .filter((c) => c.lossExpiresOn)
              .sort((a, b) => a.lossExpiresOn!.getTime() - b.lossExpiresOn!.getTime())
              .map((c) => (
                <li key={c.id} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[var(--border)] pb-2 last:border-0">
                  <span>
                    <strong>{qty(c.quantity)} {c.asset}</strong>{" "}
                    <span className="muted">bought {c.acquired ? day(c.acquired) : "—"}</span>
                  </span>
                  <span className="text-loss">
                    {money(c.unrealised, cur)} · loss unusable from {day(c.lossExpiresOn!)}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* --- notes --- */}
      {plan.notes.length > 0 && (
        <div className="card p-6">
          <h3 className="font-bold">Before you act</h3>
          <ul className="muted mt-3 space-y-3 text-sm leading-relaxed">
            {plan.notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
      )}

      {/* --- unpriced --- */}
      {plan.unpriced.length > 0 && (
        <div className="card p-6">
          <h3 className="font-bold">Not valued</h3>
          <p className="muted mt-1 text-sm">
            No price could be fetched for these, so they are excluded from every figure above. A
            guessed price would change the headline number without telling you.
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            {plan.unpriced.map((u) => (
              <li key={u.asset} className="flex justify-between border-b border-[var(--border)] pb-1 last:border-0">
                <span className="font-semibold">{qty(u.quantity)} {u.asset}</span>
                <span className="muted">cost {money(u.cost, cur)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* --- winners, for context --- */}
      {plan.winners.length > 0 && (
        <div className="card p-6">
          <button
            type="button"
            className="flex w-full items-center justify-between text-left"
            onClick={() => setShowWinners(!showWinners)}
            aria-expanded={showWinners}
          >
            <span className="font-bold">Positions in profit ({plan.winners.length})</span>
            <span className="muted text-sm">{showWinners ? "Hide" : "Show"}</span>
          </button>
          {showWinners && (
            <>
              <p className="muted mt-3 text-sm">
                Shown so the picture is complete. Selling any of these ADDS to this year&apos;s tax
                bill — they are not part of the plan above.
              </p>
              <div className="mt-4 overflow-x-auto" tabIndex={0} role="group" aria-label="Positions in profit">
                <table className="w-full min-w-[44rem] text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-left">
                      <th className="py-2 pr-3 font-semibold">Asset</th>
                      <th className="py-2 pr-3 font-semibold">Quantity</th>
                      {!plan.pooled && <th className="py-2 pr-3 font-semibold">Bought</th>}
                      <th className="py-2 pr-3 font-semibold">Cost</th>
                      <th className="py-2 pr-3 font-semibold">Value now</th>
                      <th className="py-2 pr-3 font-semibold">Unrealised</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plan.winners.map((c) => (
                      <tr key={c.id} className="border-b border-[var(--border)] last:border-0">
                        <td className="py-2 pr-3 font-semibold">{c.asset}</td>
                        <td className="py-2 pr-3">{qty(c.quantity)}</td>
                        {!plan.pooled && <td className="py-2 pr-3">{c.acquired ? day(c.acquired) : "pooled"}</td>}
                        <td className="py-2 pr-3">{money(c.cost, cur)}</td>
                        <td className="py-2 pr-3">{money(c.value, cur)}</td>
                        <td className="py-2 pr-3 text-gain">+{money(c.unrealised, cur)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      <p className="muted text-sm">
        Want the full capital-gains position rather than just the harvesting question?{" "}
        <Link href="/crypto-tax-report" className="font-semibold text-brand-ink hover:underline">
          Run the same file through the tax report →
        </Link>
      </p>

      {worthwhile.length === 0 && claimable.length > 0 && (
        <p className="muted text-sm">
          None of the parcels above reduce this year&apos;s bill, for the reasons in the notes. They
          are still listed because the paper loss is real, and because knowing a loss is worthless
          for tax is itself the answer.
        </p>
      )}
    </section>
  );
}

function CandidateRow({ c, cur, pooled }: { c: HarvestCandidate; cur: string; pooled: boolean }) {
  return (
    <tr className="border-b border-[var(--border)] last:border-0">
      <td className="py-2 pr-3">
        <span className="font-semibold">{c.asset}</span>
        <span className="muted block text-xs">at {price(c.price, cur)}</span>
      </td>
      <td className="py-2 pr-3">{qty(c.quantity)}</td>
      {!pooled && (
        <td className="py-2 pr-3">
          {c.acquired ? day(c.acquired) : "pooled"}
          {c.holdingDays !== null && <span className="muted block text-xs">{c.holdingDays} days</span>}
        </td>
      )}
      <td className="py-2 pr-3">{money(c.cost, cur)}</td>
      <td className="py-2 pr-3">{money(c.value, cur)}</td>
      <td className="py-2 pr-3 text-loss">{money(c.unrealised, cur)}</td>
      <td className="py-2 pr-3">
        {c.taxSaved > 0 ? (
          <span className="font-semibold text-gain">{money(c.taxSaved, cur)}</span>
        ) : (
          <span className="muted">nothing this year</span>
        )}
      </td>
    </tr>
  );
}

function Stat({
  label, value, emphasis, tone,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
  tone?: "up" | "down" | "flat";
}) {
  return (
    <div className={`card p-4 ${emphasis ? "ring-1 ring-brand-500/40" : ""}`}>
      <div className="muted text-xs uppercase tracking-wide">{label}</div>
      <div
        className={`mt-1 text-2xl font-extrabold tracking-tight ${
          tone === "up" ? "text-gain" : tone === "down" ? "text-loss" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}
