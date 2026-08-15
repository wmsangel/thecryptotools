import Link from "next/link";
import type { ToolConfig } from "@/lib/tools/types";
import { categories } from "@/lib/categories";
import { FavoriteButton } from "./FavoriteButton";

export function ToolCard({ tool, large = false }: { tool: ToolConfig; large?: boolean }) {
  const cat = categories[tool.category];
  return (
    // The star must live outside the <Link> (no interactive content inside an
    // anchor), so the card is a positioned wrapper holding both.
    <div className="group/card relative h-full">
      <FavoriteButton slug={tool.slug} title={tool.title} />
      <Link
        href={`/tools/${tool.slug}`}
        className={`card card-hover group flex h-full flex-col ${large ? "p-7" : "p-5"}`}
      >
        <div className="flex items-center gap-3 pr-8">
          <span className={large ? "icon-badge h-14 w-14 text-2xl" : "icon-badge h-11 w-11 text-xl"}>
            {cat.icon}
          </span>
          <span className="chip !px-2.5 !py-0.5 text-xs">{cat.label}</span>
          {tool.source === "ai" && (
            <span className="ml-auto rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] font-semibold text-brand-ink">
              AI
            </span>
          )}
        </div>
        <h3 className={`mt-4 font-bold group-hover:text-brand-ink ${large ? "text-xl" : "text-lg"}`}>
          {tool.title}
        </h3>
        <p className={`muted mt-2 line-clamp-2 leading-relaxed ${large ? "text-[15px]" : "text-sm"}`}>
          {tool.description}
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-ink opacity-0 transition group-hover:opacity-100">
          Open tool →
        </span>
      </Link>
    </div>
  );
}
