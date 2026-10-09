# Реклама и монетизация — thecryptotools.com

_Единый реестр: партнёрки (где размещены, куда подать), внутренняя сеть (house-ads + do-follow кросс-ссылки), Spotlight, политика nofollow/do-follow, AdSense. Источник правды — держим актуальным. Обновлено 2026-10-09._

> Связанные: [`research/PLAN.md`](PLAN.md) (роадмап), [`research/IDEAS.md`](IDEAS.md) (инбокс), память `cryptotoolkit-affiliate-networks`.

---

## 0. Принципы

- **Честность:** `bonus`-текст у партнёрки = реальный оффер, не выдумываем (FTC/Google требуют точности).
- **Эко-деплой:** правки собираем локально, пушим только по подтверждению владельца.
- **nofollow vs do-follow:** все ВНЕШНИЕ партнёрские/рекламные ссылки — `rel="sponsored nofollow noopener noreferrer"`. Исключение — do-follow **контекстные** кросс-ссылки на САЙТЫ НАШЕЙ СЕТИ (раздел 7) — они специально передают авторитет. Внутренние ссылки (Spotlight, /go-пути) — do-follow по определению.
- **Монетизация-приоритет:** деньги на крипто-сайте в порядке важности — (1) **AdSense** (раздел 10, пока заблокирован), (2) **прямые реф-программы бирж** (раздел 2), (3) 1–2 lead-gen из сетей (раздел 5). Крипто-полки Admitad/Indoleads почти пусты.

---

## 1. Как технически устроены ссылки

| Механизм | Где | Файл | rel |
|---|---|---|---|
| **Платформы** (биржи/кошельки/налоги/боты/карты) | страница `/exchanges` + контекстные CTA на тулах/гайдах | `src/lib/platforms.ts` → `/go/<slug>` (авто-редирект) | `sponsored nofollow` |
| **Сетевые офферы** (вне platforms) | в теле гайдов, анкором | ручные строки в `public/_redirects` → `/go/<slug>` | внутренняя ссылка на `/go/` (do-follow), дальше 302 на партнёрку |
| **House-ads** (кросс-промо сети) | ad-слоты (leaderboard/sidebar), ротация, язык-таргет | `src/lib/house-ads.ts` + `AdSlot.tsx` | `sponsored nofollow` |
| **Do-follow кросс-ссылки** | в теле 2 страниц | прямо в контенте | `noopener noreferrer` (**do-follow**) |
| **Spotlight** | баннер на главной, ротация по неделям | `src/lib/spotlight.ts` + `Spotlight.tsx` | внутренняя `<Link>` (do-follow) |

`/go/<slug>` даёт: единый трекинг кликов в edge-аналитике Cloudflare, один домен в разметке, лёгкая замена ссылки в одном месте. Клики шлются в GA4 (`affiliate_click` / `spotlight_click`) через `OutboundTracker`.
`isReferralLink()` в `src/lib/affiliate.ts` решает, «зарабатывает ли» ссылка (реф vs голый homepage) — влияет на то, попадёт ли платформа в контекстные CTA. Знает параметры `ref/r/invite/join/via/aff/fpr/partner/atid/subid` + хосты-трекеры `o10o.xyz`, `gettracker.net`.

---

## 2. Партнёрки — РАЗМЕЩЕНО и зарабатывает (прямые реф-программы)

Все в `platforms.ts`, идут через `/go/<slug>`, на /exchanges + в релевантных CTA. rel = `sponsored nofollow`.

### Биржи
| Бренд | /go | Реф-ссылка |
|---|---|---|
| Binance | /go/binance | `…?ref=GRO_28502_02FFT` |
| Bybit | /go/bybit | `…?ref=YKGOVN` |
| OKX | /go/okx | `okx.com/join/40057496` |
| Kraken | /go/kraken | `invite.kraken.com/JDNW/…` |
| KuCoin | /go/kucoin | `…?rcode=CXEENPVN` |
| Bitget | /go/bitget | `partner.bitget.com/bg/D8AALB` |
| Gate.io | /go/gate-io | `…/invite/A1URB1oM` |
| HTX | /go/htx | `…?invite_code=ictte223` |
| Bitfinex | /go/bitfinex | `…?refcode=zlUb_U9lm` |
| **Crypto.com** | /go/crypto-com | `o10o.xyz/6ac88e093361d` (трекер владельца → Indoleads CPA, cookie 372д) |

### Кошельки
| Бренд | /go | Реф-ссылка |
|---|---|---|
| Ledger | /go/ledger | `shop.ledger.com/?r=c5f06eb56aa8` |
| SafePal | /go/safepal | `…?ref=ntllyzu` |
| ⚠️ Trezor | /go/trezor | `trezorio.refr.cc/default/u/igorzagorodnyi` — **реф-ссылка, но `isReferralLink` её НЕ ловит** (нет tell-tale параметра) → выпадает из wallet-CTA. Фикс: добавить `refr.cc` в регэксп. |

### Налоги
| Бренд | /go | Реф-ссылка |
|---|---|---|
| Koinly | /go/koinly | `…?via=5733C88D` |
| CoinLedger | /go/coinledger | `…?fpr=eb2ref` |

### Трейдинг / боты
| Бренд | /go | Реф-ссылка |
|---|---|---|
| TradingView | /go/tradingview | `…?aff_id=119097` (Indoleads CPA, cookie 90д) |
| Cryptohopper | /go/cryptohopper | `…?atid=41091` |
| *(бот-CTA grid/dca)* | — | использует биржи со встроенными ботами: **Bitget / Bybit / Binance** (`botPartners` в affiliate.ts) |

### Earn / карты
| Бренд | /go | Реф-ссылка |
|---|---|---|
| Crypto.com Visa Card | /go/crypto-com-card | `o10o.xyz/6ac88e093361d` (та же воронка Crypto.com) |
| Bybit Card | /go/bybit-card | `…?ref=YKGOVN` |

---

## 3. Партнёрки — homepage-заглушки (НЕ зарабатывают) → куда подать

В `platforms.ts` стоят с голой главной — показываются на /exchanges, но дохода не дают. **Действие владельца:** завести реф-ссылку и прислать — впишу.

| Бренд | Категория | Есть ли программа? | Действие |
|---|---|---|---|
| **Coinbase** | биржа | да (Coinbase affiliate / Impact) | подать → реф-ссылка |
| **MEXC** | биржа | да — `promote.mexc.com/b/thecryptotools` уже наша, но `isReferralLink` не ловит `/b/` | фикс регэкспа (добавить `promote.mexc.com/b/`) → заработает |
| **Gemini** | биржа | да | подать |
| **Pionex** | биржа | да (реф по комиссии) | подать → главная grid-бот-биржа, ценно для grid-CTA |
| **Tangem** | кошелёк | да (реф) | подать |
| **CoinTracker** | налоги | да | подать |
| **TokenTax** | налоги | да | подать |
| **3Commas** | боты | да (реф) | подать → заменит голую главную в бот-контексте |
| **Nexo** | earn | да | подать |
| **Wirex** | earn | да | подать |
| MetaMask / Trust Wallet / Exodus / Phantom | кошельки | нет значимой реф-программы (бесплатные self-custody) | оставить как есть (полезны читателю, индексируются) |

---

## 4. Сетевые офферы через ручной /go (вне platforms, в теле гайдов)

rel: ссылка в теле = внутренняя на `/go/<slug>` (do-follow), дальше 302 на партнёрку. Строки в `public/_redirects`.

| Оффер | /go | Где размещён | Назначение (сеть) |
|---|---|---|---|
| **2ndNumber** (виртуальный номер) | /go/2ndnumber | гайд «how-to-avoid-crypto-scams» (SIM-swap) | Admitad (qbzdl.com) |
| **is\*hosting** (VPS) | /go/ishosting | гайд «crypto-trading-bots-explained» (24/7-хостинг бота) | Admitad (xcdus.com) |
| **Proton VPN** | /go/protonvpn | гайд «crypto-wallet-security» (privacy-first) | Admitad (ntzgd.com) |
| **ExpressVPN** | /go/expressvpn | гайд «crypto-wallet-security» (быстрый mainstream) | трекер владельца (gettracker.net → Indoleads) |

---

## 5. Партнёрские сети (API-аудит)

### Admitad — website_id `2988079` (active)
Creds: `~/.config/seo-stats/admitad-client-{id,secret}.txt`. ⚠️ Подать через API нельзя (`attach` → HTTP 410) — только веб-кабинет.
- **Approved + размещено:** Proton VPN (162597), is\*hosting (173159), 2ndNumber (кампания «Русский», 124239).
- **Approved, но офф-вертикаль, не ставим:** Envato (19009), Wondershare (23157), Multilogin (99414), WPS Office (118860), TradingView (45867 — используем Indoleads-вариант).
- **Declined (офф-вертикаль, переподавать смысла нет):** NordVPN, Surfshark, Udemy, Nordpass, Bitdefender, Keeper, Kinguin, italki, Trademark Engine, Snoop, Thordata, Flyfi.
- **Крипто-программ в каталоге для WW/US — практически нет.**

### Indoleads
Token JWT: `~/.config/seo-stats/indoleads-token.txt` (до 2036). ⚠️ Нужен браузерный User-Agent, иначе 403. Каталог `/api/offers?page=N`, per_page=10.
- **allowed=True + размещено:** TradingView (13620), Crypto.com (21741, CPA до $600, cookie 372д), ExpressVPN (15131, 45% CPS).
- **allowed=True, не размещено (тангенциально):** NordVPN (2963) — Proton уже закрывает VPN-слот.
- **allowed=False (можно подать):** PureVPN, Gotogate и пр. — тангенциальны, низкий приоритет.
- **Крипто:** только Crypto.com + TradingView (оба размещены).

**Вывод по сетям:** крипто выжато. Дальнейший рост монетизации — прямые реф-биржи (раздел 3) + AdSense (раздел 10).

---

## 6. Внутренняя сеть — house-ads (кросс-промо наших сайтов)

`src/lib/house-ads.ts` — **16 промо**, ротация в ad-слотах, **таргет по языку** (EN-посетитель видит EN-сайты, RU — RU). rel = `sponsored nofollow` (сквозные рекламные слоты → корректно nofollow; авторитет передаём НЕ здесь, а в разделе 7). Заполняют слоты, пока AdSense выключен.

**EN (11):** calclumen · costtrek · pawdget · iznkit · izngames · izntools · testsweep · foldoutkit · ocrsnip · foundaday · dasha-motion
**RU (5):** prodom-expert · 24zdorovie · bilimjol · foundaday (ru) · dasha-motion (ru)

> Это ВСЯ сеть — здесь рекламируем всё (даже тематически далёкое), т.к. слот рекламный (nofollow), не контекстный.

---

## 7. Внутренняя сеть — do-follow КОНТЕКСТНЫЕ кросс-ссылки (передача авторитета)

Главный SEO-рычаг сети: 1–2 **do-follow** ссылки из ТЕЛА контента на тематически близкий сайт сети (`rel="noopener noreferrer"`, **без nofollow**). В отличие от футер/house-ads — Google их ценит. Лимит 1–2 на сайт-цель, естественным анкором, не «для галочки».

| Цель (сеть) | Где у нас | Анкор | rel |
|---|---|---|---|
| **OCRSnip** | `/crypto-tax-report/` | «convert a PDF statement into a spreadsheet» | do-follow |
| **OCRSnip** | гайд «how-to-do-your-crypto-taxes» | «turn the PDF into a spreadsheet» | do-follow |
| **CostTrek** | гайд «moving-to-dubai-for-crypto» | «compare the cost of living in Dubai with your current city» | do-follow |

**Почему только эти:** из EN-сети под крипто-калькуляторы близки по теме только OCRSnip (PDF→таблица для налогов) и CostTrek (релокация/стоимость жизни). calclumen/iznkit/izntools каннибализировали бы наши же тулы или не по теме — не ставим.

---

## 8. Spotlight — ротационный ВНУТРЕННИЙ промо-слот

`src/lib/spotlight.ts` + `Spotlight.tsx`. Баннер на главной рекламирует ОДИН НАШ продукт, смена по неделям (непрерывный недельный индекс, build-time). Внутренняя `<Link>` — **do-follow**. GA: `spotlight_click {target}`. Отдельно от house-ads (там сайты сети, тут — мы).

**Ротация (10):** grid-backtest · dca-лаб · fear&greed · investment-calc · rainbow · glossary · tax-report · pi-cycle · unlocks · portfolio. Добавить промо = 1 запись.

---

## 9. nofollow vs do-follow — сводка

| Тип ссылки | Пример | rel | Почему |
|---|---|---|---|
| Партнёрка-платформа | /exchanges, CTA на тулах | `sponsored nofollow noopener noreferrer` | внешняя оплаченная |
| Партнёрка-оффер в теле | Proton/ExpressVPN/2ndNumber/ishosting | внутр. `/go/` do-follow → 302 | равновес не утекает (302 наружу), раскрытие — контекст |
| House-ad (сеть, слот) | leaderboard/sidebar баннеры | `sponsored nofollow noopener noreferrer` | сквозная реклама |
| **Кросс-ссылка (сеть, в теле)** | OCRSnip, CostTrek | `noopener noreferrer` (**do-follow**) | **намеренно передаём авторитет сети** |
| Spotlight (наша страница) | баннер на главной | внутр. `<Link>` (do-follow) | свой контент |
| Обычные внутренние | тулы↔гайды↔монеты | do-follow | свой контент |

---

## 10. AdSense

- Pub: `pub-5535516142831006`. Статус сайта: **NEEDS_ATTENTION**, за 30д 0 показов / $0.
- **Наша сторона 100% готова:** ads.txt верный, verification-скрипт в `<head>` каждой страницы, Consent Mode, все обязательные страницы (Privacy/About/Contact/Terms/Affiliate-disclosure) есть и в футере.
- Причина NEEDS_ATTENTION — в кабинете (ревью / выплаты-аккаунт / «малоценный контент» = та же Google-quality проблема / Auto-ads выкл). **Действие владельца:** открыть карточку «Требует внимания».
- Как станет «готов»: `NEXT_PUBLIC_ENABLE_ADS=true` + повесить ad-юниты → house-ads уступят слоты автоматически.

---

## 11. Открытые задачи (куда подать / что чинить)

**Владелец (подать реф-ссылку, прислать → впишу):** Coinbase · Gemini · Pionex · Tangem · CoinTracker · TokenTax · 3Commas · Nexo · Wirex. (+ разблокировать **AdSense** — рычаг №1.)
**Код (быстрый фикс монетизации):** добавить в `isReferralLink()` хосты `refr.cc` (Trezor) и `promote.mexc.com/b/` (MEXC) — сейчас две реальные реф-ссылки не распознаются и выпадают из CTA.
**GA4 (владелец, в интерфейсе):** пометить conversions — `affiliate_click`, `spotlight_click`, `tax_report_export`, `dca_exchange_click`.
