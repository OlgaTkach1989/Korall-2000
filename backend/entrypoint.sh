#!/bin/sh
set -e

python manage.py migrate

if [ "${IMPORT_FULL_DUMP:-0}" = "1" ] && [ -f "/app/full_dump.json" ]; then
  python manage.py shell -c "from shop.models import Product; exit(0 if Product.objects.exists() else 1)"
  if [ $? -ne 0 ]; then
    python manage.py loaddata /app/full_dump.json
  fi
fi

exec "$@"
