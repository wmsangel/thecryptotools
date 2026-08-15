import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { absoluteUrl, site } from "@/lib/site";
import { getTool, tools } from "@/lib/tools/registry";
import { ToolEngine } from "@/components/ToolEngine";
import { EmbedFrame } from "@/components/embed/EmbedFrame";

export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map((t) => ({ tool: t.slug }));
}

export function generateMetadata({ params }: { params: { tool: string } }): Metadata {
  const tool = getTool(params.tool);
  if (!tool) return {};
  return {
    title: `${tool.title} — embedded`,
    description: tool.seo.description,
    // Canonical points at the real page, so any signal the widget picks up is
    // consolidated there rather than competing with it.
    alternates: { canonical: absoluteUrl(`/tools/${tool.slug}`) },
    robots: { index: false, follow: true },
  };
}

/**
 * The bare widget. Loaded inside an iframe on someone else's site.
 *
 * It is the same ToolEngine the real page uses — one implementation, so an
 * embedded calculator can never drift from the canonical one.
 */
export default function Page({ params }: { params: { tool: string } }) {
  const tool = getTool(params.tool);
  if (!tool) notFound();

  return (
    <EmbedFrame>
      <div className="p-4">
        <h1 className="text-lg font-extrabold tracking-tight">{tool.title}</h1>
        <p className="muted mt-1 text-xs leading-relaxed">{tool.description}</p>

        <div className="mt-4">
          <ToolEngine slug={tool.slug} />
        </div>

        {/* The attribution inside the frame is for the person looking at it.
            The link that matters to us is the one in the host page's own HTML,
            which the snippet on /widgets supplies — a link inside an iframe is
            a link from our document to our document. */}
        <p className="mt-4 border-t border-[var(--border)] pt-3 text-center text-xs muted">
          <a
            href={`${site.url}/tools/${tool.slug}/?utm_source=embed`}
            target="_blank"
            rel="noopener"
            className="font-semibold text-brand-ink hover:underline"
          >
            {tool.title}
          </a>{" "}
          by {site.name}
        </p>
      </div>
    </EmbedFrame>
  );
}
