"use client";

import { useMemo, useState } from "react";
import { track } from "@/lib/analytics";

/**
 * Ethereum staking method comparison calculator.
 *
 * Computes the NET annual reward for the same ETH across four staking routes —
 * solo, pooled / staking-as-a-service, liquid staking and exchange staking —
 * from the user's own inputs. The point it makes visible is the fee drag: the
 * gross APR is similar everywhere, but the provider fee is what separates them.
 *
 * NOTHING here is a live or guaranteed rate. Every APR and fee is an editable
 * input with a plausible, clearly-labelled default — rates move, so the honest
 * tool is one the user sets to today's numbers, not one that invents them.
 */

interface Method {
  id: string;
  name: string;
  grossApr: number; // % before the provider fee
  feePct: number; // % of rewards taken by the provider
  minEth: string; // human note, not used in maths
  liquidity: string;
  custody: string;
  slashing: string;
}

const DEFAULTS: Method[] = [
  { id: "solo", name: "Solo (run your own validator)", grossApr: 3.1, feePct: 0, minEth: "32 ETH", liquidity: "Locked until you exit the queue", custody: "You hold the keys", slashing: "You carry the full risk" },
  { id: "pooled", name: "Pooled / staking-as-a-service", grossApr: 3.1, feePct: 10, minEth: "Any (pools); ~8–16 ETH (minipool)", liquidity: "Locked until unstake / exit", custody: "Shared or provider-run", slashing: "Shared / often insured" },
  { id: "liquid", name: "Liquid staking (stETH, rETH…)", grossApr: 3.0, feePct: 10, minEth: "Any", liquidity: "Tradeable token — sell any time", custody: "Non-custodial protocol", slashing: "Socialised across the pool" },
  { id: "exchange", name: "Exchange staking (CEX)", grossApr: 3.0, feePct: 25, minEth: "Any", liquidity: "Per the exchange's unstake terms", custody: "The exchange holds your ETH", slashing: "Usually covered by the exchange" },
];

const fmtUsd = (n: number) => "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
const fmtEth = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 4 });

function num(v: string, fallback = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function StakingComparison() {
  const [amount, setAmount] = useState("32");
  const [ethPrice, setEthPrice] = useState("3000");
  const [methods, setMethods] = useState<Method[]>(DEFAULTS);
  const [tracked, setTracked] = useState(false);

  const amt = Math.max(0, num(amount));
  const price = Math.max(0, num(ethPrice));

  const rows = useMemo(
    () =>
      methods.map((m) => {
        const netApr = m.grossApr * (1 - m.feePct / 100);
        const annualEth = amt * (netApr / 100);
        return { m, netApr, annualEth, annualUsd: annualEth * price };
      }),
    [methods, amt, price],
  );

  const bestUsd = Math.max(...rows.map((r) => r.annualUsd));

  function edit(id: string, field: "grossApr" | "feePct", value: string) {
    setMethods((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: Math.max(0, num(value)) } : m)));
    if (!tracked) {
      setTracked(true);
      track("tool_used", { action: "compute", tool_slug: "ethereum-staking-comparison", tool_category: "defi" });
    }
  }

  return (
    <div className="card p-5 sm:p-7">
      {/* Shared inputs */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold muted">ETH to stake</span>
          <input type="number" min={0} step="0.1" value={amount} onChange={(e) => setAmount(e.target.value)} className="input-field" inputMode="decimal" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold muted">ETH price (USD)</span>
          <input type="number" min={0} step="1" value={ethPrice} onChange={(e) => setEthPrice(e.target.value)} className="input-field" inputMode="decimal" />
        </label>
      </div>

      {/* Per-method table */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--bg-subtle)] text-left">
              <th className="px-3 py-2 font-semibold">Method</th>
              <th className="px-3 py-2 text-right font-semibold">Gross APR</th>
              <th className="px-3 py-2 text-right font-semibold">Fee</th>
              <th className="px-3 py-2 text-right font-semibold">Net APR</th>
              <th className="px-3 py-2 text-right font-semibold">Reward / yr</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ m, netApr, annualEth, annualUsd }) => {
              const best = annualUsd === bestUsd && bestUsd > 0;
              return (
                <tr key={m.id} className={`border-b border-[var(--border)] last:border-0 ${best ? "bg-emerald-500/[0.06]" : ""}`}>
                  <td className="px-3 py-2">
                    <div className="font-semibold">{m.name}</div>
                    <div className="text-[11px] muted">Min {m.minEth}</div>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <input
                      type="number" min={0} step="0.1" value={m.grossApr}
                      onChange={(e) => edit(m.id, "grossApr", e.target.value)}
                      className="w-16 rounded-md border border-[var(--border)] bg-transparent px-1.5 py-1 text-right tabular-nums"
                      aria-label={`${m.name} gross APR %`}
                    />
                    <span className="ml-0.5 text-xs muted">%</span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <input
                      type="number" min={0} max={100} step="1" value={m.feePct}
                      onChange={(e) => edit(m.id, "feePct", e.target.value)}
                      className="w-14 rounded-md border border-[var(--border)] bg-transparent px-1.5 py-1 text-right tabular-nums"
                      aria-label={`${m.name} provider fee %`}
                    />
                    <span className="ml-0.5 text-xs muted">%</span>
                  </td>
                  <td className="px-3 py-2 text-right font-semibold tabular-nums">{netApr.toFixed(2)}%</td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    <div className="font-bold">{fmtUsd(annualUsd)}{best && <span className="ml-1 text-[10px] font-bold text-emerald-500">BEST</span>}</div>
                    <div className="text-[11px] muted">{fmtEth(annualEth)} ETH</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="muted mt-3 text-xs leading-relaxed">
        Net APR = gross APR × (1 − provider fee). Rates are editable estimates, not live or guaranteed —
        staking yields move with network participation, so set each row to today&apos;s published figure.
        Solo staking has no provider fee but real hardware, bandwidth and uptime costs, and the full
        slashing risk, which this reward figure does not subtract. Nothing here is financial advice.
      </p>

      {/* Trade-off matrix: the facts a yield number can't show */}
      <h3 className="mt-7 text-lg font-bold">Beyond the yield: the trade-offs</h3>
      <div className="mt-3 overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--bg-subtle)] text-left">
              <th className="px-3 py-2 font-semibold">Method</th>
              <th className="px-3 py-2 font-semibold">Custody</th>
              <th className="px-3 py-2 font-semibold">Liquidity</th>
              <th className="px-3 py-2 font-semibold">Slashing risk</th>
            </tr>
          </thead>
          <tbody>
            {methods.map((m) => (
              <tr key={m.id} className="border-b border-[var(--border)] last:border-0">
                <td className="px-3 py-2 font-semibold">{m.name}</td>
                <td className="px-3 py-2 muted">{m.custody}</td>
                <td className="px-3 py-2 muted">{m.liquidity}</td>
                <td className="px-3 py-2 muted">{m.slashing}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
