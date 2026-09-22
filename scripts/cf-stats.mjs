/**
 * ============================================================================
 * cf-stats — daily Cloudflare analytics digest for thecryptotools.com
 * ============================================================================
 * Pulls HUMAN traffic (Web Analytics RUM, bots excluded) + edge health, writes
 * a nice self-contained HTML report, prints a text digest, and fires a macOS
 * notification when something is worth acting on (a NEW referrer domain = a
 * possible backlink, an error spike, or a big traffic swing).
 *
 * WHY RUM for traffic: the edge dataset (httpRequests1dGroups) counts bots and
 * inflates everything ~4x. RUM is JS-beacon based ⇒ effectively humans only, and
 * it carries refererHost (our backlink signal). Edge is used only for error/
 * threat health, where bot noise doesn't matter.
 *
 * SETUP: token in ~/cf-analytics-token.txt (or env CF_ANALYTICS_TOKEN), scopes:
 *   Account Analytics Read + Account Web Analytics Read + Zone Analytics Read.
 * RUN:  npm run cf:stats        (also opens the HTML report when run by hand)
 * Autorun: launchd com.izn.cf-stats at 10:00 (see scripts/cf-stats.plist).
 * State (referrer baseline + history) lives in scripts/.cf-stats-state.json —
 * gitignored, local-only.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";
import { execFile } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const STATE = join(ROOT, "scripts", ".cf-stats-state.json");
const REPORT = join(ROOT, "scripts", "cf-report.html");

const ACCOUNT = "d6d43b8e4c7d1d4858991c524843db4c";
const ZONE = "70d123a40b245452d645c3e347db683f";
const SITE_TAG = "223e82622cf8416a8a60b176c889a3b7";
const HOST = "thecryptotools.com";
// Referrers that are our own — shown but never flagged as a surprise "backlink".
const OWN = ["thecryptotools.com", "calclumen.com", "iznkit.com", "izntools.com", "izngames.com", "costtrek.com", "testsweep.com", "foldoutkit.com", "24zdorovie.com", "prodom-expert.ru", "bilimjol.com"];
const AI = ["chatgpt.com", "chat.openai.com", "perplexity.ai", "gemini.google.com", "copilot.microsoft.com", "claude.ai"];

function token() {
  if (process.env.CF_ANALYTICS_TOKEN) return process.env.CF_ANALYTICS_TOKEN.trim();
  const p = join(homedir(), "cf-analytics-token.txt");
  if (!existsSync(p)) {
    console.error("cf-stats: no token — set CF_ANALYTICS_TOKEN or ~/cf-analytics-token.txt");
    process.exit(2);
  }
  return [...readFileSync(p, "utf8")].filter((c) => /[A-Za-z0-9_-]/.test(c)).join("");
}
const TOKEN = token();

const dayStr = (d) => d.toISOString().slice(0, 10);
const D = (s) => `${s}T00:00:00Z`;

async function gql(query) {
  const res = await fetch("https://api.cloudflare.com/client/v4/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  const j = await res.json();
  if (j.errors) throw new Error("GraphQL: " + JSON.stringify(j.errors));
  return j.data;
}

// RUM (human) grouped query helper
async function rum(fields, filter, extra = "") {
  const d = await gql(`query{viewer{accounts(filter:{accountTag:"${ACCOUNT}"}){
    rumPageloadEventsAdaptiveGroups(filter:{${filter}} ${extra}){ ${fields} }}}}`);
  return d.viewer.accounts[0].rumPageloadEventsAdaptiveGroups;
}

function pct(a, b) {
  if (!b) return a ? 100 : 0;
  return Math.round(((a - b) / b) * 100);
}
function arrow(p) {
  return p > 0 ? `▲ +${p}%` : p < 0 ? `▼ ${p}%` : "0%";
}

async function main() {
  const now = new Date();
  const yest = new Date(now.getTime() - 864e5);
  const y = dayStr(yest); // yesterday (last complete UTC day)
  const start7 = dayStr(new Date(now.getTime() - 8 * 864e5));
  const fSite = `siteTag:"${SITE_TAG}"`;

  // 7-day daily human series (for trend + sparkline)
  const series = await rum(
    "count sum{visits} dimensions{date}",
    `${fSite},date_geq:"${start7}"`,
    "limit:10,orderBy:[date_DESC]",
  );
  const byDate = Object.fromEntries(series.map((r) => [r.dimensions.date, { pv: r.count, visits: r.sum.visits }]));
  const dates = Object.keys(byDate).sort();
  const yd = byDate[y] || { pv: 0, visits: 0 };
  const prevDay = byDate[dayStr(new Date(yest.getTime() - 864e5))] || { pv: 0, visits: 0 };
  const last7 = dates.slice(-7).map((d) => byDate[d].pv);
  const avg7 = last7.length ? Math.round(last7.reduce((a, b) => a + b, 0) / last7.length) : 0;

  // Yesterday breakdowns (human)
  const dayFilter = `${fSite},datetime_geq:"${D(y)}",datetime_leq:"${D(dayStr(now))}"`;
  const [refs, pages, countries] = await Promise.all([
    rum("count dimensions{refererHost}", dayFilter, "limit:30,orderBy:[count_DESC]"),
    rum("count dimensions{requestPath}", dayFilter, "limit:10,orderBy:[count_DESC]"),
    rum("count dimensions{countryName}", dayFilter, "limit:8,orderBy:[count_DESC]"),
  ]);

  // Edge health yesterday (bots included — fine for errors/threats)
  const edge = await gql(`query{viewer{zones(filter:{zoneTag:"${ZONE}"}){
    httpRequests1dGroups(limit:1,filter:{date:"${y}"}){ sum{ requests threats responseStatusMap{edgeResponseStatus requests} } }}}}`);
  const eSum = edge.viewer.zones[0].httpRequests1dGroups[0]?.sum || { requests: 0, threats: 0, responseStatusMap: [] };
  const statusOf = (pfx) => eSum.responseStatusMap.filter((s) => String(s.edgeResponseStatus).startsWith(pfx)).reduce((a, s) => a + s.requests, 0);
  const health = { req: eSum.requests, threats: eSum.threats, s404: statusOf("404"), s5xx: statusOf("5"), s403: statusOf("403") };

  // Classify referrers
  const isOwn = (h) => OWN.some((o) => h === o || h.endsWith("." + o));
  const external = refs.filter((r) => r.dimensions.refererHost && !isOwn(r.dimensions.refererHost));
  const aiRefs = external.filter((r) => AI.includes(r.dimensions.refererHost));
  const directCount = (refs.find((r) => !r.dimensions.refererHost) || {}).count || 0;

  // State: known referrers + history
  const firstRun = !existsSync(STATE);
  let state = { knownReferrers: [], history: [] };
  if (!firstRun) { try { state = JSON.parse(readFileSync(STATE, "utf8")); } catch {} }
  const known = new Set(state.knownReferrers || []);
  // On the very first run everything is "new" — just record the baseline, don't
  // cry "backlink" for Bing/DDG etc.
  const newRefs = firstRun ? [] : external.filter((r) => !known.has(r.dimensions.refererHost) && !AI.includes(r.dimensions.refererHost));

  // Insights / to-do
  const insights = [];
  for (const r of newRefs) insights.push({ kind: "backlink", text: `Новый внешний источник: ${r.dimensions.refererHost} (${r.count}) — возможно, беклинк. Проверить и, если релевантно, поблагодарить/усилить.` });
  if (aiRefs.length) insights.push({ kind: "ai", text: `AI-заходы: ${aiRefs.map((r) => `${r.dimensions.refererHost} (${r.count})`).join(", ")} — нас цитируют AI-движки.` });
  const dPrev = pct(yd.pv, prevDay.pv), dAvg = pct(yd.pv, avg7);
  if (dAvg <= -40 && avg7 >= 10) insights.push({ kind: "warn", text: `Трафик людей ${dAvg}% к среднему за 7д (${yd.pv} vs ~${avg7}/день) — проверить, не поломка/деиндексация.` });
  if (dAvg >= 50 && yd.pv >= 15) insights.push({ kind: "up", text: `Трафик людей ${arrow(dAvg)} к среднему — что зашло? топ-страница: ${pages[0]?.dimensions.requestPath || "—"}.` });
  if (health.s5xx >= 200) insights.push({ kind: "warn", text: `5xx на edge: ${health.s5xx} — origin/Pages мог таймаутить. Следить.` });
  if (health.s404 >= 1500) insights.push({ kind: "warn", text: `404 на edge: ${health.s404} — вскрыть топ битых URL (боты или реальные ссылки).` });
  if (!insights.length) insights.push({ kind: "ok", text: "Аномалий нет — обычный день." });

  // ---- Text digest ----
  const bars = last7.map((v) => "▁▂▃▄▅▆▇█"[Math.min(7, Math.round((v / Math.max(1, Math.max(...last7))) * 7))]).join("");
  console.log(`\n  cf-stats — ${HOST} — ${y} (люди, боты исключены)`);
  console.log(`  Visits: ${yd.visits}  Pageviews: ${yd.pv}  (${arrow(dPrev)} к пред. дню, ${arrow(dAvg)} к 7д-среднему)`);
  console.log(`  7д тренд pv: ${bars}  (avg ${avg7}/день)`);
  console.log(`  Источники: Bing/DDG/AI + direct(${directCount}). Внешних: ${external.length}. Новых: ${newRefs.length}.`);
  console.log(`  Edge health: 404=${health.s404} 5xx=${health.s5xx} 403=${health.s403} threats=${health.threats}`);
  console.log("  Инсайты:");
  for (const i of insights) console.log(`   • ${i.text}`);
  console.log(`  HTML-отчёт: ${REPORT}\n`);

  // ---- HTML report ----
  writeFileSync(REPORT, htmlReport({ y, yd, prevDay, dPrev, dAvg, avg7, dates, byDate, external, aiRefs, newRefs, directCount, pages, countries, health, insights }));

  // ---- Save state ----
  for (const r of external) known.add(r.dimensions.refererHost);
  state.knownReferrers = [...known].sort();
  state.history = [...(state.history || []).filter((h) => h.date !== y), { date: y, pv: yd.pv, visits: yd.visits }].slice(-90);
  writeFileSync(STATE, JSON.stringify(state, null, 2) + "\n");

  // ---- macOS notification on notable events ----
  const notable = insights.filter((i) => i.kind !== "ok");
  if (notable.length && process.platform === "darwin") {
    const title = `TheCryptoTools — ${yd.visits} visits ${arrow(dAvg)}`;
    const msg = notable.slice(0, 3).map((i) => i.text).join(" · ").slice(0, 230);
    execFile("osascript", ["-e", `display notification ${JSON.stringify(msg)} with title ${JSON.stringify(title)}`], () => {});
  }

  // Open the report when run interactively (not from launchd).
  if (process.stdout.isTTY && process.platform === "darwin") execFile("open", [REPORT], () => {});
}

function htmlReport(d) {
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const maxPv = Math.max(1, ...d.dates.map((x) => d.byDate[x].pv));
  const trend = d.dates.slice(-7).map((x) => {
    const v = d.byDate[x].pv, h = Math.round((v / maxPv) * 100);
    return `<div class="bar" title="${x}: ${v}"><span style="height:${h}%"></span><small>${x.slice(5)}</small><b>${v}</b></div>`;
  }).join("");
  const tone = (p) => (p > 0 ? "up" : p < 0 ? "down" : "flat");
  const kindColor = { backlink: "#22c55e", ai: "#a855f7", warn: "#f59e0b", up: "#22c55e", ok: "#64748b" };
  const refRow = (r, isNew, isAi) =>
    `<tr><td class="mono">${esc(r.dimensions.refererHost)}${isNew ? ' <span class="tag new">NEW</span>' : ""}${isAi ? ' <span class="tag ai">AI</span>' : ""}</td><td class="num">${r.count}</td></tr>`;
  const newSet = new Set(d.newRefs.map((r) => r.dimensions.refererHost));
  const aiSet = new Set(d.aiRefs.map((r) => r.dimensions.refererHost));
  const extRows = d.external.length
    ? d.external.map((r) => refRow(r, newSet.has(r.dimensions.refererHost), aiSet.has(r.dimensions.refererHost))).join("")
    : `<tr><td colspan="2" class="muted">Внешних источников не было</td></tr>`;

  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>cf-stats ${d.y}</title>
<style>
:root{--bg:#0b0f17;--card:#141a24;--bd:#232c3a;--tx:#e6edf5;--mut:#8a97a8;--grn:#22c55e;--red:#ef4444;--amb:#f59e0b;--brand:#2dd4bf}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--tx);font:15px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;padding:24px}
.wrap{max-width:900px;margin:0 auto}h1{font-size:22px;margin:0 0 2px}.sub{color:var(--mut);margin:0 0 20px;font-size:13px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:20px}
.card{background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px}
.k{color:var(--mut);font-size:12px;text-transform:uppercase;letter-spacing:.04em}.v{font-size:28px;font-weight:800;margin-top:4px}
.delta{font-size:13px;font-weight:700;margin-top:2px}.up{color:var(--grn)}.down{color:var(--red)}.flat{color:var(--mut)}
.sec{background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px 18px;margin-bottom:16px}
.sec h2{font-size:14px;margin:0 0 12px;color:var(--mut);text-transform:uppercase;letter-spacing:.05em}
.trend{display:flex;gap:8px;align-items:flex-end;height:120px}
.bar{flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:4px;height:100%}
.bar>span{width:70%;background:linear-gradient(180deg,var(--brand),#0ea5a0);border-radius:5px 5px 0 0;min-height:3px}
.bar small{color:var(--mut);font-size:10px}.bar b{font-size:12px}
table{width:100%;border-collapse:collapse}td{padding:7px 4px;border-bottom:1px solid var(--bd);font-size:14px}
.num{text-align:right;font-weight:700;font-variant-numeric:tabular-nums}.mono{font-family:ui-monospace,Menlo,monospace;font-size:13px}
.muted{color:var(--mut)}.cols{display:grid;grid-template-columns:1fr 1fr;gap:16px}@media(max-width:640px){.cols{grid-template-columns:1fr}}
.tag{font-size:10px;font-weight:800;padding:1px 6px;border-radius:6px;vertical-align:middle}
.tag.new{background:rgba(34,197,94,.18);color:var(--grn)}.tag.ai{background:rgba(168,85,247,.18);color:#c084fc}
.ins{display:flex;gap:10px;padding:9px 0;border-bottom:1px solid var(--bd)}.ins:last-child{border:0}
.dot{width:9px;height:9px;border-radius:50%;margin-top:6px;flex:none}
.hl{display:flex;gap:16px;flex-wrap:wrap}.hl div{font-size:13px}.hl b{font-size:16px}
.bad{color:var(--red)}.warnc{color:var(--amb)}.okc{color:var(--grn)}
</style></head><body><div class="wrap">
<h1>TheCryptoTools — дневной срез</h1>
<p class="sub">${d.y} · только люди (боты исключены, Cloudflare Web Analytics) · edge-здоровье за тот же день</p>

<div class="grid">
  <div class="card"><div class="k">Visits</div><div class="v">${d.yd.visits}</div><div class="delta ${tone(d.dPrev)}">${arrow(d.dPrev)} к пред. дню</div></div>
  <div class="card"><div class="k">Pageviews</div><div class="v">${d.yd.pv}</div><div class="delta ${tone(d.dAvg)}">${arrow(d.dAvg)} к 7д-среднему (${d.avg7})</div></div>
  <div class="card"><div class="k">Внешних источников</div><div class="v">${d.external.length}</div><div class="delta ${d.newRefs.length ? "up" : "flat"}">${d.newRefs.length} новых</div></div>
  <div class="card"><div class="k">Direct</div><div class="v">${d.directCount}</div><div class="delta flat">прямые заходы</div></div>
</div>

<div class="sec"><h2>Инсайты и что взять в работу</h2>
${d.insights.map((i) => `<div class="ins"><span class="dot" style="background:${kindColor[i.kind] || "#64748b"}"></span><span>${esc(i.text)}</span></div>`).join("")}
</div>

<div class="sec"><h2>Просмотры людьми — 7 дней</h2><div class="trend">${trend}</div></div>

<div class="cols">
  <div class="sec"><h2>Источники (referrers)</h2><table>${extRows}
    <tr><td class="muted">(direct)</td><td class="num muted">${d.directCount}</td></tr></table></div>
  <div class="sec"><h2>Топ-страницы</h2><table>${d.pages.map((p) => `<tr><td class="mono">${esc(p.dimensions.requestPath.slice(0, 40))}</td><td class="num">${p.count}</td></tr>`).join("") || '<tr><td class="muted">нет данных</td></tr>'}</table></div>
</div>

<div class="cols">
  <div class="sec"><h2>Страны</h2><table>${d.countries.map((c) => `<tr><td>${esc(c.dimensions.countryName)}</td><td class="num">${c.count}</td></tr>`).join("")}</table></div>
  <div class="sec"><h2>Edge-здоровье (с ботами)</h2><div class="hl">
    <div>404<br><b class="${d.health.s404 >= 1500 ? "warnc" : ""}">${d.health.s404}</b></div>
    <div>5xx<br><b class="${d.health.s5xx >= 200 ? "bad" : "okc"}">${d.health.s5xx}</b></div>
    <div>403<br><b>${d.health.s403}</b></div>
    <div>threats<br><b>${d.health.threats}</b></div>
    <div>всего req<br><b>${d.health.req}</b></div>
  </div><p class="muted" style="margin:12px 0 0;font-size:12px">Edge включает ботов — смотрим только на ошибки/угрозы, не на трафик.</p></div>
</div>
<p class="sub" style="margin-top:18px">Сгенерировано cf-stats.mjs · ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC</p>
</div></body></html>`;
}

main().catch((e) => { console.error("cf-stats failed:", e.message); process.exit(1); });
