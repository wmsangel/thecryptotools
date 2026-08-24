import { partnersForGuide, GUIDE_AFFILIATE_COPY, type GuideAffiliateKind } from "@/lib/affiliate";

/**
 * A disclosed, context-appropriate partner CTA for a guide. Renders nothing
 * unless a partner in the guide's category actually has a referral link in
 * platforms.ts — so tagging a wallet/tax guide before signing up is harmless;
 * it simply stays invisible until the link exists, then lights up.
 */
export function GuideAffiliateCTA({
  kind,
  placement,
}: {
  kind: GuideAffiliateKind;
  /** GA attribution slot; defaults to guide-<kind>. Pass e.g. tool-<slug> on tool pages. */
  placement?: string;
}) {
  const picks = partnersForGuide(kind, 3);
  if (picks.length === 0) return null;
  const [primary, ...alts] = picks;
  const { heading, verb } = GUIDE_AFFILIATE_COPY[kind];
  const slot = placement ?? `guide-${kind}`;

  return (
    <section className="mt-12 rounded-2xl border border-brand-500/30 bg-brand-500/5 p-6">
      <div className="text-xs font-semibold uppercase tracking-wide text-brand-ink">Partner</div>
      <h2 className="mt-1 text-xl font-bold">{heading}</h2>
      <p className="muted mt-1 text-sm leading-relaxed">{primary.bonus}</p>
      <a
        href={primary.url}
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
        data-affiliate={primary.slug}
        data-affiliate-placement={slot}
        className="btn-primary mt-4"
      >
        {verb} {primary.name} →
      </a>
      {alts.length > 0 && (
        <p className="muted mt-3 text-xs">
          Also:{" "}
          {alts.map((a, i) => (
            <span key={a.slug}>
              {i > 0 && " · "}
              <a
                href={a.url}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                data-affiliate={a.slug}
                data-affiliate-placement={slot}
                className="font-semibold text-brand-ink hover:underline"
              >
                {a.name}
              </a>
            </span>
          ))}
        </p>
      )}
      <p className="muted mt-3 text-[11px] leading-snug">
        Partner links — we may earn a commission at no extra cost to you. See our{" "}
        <a href="/affiliate-disclosure" className="underline hover:text-brand-ink">affiliate disclosure</a>.
      </p>
    </section>
  );
}
