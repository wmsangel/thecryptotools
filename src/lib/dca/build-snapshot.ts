import snapshot from "./snapshot.json";
import { buildGroups, type StrategyGroup } from "./labels";
import type { DcaStatus } from "./types";
import { SAMPLE_STATUS } from "./sample";

/**
 * Набор стратегий для статических страниц /dca/<slug>/, их метаданных и sitemap.
 * Источник — snapshot.json, который пишет scripts/dca-snapshot.mjs ПЕРЕД сборкой
 * (один фетч на билд, детерминированно для всех воркеров Next). Живые числа
 * страница дотягивает на клиенте. Пустой снапшот → падаем на встроенный образец.
 */
export function getStrategyGroups(): StrategyGroup[] {
  const vs = (snapshot as DcaStatus).variants;
  return buildGroups(vs && vs.length ? vs : SAMPLE_STATUS.variants);
}
