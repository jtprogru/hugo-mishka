# Mishka

Самостоятельная Hugo-тема для [jtprog.ru](https://jtprog.ru) — без зависимостей от других тем, с акцентом на читаемость длинных технических постов, mobile-first вёрстку и оригинальный дизайн.

> **Статус:** в разработке, до релиза `v0.1.0`. API params и набор шорткодов могут меняться без депрекейшена.

## Особенности

- Mobile-first вёрстка, отзывчивая от 320px до широких десктопов.
- Светлая / тёмная тема: авто по `prefers-color-scheme` + ручной 3-state-тогглер (`auto / light / dark`), сохраняется в `localStorage`, без FOUC.
- Тёплая «бумажная» палитра со ржаво-оранжевым акцентом — не клон серого PaperMod.
- Type scale 1.250 (Major Third), читаемая колонка 720px для постов, межстрочный 1.65.
- Главная: profile-hero + сетка проектов из `data/projects.yaml` + сетка свежих постов с превью.
- Render-hooks для codeblock (язык в углу + copy-кнопка) и изображений (`<picture>` с AVIF/WebP).
- Sticky-TOC с активной секцией по scroll.
- Шорткоды: `callout` (note/tip/warn/danger), `refresh-banner`, `telegram-cta`, `thin-place`, `kbd`, `figure`, `audio`, `video`, `collapse`.
- Подсветка кода через Chroma с собственной палитрой (отдельные `chroma-light.css` / `chroma-dark.css`).
- Поиск через Fuse.js (опционально).
- Mermaid и MathJax/KaTeX — опт-ин через `params.math` / `params.mermaid` или фронтматтер.
- Категории с цветом из `data/category-colors.yaml`.
- Self-hosted шрифты (Inter + JetBrains Mono), `font-display: swap`, без Google Fonts.
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

  # Related posts под статьёй (использует встроенный Hugo-механизм site.RegularPages.Related).
  # Конфигурация ранжирования — в верхнем `related:` блоке hugo.yaml.
  ShowRelatedPosts: true
  relatedMax: 4

  # Кнопки «Поделиться» под статьёй: Telegram, X (Twitter), LinkedIn, Email, copy-link.
  ShowShareButtons: false
  ShareButtons: [telegram, twitter, linkedin, email, copy]

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
```

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
```

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
- `assets/css/main.css` + `modules/00-vars.css … 99-a11y.css` — модульный CSS, склеивается через Hugo Pipes (`resources.Match css/modules/*.css | resources.Concat`).
- `assets/css/modules/12-chroma.css` — палитра подсветки кода (catppuccin-latte для light, catppuccin-mocha для dark), префиксы `:root[data-theme="..."]`.
- `assets/js/` — `theme-toggle.js`, `code-copy.js`, `toc-active.js`, `search.js` + `vendor/fuse.basic.min.js`.
- SVG-иконки — встроены в `_partials/svg.html` (path-карта по именам).
- `static/fonts/` — self-hosted Inter + JetBrains Mono.
- `i18n/{ru,en}.yaml` — строки интерфейса.

## Лицензия

MIT — см. [LICENSE](./LICENSE).
