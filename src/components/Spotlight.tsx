import Link from "next/link";
import { currentSpotlight } from "@/lib/spotlight";

/**
 * One rotating internal promo, resolved at build time from the week number (see
 * lib/spotlight.ts). A server component so the chosen item ships in the static
 * HTML as a real, crawlable internal link — no flash, no client work. Clicks are
 * attributed via `data-spotlight` by the global OutboundTracker.
 */
export function Spotlight({ className = "" }: { className?: string }) {
  const item = currentSpotlight();
  return (
    <Link
      href={item.href}
      data-spotlight={item.slug}
      className={`group block overflow-hidden rounded-2xl border border-brand-500/40 hero-glow ${className}`}
    >
      <div className="relative flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <span className="chip !px-3 !py-1 text-xs">{item.chip}</span>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
            {item.titlePre}
            <span className="text-gradient">{item.titleGradient}</span>
            {item.titlePost}
          </h2>
          <p className="muted mt-2 max-w-2xl text-sm leading-relaxed sm:text-base">{item.blurb}</p>
        </div>
        <span className="btn-primary btn-lg shrink-0 transition group-hover:translate-x-0.5">{item.cta}</span>
      </div>
    </Link>
  );
}
