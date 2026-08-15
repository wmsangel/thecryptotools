import Link from "next/link";
import type { ToolConfig } from "@/lib/tools/types";
import { categories } from "@/lib/categories";
import { site } from "@/lib/site";

/**
 * Unique, crawlable on-page content generated from the tool's own config.
 * Because every tool has different inputs, labels and category, each page gets
 * genuinely distinct prose — good for SEO without hand-writing copy per tool.
 */
export function ToolSeoContent({
  tool,
  related,
}: {
  tool: ToolConfig;
  related: ToolConfig[];
}) {
  const cat = categories[tool.category];
  const steps = tool.inputs.filter((i) => i.type !== "select");
  const linkTools = related.slice(0, 3);

  return (
    <section className="mt-12 max-w-3xl">
      <h2 className="mb-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
        How to use the {tool.title}
      </h2>
      <ol className="space-y-2">
        {steps.map((input, idx) => (
          <li key={input.name} className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-xs font-bold text-brand-ink">
              {idx + 1}
            </span>
            <span className="muted">
              Enter your <strong className="text-[var(--text)]">{input.label ?? input.name}</strong>
              {input.suffix ? ` (in ${input.suffix})` : ""}
              {input.help ? ` — ${input.help}` : "."}
            </span>
          </li>
        ))}
        <li className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-xs font-bold text-brand-ink">
            {steps.length + 1}
          </span>
          <span className="muted">
            The result and full breakdown update <strong className="text-[var(--text)]">instantly</strong> — no
            signup, no waiting, and your numbers never leave your browser.
          </span>
        </li>
      </ol>

      <h2 className="mb-3 mt-10 text-2xl font-extrabold tracking-tight sm:text-3xl">
        About the {tool.title}
      </h2>
      <p className="muted leading-relaxed">
        {tool.description} It&apos;s a free tool in our{" "}
        <Link href={`/category/${cat.id}`} className="text-brand-ink hover:underline">
          {cat.title.toLowerCase()}
        </Link>{" "}
        collection on {site.name}, runs entirely in your browser, and works on mobile.
        {linkTools.length > 0 && (
          <>
            {" "}
            If you found it useful, try{" "}
            {linkTools.map((t, i) => (
              <span key={t.slug}>
                <Link href={`/tools/${t.slug}`} className="text-brand-ink hover:underline">
                  {t.title}
                </Link>
                {i < linkTools.length - 1 ? (i === linkTools.length - 2 ? " and " : ", ") : "."}
              </span>
            ))}
          </>
        )}
      </p>
    </section>
  );
}
