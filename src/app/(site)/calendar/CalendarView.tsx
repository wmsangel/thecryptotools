"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { CalendarEvent, EventCategory } from "@/lib/events/types";
import { CATEGORY_META, expandEvents } from "@/lib/events/types";
import { daysUntil, longDate, relative } from "@/lib/events/format";
import { track } from "@/lib/analytics";

const HORIZONS = [90, 180, 365, 730] as const;

/** Only the countries the calendar actually carries an entry for. */
const COUNTRY_BY_CODE: Record<string, string> = {
  US: "United States", GB: "United Kingdom", DE: "Germany", AU: "Australia",
  CA: "Canada", IE: "Ireland", PL: "Poland", IN: "India", ES: "Spain",
  NL: "Netherlands", SG: "Singapore", ZA: "South Africa", HK: "Hong Kong", NZ: "New Zealand",
  JP: "Japan", KR: "South Korea",
};

/**
 * "What is coming up" depends on today's date, and this site is statically
 * exported — so the HTML is frozen at whatever day the build ran.
 *
 * The list is therefore rendered TWICE on purpose. The first render uses
 * `buildDate`, exactly what the prerendered HTML contains, so hydration matches
 * and crawlers still get a real list of dates rather than an empty shell. An
 * effect then swaps in the visitor's actual today, which is what a returning
 * reader needs. Computing today's date during the first render instead would
 * mismatch the HTML the moment the build ages by a day, and React would throw
 * the whole server-rendered subtree away.
 */
export function CalendarView({ events, buildDate }: { events: CalendarEvent[]; buildDate: string }) {
  const [today, setToday] = useState(buildDate);
  // "Only what applies to me" is a blunt filter: it drops entries tied to a
  // country other than the one the browser reports. Better than nothing for
  // someone who only cares about their own deadline, and clearly labelled as a
  // guess rather than presented as personalisation. Read after mount for the
  // same reason as the date — `navigator` does not exist at build time, so
  // reading it during the first render would mismatch the HTML.
  const [myCountryName, setMyCountryName] = useState<string | undefined>(undefined);

  useEffect(() => {
    const now = new Date().toISOString().slice(0, 10);
    if (now !== buildDate) setToday(now);
    const code = navigator.language.split("-")[1]?.toUpperCase();
    if (code && COUNTRY_BY_CODE[code]) setMyCountryName(COUNTRY_BY_CODE[code]);
  }, [buildDate]);

  const [days, setDays] = useState<number>(365);
  const [categories, setCategories] = useState<Set<EventCategory>>(
    () => new Set<EventCategory>(["tax", "regulation", "network"]),
  );
  const [mine, setMine] = useState(false);

  const occurrences = useMemo(
    () =>
      expandEvents(events, days, new Date(`${today}T00:00:00Z`)).filter((o) =>
        categories.has(o.event.category),
      ),
    [events, days, categories, today],
  );

  const shown = mine && myCountryName
    ? occurrences.filter((o) => !o.event.country || o.event.country.name === myCountryName)
    : occurrences;

  // Updater form rather than a new Set built from `categories`: two toggles
  // landing before a re-render would otherwise both read the same stale set and
  // the first one would be silently discarded.
  const toggle = (c: EventCategory) => {
    setCategories((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next.size === 0 ? prev : next; // never leave the page empty by accident
    });
    track("calendar_filter", { category: c, on: !categories.has(c), horizon_days: days });
  };

  return (
    <div className="mt-8">
      <div className="card p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold muted">Looking ahead</span>
            <select className="input-field" value={days} onChange={(e) => setDays(Number(e.target.value))}>
              {HORIZONS.map((d) => (
                <option key={d} value={d}>
                  {d === 730 ? "Next two years" : d === 365 ? "Next year" : `Next ${d} days`}
                </option>
              ))}
            </select>
          </label>

          <div>
            <span className="mb-1 block text-xs font-semibold muted">Show</span>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(CATEGORY_META) as EventCategory[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggle(c)}
                  aria-pressed={categories.has(c)}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                    categories.has(c)
                      ? "border-brand-500 bg-brand-500/10 text-brand-ink"
                      : "border-[var(--border)] opacity-60 hover:opacity-100"
                  }`}
                >
                  {CATEGORY_META[c].icon} {CATEGORY_META[c].label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {myCountryName && (
          <label className="mt-4 flex cursor-pointer items-start gap-3 border-t border-[var(--border)] pt-4">
            <input
              type="checkbox"
              checked={mine}
              onChange={(e) => setMine(e.target.checked)}
              className="mt-0.5 accent-brand-500"
            />
            <span className="text-sm">
              <span className="font-semibold">Only {myCountryName} and worldwide events</span>
              <span className="muted mt-0.5 block text-xs leading-relaxed">
                Guessed from your browser&rsquo;s language setting, which is often wrong — it is a
                filter, not a statement about where you are tax resident.
              </span>
            </span>
          </label>
        )}
      </div>

      {/* The list is a section of the page in its own right, and its items are
          h3 — without this the outline jumps straight from the h1 to h3. */}
      <h2 className="sr-only">Upcoming events</h2>

      {/* The count changes when a filter is toggled; without a live region a
          screen reader announces nothing and the page appears not to respond. */}
      <p className="muted mt-5 text-sm" role="status" aria-live="polite">
        {shown.length === 0
          ? "Nothing in that window with those filters."
          : `${shown.length} scheduled ${shown.length === 1 ? "event" : "events"}.`}
      </p>

      <ol className="mt-5 space-y-3">
        {shown.map((o, i) => {
          const meta = CATEGORY_META[o.event.category];
          const soon = daysUntil(o.date, today) <= 30;
          return (
            <li
              key={`${o.event.id}-${o.date}-${i}`}
              className={`card p-5 ${soon ? "border-brand-500/50" : ""}`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-base font-bold">
                    {o.approximate && <span className="muted font-normal">around </span>}
                    {longDate(o.date)}
                  </span>
                  <span className="muted text-xs">{relative(o.date, today)}</span>
                </div>
                <span className="chip !px-2.5 !py-0.5 text-[11px]">
                  {meta.icon} {meta.label}
                </span>
              </div>

              <h3 className="mt-2 font-bold">
                {o.event.country && <span className="mr-1.5">{o.event.country.flag}</span>}
                {o.event.title}
              </h3>
              <p className="muted mt-1.5 text-sm leading-relaxed">{o.event.detail}</p>

              {o.event.kind === "estimate" && (
                <p className="muted mt-2 text-xs leading-relaxed">{o.event.basis}</p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                {o.event.href && (
                  <Link href={o.event.href} className="font-semibold text-brand-ink hover:underline">
                    Read the rules →
                  </Link>
                )}
                {o.event.source && (
                  <a
                    href={o.event.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="muted hover:text-brand-ink"
                  >
                    {o.event.source.publisher} ↗
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}



