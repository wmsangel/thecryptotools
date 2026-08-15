"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { CalendarEvent } from "@/lib/events/types";
import { CATEGORY_META, expandEvents } from "@/lib/events/types";
import { daysUntil, relative, shortDate } from "@/lib/events/format";

/**
 * The next few dated events, for the homepage. Links on to /calendar for the
 * full list.
 *
 * Same two-pass rendering as CalendarView: the first render uses `buildDate` so
 * it matches the exported HTML (and so crawlers see real dates), then an effect
 * swaps in the visitor's actual today. Without that, a homepage built last week
 * would fail hydration on every visit.
 *
 * The horizon is deliberately wide (two years) and then truncated to `limit`:
 * asking for "the next four" must never come back empty just because the next
 * deadline happens to be five months out.
 */
export function CalendarPeek({
  events,
  buildDate,
  limit = 4,
}: {
  events: CalendarEvent[];
  buildDate: string;
  limit?: number;
}) {
  const [today, setToday] = useState(buildDate);
  useEffect(() => {
    const now = new Date().toISOString().slice(0, 10);
    if (now !== buildDate) setToday(now);
  }, [buildDate]);

  const upcoming = useMemo(
    () => expandEvents(events, 730, new Date(`${today}T00:00:00Z`)).slice(0, limit),
    [events, today, limit],
  );

  return (
    <ol className="space-y-2.5">
      {upcoming.map((o, i) => {
        const meta = CATEGORY_META[o.event.category];
        const soon = daysUntil(o.date, today) <= 30;
        return (
          <li key={`${o.event.id}-${o.date}-${i}`}>
            <Link
              href="/calendar"
              className={`card card-hover group flex items-start gap-3 p-4 ${
                soon ? "border-brand-500/50" : ""
              }`}
            >
              <span className="text-lg leading-none" aria-hidden>
                {meta.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-sm font-bold">
                    {o.approximate && <span className="muted font-normal">around </span>}
                    {shortDate(o.date)}
                  </span>
                  <span className="muted text-xs">{relative(o.date, today)}</span>
                </div>
                <div className="mt-0.5 truncate text-sm group-hover:text-brand-ink">
                  {o.event.country && <span className="mr-1">{o.event.country.flag}</span>}
                  {o.event.title}
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
