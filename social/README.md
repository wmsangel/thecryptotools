# Соцсети — TheCryptoTools

Дневная рассылка **готового поста для Instagram** в Telegram: каждое утро владельцу
в бота приходит медиа (картинка/карусель/сторис) + отдельным сообщением подпись с
хэштегами — скачал, скопировал, выложил. Контент — англоязычный (сайт EN-only),
тон честный, под органику.

## Что где
| Файл | Назначение |
|---|---|
| `posts.js` | контент-план как ДАННЫЕ (7 постов/неделя): id, day, format, rubric, page, slides, caption/hashtags (`{en}`), sticker (сторис) |
| `scripts/social-slides.mjs` | генератор слайдов (@vercel/og → PNG в `out/`) — брендовый графит+teal |
| `scripts/telegram-daily.mjs` | берёт пост на сегодня и шлёт готовый пост в Telegram (без зависимостей) |
| `out/` | сгенерированные PNG `<id>-en-NN-(square\|story).png` + manifest.json (git-ignored) |
| `.telegram.json` | bot_token / chat_id / lang (git-ignored; образец — `.telegram.json.example`) |

## Бот (один на всю сеть)
Используется общий сетевой Telegram-бот (токен уже в `.telegram.json`, `chat_id` —
личный чат владельца). В заголовке каждого сообщения стоит имя проекта
(«TheCryptoTools»), чтобы не путать проекты. Новый бот не нужен.
*Если когда-то понадобится свой:* @BotFather → `/newbot` → токен в `.telegram.json`;
`chat_id` вытягивается из `https://api.telegram.org/bot<TOKEN>/getUpdates` после `/start`.

## Как пользоваться
```bash
# 1) сгенерировать слайды (из корня проекта — берёт @vercel/og из node_modules проекта)
node social/scripts/social-slides.mjs            # 1080px (IG native)
node social/scripts/social-slides.mjs --scale 2  # 2160px (retina)

# 2) тестовая отправка конкретного поста по id
node social/scripts/telegram-daily.mjs grid-loses

# 3) отправка поста на сегодня (как делает автозапуск)
node social/scripts/telegram-daily.mjs
```
Правка плана = правишь `posts.js`, перегенерируешь слайды, при желании тестируешь отправку.

## Автозапуск (launchd, раз в день 08:13)
Агент `~/Library/LaunchAgents/com.thecryptotools.social-daily.plist` уже загружен
(08:13 — сдвиг, чтобы проекты сети не слали в одну минуту). Управление:
```bash
launchctl unload ~/Library/LaunchAgents/com.thecryptotools.social-daily.plist   # выключить
launchctl load   ~/Library/LaunchAgents/com.thecryptotools.social-daily.plist   # включить
launchctl list | grep thecryptotools                                            # проверить
```
Лог: `~/Library/Logs/thecryptotools-social-daily.log`.

> ⚠️ **Мак должен быть включён** в 08:13 (не спать/не выключен), иначе рассылка
> пропустится до следующего дня. Если нужна гарантия — переносим на облачный
> шедулер (Cloudflare Worker cron / GitHub Actions), там токен уходит в секреты.

## Рамки
Честный тон без «чудо-результатов». Реклама не маркируется (органика). Каждый пост
завязан на реальную страницу сайта; ссылка — в bio/профиле.
