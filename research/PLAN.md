# План работ — thecryptotools.com (роадмап на ~10 запусков)

_Составлен 2026-09-29. Это ОДНО место, где виден план. `research/IDEAS.md` — инбокс идей; сюда кладём отобранное и упорядоченное. Данные — GSC/Bing/GA4 (см. память проекта: cryptotoolkit-backlog, -status, -todo)._

> 📌 **ЖИВОЙ ДАШБОРД (приватный артефакт, запинен в сайдбар):** https://claude.ai/artifact/FtKLTMmavU5LvG1vJX1MAa
> Этот файл — источник правды; артефакт — витрина поверх него (`scripts`-нет, HTML в scratchpad). **ПОСЛЕ КАЖДОЙ выполненной задачи:** отметь пункт ✅ с датой / перенеси в «Сделано», занеси новые идеи в «Входящие идеи», при нужде переставь очередь — здесь И в артефакте, **переопубликовав на ТОТ ЖЕ URL** (`Artifact publish` с `url: https://claude.ai/artifact/FtKLTMmavU5LvG1vJX1MAa` — URL и пин сохраняются). Делать самому, без напоминания.

## Стратегия в одном абзаце
Продвижение — только органика, платёжные рельсы ограничены (ИП КГ). **Bing — наш канал кликов** (fake-wallet-simulator ~54 кл / 30% CTR; стейкинг-кластер на page-1). **Google: потолок = позиция/авторитет** — беклинки это рычаг владельца; с 2026-08-19 Google показывает почти только главную (вопрос доверия/качества, не техники). Монетизация пока: **партнёрки + house-ads** (AdSense на паузе; включится — слоты сами отдадут платную рекламу). Приоритеты в порядке: (1) дешёвые CTR-победы на Bing, (2) видимость монетизации через GA4, (3) новые вечнозелёные SEO-крючки из конкурентной разведки, (4) усиление того, что уже ранжируется. Тонкие страницы не плодим (coin×tool на паузе).

## Уже сделано (свежее — чтобы видеть импульс)
- ✅ **Spotlight** — ротационный внутренний промо-слот на главной (10 наших продуктов, смена по неделям, build-time, GA `spotlight_click`). Заменил хардкод-анонс DCA (2026-10-08, `664169d`)
- ✅ Стейкинг-кластер: секция «staking yield vs L2/restaking» в eth-гайде (кластер уже зрелый — 4 гайда + 33 per-coin; потолок = беклинки) (2026-10-08, `894bf43`)
- ✅ Grid бэктест на истории `/grid-trading-backtest/` — симулятор grid-бота по реальным ценам + сравнение с buy-and-hold (2026-10-08, `2b46e9a`)
- ✅ Бот-CTA монетизация: grid/dca-калькуляторы → биржи-с-ботами (Bitget/Bybit/Binance), fix isReferralLink(atid), +Pionex в каталог (2026-10-08, `3b98811`)
- ✅ Контекстные кросс-ссылки Tier 1 — OCRSnip (/crypto-tax-report) + CostTrek (moving-to-dubai), do-follow, по 1 в теле (2026-10-08, `b435803`)
- ✅ Партнёрки API-аудит: TradingView через Indoleads CPA (`2cba8ce`); Crypto.com+ExpressVPN поданы владельцем, ждём апрув (2026-10-08) — см. память cryptotoolkit-affiliate-networks
- ✅ Крипто-глоссарий `/glossary/` — 31 термин, 53 внутр. ссылки, DefinedTermSet (2026-10-06)
- ✅ Trailing-slash fix: lastmod coin×tool освежён (378 URL → 09-13+), техника вся верна (2026-10-06)
- ✅ GA4 в отчёт: affiliate_click + tool_used блоки + 4 custom dimensions заведены (2026-10-05/06)
- ✅ Партнёрки: + Proton VPN (wallet-security), + трекинг всех /go в GA4 (2026-10-05)
- ✅ DCA-страницы: LIVE/плитки/сортировка/авто-описания/Dataset (2026-10-05)
- ✅ Индикатор-чарты: Pi Cycle Top + Stock-to-Flow (+ Rainbow) — 3 страницы (2026-10-01)
- ✅ Партнёрки: 2ndNumber + is*hosting (контекстные CTA в гайдах, /go) (2026-10-01)
- ✅ Bitcoin Rainbow Chart — `/bitcoin-rainbow-chart/` (лог-регрессия, 9 полос, self-update) (2026-10-01)
- ✅ Fear & Greed Index — страница `/fear-and-greed-index/` (датчик+график+методология) (2026-10-01)
- ✅ Bing CTR quick-wins: win-rate seo.title + market-cap интент вперёд (2026-09-30)
- ✅ GA4 `affiliate_click` покрытие закрыто (DCA-CTA), проверено (2026-09-30)
- ✅ DCA: серверный эксплейнер стратегий + входы из гайдов (2026-09-29)
- ✅ House-ads на всю сеть — 16 промо (2026-09-29)
- ✅ GA4: единое `tool_used {action}` на все 69 тулов (2026-09-28, `ba84739`)
- ✅ Гайд «Crypto Airdrops Explained» (2026-09-25, `8c2d349`)
- ✅ Новое верхнее меню — 6 групп + бургер на мобиле (2026-09-25, `23eb683`)
- ✅ House-ads расширены на всю сеть — 16 промо EN+RU (2026-09-29, `3b95b1c`/`fa64790`)
- ✅ foundaday заведён в SEO-рутину (в отдельном чате про автозапуски)

## План на ~10 запусков (по порядку; отмечаем `[x]` по мере готовности)
Каждый запуск = один осмысленный шиппабл-фокус → зелёный `npm run build` → `npm run deploy:pages` → коммит; при новых URL — предложить submit в GSC. Порядок — рекомендованный, но можно тасовать под настроение/данные.

- [ ] **Trailing slash: 50 страниц `/coins/*/…-calculator`** — Google выбрал canonical БЕЗ слэша, наш canonical со слэшем (aave/algorand/aptos/avalanche profit-calculator и др.): проверить, что URL без слэша отдаёт 301 на версию со слэшем (а не 200), sitemap и внутренние ссылки — только со слэшем; sitemap не скачивался Google 19 дней — переотправить в GSC (SEO, 2026-10-01)

1. [x] ✅ **Bing CTR quick-wins** — DONE 2026-09-30. win-rate: добавлен benefit-`seo.title` (Profit Factor & Break-Even) + кейворд `crypto winrate` + sharper description; market-cap шаблон (все монеты, вкл. XRP): интент «какая цена нужна для капы X» вынесен в начало description. staking-rewards и profit-шаблон уже были хорошо оптимизированы — не трогал. _(Запросы низкочастотны — абсолютный прирост мал; главная польза — шаблон-wide.)_
2. [x] ✅ **GA4 `affiliate_click`** — DONE 2026-09-30. Оказалось, `OutboundTracker` уже шлёт `affiliate_click {platform, placement, page_path}` делегированно по `a[data-affiliate]` (смонтирован в layout). Единственный пробел — кнопки бирж в DCA-CTA — закрыт (`placement="dca-strategy"`). Проверено в браузере: клик шлёт событие.
3. [x] ✅ **Fear & Greed Index** — DONE 2026-10-01. `/fear-and-greed-index/` — SVG-датчик + плитки (сейчас/вчера/неделя/месяц) + 180-дн график + методология + FAQ (FAQPage JSON-LD). Build-snapshot alternative.me (resilient) + live-refresh на клиенте (CORS *), свежесть через daily-redeploy. В sitemap/OG/Markets-меню. Проверено в браузере. _(Altcoin Season Index — опц., в копилке.)_
4. [x] ✅ **Индикаторные чарт-страницы** — DONE 2026-10-01 (3 из 4). `/bitcoin-rainbow-chart/` (лог-регрессия, 9 полос, r² 0.86), `/pi-cycle-top-indicator/` (111-DMA × 2×350-DMA + метки кроссоверов у исторических топов), `/bitcoin-stock-to-flow/` (supply по халвингам + лог-лог модель-фит, честно показана дивергенция после 2021). Все из нашей истории BTC, SSG self-update, в sitemap/OG/Markets. Проверены в браузере. ⚠️ **MVRV** оставлен в копилке — нужен on-chain realized cap (из цены не посчитать); искать бесплатный on-chain источник или отложить.
5. [x] ✅ **Крипто-глоссарий / Learn-хаб** — DONE 2026-10-06. `/glossary/` — 31 термин по 5 категориям, определение+aliases+разбор, 53 внутренние ссылки на тулы/гайды/дата-страницы, DefinedTermSet JSON-LD, в sitemap/OG/Tools-меню. Хаб-first (без тонких per-term страниц). Хвост: сильные термины позже вынести в отдельные страницы; дописать ещё терминов партиями.
6. [x] ✅ **Контекстные кросс-ссылки Tier 1** — DONE 2026-10-08 (`b435803`). OCRSnip в «What your CSV needs» на `/crypto-tax-report/` (анкор «convert a PDF statement into a spreadsheet») + CostTrek в «What it costs to live there» гайда `moving-to-dubai-for-crypto` (анкор «compare the cost of living in Dubai with your current city»). Обе do-follow (`rel="noopener"`, без nofollow), по 1 в теле, естественным анкором, показаны владельцу и утверждены ДО внедрения. Проверено в билде. _Хвост: Tier 2 (CalcLumen ← apr-vs-apy — только если у них есть не-крипто математика, иначе каннибализация; izntools/iznkit ← dev-тулы — низкий приоритет) — в IDEAS._
7. [~] **Grid/DCA бэктест-угол + бот-CTA** · monetization · M. — ЧАСТИЧНО.
   - [x] ✅ **Бот-CTA разблокирован** 2026-10-08 (`3b98811`): `isReferralLink` распознаёт `atid` (Cryptohopper); бот-CTA на grid/dca-bot-калькуляторах теперь = биржи со встроенными бесплатными grid/DCA-ботами (Bitget/Bybit/Binance — где юзер и запускает стратегию, и где мы уже зарабатываем), честная рамка (no API keys / no subscription). Pionex добавлен в каталог homepage-заглушкой (реф у владельца нет — впишется позже). Ревизия: у владельца НЕТ реф-ссылок Pionex/3Commas (проверено в репо, конфигах, каталогах Admitad/Indoleads) — recurring-угол закрыт биржами-с-ботами на существующих ссылках.
   - [x] ✅ **Grid бэктест на истории** — DONE 2026-10-08 (`2b46e9a`). `/grid-trading-backtest/` — симулятор spot-grid по реальным дневным закрытиям (opening position + resting buys, лимит-филлы по линии, комиссия на обе ноги, консервативно по дневкам). Показывает realized grid-profit, открытую позицию, time-in-range, просадку и **сравнение с buy-and-hold** (ключевая метрика). `grid-engine.ts` отдельно от lump/dca-движка. WebApplication+FAQPage JSON-LD, бот-CTA, двусторонние кросс-ссылки с grid-калькулятором и grid-гайдом, в sitemap/OG/Markets-меню. Проверено в браузере (математика сходится: hold точный, conservation профита, знак vs-hold верный). Таргет «grid bot backtest».
   - [ ] **Хвосты DCA-лаба** — сортируемая таблица «across coins» на уровне лаба + цена/конфиг в CTA «Set it up». _(мелочь; можно закрыть в следующий заход или вместе с #8)_
8. [x] ✅ **Усиление стейкинг-кластера** — DONE 2026-10-08 (`894bf43`). Ревизия: кластер УЖЕ зрелый — 4 гайда (eth-staking с секцией «pool vs solo side-by-side», liquid-staking, what-is-staking, crypto-staking-and-earning), staking-rewards-calculator + **33 per-coin стейкинг-страницы** с реальными defaultApr/how/lockup (HBAR/BNB покрыты), все хорошо SEO-оптимизированы. Потолок — позиция/авторитет (беклинки владельца), не контент. Закрыл единственный реальный контентный пробел: секция **«Staking yield vs L2 and restaking yield»** в eth-staking-guide (запрос «ethereum's staking yield vs l2 yield», поз 6.14) — нативный стейкинг как risk-free rate ETH vs L2-DeFi vs EigenLayer-рестейкинг, +FAQ +2 кейворда +ссылки на /coins/arbitrum|optimism. Не плодил тонкое. _Хвост: pool-vs-solo (поз 5.81) и liquid-staking (поз 4.90) — контент/title уже сильные, нужен ТОЛЬКО авторитет → беклинки (паркинг владельца)._
9. [ ] **Fee-compare бирж/кошельков с фильтрами** · monetization · M.
   Расширить `/exchanges` в сравнение комиссий с фильтрами (модель Cryptotesters) — прямой партнёрский лид-ген.
10. [ ] **Tax-калькулятор лендинг + страны** · content/monetization · M.
    Free «crypto tax calculator» лендинг + доработать угол по странам (топ-SEO-канал Koinly/CoinLedger) — лид-магнит к нашему tax-тулу + партнёрки налоговиков. (30 страновых tax-гайдов уже есть → добрать «калькулятор»-лендинг.)

## Паркинг / на стороне владельца (не наши запуски, держим в виду)
- **Беклинки / outreach** — реальный потолок Google. Linkbait уже готов: research-студии (correlation 0.80 / seasonality / drawdowns / unlocks) — их надо шарить (Reddit/HN/X/журналисты).
- **AdSense `NEEDS_ATTENTION`** (2026-10-06): наша сторона проверена и полностью готова — ads.txt верный, verification-скрипт в `<head>` каждой страницы, Consent Mode, все обязательные страницы (Privacy/About/Contact/Terms/Affiliate-disclosure) есть и в футере. Причина `NEEDS_ATTENTION` + 0 показов — в кабинете AdSense (ревью / выплаты-аккаунт / «малоценный контент» = та же Google-quality проблема / Auto-ads выкл.). **Владелец:** открыть карточку «Требует внимания» в AdSense — там точная причина. Как станет «готов» — включить `NEXT_PUBLIC_ENABLE_ADS=true` + повесить ad-юниты (house-ads уступят автоматически).
- **GA4 → пометить conversions** в интерфейсе GA4: `affiliate_click`, `tax_report_export`, `donate_cta_click`, `feedback_click`, `dca_exchange_click`.
- **Cloudflare** — выключить Early Hints (засоряет 5xx-статистику) + удалить хвосты cPanel DNS (webdisk./cpanel./mail.).
- **«Google только главная» (08-19)** — глянуть в GSC индекс (vs 502 на 08-17) и «Меры, принятые вручную»; лечение = беклинки + noindex тонких coin×tool, а не правки title.
- **Платёжные рельсы** (Paddle/LemonSqueezy на ИП КГ) — проверить ДО любого платного продукта (первый цифровой продукт на LemonSqueezy — отдельная инициатива).

## Остальной инбокс (поднимаем сюда по мере разбора 10 выше)
ETF-flows трекер · crypto-treasuries трекер · per-coin mining-калькуляторы · multi-coin halving-countdown · утилитарные калькуляторы (bridge fee, NFT mint, HODL-vs-Sell, stablecoin interest) · остальные GA4-события (DCA-лаб, search/category/guide-scroll) · per-strategy OG для DCA · keyword-research «как ищут стратегии». Полный список — `research/IDEAS.md`.
