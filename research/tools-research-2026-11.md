# TheCryptoTools — глубокий ресёрч: какие инструменты добавить и что улучшить (2026-11)

Решение владельца 15.11: сайт растёт по показам, нужен план инструментов. Источники: GSC 90д (526 запросов), инвентарь наших 73 тулов, субагент-инвентарь 9 конкурентов, last30days (Reddit/HN, за 30д). Срок отчёта диспетчеру — ср 18.11. CRM пока не заводим — очередь решает владелец кнопками.

## 0. Главный вывод (стратегия)
**ИИ-устойчивый ров живёт почти целиком в кластере НАЛОГИ + ПОРТФЕЛЬ** — там, где через страницу проходит файл/адрес/данные пользователя: CSV-импорт сделок, cost-basis лоты, адрес-лукап, tax-loss harvesting, NFT-налог, экспорт отчёта. Мы **уже владеем самым трудным куском — CSV-tax-report**. Дешёвые расширения вокруг него = наибольший рычаг и защита от ИИ-обзора.

Из 73 наших тулов **файл/данные пользователя проходят только через 3**: `crypto-tax-report` (CSV-импорт), `fake-wallet-generator`, `fake-portfolio-generator` (генерация+PNG-экспорт). Остальные ~70 — «ввёл числа → посчитало», то есть **ИИ-обзор заберёт их в один запрос**. Эти коммодити-калькуляторы держим ради long-tail/покрытия, но не инвестируем в них как в защиту.

Паттерн всех налоговых конкурентов (CoinLedger, Koinly, CoinTracker, Blockpit, CryptoTaxCalculator): **калькулятор/превью бесплатно, СКАЧИВАНИЕ отчёта — платно**. Наш бесплатный экспортируемый CSV-tax-отчёт — реальная отстройка, её стоит усиливать и выпячивать.

## 1. Спрос (GSC 90д, 2026-08-14…11-12)
Голова (всё обслуживает ГЛАВНАЯ, поз 65–78 = проблема авторитета/индексации, не отсутствия страниц):
«crypto calculator» 734 показа, «crypto interest calculator» 206, «crypto compound interest calculator» 202, «crypto coin calculator» 160, «crypto profit calculator» 142, «cryptocurrency calculator» 139, «crypto price calculator» 128…

Кластеры-хвосты (где новые/улучшенные страницы реально ранжируются):
- **Coin-tail «<coin> profit/investment calculator»** (программная серия, у нас есть /coins/<coin>/…): xtz 69, dot 68, usdc 58, cardano/ada 49+24, sui 31, chz 29, near 29, icp 28, bonk 24, polkadot-investment 48, aave/aptos-investment 14. Поз 55–73.
- **Гео-хвост interest/apy** (позиции ЛУЧШЕ головы): «crypto interest calculator uk» 45/поз64, «crypto compound interest calculator uk» 32/поз62, «crypto apy calculator uk» 18/**поз53.7**, «crypto interest calculator australia» 24/поз59, «bitcoin interest calculator uk» 12/поз56.
- **Язык-хвост**: «ביטקוין מחשבון» (ивр. «биткоин-калькулятор») 12/**поз25.5** — самый низкий конкурент; «калькулятор майнинга монеро» (рус) 11/поз61.
- **Near-page-1 гэпы/недожим**: «tokenomics calculator» 15/**поз37.1** + «crypto tokenomics calculator» 20/поз62 (у нас ЕСТЬ `tokenomics-calculator` → улучшить!); «ethereum dca calculator» 14/**поз39.9**, «crypto dca calculator» 12/поз50; «lp value calculator crypto» ~поз37 (из среза диспетчера); «crypto savings calculator» 66/поз65 (есть savings-goal); «crypto apy calculator» 39/поз66.

## 2. Конкуренты — гэпы (инвентарь 9 сайтов)
«DATA» = файл/адрес/портфель проходит насквозь (ИИ-устойчиво). «num» = ввёл числа (коммодити).

| Инструмент | У кого есть | AI-устойч.? | У нас |
|---|---|---|---|
| Портфель-трекер (connect wallet/exchange/address) | CoinStats, CoinTracker, CoinLedger, Koinly, Blockpit, CoinCodex (6/6) | **DATA** (сильно) | **НЕТ — крупнейший гэп** |
| Tax-loss harvesting **симулятор** (на импортированных лотах) | Koinly (free), CoinTracker (платно) | **DATA** | есть enter-numbers, нет data-through |
| Wallet/address balance checker (адрес-лукап) | CoinLedger | **DATA** | **НЕТ** |
| NFT profit / NFT tax | CoinLedger, CryptoTaxCalc, Blockpit | **DATA** | **НЕТ** |
| Полный tax-report: CSV/API import + cost-basis + export | CoinLedger, Koinly, CoinTracker, Blockpit, CryptoTaxCalc (export платно) | **DATA (сильно)** | **ЕСТЬ — наш ров (экспорт бесплатный)** |
| DCA historical backtest («DCA с 2017») | CoinCodex, dcabtc.com, Spark | data-driven | частично (forward + /dca-лаб) |
| Mining profitability | CoinDesk, WhatToMine, CoinWarz | live | ЕСТЬ (`mining-profitability`) — недожим |
| Impermanent loss / LP value | DEXTools и др. | num | ЕСТЬ `impermanent-loss`, нет «LP position value» |
| Crypto converter (live) | CoinCodex, CoinLedger, CoinGecko, CMC | live | ЕСТЬ `crypto-price-converter` |
| Average-down / average-cost (standalone) | CoinStats(портфель), CoinCodex(stock) | num | ЕСТЬ `average-entry` — нет лендинга «average down» |
| Retirement / crypto-FIRE | только WalletBurst (не крипто) | num | **НЕТ — whitespace** |
| Fee-compare бирж / fake-wallet | редко | n/a | **ЕСТЬ — отстройка** |

## 3. Свежие обсуждения (last30days, 30д; ⚠ Reddit частично заблокирован 403 — покрытие неполное)
- **Боль №1 крипто-налогов = СВЕРКА истории транзакций.** r/CryptoTax: «the underlying tx history needs reconciling before the CGT figure can be trusted. I’d first make sure every CEX/wallet (complete histories) are imported and transfers are matched correctly»; «garbage in garbage out — your data is either incomplete or inaccurate». → Инструмент **валидации/сверки CSV** (найти пропущенные сделки, несматченные переводы, дыры cost-basis) — file-through, ИИ-устойчив, расширяет наш tax-report, никто не даёт бесплатно отдельно.
- **India crypto tax** — живой спрос (30% flat VDA, нюансы futures/options). Гео-угол к налоговому кластеру.

## 4. Граница ИИ-устойчивости (правило сети)
Приоритет — инструментам, где **проходит файл/устройство/данные пользователя**: CSV-импорт, адрес-лукап, налоговые лоты, экспорт PDF/CSV/ICS. «Ввёл числа — посчитало» ИИ-обзор заберёт. Поэтому ниже топ-10 упорядочен: сначала data-through (ров), потом коммодити под long-tail.

---

## ТОП-5 УЛУЧШЕНИЙ ТЕКУЩИХ
Формат: что → запрос/цифры «до» → почему → часы → предлагаемый срок.

1. **tokenomics-calculator** → «tokenomics calculator» 15 показов/**поз37**, «crypto tokenomics calculator» 20/поз62. Near-page-1, недожат: усилить title/description под точный запрос, углубить пояснения (supply/эмиссия/FDV/разводнение), добавить WebApplication+FAQ-схему, внутренние ссылки из глоссария (tokenomics/fdv/circulating-supply) и token-vesting/token-burn. **~0.5д.** Срок: 19.11.
2. **Coin-tail per-coin profit/dca head-монеты** → xtz/dot/cardano/sui/eth profit (поз 55–73, суммарно >250 показов). Это проект индексации (I1/I2 уже в CRM) + уникализация контента head-монет (цена live, per-coin врезки) + внутренние ссылки. **~2–3д** (в рамках I2). Срок: 28.11 (I2).
3. **DCA-кластер** → «ethereum dca calculator» 14/**поз40**, «crypto dca calculator» 12/поз50. Усилить dca-calculator + добавить **исторический backtest** (см. новый тул #4), целевые title под «ethereum/crypto dca calculator». **~1д** (сверх backtest). Срок: 24.11.
4. **Гео interest/compound (UK/AU)** → «crypto apy calculator uk» поз53.7, «…interest calculator uk/australia» поз56–64. Страновые лендинги (C2 уже в очереди, due 22.11) + расширить на CA; угол страны (ISA/налог), не дубль generic. **~1д/страна.** Срок: 22.11 (C2) + 29.11 (CA).
5. **Главная** → «crypto calculator» 734/поз68 (+ весь head-кластер). Настоящий рычаг — авторитет/индексация (отдельный проект, 581/867 URL не в индексе); ближний шаг (title уже переписан 11.11): собрать на первом экране сетку «популярные калькуляторы» под интенты head-запросов (profit/interest/compound/converter), чтобы усилить релевантность и внутр. перелинковку. **~0.5д.** Срок: 26.11.
(Побочно: `take-profit-ladder` поз2 при 3 показах — запрос нишевый/низкочастотный; не отдельный проект, просто перелинковать с `stop-loss-take-profit` под «take profit calculator».)

## ТОП-10 НОВЫХ ИНСТРУМЕНТОВ
Формат: тул → запрос/спрос → почему ИИ-устойчив → часы → срок. (Приоритет 1–6 — data-through «ров»; 7–10 — коммодити под long-tail.)

1. **Wallet / address balance & holdings checker** — ввёл публичный адрес → холдинги, USD-оценка, простой P&L. Спрос: «check crypto wallet balance», адрес-лукап у CoinLedger. **ИИ-устойчив**: данные блокчейна по адресу пользователя, не отвечается чатом. ~2–3д (публичные API балансов, несколько сетей, клиентский фетч). Естественный CTA → Tangem (см. §6). Срок: 01.12.
2. **CSV-сверка/валидатор транзакций** — загрузил CSV сделок → отчёт о дырах: пропущенные покупки, несматченные переводы, отрицательные остатки, сделки без cost-basis. Прямо из боли last30days («reconcile tx history… garbage in garbage out»). **ИИ-устойчив**: файл пользователя насквозь; расширяет tax-report; никто не даёт бесплатно. ~3–4д. Срок: 05.12.
3. **Tax-loss harvesting на импортированных лотах** — апгрейд существующего enter-numbers калькулятора до загрузки CSV/портфеля: показать нереализованные убытки по лотам, что продать до конца налогового года. Гэп: Koinly (free), CoinTracker (платно). **ИИ-устойчив** (считает по лотам пользователя). ~3д. Срок: 10.12 (после #2).
4. **DCA historical backtest** — «если бы DCA с 2017»: ввёл сумму/интервал/дату → реальная история цен, итог vs lump-sum. Спрос: «ethereum dca calculator» поз40; у CoinCodex/dcabtc есть. **data-driven** (историческая серия), магнит беклинков, связка с /dca-лабом. ~2д. Срок: 24.11.
5. **NFT cost-basis / profit by wallet** — адрес/коллекция → PnL и налоговая база по NFT. Гэп: CoinLedger/CryptoTaxCalc/Blockpit. **DATA-through**. ~3д. Срок: позже (12.12+), ниша.
6. **Public-address portfolio snapshot** — read-only «портфель по адресу» (стоимость, аллокация, простой P&L), лёгкий клин вместо полного трекера с connect. **DATA-through**, крупнейший категорийный гэп. ~4д (надстройка над #1). Срок: 15.12.
7. **LP value / position value calculator** — стоимость LP-позиции сейчас vs HODL (с IL). Спрос: «lp value calculator crypto» ~поз37. num, но near-page-1 и дёшево. ~1д. Срок: 20.11.
8. **Average-down calculator (лендинг)** — отдельная страница под «average down calculator» (у нас есть движок `average-entry`). num, простой, высокочастотный запрос. ~0.5д (лендинг+alias). Срок: 19.11.
9. **Crypto retirement / «Bitcoin FIRE» calculator** — сколько BTC/крипты нужно для FIRE при ставке изъятия X%, с волатильностью. **Whitespace** (крипто-специфичного ни у кого нет), высокий интент. num, но под-обслужено. ~1–2д. Срок: 03.12.
10. **Monero/рус. и иврит-лендинги** — «ביטקוין מחשבון» поз25.5 (12 показов, самый слабый конкурент), «калькулятор майнинга монеро» поз61. Локализованные лендинги под существующие калькуляторы на низко-конкурентном нерусском/неанглийском хвосте. num, но позиция уже топ-3 стр. ~1д/язык. Срок: эксперимент, 08.12 (нужен «да» владельца — выходит за англорынок).

## 6. Связка с Tangem (аппаратный кошелёк) — без нарушений AdSense
Инструменты, естественно ведущие к холодному кошельку (CTA/контекст, честно, без пугалок):
- **Wallet/address balance checker (#1)** → «проверил баланс — защити ключи аппаратным кошельком» (Tangem). Самый органичный мост.
- **Cold storage vs exchange risk** (новый мини-калькулятор/врезка) — «сколько контрагентского риска на бирже; not-your-keys» → Tangem.
- **BIP39 seed-checksum валидатор (офлайн, клиент)** — проверка контрольной суммы 12/24 слов, строго с предупреждением «никогда не вводи фразу с реальными средствами». Риск-чувствительно (как fake-wallet), но ведёт прямо к «заведи аппаратный кошелёк». Делать осторожно/низкий приоритет.
- Контент уже есть: гайд `best-crypto-hardware-wallets` + `/compare/trezor-vs-tangem` — линковать из тулов выше. Tangem-реф-ссылку вписать, когда придёт (задача M1 в CRM).

## Оценка усилий — сводка
Data-through ров (#1–6, #2–3 налоги): 2–4д каждый — главный фокус. Коммодити (#7–10): 0.5–2д, многие Cursor-able по шаблону config-тула. Улучшения: 0.5–3д.

Очередь не фиксирую — порядок выбирает владелец кнопками; после выбора заведу в CRM с датами.
