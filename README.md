# Mishka

Самостоятельная Hugo-тема для [jtprog.ru](https://jtprog.ru) — без зависимостей от других тем, с акцентом на читаемость длинных технических постов, mobile-first вёрстку и оригинальный дизайн.

> **Статус:** в разработке, до релиза `v0.1.0`. API params и набор шорткодов могут меняться без депрекейшена.

## Особенности

- Mobile-first вёрстка, отзывчивая от 320px до широких десктопов.
- Светлая / тёмная тема: авто по `prefers-color-scheme` + ручной 3-state-тогглер (`auto / light / dark`), сохраняется в `localStorage`, без FOUC.
- Холодная приглушённая палитра catppuccin (Latte на свету, Macchiato в темноте) с акцентом Sapphire — не клон серого PaperMod.
- Type scale 1.250 (Major Third), читаемая колонка 720px для постов, межстрочный 1.65.
- Главная: profile-hero + сетка проектов из `data/projects.yaml` + сетка свежих постов с превью.
- Render-hooks для codeblock (язык в углу + copy-кнопка) и изображений (`<picture>` с AVIF/WebP).
- Sticky-TOC с активной секцией по scroll.
- Шорткоды: `callout` (note/tip/important/warn/danger), `refresh-banner`, `telegram-cta`, `thin-place`, `kbd`, `figure`, `audio`, `video`, `collapse`.
- Подсветка кода через Chroma с собственной палитрой (отдельные `chroma-light.css` / `chroma-dark.css`).
- Поиск через Fuse.js (опционально).
- Mermaid и MathJax/KaTeX — опт-ин через `params.math` / `params.mermaid` или фронтматтер.
- Категории с цветом из `data/category-colors.yaml`.
- Self-hosted шрифты из дизайн-системы (IBM Plex Sans + Iosevka), unicode-range сабсеты, `font-display: swap`, без Google Fonts.
- A11y: keyboard nav, focus-visible, ARIA-разметка, `prefers-reduced-motion`, контрасты ≥ AA.
- Производительность: главная без cover < 100 КБ gzip, Lighthouse mobile ≥ 95.
- Только Hugo Pipes, никаких сборщиков и `node_modules`.

## Требования

- Hugo Extended `>= 0.146.0`.

## Установка

Mishka работает и как git-submodule, и как Hugo Module — выбирайте удобный путь.

### Hugo Modules (рекомендуется)

В корне сайта инициализируйте модули, если ещё не:

```bash
hugo mod init github.com/<you>/<your-site>
```

Подключите тему:

```bash
hugo mod get github.com/jtprogru/hugo-mishka@latest
```

В `hugo.yaml`:

```yaml
module:
  imports:
    - path: github.com/jtprogru/hugo-mishka
```

Обновление:

```bash
hugo mod get -u github.com/jtprogru/hugo-mishka
hugo mod tidy
```

### Git submodule

```bash
git submodule add https://github.com/jtprogru/hugo-mishka themes/mishka
```

В `hugo.yaml`:

```yaml
theme: mishka
```

Обновление:

```bash
git submodule update --remote themes/mishka
```

## Конфигурация

Минимальный набор `params` в `hugo.yaml`:

```yaml
params:
  author: "Your Name"
  defaultTheme: auto         # auto | light | dark — стартовое значение тогглера
  ShowReadingTime: true
  ShowCodeCopyButtons: true
  ShowPostNavLinks: true
  ShowFooterNav: true        # средняя колонка футера с меню (menus.footer, иначе menus.main)
  math: false                # глобально; можно переопределить во фронтматтере: math: true
  mermaid: false             # то же

  profileMode:
    enabled: true
    title: "Заголовок"
    subtitle: "Подзаголовок (markdown)"
    imageUrl: "/avatar.jpg"
    imageHeight: 150
    imageWidth: 150
    latestPostsCount: 6      # сколько свежих постов показывать в сетке

  cover:
    hidden: false
    hiddenInList: false
    hiddenInSingle: false

  socialIcons:
    - name: github
      url: "https://github.com/<you>"
    - name: telegram
      url: "https://t.me/<you>"

  # Логотип в шапке. `iconDark` опционален: если задан, в разметку идут обе
  # картинки, а лишнюю прячет CSS по теме. Если нет — картинка одна на обе темы.
  label:
    text: "Название"        # по умолчанию site.Title
    icon: "/logo.svg"
    iconDark: "/logo-dark.svg"
    iconWidth: 25
    iconHeight: 32

  # Favicon'ы. К любой из трёх иконок можно добавить парную с суффиксом
  # `_dark` — тогда они разводятся по prefers-color-scheme.
  assets:
    favicon: "/favicon.svg"
    favicon_dark: "/favicon-dark.svg"
    favicon16x16: "/favicon-16.png"
    favicon16x16_dark: "/favicon-16-dark.png"
    favicon32x32: "/favicon-32.png"
    favicon32x32_dark: "/favicon-32-dark.png"
    apple_touch_icon: "/apple-touch-icon.png"
    safari_pinned_tab: "/mask-icon.svg"
    safari_pinned_tab_color: "#0b7285"

  # Related posts под статьёй (использует встроенный Hugo-механизм site.RegularPages.Related).
  # Конфигурация ранжирования — в верхнем `related:` блоке hugo.yaml.
  ShowRelatedPosts: true
  relatedMax: 4

  # Кнопки «Поделиться» под статьёй: Telegram, X (Twitter), LinkedIn, Email, copy-link.
  ShowShareButtons: false
  ShareButtons: [telegram, twitter, linkedin, email, copy]

  # Авторская приписка под текстом поста (подписка, закрытый проект, курс…).
  # Рендерится только на постах, per-page выкл — фронтматтер `endnote: false`.
  # postEndnote:
  #   enabled: true
  #   icon: "lock"                 # имя иконки из _partials/svg.html, опционально
  #   title: "Заголовок"           # опционально
  #   text: "Текст с **markdown**" # опционально
  #   url: "https://example.com/"  # обязателен, без него блок не рендерится
  #   linkText: "Что там"
  #   nofollow: true               # по умолчанию true для внешних ссылок
  #   note: "Ещё [ссылки](…)"      # вторая строка под чертой, тише основной

  # Ссылка «Редактировать пост» под статьёй (PaperMod-совместимая семантика).
  editPost:
    URL: "https://github.com/<you>/<your-site>/edit/main/content"
    Text: "Suggest changes"
    appendFilePath: true

  # Telegram-канал — выводится как <meta property="te:channel">.
  # Используется Telegram Instant View и при превью ссылок в Telegram.
  telegramChannel: "@your_channel"

  # Рендерер математики: "mathjax" (по умолчанию) или "katex".
  # KaTeX легче и быстрее, MathJax — полный TeX/MathML.
  # mathRenderer: "katex"

  # Короткий SHA коммита для футера (опционально). Можно подставлять
  # вручную или через ENV HUGO_COMMIT=$(git rev-parse --short HEAD) hugo.
  # commit: "abc1234"
  # commitURL: "https://github.com/<you>/<repo>/commit/%s"

  # AVIF в render-image (опт-ин). По умолчанию выключен, так как не все
  # сборки Hugo Extended корректно его кодируют. Включи и проверь, что
  # `.avif` файлы в public/ не пустые.
  # renderImageAvif: true
  # renderImageAvifQ: 60      # качество AVIF (1–100), 60 норм
  # renderImageWebpQ: 85      # качество WebP, 85 норм
  # renderImageMaxW:  1200    # max ширина после resize, px

  # PWA: manifest + service worker + offline-страница.
  # PWA:
  #   enabled: true
  #   manifestPath: "/manifest.json"
  #   themeColor: "#24273a"

  # RSS: полный текст постов + inline-CSS. По умолчанию on.
  # rssFullContent: true
  # rssLimit: 20
```

## Логотип и favicon по темам

Знак самой темы одноцветный и одинаково работает на светлом и на тёмном фоне, но свой логотип таким бывает не всегда: цветной знак на тёмном фоне тонет. Поэтому у логотипа и у favicon'ов есть парные варианты.

Логотип переключает CSS. Задай `params.label.iconDark` — в разметку пойдут обе картинки, а лишнюю спрячет правило по `data-theme`. Это сознательно не JS: шапка рисуется до того, как скрипты отработают, и подмена `src` по событию давала бы моргание не тем логотипом на каждой загрузке. Цена — оба файла грузятся. Для логотипа в пару килобайт это дешевле, чем `<picture>`; если файл заметно больше, это уже не логотип.

Favicon разводит `media="(prefers-color-scheme: …)"` прямо в `<head>` — чистый HTML, работает без скриптов. У него одно ограничение, зато существенное: media знает про системную схему, а не про переключатель в шапке. Поэтому когда читатель выбрал тему руками, ссылки переписывает `theme-toggle.js`, а в режиме `auto` возвращает управление media-запросу. Без JS иконка следует за системой — это разумный дефолт, а не поломка.

Пары независимы: можно задать `favicon_dark`, не задавая `favicon32x32_dark`. Иконка без пары выводится как раньше, без `media`. `apple-touch-icon` и `mask-icon` пар не имеют намеренно — iOS рисует иконку на своей плашке и media у неё не читает, а `mask-icon` одноцветный по устройству, цвет задаётся параметром `safari_pinned_tab_color`.

## Pinned posts

Поставь `pinned: true` во фронтматтере поста — он поднимется в начало `latest_posts` на главной и в `/posts/` (на текущей странице пагинации). В карточке появится `★`-badge и тонкая accent-полоска слева.

## Reading mode

Нажми `f` на странице любого поста — включится фокус-режим: скроет шапку, футер, share, related, toc, post-nav и cover, оставит только заголовок, мета и текст. Esc или повторное `f` — выйти. JS — ~30 строк, без зависимостей.

## PWA

Тема поставляется с готовым service worker'ом (`/sw.js`), offline-страницей и partial для регистрации SW + подключения manifest. Опт-ин через `params.PWA.enabled: true`. Manifest пользователь кладёт сам в `static/manifest.json` — пример в exampleSite. Стратегия SW: network-first для HTML, cache-first для статики, версия кэша регулируется константой `CACHE` в `assets/js/sw.js`.

### Данные проекта

- `data/projects.yaml` — список проектов для сетки на главной:

  ```yaml
  - name: my-tool
    url: https://github.com/user/my-tool
    desc: "Описание одной строкой."
    lang: Go
  ```

- `data/category-colors.yaml` (опционально) — цвета пилюль категорий:

  ```yaml
  OS:      "#0ea5e9"
  Tools:   "#22c55e"
  SRE:     "#ef4444"
  DevOps:  "#a855f7"
  ```

## Поиск

1. Добавь `JSON` в `outputs.home` в `hugo.yaml`:

   ```yaml
   outputs:
     home: [HTML, RSS, JSON]
   ```

2. Создай `content/search.md`:

   ```markdown
   ---
   title: "Поиск"
   layout: "search"
   url: "/search/"
   ---
   ```

3. По желанию — переопредели Fuse-настройки через `params.fuseOpts`:

   ```yaml
   params:
     fuseOpts:
       threshold: 0.35
       includeMatches: false
   ```

Fuse.js (v7, basic) подключается только на странице `/search/`.

## Telegram Instant View

Тема выставляет всё необходимое для Telegram, чтобы ссылки на твои посты получали кнопку «Просмотр» (Instant View) и красивое превью внутри Telegram:

- семантический `<article>` с `<h1 class="post__title">` и `<div class="post__content">`;
- `og:title` / `og:description` / `og:image` (+ `og:image:alt` / `width` / `height`, если заданы в `cover`);
- `article:published_time`, `article:modified_time`, `article:author`, `article:tag`, `article:section`;
- `te:channel` (если задан `params.telegramChannel`).

Чтобы IV-кнопка появилась под ссылками, нужен **Instant View Template** на стороне Telegram. Готовый стартовый template для этой темы лежит в [`docs/telegram-instant-view.iv`](./docs/telegram-instant-view.iv).

Процесс:

1. Открой [Instant View Editor](https://instantview.telegram.org/my).
2. Вставь URL любого своего поста.
3. В колонку «Template» скопируй содержимое `docs/telegram-instant-view.iv`.
4. Поправь правило `?path` под структуру своего сайта (если посты лежат не в `/posts/`).
5. Жми **Track Changes** → **Submit Template** — Telegram-команда ревьюит шаблоны, через несколько дней он начнёт работать для всех ссылок твоего домена.

Пока шаблон не одобрен, IV работает только в самом редакторе и в группах/каналах, где ты вручную включил его через `?` после ссылки.

## Шорткоды

```markdown
{{< callout type="note" title="Заголовок (опц.)" >}}
Текст с **markdown**.
{{< /callout >}}
```

Доступные `type`: `note`, `tip`, `important`, `warn`, `danger`.

Альтернатива — обычный markdown в GitHub-стиле (рендерит тот же `.callout` через `render-blockquote.html`):

```markdown
> [!NOTE]
> Содержимое заметки.

> [!TIP] Кастомный заголовок
> Если хочется свой заголовок, припишите его после типа.
```

Поддерживаемые типы alerts: `NOTE`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`. Дефолтные заголовки берутся из i18n-строк `alert_note`, `alert_tip`, `alert_important`, `alert_warning`, `alert_danger`.

Парные (с `.Inner`):

```markdown
{{< refresh-banner date="2026-05-23" >}}Что обновилось.{{< /refresh-banner >}}
{{< collapse summary="Показать детали" >}}…{{< /collapse >}}
{{< thin-place author="Кто-то" >}}Эпиграф.{{< /thin-place >}}
```

Одиночные:

```markdown
{{< kbd "Cmd+Shift+P" >}}
{{< telegram-cta channel="@your_channel" title="Подпишись" >}}
{{< figure src="/img/x.png" alt="…" caption="…" >}}
{{< audio src="/media/episode.mp3" caption="Эпизод 12" >}}
{{< video src="/media/demo.mp4" poster="/media/demo.jpg" >}}
```

Bidi-обёртки (для смешанных направлений в одном посте):

```markdown
{{< ltr >}}https://example.com/path{{< /ltr >}}
{{< rtl lang="ar" >}}مرحبا{{< /rtl >}}
```

Raw HTML — когда нужно вставить произвольный фрагмент без markdown-обработки:

```markdown
{{< rawhtml >}}
<div class="embed">…любой HTML…</div>
{{< /rawhtml >}}
```

Требует `markup.goldmark.renderer.unsafe: true` в `hugo.yaml`.

## Хуки для расширения

В проекте, использующем тему, эти partial-хуки подхватываются без оверрайда всего шаблона:

- `layouts/_partials/extend_head.html` — добавить своё в `<head>` (последним перед `</head>`).
- `layouts/_partials/extend_footer.html` — добавить своё перед `</body>` (после всех скриптов темы).
- `layouts/_partials/extend_post_content.html` — вставить блок сразу после статьи (и related-posts), внутри контейнера single-страницы.
- `layouts/_partials/comments.html` — переопределить блок комментариев. По умолчанию в теме пустой stub; включается через `params.ShowComments: true` (глобально) или `comments: true` во фронтматтере (выключается `comments: false`). Тема не привязана ни к одной комментарной системе — вставь в этот файл свою (Giscus / Disqus / commento / самописное).

Пример переопределения в проекте:

```html
{{- /* layouts/_partials/comments.html — пример Giscus */ -}}
{{- if .IsPage -}}
<section class="comments" aria-label="{{ i18n "comments_label" }}">
  <script src="https://giscus.app/client.js"
          data-repo="user/repo"
          data-mapping="pathname"
          data-theme="preferred_color_scheme"
          crossorigin="anonymous" async></script>
</section>
{{- end -}}
```

## Архитектура

- `layouts/baseof.html` — каркас (doctype, head, body, header/main/footer).
- `layouts/{home,list,single,404,search,taxonomy,term}.html` — страницы.
- `layouts/_partials/` — header, footer, profile, projects, latest_posts, post_card, toc, breadcrumbs, ...
- `layouts/_shortcodes/` — все шорткоды темы.
- `layouts/_default/_markup/` — render-hooks для codeblock, image, link, mermaid.
- `assets/css/vendor/mishka-ds/` — цвет, типографика, каркас, компоненты и обвязка сайта из дизайн-системы (см. ниже). В теме не правится.
- `assets/css/modules/09-toc.css … 34-reading-mode.css` — то, чего в системе нет: TOC, поиск, chroma, формулы, архив, 404, действия над постом, перевод, режим чтения.
- `assets/css/modules/12-chroma.css` — палитра подсветки кода: catppuccin-latte для light, catppuccin-macchiato для dark, оба профиля в одном файле под префиксами `:root[data-theme="..."]`.
- `assets/js/` — `theme-toggle.js`, `code-copy.js`, `toc-active.js`, `search.js` + `vendor/fuse.basic.min.js`.
- SVG-иконки — встроены в `_partials/svg.html` (path-карта по именам).
- `static/fonts/{ibm-plex-sans,iosevka}/` — self-hosted шрифты системы, unicode-range сабсеты (latin, latin-ext, cyrillic, cyrillic-ext; у моноширинного latin-ext нет).
- `i18n/{ru,en}.yaml` — строки интерфейса.

## Дизайн-система

Цвет, шрифты, ритм и компоненты приезжают из [`@jtprogru/mishka-ds`](https://github.com/jtprogru/mishka-ds) — одного источника для блога, резюме, презентаций и схем. Раньше всё это жило в теме копией, и копии расходились.

Тема не собирается npm'ом: hugo-модуль должен ставиться одной строкой, без `node_modules` и submodule'ов. Поэтому собранные слои системы лежат в репозитории вендорной копией в `assets/css/vendor/mishka-ds/`, а обновляет её скрипт:

```bash
./scripts/sync-ds.sh [путь-к-mishka-ds]   # по умолчанию ../mishka-ds
```

Скрипту нужен собранный пакет: `dist/` у системы под `.gitignore`, поэтому сначала `make build` в её каталоге. Версия и коммит источника пишутся в `assets/css/vendor/mishka-ds/VERSION`.

Вендорные файлы в теме не правятся никогда. Нашлась проблема в стилях — правится `src/styles/*` в пакете и делается пересинхронизация, иначе копия снова разойдётся.

Из пакета берутся `tokens.css`, `fonts.css`, `base.css`, `components-shell.css`, `components.css`, `print-web.css` и конфиги mermaid. Не берутся `themes-scoped.css` (тема переключается только через `data-theme` на `<html>`), `compat.css` (локальные модули переведены на канонические имена токенов), `print-sheet.css` (лист A4 и визитка), `code.css` (у нас Chroma, не highlight.js) и `brand/*`.

## Лицензия

PolyForm Noncommercial 1.0.0 — см. [LICENSE](./LICENSE). До перехода на дизайн-систему тема была под MIT; выпущенные тогда теги под MIT и остаются. Шрифты в `static/fonts/` — чужие, SIL OFL 1.1, тексты лицензий лежат рядом с ними.
