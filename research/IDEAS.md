# Идеи

Инбокс идей, не в работе. Взятое — переносится в `research/PLAN.md` → «Очередь». Формат: `- [ ] идея — зачем`.
Второй дом идей — память проекта (`~/.claude/projects/.../memory/`).

## Новые страницы / фичи (из конкурентной разведки)
- [ ] Altcoin Season Index — простой виджет, стабильный вечнозелёный трафик.
- [ ] ETF-flows трекер (притоки/оттоки спот BTC/ETH/SOL ETF) — трендово, мало конкуренции среди тул-сайтов.
- [ ] Crypto-treasuries трекер (компании, держащие BTC) — горячая тема 2025–26.
- [ ] MVRV-индикатор — нужен бесплатный on-chain источник (realized cap); из цены не посчитать.
- [ ] Multi-coin halving-countdown (не только BTC) + список активных аирдропов.
- [ ] Пер-коиновые майнинг-калькуляторы + «что майнить на GPU X» — длинный хвост.
- [ ] Утилитарные калькуляторы: bridge fee, NFT mint cost, HODL-vs-Sell, stablecoin interest — дешёвые SEO-победы под конкретные фразы.
- [ ] ⚠️ Risk-checkers (rug/memecoin/airdrop-eligibility) — только с жёсткими дисклеймерами (AdSense-риск); price-prediction пропустить (репутация/AdSense).

## DCA-лаб (хвосты)
- [ ] Уникальные описания на каждую из ~35 конфиг-страниц (путь A: авто-абзац из данных best/worst-монета, агрессивность, циклы; путь B: тексты из бот-чата izn.dca). Сейчас конфиги одного типа делят текст → риск дублей.
- [ ] Почистить slug-коллизии `-x-x-x` (`src/lib/dca/labels.ts`) — красивее URL, меньше почти-дублей; 301 со старых.
- [ ] Per-strategy OG-картинки (сейчас все стратегии используют общий `/og/dca.png`).
- [ ] Фильтр хаба по монете; keyword-research «как ищут стратегии» (dca bot results / best dca settings / grid bot roi).
- [ ] (владелец/izn.dca) расширить `push_status.py` на VPS, если бот гоняет >35 конфигов — иначе новые не доходят до сайта.

## Аналитика (GA4)
- [ ] DCA-лаб события: `dca_strategy_view{slug}`, `dca_exchange_click{platform}`, `dca_setup_click{via}`.
- [ ] Навигация: `search{query}`, `category_filter{id}`, `guide_scroll{depth}` (дочитываемость), `widget_embed_copy{tool}`.

## Кросс-ссылки Tier 2 (do-follow сеть — Tier 1 уже внедрён)
- [ ] CalcLumen ← apr-vs-apy / cagr-vs-apy — ТОЛЬКО если у них есть не-крипто математика (иначе каннибализация нашего `compound-interest-calculator`).
- [ ] izntools / iznkit ← dev-тулы (base64/hex/timestamp) — низкий приоритет (наш json-generator noindex, dev-тулы малотрафны).
- [ ] testsweep ← майнинг-контент — связь натянутая, скорее пропустить.

## Контент / гигиена
- [ ] Глоссарий: сильные термины вынести в отдельные страницы; дописать термины партиями.
- [ ] Понизить Cache-TTL для `/sitemap.xml` (`public/_headers`, `max-age=300`) — edge отдаёт устаревший sitemap после деплоя.
- [ ] cf-stats: отбрасывать часовой всплеск «один реферер google.com + ≥20 путей по 1 pv» (ложный «новый беклинк»); в `scripts/cf-stats.mjs` и `cf_stats.py`.
