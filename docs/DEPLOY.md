# Деплой

Сайт статический (`output: "export"`), лежит на shared-хостинге GoDaddy за
Cloudflare. Раньше заливка была ручной: `npm run build`, зип всей папки `out/`,
загрузка ~33 МБ в cPanel и «Extract» с перезаписью. Теперь то же самое делает
`npm run deploy`, но отправляет только изменившиеся файлы.

## ⚠ Главное про этот хостинг

**Сайт лежит прямо в `public_html`, и в этом же каталоге стоит второй сайт —
`public_html/24zdorovie.com`.** Он к этому проекту отношения не имеет и не должен
пострадать ни при каких обстоятельствах.

Скрипт защищён от этого на трёх уровнях:

1. **Удаляется только то, что скрипт сам когда-то залил.** Список лежит в
   `.deploy-state.json` (путь → sha1). Сравнения с содержимым сервера нет
   вообще, поэтому файл, которого скрипт не загружал, он не может и удалить.
2. **Распаковка создаёт только пути из архива.** В архив попадает содержимое
   `out/`, где каталога `24zdorovie.com` нет.
3. **Явный запрет `DEPLOY_PROTECT`** (по умолчанию `24zdorovie.com,24zdorovie`). Имя каталога взято из `scripts/.deploy.env` проекта izn.health, а не угадано — там `CPANEL_DIR=public_html/24zdorovie.com`. Если такой
   путь всё же появится в `out/`, сборка деплоя падает до первого обращения к
   серверу; если он окажется в старом `.deploy-state.json` — исключается из
   удаления, и повторная проверка стоит прямо перед вызовом `unlink`.

Проверить, что защита жива, можно в любой момент:

```bash
mkdir -p out/24zdorovie.com && touch out/24zdorovie.com/index.html
npm run deploy:dry          # должен отказаться с «попадающий в защищённый каталог»
rm -rf out/24zdorovie.com
```

## Настройка (один раз)

```bash
cp scripts/.deploy.env.example scripts/.deploy.env
# заполнить CPANEL_HOST / CPANEL_USER / CPANEL_TOKEN
```

`scripts/.deploy.env` в `.gitignore`.

- **`CPANEL_HOST`** — прямой адрес сервера, **не домен**: `thecryptotools.com`
  проксируется Cloudflare, и порт 2083 через него не пройдёт. Взять в панели
  GoDaddy: Hosting → Settings → Server / cPanel Admin, обычно вида
  `xxxxx.prod.iad2.secureserver.net`; IP тоже годится.
- **`CPANEL_TOKEN`** — cPanel → Security → Manage API Tokens → Create. Токен
  лучше пароля: показывается один раз и отзывается отдельно от аккаунта. Если
  хостер отключил токены — `CPANEL_PASS` с паролем cPanel.
- **`CF_ZONE_ID` + `CF_API_TOKEN`** — чтобы сбрасывать кэш Cloudflare после
  заливки. Без них шаг пропускается с напоминанием, сам деплой не ломается.
  Токен: dash.cloudflare.com → My Profile → API Tokens → Create Token → Custom
  token → Permissions: Zone / Cache Purge / Purge, Zone Resources → Include →
  Specific zone → thecryptotools.com.

Перед первым большим деплоем стоит проверить доступы на одном файле:

```bash
npm run deploy:selftest
```

Он заливает `robots.txt`, распаковывает, сверяет размер и mtime с локальным
файлом и удаляет архив. Если cPanel не умеет распаковывать по API, лучше узнать
это на 200 байтах, чем на 139 МБ.

## Обычная работа

```bash
npm run deploy            # собрать и залить разницу
npm run deploy:dry        # показать план, ничего не отправляя
npm run deploy -- --no-build   # залить уже собранное out/
npm run deploy -- --full       # забыть состояние и залить всё заново
npm run deploy -- --no-purge   # не трогать кэш Cloudflare
```

Первый запуск отправляет всё: ~2394 файла, ~139 МБ (из них ~90 МБ — история
цен и OG-карточки). Дальше — только изменившееся, обычно единицы мегабайт.

Файлы бьются на части по 40 МБ (`DEPLOY_PART_MB`), каждая едет как `.tar.gz` и
распаковывается на сервере. Именно tar, а не zip: tar хранит имена байтами, без
кодировочных таблиц, которые zip переживает по-разному.

## Зачем нужен сброс кэша Cloudflare

`public/.htaccess` отдаёт `/_next/static/*` с `max-age=31536000, immutable`. Для
хешированных имён это правильно, но имена OG-карточек, иконок и файлов в
`/data/` между сборками не меняются — без очистки изменившееся содержимое будет
отдаваться из кэша ещё год. `npm run deploy` вызывает purge автоматически,
если заданы `CF_ZONE_ID` и `CF_API_TOKEN`.

## Что проверить после заливки

```bash
# новая страница реально доехала
curl -s -o /dev/null -w "%{http_code}\n" https://thecryptotools.com/portfolio/

# все <loc> в карте сайта со слешем на конце (пусто = хорошо)
curl -s https://thecryptotools.com/sitemap.xml | grep -o "<loc>[^<]*" | grep -v "/$"

# соседний сайт на месте
curl -s -o /dev/null -w "%{http_code}\n" https://24zdorovie.com/
```

Прошлые ручные деплои иногда молча не применялись, поэтому проверка живой
страницы — не формальность.

## Открытые вопросы по хостингу

- **Cloudflare не кэширует HTML**: главная отдаётся с `cf-cache-status: DYNAMIC`.
  Лечится Cache Rule в панели Cloudflare, к деплою отношения не имеет.
- **GoDaddy подмешивает `tccl.min.js`** с `img1.wsimg.com` в каждую страницу.
  Это третья сторона, которой нет в наших `/cookies` и `/privacy`; либо
  отключить через их поддержку, либо раскрыть на страницах.
