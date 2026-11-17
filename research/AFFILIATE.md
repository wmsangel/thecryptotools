# thecryptotools.com — партнёрские сети (CJ + Awin)

> Решение владельца 16.11.2026 (через диспетчера): подключаем CJ и Awin. Аккаунты в сетях у владельца есть; вход — через Chrome владельца (Claude in Chrome). Срок задачи — пятница 20.11 (аудитный день, совместимо с проверкой) или 23.11, не двигая быстрые победы 19–20.11. CRM: `0mwir03td2f6aa7c1087550a5` · план: `research/PLAN.md` → «Сетевые задачи».

## Границы (строго)

- **Можно:** добавить сайт площадкой (property/website), подать заявки в программы, взять готовые ссылки, завести sub-id, разместить блоки после одобрения.
- **Нельзя:** трогать настройки аккаунта, выплаты, налоговые/tax-формы, пароли; **принимать договоры сети** (publisher agreement уровня аккаунта — это действие владельца); обходить блок классификатора (если сработал — остановиться и написать диспетчеру).
- **Только AdSense-совместимое, без MFO/займов и беттинга.** Биржи — только если программа в самой сети И разрешена для гео-профиля (ИП КГ); иначе не брать.
- Реквизиты ИП для анкет-выплат заполняет **владелец сам** (идентификаторы/платёжные данные не вносим). Latin-форма для справки — в глобальном CLAUDE.md.

## Sub-id (обязательно на каждой ссылке)

- **CJ Affiliate:** параметр `sid` — `...&sid=<slug-или-страница>`.
- **Awin:** параметр `clickref` — `...&clickref=<slug-или-страница>` (доп. уровни `clickref2..6` при нужде).
- ~~**Impact:** `subId1`~~ — **Impact не используем: аккаунт владельца Declined 16.11 («do not qualify»).**
- Значение sub-id = слаг площадки/страницы, где стоит ссылка (например `tax-report`, `balance-checker`, `guide-hardware-wallets`), чтобы в отчётах сети видеть, какая страница приносит.

### Правило «ссылка готова»

Ссылка считается готовой к размещению **только после клика по ней на проде и подтверждения, что sub-id долетел** в дашборд сети (CJ `sid` / Awin `clickref` виден в отчёте кликов). До этой проверки ссылка остаётся в статусе «черновик» и в код не идёт.

### Интеграция в код (когда ссылки одобрены и проверены)

1. Добавить платформу в `src/lib/platforms.ts` (slug + реальный deep-link с sub-id).
2. Убедиться, что `isReferralLink()` в `src/lib/affiliate.ts` распознаёт ссылку (добавить хост/параметр сети в regex, если не ловится — сейчас ловит `ref/r/invite/join/via/aff/fpr/partner/atid/subid`; **добавить `clickref` и CJ-хосты** при первом размещении).
3. Ссылка автоматически получает `/go/<slug>` (rel="sponsored") через `scripts/build-go-redirects.ts`.
4. На странице — с пометкой рекламы/партнёрства (disclosed, nofollow/sponsored).

## Размещение после одобрения

- **Налоговые сервисы** (Koinly / CoinLedger / CoinTracker / ZenLedger) — рядом с `/crypto-tax-report` и будущей **CSV-сверкой** (РОВ #2, due 05.12). Естественно для рва «налоги+портфель».
- **Аппаратные кошельки** (Ledger / Trezor / Tangem) — в гайдах (`best-crypto-hardware-wallets`, `/compare/*`) и на будущем **balance-checker** (РОВ #1, due 01.12) как CTA «защити ключи».
- Каждый блок — с явной пометкой рекламы.

## Статусы программ

Статус `verify` = проверить в дашборде сети 20.11 (веб-данные ниже индикативны, не авторитетны). Легенда: `applied` / `approved` / `declined` / `not-in-network` / `direct` (своя программа вне CJ/Awin).

| Бренд | Категория | Сеть (факт на 16.11, предв.) | Статус | Примечание |
|---|---|---|---|---|
| Ledger | кошелёк | **in-house** (affiliate.ledger.com); Impact — аккаунт Declined 16.11; CJ/Awin — нет | direct | Только своя in-house, **выплата BTC**. Регистрирует владелец. |
| Trezor | кошелёк | своя (trezor.io/partners); CJ/Awin не подтверждены | verify/direct | До 15%, cookie 30д. Заявка через партнёрскую страницу Trezor. |
| Tangem | кошелёк | **напрямую** (не сеть) | direct | Менеджер Pavel Norik; письмо Алекса ждём. См. M1 в PLAN.md. |
| Koinly | налоги | **своя, внутри приложения** (не CJ/Awin) | direct | 20%, min $100. Регистрация: Koinly app → Refer friends. |
| CoinLedger | налоги | **своя** (coinledger.io/affiliate-program) | direct | 25% recurring. Требует rel="nofollow", запрет купонного трафика. |
| CoinTracker | налоги | своя + возможно через сети (FlexOffers листит) | verify | Проверить, есть ли в CJ/Awin; иначе своя. |
| ZenLedger | налоги | своя / FlexOffers | verify | До $119/клиент + 20%. Проверить сеть. |

**Находка 16.11 (важно):** названные приоритетные бренды (кошельки + налоговые) в основном **НЕ в CJ/Awin** — у них собственные программы или Impact. Значит задача CJ+Awin:
1. Добавить thecryptotools площадкой в CJ и Awin (инфраструктура под будущие программы сети).
2. Пройтись по каталогам CJ/Awin и подать заявки на то крипто/финтех, что **реально там есть** и совместимо (возможно: отдельные биржи при гео-ОК, VPN/безопасность, часть tax-сервисов) — список заполнить после входа.
3. Рва «налоги+портфель» касаются прежде всего **прямые** программы (Koinly, CoinLedger — свои; Ledger — Impact) — их вести отдельным direct-треком (см. ВОПРОС диспетчеру).

## Прямой трек (налоги+портфель)

> Решения владельца 16.11 (через диспетчера), распределение по исполнителю. CRM: `0mwir4tij580d3cd8a2a3d846`.

> ⚠️ **Impact отклонён 16.11:** аккаунт владельца Declined в маркетплейсе Impact («do not qualify»). Property не добавляем, заявки в Impact не подаём. Ledger и CoinTracker — только через их собственные программы (ниже).

### A. Сессия делает 20.11 — прямая заявка на сайте бренда
| Программа | Действие сессии 20.11 | Ожидаемая ставка | Примечания |
|---|---|---|---|
| **CoinTracker** | проверить cointracker.io/affiliate — если программа **открыта** и заявка без регистрации аккаунта/выплатных данных, подать; если требует аккаунт/выплату — передать владельцу | не раскрыта (оценка ~22%) | Налоги → tax-report + CSV-сверка. |

### B. Владелец регистрирует сам — гейт «если выплата проходит» (PayPal в КГ нет)
Владелец регистрируется до поля способа выплаты; если метод не проходит — программа отпадает. Результат передаёт диспетчер; **после его пинга** заявки/ссылки/sub-id/размещение — мои.

> **ПРОВЕРЕНО через Chrome владельца 17.11 — ОБА только PayPal (в КГ нет), застопорено:**
> - **Koinly affiliate:** terms «payments will generally be made via PayPal», min $100, 3 клиента. НЕ вступал (вступление сожгло бы refer-a-friend кредиты). Наш `via=5733C88D` = refer-a-friend (кредиты $25 на счёт), НЕ кэш-партнёрка.
> - **CoinLedger affiliate:** terms «Payments to affiliates are done via PayPal», min $30. Уже подключён ранее (`fpr=eb2ref` на сайте), но выплата PayPal-only.
> - Платёжные данные/формы/пароли не вводил. Дальше — решение владельца (email в поддержку про wire/Payoneer, либо парковка).

| Программа | Регистрация (владелец) | Выплата (гейт) | Ожидаемая ставка | Примечания |
|---|---|---|---|---|
| **CoinLedger** | coinledger.io/affiliate-program → «Sign up to be a Partner» | **PayPal, min $30**, холд 30д → PayPal в КГ под вопросом | **25% recurring** | Сильнейший оффер; выплата только PayPal — вероятный стоп по гео. Запрет платной рекламы/купонов, ссылки `rel="nofollow"`. |
| **Koinly** | аккаунт koinly.io → Profile → «Refer friends» → принять условия → Affiliate Panel | **min $100**, метод уточнить (владелец увидит поле) | **20%** | Регистрация внутри приложения, заявки нет — сразу панель. |
| **Ledger** (in-house) | affiliate.ledger.com — своя программа (Impact закрыт) | **выплата BTC** — проверить, устраивает ли владельца | **~10%** CPS (8–12%) | Кошельки → гайды + balance-checker. Выплата в BTC, не фиат. |

### C. Отложено
- **Trezor** — отложен до пакета с **Tangem** (ждём письмо Алекса). До 15%, cookie 30д. См. M1 в PLAN.md.
- **ZenLedger** — не в текущем раунде; при желании проверить zenledger.io/partner позже (до $119/клиент или 20–30%, противоречиво; та же проблема выплаты).

После регистраций/одобрений — размещаю с пометкой рекламы: налоговые рядом с `/crypto-tax-report` и CSV-сверкой, кошельки в гайдах и balance-checker.

## Tangem (прямая партнёрка — ПЕРЕГОВОРЫ 16.11)

Кошелёк-карта (NFC, без seed-фразы). Менеджер: **Alex Shulha, Influencer Manager**. Владелец отвечает сам, диспетчер готовит письмо.

- **Условия (письмо 16.11):** $10 за кошелёк по реф-ссылке; квартальные бонусы; **30% rev-share** с in-app сервисов приведённых пользователей; для нашей аудитории скидка 10% + $5–20 в BTC; бесплатные устройства на обзор. Просят ссылки на каналы.
- **Статус:** ответ Alex 17.11 (CRM `0mwke3awydb43b25ff5617859`, срок 18.11). Регистрация — affiliate.tangem.com. **Выплаты USDT TRC-20 через 30д после покупки** (идеально для ИП КГ!); банк-перевод — исключение от 15 продаж/мес. Трекинг продаж по отдельным страницам в дашборде есть. После регистрации — прислать Alex промокод (кастомизирует под бренд). Бесплатный кошелёк на обзор — владелец сам отвечает адресом доставки.
  - **БЛОКЕР 17.11:** регистрация ТОЛЬКО через «Continue with Google» (Google OAuth, создание+связывание аккаунта) — формы ИП/пароля нет. Остановился (OAuth/связывание = прямое «да» владельца). Ждём: владелец кликает Continue with Google ЛИБО явно разрешает сессии.
- **Статус (старое, 16.11):** владелец отправил письмо Алексу: сайт + четыре гайда про кошельки, трафик ~1K/мес, вопросы про sub-id/выплату/тест-устройство.
- **Каналы проекта (для Алекса):** сайт thecryptotools.com (разделы кошельков) + **Instagram [@thecryptotools](https://instagram.com/thecryptotools)** с ежедневным автопостом (задача `thecryptotools-ig-autopost`).
- **sub-id:** узнаем из ответа Tangem (параметр в реф-ссылке). До этого — атрибуция через наш GA4 `affiliate_click[placement]` + edge `/go/tangem`.
- **Интеграция (когда придёт ссылка):** вписать реф-ссылку в `platforms.ts` (slug `tangem`, сейчас голый `https://tangem.com` → не earning) → активирует `/go/tangem` и **авто-зажигает CTA на всех гайдах с `affiliate:"wallet"`** (Tangem войдёт в ротацию wallet-партнёров рядом с Ledger/Trezor/SafePal).
- **План размещения (естественные страницы, все на проде):**
  - `/guides/best-crypto-hardware-wallets/` (главный гайд-кошельки)
  - `/compare/trezor-vs-tangem/` (уже есть) — усилить Tangem
  - `/guides/how-to-choose-a-hardware-wallet/`
  - `/guides/hot-wallet-vs-cold-wallet/`
  - `/guides/crypto-wallet-security/`
  - `/guides/how-to-store-a-seed-phrase/` (Tangem = no-seed-phrase угол, естественно)
  - **balance-checker** (РОВ #1, план 01.12) — CTA «защити ключи»
  - кандидат на новую страницу: `/compare/ledger-vs-tangem/` (пары нет, спрос Bing «ledger vs trezor vs tangem» поз10) — **в план после CJ/Awin 20.11** (решение диспетчера 16.11)
- **AdSense:** кошельки/безопасность — ок; без обещаний доходности.

## WunderTrading (прямая партнёрка — РАЗМЕЩЕНО 16.11)

Платформа автоматизации трейдинга (DCA, grid, копитрейдинг; подключается к бирже по API). Реф-ссылка от владельца.

- **Ссылка:** `https://wundertrading.com/en/register?ref=wbt6a5241dcdff1c7df` → в `platforms.ts` (slug `wundertrading`, категория `trading`) → `/go/wundertrading`.
- **Ставка:** 30–50% lifetime recurring (растёт с числом активных подписчиков; источник — wundertrading.com/affiliates). Cookie — не раскрыт.
- **Sub-id:** отдельного параметра у WunderTrading нет (только `ref`). Пер-страничная атрибуция — через наш GA4 `affiliate_click[placement]` (data-affiliate) + edge-счёт по `/go/*`. Если позже найдётся sub-id-параметр — добавить в ссылку.
- **Где стоит** (компонент `WunderTradingCTA`, пометка «Partner · Ad» + дисклеймер риска, НЕ на главной):
  - `/dca` (lab), placement `dca-lab`
  - `/grid-trading-backtest`, placement `grid-backtest`
  - `/tools/dca-calculator`, placement `tool-dca-calculator`
  - `/tools/dca-vs-lump-sum-calculator`, placement `tool-dca-vs-lump-sum-calculator`
  - `/guides/grid-trading-explained`, placement `guide-grid-trading-explained`
  - плюс карточка в категории Trading на `/exchanges`.
  - НЕ дублировал на страницах, где уже есть `affiliate:"bot"` CTA (встроенные боты бирж): grid-calculator, dca-bot-calculator, гайды crypto-trading-bots-explained / best-crypto-grid-trading-bots — чтобы не стакать два бот-блока.
- **AdSense:** без обещаний доходности и «гарантий»; рядом дисклеймер риска («bot does not guarantee profit… not financial advice»).
- **Клик-тест (прод, 16.11):** `/go/wundertrading` → HTTP 302 → `…register?ref=wbt6a5241dcdff1c7df` ✓; CTA live на `/dca` (200). Коммит — ниже.

## Журнал

- 16.11.2026 — файл заведён; предв. research по сетям (ниже источники). Chrome-работа (property + заявки) запланирована на 20.11.
- 16.11.2026 — решения владельца по прямому треку: Impact-аккаунт есть (КГ в списке) → Ledger+CoinTracker подаёт сессия 20.11 вместе с CJ/Awin (sub-id `subId1`). Koinly/CoinLedger регистрирует владелец сам с гейтом «если выплата проходит» (PayPal в КГ нет) — после пинга заявки/ссылки мои. Trezor отложен в пакет с Tangem. Раздел «Прямой трек» перестроен.
- 16.11.2026 — **WunderTrading размещён** (прямая реф-ссылка владельца): platforms.ts + `/go/wundertrading`, компонент `WunderTradingCTA` на 5 страницах + карточка /exchanges. Клик-тест прод 302→ref ✓. Детали — секция выше.
- 16.11.2026 — **поправка:** Impact отклонил аккаунт владельца (Declined, «do not qualify»). Impact убран: property не добавляем, заявки не подаём. Ledger → только in-house (affiliate.ledger.com, выплата BTC — проверить, устраивает ли; регистрирует владелец). CoinTracker → напрямую через cointracker.io (сессия проверяет 20.11, открыта ли). Остальное без изменений.

### Источники research 16.11
- Ledger: Impact (open) / Awin US closed — affi.io, uppromote directory; своя in-house (BTC) — сторонние гайды.
- Trezor: trezor.io/affiliate, партнёрская страница; до 15%.
- Koinly: support.koinly.io (affiliate FAQ), koinly.io/affiliate — своя, внутри приложения, 20%/min $100.
- CoinLedger: coinledger.io/affiliate-program — 25% recurring, rel=nofollow, запрет купонов.
- CoinTracker/ZenLedger: flexoffers / affpaying — свои/через сети, проверить.
