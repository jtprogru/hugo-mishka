#!/usr/bin/env bash
#
# Синхронизация темы с дизайн-системой mishka-ds.
#
# Тема не собирается npm'ом и не тянет пакет как зависимость: hugo-модуль
# должен ставиться одной строкой, без node_modules и submodule'ов. Поэтому
# собранные стили и шрифты лежат в репозитории копией, а этот скрипт её
# обновляет. Копия односторонняя: вендорные файлы в теме не правятся никогда,
# правится src/styles/* в пакете и делается пересинхронизация.
#
#   ./scripts/sync-ds.sh [путь-к-mishka-ds]
#
# По умолчанию пакет ищется рядом с темой: ../mishka-ds
#
set -euo pipefail

DS="${1:-$(cd "$(dirname "$0")/../.." && pwd)/mishka-ds}"
THEME="$(cd "$(dirname "$0")/.." && pwd)"

VENDOR="$THEME/assets/css/vendor/mishka-ds"
FONTS="$THEME/static/fonts"
MERMAID="$THEME/assets/mermaid"

if [ ! -d "$DS" ]; then
  echo "не найден каталог дизайн-системы: $DS" >&2
  echo "передай путь аргументом: ./scripts/sync-ds.sh ~/path/to/mishka-ds" >&2
  exit 1
fi

# dist/ у пакета под .gitignore — на свежем клоне его нет. Без этой проверки
# скрипт молча оставил бы тему со старыми стилями.
if [ ! -f "$DS/dist/styles/tokens.css" ]; then
  echo "в пакете нет собранного dist/: $DS/dist/styles/tokens.css" >&2
  echo "собери его: (cd $DS && make build)" >&2
  exit 1
fi

# Слои, которые теме нужны.
#
# Не берём: slides.css (презентации), code.css (подсветка через highlight.js,
# у нас Chroma), print-sheet.css (лист A4 и визитка), brand/* (все права
# защищены, теме не нужен — логотип приходит из параметров сайта), React-часть.
#
# Не берём и два слоя, которые для блога — мёртвый вес в критическом CSS:
#   themes-scoped.css — тема переключается только data-theme на <html>, а этот
#     слой обслуживает scoped-превью и класс html.dark у Slidev;
#   compat.css — алиасы старых имён токенов, локальные модули темы переведены
#     на канонические (--fg, --bg-elev, --c-tip), алиасы больше не нужны.
STYLES="tokens base components-shell components print-web"

rm -rf "$VENDOR"
mkdir -p "$VENDOR"
for name in $STYLES; do
  cp "$DS/dist/styles/$name.css" "$VENDOR/$name.css"
done
# fonts-hugo.css — тот же fonts.css, но с абсолютными путями /fonts/…:
# resources.Concat относительные URL не переписывает.
cp "$DS/dist/styles/fonts-hugo.css" "$VENDOR/fonts.css"

rm -rf "$FONTS/ibm-plex-sans" "$FONTS/iosevka"
mkdir -p "$FONTS"
cp -R "$DS/fonts/ibm-plex-sans" "$DS/fonts/iosevka" "$FONTS/"
# Шрифты под SIL OFL 1.1: лицензия обязана ехать рядом с бинарниками.
cp "$DS"/fonts/LICENSE-*.txt "$FONTS/"

# Подсветка кода: раскладка классов Chroma на роли --syn-*. Один профиль на обе
# темы — цвет приходит переменной, тему переключают сами токены.
cp "$DS/dist/chroma/chroma.css" "$VENDOR/chroma.css"

mkdir -p "$MERMAID"
cp "$DS/dist/mermaid/mermaid-config.json" "$DS/dist/mermaid/mermaid-config.dark.json" "$MERMAID/"

VERSION="$(node -p "require('$DS/package.json').version" 2>/dev/null || echo '?')"
COMMIT="$(git -C "$DS" rev-parse --short HEAD 2>/dev/null || echo '?')"
cat > "$VENDOR/VERSION" <<EOF
@jtprogru/mishka-ds $VERSION ($COMMIT)

Файлы в этом каталоге собраны из пакета и в теме не правятся.
Обновить: ./scripts/sync-ds.sh
EOF

echo "синхронизировано с @jtprogru/mishka-ds $VERSION ($COMMIT)"
echo "  стили:   assets/css/vendor/mishka-ds/ ($(ls "$VENDOR" | wc -l | tr -d ' ') файлов)"
echo "  шрифты:  static/fonts/{ibm-plex-sans,iosevka}/ ($(find "$FONTS" -name '*.woff2' | wc -l | tr -d ' ') woff2)"
echo "  mermaid: assets/mermaid/"
