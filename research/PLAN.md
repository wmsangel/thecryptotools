# thecryptotools.com — план

Источник правды по задачам. Идеи не в работе — `research/IDEAS.md`; монетизация — `research/ADVERTISING.md`.
Витрина (приватный артефакт, запинен): https://claude.ai/artifact/FtKLTMmavU5LvG1vJX1MAa — обновлять на ТОТ ЖЕ URL после каждой задачи.

## Очередь
Порядок = приоритет (не дата).

1. **Починить распознавание реф-ссылок Trezor и MEXC** — `isReferralLink` не ловит `trezorio.refr.cc` и `promote.mexc.com/b/`; две рабочие реф-ссылки не зарабатывают в CTA. Одна строка регэкспа. `деньги`
2. **Собрать fee-compare бирж/кошельков с фильтрами** — расширить `/exchanges` в сравнение комиссий с фильтрами (модель Cryptotesters); прямой партнёрский лид-ген. `деньги`
3. **Собрать лендинг «crypto tax calculator» + страновой угол** — free-калькулятор-лендинг как лид-магнит к CSV-tax-тулу (топ-канал Koinly/CoinLedger); 30 страновых tax-гайдов уже есть. `деньги`
4. **Добить хвосты DCA-лаба** — сортируемая таблица «across coins» на уровне лаба + цена/конфиг в CTA «Set it up». `контент`
5. **Перепроверить trailing-slash canonical на coin×tool** — без слэша → 301 на слэш, sitemap/внутр. ссылки только со слэшем; переотправить sitemap в GSC (не скачивался 19 дней). `индексация`

## Сделано
За ~2 недели, свежее сверху.
- Партнёрки Crypto.com + ExpressVPN (Indoleads CPA) вписаны; ссылки переключены на трекер владельца (o10o.xyz / gettracker.net) — 2026-10-09 `a717a1c`
- Реестр рекламы `research/ADVERTISING.md` — полный инвентарь офферов/сети/nofollow — 2026-10-09 `fec947e`
- 2-й OCRSnip do-follow кросс-линк в гайде how-to-do-your-crypto-taxes — 2026-10-08 `3bac030`
- Spotlight — ротационный внутренний промо на главной (10 продуктов, смена по неделям, GA `spotlight_click`) — 2026-10-08 `664169d`
- Стейкинг: секция «staking yield vs L2/restaking» в eth-гайде (кластер уже зрелый — 4 гайда + 33 per-coin) — 2026-10-08 `894bf43`
- Grid бэктест на истории `/grid-trading-backtest/` + сравнение с buy-and-hold — 2026-10-08 `2b46e9a`
- Бот-CTA: grid/dca-калькуляторы → биржи-с-ботами (Bitget/Bybit/Binance), +Pionex в каталог — 2026-10-08 `3b98811`
- Контекстные кросс-ссылки Tier 1: OCRSnip + CostTrek (do-follow, в теле) — 2026-10-08 `b435803`
- Партнёрки API-аудит (Admitad+Indoleads) + TradingView CPA — 2026-10-08 `2cba8ce`
- Крипто-глоссарий `/glossary/` (31 термин, 53 внутр. ссылки, DefinedTermSet) — 2026-10-06
- Trailing-slash: освежён lastmod coin×tool (378 URL → 09-13+) — 2026-10-06
- GA4 в дневной отчёт: affiliate_click + tool_used + 4 custom dimensions — 2026-10-05/06
- DCA-страницы: LIVE/плитки/сортировка/авто-описания/Dataset — 2026-10-05
- Индикатор-чарты: Pi Cycle Top + Stock-to-Flow + Rainbow — 2026-10-01
- Fear & Greed Index `/fear-and-greed-index/` — 2026-10-01

## Заметки

**Стратегия.** Продвижение — только органика; платёжные рельсы ограничены (ИП КГ). **Bing — наш канал кликов** (fake-wallet-simulator, стейкинг-кластер на page-1). **Google: потолок = позиция/авторитет**, беклинки — рычаг владельца; с 2026-08-19 Google показывает почти только главную (доверие/качество, не техника). Монетизация: партнёрки + house-ads (AdSense на паузе — включится, слоты сами отдадут платную рекламу). Тонкие страницы не плодим (coin×tool на паузе).

**Паркинг — сторона владельца (не наши запуски):**
- **Беклинки / outreach** — реальный потолок Google; linkbait готов (research-студии correlation 0.80 / seasonality / drawdowns / unlocks) — шарить в Reddit/HN/X/журналистам.
- **AdSense** NEEDS_ATTENTION — наша сторона готова (ads.txt, verification, Consent Mode, обязательные страницы). Открыть карточку «Требует внимания» в кабинете; как станет готов — `NEXT_PUBLIC_ENABLE_ADS=true` + ad-юниты (house-ads уступят).
- **GA4** — пометить conversions: `affiliate_click`, `spotlight_click`, `tax_report_export`, `dca_exchange_click`.
- **Cloudflare** — выключить Early Hints (засоряет 5xx) + удалить хвосты cPanel DNS (webdisk./cpanel./mail.).
- **Прямые реф-программы без ссылки** (подать → прислать): Coinbase, Gemini, Pionex, Tangem, CoinTracker, TokenTax, 3Commas, Nexo, Wirex. Детали — `research/ADVERTISING.md` §3.
- **Платёжные рельсы** (Paddle/LemonSqueezy на ИП КГ) — проверить ДО любого платного продукта.

**Данные:** GSC/Bing/GA4 — `~/Sites/izn.project.stats/context/thecryptotools.com.md`. Память — `cryptotoolkit-*`.
