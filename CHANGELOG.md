# Changelog

Все заметные изменения в `hugo-mishka` фиксируются здесь.
Формат — [Keep a Changelog](https://keepachangelog.com/ru/1.1.0/), версии — [Semantic Versioning](https://semver.org/lang/ru/).

## [Unreleased]

### Added

- Projects: отдельная страница `/projects/` и опциональный блок «Мои проекты» на главной. Новый layout `layouts/projects.html` — полная сетка из `data/projects.yaml` с группировкой по `status` (`active` / `maintenance` / `archived`) и фильтром по языку (чипы + inline-JS, скрывает пустые группы). Партиал `_partials/projects.html` для главной респектит лимит и сортирует `featured` → `active` → остальное, рисует ссылку «Все проекты →». Карточка вынесена в `_partials/proj_card.html` и переиспользуется обоими местами; новые модификаторы `.proj-card--featured` (accent-полоска слева), `.proj-card--archived` (приглушённая), `.proj-card__badge--{featured,maintenance,archived}`. Конфиг блока на главной — `params.homeSections.projects.{enabled,featuredOnly,limit,moreLink}`: `enabled` (дефолт `true`) включает блок, `featuredOnly: true` показывает только `featured: true` (иначе featured→active→остальное), `limit` (дефолт 6) — потолок карточек, `moreLink` — ссылка под сеткой. Расширенная schema yaml: `status`, `featured: true`, `tags: [...]` (все опциональны, обратно-совместимо). i18n-строки `projects_*` (ru/en) с плюрализацией для счётчика. exampleSite дополнен `content/projects.md` и конфигом.
- RSS full-text: свой `layouts/index.rss.xml` отдаёт `.Content` целиком вместо `.Summary`, с inline-CSS (типографика, code, blockquote, картинки), `<dc:creator>`, `<media:thumbnail>` для cover, `<category>` из тегов и категорий, `<content:encoded>` в CDATA. Опции: `params.rssFullContent` (по умолчанию true) — false возвращает дефолтное поведение, `params.rssLimit` (по умолчанию 20).
- PWA (manifest + service worker + offline): `assets/js/sw.js` с network-first для HTML и cache-first для статики, `layouts/offline.html` страница-fallback, partial `_partials/pwa_register.html` — регистрация SW и подключение manifest. Опт-ин через `params.PWA.enabled: true` + `params.PWA.manifestPath` + `params.PWA.themeColor`. Manifest пользователь кладёт в `static/manifest.json` (пример в exampleSite). SW отдаётся по стабильному `/sw.js` без minify/fingerprint, чтобы scope `'/'` не ломался между релизами. i18n `offline_*` (ru/en).
- High-contrast палитра: `@media (prefers-contrast: more)` в `00-vars.css` для обеих тем — чистый чёрный/белый, усиленные границы, без полупрозрачности. Срабатывает автоматически у пользователей с системной настройкой high-contrast.
- Pinned posts: фронтматтер `pinned: true` поднимает пост наверх в `latest_posts` на главной и в `list.html` (на текущей странице пагинации). Карточки получают `.post-card--pinned` (тонкая accent-полоска слева) и `★`-badge в заголовке. CSS `.badge` / `.badge--pinned` в `15-tags.css`. i18n `pinned` (ru/en).
- Reading mode: клавиша `f` переключает body-класс `is-reading-mode`, скрывающий header/footer/share/related/edit/toc/cover/nav. Esc выходит. `assets/js/reading-mode.js` (~30 строк) + CSS `34-reading-mode.css`. Подсказка `f / esc` появляется в углу при hover. Активируется только на single-страницах поста.
- AVIF в render-image: render-hook теперь умеет генерировать `<source type="image/avif">` как первый источник в `<picture>`, перед WebP и оригинальным JPG/PNG. Опт-ин через `params.renderImageAvif: true` (по умолчанию off — Hugo Extended на некоторых платформах кодирует AVIF в 0-байтные файлы). Качество и max-width настраиваются: `renderImageAvifQ` (60), `renderImageWebpQ` (85), `renderImageMaxW` (1200).
- Шорткоды `audio`, `video`, `rawhtml`, `ltr`, `rtl`. `audio`/`video` оборачивают HTML5-плееры в `<figure class="media">` с подписью; поддержка нескольких форматов через `sources="mp3,ogg"` или `sources="mp4,webm"`. `rawhtml` — passthrough `safeHTML`. `ltr`/`rtl` — обёртки `<div dir="...">` с `lang`. CSS `.media` в `08-post-single.css`; i18n `audio_unsupported` / `video_unsupported` (ru/en). Демо: `exampleSite/content/posts/all-shortcodes.md`.
- Footer git-commit info: `footer_copyright.html` опционально выводит короткий SHA текущей сборки. Источник: ENV `HUGO_COMMIT` (приоритет, в whitelist Hugo по умолчанию) или `params.commit`. Если задан `params.commitURL` (printf-шаблон с `%s`) — SHA становится ссылкой. CSS-стили в `05-footer.css`. i18n `footer_commit_title` (ru/en).
- Comments hook: партиал `_partials/comments.html` — пустой stub по умолчанию. Опт-ин через `params.ShowComments: true` или frontmatter `comments: true`. Тема не привязана к комментарной системе — переопредели partial в проекте под Giscus/Disqus/commento. i18n `comments_label` (ru/en). README дополнен примером переопределения и описанием всех extend-хуков (`extend_head`, `extend_footer`, `extend_post_content`, `comments`).
- OpenGraph и Twitter cards вынесены в отдельные partials темы (`_partials/opengraph.html`, `_partials/twitter_cards.html`). Проект может переопределить любой из них. Фиксы поверх builtin: `og:locale` в формате `ll_CC` (например `ru_RU` вместо `ru`), `og:image:alt` / `og:image:width` / `og:image:height` из `cover`, `article:author`, динамический `twitter:card` (`summary_large_image` при наличии cover).
- Archives page: `layouts/archives.html` + CSS-модуль `19-archive.css`. Подключается через `layout: "archives"` на контентной странице. Группирует посты из `mainSections` по году; на десктопе год прилипает слева sticky, посты идут справа. Поддержка i18n-плюрализации (`archives_total`). Демо: `exampleSite/content/archives.md`.
- Шесть новых CSS-модулей: `13-kbd.css`, `14-footnotes.css`, `15-tags.css`, `20-404.css`, `90-utilities.css` (с `.visually-hidden` и базовыми утилитами), `95-print.css` (печатные стили — скрывает интерактив, разворачивает контент во всю ширину, добавляет URL ссылок после текста). Существующие правила вынесены из `07-post-card.css`, `08-post-single.css`, `10-callouts.css`, `31-share.css` без визуальных изменений.
- 404-страница перерисована: `not-found__code` (крупный «404»), заголовок и текст из i18n, кнопки «Главная» / «Поиск». Без `style=""` в HTML.
- KaTeX как альтернативный рендерер математики. `_partials/math.html` стал диспетчером, вызывающим `_partials/mathjax.html` или `_partials/katex.html` по `params.mathRenderer` ("mathjax" | "katex"). По умолчанию — `mathjax` (без breaking change). KaTeX подключается с jsDelivr (CSS + JS + contrib/auto-render) с возможностью переопределить версию (`params.katexVersion`) или адреса (`params.katex{Css,Js,AutoRender}Src`).
- Translation list: партиал `_partials/translation_list.html` + CSS-модуль `33-translation.css`. Показывает ссылки на переводы текущей страницы (из `.Translations`), если они есть — для моноязычных сайтов ничего не рендерит. Интегрирован в шапку single. i18n-строка `translations_label` (ru/en).
- Telegram Instant View support: новые мета-теги в `head_meta.html` — `article:author`, `og:image:alt` / `og:image:width` / `og:image:height` (если заданы в `cover`), и опциональный `te:channel` (из `params.telegramChannel`). Стартовый IV-template для Telegram IV Editor лежит в `docs/telegram-instant-view.iv` — копируется в редактор и адаптируется под путь постов сайта. В README добавлен раздел «Telegram Instant View» с инструкцией.
- GFM-style alerts в markdown: `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, `> [!CAUTION]` рендерятся через `layouts/_default/_markup/render-blockquote.html` в тот же стиль `.callout`, что и shortcode `{{< callout >}}`. Опциональный кастомный заголовок: `> [!TIP] My title`. Дефолтные заголовки локализованы (i18n `alert_*`).
- Новый тип callout `important` (акцентный цвет темы) + иконка `zap` в `_partials/svg.html`. Доступен и через shortcode (`type="important"`), и через GFM-alert (`> [!IMPORTANT]`).
- Related posts: партиал `_partials/related.html` + CSS-модуль `30-related.css`. Использует встроенный Hugo-механизм `site.RegularPages.Related` поверх `related:` конфига сайта. Опции: `params.ShowRelatedPosts` (по умолчанию `true`), `params.relatedMax` (по умолчанию `4`), per-page переопределение через frontmatter `related: false`.
- Share buttons: партиал `_partials/post_share.html` + CSS `31-share.css`. Каналы: Telegram, X (Twitter), LinkedIn, Email, copy-link. Опт-ин через `params.ShowShareButtons`, выбор каналов — `params.ShareButtons`, per-page выкл — `share: false`. Copy-link использует общий clipboard-handler из `code-copy.js`. i18n-строки `share_*` (ru/en) и `data-share-copy-done` на `<html>`.
- Edit-on link: партиал `_partials/edit_post.html` + CSS `32-edit-post.css`. Конфиг через `params.editPost.{URL, Text, appendFilePath}` в духе PaperMod. Per-page override через `editPostURL`, выкл через `editPost: false`.
- SVG-иконки `mail`, `share`, `edit`, `link` в `_partials/svg.html`.

### Changed

- Single-страница больше не ограничена `main--narrow` (узкая колонка `--content-width`) — пост рендерится во всю ширину `.container` (как шапка сайта).
- TOC растягивается на полную ширину контейнера — раньше на десктопе принудительно ограничивался `--content-width` (720px), что после расширения single-страницы выглядело обрезанным.
- Share-блок теперь icon-only: круглые 40×40 кнопки без подписи каналов, `title` и `aria-label` остались. Copy-кнопка хранит обновляемую sr-only-строку для скринридеров через `.visually-hidden`.
- Edit-link перенесён из подвала поста в шапку — рядом с `post_meta`. На десктопе выровнен справа от мета-строки, на мобиле — на новой строке.
- `.Description` больше не рендерится в шапке single-страницы — она остаётся только в `<meta name="description">`, `og:description`, `twitter:description`. Хабит — единый источник правды для SEO/OG, без визуального дублирования.

### Fixed

- `svg.html`: корректная обработка вызовов без `label` — раньше из-за `printf "%q"` на `nil` в HTML попадал мусор вида `aria-label=%!q(<nil>)`.

## [0.1.0] — 2026-05-23

Первый публичный релиз.

### Added

- Каркас темы: `baseof`, `home`, `list`, `single`, `404`, `search`, `taxonomy`, `term`.
- Mobile-first вёрстка от 320px до широких десктопов, type scale 1.250.
- Дизайн-система через CSS-переменные: тёплая «бумажная» палитра, ржавый акцент, переменные размеров/отступов/радиусов в `modules/00-vars.css`.
- Светлая/тёмная тема: авто по `prefers-color-scheme` + 3-state-тогглер `auto/light/dark` с `localStorage` и anti-FOUC (inline `<script>` до CSS).
- Главная: `profile-mode` с аватаром, hero-блоком, сеткой проектов из `data/projects.yaml`, сеткой свежих постов.
- Render-hooks:
  - `render-codeblock.html` — обёртка с лэйблом языка и кнопкой «копировать».
  - `render-codeblock-mermaid.html` — превращает блок с языком `mermaid` в `<pre class="mermaid">` и помечает страницу для подгрузки библиотеки.
  - `render-image.html` — `<picture>` с WebP, lazy-loading, явные `width`/`height` из page-bundle resource.
  - `render-link.html` — external-ссылкам `rel="noopener noreferrer" target="_blank"`.
- Подсветка кода — chroma, цвета сгенерены из `catppuccin-latte` / `catppuccin-mocha`, переключаются через `:root[data-theme="..."]`.
- TOC: рендерится автоматически для постов (Page.Type == "post" или Section ∈ mainSections), на «обычных» страницах выключен. Управление per-page через `toc: true|false`, глобально — `params.ShowToc`. Sticky на десктопе, collapsible по умолчанию, scroll-spy через IntersectionObserver.
- Шорткоды: `callout` (note/tip/warn/danger), `kbd`, `collapse`, `refresh-banner`, `telegram-cta`, `thin-place`, `figure`.
- Cover-картинки: поддержка page-bundle resource, относительных и абсолютных путей; `cover.relative: true|false` по PaperMod-семантике. Caption обрабатывается через `RenderString` — markdown внутри подписи работает.
- Карточки списка постов — `position: relative` + stretched-link, на десктопе cover слева.
- Таксономии: `/tags/`, `/categories/` — облако с счётчиками постов; одна страница тега/категории — список постов и пагинация. Поддержка `data/category_colors.yaml` для покраски пилюль категорий.
- Поиск: `/index.json` + `layouts/search.html` + Fuse.js (basic, v7) + ленивая загрузка только на странице `/search/`. Поддержка `?q=...` в URL.
- Mermaid: опт-ин — диаграмма на странице или `params.mermaid: true`. Тема Mermaid синхронизируется со светлой/тёмной темой сайта.
- MathJax 4: опт-ин через `params.math: true` (per-page или глобально), CDN.
- Трёхколоночный footer: copyright/nav/social, стек на мобиле. Партиалы `footer_copyright`, `footer_nav`, `footer_social` — для оверрайдов в проекте.
- i18n: `ru`, `en` (строки заголовков, тогглера, TOC, поиска, footer'а).
- Хуки расширения: `extend_head`, `extend_footer`, `extend_post_content` — пустые, можно переопределить в проекте.
- Поддержка установки и как git-submodule, и как Hugo Module (`go.mod` в корне темы).
- README с обоими сценариями установки + минимальным конфигом.

### Build

- Hugo Extended `>= 0.146.0` (используется новый layout v0.146+ с `_partials`/`_shortcodes`/`_markup`).
- Без сборщиков (нет `node_modules`), только Hugo Pipes (`resources.Match`/`Concat`/`Minify`/`Fingerprint`).

[Unreleased]: https://github.com/jtprogru/hugo-mishka/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/jtprogru/hugo-mishka/releases/tag/v0.1.0
