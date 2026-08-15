/**
 * Date formatting shared by the calendar page and the homepage peek.
 *
 * Every function takes `today` as an argument rather than reading the clock.
 * On a statically exported site the HTML is generated on one day and read on
 * another, so the caller decides which day it is rendering for — see the
 * hydration note in CalendarView.
 */

export function daysUntil(iso: string, today: string): number {
  return Math.round((Date.parse(`${iso}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000);
}

export function longDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function shortDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function relative(iso: string, today: string): string {
  const d = daysUntil(iso, today);
  if (d <= 0) return "today";
  if (d === 1) return "tomorrow";
  if (d < 14) return `in ${d} days`;
  if (d < 60) return `in ${Math.round(d / 7)} weeks`;
  if (d < 730) return `in ${Math.round(d / 30)} months`;
  return `in ${(d / 365).toFixed(1)} years`;
}
