#!/bin/sh
set -e

python manage.py migrate

if [ "${IMPORT_FULL_DUMP:-0}" = "1" ] && [ -f "/app/full_dump.json" ]; then
  # ВАЖНО: проверку делаем внутри if, чтобы set -e не убивал скрипт
  if python manage.py shell -c "from shop.models import Product; raise SystemExit(0 if Product.objects.exists() else 1)"; then
    echo "Products exist -> skip full_dump import"
  else
    echo "No products -> importing full_dump.json"
    python manage.py loaddata /app/full_dump.json
  fi
fi

# fallback (оставь, он полезен)
if [ "$#" -eq 0 ]; then
  set -- gunicorn server.wsgi:application --bind 0.0.0.0:8000 --workers 3 --timeout 120
fi

exec "$@"
