/**
 * ============================================================================
 * Crypto events calendar.
 * ============================================================================
 * Built on the opposite principle to a news feed: everything here is known in
 * advance, so the page cannot rot between deploys. A news page uploaded by hand
 * is stale the next morning; a calendar of scheduled obligations is still
 * correct a year later.
 *
 * Three kinds of entry, and the distinction is what keeps it maintainable:
 *
 *  - `annual` — a rule, not a date. "31 January every year" stays true; a
 *    hardcoded "31 January 2027" quietly becomes wrong the moment it passes,
 *    and someone has to remember to edit it. Occurrences are computed forward
 *    from the rule at render time.
 *  - `once`   — a genuinely one-off dated milestone, e.g. a regime starting.
 *  - `estimate` — a date derived from something that drifts, like a halving
 *    predicted from the current block height. Always rendered as approximate.
 *
 * Every tax entry comes from our own guides, which carry their own primary
 * sources — see the guide linked from each event.
 */

export type EventCategory = "tax" | "regulation" | "network";

export interface EventSource {
  label: string;
  publisher: string;
  url: string;
}

interface EventBase {
  id: string;
  title: string;
  /** One or two sentences: what actually happens, and to whom. */
  detail: string;
  category: EventCategory;
  /** Emoji flag + country, when the event belongs to one jurisdiction. */
  country?: { flag: string; name: string };
  /** A page of ours that explains it properly. */
  href?: string;
  source?: EventSource;
}

/** Repeats on the same calendar day every year. */
export interface AnnualEvent extends EventBase {
  kind: "annual";
  /** 1-based. */
  month: number;
  day: number;
}

/** Happens once, on a known date. */
export interface OneOffEvent extends EventBase {
  kind: "once";
  date: string;
}

/** Date is derived and will drift — always shown as "around". */
export interface EstimatedEvent extends EventBase {
  kind: "estimate";
  date: string;
  /** What the estimate was computed from, shown to the reader. */
  basis: string;
}

export type CalendarEvent = AnnualEvent | OneOffEvent | EstimatedEvent;

/** A concrete dated occurrence, produced by expanding the rules above. */
export interface EventOccurrence {
  event: CalendarEvent;
  /** ISO date. */
  date: string;
  approximate: boolean;
}

const DAY = 86_400_000;
const iso = (ms: number) => new Date(ms).toISOString().slice(0, 10);

/**
 * Expand the registry into dated occurrences between today and `horizonDays`.
 *
 * Annual rules produce every occurrence in the window — which means a calendar
 * looking two years ahead correctly shows two UK deadlines, rather than one
 * and a gap.
 */
export function expandEvents(
  events: CalendarEvent[],
  horizonDays: number,
  today = new Date(),
): EventOccurrence[] {
  const from = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const to = from + horizonDays * DAY;
  const out: EventOccurrence[] = [];

  for (const event of events) {
    if (event.kind === "annual") {
      // Start a year early so an occurrence earlier this year is not missed
      // when the horizon is short and the date is just ahead.
      const startYear = new Date(from).getUTCFullYear();
      for (let y = startYear; y <= new Date(to).getUTCFullYear(); y++) {
        // Clamp to the last day of the month so 31 February cannot be written.
        const lastDay = new Date(Date.UTC(y, event.month, 0)).getUTCDate();
        const ms = Date.UTC(y, event.month - 1, Math.min(event.day, lastDay));
        if (ms >= from && ms <= to) out.push({ event, date: iso(ms), approximate: false });
      }
      continue;
    }
    const ms = Date.parse(`${event.date}T00:00:00Z`);
    if (Number.isFinite(ms) && ms >= from && ms <= to) {
      out.push({ event, date: event.date, approximate: event.kind === "estimate" });
    }
  }

  return out.sort((a, b) => a.date.localeCompare(b.date) || a.event.title.localeCompare(b.event.title));
}

export const CATEGORY_META: Record<EventCategory, { label: string; icon: string }> = {
  tax: { label: "Tax deadline", icon: "🧾" },
  regulation: { label: "Regulation", icon: "⚖️" },
  network: { label: "Network event", icon: "⛓️" },
};
