#!/usr/bin/env bash
# Publica raizweb.com en Cloudflare Pages.
#
# Por qué existe este script en vez de un `wrangler pages deploy .` a secas:
# Pages sube TODO lo que hay en la carpeta que le pasas, y no tiene ninguna
# opción para excluir archivos (.assetsignore es de Workers, no de Pages).
# Desplegar la raíz del repo dejaría README.md y CLAUDE.md legibles en
# raizweb.com/README.md. Ya pasó una vez, en septiembre de 2026.
#
# Así que se arma una copia limpia con sólo el sitio y se despliega esa.

set -euo pipefail
cd "$(dirname "$0")"

DIST="$(mktemp -d)"
trap 'rm -rf "$DIST"' EXIT

rsync -a \
  --exclude '.git/' --exclude '.wrangler/' --exclude '.DS_Store' --exclude '._*' \
  --exclude '*.md' --exclude '.gitignore' --exclude 'publicar.sh' \
  ./ "$DIST/"

echo "Se publican $(find "$DIST" -type f | wc -l | tr -d ' ') archivos."
echo "Quedan fuera:"
comm -23 \
  <(find . -type f -not -path './.git/*' -not -path './.wrangler/*' | sed 's|^\./||' | sort) \
  <(cd "$DIST" && find . -type f | sed 's|^\./||' | sort) | sed 's/^/  /'
echo

npx wrangler pages deploy "$DIST" --project-name raiz-web "$@"

echo
echo "Comprobando que no se coló nada:"
for f in README.md CLAUDE.md .gitignore publicar.sh; do
  printf "  /%-14s HTTP %s\n" "$f" \
    "$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "https://raizweb.com/$f?x=$RANDOM")"
done
echo "  (404 en los cuatro = bien. La caché del dominio puede tardar; ?x= la esquiva.)"
