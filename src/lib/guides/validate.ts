import { guides } from "./registry";
import { tools } from "@/lib/tools/registry";

/**
 * ============================================================================
 * Build-time check: every tool a guide points at actually exists.
 * ============================================================================
 * This lives in its own module rather than in `registry.ts` for a load-bearing
 * reason. `scripts/generate-llms.mjs` compiles the guides subtree in isolation
 * with `tsc --rootDir src/lib/guides` to extract guide bodies for the Markdown
 * twins, which only works while `registry.ts` and everything it reaches use
 * `import type` or stay inside that subtree. A runtime import of the tool
 * registry there drags in every tool config and breaks the llms build — so put
 * cross-registry checks HERE, never in registry.ts.
 *
 * What it catches: a tool's file name and its `slug` are allowed to differ —
 * `configs/halving-countdown.ts` declares `slug: "bitcoin-halving-countdown"` —
 * and a wrong slug fails silently in both directions. The `tool` card renders
 * nothing, and `getGuidesForTool` never matches, so the reverse "Learn more"
 * link on the tool page quietly disappears. Nobody notices until someone counts
 * the internal links. Same reasoning as the OG-card reference check in
 * `scripts/generate-og.mjs`: the reference is derived in two places, so it can
 * drift.
 *
 * Called from the /guides index page, which is always built.
 */
export function assertGuideToolRefs(): void {
  const real = new Set(tools.map((t) => t.slug));
  const broken: string[] = [];

  for (const g of guides) {
    const refs = new Set<string>(g.relatedTools);
    for (const b of g.body) {
      if (b.type === "tool") refs.add(b.slug);
      if (b.type === "cta") {
        const m = /^\/tools\/([a-z0-9-]+)\/?$/.exec(b.href);
        if (m) refs.add(m[1]);
      }
    }
    for (const slug of refs) {
      if (!real.has(slug)) broken.push(`${g.slug} -> ${slug}`);
    }
  }

  if (broken.length > 0) {
    throw new Error(
      `Guides reference ${broken.length} tool slug(s) that do not exist:\n  ${broken.join("\n  ")}\n` +
        "Check the tool's `slug:` field, not its file name — the two are allowed to differ.",
    );
  }
}
