import { AMAZON_PICKS, amazonUrl, type AmazonTopic } from "@/lib/amazon";

/**
 * Native Amazon Associates block: a short list of tracked text links plus the
 * required disclosure. No prices, no images (Amazon policy / PA-API gated).
 * Clicks are attributed by the global OutboundTracker via data-affiliate.
 */
export function AmazonPicks({ topic, placement }: { topic: AmazonTopic; placement?: string }) {
  const block = AMAZON_PICKS[topic];
  if (!block) return null;
  const slot = placement ?? `amazon-${topic}`;

  return (
    <section className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--bg-subtle)] p-6">
      <div className="text-xs font-semibold uppercase tracking-wide text-brand-ink">Amazon picks</div>
      <h2 className="mt-1 text-xl font-bold">{block.heading}</h2>
      <ul className="mt-4 space-y-3">
        {block.items.map((p) => (
          <li key={p.title} className="leading-relaxed">
            <a
              href={amazonUrl(p.q)}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              data-affiliate="amazon"
              data-affiliate-placement={slot}
              className="font-semibold text-brand-ink hover:underline"
            >
              {p.title}
            </a>
            <span className="muted"> — {p.by}. {p.blurb}</span>
          </li>
        ))}
      </ul>
      <p className="muted mt-4 text-[11px] leading-snug">
        As an Amazon Associate we earn from qualifying purchases, at no extra cost to you. Prices and
        availability are shown on Amazon. See our{" "}
        <a href="/affiliate-disclosure" className="underline hover:text-brand-ink">affiliate disclosure</a>.
      </p>
    </section>
  );
}
