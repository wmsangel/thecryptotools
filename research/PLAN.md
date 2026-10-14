# thecryptotools.com — план

Источник правды по задачам. Идеи не в работе — `research/IDEAS.md`; монетизация — `research/ADVERTISING.md`.
Витрина (приватный URL на Cloudflare): https://thecryptotools.com/roadmap/e453ac4fcb/ — обновлять вместе с планом (`npm run deploy:pages`). Запинённый артефакт-зеркало: https://claude.ai/artifact/FtKLTMmavU5LvG1vJX1MAa.

## Очередь
Порядок = приоритет (не дата).

1. **Собрать fee-compare бирж/кошельков с фильтрами** — расширить `/exchanges` в сравнение комиссий с фильтрами (модель Cryptotesters); каждая строка → наш `/go/<биржа>` = прямой партнёрский лид-ген. Данные: курируемый датированный снапшот maker/taker по топ-биржам («as of \<дата\>» + ссылка на живой тариф), НЕ выдумывать. ⏸️ ждёт выбор источника данных (A снапшот / B без чисел). `деньги`
2. **Собрать лендинг «crypto tax calculator» + страновой угол** — free-калькулятор-лендинг как лид-магнит к CSV-tax-тулу (топ-канал Koinly/CoinLedger); 30 страновых tax-гайдов уже есть. `деньги`
3. **Добить DCA-лаб** — авто-описания на ~35 конфиг-страниц (абзац из данных: best/worst-монета, агрессивность, циклы), сортируемая таблица «across coins» на уровне лаба, цена/конфиг в CTA «Set it up». `контент`
4. **Батч утилитарных калькуляторов** — bridge fee, NFT mint cost, HODL-vs-Sell, stablecoin interest. Дешёвые вечнозелёные SEO-крючки под конкретные фразы, каждый несёт партнёрский CTA. `контент`
5. **Altcoin Season Index** — простой self-update виджет (как Fear&Greed), вечнозелёный, шарабельный, магнит внутренней перелинковки. `контент`
6. **Добить покрытие GA4-событий** — вывести `spotlight_click` в дневной отчёт + DCA-события (`dca_strategy_view`/`dca_exchange_click`/`dca_setup_click`) + навигация (`search`/`category_filter`/`guide_scroll`). Видимость монетизации и спроса. `инфра`
7. **Понизить Cache-TTL для `/sitemap.xml`** — правило в `public/_headers` (`max-age=300, must-revalidate`); edge Cloudflare отдаёт устаревший sitemap после деплоя. Мелко, но убирает «старый sitemap». `инфра`
8. **Перепроверить trailing-slash canonical на coin×tool** — без слэша → 301 на слэш, sitemap/внутр. ссылки только со слэшем; переотправить sitemap в GSC. `индексация`
9. **ETF-flows / crypto-treasuries трекеры** — трендовые темы, мало конкуренции среди тул-сайтов. ⚠️ Нужен надёжный бесплатный источник данных (притоки ETF / компании с BTC) — проверить ДО старта; без источника не делаем (не фабрикуем). `контент`

## Сделано
За ~2 недели, свежее сверху.
- DCA slug-коллизии: стабильный хэш вместо order-зависимого `-x` (5 баз, classic — 16 конфигов); старые → 301 на /dca — 2026-10-14 `bc6b3e5`
- Amazon Associates (`thecryptotools-20`): книги (/glossary) + гир безопасности (2 гайда), тег/дисклеймер/nofollow — 2026-10-14 `8949512`
- Партнёрки кабинет-аудит (Indoleads): TradingView → правильная source-ссылка; Crypto.com/ExpressVPN верны; US-forbidden по Crypto.com — 2026-10-13 `028c307`
- Распознавание реф-ссылок Trezor (refr.cc) и MEXC (promote.mexc.com/b/) — две скрытые реф-ссылки заработали в CTA — 2026-10-12 `f32a7a4`
- Витрина вынесена на Cloudflare (приватный путь, noindex) + корневой `HUB.md` для сетевого пульта — 2026-10-09/12 `f3cb183`
- Доки PLAN/IDEAS/ADVERTISING приведены к сетевому канону; витрина в графитовом стиле — 2026-10-09 `7997e44`
- Самоописание проекта для сети `research/SELF-DESCRIPTION.md` — 2026-10-12
- Партнёрки Crypto.com + ExpressVPN (Indoleads CPA); ссылки на трекер владельца — 2026-10-09 `a717a1c`
- Реестр рекламы `research/ADVERTISING.md` — полный инвентарь офферов/сети/nofollow — 2026-10-09 `fec947e`
- 2-й OCRSnip do-follow кросс-линк в гайде по крипто-налогам — 2026-10-08 `3bac030`
- Spotlight — ротационный внутренний промо на главной (10 продуктов, по неделям) — 2026-10-08 `664169d`
- Стейкинг: секция «staking yield vs L2/restaking» в ETH-гайде — 2026-10-08 `894bf43`
- Grid бэктест на истории `/grid-trading-backtest/` + сравнение с buy-and-hold — 2026-10-08 `2b46e9a`
- Бот-CTA: grid/dca-калькуляторы → биржи-с-ботами (Bitget/Bybit/Binance), +Pionex — 2026-10-08 `3b98811`
- Контекстные кросс-ссылки Tier 1: OCRSnip + CostTrek (do-follow) — 2026-10-08 `b435803`
- Крипто-глоссарий `/glossary/` (31 термин, 53 внутр. ссылки) — 2026-10-06

## Заметки

**Стратегия.** Продвижение — только органика; платёжные рельсы ограничены (ИП КГ). **Bing — наш канал кликов**; Google: потолок = позиция/авторитет, беклинки — рычаг владельца (с 2026-08-19 показывает почти только главную). Монетизация: партнёрки + house-ads (AdSense на паузе). Тонкие страницы не плодим. Приоритеты: (1) деньги/партнёрки, (2) защита рейтингов от тонкого контента, (3) новые вечнозелёные крючки, (4) видимость через GA4.

**Паркинг — сторона владельца (не наши запуски):**
- **Беклинки / outreach** — реальный потолок Google; linkbait готов (research-студии correlation/seasonality/drawdowns/unlocks) — шарить в Reddit/HN/X/журналистам.
- **AdSense** NEEDS_ATTENTION — наша сторона готова; открыть карточку «Требует внимания» в кабинете; как станет готов — `NEXT_PUBLIC_ENABLE_ADS=true` + ad-юниты.
- **GA4** — пометить conversions: `affiliate_click`, `spotlight_click`, `tax_report_export`, `dca_exchange_click`. Завести custom dimension `target` (для разбивки spotlight).
- **Cloudflare** — выключить Early Hints + удалить хвосты cPanel DNS.
- **Прямые реф-программы без ссылки** (подать → прислать): Coinbase, Gemini, Pionex, Tangem, CoinTracker, TokenTax, 3Commas, Nexo, Wirex. См. `research/ADVERTISING.md` §3.
- **izn.dca / VPS** — если бот гоняет >35 конфигов, расширить `push_status.py`, чтобы новые доходили до сайта.
- **Платёжные рельсы** (Paddle/LemonSqueezy на ИП КГ) — проверить ДО любого платного продукта.

**Данные:** GSC/Bing/GA4 — `~/Sites/izn.project.stats/context/thecryptotools.com.md`. Память — `cryptotoolkit-*`.
