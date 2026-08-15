import type { ToolFaqItem } from "@/lib/tools/types";

/**
 * FAQ rendered as native <details> for accessibility + zero JS. The matching
 * JSON-LD FAQPage schema is emitted separately on the tool page for rich results.
 */
export function FaqSection({ faq }: { faq: ToolFaqItem[] }) {
  if (!faq.length) return null;
  return (
    <section className="mt-12">
      <h2 className="mb-5 text-2xl font-extrabold tracking-tight sm:text-3xl">
        Frequently asked questions
      </h2>
      <div className="space-y-3">
        {faq.map((item, i) => (
          <details key={i} className="card group px-5 py-4">
            <summary className="cursor-pointer list-none font-medium marker:content-none">
              <span className="mr-2 text-brand-ink group-open:hidden">＋</span>
              <span className="mr-2 hidden text-brand-ink group-open:inline">－</span>
              {item.q}
            </summary>
            <p className="mt-2 text-sm muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
