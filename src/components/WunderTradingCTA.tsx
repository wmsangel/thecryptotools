import { platforms } from "@/lib/platforms";
import { platformLink } from "@/lib/affiliate";

/**
 * Disclosed CTA for WunderTrading — a third-party automation platform (DCA,
 * grid, copy-trading) that connects to your exchange via API.
 *
 * Deliberately separate from the "free built-in bot" exchange CTA (botPartners
 * in affiliate.ts): WunderTrading is a dedicated subscription product, so it
 * gets its own honest framing and a risk disclaimer rather than the
 * "no-subscription, built-in" wording, which would be a false claim here.
 *
 * Routes through /go/wundertrading (rel="sponsored", data-affiliate → GA4
 * affiliate_click) via platformLink. Renders nothing unless the platform has a
 * real referral link in platforms.ts, so it is safe to place before the link
 * exists — it simply stays invisible, then lights up.
 */
export function WunderTradingCTA({
  placement = "wundertrading",
  className = "",
}: {
  /** GA attribution slot, e.g. "dca-lab" or "tool-grid-calculator". */
  placement?: string;
  className?: string;
}) {
  const p = platforms.find((x) => x.slug === "wundertrading");
  if (!p) return null;
  const link = platformLink(p);
  if (!link.sponsored) return null;

  return (
    <section className={`mt-12 rounded-2xl border border-brand-500/30 bg-brand-500/5 p-6 ${className}`}>
      <div className="text-xs font-semibold uppercase tracking-wide text-brand-ink">Partner · Ad</div>
      <h2 className="mt-1 text-xl font-bold">Automate this strategy with a bot</h2>
      <p className="muted mt-1 text-sm leading-relaxed">
        WunderTrading connects to your exchange via API to run DCA, grid and copy-trading bots from one
        dashboard. Your funds stay on the exchange you already use.
      </p>
      <a
        href={link.href}
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
        data-affiliate={p.slug}
        data-affiliate-placement={placement}
        className="btn-primary mt-4"
      >
        Try WunderTrading →
      </a>
      <p className="muted mt-3 text-[11px] leading-snug">
        Automated trading carries risk, including loss of capital — a bot does not guarantee profit, and
        past results do not predict future returns. For information only, not financial advice.
      </p>
      <p className="muted mt-2 text-[11px] leading-snug">
        Partner link — we may earn a commission at no extra cost to you. See our{" "}
        <a href="/affiliate-disclosure" className="underline hover:text-brand-ink">affiliate disclosure</a>.
      </p>
    </section>
  );
}
