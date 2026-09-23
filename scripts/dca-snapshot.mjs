/**
 * Снимок живого фида DCA-стратегий в src/lib/dca/snapshot.json ПЕРЕД сборкой.
 * Страницы /dca/<slug>/ читают его синхронно (детерминированно для всех
 * билд-воркеров Next) — из него берутся набор страниц, метаданные и sitemap.
 * Живые числа страница дотягивает на клиенте. Один фетч на весь билд.
 *
 * При ошибке фетча: сохраняем существующий снапшот (не затираем свежие данные
 * прошлого билда); если файла ещё нет — пишем пустой (страницы упадут на образец).
 */
import { existsSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const URL = "https://dca-status.ocrsnip.workers.dev/status";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "lib", "dca", "snapshot.json");

try {
  const r = await fetch(URL, { headers: { "User-Agent": "thecryptotools-build/1.0" } });
  const d = await r.json();
  if (Array.isArray(d?.variants) && d.variants.length) {
    writeFileSync(OUT, JSON.stringify({ updated_at: d.updated_at ?? null, variants: d.variants }));
    console.log(`dca-snapshot: ${d.variants.length} variants → snapshot.json`);
  } else {
    throw new Error("empty feed");
  }
} catch (e) {
  if (existsSync(OUT)) {
    console.warn(`dca-snapshot: fetch failed (${e.message}) — keeping existing snapshot.json`);
  } else {
    writeFileSync(OUT, JSON.stringify({ updated_at: null, variants: [] }));
    console.warn(`dca-snapshot: fetch failed (${e.message}) — wrote empty snapshot.json`);
  }
}
