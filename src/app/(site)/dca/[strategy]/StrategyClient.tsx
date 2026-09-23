"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { DcaStatus } from "@/lib/dca/types";
import { DCA_STATUS_URL, buildGroups, type StrategyGroup } from "@/lib/dca/labels";
import { StrategyDetail } from "../StrategyDetail";

/**
 * Рендерит стратегию по slug. Стартует с билд-снапшота (initial) — это и есть
 * серверный HTML для краулеров, — затем на клиенте тянет живой /status и
 * обновляет цифры. Если стратегии сейчас нет в фиде — оставляет снапшот.
 */
export function StrategyClient({ slug, initial }: { slug: string; initial: StrategyGroup | null }) {
  const [group, setGroup] = useState<StrategyGroup | null>(initial);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch(DCA_STATUS_URL, { cache: "no-store" });
        const d: DcaStatus = await r.json();
        if (!alive || !Array.isArray(d?.variants) || !d.variants.length) return;
        const g = buildGroups(d.variants).find((x) => x.slug === slug);
        if (g) setGroup(g);
      } catch { /* keep the build snapshot */ }
    })();
    return () => { alive = false; };
  }, [slug]);

  if (!group) {
    return (
      <div>
        <Link href="/dca/" className="text-sm font-semibold text-brand-ink hover:underline">← All strategies</Link>
        <p className="mt-6 text-[var(--muted)]">This strategy isn&apos;t in the live feed right now — see all running strategies.</p>
      </div>
    );
  }
  return <StrategyDetail group={group} />;
}
