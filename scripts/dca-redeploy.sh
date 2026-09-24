#!/bin/bash
#
# Ежедневный ре-деплой сайта, чтобы /dca подхватывал НОВЫЕ стратегии.
# `npm run deploy:pages` в prebuild обновляет src/lib/dca/snapshot.json (свежий
# фид) → пересобираются статические страницы /dca/<slug>/ для новых семейств.
# После успешного деплоя коммитим снапшот, чтобы рабочее дерево оставалось
# чистым (иначе дневной аналитик увидит его «изменённым»).
#
# Запускается launchd-агентом com.izn.dca-redeploy. Модель здесь не участвует —
# чистый shell, 0 токенов. Лог: ~/Library/Logs/dca-redeploy.log
set -uo pipefail

export PATH="/Users/igorzagorodnyi/.nvm/versions/node/v20.18.0/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
REPO="/Users/igorzagorodnyi/Sites/izn.crypto"
LOG="$HOME/Library/Logs/dca-redeploy.log"

cd "$REPO" || exit 1
if [ -f "$LOG" ] && [ "$(stat -f%z "$LOG" 2>/dev/null || echo 0)" -gt 2097152 ]; then
    tail -n 400 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
fi

{
    echo "===== $(date '+%Y-%m-%d %H:%M:%S') dca-redeploy start ====="
    npm run deploy:pages
    rc=$?
    if [ "$rc" -eq 0 ]; then
        git add src/lib/dca/snapshot.json 2>/dev/null
        if git -c user.name="Igor Zagorodnyi" -c user.email="wmsangel@gmail.com" \
               commit -m "chore(dca): daily snapshot refresh" 2>/dev/null; then
            echo "snapshot: закоммичен свежий фид"
        else
            echo "snapshot: без изменений"
        fi
    else
        echo "ВНИМАНИЕ: deploy завершился с rc=$rc — снапшот не коммичу"
    fi
    echo "===== $(date '+%Y-%m-%d %H:%M:%S') end rc=$rc ====="
    echo ""
} >> "$LOG" 2>&1
