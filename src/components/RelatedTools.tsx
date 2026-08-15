import type { ToolConfig } from "@/lib/tools/types";
import { ToolCard } from "./ToolCard";

export function RelatedTools({
  tools,
  title = "Related tools",
}: {
  tools: ToolConfig[];
  title?: string;
}) {
  if (!tools.length) return null;
  return (
    <section className="mt-12">
      <h2 className="mb-5 text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <ToolCard key={t.slug} tool={t} />
        ))}
      </div>
    </section>
  );
}
